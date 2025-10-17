import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle,
  RefreshCw,
  Eye,
  Building,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import { offerAPI } from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown';

const PurchaseManagement = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [advancePaidOffers, setAdvancePaidOffers] = useState([]);
  const [advancePaidLoading, setAdvancePaidLoading] = useState(true);
  const [advancePaidError, setAdvancePaidError] = useState('');
  const [markingSold, setMarkingSold] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'advance_paid', 'sold'

  const fetchAdvancePaidOffers = useCallback(async () => {
    setAdvancePaidLoading(true);
    try {
      const res = await offerAPI.getAdvancePaidOffers();
      const list = Array.isArray(res?.data?.offers) ? res.data.offers : Array.isArray(res?.offers) ? res.offers : [];
      const normalized = Array.isArray(list) ? [...list].sort((a, b) => {
        const aSold = ((a?.propertyId?.status || '').toLowerCase() === 'sold') ? 1 : 0;
        const bSold = ((b?.propertyId?.status || '').toLowerCase() === 'sold') ? 1 : 0;
        return aSold - bSold;
      }) : [];
      setAdvancePaidOffers(normalized);
      setAdvancePaidError('');
    } catch (error) {
      console.error('Error fetching advance-paid offers:', error);
      setAdvancePaidOffers([]);
      setAdvancePaidError('Failed to load advance-paid properties.');
    } finally {
      setAdvancePaidLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvancePaidOffers();
  }, [fetchAdvancePaidOffers]);

  const handleMarkAsSold = useCallback(async (offerId) => {
    if (!offerId) return;
    setMarkingSold(prev => ({ ...prev, [offerId]: true }));
    try {
      const res = await offerAPI.markOfferAsSold(offerId);
      if (res?.success) {
        await fetchAdvancePaidOffers();
      } else {
        setAdvancePaidError('Failed to mark property as sold.');
      }
    } catch (error) {
      console.error('Error marking as sold:', error);
      setAdvancePaidError('Failed to mark property as sold.');
    } finally {
      setMarkingSold(prev => {
        const next = { ...prev };
        delete next[offerId];
        return next;
      });
    }
  }, [fetchAdvancePaidOffers]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter offers based on search term and status
  const filteredOffers = advancePaidOffers.filter(offer => {
    const property = offer?.propertyId || {};
    const buyer = offer?.investorId || {};
    const propertyStatus = (property.status || '').toLowerCase();
    
    // Status filter
    if (statusFilter === 'advance_paid' && propertyStatus === 'sold') return false;
    if (statusFilter === 'sold' && propertyStatus !== 'sold') return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const propertyTitle = (property.title || '').toLowerCase();
      const buyerName = (buyer.name || '').toLowerCase();
      const buyerEmail = (buyer.email || '').toLowerCase();
      const city = (property.address?.city || '').toLowerCase();
      
      return propertyTitle.includes(searchLower) || 
             buyerName.includes(searchLower) || 
             buyerEmail.includes(searchLower) ||
             city.includes(searchLower);
    }
    
    return true;
  });

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
                <span className="text-lg font-semibold text-gray-900">Purchase Management</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Purchase Management</h1>
              <p className="text-gray-600 mt-1">Manage advance-paid properties and finalize sales</p>
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
                      placeholder="Search properties, buyers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Properties</option>
                    <option value="advance_paid">Advance Paid</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchAdvancePaidOffers}
                  disabled={advancePaidLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${advancePaidLoading ? 'animate-spin' : ''}`} />
                  <span>{advancePaidLoading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {advancePaidError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {advancePaidError}
              </div>
            )}

            {/* Purchase Management Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Advance Paid Properties</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredOffers.length} properties found
                      {searchTerm && ` matching "${searchTerm}"`}
                      {statusFilter !== 'all' && ` with status "${statusFilter.replace('_', ' ')}"`}
                    </p>
                  </div>
                </div>

                {advancePaidLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
                    <div className="mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                    Loading advance-paid properties...
                  </div>
                ) : filteredOffers.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-12 text-center text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No properties match your search criteria.' 
                      : 'No advance-paid properties awaiting sale finalization.'
                    }
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOffers.map((offer) => {
                      const property = offer?.propertyId || {};
                      const buyer = offer?.investorId || {};
                      const status = (property.status || '').toLowerCase();
                      const sold = status === 'sold';
                      const addressParts = [property.address?.street, property.address?.city, property.address?.state, property.address?.zipCode].filter(Boolean);

                      return (
                        <div key={offer._id} className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{property.title || 'Untitled Property'}</h3>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${sold ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {sold ? '✅ Sold' : '💰 Advance Paid'}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{addressParts.join(', ') || 'Address not available'}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1">Property Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Price:</span> ₹{property.price?.toLocaleString('en-IN') || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Type:</span> {property.propertyType || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Status:</span> <span className={`font-medium ${sold ? 'text-green-600' : 'text-blue-600'}`}>{(property.status || 'N/A').toUpperCase()}</span></p>
                                    <p><span className="font-medium text-gray-700">Agent:</span> {property.agent?.name || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Agent Email:</span> {property.agent?.email || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                {/* Buyer Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1">Buyer Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Name:</span> {buyer.name || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Email:</span> {buyer.email || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Phone:</span> {buyer.phone || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Address:</span> {[buyer.address?.street, buyer.address?.city, buyer.address?.state, buyer.address?.zipCode].filter(Boolean).join(', ') || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Details */}
                              {offer.paymentDetails && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <p><span className="font-medium text-gray-700">Amount:</span> ₹{offer.paymentDetails.amount?.toLocaleString('en-IN') || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Method:</span> {offer.paymentDetails.method || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Payment ID:</span> {offer.paymentDetails.paymentId || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Date:</span> {offer.paymentDetails.date ? new Date(offer.paymentDetails.date).toLocaleDateString() : 'N/A'}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 lg:w-48">
                              <button
                                onClick={() => handleMarkAsSold(offer._id)}
                                disabled={sold || markingSold[offer._id]}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                  sold 
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                } ${markingSold[offer._id] ? 'opacity-70' : ''}`}
                              >
                                {markingSold[offer._id] ? (
                                  <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                    Processing...
                                  </span>
                                ) : sold ? (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    Sold
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    Mark as Sold
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => navigate(`/property/${property._id}`)}
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

export default PurchaseManagement;