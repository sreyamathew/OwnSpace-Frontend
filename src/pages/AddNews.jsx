import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader, Newspaper } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AgentSidebar from '../components/AgentSidebar';
import { newsAPI } from '../services/api';
import Swal from 'sweetalert2';

const AddNews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Both title and content are required'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await newsAPI.createNews(formData);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Market news submitted for approval!',
          confirmButtonColor: '#10B981'
        }).then(() => {
          navigate('/agent/dashboard');
        });
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'Something went wrong while submitting news'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/agent/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Newspaper className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Add Market News</h1>
            </div>
            <p className="text-gray-600 mt-2">Submit latest real estate market updates for admin approval.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  News Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Real Estate Prices Surging in Suburban Areas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  News Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Provide detailed information about this market update..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit News</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Submission Guidelines:</h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc ml-4">
              <li>Ensure titles are catchy but factual.</li>
              <li>Content should be relevant to current real estate trends.</li>
              <li>Provide accurate data if mentioning prices or statistics.</li>
              <li>Your submission will be reviewed by an administrator before being published to the platform.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNews;
