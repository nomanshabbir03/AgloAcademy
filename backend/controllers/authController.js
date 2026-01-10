// backend/controllers/authController.js

import { adminAuth } from '../config/firebase-admin.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Allowed email domains
const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com'];

// Check if email domain is allowed
const isEmailDomainAllowed = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
};

// Check email verification
const checkEmailVerification = async (req, res) => {
  // ... existing implementation ...
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  // ... existing implementation ...
};

// Register user
const registerUser = async (req, res) => {
  // ... existing implementation ...
};

// Login user
const loginUser = async (req, res) => {
  // ... existing implementation ...
};

// Get current user
const getCurrentUser = async (req, res) => {
  // ... existing implementation ...
};

export {
  checkEmailVerification,
  resendVerificationEmail,
  registerUser,
  loginUser,
  getCurrentUser
};