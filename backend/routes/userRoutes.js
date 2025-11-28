import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateProfile, updatePassword } from '../controllers/userController.js';

const router = express.Router();

router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, updatePassword);

export default router;
