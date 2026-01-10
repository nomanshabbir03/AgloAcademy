import { verifyIdToken } from '../config/firebase-admin.js';
import User from '../models/User.js';

export const verifyFirebaseToken = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // Verify Firebase ID token
    const { success, uid, email, emailVerified, message } = await verifyIdToken(token);
    
    if (!success) {
      return res.status(401).json({ 
        success: false,
        message: message || 'Not authorized, invalid token' 
      });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found. Please sign up first.' 
      });
    }

    // Update email verification status if changed
    if (user.isEmailVerified !== emailVerified) {
      user.isEmailVerified = emailVerified;
      await user.save();
    }

    // Check if email is verified
    if (!emailVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email address to continue',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Attach user to request object
    req.user = user;
    req.firebaseUid = uid;
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token verification failed' 
    });
  }
};

export const checkEmailVerification = (req, res, next) => {
  if (!req.user || !req.user.isEmailVerified) {
    return res.status(403).json({ 
      success: false,
      message: 'Please verify your email address to access this resource',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      message: 'Forbidden: insufficient permissions' 
    });
  }
  next();
};
