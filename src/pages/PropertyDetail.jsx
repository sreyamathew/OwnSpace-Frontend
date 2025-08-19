import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Eye,
  User,
  Phone,
  Mail,
  Star,
  Calendar,
  Building,
  CheckCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
    if (user) {
      fetchSavedProperties();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getProperty(id);
      
      if (response.success) {
        setProperty(response.data);
        // Record recently viewed property for the current user (limit to 10)
        if (user && response.data) {
          try {
            const key = `recentlyViewed_${user.id}`;
            const existingRaw = localStorage.getItem(key) || '[]';
            let existingList = [];
            try {
              existingList = JSON.parse(existingRaw);
              if (!Array.isArray(existingList)) existingList = [];
            } catch (_) {
              existingList = [];
            }

            const viewedItem = {
              propertyId: response.data._id,
              title: response.data.title,
              price: response.data.price,
              location: `${response.data.address?.city || ''}${response.data.address?.state ? ', ' + response.data.address.state : ''}`.trim(),
              viewedAt: new Date().toISOString(),
              image: response.data.images?.[0]?.url || null,
              action: 'viewed'
            };

            // Remove duplicates by propertyId, then unshift the latest
            const deduped = existingList.filter(i => i && i.propertyId !== viewedItem.propertyId);
            deduped.unshift(viewedItem);
            // Keep a larger rolling history so "Load more" can reveal older items
            const limited = deduped.slice(0, 200);
            localStorage.setItem(key, JSON.stringify(limited));
          } catch (e) {
            console.warn('Failed to record recently viewed property:', e);
          }
        }
      } else {
        setError('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    try {
      // Get saved properties from localStorage for now
      // In a real app, this would be an API call
      const saved = JSON.parse(localStorage.getItem(`savedProperties_${user.id}`) || '[]');
      setSavedProperties(saved);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const toggleSaveProperty = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please login to save properties');
      return;
    }

    try {
      const isSaved = savedProperties.some(p => p._id === property._id);
      
      if (isSaved) {
        // Remove from saved
        const updatedSaved = savedProperties.filter(p => p._id !== property._id);
        setSavedProperties(updatedSaved);
        localStorage.setItem(`savedProperties_${user.id}`, JSON.stringify(updatedSaved));
      } else {
        // Add to saved
        const updatedSaved = [...savedProperties, property];
        setSavedProperties(updatedSaved);
        localStorage.setItem(`savedProperties_${user.id}`, JSON.stringify(updatedSaved));
      }
    } catch (error) {
      console.error('Error toggling save property:', error);
    }
  };

  const recordHistoryAction = (action) => {
    if (!user || !property) return;
    try {
      const key = `recentlyViewed_${user.id}`;
      const existingRaw = localStorage.getItem(key) || '[]';
      let existingList = [];
      try {
        existingList = JSON.parse(existingRaw);
        if (!Array.isArray(existingList)) existingList = [];
      } catch (_) {
        existingList = [];
      }

      const historyItem = {
        propertyId: property._id,
        title: property.title,
        price: property.price,
        location: `${property.address?.city || ''}${property.address?.state ? ', ' + property.address.state : ''}`.trim(),
        viewedAt: new Date().toISOString(),
        image: property.images?.[0]?.url || null,
        action
      };

      const deduped = existingList.filter(i => i && i.propertyId !== historyItem.propertyId);
      deduped.unshift(historyItem);
      const limited = deduped.slice(0, 200);
      localStorage.setItem(key, JSON.stringify(limited));
    } catch (e) {
      console.warn('Failed to record history action:', e);
    }
  };

  const isPropertySaved = () => {
    return savedProperties.some(p => p._id === property._id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => {
                // Smart back navigation based on user type and referrer
                if (user?.userType === 'admin') {
                  navigate('/admin/properties');
                } else if (user?.userType === 'agent') {
                  navigate('/agent/properties');
                } else {
                  navigate('/properties');
                }
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={toggleSaveProperty}
                className={`p-2 rounded-full transition-colors ${
                  isPropertySaved() ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${
                  isPropertySaved() ? 'text-red-600 fill-current' : 'text-gray-600'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-96">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[currentImageIndex]?.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-white' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(property.price)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{property.views || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">{property.area ? `${property.area} sqft` : 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{property.propertyType}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Property ID:</span> {property._id}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className="ml-1 capitalize">{property.status}</span>
                  </div>
                  <div>
                    <span className="font-medium">Listed:</span> {formatDate(property.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDate(property.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              
              {property.agent && (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.agent.name}</h4>
                      <p className="text-sm text-gray-600">Real Estate Agent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {property.agent.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{property.agent.email}</span>
                      </div>
                    )}
                    {property.agent.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{property.agent.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    recordHistoryAction('contacted_agent');
                    alert('Agent has been contacted (demo).');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Contact Agent
                </button>
                <button
                  onClick={() => {
                    recordHistoryAction('scheduled_visit');
                    alert('Visit has been scheduled (demo).');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Schedule Tour
                </button>
                <button 
                  onClick={toggleSaveProperty}
                  className={`w-full px-4 py-2 rounded-md transition-colors ${
                    isPropertySaved() 
                      ? 'bg-red-600 text-white hover:bg-red-700 border border-red-600' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isPropertySaved() ? 'Saved ✓' : 'Save Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
