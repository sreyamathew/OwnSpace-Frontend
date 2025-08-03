import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  TrendingUp, 
  Download,
  DollarSign,
  MapPin,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  LogOut,
  Building,
  Phone,
  Mail,
  Star,
  FileText,
  Camera,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AgentSidebar from '../components/AgentSidebar';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('Mar 6, 2025 - Mar 12, 2025');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for agent dashboard
  const agentStats = {
    totalProperties: {
      count: 24,
      change: 12.5,
      trend: 'up'
    },
    activeListings: {
      count: 18,
      change: 8.3,
      trend: 'up'
    },
    monthlyCommission: {
      amount: 45600,
      change: 15.7,
      trend: 'up'
    },
    clientMeetings: {
      count: 12,
      change: -5.2,
      trend: 'down'
    }
  };

  const recentProperties = [
    {
      id: 1,
      title: "Modern Villa in Downtown",
      price: 850000,
      location: "Downtown, City Center",
      status: "active",
      views: 245,
      inquiries: 12,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Cozy Family Home",
      price: 425000,
      location: "Suburban Area",
      status: "pending",
      views: 189,
      inquiries: 8,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Luxury Apartment",
      price: 320000,
      location: "Business District",
      status: "sold",
      views: 156,
      inquiries: 15,
      image: "/api/placeholder/300/200"
    }
  ];

  const pendingVisits = [
    {
      id: 1,
      clientName: "John Smith",
      propertyTitle: "Modern Villa in Downtown",
      date: "2025-03-15",
      time: "10:00 AM",
      phone: "+1 (555) 123-4567",
      status: "pending"
    },
    {
      id: 2,
      clientName: "Sarah Johnson",
      propertyTitle: "Cozy Family Home",
      date: "2025-03-16",
      time: "2:00 PM",
      phone: "+1 (555) 987-6543",
      status: "pending"
    },
    {
      id: 3,
      clientName: "Mike Davis",
      propertyTitle: "Luxury Apartment",
      date: "2025-03-17",
      time: "11:30 AM",
      phone: "+1 (555) 456-7890",
      status: "pending"
    }
  ];

  const handleApproveVisit = (visitId) => {
    console.log(`Approving visit ${visitId}`);
    // In real app, this would call API to approve visit
  };

  const handleRejectVisit = (visitId) => {
    console.log(`Rejecting visit ${visitId}`);
    // In real app, this would call API to reject visit
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Manage your properties and clients.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{dateRange}</span>
              </div>
              <button
                onClick={() => navigate('/agent/properties/add')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </button>
              <button
                onClick={() => navigate('/agent/profile')}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{agentStats.totalProperties.count}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{agentStats.totalProperties.change}%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{agentStats.activeListings.count}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{agentStats.activeListings.change}%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Commission</p>
                  <p className="text-2xl font-bold text-gray-900">${(agentStats.monthlyCommission.amount / 1000).toFixed(1)}K</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{agentStats.monthlyCommission.change}%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Client Meetings</p>
                  <p className="text-2xl font-bold text-gray-900">{agentStats.clientMeetings.count}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-red-600">-{Math.abs(agentStats.clientMeetings.change)}%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
                <button
                  onClick={() => navigate('/agent/properties')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600">{property.location}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-green-600">${property.price.toLocaleString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        {property.views}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {property.inquiries}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Property Visits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Pending Property Visits</h3>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pendingVisits.length} Pending
                </span>
              </div>
              <div className="space-y-4">
                {pendingVisits.map((visit) => (
                  <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{visit.clientName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{visit.propertyTitle}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {visit.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {visit.time}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {visit.phone}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApproveVisit(visit.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Approve Visit"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectVisit(visit.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject Visit"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                <p className="text-gray-600">Your sales and commission trends</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === 'sales' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab('commission')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === 'commission' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Commission
                </button>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600">Performance chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;