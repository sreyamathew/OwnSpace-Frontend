import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';

const Payment = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pay Advance</h1>
          <p className="text-gray-600 mb-6">Offer ID: <span className="font-mono text-sm">{offerId}</span></p>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              This is a placeholder payment page. Integrate your payment gateway here.
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                onClick={() => alert('Proceed to payment gateway...')}
              >
                Proceed to Pay
              </button>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;


