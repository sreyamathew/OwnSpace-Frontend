import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import AgentSidebar from '../components/AgentSidebar';
import { useAuth } from '../contexts/AuthContext';

const AgentAppointments = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [pastVisits, setPastVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const res = await visitAPI.assignedToMe('approved');
      if (res.success) {
        const now = new Date();
        const upcoming = [];
        const past = [];
        
        // Separate visits into upcoming and past
        res.data.forEach(visit => {
          const visitDate = new Date(visit.scheduledAt);
          if (visitDate > now) {
            upcoming.push(visit);
          } else {
            past.push(visit);
          }
        });
        
        setVisits(upcoming);
        setPastVisits(past);
      }
    } catch (e) { 
      setError('Failed to load appointments'); 
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
                  <div>No past visits.</div>
                ) : (
                  <div className="space-y-3">
                    {pastVisits.map(v => (
                      <div key={v._id} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                          <div className="text-sm text-gray-600">When: {new Date(v.scheduledAt).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Status: {v.status}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {v.status !== 'visited' && (
                            <button 
                              onClick={() => markVisited(v._id)} 
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Mark as Visited
                            </button>
                          )}
                          {v.status !== 'not visited' && (
                            <button 
                              onClick={() => markNotVisited(v._id)} 
                              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                            >
                              Mark as Not Visited
                            </button>
                          )}
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

export default AgentAppointments;


