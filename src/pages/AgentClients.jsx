import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Phone, MapPin, Home, Calendar, DollarSign, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AgentSidebar from '../components/AgentSidebar';
import NotificationDropdown from '../components/NotificationDropdown';
import { offerAPI } from '../services/api';

const AgentClients = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!user?._id) {
          setClients([]);
          setLoading(false);
          return;
        }

        // Fetch all offers for this agent
        const response = await offerAPI.getOffersByAgent(user._id);
        
        if (response.success) {
          // Filter offers that are accepted or advance_paid (actual clients)
          const acceptedOffers = (response.offers || []).filter(
            offer => offer.status === 'accepted' || offer.status === 'advance_paid'
          );
          
          // Group by investor to avoid duplicates
          const clientsMap = new Map();
          acceptedOffers.forEach(offer => {
            const investorId = offer.investorId?._id;
            if (!investorId) return;
            
            if (!clientsMap.has(investorId)) {
              clientsMap.set(investorId, {
                ...offer.investorId,
                purchases: []
              });
            }
            
            clientsMap.get(investorId).purchases.push({
              offerId: offer._id,
              property: offer.propertyId,
              offerAmount: offer.offerAmount,
              status: offer.status,
              advancePaid: offer.advancePaid,
              advanceAmount: offer.advanceAmount,
              createdAt: offer.createdAt,
              updatedAt: offer.updatedAt
            });
          });
          
          setClients(Array.from(clientsMap.values()));
        } else {
          setError('Failed to load clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [user]);

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 text-sm">
      <AgentSidebar />

      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600 mt-1">Buyers who purchased your properties</p>
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
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="py-10 text-center text-gray-500">Loading clients...</div>
            ) : error ? (
              <div className="py-10 text-center text-red-600">{error}</div>
            ) : clients.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                <p className="text-gray-600">Clients will appear here once buyers purchase your properties</p>
              </div>
            ) : (
              <div className="space-y-6">
                {clients.map((client) => (
                  <div key={client._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Client Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {client.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">{client.name || 'Unknown Client'}</h2>
                            <div className="mt-2 space-y-1">
                              {client.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-4 w-4 mr-2" />
                                  <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                                    {client.email}
                                  </a>
                                </div>
                              )}
                              {client.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2" />
                                  <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                                    {client.phone}
                                  </a>
                                </div>
                              )}
                              {client.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{client.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Total Purchases</div>
                          <div className="text-2xl font-bold text-blue-600">{client.purchases.length}</div>
                        </div>
                      </div>
                    </div>

                    {/* Purchases List */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
                      <div className="space-y-4">
                        {client.purchases.map((purchase) => (
                          <div key={purchase.offerId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <Home className="h-5 w-5 text-gray-400" />
                                  <h4 className="font-semibold text-gray-900">
                                    {purchase.property?.title || 'Property'}
                                  </h4>
                                  {purchase.advancePaid && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Advance Paid
                                    </span>
                                  )}
                                  {purchase.status === 'accepted' && !purchase.advancePaid && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Accepted
                                    </span>
                                  )}
                                </div>
                                
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <div className="text-xs text-gray-500">Offer Amount</div>
                                    <div className="text-sm font-semibold text-gray-900 flex items-center mt-1">
                                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                                      {formatPrice(purchase.offerAmount)}
                                    </div>
                                  </div>
                                  
                                  {purchase.advancePaid && (
                                    <div>
                                      <div className="text-xs text-gray-500">Advance Paid</div>
                                      <div className="text-sm font-semibold text-green-600 flex items-center mt-1">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {formatPrice(purchase.advanceAmount)}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <div className="text-xs text-gray-500">Purchase Date</div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center mt-1">
                                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                      {formatDate(purchase.updatedAt)}
                                    </div>
                                  </div>
                                </div>

                                {purchase.property?.address && (
                                  <div className="mt-3 flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>
                                      {purchase.property.address.city && purchase.property.address.state
                                        ? `${purchase.property.address.city}, ${purchase.property.address.state}`
                                        : 'Location not specified'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentClients;
