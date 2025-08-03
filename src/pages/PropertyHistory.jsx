import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  ArrowLeft, 
  Eye, 
  Clock, 
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ContactNavbar from '../components/ContactNavbar';

const PropertyHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock property viewing history data
  const viewHistory = [
    {
      id: 1,
      propertyId: 101,
      title: "Modern Villa with Garden",
      price: 850000,
      location: "Downtown, City Center",
      viewedAt: "2025-03-12T14:30:00Z",
      duration: "5 minutes",
      action: "viewed",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      propertyId: 102,
      title: "Luxury Apartment",
      price: 420000,
      location: "Business District",
      viewedAt: "2025-03-11T10:15:00Z",
      duration: "8 minutes",
      action: "saved",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      propertyId: 103,
      title: "Cozy Family Home",
      price: 320000,
      location: "Suburban Area",
      viewedAt: "2025-03-10T16:45:00Z",
      duration: "12 minutes",
      action: "contacted_agent",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      propertyId: 104,
      title: "Downtown Condo",
      price: 280000,
      location: "City Center",
      viewedAt: "2025-03-09T09:20:00Z",
      duration: "3 minutes",
      action: "viewed",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      propertyId: 105,
      title: "Suburban House",
      price: 450000,
      location: "Residential Area",
      viewedAt: "2025-03-08T13:10:00Z",
      duration: "15 minutes",
      action: "scheduled_visit",
      image: "/api/placeholder/300/200"
    }
  ];

  const getActionColor = (action) => {
    switch (action) {
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'saved': return 'bg-green-100 text-green-800';
      case 'contacted_agent': return 'bg-purple-100 text-purple-800';
      case 'scheduled_visit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'viewed': return 'Viewed';
      case 'saved': return 'Saved';
      case 'contacted_agent': return 'Contacted Agent';
      case 'scheduled_visit': return 'Scheduled Visit';
      default: return action;
    }
  };

  const filteredHistory = viewHistory.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && item.action === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
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
              <h1 className="text-3xl font-bold text-gray-900">Property History</h1>
              <p className="text-gray-600 mt-2">Your property viewing and interaction history</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Actions</option>
                  <option value="viewed">Viewed Only</option>
                  <option value="saved">Saved Only</option>
                  <option value="contacted_agent">Contacted Agent</option>
                  <option value="scheduled_visit">Scheduled Visits</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                      <Eye className="h-8 w-8 text-gray-500" />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{item.location}</span>
                        </div>
                        <div className="text-xl font-bold text-green-600 mb-2">
                          ${item.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(item.action)}`}>
                          {getActionText(item.action)}
                        </span>
                      </div>
                    </div>

                    {/* Viewing Details */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(item.viewedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Viewed for {item.duration}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(`/properties/${item.propertyId}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Again</span>
                      </button>
                      
                      {item.action === 'viewed' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                          Save Property
                        </button>
                      )}
                      
                      {item.action === 'saved' && (
                        <button className="px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors text-sm">
                          Already Saved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No viewing history</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? "No properties match your current filters."
                : "You haven't viewed any properties yet. Start browsing to build your history!"
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
        {filteredHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Viewing Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{viewHistory.length}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {viewHistory.filter(item => item.action === 'saved').length}
                </div>
                <div className="text-sm text-gray-600">Properties Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {viewHistory.filter(item => item.action === 'contacted_agent').length}
                </div>
                <div className="text-sm text-gray-600">Agents Contacted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {viewHistory.filter(item => item.action === 'scheduled_visit').length}
                </div>
                <div className="text-sm text-gray-600">Visits Scheduled</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyHistory;