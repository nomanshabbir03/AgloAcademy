import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * ✅ Middleware: Protect routes by verifying JWT token
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

/**
 * ✅ Middleware: Role-based access control
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

/**
 * ✅ Middleware: Role-specific shortcut (optional)
 */
export const roleMiddleware = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: `Only ${role} can access this route`,
    });
  }
  next();
};

/**
 * ✅ Middleware: Check email verification
 */
export const checkEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email to access this resource',
        requiresVerification: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
