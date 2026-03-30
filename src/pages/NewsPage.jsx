import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Newspaper, 
    Calendar, 
    User, 
    ArrowLeft, 
    Loader,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { newsAPI } from '../services/api';
import ContactNavbar from '../components/ContactNavbar';
import Footer from '../components/Footer';

const NewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedNews = async () => {
      try {
        const response = await newsAPI.getApprovedNews();
        if (response.success) {
          setNews(response.data);
        }
      } catch (error) {
        console.error('Error fetching approved news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ContactNavbar />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Market Insights</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Real Estate Market News</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, price shifts, and housing developments curated by our expert agents.
          </p>
        </div>

        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Loader className="h-10 w-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading latest updates...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 italic">
              <Newspaper className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg">No market news available at the moment.</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-6 text-blue-600 font-semibold hover:underline"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            news.map((item) => (
              <article 
                key={item._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md hover:border-blue-200 group"
              >
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                    <span className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                      <User className="h-3.5 w-3.5" />
                      <span>{item.createdBy?.name || 'Expert Agent'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>

                  <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
