import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  ChevronDown,
  Bed,
  Bath,
  Square,
  Heart,
  Home as HomeIcon
} from 'lucide-react';

const Home = () => {
  const [searchData, setSearchData] = useState({
    location: '123Street',
    propertyType: 'Villa',
    priceRange: '₹ 950,000.00'
  });

  const featuredProperties = [
    {
      id: 1,
      title: 'Ocean Breeze Villa',
      location: 'Vintage Road, Alappuzha, KERALA',
      price: '₹9100000.00',
      bedrooms: 4,
      bathrooms: 2,
      area: '2500 sq ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      featured: true
    },
    {
      id: 2,
      title: 'Jackson House',
      location: 'Hill Top Avenue, Munnar, KERALA',
      price: '₹7500000.00',
      bedrooms: 3,
      bathrooms: 2,
      area: '2200 sq ft',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      featured: false
    },
    {
      id: 3,
      title: 'Lakeside Cottage',
      location: 'Vembanad Lake, Kumarakom, KERALA',
      price: '₹5400000.00',
      bedrooms: 3,
      bathrooms: 1,
      area: '1800 sq ft',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80',
      featured: false
    }
  ];

  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching with:', searchData);
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchData.location}
                        onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/50 focus:border-transparent text-gray-900"
                        placeholder="Enter city or area"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        <option>Villa</option>
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Cottage</option>
                        <option>Plot</option>
                        <option>Commercial</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchData.priceRange}
                        onChange={(e) => setSearchData({...searchData, priceRange: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="₹ 950,000.00"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">{property.location}</p>
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{property.bedrooms}</span>
                      <Bath className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-600">{property.bathrooms}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{property.price}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{property.area}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

export default Home;
