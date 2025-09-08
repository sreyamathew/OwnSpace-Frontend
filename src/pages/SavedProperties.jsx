import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ContactNavbar from '../components/ContactNavbar';

const SavedProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchSavedProperties = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(`savedProperties_${user.id}`) || '[]');
      setSavedProperties(saved);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      setLoading(false);
    }
  };

  const removeSavedProperty = (propertyId) => {
    try {
      const updatedSaved = savedProperties.filter(p => p._id !== propertyId);
      setSavedProperties(updatedSaved);
      localStorage.setItem(`savedProperties_${user.id}`, JSON.stringify(updatedSaved));
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ContactNavbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
              <p className="text-gray-600 mt-2">Your favorite properties saved for later</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse More Properties
            </button>
          </div>
        </div>

        {/* Saved Properties Grid */}
        {savedProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
            <p className="text-gray-500 mb-6">Start browsing properties and save your favorites!</p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.images[0].alt || property.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  
                  {/* Remove from saved button */}
                  <button
                    onClick={() => removeSavedProperty(property._id)}
                    className="absolute top-3 right-3 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  
                  {/* Property type badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                    {property.propertyType}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{property.address?.city}, {property.address?.state}</span>
                  </div>
                  
                  <div className="text-lg font-bold text-green-600 mb-3">
                    {formatPrice(property.price)}
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600 text-xs mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex items-center">
                        <Square className="h-3 w-3 mr-1" />
                        <span>{property.area} sq ft</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/property/${property._id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;