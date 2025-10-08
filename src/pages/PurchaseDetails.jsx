import React, { useEffect, useMemo, useState } from 'react';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { offerAPI } from '../services/api';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending (Requested Purchase)' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

const PurchaseDetails = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // Try admin/agent view first
      let res = null;
      try {
        res = await offerAPI.getOffersForMyProperties();
      } catch (err) {
        // Fallback: user/buyer view
        res = await offerAPI.getMyOffers();
      }
      const list = res?.offers || res?.data?.offers || [];
      setOffers(Array.isArray(list) ? list : []);
      setError('');
    } catch (e) {
      console.error('Failed to fetch offers', e);
      setError('Failed to load purchase requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const id = setInterval(fetchOffers, 15000);
    return () => clearInterval(id);
  }, []);

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }), []);

  const filteredOffers = useMemo(() => {
    if (selectedFilter === 'all') return offers;
    const target = selectedFilter.toLowerCase();
    // normalize 'approved' vs 'accepted'
    return offers.filter(o => {
      const s = (o?.status || '').toLowerCase();
      if (target === 'accepted') return s === 'accepted' || s === 'approved';
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
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><span className="mr-1">🟡</span>Pending</span>;
  };

  const Sidebar = () => (
    <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Filters</h2>
        <div className="space-y-2">
          {FILTERS.map(f => {
            const active = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`w-full text-left px-3 py-2 rounded-md border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {f.label}
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
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-full border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const Content = () => (
    <section className="md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Purchase Details</h1>
          <p className="text-sm text-gray-600 mt-1">Track and filter your purchase requests.</p>
        </div>

        <MobileFilters />

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">{error}</div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">No purchase requests found for this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map(o => {
              const propertyTitle = o?.propertyId?.title || 'Unknown Property';
              const imageUrl = o?.propertyId?.images?.[0]?.url || o?.propertyId?.images?.[0] || '';
              const amount = typeof o?.offerAmount === 'number' ? formatCurrency.format(o.offerAmount) : 'N/A';
              const buyerName = o?.investorId?.name || 'Unknown Buyer';
              const submittedAt = o?.createdAt ? new Date(o.createdAt) : (o?.timestamp ? new Date(o.timestamp) : null);
              const preferred = o?.preferredDate ? new Date(o.preferredDate) : null;
              return (
                <div key={o._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-40 bg-gray-100">
                    {imageUrl ? (
                      <img src={imageUrl} alt={propertyTitle} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{propertyTitle}</h3>
                      {renderStatus(o?.status)}
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-500">Buyer</span>
                        <span className="font-medium">{buyerName}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-500">Offer</span>
                        <span className="font-medium">{amount}</span>
                      </div>
                      <div className="py-1">
                        <span className="text-gray-500">Message</span>
                        <div className="mt-1 text-gray-800 line-clamp-2" title={o?.message || ''}>{o?.message || '-'}</div>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-500">Preferred date</span>
                        <span>{preferred ? preferred.toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-500">Submitted</span>
                        <span>{submittedAt ? `${submittedAt.toLocaleDateString()} ${submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}</span>
                      </div>
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


