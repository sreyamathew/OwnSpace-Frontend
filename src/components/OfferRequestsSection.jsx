import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { offerAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

const OfferRequestsSection = ({ userId }) => {
  const { user, isAdmin, isAgent } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          // If not authorized or other handled error, show empty list instead of red error
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
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offers:', err);
      // Graceful UX: if any error occurs, show empty state rather than an interruptive banner
      setOffers([]);
      setError('');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user || userId) {
      fetchOffers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, user]);

  const handleStatusUpdate = async (offerId, status) => {
    try {
      await offerAPI.updateOfferStatus(offerId, status);
      // Update local state
      setOffers(offers.map(offer => 
        offer._id === offerId ? { ...offer, status } : offer
      ));
      
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading offer requests...</div>;
  }

  // Avoid showing a prominent error banner; fallback to empty state instead

  if (offers.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">No offer requests found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Offer Requests</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage property purchase offers from investors
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr key={offer._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {offer.propertyId?.images?.[0] ? (
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={offer.propertyId.images[0]} 
                          alt={offer.propertyId.title} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {offer.propertyId?.title || 'Unknown Property'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${offer.propertyId?.price?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {offer.investorId?.name || 'Unknown Investor'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {offer.investorId?.email || 'No email'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${offer.offerAmount?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {offer.message || 'No message'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Preferred: {offer.preferredDate ? new Date(offer.preferredDate).toLocaleDateString() : 'N/A'} • Submitted: {new Date(offer.createdAt || offer.timestamp).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(offer.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {['pending','Pending'].includes(offer.status) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(offer._id, 'Approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(offer._id, 'Rejected')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {!['pending','Pending'].includes(offer.status) && (
                    <span className="text-gray-500">
                      {['accepted','Approved'].includes(offer.status) ? 'Approved' : 'Rejected'} on {new Date(offer.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferRequestsSection;