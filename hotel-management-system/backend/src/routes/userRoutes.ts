import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// User profile routes
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Restrict all routes after this middleware to admin only
router.use(restrictTo('admin'));

// User management routes (admin only)
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
