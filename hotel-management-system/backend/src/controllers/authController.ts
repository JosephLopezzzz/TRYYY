import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { createAndSendToken } from '../middleware/auth';

const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + 
      parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS || '30') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  // Remove password from output
  user.password = undefined as unknown as string;

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, passwordConfirm, firstName, lastName, phoneNumber, roleId } = req.body;

    // 1) Check if passwords match
    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [User.Sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return next(new AppError('User with this email or username already exists', 400));
    }

    // 3) Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4) Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      roleId: roleId || 2, // Default to 'user' role
    });

    // 5) Generate token and send response
    createSendToken(newUser, 201, res);
  } catch (error) {
    logger.error('Signup error:', error);
    next(new AppError('Error creating user account', 500));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }],
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    next(new AppError('Error logging in', 500));
  }
};

export const logout = (_req: Request, res: Response) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.id, {
      include: [{ model: Role }],
    });
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.id)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Authorization: Grant permission to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // roles ['admin', 'manager']. role='user'
    if (!roles.includes(req.user?.role?.name || '')) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get user from collection
    const user = await User.findByPk(req.user?.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
