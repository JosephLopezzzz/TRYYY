import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Password reset routes
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Update password for logged-in users
router.patch('/updateMyPassword', authController.updatePassword);

export default router;
