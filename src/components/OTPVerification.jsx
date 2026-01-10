// src/components/OTPVerification.jsx
import { useState, useEffect } from 'react';
import OTPInput from './OTPInput';
import { useToast } from '../context/ToastContext';

const OTPVerification = ({ 
  email, 
  onVerify, 
  onResend, 
  purpose = 'verification',
  onBack,
  loading = false
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Start countdown when component mounts
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    try {
      await onResend();
      setCountdown(60);
      setIsResendDisabled(true);
      showToast('OTP has been resent', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to resend OTP', 'error');
    }
  };

  const handleComplete = (otpValue) => {
    setOtp(otpValue);
    onVerify(otpValue);
  };

  const displayEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const hiddenPart = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${hiddenPart}@${domain}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {purpose === 'password-reset' ? 'Reset Your Password' : 'Verify Your Email'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit verification code to {displayEmail(email)}
        </p>
      </div>

      <div className="mt-6">
        <OTPInput 
          onComplete={handleComplete} 
          disabled={loading}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled || loading}
            className={`font-medium ${
              isResendDisabled ? 'text-gray-400' : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            {isResendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </p>
      </div>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            disabled={loading}
          >
            Back to previous step
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;