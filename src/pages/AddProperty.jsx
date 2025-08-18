import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Upload,
  Save,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  Loader,
  Menu,
  Building,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  FileText,
  LayoutDashboard,
  AlertCircle,
  ImageIcon
} from 'lucide-react';
import { 
  validatePrice, 
  getFieldValidationMessage,
  validatePropertyTitle,
  validatePropertyDescription,
  validatePropertyType,
  validateAddress,
  validateCity,
  validateState,
  validateBedrooms,
  validateBathrooms,
  validateArea,
  validateZipCode
} from '../utils/validation';
import { processImages, formatFileSize } from '../utils/imageUtils';
import { propertyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import AgentSidebar from '../components/AgentSidebar';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [focusErrors, setFocusErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('=== AddProperty Component Debug ===');
    console.log('Current user:', user);
    console.log('User type:', user?.userType);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('User in localStorage:', localStorage.getItem('user'));
  }, [user]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    status: 'active',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    features: [],
    newFeature: ''
  });

  const propertyTypes = [
    'House',
    'Apartment',
    'Condo',
    'Townhouse',
    'Villa',
    'Commercial',
    'Land',
    'Other'
  ];

  const commonFeatures = [
    'Swimming Pool',
    'Garage',
    'Garden',
    'Balcony',
    'Fireplace',
    'Air Conditioning',
    'Heating',
    'Security System',
    'Gym',
    'Elevator',
    'Parking',
    'Storage Room'
  ];

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsProcessingImages(true);
    setImageErrors([]);

    try {
      const result = await processImages(files, 'temp');
      
      if (result.errors.length > 0) {
        setImageErrors(result.errors);
      }
      
      if (result.images.length > 0) {
        const newImages = result.images.map(img => ({
          ...img,
          id: Date.now() + Math.random(),
          preview: img.url
        }));
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      setImageErrors([{ fileName: 'Unknown', errors: ['Failed to process images'] }]);
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addFeature = (feature) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature],
        newFeature: ''
      }));
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    const titleErrors = validatePropertyTitle(formData.title);
    if (titleErrors.length > 0) {
      newErrors.title = titleErrors[0];
    }
    
    // Validate description
    const descriptionErrors = validatePropertyDescription(formData.description);
    if (descriptionErrors.length > 0) {
      newErrors.description = descriptionErrors[0];
    }
    
    // Validate price
    const priceErrors = validatePrice(formData.price);
    if (priceErrors.length > 0) {
      newErrors.price = priceErrors[0];
    }
    
    // Validate property type
    const propertyTypeErrors = validatePropertyType(formData.propertyType);
    if (propertyTypeErrors.length > 0) {
      newErrors.propertyType = propertyTypeErrors[0];
    }
    
    // Validate address
    const addressErrors = validateAddress(formData.address);
    if (addressErrors.length > 0) {
      newErrors.address = addressErrors[0];
    }
    
    // Validate city
    const cityErrors = validateCity(formData.city);
    if (cityErrors.length > 0) {
      newErrors.city = cityErrors[0];
    }
    
    // Validate state
    const stateErrors = validateState(formData.state);
    if (stateErrors.length > 0) {
      newErrors.state = stateErrors[0];
    }
    
    // Validate optional fields if they have values
    if (formData.bedrooms) {
      const bedroomsErrors = validateBedrooms(formData.bedrooms);
      if (bedroomsErrors.length > 0) {
        newErrors.bedrooms = bedroomsErrors[0];
      }
    }
    
    if (formData.bathrooms) {
      const bathroomsErrors = validateBathrooms(formData.bathrooms);
      if (bathroomsErrors.length > 0) {
        newErrors.bathrooms = bathroomsErrors[0];
      }
    }
    
    if (formData.area) {
      const areaErrors = validateArea(formData.area);
      if (areaErrors.length > 0) {
        newErrors.area = areaErrors[0];
      }
    }
    
    if (formData.zipCode) {
      const zipCodeErrors = validateZipCode(formData.zipCode);
      if (zipCodeErrors.length > 0) {
        newErrors.zipCode = zipCodeErrors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Current user:', user);
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed');
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Prepare property data
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        status: formData.status,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        address: {
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode ? formData.zipCode.trim() : undefined,
          country: 'India'
        },
        features: formData.features,
        images: images.map(img => ({
          url: img.url,
          alt: img.originalName || formData.title,
          isPrimary: img.isPrimary || false
        }))
      };

      // Call the API
      console.log('Calling API with data:', propertyData);
      console.log('Current user before API call:', user);
      console.log('Token before API call:', localStorage.getItem('token'));

      const response = await propertyAPI.createProperty(propertyData);
      console.log('API Response:', response);
      
      if (response.success) {
        setSuccessMessage('Property added successfully!');
        
        // Debug logging
        console.log('Property creation successful');
        console.log('User object:', user);
        console.log('User userType:', user?.userType);
        console.log('Available routes should be working...');
        
        // Reset form after success
        setTimeout(() => {
          // Navigate back to admin properties page
          if (user?.userType === 'admin') {
            navigate('/admin/properties');
          } else if (user?.userType === 'agent') {
            navigate('/agent/dashboard');
          } else {
            navigate('/admin/dashboard');
          }
        }, 1500);
      } else {
        console.log('API call failed:', response);
        setErrors({
          general: response.message || 'Failed to add property. Please try again.'
        });
      }
    } catch (error) {
      console.error('Add property error:', error);
      console.error('Error details:', error.response || error);
      setErrors({
        general: error.message || 'Failed to add property. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAgent = user?.userType === 'agent';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          {isAgent ? (
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
              <AgentSidebar />
            </div>
          ) : (
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
              <MinimalSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          )}
        </div>
      )}

      {/* Desktop Sidebar */}
      {isAgent ? (
        <div className="hidden lg:block">
          <AgentSidebar />
        </div>
      ) : (
        <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
          <MinimalSidebar />
        </div>
      )}

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
                <span className="text-lg font-semibold text-gray-900">{isAgent ? 'OwnSpace Agent' : 'OwnSpace Admin'}</span>
              </div>
            </div>

            {/* Right side - Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(isAgent ? '/agent/dashboard' : '/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Add New Property</h1>
                <p className="text-sm text-gray-600">Create a new property listing</p>
              </div>
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
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Title */}
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Property Title *
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.title || focusErrors.title ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="e.g., Beautiful Modern Villa (letters and spaces only)"
                      />
                      {(errors.title || focusErrors.title) && (
                        <p className="mt-1 text-sm text-red-600">{errors.title || focusErrors.title}</p>
                      )}
                    </div>

                    {/* Property Type */}
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                        Property Type *
                      </label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        required
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.propertyType || focusErrors.propertyType ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {(errors.propertyType || focusErrors.propertyType) && (
                        <p className="mt-1 text-sm text-red-600">{errors.propertyType || focusErrors.propertyType}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($) *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="price"
                          name="price"
                          type="number"
                          required
                          min="1"
                          value={formData.price}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.price || focusErrors.price ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="450000 (in INR, max 15 digits, cannot start with 0)"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 font-medium">₹</span>
                      </div>
                      {(errors.price || focusErrors.price) && (
                        <p className="mt-1 text-sm text-red-600">{errors.price || focusErrors.price}</p>
                      )}
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                        Bedrooms
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="bedrooms"
                          name="bedrooms"
                          type="number"
                          min="0"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.bedrooms || focusErrors.bedrooms ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="3 (max 15)"
                        />
                        <Bed className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.bedrooms || focusErrors.bedrooms) && (
                        <p className="mt-1 text-sm text-red-600">{errors.bedrooms || focusErrors.bedrooms}</p>
                      )}
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                        Bathrooms
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="bathrooms"
                          name="bathrooms"
                          type="number"
                          min="0"
                          step="0.5"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.bathrooms || focusErrors.bathrooms ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="2 (max 15)"
                        />
                        <Bath className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.bathrooms || focusErrors.bathrooms) && (
                        <p className="mt-1 text-sm text-red-600">{errors.bathrooms || focusErrors.bathrooms}</p>
                      )}
                    </div>

                    {/* Area */}
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Area (sq ft)
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="area"
                          name="area"
                          type="number"
                          min="0"
                          value={formData.area}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.area || focusErrors.area ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="2500 (cannot be zero, cannot start with 0, max 15 digits)"
                        />
                        <Square className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.area || focusErrors.area) && (
                        <p className="mt-1 text-sm text-red-600">{errors.area || focusErrors.area}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.description || focusErrors.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Describe the property, its features, and what makes it special..."
                    />
                    {(errors.description || focusErrors.description) && (
                      <p className="mt-1 text-sm text-red-600">{errors.description || focusErrors.description}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="address"
                          name="address"
                          type="text"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.address || focusErrors.address ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="123 Main Street"
                        />
                        <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {(errors.address || focusErrors.address) && (
                        <p className="mt-1 text-sm text-red-600">{errors.address || focusErrors.address}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.city || focusErrors.city ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="New York"
                      />
                      {(errors.city || focusErrors.city) && (
                        <p className="mt-1 text-sm text-red-600">{errors.city || focusErrors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.state || focusErrors.state ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="NY"
                      />
                      {(errors.state || focusErrors.state) && (
                        <p className="mt-1 text-sm text-red-600">{errors.state || focusErrors.state}</p>
                      )}
                    </div>

                    {/* Zip Code */}
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        Zip Code
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.zipCode || focusErrors.zipCode ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="123456 (exactly 6 digits)"
                      />
                      {(errors.zipCode || focusErrors.zipCode) && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode || focusErrors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                  
                  {/* Common Features */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select common features:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {commonFeatures.map(feature => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => addFeature(feature)}
                          disabled={formData.features.includes(feature)}
                          className={`p-2 text-sm rounded-md border transition-colors ${
                            formData.features.includes(feature)
                              ? 'bg-blue-100 border-blue-300 text-blue-700 cursor-not-allowed'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Feature */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Add custom feature:</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.newFeature}
                        onChange={(e) => setFormData(prev => ({ ...prev, newFeature: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter custom feature"
                      />
                      <button
                        type="button"
                        onClick={() => addFeature(formData.newFeature)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Selected Features */}
                  {formData.features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected features:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map(feature => (
                          <span
                            key={feature}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(feature)}
                              className="ml-2 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>
                  
                  {/* Upload Area */}
                  <div className="mb-4">
                    <label className="block">
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        isProcessingImages 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {isProcessingImages ? (
                          <>
                            <Loader className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
                            <p className="text-sm text-blue-600">Processing images...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 10MB each</p>
                            <p className="text-xs text-gray-500">Minimum 300x200 pixels recommended</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isProcessingImages}
                      />
                    </label>
                  </div>

                  {/* Image Upload Errors */}
                  {imageErrors.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <h4 className="text-sm font-medium text-red-800">Image Upload Issues</h4>
                      </div>
                      <div className="space-y-2">
                        {imageErrors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700">
                            <strong>{error.fileName}:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {error.errors.map((err, errIndex) => (
                                <li key={errIndex}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded Images ({images.length})
                        </p>
                        <p className="text-xs text-gray-500">
                          First image will be the main property photo
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <div className="relative">
                              <img
                                src={image.preview}
                                alt={image.originalName || "Property"}
                                className="w-full h-32 object-cover rounded-lg border-2 border-transparent group-hover:border-blue-300 transition-colors"
                              />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                  Main Photo
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {image.originalName}
                            </div>
                            {image.size && (
                              <div className="text-xs text-gray-400">
                                {formatFileSize(image.size)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <ImageIcon className="h-3 w-3 inline mr-1" />
                        Tip: You can reorder images by removing and re-uploading them in your preferred order
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/agent/properties')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin h-4 w-4" />
                        <span>Adding Property...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Add Property</span>
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



export default AddProperty;