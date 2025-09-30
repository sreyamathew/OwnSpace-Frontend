import React, { useEffect, useState } from 'react';
import { visitAPI } from '../services/api';
import ContactNavbar from '../components/ContactNavbar';

const UserAppointments = () => {
  const [tab, setTab] = useState('pending');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState({ open: false, id: null, date: '', time: '', note: '' });
  // Compute local today string (YYYY-MM-DD) to restrict past dates in edit modal
  const todayLocal = new Date();
  const minDate = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;

  const load = async (status) => {
    try {
      setLoading(true);
      const res = await visitAPI.myRequests(status && status !== 'all' ? status : undefined);
      if (res.success) setVisits(res.data || []);
    } catch (e) { setError('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(tab === 'all' ? undefined : tab); }, [tab]);

  const openEdit = (v) => setEditing({ open: true, id: v._id, date: v.scheduledAt?.slice(0,10) || '', time: v.scheduledAt ? new Date(v.scheduledAt).toISOString().slice(11,16) : '', note: v.note || '' });
  const closeEdit = () => setEditing({ open: false, id: null, date: '', time: '', note: '' });
  const submitEdit = async () => {
    try {
      const { id, date, time, note } = editing;
      const scheduledAt = new Date(`${date}T${time}:00`);
      const res = await visitAPI.reschedule(id, scheduledAt, note);
      if (res.success) {
        // Goes back to pending
        setTab('pending');
        closeEdit();
        await load('pending');
      }
    } catch (e) { alert('Failed to reschedule'); }
  };

  const cancel = async (id) => {
    try {
      const res = await visitAPI.cancel(id);
      if (res.success) {
        setVisits(prev => prev.filter(v => v._id !== id));
      }
    } catch (e) { alert('Failed to cancel'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactNavbar />
      <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h1>
      <div className="mb-4 flex space-x-2">
        {['all','pending','approved','rejected','visited','not visited'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab===t ? 'bg-blue-100 text-blue-700' : 'border border-gray-300 text-gray-700'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : visits.length === 0 ? (
        <div>No appointments.</div>
      ) : (
        <div className="space-y-3">
          {visits.map(v => {
            const status = (v.status || '').toLowerCase();
            const isFinal = status === 'approved' || status === 'rejected' || status === 'visited' || status === 'not visited';
            return (
            <div key={v._id} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                <div className="text-sm text-gray-600">When: {new Date(v.scheduledAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  Status: <span className={`font-medium ${
                    status === 'visited' ? 'text-green-600' : 
                    status === 'not visited' ? 'text-red-600' : 
                    status === 'approved' ? 'text-blue-600' : 
                    status === 'rejected' ? 'text-gray-600' : 'text-yellow-600'
                  }`}>{v.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {status === 'approved' && (
                  <button onClick={() => setTab('approved')} className="px-3 py-1 border border-gray-300 rounded" disabled>Approved</button>
                )}
                {status === 'rejected' && (
                  <button onClick={() => setTab('rejected')} className="px-3 py-1 border border-gray-300 rounded" disabled>Rejected</button>
                )}
                {status === 'visited' && (
                  <button className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded" disabled>Visited</button>
                )}
                {status === 'not visited' && (
                  <button className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded" disabled>Not Visited</button>
                )}
                {!isFinal && (
                  <button onClick={() => openEdit(v)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                )}
                {!isFinal && (
                  <button onClick={() => cancel(v._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Cancel</button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {editing.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={editing.date} onChange={(e) => setEditing(prev => ({ ...prev, date: e.target.value }))} min={minDate} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" value={editing.time} onChange={(e) => setEditing(prev => ({ ...prev, time: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea rows="3" value={editing.note} onChange={(e) => setEditing(prev => ({ ...prev, note: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded" />
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
    </div>
  );
};

export default UserAppointments;


