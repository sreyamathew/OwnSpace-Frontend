import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import MinimalSidebar from '../components/MinimalSidebar';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils/propertyHelpers';

const AdminAppointments = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [pastVisits, setPastVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadAllAssigned();
  }, []);

  const loadAllAssigned = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await visitAPI.assignedToMe();
      if (res?.success) {
        const all = Array.isArray(res.data) ? res.data : [];
        const now = Date.now();
        const isApproved = (v) => (v?.status || '').toLowerCase() === 'approved';
        const visitTime = (v) => new Date(v?.scheduledAt).getTime();

        const upcoming = all.filter(v => isApproved(v) && visitTime(v) > now);
        const past = all.filter(v => isApproved(v) && visitTime(v) <= now);

        setVisits(upcoming);
        setPastVisits(past);
      } else {
        setVisits([]);
        setPastVisits([]);
      }
    } catch (e) {
      setError('Failed to load appointments');
      setVisits([]);
      setPastVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) {
        setVisits(prev => prev.filter(v => v._id !== id));
        alert('Visit cancelled. The requester has been notified by email.');
      }
    } catch (e) { alert('Failed to cancel'); }
  };

  const markVisited = async (id) => {
    try {
      const res = await visitAPI.updateVisitOutcome(id, 'visited');
      if (res.success) {
        setPastVisits(prev => 
          prev.map(v => v._id === id ? { ...v, status: 'visited' } : v)
        );
        alert('Visit marked as visited.');
      }
    } catch (e) { alert('Failed to update visit status'); }
  };

  const markNotVisited = async (id) => {
    try {
      const res = await visitAPI.updateVisitOutcome(id, 'not visited');
      if (res.success) {
        setPastVisits(prev => 
          prev.map(v => v._id === id ? { ...v, status: 'not visited' } : v)
        );
        alert('Visit marked as not visited.');
      }
    } catch (e) { alert('Failed to update visit status'); }
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
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Upcoming Visits
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Past Visits
                </button>
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : activeTab === 'upcoming' ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                {visits.length === 0 ? (
                  <div>No upcoming visits.</div>
                ) : (
                  <div className="space-y-3">
                    {visits.map(v => (
                      <div key={v._id} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                          <div className="text-sm text-gray-600">When: {new Date(v.scheduledAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => cancel(v._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Appointments</h2>
                {pastVisits.length === 0 ? (
                  <div className="text-gray-600">No past visits.</div>
                ) : (
                  <div className="space-y-3">
                    {pastVisits.map(v => (
                      <div key={v._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-lg mb-2">{v.property?.title || 'Property'}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><strong>Date & Time:</strong> {new Date(v.scheduledAt).toLocaleString()}</div>
                              <div><strong>Requester:</strong> {v.requester?.name || 'Unknown User'}</div>
                              <div><strong>Property Address:</strong> {formatAddress(v.property?.address) || 'Address not available'}</div>
                              <div><strong>Contact:</strong> {v.requester?.email || 'Email not available'}</div>
                              {v.note && <div className="md:col-span-2"><strong>Note:</strong> {v.note}</div>}
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end space-y-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              v.status === 'visited' 
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : v.status === 'not visited'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : v.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : v.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {v.status === 'visited' ? 'Visited' : 
                               v.status === 'not visited' ? 'Not Visited' :
                               v.status === 'approved' ? 'Approved' :
                               v.status === 'rejected' ? 'Rejected' :
                               v.status}
                            </div>
                            {v.status === 'approved' && (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => markVisited(v._id)} 
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                  Mark Visited
                                </button>
                                <button 
                                  onClick={() => markNotVisited(v._id)} 
                                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                >
                                  Mark Not Visited
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAppointments;


