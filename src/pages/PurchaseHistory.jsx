import React, { useEffect, useMemo, useState, useCallback } from 'react';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { offerAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PurchaseHistory = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }), []);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await offerAPI.getMyOffers();
      const list = res?.offers || res?.data?.offers || [];
      // Purchased if advancePaid or any paymentRef exists
      const purchased = list.filter(o => Boolean(o?.advancePaid) || (o?.paymentRef && (o.paymentRef.orderId || o.paymentRef.paymentId)));
      setOffers(purchased);
      setError('');
    } catch (e) {
      setError(e?.message || 'Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) fetch(); }, [user, fetch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-sm text-gray-600 mt-1">Properties you have paid for</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium mb-2">Error</div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <button 
              onClick={fetch}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <div className="text-gray-500 font-medium mb-2">No purchase records found</div>
            <div className="text-gray-400 text-sm">You haven't made any payments yet.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(o => {
              const propertyTitle = o?.propertyId?.title || 'Unknown Property';
              const imageUrl = o?.propertyId?.images?.[0]?.url || o?.propertyId?.images?.[0] || '';
              const amount = typeof o?.offerAmount === 'number' ? formatCurrency.format(o.offerAmount) : 'N/A';
              const paidAt = o?.advancePaidAt ? new Date(o.advancePaidAt) : (o?.updatedAt ? new Date(o.updatedAt) : null);
              const address = o?.propertyId?.address ? `${o.propertyId.address.city}, ${o.propertyId.address.state}` : '';
              return (
                <div key={o._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-40 bg-gray-100 flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={propertyTitle} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{propertyTitle}</h3>
                          <p className="text-sm text-gray-600">{address}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Offer Amount</span>
                          <span className="font-semibold text-green-600">{amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Advance</span>
                          <span>{o?.advancePaid ? '₹1,000' : (o?.paymentRef ? 'Captured' : '—')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Paid On</span>
                          <span>{paidAt ? paidAt.toLocaleString() : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;


