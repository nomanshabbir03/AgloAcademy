import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { updateProfile, updatePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, updatePassword);

export default router;
