import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
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

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [focusErrors, setFocusErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  
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
    'Parking',
    'Security System',
    'Gym',
    'Elevator',
    'Terrace'
  ];

  // Fetch property data on component mount
  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      setIsLoadingProperty(true);
      const response = await propertyAPI.getProperty(id);
      
      if (response.success) {
        const property = response.data;
        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price?.toString() || '',
          propertyType: property.propertyType || '',
          status: property.status || 'active',
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area?.toString() || '',
          address: property.address?.street || '',
          city: property.address?.city || '',
          state: property.address?.state || '',
          zipCode: property.address?.zipCode || '',
          features: property.features || [],
          newFeature: ''
        });
        
        // Set existing images
        if (property.images && property.images.length > 0) {
          setImages(property.images);
        }
      } else {
        setErrors({ general: 'Failed to load property data' });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setErrors({ general: 'Failed to load property data' });
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (focusErrors[name]) {
      setFocusErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    // Clear focus error when user focuses on field
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

  const addFeature = () => {
    if (formData.newFeature.trim() && !formData.features.includes(formData.newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, prev.newFeature.trim()],
        newFeature: ''
      }));
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const addCommonFeature = (feature) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsProcessingImages(true);
    setImageErrors([]);

    try {
      const processedImages = await processImages(files);
      setImages(prev => [...prev, ...processedImages]);
    } catch (error) {
      setImageErrors([error.message]);
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Validate form data
      const requiredFields = ['title', 'description', 'price', 'propertyType', 'address', 'city', 'state'];
      const newErrors = {};

      // Check required fields
      requiredFields.forEach(field => {
        if (!formData[field] || !formData[field].toString().trim()) {
          newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      });

      // Validate specific fields
      const titleErrors = validatePropertyTitle(formData.title);
      if (titleErrors.length > 0) newErrors.title = titleErrors[0];

      const priceErrors = validatePrice(formData.price);
      if (priceErrors.length > 0) newErrors.price = priceErrors[0];

      if (formData.bedrooms) {
        const bedroomErrors = validateBedrooms(formData.bedrooms);
        if (bedroomErrors.length > 0) newErrors.bedrooms = bedroomErrors[0];
      }

      if (formData.bathrooms) {
        const bathroomErrors = validateBathrooms(formData.bathrooms);
        if (bathroomErrors.length > 0) newErrors.bathrooms = bathroomErrors[0];
      }

      if (formData.area) {
        const areaErrors = validateArea(formData.area);
        if (areaErrors.length > 0) newErrors.area = areaErrors[0];
      }

      if (formData.zipCode) {
        const zipCodeErrors = validateZipCode(formData.zipCode);
        if (zipCodeErrors.length > 0) newErrors.zipCode = zipCodeErrors[0];
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

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
          zipCode: formData.zipCode.trim(),
          country: 'India'
        },
        features: formData.features,
        images: images
      };

      // Call the API
      console.log('Updating property with data:', propertyData);
      const response = await propertyAPI.updateProperty(id, propertyData);
      console.log('API Response:', response);

      if (response.success) {
        setSuccessMessage('Property updated successfully!');
        setTimeout(() => {
          navigate('/admin/properties');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Failed to update property' });
      }
    } catch (error) {
      console.error('Update property error:', error);
      setErrors({ general: error.message || 'Failed to update property' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MinimalSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        userType={user?.userType}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/admin/properties')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Properties
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Edit Property</h1>
                <p className="text-xs text-gray-500">Update property details</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
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
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
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
                </div>
              </div>

              {/* Pricing and Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (INR) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="price"
                        name="price"
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
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
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
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Area */}
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      Area (sq ft)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="area"
                        name="area"
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

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Description</h2>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Description *
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="address"
                        name="address"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
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
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
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
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
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
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Features & Amenities</h2>

                {/* Common Features */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Common Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {commonFeatures.map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addCommonFeature(feature)}
                        disabled={formData.features.includes(feature)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Feature Input */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Custom Feature</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={formData.newFeature}
                      onChange={(e) => setFormData(prev => ({ ...prev, newFeature: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter a custom feature..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Selected Features */}
                {formData.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Property Images</h2>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Images
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isProcessingImages}
                      />
                    </label>
                  </div>

                  {isProcessingImages && (
                    <div className="mt-3 flex items-center text-blue-600">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing images...
                    </div>
                  )}

                  {imageErrors.length > 0 && (
                    <div className="mt-3">
                      {imageErrors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">{error}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Property Images ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt || `Property image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/properties')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProperty;
