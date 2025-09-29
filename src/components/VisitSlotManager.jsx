import React, { useEffect, useMemo, useState } from 'react';
import { visitAPI } from '../services/api';
import { Calendar } from 'lucide-react';

const formatHM = (date) => `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

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

  // Filter out slots that have passed while user is viewing
  const filterAvailabilityForNow = (avail) => {
    try {
      const now = new Date();
      const today = new Date();
      today.setHours(0,0,0,0);
      const todayStr = today.toISOString().split('T')[0];
      const slotsByDate = { ...(avail?.slotsByDate || {}) };
      const availableDates = Array.from(avail?.availableDates || []);
      if (slotsByDate[todayStr]) {
        slotsByDate[todayStr] = slotsByDate[todayStr].filter(slot => {
          try {
            const dt = new Date(`${todayStr}T${slot.startTime}:00`);
            return dt.getTime() > now.getTime();
          } catch (_) { return false; }
        });
      }
      // Remove any dates that have no remaining slots
      const filteredDates = availableDates.filter(d => (slotsByDate[d]?.length || 0) > 0);
      return { availableDates: filteredDates, slotsByDate };
    } catch (_) {
      return avail;
    }
  };

  // Interval to dynamically hide expired slots without refresh
  React.useEffect(() => {
    // Initial filter once
    setAvailability(prev => filterAvailabilityForNow(prev));
    const id = setInterval(() => {
      setAvailability(prev => filterAvailabilityForNow(prev));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { loadAvailability(); }, [propertyId]);

  const parseTimes = (input) => input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(t => /^\d{2}:\d{2}$/.test(t));

  // Function to validate if a time slot is valid (not in the past and at least 10 minutes in the future if today)
  const isValidTimeSlot = (dateStr, timeStr) => {
    try {
      const now = new Date();
      const slotDateTime = new Date(`${dateStr}T${timeStr}:00`);
      
      // If date is in the past, reject
      if (dateStr < minDate) {
        return { valid: false, message: 'Cannot create slots for past dates' };
      }
      
      // If date is today, ensure time is at least 10 minutes in the future
      if (dateStr === minDate) {
        // Add 10 minutes to current time for minimum buffer
        const bufferTime = new Date(now);
        bufferTime.setMinutes(bufferTime.getMinutes() + 10);
        
        if (slotDateTime <= bufferTime) {
          return { 
            valid: false, 
            message: 'For today, time slots must be at least 10 minutes in the future' 
          };
        }
      }
      
      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Invalid date or time format' };
    }
  };

  const handleCreateSlots = async () => {
    resetMessages();
    if (!date) { setError('Select a date'); return; }
    const times = parseTimes(timesInput);
    if (times.length === 0) { setError('Add times like 10:00, 10:30'); return; }
    
    // Validate each time slot
    const invalidTimes = [];
    const validTimes = [];
    
    for (const time of times) {
      const validation = isValidTimeSlot(date, time);
      if (validation.valid) {
        validTimes.push(time);
      } else {
        invalidTimes.push(`${time} (${validation.message})`);
      }
    }
    
    if (validTimes.length === 0) {
      setError(`All times are invalid: ${invalidTimes.join(', ')}`);
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await visitAPI.createSlots({ propertyId, date, times: validTimes });
      if (res.success) {
        // Handle both frontend and backend validation results
        const frontendSkipped = invalidTimes.length > 0 
          ? `Frontend skipped: ${invalidTimes.join(', ')}. ` 
          : '';
          
        const backendSkipped = res.skipped && res.skipped.length > 0
          ? `Backend skipped: ${res.skipped.map(s => `${s.time} (${s.reason})`).join(', ')}.`
          : '';
          
        if (frontendSkipped || backendSkipped) {
          setSuccess(`Added ${res.data.length} slots. ${frontendSkipped}${backendSkipped}`);
        } else {
          setSuccess('All slots added successfully');
        }
        
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
    const now = new Date();
    now.setSeconds(0, 0);
    
    // Add 10 minutes buffer to current time
    const bufferTime = new Date(now);
    bufferTime.setMinutes(bufferTime.getMinutes() + 10);
    
    // Round to nearest 30-minute interval after the buffer time
    const minute = bufferTime.getMinutes();
    const start = new Date(bufferTime);
    start.setMinutes(minute < 30 ? 30 : 0);
    if (minute >= 30) start.setHours(start.getHours() + 1);
    
    const t1 = formatHM(start);
    const t2Date = new Date(start);
    t2Date.setMinutes(start.getMinutes() + 30);
    const t2 = formatHM(t2Date);
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
            <div className="mt-2 text-[11px]">
              {loading && <div className="text-gray-500">Loading…</div>}
              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}
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


