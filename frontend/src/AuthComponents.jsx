import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Validation utils
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

const validatePassword = (password, isRegister = false) => {
  if (!password) return 'Password is required';
  if (isRegister && password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

const validateName = (name) => {
  if (!name?.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

// Error message component
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="error-message" role="alert">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
};

// Form field component
const FormField = ({ icon: Icon, error, ...props }) => (
  <div className="form-group">
    <div className="input-group">
      <Icon className="input-icon" size={20} />
      <input
        {...props}
        className={`auth-input ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
      />
    </div>
    {error && <span className="input-error" role="alert">{error}</span>}
  </div>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {
      username: validateName(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password, true),
      confirmPassword: formData.password !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : ''
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' } 
      });
    } catch (error) {
      setServerError(error.message);
      if (error.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ 
          ...prev, 
          email: 'This email is already registered' 
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="text-gradient">Create Account</h2>
          <p className="auth-description">Sign up to get started with our platform</p>
        </div>
        
        {serverError && <ErrorMessage message={serverError} />}
        
        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <FormField
              icon={User}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              disabled={isSubmitting}
              required
            />
            
            <FormField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
              required
            />
            
            <FormField
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isSubmitting}
              required
            />
            
            <FormField
              icon={Lock}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isSubmitting}
              required
            />
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-button-loading">
                  <Loader className="animate-spin" size={16} />
                  <span>Registering...</span>
                </span>
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="auth-footer">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="auth-nav-link"
              type="button"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('userName', data.username);
      setIsLoggedIn(true);
      
      navigate('/');
    } catch (error) {
      setServerError(error.message);
      setErrors({
        email: 'Invalid credentials',
        password: 'Invalid credentials'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="text-gradient">Welcome Back</h2>
          <p className="auth-description">Sign in to your account</p>
        </div>
        
        {serverError && <ErrorMessage message={serverError} />}
        
        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form" noValidate>

            <FormField
              icon={User}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              disabled={isSubmitting}
              required
            />
            
            <FormField
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isSubmitting}
              required
            />
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="password-recovery-link"
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-button-loading">
                  <Loader className="animate-spin" size={16} />
                  <span>Signing In...</span>
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="auth-footer">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="auth-nav-link"
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Logout utility function
export const logout = () => {
  fetch('logout/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('token')}`
    }
  }).finally(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  });
};

export { LoginPage, RegisterPage };