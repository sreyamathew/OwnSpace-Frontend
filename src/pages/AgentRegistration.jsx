import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  Building,
  Phone,
  MapPin,
  FileText,
  Loader,
  Upload,
  Menu,
  X,
  Home,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateLicenseNumber,
  validatePassword, 
  validateConfirmPassword, 
  getFieldValidationMessage,
  getPasswordStrength 
} from '../utils/validation';

const AgentRegistration = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [focusErrors, setFocusErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: 'No password', color: 'gray' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    agency: '',
    experience: '',
    specialization: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    profileImage: null,
    licenseDocument: null,
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    
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
    if (focusErrors[name] && type !== 'file') {
      const additionalData = name === 'confirmPassword' ? { password: formData.password } : {};
      const errorMessage = getFieldValidationMessage(name, newValue, additionalData);
      if (!errorMessage) {
        setFocusErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }

    // Update password strength in real-time
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(newValue));
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
    const additionalData = name === 'confirmPassword' ? { password: formData.password } : {};
    const errorMessage = getFieldValidationMessage(name, value, additionalData);
    if (errorMessage) {
      setFocusErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    const nameErrors = validateName(formData.name);
    if (nameErrors.length > 0) {
      newErrors.name = nameErrors[0];
    }
    
    // Validate email
    const emailErrors = validateEmail(formData.email);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors[0];
    }
    
    // Validate phone
    const phoneErrors = validatePhone(formData.phone);
    if (phoneErrors.length > 0) {
      newErrors.phone = phoneErrors[0];
    }
    
    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }
    
    // Validate confirm password
    const confirmPasswordErrors = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordErrors.length > 0) {
      newErrors.confirmPassword = confirmPasswordErrors[0];
    }
    
    // Validate license number
    const licenseErrors = validateLicenseNumber(formData.licenseNumber);
    if (licenseErrors.length > 0) {
      newErrors.licenseNumber = licenseErrors[0];
    }
    
    if (!formData.agency.trim()) {
      newErrors.agency = 'Agency name is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Prepare agent data
      const agentData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        agency: formData.agency,
        experience: formData.experience,
        specialization: formData.specialization,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        bio: formData.bio
      };

      const response = await authAPI.registerAgent(agentData);
      
      if (response.success) {
        setSuccessMessage('Agent registered successfully! The agent can now login with their credentials.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          licenseNumber: '',
          agency: '',
          experience: '',
          specialization: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          bio: '',
          profileImage: null,
          licenseDocument: null,
          agreeToTerms: false
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">OwnSpace Admin</span>
              </div>
            </div>

            {/* Right side - Title */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Agent Registration</h1>
              <p className="text-sm text-gray-600">Add a new real estate agent to the system</p>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 border ${
                            errors.name || focusErrors.name ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter full name (letters only, no numbers)"
                        />
                        <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.name || focusErrors.name) && (
                        <p className="mt-1 text-sm text-red-600">{errors.name || focusErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 border ${
                            errors.email || focusErrors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="agent@example.com (must start with a letter)"
                        />
                        <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.email || focusErrors.email) && (
                        <p className="mt-1 text-sm text-red-600">{errors.email || focusErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 border ${
                            errors.phone || focusErrors.phone ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="9876543210 (Must start with 7, 8, or 9)"
                        />
                        <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.phone || focusErrors.phone) && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone || focusErrors.phone}</p>
                      )}
                    </div>

                    {/* License Number */}
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                        License Number *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          required
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 border ${
                            errors.licenseNumber || focusErrors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="RE123456789 (RE followed by 9 digits)"
                        />
                        <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.licenseNumber || focusErrors.licenseNumber) && (
                        <p className="mt-1 text-sm text-red-600">{errors.licenseNumber || focusErrors.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agency */}
                    <div>
                      <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                        Agency Name *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="agency"
                          name="agency"
                          type="text"
                          required
                          value={formData.agency}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-2 pl-10 border ${
                            errors.agency ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Real Estate Agency Name"
                        />
                        <Building className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {errors.agency && (
                        <p className="mt-1 text-sm text-red-600">{errors.agency}</p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="15+">15+ years</option>
                      </select>
                    </div>

                    {/* Specialization */}
                    <div className="md:col-span-2">
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select specialization</option>
                        <option value="residential">Residential Properties</option>
                        <option value="commercial">Commercial Properties</option>
                        <option value="luxury">Luxury Properties</option>
                        <option value="investment">Investment Properties</option>
                        <option value="new-construction">New Construction</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 pr-10 border ${
                            errors.password || focusErrors.password ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                        />
                        <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.color === 'red' ? 'bg-red-500' :
                                  passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                  passwordStrength.color === 'green' ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${
                              passwordStrength.color === 'red' ? 'text-red-600' :
                              passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                              passwordStrength.color === 'green' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                      {(errors.password || focusErrors.password) && (
                        <p className="mt-1 text-sm text-red-600">{errors.password || focusErrors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full px-3 py-2 pl-10 pr-10 border ${
                            errors.confirmPassword || focusErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="••••••••"
                        />
                        <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {(errors.confirmPassword || focusErrors.confirmPassword) && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword || focusErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/agents')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Agent
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimal Sidebar Component
const MinimalSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Properties', icon: Home, path: '/admin/properties' },
    { label: 'Add Property', icon: Plus, path: '/admin/properties/add' },
    { label: 'Agents', icon: Users, path: '/admin/agents' },
    { label: 'Add Agent', icon: UserPlus, path: '/admin/agents/add' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Reports', icon: FileText, path: '/admin/reports' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">OwnSpace</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-600 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose && onClose();
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AgentRegistration;
