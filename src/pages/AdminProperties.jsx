import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  DollarSign,
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
import MinimalSidebar from '../components/MinimalSidebar';
import VisitSlotManager from '../components/VisitSlotManager';
import RiskBadge from '../components/RiskBadge';

const AdminProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties();

      if (response.success) {
        setProperties(response.data.properties);
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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || property.propertyType === filterType;
    const matchesStatus = !filterStatus || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <MinimalSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
                  <p className="text-sm text-gray-600">Manage all properties in the system</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/properties/add')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="p-6">
          {/* Property Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <Home className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{properties.filter(p => p.status === 'active').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-red-600">{properties.filter(p => p.status === 'sold').length}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Other</p>
                  <p className="text-2xl font-bold text-gray-600">{properties.filter(p => p.status !== 'active' && p.status !== 'sold').length}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Bungalow">Bungalow</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
              <p className="text-gray-600">No properties found.</p>
              <button
                onClick={() => navigate('/admin/properties/add')}
                className="mt-4 flex items-center space-x-2 mx-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Property</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const isSold = property.status === 'sold';
                return (
                  <div
                    key={property._id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow ${isSold ? 'opacity-90' : 'hover:shadow-md'}`}
                  >
                    <div className="relative h-48 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
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
                          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-12 shadow-lg">
                            SOLD OUT
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${isSold
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {isSold ? 'SOLD' : 'ACTIVE'}
                      </div>

                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="View Property"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/properties/edit/${property._id}`)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Edit Property"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Delete Property"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm line-clamp-1">
                          {property.address.city}, {property.address.state}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className={`text-xl font-bold ${isSold ? 'text-gray-500 line-through' : 'text-green-600'}`}>
                            {formatPrice(property.price)}
                          </span>
                          {isSold && (
                            <div className="text-sm text-red-600 font-medium">Property Sold</div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-1 block">
                            {property.propertyType}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${isSold
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {property.status?.toUpperCase() || 'ACTIVE'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.area} sqft</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600">{property.agent?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{property.views || 0}</span>
                        </div>
                      </div>

                      {/* Visit Slot Management - Only show for active properties */}
                      {!isSold && (
                        <div className="mt-4">
                          <VisitSlotManager propertyId={property._id} />
                        </div>
                      )}

                      {/* Sold Property Info */}
                      {isSold && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-700">Property has been sold</span>
                          </div>
                          <p className="text-xs text-red-600 mt-1">No longer available for visits or purchases</p>
                        </div>
                      )}
                    </div>

                    {property.riskCategory && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                        <RiskBadge
                          category={property.riskCategory}
                          score={property.riskScore}
                          explanation={property.riskExplanation}
                          showExplanation={false}
                        />
                      </div>
                    )}
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

export default AdminProperties;
