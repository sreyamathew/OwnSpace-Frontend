import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  ChevronRight,
  TrendingUp,
  Loader
} from 'lucide-react';
import { propertyAPI } from '../services/api';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await propertyAPI.getRecommendations();
      if (res.success) {
        setRecommendations(res.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // We don't set error state here to avoid showing error UI if user just hasn't set preferences yet
      if (err.code === '404') {
        setError('Please set your preferences in Profile to get personalized recommendations.');
      } else {
        setError('Unable to load recommendations at this time.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Generating your personalized recommendations...</p>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Recommendations</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {error || 'No recommendations available based on your current preferences. Update your profile to see homes you might love!'}
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Update Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500 fill-current" />
          <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
        </div>
        <button 
          onClick={() => navigate('/properties')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
        >
          Explore More <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {recommendations.map((property) => (
          <div 
            key={property._id}
            onClick={() => navigate(`/property/${property._id}`)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="relative h-40">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0].url}
                  alt={property.images[0].alt || property.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Star className="h-8 w-8 text-gray-300" />
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded uppercase tracking-wider">
                Top Pick
              </div>
            </div>
            
            <div className="p-3">
              <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{property.title}</h4>
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{property.address?.city}</span>
              </div>
              
              <div className="text-blue-600 font-bold mb-2">
                {formatPrice(property.price)}
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-gray-500 border-t pt-2">
                <div className="flex items-center">
                  <Bed className="h-3 w-3 mr-1" />
                  <span>{property.bedrooms} BHK</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-3 w-3 mr-1" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
