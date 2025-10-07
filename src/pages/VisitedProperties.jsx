import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';
import { visitAPI } from '../services/api';
import { MapPin, User as UserIcon, Calendar as CalendarIcon, Home as HomeIcon } from 'lucide-react';

const VisitedProperties = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await visitAPI.getVisited();
        if (res?.success) {
          setItems(Array.isArray(res.data) ? res.data : []);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('Failed to load visited', e);
        setError('Failed to load visited properties');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleDateString();
  const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="App min-h-screen bg-gray-50">
      <ContactNavbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Visited Properties</h1>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
              <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">You haven’t visited any properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <div key={it._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-gray-100 cursor-pointer" onClick={() => navigate(`/property/${it.property?._id}`)}>
                    {it.property?.images?.length ? (
                      <img
                        src={it.property.images[0].url}
                        alt={it.property.images[0].alt || it.property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HomeIcon className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 truncate">{it.property?.title || 'Property'}</div>
                    <div className="mt-1 flex items-center text-sm text-gray-600 truncate">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{it.property?.address?.city}{it.property?.address?.state ? `, ${it.property.address.state}` : ''}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(it.scheduledAt)} • {formatTime(it.scheduledAt)}</span>
                      </div>
                      {it.property?.agent?.name && (
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span>{it.property.agent.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate(`/property/${it.property?._id}`)}
                        className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VisitedProperties;


