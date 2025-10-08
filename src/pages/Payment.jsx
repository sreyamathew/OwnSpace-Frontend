import React, { useCallback, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { paymentAPI, offerAPI } from '../services/api';

const Payment = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const amountParam = Number(new URLSearchParams(location.search).get('amount') || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePay = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const ok = await loadRazorpay();
      if (!ok) { setError('Failed to load payment SDK'); setLoading(false); return; }

      const orderRes = await paymentAPI.createOrder({ amount: amountParam || 100, currency: 'INR', receipt: `offer_${offerId}` });
      const order = orderRes?.order;
      if (!order?.id) { setError('Failed to create order'); setLoading(false); return; }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RQvwxfrTu00hqp',
        amount: order.amount,
        currency: order.currency,
        name: 'OwnSpace',
        description: 'Advance Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            await offerAPI.markAdvancePaid({
              offerId,
              amount: Math.round(order.amount / 100),
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              method: 'razorpay'
            });
            alert('Advance payment successful.');
            navigate(-1);
          } catch (e) {
            console.error('Failed to record advance payment', e);
            alert('Payment captured, but recording failed. We will reconcile shortly.');
            navigate(-1);
          }
        },
        prefill: {},
        theme: { color: '#2563eb' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e?.message || 'Payment failed');
    } finally { setLoading(false); }
  }, [amountParam, offerId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pay Advance</h1>
          <p className="text-gray-600">Offer ID: <span className="font-mono text-sm">{offerId}</span></p>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Advance Amount (INR)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={50000}
                min={100}
                onChange={() => {}}
              />
              <p className="text-xs text-gray-500">A fixed advance of ₹50,000 is suggested. You may adjust if needed.</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50" onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;


