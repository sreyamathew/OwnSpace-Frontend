import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Calendar,
    Newspaper,
    AlertCircle,
    Loader,
    Shield
} from 'lucide-react';
import MinimalSidebar from '../components/MinimalSidebar';
import { newsAPI } from '../services/api';
import Swal from 'sweetalert2';

const ManageNews = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getAllNews();
      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch news' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await newsAPI.updateNewsStatus(id, status);
      if (response.success) {
        setNews(prev => prev.map(n => n._id === id ? { ...n, status } : n));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `News ${status} successfully!`,
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error(`Error ${status} news:`, error);
      Swal.fire({ icon: 'error', title: 'Error', text: `Failed to ${status} news` });
    }
  };

  const filteredNews = news.filter(n => filter === 'all' || n.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 fixed inset-y-0">
        <MinimalSidebar />
      </div>

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Market News Management</h1>
              </div>
              <p className="text-gray-600 mt-2 text-lg">Review, approve, or reject news submitted by agents.</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex bg-white p-1 rounded-lg border border-gray-200">
              {['all', 'pending', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                    filter === f 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List Section */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <Loader className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Crunching news data...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 italic">
                <Newspaper className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No {filter === 'all' ? '' : filter} news found.</p>
              </div>
            ) : (
              filteredNews.map((n) => (
                <div key={n._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">{n.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Submitted by: <span className="font-semibold">{n.createdBy?.name || 'Unknown Agent'}</span></span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          n.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          n.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {n.status === 'pending' && <Clock className="h-3 w-3" />}
                          {n.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                          {n.status === 'rejected' && <XCircle className="h-3 w-3" />}
                          <span>{n.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none text-gray-700 mb-6 line-clamp-3">
                      {n.content}
                    </div>

                    {n.status === 'pending' && (
                      <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleUpdateStatus(n._id, 'approved')}
                          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve News</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(n._id, 'rejected')}
                          className="flex-1 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors border border-red-200"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject Submission</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNews;
