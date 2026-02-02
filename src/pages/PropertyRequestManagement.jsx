import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle,
  RefreshCw,
  Eye,
  Building,
  User,
  Menu,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  Clock,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import { offerAPI } from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown';

const PropertyRequestManagement = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await offerAPI.getAllOffers();
      console.log('API Response:', res); // Debug log
      
      // Handle different response structures
      let list = [];
      if (res?.success && Array.isArray(res?.data?.offers)) {
        list = res.data.offers;
      } else if (Array.isArray(res?.data?.offers)) {
        list = res.data.offers;
      } else if (Array.isArray(res?.offers)) {
        list = res.offers;
      } else if (Array.isArray(res)) {
        list = res;
      }
      
      const normalized = Array.isArray(list) ? [...list].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }) : [];
      
      setOffers(normalized);
      setError('');
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
      setError('Failed to load purchase requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleUpdateStatus = async (offerId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [offerId]: true }));
    try {
      await offerAPI.updateOfferStatus(offerId, newStatus);
      await fetchOffers(); // Refresh the list
    } catch (error) {
      console.error('Error updating offer status:', error);
      setError('Failed to update offer status.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [offerId]: false }));
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const filteredOffers = offers.filter(offer => {
    const user = offer.user || offer.investorId;
    const property = offer.property || offer.propertyId;
    
    const matchesSearch = !searchTerm || 
      property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      offer.status === activeTab || 
      (activeTab === 'approved' && offer.status === 'accepted');
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': 
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved':
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case 'accepted': return 'approved';
      default: return status;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Purchase Request Management</span>
              </div>
            </div>

            {/* Right side - Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              <NotificationDropdown />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/admin/profile')}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => navigate('/admin/settings')}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Purchase Request Management</h1>
              <p className="text-gray-600 mt-1">Review and manage property purchase requests</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by property, user, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchOffers}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Purchase Requests Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Purchase Requests</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredOffers.length} requests found
                      {searchTerm && ` matching "${searchTerm}"`}
                      {activeTab !== 'all' && ` with status "${activeTab}"`}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
                    <div className="mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                    Loading purchase requests...
                  </div>
                ) : filteredOffers.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-12 text-center text-sm text-gray-500">
                    {searchTerm || activeTab !== 'all' 
                      ? 'No requests match your search criteria.' 
                      : 'No purchase requests found.'
                    }
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOffers.map((offer) => {
                      const property = offer.property || offer.propertyId || {};
                      const buyer = offer.user || offer.investorId || {};
                      const agent = offer.agent || offer.agentId || {};

                      return (
                        <div key={offer._id} className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{property.title || 'Property Title Not Available'}</h3>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(offer.status)}`}>
                                  {getStatusIcon(offer.status)}
                                  <span className="ml-1 capitalize">{getDisplayStatus(offer.status)}</span>
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-4">
                                {property.location || 
                                 (property.address && typeof property.address === 'object' 
                                   ? [property.address.street, property.address.city, property.address.state, property.address.zipCode].filter(Boolean).join(', ')
                                   : property.address) || 
                                 'Location not available'}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1">Property Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Price:</span> ₹{property.price?.toLocaleString('en-IN') || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Type:</span> {property.propertyType || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Status:</span> <span className="font-medium text-blue-600">{(property.status || 'N/A').toUpperCase()}</span></p>
                                    <p><span className="font-medium text-gray-700">Agent:</span> {agent.name || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                {/* Buyer Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1">Buyer Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Name:</span> {buyer.name || 'Unknown User'}</p>
                                    <p><span className="font-medium text-gray-700">Email:</span> {buyer.email || 'No email'}</p>
                                    <p><span className="font-medium text-gray-700">Phone:</span> {buyer.phone || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Offer Amount:</span> ₹{offer.offerAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Message */}
                              {offer.message && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-2">Message from Buyer</h4>
                                  <p className="text-sm text-gray-700">{offer.message}</p>
                                </div>
                              )}

                              {/* Request Date */}
                              <div className="mt-4 text-sm text-gray-500">
                                <span className="font-medium">Request Date:</span> {new Date(offer.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 lg:w-48">
                              {offer.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(offer._id, 'approved')}
                                    disabled={updatingStatus[offer._id]}
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 ${updatingStatus[offer._id] ? 'opacity-70' : ''}`}
                                  >
                                    {updatingStatus[offer._id] ? (
                                      <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                        Processing...
                                      </span>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4" />
                                        Approve
                                      </>
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUpdateStatus(offer._id, 'rejected')}
                                    disabled={updatingStatus[offer._id]}
                                    className={`inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${updatingStatus[offer._id] ? 'opacity-70' : ''}`}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                              
                              <button
                                onClick={() => handleViewProperty(property._id)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View Property
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PropertyRequestManagement;