import { Request, Response, NextFunction } from 'express';
import { User, Role } from '../models';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role }],
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(new AppError('Error fetching users', 500));
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Error fetching user:', error);
    next(new AppError('Error fetching user', 500));
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, passwordConfirm, firstName, lastName, phoneNumber, roleId } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    const newUser = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      roleId: roleId || 2, // Default to 'user' role
    });

    // Remove password from output
    newUser.password = undefined as unknown as string;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new AppError('Email or username already in use', 400));
    }
    logger.error('Error creating user:', error);
    next(new AppError('Error creating user', 500));
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'username',
      'email',
      'firstName',
      'lastName',
      'phoneNumber',
      'isActive',
      'roleId'
    );

    // 3) Update user document
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    await user.update(filteredBody);

    // Remove password from output
    user.password = undefined as unknown as string;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    next(new AppError('Error updating user', 500));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Prevent deleting the last admin
    if (user.roleId === 1) { // Assuming 1 is the admin role ID
      const adminCount = await User.count({ where: { roleId: 1 } });
      if (adminCount <= 1) {
        return next(
          new AppError('Cannot delete the last admin user', 400)
        );
      }
    }

    await user.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    next(new AppError('Error deleting user', 500));
  }
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user?.id.toString();
  next();
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'firstName',
      'lastName',
      'email',
      'phoneNumber'
    );

    // 3) Update user document
    const updatedUser = await User.update(filteredBody, {
      where: { id: req.user?.id },
      returning: true,
      individualHooks: true,
    });

    const user = updatedUser[1][0];
    
    // Remove password from output
    user.password = undefined as unknown as string;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    next(new AppError('Error updating user profile', 500));
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.update(
      { active: false },
      {
        where: { id: req.user?.id },
      }
    );

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    logger.error('Error deactivating account:', error);
    next(new AppError('Error deactivating account', 500));
  }
};
