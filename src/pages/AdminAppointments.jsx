import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import MinimalSidebar from '../components/MinimalSidebar';
import { useAuth } from '../contexts/AuthContext';

const AdminAppointments = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await visitAPI.assignedToMe('approved');
        if (res.success) setVisits(res.data || []);
      } catch (e) { setError('Failed to load appointments'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Check if a visit's scheduled time has passed
  const isVisitPast = (scheduledAt) => {
    const now = new Date();
    const visitTime = new Date(scheduledAt);
    return visitTime < now;
  };

  // Edit/reschedule flow removed

  const cancel = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) {
        setVisits(prev => prev.filter(v => v._id !== id));
        alert('Visit cancelled. The requester has been notified by email.');
      }
    } catch (e) { alert('Failed to cancel'); }
  };
  
  const openNotesModal = (visit, status) => {
    setSelectedVisit(visit);
    setStatusToUpdate(status);
    setVisitNotes('');
    setShowNotesModal(true);
  };

  const updateVisitStatus = async () => {
    if (!selectedVisit) return;
    
    try {
      const res = await visitAPI.updateVisitAfterScheduled(
        selectedVisit._id, 
        statusToUpdate, 
        visitNotes
      );
      
      if (res.success) {
        setVisits(prev => prev.filter(v => v._id !== selectedVisit._id));
        alert(`Visit marked as ${statusToUpdate === 'visited' ? 'Visited' : 'Not Visited'}`);
        setShowNotesModal(false);
      } else {
        alert(res.message || 'Failed to update visit status');
      }
    } catch (e) {
      console.error('Error updating visit status:', e);
      alert(e.message || 'Failed to update visit status');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>
      <div className="lg:ml-64 flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Appointments</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.name || 'Admin'}.</p>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved Appointments</h2>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : visits.length === 0 ? (
              <div>No approved visits.</div>
            ) : (
              <div className="space-y-3">
                {visits.map(v => (
                  <div key={v._id} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                      <div className="text-sm text-gray-600">When: {new Date(v.scheduledAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isVisitPast(v.scheduledAt) ? (
                        <>
                          <button 
                            onClick={() => openNotesModal(v, 'visited')} 
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Mark as Visited
                          </button>
                          <button 
                            onClick={() => openNotesModal(v, 'not_visited')} 
                            className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                          >
                            Mark as Not Visited
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => cancel(v._id)} 
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {statusToUpdate === 'visited' ? 'Mark as Visited' : 'Mark as Not Visited'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Notes (Optional)
              </label>
              <textarea
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Add any notes about the visit outcome..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateVisitStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;


