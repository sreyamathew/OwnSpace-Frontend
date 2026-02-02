import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Heart,
  Eye,
  User,
  Phone,
  Mail,
  Star,
  Calendar,
  Building,
  CheckCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI, visitAPI, authAPI } from '../services/api';
import OfferForm from '../components/OfferForm';
import PricePredictor from '../components/PricePredictor';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [savedProperties, setSavedProperties] = useState([]);
  const [scheduling, setScheduling] = useState({ open: false, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: false });
  const [offerOpen, setOfferOpen] = useState(false);
  const isStaffView = user?.userType === 'admin' || user?.userType === 'agent';
  // Compute local today string (YYYY-MM-DD) to restrict past dates
  const todayLocal = new Date();
  const minDate = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2, '0')}-${String(todayLocal.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
    if (user) {
      fetchSavedProperties();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getProperty(id);

      if (response.success) {
        setProperty(response.data);
        // Record recently viewed property for the current user (limit to 10)
        if (user && response.data) {
          try {
            const key = `recentlyViewed_${user.id}`;
            const existingRaw = localStorage.getItem(key) || '[]';
            let existingList = [];
            try {
              existingList = JSON.parse(existingRaw);
              if (!Array.isArray(existingList)) existingList = [];
            } catch (_) {
              existingList = [];
            }

            const viewedItem = {
              propertyId: response.data._id,
              title: response.data.title,
              price: response.data.price,
              location: `${response.data.address?.city || ''}${response.data.address?.state ? ', ' + response.data.address.state : ''}`.trim(),
              viewedAt: new Date().toISOString(),
              image: response.data.images?.[0]?.url || null,
              action: 'viewed'
            };

            // Append full history without limit; keep deduped by timestamped entries
            const deduped = existingList.filter(i => i && !(i.propertyId === viewedItem.propertyId && i.action === 'viewed'));
            const updated = [viewedItem, ...deduped];
            localStorage.setItem(key, JSON.stringify(updated));
          } catch (e) {
            console.warn('Failed to record recently viewed property:', e);
          }
        }
      } else {
        setError('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    try {
      const res = await authAPI.getSaved();
      if (res.success) setSavedProperties(res.data || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const toggleSaveProperty = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please login to save properties');
      return;
    }

    try {
      const isSaved = savedProperties.some(p => p._id === property._id);
      if (isSaved) {
        await authAPI.removeSaved(property._id);
        setSavedProperties(prev => prev.filter(p => p._id !== property._id));
      } else {
        await authAPI.addSaved(property._id);
        setSavedProperties(prev => [...prev, property]);
      }
    } catch (error) {
      console.error('Error toggling save property:', error);
    }
  };

  const recordHistoryAction = (action) => {
    if (!user || !property) return;
    try {
      const key = `recentlyViewed_${user.id}`;
      const existingRaw = localStorage.getItem(key) || '[]';
      let existingList = [];
      try {
        existingList = JSON.parse(existingRaw);
        if (!Array.isArray(existingList)) existingList = [];
      } catch (_) {
        existingList = [];
      }

      const historyItem = {
        propertyId: property._id,
        title: property.title,
        price: property.price,
        location: `${property.address?.city || ''}${property.address?.state ? ', ' + property.address.state : ''}`.trim(),
        viewedAt: new Date().toISOString(),
        image: property.images?.[0]?.url || null,
        action
      };

      const deduped = existingList.filter(i => i && i.propertyId !== historyItem.propertyId);
      deduped.unshift(historyItem);
      const limited = deduped.slice(0, 200);
      localStorage.setItem(key, JSON.stringify(limited));
    } catch (e) {
      console.warn('Failed to record history action:', e);
    }
  };

  const isPropertySaved = () => {
    return savedProperties.some(p => p._id === property._id);
  };

  const openScheduleModal = async () => {
    if (!user) {
      alert('Please login to schedule a visit');
      return;
    }
    if (!property) return;
    setScheduling({ open: true, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: true });
    try {
      const res = await visitAPI.getAvailability(property._id);
      if (res.success) {
        // Filter out past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        // Filter available dates to only include today and future dates
        const filteredDates = (res.data.availableDates || []).filter(date => date >= todayStr);

        // Filter slots for today to only include future times
        const filteredSlotsByDate = { ...res.data.slotsByDate };
        if (filteredSlotsByDate[todayStr]) {
          const now = new Date();
          filteredSlotsByDate[todayStr] = filteredSlotsByDate[todayStr].filter(slot => {
            const slotTime = new Date(`${todayStr}T${slot.startTime}:00`);
            return slotTime > now;
          });
        }

        setScheduling(prev => ({
          ...prev,
          availableDates: filteredDates,
          slotsByDate: filteredSlotsByDate,
          loading: false
        }));
      } else {
        setScheduling(prev => ({ ...prev, loading: false }));
      }
    } catch (e) {
      console.error('Failed to load availability', e);
      setScheduling(prev => ({ ...prev, loading: false }));
    }
  };

  const closeScheduleModal = () => {
    setScheduling({ open: false, date: '', time: '', note: '', availableDates: [], slotsByDate: {}, loading: false });
  };

  // Function to check if a time slot is in the past
  const isPastSlot = (dateStr, startTime) => {
    try {
      const slotDate = new Date(`${dateStr}T${startTime}:00`);
      const now = new Date();
      return slotDate.getTime() <= now.getTime();
    } catch (_) { return false; }
  };

  // Filter scheduling state to hide slots that have passed while modal is open
  const filterSchedulingForNow = (sched) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      const now = new Date();
      const slotsByDate = { ...(sched?.slotsByDate || {}) };
      const availableDates = Array.from(sched?.availableDates || []);

      if (slotsByDate[todayStr]) {
        slotsByDate[todayStr] = slotsByDate[todayStr].filter(slot => {
          try {
            const dt = new Date(`${todayStr}T${slot.startTime}:00`);
            return dt.getTime() > now.getTime();
          } catch (_) { return false; }
        });
      }

      const filteredDates = availableDates.filter(d => (slotsByDate[d]?.length || 0) > 0);
      return { ...sched, availableDates: filteredDates, slotsByDate };
    } catch (_) {
      return sched;
    }
  };

  // Interval to dynamically update scheduling view without refresh
  React.useEffect(() => {
    if (!scheduling.open) return;
    // Initial filter once
    setScheduling(prev => filterSchedulingForNow(prev));
    const id = setInterval(() => {
      setScheduling(prev => filterSchedulingForNow(prev));
    }, 30000);
    return () => clearInterval(id);
  }, [scheduling.open]);

  const submitSchedule = async () => {
    try {
      if (!scheduling.date || !scheduling.time) {
        alert('Please select an available date and time');
        return;
      }
      // Prevent past selections (local system time)
      const scheduledAt = new Date(`${scheduling.date}T${scheduling.time}:00`);
      const now = new Date();
      if (scheduledAt.getTime() <= now.getTime()) {
        alert('Cannot schedule a visit in the past or present. Please select a future time.');
        return;
      }
      const res = await visitAPI.createVisitRequest({ propertyId: property._id, scheduledAt, note: scheduling.note });
      if (res.success) {
        alert('Visit request sent for approval');
        try {
          const key = `recentlyViewed_${user.id}`;
          const raw = localStorage.getItem(key) || '[]';
          let list = [];
          try { list = JSON.parse(raw); if (!Array.isArray(list)) list = []; } catch (_) { list = []; }
          const historyItem = {
            propertyId: property._id,
            title: property.title,
            price: property.price,
            location: `${property.address?.city || ''}${property.address?.state ? ', ' + property.address.state : ''}`.trim(),
            viewedAt: new Date().toISOString(),
            image: property.images?.[0]?.url || null,
            action: 'visit_requested'
          };
          const updated = [historyItem, ...list];
          localStorage.setItem(key, JSON.stringify(updated));
        } catch (_) { }
        closeScheduleModal();
      }
    } catch (e) {
      console.error('Failed to create visit request', e);
      alert('Failed to send request');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => {
                // Smart back navigation based on user type and referrer
                if (user?.userType === 'admin') {
                  navigate('/admin/properties');
                } else if (user?.userType === 'agent') {
                  navigate('/agent/properties');
                } else {
                  navigate('/properties');
                }
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              {!isStaffView && (
                <button
                  onClick={toggleSaveProperty}
                  className={`p-2 rounded-full transition-colors ${isPropertySaved() ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  <Heart className={`h-5 w-5 ${isPropertySaved() ? 'text-red-600 fill-current' : 'text-gray-600'
                    }`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-96">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[currentImageIndex]?.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-white' : 'border-transparent'
                            }`}
                        >
                          <img
                            src={image.url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-3xl font-bold ${property.status === 'sold' ? 'text-gray-500 line-through' : 'text-green-600'}`}>
                      {formatPrice(property.price)}
                    </span>
                    {property.status === 'sold' && (
                      <div className="text-lg text-red-600 font-semibold mt-1">Property Sold</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{property.views || 0} views</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${property.status === 'sold'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                      {property.status === 'sold' ? '🔴 SOLD OUT' : '🟢 AVAILABLE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Bath className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Square className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">{property.area ? `${property.area} sqft` : 'N/A'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{property.propertyType}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Property ID:</span> {property._id}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-1 capitalize">{property.status}</span>
                  </div>
                  <div>
                    <span className="font-medium">Listed:</span> {formatDate(property.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDate(property.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {isStaffView && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent</h3>
              )}

              {/* Price Predictor Component */}
              {!isStaffView && property && (
                <PricePredictor
                  location={property.address?.city}
                  size={property.area}
                  bhk={property.bedrooms}
                  bath={property.bathrooms}
                />
              )}

              {property.agent && (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.agent?.name || 'OwnSpace Agent'}</h4>
                      <p className="text-sm text-gray-600">Role: {property.agent?.role === 'admin' ? 'Admin' : 'Agent'}</p>
                      {property.agent?.phone && (
                        <p className="text-sm text-gray-600">Phone: {property.agent.phone}</p>
                      )}
                      {property.agent?.email && (
                        <p className="text-sm text-gray-600">Email: {property.agent.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!isStaffView && (
                <div className="space-y-3">
                  {property.status === 'sold' ? (
                    <>
                      <div className="w-full px-4 py-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-center font-medium">
                        🔴 Property Sold Out
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        This property is no longer available for purchase
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (!user) { alert('Please login first'); return; }
                          setOfferOpen(true);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Interest in Buying
                      </button>
                      <button
                        onClick={openScheduleModal}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Schedule Tour
                      </button>
                    </>
                  )}
                  <button
                    onClick={toggleSaveProperty}
                    className={`w-full px-4 py-2 rounded-md transition-colors ${isPropertySaved()
                        ? 'bg-red-600 text-white hover:bg-red-700 border border-red-600'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {isPropertySaved() ? 'Saved ✓' : 'Save Property'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Schedule Modal (users only) */}
      {!isStaffView && scheduling.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Visit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  value={scheduling.date}
                  onChange={(e) => setScheduling(prev => ({ ...prev, date: e.target.value, time: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="" disabled>{scheduling.loading ? 'Loading...' : 'Select a date'}</option>
                  {scheduling.availableDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {(scheduling.date && scheduling.slotsByDate[scheduling.date] ? scheduling.slotsByDate[scheduling.date] : []).length === 0 ? (
                    <div className="col-span-3 text-sm text-gray-500">{scheduling.date ? 'No slots available for this date' : 'Select a date first'}</div>
                  ) : (
                    scheduling.slotsByDate[scheduling.date].map((slot) => {
                      const disabled = isPastSlot(scheduling.date, slot.startTime);
                      return (
                        <button
                          key={slot.slotId}
                          onClick={() => !disabled && setScheduling(prev => ({ ...prev, time: slot.startTime }))}
                          disabled={disabled}
                          className={`px-3 py-2 border rounded-md text-sm ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : (scheduling.time === slot.startTime ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50')}`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  rows="3"
                  value={scheduling.note}
                  onChange={(e) => setScheduling(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional details"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={closeScheduleModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={submitSchedule} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Request</button>
            </div>
          </div>
        </div>
      )}
      {/* Offer Modal */}
      {!isStaffView && offerOpen && property && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">I'm Interested in Buying</h3>
              <button onClick={() => setOfferOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <OfferForm
              propertyId={property._id}
              investorId={user?.userId || user?._id}
              agentId={property?.agent?._id}
              onClose={() => setOfferOpen(false)}
              onSuccess={() => { try { recordHistoryAction('offer_submitted'); } catch (_) { } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
