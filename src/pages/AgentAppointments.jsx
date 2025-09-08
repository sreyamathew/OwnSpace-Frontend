import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import AgentSidebar from '../components/AgentSidebar';
import { useAuth } from '../contexts/AuthContext';

const AgentAppointments = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Compute local today string (YYYY-MM-DD) to restrict past dates in edit modal
  const todayLocal = new Date();
  const minDate = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;

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

  // Remove edit flow; cancellable only

  const cancel = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) {
        setVisits(prev => prev.filter(v => v._id !== id));
        alert('Visit cancelled. The requester has been notified by email.');
      }
    } catch (e) { alert('Failed to cancel'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Appointments</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.name || 'Agent'}.</p>
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
                      <button onClick={() => cancel(v._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit flow removed */}
    </div>
  );
};

export default AgentAppointments;


