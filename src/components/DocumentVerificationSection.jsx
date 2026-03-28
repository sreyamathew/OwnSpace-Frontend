import React, { useState, useEffect, useCallback } from 'react';
import { offerAPI, documentAPI } from '../services/api';
import Swal from 'sweetalert2';

const DocumentVerificationSection = () => {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});

  const fetchPendingDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await offerAPI.getAllOffers();
      if (res.success && res.data && res.data.offers) {
        // Filter offers where documentStatus is pending
        const pending = res.data.offers.filter(o => o.documentStatus === 'pending');
        setPendingDocs(pending);
      }
    } catch (error) {
      console.error('Failed to fetch pending documents', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingDocuments();
  }, [fetchPendingDocuments]);

  const handleRemarkChange = (offerId, val) => {
    setRemarks(prev => ({ ...prev, [offerId]: val }));
  };

  const handleVerify = async (offerId, status) => {
    try {
      const remark = remarks[offerId] || '';
      if (status === 'rejected' && !remark.trim()) {
        Swal.fire('Error', 'Remarks are required when rejecting documents.', 'error');
        return;
      }
      
      const res = await documentAPI.verifyDocuments(offerId, status, remark);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Success', text: `Documents ${status} successfully.`, toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
        // Remove from list
        setPendingDocs(prev => prev.filter(o => o._id !== offerId));
      }
    } catch (error) {
      console.error('Verification error', error);
      Swal.fire('Error', 'Failed to verify documents', 'error');
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Verification</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Verification</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {pendingDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending document verifications.</p>
        ) : (
          <div className="space-y-4">
            {pendingDocs.map(offer => (
              <div key={offer._id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Buyer: {offer.investorId?.name} ({offer.investorId?.email})</h3>
                    <p className="text-sm text-gray-600 mb-2">Property: {offer.propertyId?.title || 'Unknown Property'}</p>
                    
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Uploaded Documents</span>
                      <div className="flex flex-wrap gap-2">
                        {offer.documents && offer.documents.map((doc, idx) => (
                          <a 
                            key={idx} 
                            href={`http://localhost:3001${doc.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-blue-600 hover:bg-gray-50 hover:underline"
                          >
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            {doc.name || `Document ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-72 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Remarks (Required if rejecting)" 
                      value={remarks[offer._id] || ''}
                      onChange={(e) => handleRemarkChange(offer._id, e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVerify(offer._id, 'approved')}
                        className="flex-1 bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => handleVerify(offer._id, 'rejected')}
                        className="flex-1 bg-red-600 text-white text-sm font-medium py-1.5 px-3 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVerificationSection;
