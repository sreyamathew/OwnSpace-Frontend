import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { visitAPI } from '../services/api';
import { Calendar } from 'lucide-react';

const formatHM = (date) => `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

// Helper function to check if a slot is expired
const isSlotExpired = (dateStr, timeStr) => {
  try {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotDate = new Date(`${dateStr}T00:00:00`);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate <= now;
  } catch (e) {
    return false;
  }
};

const VisitSlotManager = ({ propertyId }) => {
  const [availability, setAvailability] = useState({ availableDates: [], slotsByDate: {} });
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [timesInput, setTimesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expanded, setExpanded] = useState(false);

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

  // Filter out expired slots from the current availability data
  const filterExpiredSlots = useCallback(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = formatHM(now);
    
    const updatedSlotsByDate = { ...availability.slotsByDate };
    let hasChanges = false;
    
    // Check each date
    Object.keys(updatedSlotsByDate).forEach(dateStr => {
      // For today, filter out slots with start time in the past
      if (dateStr === currentDate) {
        const filteredSlots = updatedSlotsByDate[dateStr].filter(slot => 
          slot.startTime > currentTime
        );
        
        if (filteredSlots.length !== updatedSlotsByDate[dateStr].length) {
          updatedSlotsByDate[dateStr] = filteredSlots;
          hasChanges = true;
        }
      }
      
      // Remove dates that are in the past
      if (dateStr < currentDate) {
        delete updatedSlotsByDate[dateStr];
        hasChanges = true;
      }
    });
    
    // Update state only if changes were made
    if (hasChanges) {
      // Recalculate available dates
      const updatedAvailableDates = Object.keys(updatedSlotsByDate)
        .filter(d => updatedSlotsByDate[d].length > 0)
        .sort();
      
      setAvailability(prev => ({
        ...prev,
        availableDates: updatedAvailableDates,
        slotsByDate: updatedSlotsByDate
      }));
    }
  }, [availability]);
  
  // Load availability on mount and when propertyId changes
  useEffect(() => { loadAvailability(); }, [propertyId]);
  
  // Set up interval to check for expired slots every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      filterExpiredSlots();
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [filterExpiredSlots]);

  const parseTimes = (input) => input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(t => /^\d{2}:\d{2}$/.test(t));

  // Validate if a time slot is at least 10 minutes in the future
  const validateTimeSlot = (dateStr, timeStr) => {
    try {
      const now = new Date();
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotDate = new Date(`${dateStr}T00:00:00`);
      slotDate.setHours(hours, minutes, 0, 0);
      
      // Add 10 minutes to current time for minimum threshold
      const minValidTime = new Date(now);
      minValidTime.setMinutes(now.getMinutes() + 10);
      
      return slotDate >= minValidTime;
    } catch (e) {
      return false;
    }
  };

  const handleCreateSlots = async () => {
    resetMessages();
    if (!date) { setError('Select a date'); return; }
    const times = parseTimes(timesInput);
    if (times.length === 0) { setError('Add times like 10:00, 10:30'); return; }
    
    // Validate each time slot is at least 10 minutes in the future
    const invalidTimes = times.filter(time => !validateTimeSlot(date, time));
    if (invalidTimes.length > 0) {
      setError(`Time slot${invalidTimes.length > 1 ? 's' : ''} cannot be added. ${invalidTimes.join(', ')} ${invalidTimes.length > 1 ? 'are' : 'is'} in the past or less than 10 minutes from now. Please try a different time.`);
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await visitAPI.createSlots({ propertyId, date, times });
      if (res.success) {
        setSuccess('Slots added');
        setTimesInput('');
        await loadAvailability();
      }
    } catch (e) {
      setError(e?.message || 'Failed to add slots');
    } finally { setSubmitting(false); }
  };

  const handleDeleteSlot = async (slotId) => {
    resetMessages();
    setSubmitting(true);
    try {
      const res = await visitAPI.deleteSlot(slotId);
      if (res.success) {
        setSuccess('Slot removed');
        await loadAvailability();
      }
    } catch (e) {
      setError(e?.message || 'Failed to remove slot');
    } finally { setSubmitting(false); }
  };

  // Block/Unblock removed per design requirement

  const generateNextHourSlots = () => {
    if (!date) {
      setError('Please select a date first');
      return;
    }
    
    const now = new Date();
    now.setSeconds(0, 0);
    
    // Add 10 minutes to current time to ensure we're only suggesting valid slots
    const futureTime = new Date(now);
    futureTime.setMinutes(now.getMinutes() + 10);
    
    const minute = futureTime.getMinutes();
    const start = new Date(futureTime);
    
    // Round to next 30-minute interval
    start.setMinutes(minute < 30 ? 30 : 0);
    if (minute >= 30) start.setHours(start.getHours() + 1);
    
    const t1 = formatHM(start);
    const t2Date = new Date(start);
    t2Date.setMinutes(start.getMinutes() + 30);
    const t2 = formatHM(t2Date);
    
    // Validate the suggested times for the selected date
    if (!validateTimeSlot(date, t1) || !validateTimeSlot(date, t2)) {
      setError('Cannot suggest valid time slots for today. Please try a future date.');
      return;
    }
    
    resetMessages();
    setTimesInput(`${t1}, ${t2}`);
  };

  const slotsForDate = date && availability.slotsByDate[date] ? availability.slotsByDate[date] : [];
  const previewCount = 4;
  const previewSlots = slotsForDate.slice(0, previewCount);
  const remaining = Math.max(slotsForDate.length - previewCount, 0);

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-500" />
          <div className="text-xs text-gray-600">Visit Slots</div>
          <div className="text-xs text-gray-400 truncate">{date || 'No date selected'}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-7 px-2 text-xs border border-gray-300 rounded-md bg-white text-gray-900"
          >
            <option value="">Date…</option>
            {/* Allow manual date entry too */}
            {availability.availableDates.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-7 px-2 text-xs border border-gray-300 rounded-md hover:bg-white"
          >
            {expanded ? 'Hide' : 'Manage'}
          </button>
        </div>
      </div>

      {/* Compact preview row */}
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {date && previewSlots.length > 0 ? (
          <>
            {previewSlots.map(s => (
              <span key={s.slotId} className="inline-flex items-center px-2 py-0.5 text-[11px] bg-white border border-gray-200 rounded">
                {s.startTime}-{s.endTime}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-[11px] text-gray-500">+{remaining} more</span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-gray-500">No slots for selected date</span>
        )}
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="block text-[11px] text-gray-600 mb-1">Pick/Type Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-gray-600 mb-1">Add 30-min starts (comma separated)</label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g., 10:00, 10:30"
                  value={timesInput}
                  onChange={(e) => setTimesInput(e.target.value)}
                  className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md bg-white"
                />
                <button onClick={generateNextHourSlots} type="button" className="h-8 px-2 text-[11px] border border-gray-300 rounded-md hover:bg-gray-50 shrink-0">Auto</button>
                <button onClick={handleCreateSlots} disabled={submitting} className="h-8 px-3 text-[11px] bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 shrink-0">Add</button>
              </div>
            </div>
          </div>

          {(error || success || loading) && (
            <div className="mt-2">
              {loading && <div className="text-gray-500 text-[11px]">Loading…</div>}
              {error && <div className="text-red-600 text-xs p-2 bg-red-50 border border-red-100 rounded-md">{error}</div>}
              {success && <div className="text-green-600 text-xs p-2 bg-green-50 border border-green-100 rounded-md">{success}</div>}
            </div>
          )}

          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-1">
              {slotsForDate.length === 0 ? (
                <span className="text-[11px] text-gray-500">No slots yet</span>
              ) : (
                slotsForDate.map(s => (
                  <div key={s.slotId} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-white border border-gray-200 rounded">
                    <span>{s.startTime}-{s.endTime}</span>
                    <button onClick={() => handleDeleteSlot(s.slotId)} className="text-red-600 hover:underline">×</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={loadAvailability} disabled={submitting} className="h-7 px-3 text-[11px] border border-gray-300 rounded-md hover:bg-gray-50">Refresh</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitSlotManager;


