import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Download,
  Calendar,
  DollarSign,
  Home,
  UserPlus,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Building,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  MoreVertical,
  ChevronDown,
  Settings,
  Shield,
  Newspaper,
  AlertCircle,
  Clock,
  Check,
  XCircle,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import { dashboardStats, salesData, alerts, purchaseRequests, marketNews } from '../data/mockData';
import { propertyAPI, visitAPI } from '../services/api';
import OfferRequestsSection from '../components/OfferRequestsSection';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [newsFilter, setNewsFilter] = useState('all');
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [visitRequests, setVisitRequests] = useState([]);

  useEffect(() => {
    const fetchPropertiesCount = async () => {
      try {
        const response = await propertyAPI.getAllProperties();
        if (response.success) {
          setPropertiesCount(response.data.properties.length);
        }
      } catch (error) {
        console.error('Error fetching properties count:', error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchPropertiesCount();
  }, []);

  useEffect(() => {
    const fetchAssignedVisits = async () => {
      try {
        const res = await visitAPI.assignedToMe();
        if (res.success) setVisitRequests(res.data || []);
      } catch (e) { console.warn('Failed to load assigned visits'); }
    };
    fetchAssignedVisits();
  }, []);

  const approveVisit = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'approved');
      if (res.success) {
        setVisitRequests(prev => prev.filter(v => v._id !== id));
        alert('Visit approved. Share contact details with the requester.');
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data imported from shared data file

  const handleDownloadReport = (reportType) => {
    console.log(`Downloading ${reportType} report...`);
    // Mock download functionality
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApproveRequest = (requestId) => {
    console.log(`Approving request ${requestId}`);
    // Mock approval functionality
  };

  const handleRejectRequest = (requestId) => {
    console.log(`Rejecting request ${requestId}`);
    // Mock rejection functionality
  };

  const handleMarkAsSold = (propertyId) => {
    console.log(`Marking property ${propertyId} as sold`);
    // Mock sold functionality
  };

  const handleApproveNews = (newsId) => {
    console.log(`Approving news ${newsId}`);
    // Mock news approval functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">OwnSpace Admin</span>
              </div>
            </div>

            {/* Right side - Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {alerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${
                              alert.type === 'high' ? 'bg-red-100' : 
                              alert.type === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {alert.type === 'high' ? (
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                              ) : alert.type === 'medium' ? (
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                              ) : (
                                <Info className="h-3 w-3 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                              <p className="text-xs text-gray-600">{alert.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-700">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/admin/profile')}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => navigate('/admin/settings')}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* System Stats Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Properties"
                value={propertiesLoading ? "Loading..." : propertiesCount.toLocaleString()}
                icon={Home}
                color="blue"
              />
              <StatsCard
                title="Total Users"
                value={dashboardStats.totalUsers.toLocaleString()}
                icon={Users}
                color="green"
              />
              <StatsCard
                title="System Logs"
                value={dashboardStats.totalLogs.toLocaleString()}
                icon={FileText}
                color="purple"
              />
              <StatsCard
                title="Platform Performance"
                value={`${dashboardStats.platformPerformance}%`}
                icon={Activity}
                color="red"
              />
            </div>
          </div>

          {/* Pending Visit Requests */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Visit Requests</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {visitRequests.length === 0 ? (
                  <div className="text-sm text-gray-600">No pending requests.</div>
                ) : (
                  <div className="space-y-3">
                    {visitRequests.map(v => (
                      <div key={v._id} className="flex items-center justify-between p-4 border border-gray-100 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{v.property?.title || 'Property'}</div>
                          <div className="text-sm text-gray-600">Requested for: {new Date(v.scheduledAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => approveVisit(v._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                          <button onClick={() => rejectVisit(v._id)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sales Reports Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Sales Reports</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadReport('sales-pdf')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReport('sales-excel')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.propertiesSold}</p>
                    <p className="text-sm text-gray-600">Properties Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">${(dashboardStats.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.agentPerformance}%</p>
                    <p className="text-sm text-gray-600">Agent Performance</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Properties</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Top Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{item.month}</td>
                          <td className="py-3 px-4 text-gray-900">{item.properties}</td>
                          <td className="py-3 px-4 text-gray-900">${item.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-900">{item.agent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Report Generation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Generation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReportCard
                title="Price Predictions"
                description="Generate AI-powered price prediction reports"
                onDownloadPDF={() => handleDownloadReport('price-predictions-pdf')}
                onDownloadExcel={() => handleDownloadReport('price-predictions-excel')}
              />
              <ReportCard
                title="Risk Summaries"
                description="Comprehensive risk analysis reports"
                onDownloadPDF={() => handleDownloadReport('risk-summaries-pdf')}
                onDownloadExcel={() => handleDownloadReport('risk-summaries-excel')}
              />
              <ReportCard
                title="Market Trends"
                description="Latest market trends and insights"
                onDownloadPDF={() => handleDownloadReport('market-trends-pdf')}
                onDownloadExcel={() => handleDownloadReport('market-trends-excel')}
              />
            </div>
          </div>

          {/* Smart Alerts & Notifications Panel */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Smart Alerts & Notifications</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Purchase Requests */}
          <div id="purchase-requests" className="mb-8">
            <div className="sticky top-0 bg-gray-50 z-10 pb-2">
              <h2 className="text-xl font-semibold text-gray-900">Purchase Requests</h2>
            </div>
            <OfferRequestsSection showOnlyPending={true} />
          </div>

          {/* Sale Finalization Tool */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sale Finalization</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-600 mb-4">Mark properties as "Sold" and remove from active listings</p>
                <button
                  onClick={() => handleMarkAsSold('sample-property')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Sold</span>
                </button>
              </div>
            </div>
          </div>

          {/* Market News Feed Management */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Market News Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setNewsFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        newsFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNewsFilter('pending')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        newsFilter === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setNewsFilter('approved')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        newsFilter === 'approved' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Approved
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {marketNews
                    .filter(news => newsFilter === 'all' || news.status === newsFilter)
                    .map((news) => (
                      <div key={news.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{news.title}</h3>
                          <p className="text-sm text-gray-600">By {news.author} • {news.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            news.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {news.status}
                          </span>
                          {news.status === 'pending' && (
                            <button
                              onClick={() => handleApproveNews(news.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h3>
              <button
                onClick={() => navigate('/admin/properties/add')}
                className="flex items-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Property</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Management</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/agents')}
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>View All Agents</span>
                </button>
                <button
                  onClick={() => navigate('/admin/agents/add')}
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add New Agent</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

//

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Report Card Component
const ReportCard = ({ title, description, onDownloadPDF, onDownloadExcel }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex space-x-2">
        <button
          onClick={onDownloadPDF}
          className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>PDF</span>
        </button>
        <button
          onClick={onDownloadExcel}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Excel</span>
        </button>
      </div>
    </div>
  );
};

// Alert Item Component
const AlertItem = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertBg(alert.type)} ${alert.read ? 'opacity-60' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getAlertIcon(alert.type)}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
        </div>
        <div className="flex-shrink-0">
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
