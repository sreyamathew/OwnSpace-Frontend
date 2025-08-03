import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  DollarSign,
  Eye,
  Trash2,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ContactNavbar from '../components/ContactNavbar';

const SavedProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Mock saved properties data
  const savedProperties = [
    {
      id: 1,
      title: "Modern Villa with Garden",
      price: 850000,
      location: "Downtown, City Center",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      image: "/api/placeholder/400/300",
      savedDate: "2025-03-10",
      status: "active",
      type: "house"
    },
    {
      id: 2,
      title: "Luxury Apartment",
      price: 420000,
      location: "Business District",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: "/api/placeholder/400/300",
      savedDate: "2025-03-08",
      status: "active",
      type: "apartment"
    },
    {
      id: 3,
      title: "Cozy Family Home",
      price: 320000,
      location: "Suburban Area",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      image: "/api/placeholder/400/300",
      savedDate: "2025-03-05",
      status: "sold",
      type: "house"
    }
  ];

  const handleRemoveProperty = (propertyId) => {
    console.log(`Removing property ${propertyId} from saved list`);
    // In real app, this would call API to remove from saved properties
  };

  const filteredProperties = savedProperties.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'available') return property.status === 'active';
    if (filter === 'sold') return property.status === 'sold';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-gray-600 mt-2">Properties you've saved for later viewing</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Properties</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => handleRemoveProperty(property.id)}
                      className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/90 text-gray-600 rounded-full hover:bg-white transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs opacity-90">Saved on {new Date(property.savedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                    <Heart className="h-5 w-5 text-red-500 fill-current flex-shrink-0 ml-2" />
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't saved any properties yet. Start browsing to save your favorites!"
                : `No ${filter} properties in your saved list.`
              }
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {filteredProperties.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Properties Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{savedProperties.length}</div>
                <div className="text-sm text-gray-600">Total Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {savedProperties.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {savedProperties.filter(p => p.status === 'sold').length}
                </div>
                <div className="text-sm text-gray-600">Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  ${Math.round(savedProperties.reduce((sum, p) => sum + p.price, 0) / savedProperties.length / 1000)}K
                </div>
                <div className="text-sm text-gray-600">Avg. Price</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;