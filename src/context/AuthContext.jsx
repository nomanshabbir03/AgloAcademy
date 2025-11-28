import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  loginRequest,
  registerRequest,
  meRequest,
  updateProfileRequest,
  updatePasswordRequest,
} from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user from token on initial mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await meRequest();
        setUser(me);
      } catch (err) {
        console.error('Failed to load current user:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const data = await loginRequest(credentials);
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      // Prefer the profile from /me to include enrolledCourses
      try {
        const me = await meRequest();
        setUser(me);
      } catch {
        // Fallback to user object from login response
        if (data.user) {
          setUser(data.user);
        }
      }
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 401
          ? 'Invalid email or password'
          : 'Login failed. Please try again.');
      setError(message);
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const data = await registerRequest(userData);

      // Requirement: either auto-login or redirect to login.
      // We keep existing UI behavior (redirect to login) and do not
      // automatically log the user in here.
      if (data?.token) {
        // Token is available if you want to change behavior later.
      }

      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        (status === 409
          ? 'An account with this email already exists'
          : 'Registration failed. Please try again.');
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const me = await meRequest();
      setUser(me);
      return { success: true };
    } catch (err) {
      console.error('Refresh profile error:', err);
      return { success: false };
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = await updateProfileRequest(profileData);
      // Backend returns the updated user shape; keep AuthContext user in sync
      setUser(updatedUser);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      const message =
        err?.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const data = await updatePasswordRequest({ currentPassword, newPassword });
      const message = data?.message || 'Password updated successfully';
      setError(null);
      return { success: true, message };
    } catch (err) {
      console.error('Update password error:', err);
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        (status === 401
          ? 'Current password is incorrect'
          : 'Failed to update password. Please try again.');
      setError(message);
      return { success: false, message };
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      updatePassword,
    }),
    [user, loading, error, login, register, logout, refreshProfile, updateProfile, updatePassword]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
