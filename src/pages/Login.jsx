import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { auth } from '../firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import ShootingStars from '../components/ShootingStars';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailLink, setIsEmailLink] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');

  const { login, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle email link sign-in
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');

      if (email) {
        // User clicked the link on the same device
        handleEmailLinkSignIn(email);
      } else {
        // User opened the link on a different device
        setIsEmailLink(true);
      }
    }
  }, []);

  const handleEmailLinkSignIn = async (email) => {
    try {
      setLoading(true);

      // Complete the sign-in
      await signInWithEmailLink(auth, email, window.location.href);

      // Clear the email from localStorage
      window.localStorage.removeItem('emailForSignIn');

      // Update the user's email verification status in your backend
      const result = await login({ email, password: '' }, true);

      if (result.success) {
        if (result.user?.emailVerified === false) {
          showToast('Please verify your email to continue.', 'info');
          navigate('/verify-email', { replace: true });
          return;
        }

        showToast('Login successful!', 'success');
        navigate(from, { replace: true });
      }
      else {
        showToast(result.message || 'Failed to verify email', 'error');
      }
    } catch (error) {
      console.error('Email link sign-in error:', error);
      showToast('Invalid or expired verification link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const result = await resendVerificationEmail(formData.email);

      if (result.success) {
        setVerificationSent(true);
        showToast('Verification email sent. Please check your inbox.', 'success');
      } else {
        showToast(result.message || 'Failed to send verification email', 'error');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      showToast('Failed to resend verification email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        showToast('Login successful!', 'success');
        navigate(from, { replace: true });
      } else if (result.requiresVerification) {
        // Show email verification UI
        setVerificationSent(true);
        setEmailForVerification(formData.email);
        showToast('Please verify your email to continue', 'info');
      } else {
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message || 'An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render email verification UI if needed
  if (isEmailLink) {
    return (
      <div className="auth-page">
        <ShootingStars />
        <div className="auth-container">
          <h1>Verify Your Email</h1>
          <p className="subtitle">Please enter your email to complete sign in</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (emailForVerification) {
              handleEmailLinkSignIn(emailForVerification);
            }
          }} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={emailForVerification}
                onChange={(e) => setEmailForVerification(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render verification sent UI
  if (verificationSent) {
    return (
      <div className="auth-page">
        <ShootingStars />
        <div className="auth-container">
          <h1>Check Your Email</h1>
          <p className="subtitle">
            We've sent a verification link to <strong>{emailForVerification || formData.email}</strong>
          </p>
          <p className="verification-note">
            Please check your inbox and click the link to verify your email address.
          </p>

          <div className="verification-actions">
            <button
              onClick={handleResendVerification}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={() => setVerificationSent(false)}
              className="btn btn-text"
            >
              Back to Login
            </button>
          </div>

          <div className="verification-help">
            <p>Didn't receive the email?</p>
            <ul>
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Add us to your contacts to prevent future emails from going to spam</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render login form
  return (
    <div className="auth-page">
      <ShootingStars />
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                defaultChecked={true}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;