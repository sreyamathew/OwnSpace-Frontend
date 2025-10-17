import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  User,
  Building,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';
import AgentSidebar from '../components/AgentSidebar';
import VisitSlotManager from '../components/VisitSlotManager';

const AgentProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch properties for the current agent
      const response = await propertyAPI.getPropertiesByAgent(user._id);
      
      if (response.success) {
        setProperties(response.data);
      } else {
        setError('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await propertyAPI.deleteProperty(propertyId);
        if (response.success) {
          setProperties(properties.filter(p => p._id !== propertyId));
        } else {
          alert('Failed to delete property');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
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

  const getAddressText = (property) => {
    const city = property?.address?.city || property?.city;
    const state = property?.address?.state || property?.state;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Location not specified';
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || property.propertyType === filterType;
    return matchesSearch && matchesType;
  });

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Commercial', 'Land', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AgentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">My Properties</h1>
                  <p className="text-xs text-gray-500">Manage your property listings</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/agent/properties/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || filterType ? 'No properties found matching your criteria.' : 'You haven\'t added any properties yet.'}
              </p>
              {!searchTerm && !filterType && (
                <button
                  onClick={() => navigate('/agent/properties/add')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center max-w-7xl mx-auto">
              {filteredProperties.map((property) => {
                const isSold = property.status === 'sold';
                return (
                <div
                  key={property._id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow w-full max-w-sm ${isSold ? 'opacity-90' : 'hover:shadow-md'}`}
                >
                  <div className="relative h-32 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.images[0].alt || property.title || 'Property image'}
                        className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isSold ? 'grayscale' : ''}`}>
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Sold Overlay */}
                    {isSold && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xs transform rotate-12 shadow-lg">
                          SOLD OUT
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isSold 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {isSold ? 'SOLD' : 'ACTIVE'}
                    </div>
                    
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="View Property"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigate(`/agent/properties/edit/${property._id}`)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="Edit Property"
                      >
                        <Edit className="h-3 w-3 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="Delete Property"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {property?.title || 'Untitled Property'}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm line-clamp-1">
                        {getAddressText(property)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className={`text-xl font-bold ${isSold ? 'text-gray-500 line-through' : 'text-green-600'}`}>
                          {typeof property?.price === 'number' ? formatPrice(property.price) : 'Price on request'}
                        </span>
                        {isSold && (
                          <div className="text-xs text-red-600 font-medium">Property Sold</div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {property?.propertyType || 'Type N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                      {property?.bedrooms != null && property?.bedrooms !== '' && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property?.bathrooms != null && property?.bathrooms !== '' && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property?.area != null && property?.area !== '' && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span>{property.area} sqft</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          property.status === 'active' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        {isSold && (
                          <span className="text-xs text-red-600">• No longer available</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{property.views || 0}</span>
                      </div>
                    </div>
                    {/* Visit Slot Management - Only show for active properties */}
                    {!isSold && (
                      <div className="mt-3">
                        <VisitSlotManager propertyId={property._id} />
                      </div>
                    )}
                    
                    {/* Sold Property Info */}
                    {isSold && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          <span className="text-xs font-medium text-red-700">Property sold</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AgentProperties;
