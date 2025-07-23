import React, { useState } from 'react';
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

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    location: ''
  });

  const properties = [
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
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
                      placeholder="Search by location, property type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={filters.propertyType}
                  onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                </select>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
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
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Price Range</option>
                <option value="0-500k">$0 - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-2m">$1M - $2M</option>
                <option value="2m+">$2M+</option>
              </select>
              <select 
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Location</option>
                <option value="new-york">New York</option>
                <option value="california">California</option>
                <option value="texas">Texas</option>
                <option value="florida">Florida</option>
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {properties.length} Properties Found
            </h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>Sort by: Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Highest ROI</option>
            </select>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(property.riskLevel)}`}>
                    {property.riskLevel} Risk
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{formatPrice(property.price)}</div>
                      <div className="text-sm text-gray-500">
                        Predicted: {formatPrice(property.predictedPrice)}
                        <TrendingUp className="inline h-4 w-4 ml-1 text-green-500" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{property.roi}% ROI</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {property.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.area} sq ft</span>
                      </div>
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
                    <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200">
                      View Details
                    </button>
                    <button className="flex-1 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200">
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
              Load More Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;
