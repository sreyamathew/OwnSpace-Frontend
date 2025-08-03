import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Loader
} from 'lucide-react';
import AgentSidebar from '../components/AgentSidebar';

const AddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [images, setImages] = useState([]);
  
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    setImages(prev => [...prev, ...newImages]);
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Property title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Property description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Property added successfully!');
      
      // Reset form after success
      setTimeout(() => {
        navigate('/agent/properties');
      }, 1500);
    } catch (error) {
      console.error('Add property error:', error);
      setErrors({
        general: 'Failed to add property. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/agent/properties')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-600 mt-1">Create a new property listing</p>
              </div>
            </div>
          </div>
        </div>

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
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="e.g., Beautiful Modern Villa with Garden"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.propertyType ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type.toLowerCase()}>{type}</option>
                        ))}
                      </select>
                      {errors.propertyType && (
                        <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
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
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.price ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="450000"
                        />
                        <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
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
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="3"
                        />
                        <Bed className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
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
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="2"
                        />
                        <Bath className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
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
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="2500"
                        />
                        <Square className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
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
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Describe the property, its features, and what makes it special..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.address ? 'border-red-300' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="123 Main Street"
                        />
                        <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
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
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.state ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="NY"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10001"
                      />
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
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map(image => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.preview}
                            alt="Property"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
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