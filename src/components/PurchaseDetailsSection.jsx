import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { offerAPI } from '../services/api';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

const PurchaseDetailsSection = ({ userId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await offerAPI.getMyOffers();
        setOffers(response.offers || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to load purchase details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userId]);

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
    return <div className="py-4 text-center text-gray-500">Loading purchase details...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500">No purchase offers found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-md font-medium text-gray-900">Purchase Details</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer Amount
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr key={offer._id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      {offer.propertyId?.images?.[0] ? (
                        <img 
                          className="h-8 w-8 rounded-md object-cover" 
                          src={offer.propertyId.images[0]} 
                          alt={offer.propertyId.title} 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {offer.propertyId?.title || 'Unknown Property'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${offer.offerAmount?.toLocaleString() || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(offer.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseDetailsSection;