import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { offerAPI } from '../services/api';

const PurchaseDetailsSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await offerAPI.getMyOffers();
      const list = response?.offers || response?.data?.offers || [];
      setOffers(Array.isArray(list) ? list : []);
      setError('');
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load purchase details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    const intervalId = setInterval(fetchOffers, 15000); // refresh every 15s
    return () => clearInterval(intervalId);
  }, []);

  const formatCurrency = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }), []);

  const getStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'accepted' || normalized === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="mr-1">🟢</span>
          Approved
        </span>
      );
    }
    if (normalized === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="mr-1">🔴</span>
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <span className="mr-1">🟡</span>
        Pending
      </span>
    );
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-500">Loading purchase details...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No purchase requests yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-md font-medium text-gray-900">Your Purchase Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Amount</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => {
              const propertyTitle = offer?.propertyId?.title || 'Unknown Property';
              const imageUrl = offer?.propertyId?.images?.[0]?.url || offer?.propertyId?.images?.[0] || '';
              const amount = typeof offer?.offerAmount === 'number' ? formatCurrency.format(offer.offerAmount) : 'N/A';
              const submittedAt = offer?.createdAt ? new Date(offer.createdAt) : (offer?.timestamp ? new Date(offer.timestamp) : null);
              const preferred = offer?.preferredDate ? new Date(offer.preferredDate) : null;
              return (
                <tr key={offer._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        {imageUrl ? (
                          <img src={imageUrl} alt={propertyTitle} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : null}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{propertyTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{amount}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700 max-w-xs truncate" title={offer?.message || ''}>{offer?.message || '-'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{preferred ? preferred.toLocaleDateString() : '-'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(offer?.status)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{submittedAt ? `${submittedAt.toLocaleDateString()} ${submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseDetailsSection;