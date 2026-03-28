import React, { useState, useEffect, useCallback } from 'react';
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
  Search,
  Menu,
  X,
  CheckCircle,
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
  Clock,
  Check,
  XCircle,
  LayoutDashboard,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import { propertyAPI, visitAPI, offerAPI, adminAPI, reportAPI } from '../services/api';
import OfferRequestsSection from '../components/OfferRequestsSection';
import DocumentVerificationSection from '../components/DocumentVerificationSection';
import NotificationDropdown from '../components/NotificationDropdown';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [newsFilter, setNewsFilter] = useState('all');
  const [stats, setStats] = useState({ totalProperties: 0, totalUsers: 0, totalLogs: 0, platformPerformance: 0 });
  const [sales, setSales] = useState({ propertiesSold: 0, revenue: 0, agentPerformance: 0, monthlySales: [] });
  const [recentSales, setRecentSales] = useState([]);
  const [smartAlerts, setSmartAlerts] = useState([]);
  const [news, setNews] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [visitRequests, setVisitRequests] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [statsRes, salesRes, alertsRes, newsRes, recentSalesRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getSalesReports(),
        adminAPI.getSmartAlerts(),
        adminAPI.getMarketNews(),
        reportAPI.getSoldList()
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (salesRes.success) setSales(salesRes.data);
      if (alertsRes.success) setSmartAlerts(alertsRes.data);
      if (newsRes.success) setNews(newsRes.data);
      if (recentSalesRes.success) setRecentSales(recentSalesRes.data.slice(0, 5)); // Limit to most recent 5
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);



  const loadPendingAssignedVisits = useCallback(async () => {
    try {
      const res = await visitAPI.assignedToMe('pending');
      if (res.success) setVisitRequests(res.data || []);
    } catch (e) {
      console.warn('Failed to load assigned visits', e);
    }
  }, []);

  useEffect(() => {
    loadPendingAssignedVisits();
  }, [loadPendingAssignedVisits]);

  const approveVisit = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'approved');
      if (res.success) {
        setVisitRequests(prev => prev.filter(v => v._id !== id));
        Swal.fire('Visit approved.');
      }
    } catch (e) {
      Swal.fire('Failed to approve');
    } finally {
      loadPendingAssignedVisits();
    }
  };
  const rejectVisit = async (id) => {
    try {
      const res = await visitAPI.updateVisitStatus(id, 'rejected');
      if (res.success) {
        setVisitRequests(prev => prev.filter(v => v._id !== id));
        Swal.fire('Visit rejected.');
      }
    } catch (e) {
      Swal.fire('Failed to reject');
    } finally {
      loadPendingAssignedVisits();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data imported from shared data file

  const handleDownloadPDF = async (reportType) => {
    try {
      const doc = new jsPDF();
      doc.text(`${reportType} Report`, 14, 15);
      
      let head = [];
      let body = [];
      
      let startY = 20;
      
      if (reportType === 'Detailed Sales') {
         const res = await reportAPI.getSoldList();
         const data = res.success ? res.data : [];
         head = [['Property', 'Location', 'Revenue', 'Sold Date']];
         body = data.map(m => [
             m.title, 
             m.address?.city || 'Unknown', 
             `₹${(m.soldPrice || m.price || 0).toLocaleString('en-IN')}`, 
             m.soldDate ? new Date(m.soldDate).toLocaleDateString('en-IN') : 'N/A'
         ]);
      } else if (reportType === 'Risk Summaries') {
         const res = await reportAPI.getRiskDistribution();
         const data = res.success ? res.data : [];
         head = [['Risk Category', 'Properties Count']];
         body = data.map(m => [m._id, m.count]);
      } else if (reportType === 'Market Trends') {
         const res = await reportAPI.getSalesTrend();
         const data = res.success ? res.data : [];
         
         // Draw a simple bar chart!
         if (data.length > 0) {
           doc.setFontSize(12);
           doc.text('Monthly Volume Trend', 14, 25);
           const maxVal = Math.max(...data.map(d => d.totalSales || 0));
           const chartX = 14;
           const chartY = 30;
           const chartHeight = 50;
           const chartWidth = 180;
           
           // Draw axes
           doc.setDrawColor(200);
           doc.line(chartX, chartY, chartX, chartY + chartHeight);
           doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);
           
           const barWidth = (chartWidth - 20) / data.length;
           
           data.forEach((d, i) => {
             const valHeight = maxVal > 0 ? ((d.totalSales || 0) / maxVal) * (chartHeight - 10) : 0;
             const x = chartX + 10 + (i * barWidth);
             const y = chartY + chartHeight - valHeight;
             
             doc.setFillColor(59, 130, 246);
             doc.rect(x + (barWidth*0.1), y, barWidth*0.8, valHeight, 'F');
             
             doc.setFontSize(8);
             doc.setTextColor(100);
             doc.text(d._id, x + (barWidth/2), chartY + chartHeight + 5, { align: 'center' });
           });
           
           doc.setFontSize(14);
           doc.setTextColor(0);
           startY = chartY + chartHeight + 15;
         }

         head = [['Month', 'Properties Sold', 'Total Volume']];
         body = data.map(m => [m._id, m.count, `₹${(m.totalSales || 0).toLocaleString('en-IN')}`]);
      } else {
         head = [['Metric', 'Value']];
         body = [
            ['Total Properties', stats.totalProperties],
            ['Total Users', stats.totalUsers],
            ['Total Properties Sold', sales.propertiesSold],
            ['Total Revenue', `₹${(sales.revenue/10000000).toFixed(2)}Cr`]
         ];
      }
      
      doc.autoTable({
        startY: startY,
        head: head,
        body: body,
      });
      
      doc.save(`${reportType.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      Swal.fire({ icon: 'success', title: 'Success', text: 'PDF downloaded successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    } catch(err) {
      console.error(err);
      Swal.fire('Error', 'Failed to generate PDF', 'error');
    }
  };

  const handleDownloadExcel = async (reportType) => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      if (reportType === 'Detailed Sales') {
        const res = await reportAPI.getSoldList();
        const data = res.success ? res.data : [];
        csvContent += "Property,Location,Revenue,Sold Date\n";
        data.forEach(m => {
          const rev = m.soldPrice || m.price || 0;
          const date = m.soldDate ? new Date(m.soldDate).toLocaleDateString('en-IN') : 'N/A';
          csvContent += `"${m.title}","${m.address?.city || 'Unknown'}",₹${rev},${date}\n`;
        });
      } else if (reportType === 'Risk Summaries') {
         const res = await reportAPI.getRiskDistribution();
         const data = res.success ? res.data : [];
         csvContent += "Risk Category,Properties Count\n";
         data.forEach(m => {
            csvContent += `"${m._id}",${m.count}\n`;
         });
      } else if (reportType === 'Market Trends') {
         const res = await reportAPI.getSalesTrend();
         const data = res.success ? res.data : [];
         csvContent += "Month,Properties Sold,Total Volume\n";
         data.forEach(m => {
            csvContent += `"${m._id}",${m.count},₹${m.totalSales || 0}\n`;
         });
      } else {
        csvContent += "Metric,Value\n";
        csvContent += `Total Properties,${stats.totalProperties}\n`;
        csvContent += `Total Users,${stats.totalUsers}\n`;
        csvContent += `Total Properties Sold,${sales.propertiesSold}\n`;
        csvContent += `Total Revenue,₹${sales.revenue}\n`;
      }
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportType.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Swal.fire({ icon: 'success', title: 'Success', text: 'Excel (CSV) downloaded successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    } catch(err) {
      console.error(err);
      Swal.fire('Error', 'Failed to generate Excel', 'error');
    }
  };

  const handleApproveRequest = (requestId) => {
    console.log(`Approving request ${requestId}`);
    // Mock approval functionality
  };

  const handleRejectRequest = (requestId) => {
    console.log(`Rejecting request ${requestId}`);
    // Mock rejection functionality
  };



  const handleApproveNews = async (newsId) => {
    try {
      const res = await adminAPI.updateMarketNewsStatus(newsId, 'approved');
      if (res.success) {
        setNews(prev => prev.map(n => n.id === newsId ? { ...n, status: 'approved' } : n));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'News approved successfully!'
        });
      }
    } catch (e) {
      console.error('Failed to approve news', e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve news'
      });
    }
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

              <NotificationDropdown />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Properties"
                value={dataLoading ? "..." : stats.totalProperties.toLocaleString()}
                icon={Home}
                color="blue"
              />
              <StatsCard
                title="Total Users"
                value={dataLoading ? "..." : stats.totalUsers.toLocaleString()}
                icon={Users}
                color="green"
              />
              <StatsCard
                title="Platform Performance"
                value={dataLoading ? "..." : `${stats.platformPerformance}%`}
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
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dataLoading ? "..." : sales.propertiesSold}</p>
                    <p className="text-sm text-gray-600">Properties Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dataLoading ? "..." : `₹${(sales.revenue / 10000000).toFixed(2)}Cr`}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dataLoading ? "..." : `${sales.agentPerformance}%`}</p>
                    <p className="text-sm text-gray-600">Agent Performance</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Property</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Sold Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!dataLoading && recentSales.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900 font-medium">{item.title}</td>
                          <td className="py-3 px-4 text-gray-500">{item.address?.city || 'Unknown'}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.soldPrice || item.price || 0)}
                          </td>
                          <td className="py-3 px-4 justify-start items-center flex text-gray-600">
                            <Calendar size={14} className="mr-1.5 text-gray-400" />
                            {item.soldDate ? new Date(item.soldDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
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
                title="Detailed Sales Logs"
                description="Export precise recent transactional records"
                onDownloadPDF={() => handleDownloadPDF('Detailed Sales')}
                onDownloadExcel={() => handleDownloadExcel('Detailed Sales')}
              />
              <ReportCard
                title="Risk Summaries"
                description="Comprehensive risk analysis reports"
                onDownloadPDF={() => handleDownloadPDF('Risk Summaries')}
                onDownloadExcel={() => handleDownloadExcel('Risk Summaries')}
              />
              <ReportCard
                title="Market Trends"
                description="Latest market trends and insights"
                onDownloadPDF={() => handleDownloadPDF('Market Trends')}
                onDownloadExcel={() => handleDownloadExcel('Market Trends')}
              />
            </div>
          </div>

          {/* Smart Alerts & Notifications Panel */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Smart Alerts & Notifications</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  {smartAlerts.length > 0 ? smartAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  )) : !dataLoading && <p className="text-gray-500 text-sm">No smart alerts available.</p>}
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

          {/* Document Verification */}
          <DocumentVerificationSection />

          {/* Market News Feed Management */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Market News Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setNewsFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${newsFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNewsFilter('pending')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${newsFilter === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setNewsFilter('approved')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${newsFilter === 'approved' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Approved
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {!dataLoading && news.length > 0 ? news
                    .filter(n => newsFilter === 'all' || n.status === newsFilter)
                    .map((n) => (
                      <div key={n.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{n.title}</h3>
                          <p className="text-sm text-gray-600">By {n.author} • {n.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${n.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {n.status}
                          </span>
                          {n.status === 'pending' && (
                            <button
                              onClick={() => handleApproveNews(n.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    )) : !dataLoading && <p className="text-gray-500 text-sm">No news found.</p>}
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
