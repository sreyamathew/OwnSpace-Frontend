import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { offerAPI, purchaseAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PayAdvance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [offer, setOffer] = useState(null);

  const amount = 50000;
  const formatINR = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }), []);

  useEffect(() => {
    const init = async () => {
      try {
        if (!user) { setError('Please log in.'); return; }
        // Load user's offers and find the accepted one for this property
        const res = await offerAPI.getMyOffers();
        const list = res?.offers || res?.data?.offers || [];
        const match = list.find(o => String(o?.propertyId?._id || o?.propertyId) === String(propertyId));
        if (!match) { setError('Purchase request not found.'); return; }
        const s = (match.status || '').toLowerCase();
        if (!(s === 'accepted' || s === 'approved')) { setError('Purchase request must be accepted.'); return; }
        if (match.advancePaid) { setError('Advance already paid.'); return; }
        setOffer(match);
      } catch (e) {
        setError(e?.message || 'Failed to load purchase details');
      } finally { setLoading(false); }
    };
    init();
  }, [user, propertyId]);

  const handleProceed = async () => {
    try {
      setSubmitting(true);
      setError('');
      const resp = await purchaseAPI.advancePayment({ propertyId });
      if (resp?.success) {
        alert('Advance payment of ₹50,000 completed successfully.');
        navigate('/purchase-details');
      } else {
        setError(resp?.message || 'Payment failed');
      }
    } catch (e) {
      setError(e?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Advance Payment</h1>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
          ) : (
            <>
              <div className="space-y-2 mb-6">
                <div className="text-sm text-gray-500">Property</div>
                <div className="text-lg font-semibold">{offer?.propertyId?.title || 'N/A'}</div>
                <div className="text-sm text-gray-600">{offer?.propertyId?.address ? `${offer.propertyId.address.city}, ${offer.propertyId.address.state}` : ''}</div>
                <div className="text-sm text-gray-600">Price: {typeof offer?.offerAmount === 'number' ? formatINR.format(offer.offerAmount) : 'N/A'}</div>
                <div className="text-xs text-gray-400">Property ID: {offer?.propertyId?._id}</div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <div className="text-gray-700">Advance Payment Amount:</div>
                <div className="text-2xl font-bold text-blue-700">₹50,000 (Fixed for all properties)</div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={handleProceed}
                  disabled={submitting}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PayAdvance;


