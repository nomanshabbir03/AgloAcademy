import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/authController.js';
import { updateProfile, updatePassword } from '../controllers/userController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (student by default)
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   PATCH /api/auth/profile
// @desc    Update current user's name/email
// @access  Private
router.patch('/profile', protect, updateProfile);

// @route   PATCH /api/auth/password
// @desc    Update current user's password
// @access  Private
router.patch('/password', protect, updatePassword);

export default router;
