import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  login as firebaseLogin,
  register as firebaseRegister,
  logout as firebaseLogout,
  checkAuthStatus,
  sendEmailVerification,
} from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const navigate = useNavigate();

  // ✅ AUTH STATE CHECK (merged + safe timeout)
  useEffect(() => {
    console.log('🔐 Initial auth check started');

    const unsubscribe = checkAuthStatus((authUser) => {
      console.log('🔄 Auth state changed:', authUser);

      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          role: authUser.role, // optional (if available)
        });
      } else {
        setUser(null);
      }

      if (!initialized) {
        console.log('✅ Auth initialized');
        setInitialized(true);
        setLoading(false);
      }
    });

    // 🛑 Safety timeout to avoid infinite loading
    const timeoutId = setTimeout(() => {
      if (!initialized) {
        console.warn('⚠️ Auth initialization timed out, proceeding anyway');
        setInitialized(true);
        setLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initialized]);

  // ✅ LOGIN
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const user = await firebaseLogin(email, password);
      setUser({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ REGISTER
  const register = useCallback(
    async ({ name, email, password, role = 'student' }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await firebaseRegister({
          name,
          email,
          password,
          role,
        });

        setUser({
          uid: result.user.uid,
          email: result.user.email,
          emailVerified: result.user.emailVerified,
          role,
        });

        return { success: true };
      } catch (error) {
        console.error('❌ Registration error:', error);
        setError(error.message || 'Registration failed');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError(error.message || 'Failed to log out');
    }
  }, [navigate]);

  // ✅ SEND EMAIL VERIFICATION
  const sendVerificationEmail = useCallback(async () => {
    try {
      await sendEmailVerification();
      return { success: true };
    } catch (error) {
      console.error('❌ Email verification error:', error);
      setError(error.message || 'Failed to send verification email');
      return { success: false, error: error.message };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified,
    login,
    register,
    logout,
    sendVerificationEmail,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && initialized ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// ✅ HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ PROTECTED ROUTE
export const ProtectedRoute = ({
  children,
  requireEmailVerification = false,
}) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// ✅ ADMIN ROUTE
export const AdminRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
