import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.userType) {
      newErrors.userType = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic here
      console.log('Login attempt:', formData);
      // Redirect to dashboard based on user type
    }
  };

  const userTypes = [
    {
      value: 'investor',
      label: 'Investor/Buyer',
      description: 'Looking to invest in properties'
    },
    {
      value: 'agent',
      label: 'Real Estate Agent',
      description: 'Managing property listings'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'System administration'
    }
  ];

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a *
                </label>
                <div className="space-y-2">
                  {userTypes.map((type) => (
                    <label key={type.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={formData.userType === type.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
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
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Demo Accounts</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button className="w-full text-left p-2 text-xs bg-blue-50 border border-blue-200 rounded text-blue-700 hover:bg-blue-100 transition-colors duration-200">
                  <strong>Investor:</strong> investor@demo.com / password123
                </button>
                <button className="w-full text-left p-2 text-xs bg-green-50 border border-green-200 rounded text-green-700 hover:bg-green-100 transition-colors duration-200">
                  <strong>Agent:</strong> agent@demo.com / password123
                </button>
                <button className="w-full text-left p-2 text-xs bg-purple-50 border border-purple-200 rounded text-purple-700 hover:bg-purple-100 transition-colors duration-200">
                  <strong>Admin:</strong> admin@demo.com / password123
                </button>
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
