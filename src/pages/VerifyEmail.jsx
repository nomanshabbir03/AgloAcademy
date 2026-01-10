import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const {
    user,
    resendVerificationEmail,
    checkEmailVerification,
    logout
  } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);

  // 🔄 Refresh verification status
  const handleRefresh = async () => {
    setLoading(true);
    setMessage('');

    const verified = await checkEmailVerification();

    if (verified) {
      navigate('/', { replace: true });
    } else {
      setMessage('Email not verified yet. Please check your inbox.');
    }

    setLoading(false);
  };

  // 📧 Resend verification email
  const handleResend = async () => {
    setLoading(true);
    setMessage('');

    const result = await resendVerificationEmail();

    if (result?.success !== false) {
      setMessage('Verification email sent. Please check your inbox.');
      setCooldown(true);

      // ⏳ 30s cooldown to prevent spam
      setTimeout(() => setCooldown(false), 30000);
    } else {
      setMessage(result.message || 'Failed to resend email.');
    }

    setLoading(false);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '24px',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}
      >
        <h2>Email Verification Required</h2>

        <p style={{ marginTop: '12px' }}>
          We’ve sent a verification link to:
        </p>

        <p style={{ fontWeight: 'bold' }}>
          {user?.email}
        </p>

        <p style={{ marginTop: '12px', color: '#555' }}>
          Please verify your email to continue using TGD Planet.
        </p>

        {message && (
          <p style={{ marginTop: '12px', color: '#d97706' }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Checking...' : 'I have verified my email'}
          </button>
        </div>

        <div style={{ marginTop: '12px' }}>
          <button
            onClick={handleResend}
            disabled={loading || cooldown}
            style={secondaryButtonStyle}
          >
            {cooldown
              ? 'Please wait before resending'
              : 'Resend verification email'}
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleLogout}
            style={linkButtonStyle}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 Simple inline styles (no CSS dependency)
const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '6px',
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer'
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: '#f3f4f6',
  color: '#111'
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  cursor: 'pointer',
  textDecoration: 'underline'
};

export default VerifyEmail;
