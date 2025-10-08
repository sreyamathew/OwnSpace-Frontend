import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { offerAPI } from '../services/api';
import { CheckCircle, XCircle, AlertCircle, Filter, Search, Building, User, DollarSign, Calendar, Clock, Eye, LogOut, Menu } from 'lucide-react';
import { toast } from 'react-hot-toast';
import OfferRequestsSection from '../components/OfferRequestsSection';
import MinimalSidebar from '../components/MinimalSidebar';
import AgentSidebar from '../components/AgentSidebar';

const FILTERS = [
  { key: 'all', label: 'All', count: 0 },
  { key: 'pending', label: 'Pending', count: 0 },
  { key: 'accepted', label: 'Accepted', count: 0 },
  { key: 'rejected', label: 'Rejected', count: 0 }
];

const PurchaseRequestManagement = () => {
  const { user, isAdmin, isAgent, logout } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isAdmin() || isAgent()) {
        try {
          // Prefer agent-specific endpoint when agent
          if (isAgent() && user?._id) {
            response = await offerAPI.getOffersByAgent(user._id);
          } else {
            response = await offerAPI.getOffersForMyProperties();
          }
        } catch (e) {
          console.warn('Received offers fetch failed, falling back to empty list:', e?.message);
          setOffers([]);
          setError('');
          setLoading(false);
          return;
        }
      } else {
        response = await offerAPI.getMyOffers();
      }
      
      const data = Array.isArray(response?.offers) ? response.offers : Array.isArray(response?.data?.offers) ? response.data.offers : [];
      setOffers(data);
      
      // Calculate filter counts
      const counts = {
        all: data.length,
        pending: data.filter(offer => ['pending', 'Pending'].includes(offer.status)).length,
        accepted: data.filter(offer => ['accepted', 'Approved'].includes(offer.status)).length,
        rejected: data.filter(offer => ['rejected', 'Rejected'].includes(offer.status)).length
      };
      setFilterCounts(counts);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setOffers([]);
      setError('Failed to load purchase requests. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user]);

  const handleStatusUpdate = async (offerId, status) => {
    try {
      await offerAPI.updateOfferStatus(offerId, status);
      
      // Update the offer in the list
      setOffers(prev => prev.map(offer => 
        offer._id === offerId 
          ? { ...offer, status: status === 'Approved' ? 'accepted' : 'rejected', updatedAt: new Date() }
          : offer
      ));
      
      // Update filter counts
      setFilterCounts(prev => {
        const newCounts = { ...prev };
        if (status === 'Approved') {
          newCounts.pending = Math.max(0, newCounts.pending - 1);
          newCounts.accepted += 1;
        } else if (status === 'Rejected') {
          newCounts.pending = Math.max(0, newCounts.pending - 1);
          newCounts.rejected += 1;
        }
        return newCounts;
      });
      
      toast.success(`Offer ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(`Error ${status.toLowerCase()}ing offer:`, err);
      toast.error(`Failed to ${status.toLowerCase()} offer. Please try again.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
      case 'Approved':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <span className="mr-2">🟢</span>
            <CheckCircle className="w-4 h-4 mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            <span className="mr-2">🔴</span>
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
            <span className="mr-2">🟡</span>
            <AlertCircle className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  const filteredOffers = offers.filter(offer => {
    // Status filter
    const statusMatch = selectedFilter === 'all' || 
      (selectedFilter === 'pending' && ['pending', 'Pending'].includes(offer.status)) ||
      (selectedFilter === 'accepted' && ['accepted', 'Approved'].includes(offer.status)) ||
      (selectedFilter === 'rejected' && ['rejected', 'Rejected'].includes(offer.status));
    
    // Search filter
    const searchMatch = !searchTerm || 
      offer.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.investorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.investorId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
              {isAdmin() ? <MinimalSidebar onClose={() => setSidebarOpen(false)} /> : <AgentSidebar />}
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        {isAdmin() ? (
          <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
            <MinimalSidebar />
          </div>
        ) : (
          <div className="hidden lg:block">
            <AgentSidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading purchase requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            {isAdmin() ? <MinimalSidebar onClose={() => setSidebarOpen(false)} /> : <AgentSidebar />}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {isAdmin() ? (
        <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
          <MinimalSidebar />
        </div>
      ) : (
        <div className="hidden lg:block">
          <AgentSidebar />
        </div>
      )}

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
                <span className="text-lg font-semibold text-gray-900">
                  {isAdmin() ? 'OwnSpace Admin' : 'OwnSpace Agent'}
                </span>
              </div>
            </div>

            {/* Right side - Title and Logout */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Purchase Management</h1>
                <p className="text-sm text-gray-600">Manage all purchase requests for your properties</p>
              </div>
              <button
                onClick={() => { logout(); }}
                className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{filterCounts.all}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{filterCounts.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{filterCounts.accepted}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{filterCounts.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedFilter === filter.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {filterCounts[filter.key] || 0}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by property, investor, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Purchase Requests ({filteredOffers.length})
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Showing {selectedFilter === 'all' ? 'all' : selectedFilter} requests
              </p>
            </div>

            {error && (
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {filteredOffers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'No requests match your search criteria.'
                    : 'No purchase requests found for the selected filter.'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <div key={offer._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      {/* Property Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="h-16 w-16 flex-shrink-0">
                          {offer.propertyId?.images?.[0] ? (
                            <img 
                              className="h-16 w-16 rounded-lg object-cover" 
                              src={offer.propertyId.images[0]} 
                              alt={offer.propertyId.title} 
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                              <Building className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {offer.propertyId?.title || 'Unknown Property'}
                            </h4>
                            {getStatusBadge(offer.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">${offer.propertyId?.price?.toLocaleString() || 'N/A'}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{offer.investorId?.name || 'Unknown Investor'}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{new Date(offer.createdAt || offer.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Offer Amount</span>
                              <span className="text-lg font-bold text-green-600">
                                ${offer.offerAmount?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                            
                            {offer.message && (
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Message:</span> {offer.message}
                              </p>
                            )}
                            
                            {offer.preferredDate && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Preferred Date:</span> {new Date(offer.preferredDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {['pending','Pending'].includes(offer.status) ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(offer._id, 'Approved')}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(offer._id, 'Rejected')}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {['accepted','Approved'].includes(offer.status) ? 'Approved' : 'Rejected'} on
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(offer.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        <button className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestManagement;
