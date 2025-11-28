import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ShootingStars from '../components/ShootingStars.jsx';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        showToast('Login successful!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('An error occurred during login', 'error');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated shooting stars in the sky background */}
      <ShootingStars />

      <div className="auth-page-inner">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-subtitle">
              Sign in to continue your journey at Aglo Academy.
              <br />
              Or{' '}
              <Link to="/register">
                create a new account
              </Link>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field-group">
              <label htmlFor="email-address" className="auth-label">
                Email
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-meta-row">
              <div className="auth-remember">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="auth-checkbox"
                />
                <label htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="auth-link-small">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Signing in' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
