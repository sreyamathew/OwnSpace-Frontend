import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import MinimalSidebar from '../components/MinimalSidebar';
import { useAuth } from '../contexts/AuthContext';

const AdminAppointments = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState({ open: false, id: null, date: '', time: '' });

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

  const openEdit = (v) => setEditing({ open: true, id: v._id, date: v.scheduledAt?.slice(0,10) || '', time: v.scheduledAt ? new Date(v.scheduledAt).toISOString().slice(11,16) : '' });
  const closeEdit = () => setEditing({ open: false, id: null, date: '', time: '' });
  const submitEdit = async () => {
    try {
      const { id, date, time } = editing;
      const scheduledAt = new Date(`${date}T${time}:00`);
      const res = await visitAPI.recipientReschedule(id, scheduledAt);
      if (res.success) {
        setVisits(prev => prev.map(v => v._id === id ? { ...v, scheduledAt: scheduledAt.toISOString() } : v));
        closeEdit();
      }
    } catch (e) { alert('Failed to reschedule'); }
  };

  const cancel = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) setVisits(prev => prev.filter(v => v._id !== id));
    } catch (e) { alert('Failed to cancel'); }
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
                      <button onClick={() => openEdit(v)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                      <button onClick={() => cancel(v._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {editing.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={editing.date} onChange={(e) => setEditing(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" value={editing.time} onChange={(e) => setEditing(prev => ({ ...prev, time: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeEdit} className="px-4 py-2 border border-gray-300 rounded">Cancel</button>
              <button onClick={submitEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;


