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
  Award,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AgentSidebar from '../components/AgentSidebar';

const AgentProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    bio: user?.bio || '',
    specialization: user?.specialization || 'Residential Properties',
    licenseNumber: user?.licenseNumber || 'RE123456',
    experience: user?.experience || '5 years',
    languages: user?.languages || 'English, Spanish'
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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      setErrors({
        general: 'Failed to update profile. Please try again.'
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
      specialization: user?.specialization || 'Residential Properties',
      licenseNumber: user?.licenseNumber || 'RE123456',
      experience: user?.experience || '5 years',
      languages: user?.languages || 'English, Spanish'
    });
    setIsEditing(false);
    setErrors({});
    setSuccessMessage('');
  };

  // Mock agent performance stats
  const agentStats = {
    totalSales: 45,
    totalCommission: 125000,
    activeListings: 12,
    clientRating: 4.8,
    monthlyTarget: 75,
    closedDeals: 8
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/agent/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Agent Profile</h1>
            <p className="text-gray-600 mt-2">Manage your real estate agent profile and information</p>
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
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <Award className="h-12 w-12 text-green-600" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{user?.name}</h2>
                      <p className="text-green-100">{user?.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-green-500 px-3 py-1 rounded-full text-sm">Real Estate Agent</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-300 fill-current" />
                          <span className="text-green-100 text-sm">{agentStats.clientRating}/5.0</span>
                        </div>
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
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
                          className={`w-full px-3 py-2 border ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
                          className={`w-full px-3 py-2 border ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                          placeholder="Enter your license number"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.licenseNumber || 'Not provided'}</span>
                        </div>
                      )}
                      {errors.licenseNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                      )}
                    </div>

                    {/* Specialization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      {isEditing ? (
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="Residential Properties">Residential Properties</option>
                          <option value="Commercial Properties">Commercial Properties</option>
                          <option value="Luxury Homes">Luxury Homes</option>
                          <option value="Investment Properties">Investment Properties</option>
                          <option value="New Construction">New Construction</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.specialization || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., 5 years"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.experience || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Office Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your office address"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Spoken
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="languages"
                          value={formData.languages}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., English, Spanish, French"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-gray-900">{formData.languages || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Tell clients about your experience and expertise..."
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

            {/* Agent Stats & Performance */}
            <div className="lg:col-span-1 space-y-6">
              {/* Performance Stats */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Total Sales</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{agentStats.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Total Commission</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">${(agentStats.totalCommission / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Active Listings</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{agentStats.activeListings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Client Rating</span>
                    </div>
                    <span className="text-lg font-semibold text-yellow-600">{agentStats.clientRating}/5.0</span>
                  </div>
                </div>
              </div>

              {/* Monthly Progress */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Sales Target</span>
                      <span className="text-gray-900">{agentStats.monthlyTarget}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${agentStats.monthlyTarget}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-2xl font-bold text-green-600">{agentStats.closedDeals}</div>
                    <div className="text-sm text-gray-600">Deals Closed This Month</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate('/agent/properties/add')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Add New Property
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    View My Listings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Client Messages
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;