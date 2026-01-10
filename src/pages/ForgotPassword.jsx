// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OTPVerification from '../components/OTPVerification';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setOtpId(response.data.otpId);
      setStep(2);
      showToast('OTP has been sent to your email', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setOtpId(response.data.otpId);
      return Promise.resolve();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to resend OTP', 'error');
      return Promise.reject(error);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      await api.post('/auth/verify-otp', { 
        email, 
        otp,
        otpId,
        purpose: 'password-reset'
      });
      setStep(3);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { 
        email, 
        otpId,
        newPassword: password 
      });
      
      showToast('Password has been reset successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <OTPVerification
      email={email}
      onVerify={handleVerifyOTP}
      onResend={handleResendOTP}
      purpose="password-reset"
      onBack={() => setStep(1)}
      loading={loading}
    />
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please create a new password for your account.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to OTP verification
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default ForgotPassword;
