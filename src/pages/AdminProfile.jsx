import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Camera,
  ArrowLeft,
  CheckCircle,
  Loader,
  Shield,
  Calendar,
  Building,
  Users,
  Settings,
  Menu,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import {
  validateName,
  validateEmail,
  validatePhone
} from '../utils/validation';
import { authAPI } from '../services/api';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [focusErrors, setFocusErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    bio: user?.bio || '',
    employeeId: user?.employeeId || 'ADM001'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear focus error when user starts typing
    if (focusErrors[name]) {
      setFocusErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Validate on blur using the validation utilities
    switch (name) {
      case 'name':
        const nameErrors = validateName(value);
        if (nameErrors.length > 0) {
          newErrors.name = nameErrors[0];
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailErrors = validateEmail(value);
        if (emailErrors.length > 0) {
          newErrors.email = emailErrors[0];
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value.trim()) { // Only validate if phone is provided
          const phoneErrors = validatePhone(value);
          if (phoneErrors.length > 0) {
            newErrors.phone = phoneErrors[0];
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
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

    // Validate phone (optional but if provided should be valid)
    if (formData.phone && formData.phone.trim()) {
      const phoneErrors = validatePhone(formData.phone);
      if (phoneErrors.length > 0) {
        newErrors.phone = phoneErrors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        bio: formData.bio,
        employeeId: formData.employeeId
      };

      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        // Update user context with new data
        updateUser(response.data.user);
        
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrors({
          general: response.message || 'Failed to update profile. Please try again.'
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setErrors({
        general: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      bio: user?.bio || '',
      employeeId: user?.employeeId || 'ADM001'
    });
    setIsEditing(false);
    setErrors({});
    setSuccessMessage('');
  };

  // Mock admin stats
  const adminStats = {
    totalUsers: 1247,
    totalAgents: 45,
    totalProperties: 892,
    monthlyRevenue: 125000
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
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Admin Profile</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header - Hidden on mobile since it's in mobile header */}
            <div className="hidden lg:block mb-8">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600 mt-2">Manage your administrator account information</p>
            </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <Shield className="h-12 w-12 text-blue-600" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{user?.name}</h2>
                      <p className="text-blue-100">{user?.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">Administrator</span>
                        <span className="text-blue-100 text-sm">ID: {formData.employeeId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="px-6 py-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader className="animate-spin h-4 w-4" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-3 py-2 border ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.name || 'Not provided'}</span>
                        </div>
                      )}
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-3 py-2 border ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.email || 'Not provided'}</span>
                        </div>
                      )}
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-3 py-2 border ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>



                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <span className="text-gray-900">{formData.bio || 'No bio provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Stats & Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Admin Stats */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Total Users</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{adminStats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Active Agents</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{adminStats.totalAgents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Properties</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{adminStats.totalProperties.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">${(adminStats.monthlyRevenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Auth</h4>
                      <p className="text-xs text-gray-600">Enhanced security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-xs text-gray-600">System alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Download Data
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;