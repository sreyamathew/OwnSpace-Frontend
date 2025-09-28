import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Eye,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Building,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI, visitAPI } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const [scheduling, setScheduling] = useState({ open: false, property: null, date: '', time: '', note: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  // Compute local today string (YYYY-MM-DD) to restrict past dates
  const todayLocal = new Date();
  const minDate = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties(filterParams);
      
      if (response.success) {
        const list = response.data.properties || [];
        setProperties(list);
        // Initialize filtered list and reset pagination
        setFilteredProperties(list);
        setVisibleCount(9);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const filterParams = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filterParams[key] = filters[key];
      }
    });
    // Fetch filtered data server-side; pagination resets after fetch
    fetchProperties(filterParams);
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchTerm('');
    fetchProperties();
  };

  const handlePropertyView = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const openScheduleModal = (property) => {
    setScheduling({ open: true, property, date: '', time: '', note: '' });
  };

  const closeScheduleModal = () => {
    setScheduling({ open: false, property: null, date: '', time: '', note: '' });
  };

  const submitSchedule = async () => {
    if (!scheduling.property) return;
    try {
      if (!scheduling.date || !scheduling.time) {
        alert('Please select date and time');
        return;
      }
      // Prevent past selections (local system time)
      const scheduledAt = new Date(`${scheduling.date}T${scheduling.time}:00`);
      const now = new Date();
      if (scheduledAt.getTime() <= now.getTime()) {
        alert('Cannot schedule a visit in the past or present. Please select a future time.');
        return;
      }
      const res = await visitAPI.createVisitRequest({ propertyId: scheduling.property._id, scheduledAt, note: scheduling.note });
      if (res.success) {
        alert('Visit request sent for approval');
        closeScheduleModal();
      }
    } catch (e) {
      console.error('Failed to create visit request', e);
      alert('Failed to send request');
    }
  };

  // Derive filtered list from properties and search term
  useEffect(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) {
      setFilteredProperties(properties);
      setVisibleCount(9);
      return;
    }
    const next = properties.filter(p => {
      const title = (p.title || '').toLowerCase();
      const street = (p.address?.street || '').toLowerCase();
      const city = (p.address?.city || '').toLowerCase();
      const state = (p.address?.state || '').toLowerCase();
      const zip = (p.address?.zipCode || '').toLowerCase();
      const haystack = `${title} ${street} ${city} ${state} ${zip}`.trim();
      return haystack.includes(q);
    });
    setFilteredProperties(next);
    setVisibleCount(9);
  }, [searchTerm, properties]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OwnSpace</h1>
                <p className="text-xs text-gray-500">Find Your Dream Home</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/appointments'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Appointments
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Find Properties</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <select
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Saved Properties Quick Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/saved-properties')}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Saved Properties</h3>
                <p className="text-sm text-gray-600">View your favorites</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Edit your details</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-600">View your visits</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/property-history')}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">View History</h3>
                <p className="text-sm text-gray-600">Track your activity</p>
              </div>
            </button>
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
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div onClick={() => handlePropertyView(property._id)}>
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <>
                      <img
                        src={property.images[0].url}
                        alt={property.images[0].alt || property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', property.images[0].url?.substring(0, 50) + '...');
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.fallback-placeholder').style.display = 'flex';
                        }}
                      />
                      <div className="fallback-placeholder w-full h-full flex items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                        <Home className="h-12 w-12 text-gray-400" />
                        <span className="ml-2 text-gray-500 text-sm">Your uploaded image failed to load</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                      <span className="ml-2 text-gray-500 text-sm">No image uploaded</span>
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
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
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {property.propertyType}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} bath</span>
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
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => openScheduleModal(property)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                    >
                      Schedule Visit
                    </button>
                    <button
                      onClick={() => handlePropertyView(property._id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && visibleProperties.length < filteredProperties.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount(c => c + 9)}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {scheduling.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Visit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduling.date}
                  onChange={(e) => setScheduling(prev => ({ ...prev, date: e.target.value }))}
                  min={minDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduling.time}
                  onChange={(e) => setScheduling(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  rows="3"
                  value={scheduling.note}
                  onChange={(e) => setScheduling(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional details"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={closeScheduleModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={submitSchedule} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
