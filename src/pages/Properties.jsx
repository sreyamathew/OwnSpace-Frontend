import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  TrendingUp,
  Shield,
  Star,
  Eye,
  Calendar
} from 'lucide-react';
import { propertyAPI, visitAPI, authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Properties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableLocations, setAvailableLocations] = useState([]);
  const [scheduling, setScheduling] = useState({ open: false, property: null, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: false });
  // Compute local today string (YYYY-MM-DD) to restrict past dates
  const todayLocal = new Date();
  const minDate = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      const res = await authAPI.getSaved();
      if (res.success) setSavedProperties(res.data || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const toggleSaveProperty = async (propertyId) => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please login to save properties');
      return;
    }

    try {
      const isSaved = savedProperties.some(p => p._id === propertyId);
      
      if (isSaved) {
        await authAPI.removeSaved(propertyId);
        setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
      } else {
        await authAPI.addSaved(propertyId);
        const propertyToSave = properties.find(p => p._id === propertyId);
        if (propertyToSave) setSavedProperties(prev => [...prev, propertyToSave]);
      }
    } catch (error) {
      console.error('Error toggling save property:', error);
    }
  };

  const isPropertySaved = (propertyId) => {
    return savedProperties.some(p => p._id === propertyId);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const openScheduleModal = async (property) => {
    if (!user) {
      alert('Please login to schedule a visit');
      navigate('/login');
      return;
    }
    setScheduling({ open: true, property, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: true });
    try {
      const res = await visitAPI.getAvailability(property._id);
      if (res.success) {
        setScheduling(prev => ({ ...prev, availableDates: res.data.availableDates || [], slotsByDate: res.data.slotsByDate || {}, loading: false }));
      } else {
        setScheduling(prev => ({ ...prev, loading: false }));
      }
    } catch (e) {
      console.error('Failed to load availability', e);
      setScheduling(prev => ({ ...prev, loading: false }));
    }
  };

  const closeScheduleModal = () => {
    setScheduling({ open: false, property: null, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: false });
  };

  const isPastSlot = (dateStr, startTime) => {
    try {
      const slotDate = new Date(`${dateStr}T${startTime}:00`);
      const now = new Date();
      return slotDate.getTime() <= now.getTime();
    } catch (_) { return false; }
  };

  const submitSchedule = async () => {
    if (!scheduling.property) return;
    try {
      if (!scheduling.date || !scheduling.time) {
        alert('Please select an available date and time');
        return;
      }
      // Prevent past selections (local system time)
      const scheduledAt = new Date(`${scheduling.date}T${scheduling.time}:00`);
      const now = new Date();
      if (scheduledAt.getTime() <= now.getTime()) {
        alert('Selected time has already passed. Please choose a future slot.');
        return;
      }
      const res = await visitAPI.createVisitRequest({ propertyId: scheduling.property._id, scheduledAt, note: scheduling.note });
      if (res.success) {
        alert('Visit request sent for approval');
        try {
          const key = `recentlyViewed_${user.id}`;
          const raw = localStorage.getItem(key) || '[]';
          let list = [];
          try { list = JSON.parse(raw); if (!Array.isArray(list)) list = []; } catch (_) { list = []; }
          const historyItem = {
            propertyId: scheduling.property._id,
            title: scheduling.property.title,
            price: scheduling.property.price,
            location: `${scheduling.property.address?.city || ''}${scheduling.property.address?.state ? ', ' + scheduling.property.address.state : ''}`.trim(),
            viewedAt: new Date().toISOString(),
            image: scheduling.property.images?.[0]?.url || null,
            action: 'visit_requested'
          };
          const updated = [historyItem, ...list];
          localStorage.setItem(key, JSON.stringify(updated));
        } catch (_) {}
        closeScheduleModal();
      }
    } catch (e) {
      console.error('Failed to create visit request', e);
      alert('Failed to send request');
    }
  };

  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties(filterParams);

      if (response.success) {
        const fetchedProperties = response.data.properties || [];
        setProperties(fetchedProperties);
        setFilteredProperties(fetchedProperties); // Initialize filtered properties with all properties
        
        // Extract unique locations from fetched properties
        const locations = [...new Set(fetchedProperties.map(p => p.address?.city).filter(Boolean))];
        setAvailableLocations(locations);
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

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    // Apply filters immediately for better user experience
    if (value !== '') {
      // If a filter is being set, apply it immediately
      const updatedFilters = { ...filters, [filterName]: value };
      handleSearchWithFilters(updatedFilters);
    } else {
      // If a filter is being cleared, reapply remaining filters
      const updatedFilters = { ...filters, [filterName]: value };
      if (updatedFilters.propertyType || updatedFilters.priceRange || updatedFilters.bedrooms || updatedFilters.location) {
        handleSearchWithFilters(updatedFilters);
      } else {
        // No filters left, reset to all properties
        resetAllFilters();
      }
    }
  };

  const handleSearchWithFilters = async (currentFilters) => {
    // Build filter parameters for API call
    const filterParams = {};
    
    if (currentFilters.propertyType) {
      filterParams.propertyType = currentFilters.propertyType;
    }
    
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split('-').map(val => {
        if (val === '999999999') return '';
        return val;
      });
      if (min) filterParams.minPrice = min;
      if (max && max !== '999999999') filterParams.maxPrice = max;
    }
    
    if (currentFilters.bedrooms) {
      filterParams.bedrooms = currentFilters.bedrooms;
    }
    
    if (currentFilters.location) {
      filterParams.city = currentFilters.location;
    }
    
    // Add sorting parameter
    if (sortBy !== 'relevance') {
      filterParams.sortBy = sortBy;
    }
    
    console.log('Fetching properties with filters:', filterParams);
    
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties(filterParams);
      
      if (response.success) {
        const fetchedProperties = response.data.properties || [];
        setProperties(fetchedProperties);
        setFilteredProperties(fetchedProperties);
        
        // Extract unique locations from fetched properties
        const locations = [...new Set(fetchedProperties.map(p => p.address?.city).filter(Boolean))];
        setAvailableLocations(locations);
      } else {
        setError('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching filtered properties:', error);
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const resetAllFilters = async () => {
    const resetFilters = {
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      location: ''
    };
    setFilters(resetFilters);
    setSearchTerm('');
    setSortBy('relevance');
    
    // Reset to show all properties by refetching without filters
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties({});
      
      if (response.success) {
        const fetchedProperties = response.data.properties || [];
        setProperties(fetchedProperties);
        setFilteredProperties(fetchedProperties);
        
        // Extract unique locations from fetched properties
        const locations = [...new Set(fetchedProperties.map(p => p.address?.city).filter(Boolean))];
        setAvailableLocations(locations);
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

  const handleSortChange = (value) => {
    setSortBy(value);
    // Apply filters immediately when sorting changes
    if (filters.propertyType || filters.priceRange || filters.bedrooms || filters.location) {
      handleSearch();
    } else {
      // If no filters are applied, just re-sort the current properties
      applyFilters(filters, value, searchTerm, false);
    }
  };

  const applyFilters = (currentFilters, currentSort, overrideSearchTerm, applyFacetFilters = true) => {
    // Always start with the original properties list
    let filteredProperties = [...properties];
    
    console.log('Starting with original properties:', properties.length);
    console.log('Current filters:', currentFilters);
    const effectiveSearch = overrideSearchTerm !== undefined ? overrideSearchTerm : searchTerm;
    console.log('Search term:', effectiveSearch);
    
    // Apply search filter (by property name and full location)
    if (effectiveSearch) {
      const q = effectiveSearch.trim().toLowerCase();
      filteredProperties = filteredProperties.filter(property => {
        const name = (property.title || '').toLowerCase();
        const street = (property.address?.street || '').toLowerCase();
        const city = (property.address?.city || '').toLowerCase();
        const state = (property.address?.state || '').toLowerCase();
        const zip = (property.address?.zipCode || '').toLowerCase();
        const combinedLocation = `${street} ${city} ${state} ${zip}`.trim();
        const haystack = `${name} ${combinedLocation}`.trim();
        return haystack.includes(q);
      });
      console.log('After search filter:', filteredProperties.length);
    }

    // Apply property type filter - only filter if a specific type is selected
    if (applyFacetFilters && currentFilters.propertyType && currentFilters.propertyType !== '') {
      filteredProperties = filteredProperties.filter(property =>
        property.propertyType.toLowerCase() === currentFilters.propertyType.toLowerCase()
      );
      console.log('After property type filter:', filteredProperties.length);
    }

    // Apply price range filter - only filter if a specific range is selected
    if (applyFacetFilters && currentFilters.priceRange && currentFilters.priceRange !== '') {
      const [min, max] = currentFilters.priceRange.split('-').map(val => {
        if (val === '999999999') return Infinity;
        return parseFloat(val);
      });
      
      filteredProperties = filteredProperties.filter(property => {
        const price = property.price;
        if (max === Infinity) return price >= min;
        return price >= min && price <= max;
      });
      console.log('After price range filter:', filteredProperties.length);
    }

    // Apply bedrooms filter - only filter if a specific count is selected
    if (applyFacetFilters && currentFilters.bedrooms && currentFilters.bedrooms !== '') {
      const minBedrooms = parseInt(currentFilters.bedrooms);
      filteredProperties = filteredProperties.filter(property =>
        property.bedrooms >= minBedrooms
      );
      console.log('After bedrooms filter:', filteredProperties.length);
    }

    // Apply location filter - only filter if a specific location is selected
    if (applyFacetFilters && currentFilters.location && currentFilters.location !== '') {
      filteredProperties = filteredProperties.filter(property =>
        property.address?.city === currentFilters.location
      );
      console.log('After location filter:', filteredProperties.length);
    }

    // Apply sorting
    switch (currentSort) {
      case 'price-low-high':
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredProperties.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filteredProperties.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    console.log('Final filtered properties:', filteredProperties.length);
    setFilteredProperties(filteredProperties);
  };

  const handleSearch = async () => {
    // Use the shared filter function
    handleSearchWithFilters(filters);
  };

  // Update search term and apply filters
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    
    // If there are active filters, apply them with the new search term
    if (filters.propertyType || filters.priceRange || filters.bedrooms || filters.location) {
      // Apply search filter to current filtered results
      applyFilters(filters, sortBy, value, false);
    } else {
      // No filters, just apply search to all properties
      applyFilters(filters, sortBy, value, false);
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

  const staticProperties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'Downtown, New York',
      price: 850000,
      predictedPrice: 920000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      riskLevel: 'Low',
      roi: 8.5,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      features: ['Parking', 'Gym', 'Pool', 'Security'],
      agent: {
        name: 'Sarah Johnson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      }
    },
    {
      id: 2,
      title: 'Luxury Villa with Garden',
      location: 'Beverly Hills, CA',
      price: 2500000,
      predictedPrice: 2750000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      riskLevel: 'Medium',
      roi: 12.2,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      features: ['Garden', 'Pool', 'Garage', 'Security'],
      agent: {
        name: 'Michael Chen',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      }
    },
    {
      id: 3,
      title: 'Cozy Suburban House',
      location: 'Austin, TX',
      price: 450000,
      predictedPrice: 485000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      riskLevel: 'Low',
      roi: 7.8,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      features: ['Yard', 'Garage', 'Fireplace'],
      agent: {
        name: 'Emily Davis',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
      }
    },
    {
      id: 4,
      title: 'Penthouse with City View',
      location: 'Manhattan, NY',
      price: 3200000,
      predictedPrice: 3450000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      riskLevel: 'High',
      roi: 15.3,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      features: ['City View', 'Balcony', 'Concierge', 'Gym'],
      agent: {
        name: 'David Wilson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      }
    },
    {
      id: 5,
      title: 'Beachfront Condo',
      location: 'Miami Beach, FL',
      price: 1200000,
      predictedPrice: 1320000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      riskLevel: 'Medium',
      roi: 10.1,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      features: ['Beach Access', 'Pool', 'Spa', 'Parking'],
      agent: {
        name: 'Lisa Rodriguez',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      }
    },
    {
      id: 6,
      title: 'Historic Townhouse',
      location: 'Boston, MA',
      price: 950000,
      predictedPrice: 1050000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      riskLevel: 'Low',
      roi: 9.2,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      features: ['Historic', 'Fireplace', 'Hardwood', 'Parking'],
      agent: {
        name: 'James Thompson',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      }
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-primary-100">
              Discover properties with AI-powered insights and predictions
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by property name or location..."
                      value={searchTerm}
                      onChange={(e) => handleSearchTermChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 text-black"
                >
                  <option value="">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Other">Other</option>
                </select>
                <button 
                  onClick={handleSearch}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Filters:</span>
                </div>
                <select 
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Other">Other</option>
                </select>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Price Ranges</option>
                  <option value="0-500000">₹0 - ₹5L</option>
                  <option value="500000-1000000">₹5L - ₹10L</option>
                  <option value="1000000-2500000">₹10L - ₹25L</option>
                  <option value="2500000-5000000">₹25L - ₹50L</option>
                  <option value="5000000-10000000">₹50L - ₹1Cr</option>
                  <option value="10000000-25000000">₹1Cr - ₹2.5Cr</option>
                  <option value="25000000-50000000">₹2.5Cr - ₹5Cr</option>
                  <option value="50000000-999999999">₹5Cr+</option>
                </select>
                <select 
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Bedrooms</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                  <option value="6">6+ Bedrooms</option>
                </select>
                <select 
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Locations</option>
                  {availableLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              {/* Reset Filters Button */}
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h2>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Property Grid */}
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
              <p className="text-gray-600">No properties found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2">
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
                  <button 
                    onClick={() => toggleSaveProperty(property._id)}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors duration-200 ${
                      isPropertySaved(property._id) ? 'bg-red-100 hover:bg-red-200' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isPropertySaved(property._id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                  </button>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                    {property.propertyType}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.address.city}, {property.address.state}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {property.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.area} sq ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{property.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={property.agent.image}
                        alt={property.agent.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          {property.agent.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(property._id)}
                      className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                      View Details
                    </button>
                    <button onClick={() => openScheduleModal(property)} className="flex-1 border border-gray-900 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
              Load More Properties
            </button>
          </div>
        </div>
      </section>
      {/* Schedule Modal */}
      {scheduling.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Visit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  value={scheduling.date}
                  onChange={(e) => setScheduling(prev => ({ ...prev, date: e.target.value, time: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                >
                  <option value="" disabled>{scheduling.loading ? 'Loading...' : 'Select a date'}</option>
                  {scheduling.availableDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {(scheduling.date && scheduling.slotsByDate[scheduling.date] ? scheduling.slotsByDate[scheduling.date] : []).length === 0 ? (
                    <div className="col-span-3 text-sm text-gray-500">{scheduling.date ? 'No slots available for this date' : 'Select a date first'}</div>
                  ) : (
                    scheduling.slotsByDate[scheduling.date].map((slot) => {
                      const disabled = isPastSlot(scheduling.date, slot.startTime);
                      return (
                        <button
                          key={slot.slotId}
                          onClick={() => !disabled && setScheduling(prev => ({ ...prev, time: slot.startTime }))}
                          disabled={disabled}
                          className={`px-3 py-2 border rounded-md text-sm ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : (scheduling.time === slot.startTime ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50')}`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  rows="3"
                  value={scheduling.note}
                  onChange={(e) => setScheduling(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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

export default Properties;
