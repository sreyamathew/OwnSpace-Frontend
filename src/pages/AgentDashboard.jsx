import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Building, User, MapPin, Bed, Bath, Square, CheckCircle, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AgentSidebar from '../components/AgentSidebar';
import { propertyAPI, visitAPI } from '../services/api';
import OfferRequestsSection from '../components/OfferRequestsSection';
import NotificationDropdown from '../components/NotificationDropdown';

const ActionCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500"
    
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [visitRequests, setVisitRequests] = useState([]);

  useEffect(() => {
    // Check for success message in URL params
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    if (success === 'property-added') {
      setSuccessMessage('Property added successfully!');
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      // Clean up URL
      navigate('/agent/dashboard', { replace: true });
    }
  }, [location, navigate]);


  useEffect(() => {
    const fetchAgentProperties = async () => {
      try {
        setLoading(true);
        setError('');
        if (!user?._id) {
          setProperties([]);
          setLoading(false);
          return;
        }
        const response = await propertyAPI.getPropertiesByAgent(user._id);
        if (response.success) {
          setProperties(Array.isArray(response.data) ? response.data : response.data?.properties || []);
        } else {
          setError('Failed to load properties');
        }
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProperties();
  }, [user]);

  useEffect(() => {
    const fetchAssignedVisits = async () => {
      try {
        const res = await visitAPI.assignedToMe();
        if (res.success) setVisitRequests(res.data || []);
      } catch (e) {
        console.warn('Failed to load assigned visit requests');
      }
    };
    fetchAssignedVisits();
  }, []);

  const approveVisit = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'approved');
      if (res.success) {
        setVisitRequests(prev => prev.filter(v => v._id !== id));
        alert('Visit approved. Share your contact details with the requester.');
      }
    } catch (e) { alert('Failed to approve'); }
  };

  const rejectVisit = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) {
        setVisitRequests(prev => prev.filter(v => v._id !== id));
        alert('Visit rejected.');
      }
    } catch (e) { alert('Failed to reject'); }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'Price on request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAddressText = (property) => {
    const city = property?.address?.city || property?.city;
    const state = property?.address?.state || property?.state;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Location not specified';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 text-sm">
      <AgentSidebar />

      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Agent'}.</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="inline-flex items-center justify-center space-x-2 h-9 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-6xl mx-auto">

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                  <button
                    onClick={() => setSuccessMessage('')}
                    className="h-6 w-6 inline-flex items-center justify-center text-green-400 hover:text-green-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard
                icon={Plus}
                title="Add Property"
                description="Create a new property listing"
                onClick={() => navigate('/agent/properties/add')}
              />
              <ActionCard
                icon={Building}
                title="My Listings"
                description="View and manage your properties"
                onClick={() => navigate('/agent/properties')}
              />
              <ActionCard
                icon={User}
                title="Profile"
                description="View and edit your profile"
                onClick={() => navigate('/agent/profile')}
              />
            </div>

            {/* Recent Properties */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
                <button
                  onClick={() => navigate('/agent/properties')}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-md text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <div className="py-10 text-sm text-gray-500">Loading properties...</div>
              ) : error ? (
                <div className="py-10 text-sm text-red-600">{error}</div>
              ) : properties.length === 0 ? (
                <div className="py-10 text-sm text-gray-600">No properties yet. Add your first property.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.slice(0, 6).map((property) => (
                    <div key={property._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32 bg-gray-100">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0].url}
                            alt={property.images[0].alt || property.title || 'Property image'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1">{property.title || 'Untitled Property'}</h3>
                        <div className="mt-0.5 flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-xs line-clamp-1">{getAddressText(property)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-green-600">{formatPrice(property.price)}</span>
                          <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {property.propertyType || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-3 text-xs text-gray-600">
                          {property?.bedrooms != null && property?.bedrooms !== '' && (
                            <span className="flex items-center"><Bed className="h-3 w-3 mr-1" />{property.bedrooms}</span>
                          )}
                          {property?.bathrooms != null && property?.bathrooms !== '' && (
                            <span className="flex items-center"><Bath className="h-3 w-3 mr-1" />{property.bathrooms}</span>
                          )}
                          {property?.area != null && property?.area !== '' && (
                            <span className="flex items-center"><Square className="h-3 w-3 mr-1" />{property.area} sqft</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Visit Requests */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Visit Requests</h2>
              {visitRequests.length === 0 ? (
                <div className="py-6 text-sm text-gray-600">No pending requests.</div>
              ) : (
                <div className="space-y-3">
                  {visitRequests.map(v => (
                    <div key={v._id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                        <div className="text-sm text-gray-600">Requested for: {new Date(v.scheduledAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => approveVisit(v._id)} className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-green-600 text-white hover:bg-green-700">Approve</button>
                        <button onClick={() => rejectVisit(v._id)} className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-gray-300 hover:bg-gray-50">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* Pending Purchase Requests */}
        <div id="purchase-requests" className="mt-10">
          <div className="sticky top-0 bg-gray-50 z-10 pb-2">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Requests</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <OfferRequestsSection showOnlyPending={true} />
          </div>
        </div>
        </main>
      </div>


    </div>
  );
};

export default AgentDashboard;