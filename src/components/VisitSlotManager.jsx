import React, { useEffect, useMemo, useState } from 'react';
import { visitAPI } from '../services/api';

const formatHM = (date) => `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

const VisitSlotManager = ({ propertyId }) => {
  const [availability, setAvailability] = useState({ availableDates: [], slotsByDate: {} });
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [timesInput, setTimesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const todayLocal = useMemo(() => new Date(), []);
  const minDate = useMemo(() => `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`, [todayLocal]);
  const maxDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, '0')}-${String(max.getDate()).padStart(2, '0')}`;
  }, []);

  const resetMessages = () => { setError(''); setSuccess(''); };

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const res = await visitAPI.getAvailability(propertyId);
      if (res.success) {
        setAvailability(res.data || { availableDates: [], slotsByDate: {} });
      }
    } catch (e) {
      // best-effort
    } finally { setLoading(false); }
  };

  useEffect(() => { loadAvailability(); }, [propertyId]);

  const parseTimes = (input) => input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(t => /^\d{2}:\d{2}$/.test(t));

  const handleCreateSlots = async () => {
    resetMessages();
    if (!date) { setError('Select a date'); return; }
    const times = parseTimes(timesInput);
    if (times.length === 0) { setError('Enter one or more times like 10:00, 10:30'); return; }
    setSubmitting(true);
    try {
      const res = await visitAPI.createSlots({ propertyId, date, times });
      if (res.success) {
        setSuccess('Slots created');
        setTimesInput('');
        await loadAvailability();
      }
    } catch (e) {
      setError(e?.message || 'Failed to create slots');
    } finally { setSubmitting(false); }
  };

  const handleDeleteSlot = async (slotId) => {
    resetMessages();
    setSubmitting(true);
    try {
      const res = await visitAPI.deleteSlot(slotId);
      if (res.success) {
        setSuccess('Slot deleted');
        await loadAvailability();
      }
    } catch (e) {
      setError(e?.message || 'Failed to delete slot');
    } finally { setSubmitting(false); }
  };

  const markUnavailable = async () => {
    resetMessages();
    if (!date) { setError('Select a date'); return; }
    setSubmitting(true);
    try {
      const res = await visitAPI.markUnavailable({ propertyId, date });
      if (res.success) { setSuccess('Date marked unavailable'); await loadAvailability(); }
    } catch (e) { setError(e?.message || 'Failed to mark unavailable'); }
    finally { setSubmitting(false); }
  };

  const unmarkUnavailable = async () => {
    resetMessages();
    if (!date) { setError('Select a date'); return; }
    setSubmitting(true);
    try {
      const res = await visitAPI.unmarkUnavailable({ propertyId, date });
      if (res.success) { setSuccess('Unavailable removed'); await loadAvailability(); }
    } catch (e) { setError(e?.message || 'Failed to remove unavailable'); }
    finally { setSubmitting(false); }
  };

  const generateNextHourSlots = () => {
    // Convenience: generate 2 slots starting next half-hour (e.g., 14:00, 14:30)
    const now = new Date();
    now.setSeconds(0, 0);
    const minute = now.getMinutes();
    const start = new Date(now);
    start.setMinutes(minute < 30 ? 30 : 0);
    if (minute >= 30) start.setHours(start.getHours() + 1);
    const t1 = formatHM(start);
    const t2Date = new Date(start);
    t2Date.setMinutes(start.getMinutes() + 30);
    const t2 = formatHM(t2Date);
    setTimesInput(`${t1}, ${t2}`);
  };

  const slotsForDate = date && availability.slotsByDate[date] ? availability.slotsByDate[date] : [];

  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Visit Slot Manager</h4>
        {loading && <span className="text-xs text-gray-500">Loading...</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Times (HH:mm, comma separated)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., 10:00, 10:30, 11:00"
              value={timesInput}
              onChange={(e) => setTimesInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={generateNextHourSlots} type="button" className="px-2 text-xs border rounded-md hover:bg-gray-50">Auto</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={handleCreateSlots} disabled={submitting} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Add Slots</button>
        <button onClick={markUnavailable} disabled={submitting} className="px-3 py-2 border rounded-md hover:bg-gray-50">Mark Unavailable</button>
        <button onClick={unmarkUnavailable} disabled={submitting} className="px-3 py-2 border rounded-md hover:bg-gray-50">Unmark Unavailable</button>
        <button onClick={loadAvailability} disabled={submitting} className="px-3 py-2 border rounded-md hover:bg-gray-50">Refresh</button>
      </div>

      {(error || success) && (
        <div className="mt-2 text-xs">
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </div>
      )}

      <div className="mt-3">
        <div className="text-xs text-gray-600 mb-1">Existing slots for selected date</div>
        {(!date || slotsForDate.length === 0) ? (
          <div className="text-xs text-gray-400">{date ? 'No slots added for this date' : 'Select a date to view slots'}</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slotsForDate.map(s => (
              <div key={s.slotId} className="inline-flex items-center gap-2 px-2 py-1 border rounded-md text-xs">
                <span>{s.startTime} - {s.endTime}</span>
                <button onClick={() => handleDeleteSlot(s.slotId)} className="text-red-600 hover:underline">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitSlotManager;


