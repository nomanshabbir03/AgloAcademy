// backend/routes/auth.js
import express from 'express';
const router = express.Router();

import { 
  registerUser,
  loginUser,
  getCurrentUser,
  checkEmailVerification,
  resendVerificationEmail
} from '../controllers/authController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// -----------------
// Public routes
// -----------------
router.post('/register', registerUser);
router.post('/login', loginUser);

// -----------------
// Protected routes
// -----------------
router.get('/me', protect, getCurrentUser);
router.get('/check-verification', protect, checkEmailVerification);
router.post('/resend-verification', protect, resendVerificationEmail);

export default router;
