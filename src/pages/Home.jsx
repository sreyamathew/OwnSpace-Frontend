import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  ArrowRight,
  ChevronDown,
  Bed,
  Bath,
  Heart,
  Home as HomeIcon
} from 'lucide-react';
import { propertyAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchData.location) queryParams.set('location', searchData.location);
    if (searchData.propertyType) queryParams.set('propertyType', searchData.propertyType);
    if (searchData.priceRange) queryParams.set('priceRange', searchData.priceRange);

    navigate(`/properties?${queryParams.toString()}`);
  };

  useEffect(() => {
    const loadAvailableLocations = async () => {
      try {
        const response = await propertyAPI.getAllProperties({ limit: 200 });
        if (response?.success) {
          const cities = (response.data?.properties || [])
            .map((property) => property?.address?.city)
            .filter(Boolean);

          const uniqueSortedCities = [...new Set(cities)].sort((a, b) => a.localeCompare(b));
          setAvailableLocations(uniqueSortedCities);
        }
      } catch (error) {
        console.error('Failed to load locations for home search:', error);
      }
    };

    loadAvailableLocations();
  }, []);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        setFeaturedLoading(true);
        const response = await propertyAPI.getAllProperties({ limit: 6 });
        if (response?.success) {
          setFeaturedProperties(response.data?.properties || []);
        }
      } catch (error) {
        console.error('Failed to load featured properties:', error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Finding Your Dream
                <span className="block">Property Is Simple</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                OwnSpace is your trusted partner for buying, selling, and investing in real estate.
                Discover thousands of premium properties across Kerala and India.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <select
                        value={searchData.location}
                        onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/50 focus:border-transparent text-gray-900 appearance-none"
                      >
                        <option value="">Any Location</option>
                        {availableLocations.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <div className="relative">
                      <select
                        value={searchData.propertyType}
                        onChange={(e) => setSearchData({...searchData, propertyType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/50 focus:border-transparent text-gray-900 appearance-none"
                      >
                        <option value="">Any Type</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Land">Land</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <select
                        value={searchData.priceRange}
                        onChange={(e) => setSearchData({...searchData, priceRange: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/50 focus:border-transparent text-gray-900 appearance-none"
                      >
                        <option value="">Any Budget</option>
                        <option value="0-500000">₹0 - ₹5L</option>
                        <option value="500000-1000000">₹5L - ₹10L</option>
                        <option value="1000000-2500000">₹10L - ₹25L</option>
                        <option value="2500000-5000000">₹25L - ₹50L</option>
                        <option value="5000000-10000000">₹50L - ₹1Cr</option>
                        <option value="10000000-25000000">₹1Cr - ₹2.5Cr</option>
                        <option value="25000000-50000000">₹2.5Cr - ₹5Cr</option>
                        <option value="50000000-999999999">₹5Cr+</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleSearch}
                      className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
                    >
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Viewed Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Most Viewed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a range of vacation homes worldwide. Book securely and get expert customer support for a stress-free stay.
            </p>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No properties available right now.</div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
                    alt={property.title}
                    className="w-full h-52 sm:h-56 lg:h-64 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500 truncate pr-2">
                      {[property.address?.street, property.address?.city, property.address?.state].filter(Boolean).join(', ') || 'Location unavailable'}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{property.bedrooms || '-'}</span>
                      <Bath className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-600">{property.bathrooms || '-'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{property.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(property.price)}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{property.area ? `${property.area} sq ft` : 'Area N/A'}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Pagination dots */}
          <div className="flex justify-center mt-12 space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* The Easiest Method Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Modern House Interior"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <HomeIcon className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">Premium Properties</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                The Easiest Method
                <span className="block">To Find a House</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform makes finding your dream home effortless. With advanced search filters,
                virtual tours, and expert guidance, we simplify the entire process from search to settlement.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700">Browse thousands of verified properties</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700">Schedule virtual or in-person tours</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700">Get expert assistance throughout the process</p>
                </div>
              </div>
              <Link
                to="/properties"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Start Your Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
