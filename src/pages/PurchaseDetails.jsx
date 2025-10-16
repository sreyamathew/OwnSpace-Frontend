import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import DownloadReceiptButton from '../components/DownloadReceiptButton';
import { offerAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending (Requested Purchase)' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'advance', label: 'Advance Paid' },
];

const PurchaseDetails = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching user offers for user:', user?.name);
      
      // Check if user is authenticated
      if (!user) {
        setError('Please log in to view your purchase requests.');
        return;
      }
      
      // Fetch offers made by the current user
      const res = await offerAPI.getMyOffers();
      console.log('Offers response:', res);
      const list = res?.offers || res?.data?.offers || [];
      setOffers(Array.isArray(list) ? list : []);
      setError('');
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to fetch offers', e);
      // More specific error handling
      if (e.code === 'AUTH' || e.message?.includes('401')) {
        // Token expired or unauthorized: ensure local logout and navigate
        try { logout(); } catch (_) {}
        const from = encodeURIComponent('/purchase-details');
        setError('Authentication expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = `/login?expired=1&from=${from}`;
        }, 300);
      } else if (e.message?.includes('403')) {
        setError('Access denied. Please make sure you are logged in correctly.');
      } else if (e.code === 'NETWORK') {
        setError('Cannot reach the server. Please ensure the backend is running and try again.');
      } else {
        setError('Failed to load purchase requests. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user, fetchOffers]);

  useEffect(() => {
    if (user) {
      // Reduced polling frequency to 30 seconds; pause if last error was auth/network
      const id = setInterval(() => {
        // Avoid spamming when server is down or auth just expired
        if (error && (error.toLowerCase().includes('redirecting') || error.toLowerCase().includes('cannot reach'))) return;
        fetchOffers();
      }, 30000);
      return () => clearInterval(id);
    }
  }, [user, fetchOffers, error]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Any cleanup logic if needed
    };
  }, []);

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }), []);

  const filteredOffers = useMemo(() => {
    if (selectedFilter === 'all') return offers;
    const target = selectedFilter.toLowerCase();
    // normalize 'approved' vs 'accepted'
    return offers.filter(o => {
      const s = (o?.status || '').toLowerCase();
      if (target === 'accepted') return s === 'accepted' || s === 'approved';
      if (target === 'advance') return Boolean(o?.advancePaid);
      return s === target;
    });
  }, [offers, selectedFilter]);

  const renderStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'accepted' || s === 'approved') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="mr-1">🟢</span>Accepted</span>;
    }
    if (s === 'rejected') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><span className="mr-1">🔴</span>Rejected</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span className="mr-1">⚪</span>Pending</span>;
  };

  const Sidebar = () => (
    <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm z-10 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Purchase Filters</h2>
        <div className="space-y-2">
          {FILTERS.map(f => {
            const active = selectedFilter === f.key;
            const count = f.key === 'all' ? offers.length : offers.filter(o => {
              const s = (o?.status || '').toLowerCase();
              if (f.key === 'accepted') return s === 'accepted' || s === 'approved';
              if (f.key === 'advance') return Boolean(o?.advancePaid);
              return s === f.key;
            }).length;
            
            return (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{f.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );

  const MobileFilters = () => (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-16 z-10">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => {
          const active = selectedFilter === f.key;
          const count = f.key === 'all' ? offers.length : offers.filter(o => {
            const s = (o?.status || '').toLowerCase();
            if (f.key === 'accepted') return s === 'accepted' || s === 'approved';
            if (f.key === 'advance') return Boolean(o?.advancePaid);
            return s === f.key;
          }).length;
          
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-full border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              <div className="flex items-center gap-1">
                <span>{f.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const Content = () => (
    <section className="md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchase Details</h1>
              <p className="text-sm text-gray-600 mt-1">Track and filter your purchase requests</p>
              {user && (
                <p className="text-xs text-gray-500 mt-1">Logged in as: {user.name} ({user.email})</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchOffers}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{offers.length}</div>
                  <div className="text-xs text-gray-500">Total Requests</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MobileFilters />

        {/* Filter Summary */}
        {!loading && !error && offers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Showing {filteredOffers.length} of {offers.length} purchase requests
                </span>
                {selectedFilter !== 'all' && (
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    Filtered by: {FILTERS.find(f => f.key === selectedFilter)?.label}
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-600">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-500">Loading purchase requests...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium mb-2">Error Loading Data</div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <button 
              onClick={fetchOffers}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-gray-500 font-medium mb-2">No purchase requests found</div>
            <div className="text-gray-400 text-sm">
              {selectedFilter === 'all' 
                ? "You haven't made any purchase requests yet." 
                : `No ${selectedFilter} purchase requests found.`}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map(o => {
              const propertyTitle = o?.propertyId?.title || 'Unknown Property';
              const imageUrl = o?.propertyId?.images?.[0]?.url || o?.propertyId?.images?.[0] || '';
              const amount = typeof o?.offerAmount === 'number' ? formatCurrency.format(o.offerAmount) : 'N/A';
              const buyerName = o?.investorId?.name || 'Unknown Buyer';
              const submittedAt = o?.createdAt ? new Date(o.createdAt) : (o?.timestamp ? new Date(o.timestamp) : null);
              const preferred = o?.preferredDate ? new Date(o.preferredDate) : null;
              const propertyAddress = o?.propertyId?.address;
              const addressString = propertyAddress ? `${propertyAddress.city}, ${propertyAddress.state}` : 'Address not available';
              
              return (
                <div key={o._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={propertyTitle} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { 
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }} 
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center" style={{ display: imageUrl ? 'none' : 'flex' }}>
                        <div className="text-center text-gray-400">
                          <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                          </svg>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{propertyTitle}</h3>
                          <p className="text-sm text-gray-600 mb-2">{addressString}</p>
                        </div>
                        {o?.advancePaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <span className="mr-1">🔵</span>Advance Paid
                          </span>
                        ) : (
                          renderStatus(o?.status)
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Offer Amount</span>
                            <span className="font-semibold text-green-600">{amount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Buyer</span>
                            <span className="font-medium">{buyerName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Preferred Date for Advance Payment</span>
                            <span>{preferred ? preferred.toLocaleDateString() : 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Submitted</span>
                            <span>{submittedAt ? submittedAt.toLocaleDateString() : 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Time</span>
                            <span>{submittedAt ? submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Request ID</span>
                            <span className="font-mono text-xs text-gray-400">{o._id?.slice(-8) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {(o?.status && ['accepted','approved'].includes(o.status.toLowerCase())) && !o?.advancePaid && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Ready to proceed?</span>
                            <button
                              onClick={() => navigate(`/buyer-details/${o?.propertyId?._id || o?.propertyId}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75zm3 1.5A.75.75 0 018 7.5h8a.75.75 0 010 1.5H8a.75.75 0 01-.75-.75zm0 3A.75.75 0 018 10.5h8a.75.75 0 010 1.5H8a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h5a.75.75 0 010 1.5H8a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                              </svg>
                              Pay Advance ₹1,000
                            </button>
                          </div>
                        </div>
                      )}
                      {o?.advancePaid && (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🟢 Advance Paid
                          </span>
                          <DownloadReceiptButton offer={o} />
                        </div>
                      )}

                      {o?.message && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="text-gray-500 text-sm">Message:</span>
                          <div className="mt-1 text-gray-800 text-sm bg-gray-50 p-3 rounded-md">
                            {o.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <Sidebar />
      <Content />
      <Footer />
    </div>
  );
};

export default PurchaseDetails;


