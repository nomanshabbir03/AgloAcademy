// src/utils/auth.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';

// Register a new user
export const register = async ({ email, password, name, role = 'student' }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseSendEmailVerification(userCredential.user);
    return { 
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        role
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Check auth status
export const checkAuthStatus = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      });
    } else {
      callback(null);
    }
  });
};

// Send email verification
export const sendEmailVerification = async () => {
  if (!auth.currentUser) {
    throw new Error('No authenticated user');
  }
  await firebaseSendEmailVerification(auth.currentUser);
  return { success: true };
};

// Get current user
export const getCurrentUser = () => {
  const user = auth.currentUser;
  return user ? {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified
  } : null;
};