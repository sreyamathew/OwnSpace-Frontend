import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  ArrowRight,
  CheckCircle,
  Loader
} from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, getFieldValidationMessage } from '../utils/validation';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin, isAgent } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [focusErrors, setFocusErrors] = useState({});

  // Redirect if already authenticated and handle URL error params
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isAgent()) {
        navigate('/agent/dashboard');
      } else {
        navigate('/');
      }
    }

    // Check for error in URL params (from Google OAuth failure)
    const urlError = searchParams.get('error');
    if (urlError) {
      setErrors({ general: decodeURIComponent(urlError) });
    }

    // Check for success message in URL params
    const message = searchParams.get('message');
    if (message === 'password-changed') {
      setSuccessMessage('Password changed successfully! Please login with your new password.');
    }

    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      setErrors({ general: 'Session expired. Please log in again.' });
    }
  }, [isAuthenticated, isAdmin, isAgent, navigate, searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear focus error only if the input becomes valid
    if (focusErrors[name]) {
      const errorMessage = getFieldValidationMessage(name, newValue);
      if (!errorMessage) {
        setFocusErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    // Clear focus errors when user focuses on field
    setFocusErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    // Show validation error when user leaves the field
    const errorMessage = getFieldValidationMessage(name, value);
    if (errorMessage) {
      setFocusErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailErrors = validateEmail(formData.email);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors[0];
    }
    
    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setSuccessMessage('Login successful! Redirecting...');

        // Update auth context
        login(response.data.user, response.data.token);

        // Check user type and redirect accordingly
        const userType = response.data.user.userType;
        setTimeout(() => {
          if (userType === 'admin') {
            navigate('/admin/dashboard');
          } else if (userType === 'agent') {
            navigate('/agent/dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`;
  };

  const features = [
    'AI-powered price predictions',
    'Comprehensive risk assessment',
    'Personalized recommendations',
    'Real-time market insights',
    'Advanced analytics dashboard',
    'Smart alerts and notifications'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Own<span className="text-primary-600">Space</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email || focusErrors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter your email (must start with a letter)"
                  />
                </div>
                {(errors.email || focusErrors.email) && (
                  <p className="mt-1 text-sm text-red-600">{errors.email || focusErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      errors.password || focusErrors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {(errors.password || focusErrors.password) && (
                  <p className="mt-1 text-sm text-red-600">{errors.password || focusErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span className="ml-2">Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500"></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="flex flex-col justify-center h-full px-12 text-white">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-6">
                Smart Real Estate Decisions
              </h2>
              <p className="text-primary-100 mb-8 leading-relaxed">
                Join thousands of investors, agents, and buyers who trust OwnSpace 
                for intelligent property insights and AI-powered recommendations.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-200 flex-shrink-0" />
                    <span className="text-primary-100">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold mb-1">95%</div>
                <div className="text-primary-200 text-sm">Prediction Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
