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
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import RecentPurchases from '../components/RecentPurchases';
import AgentPerformance from '../components/AgentPerformance';
import MonthlyTarget from '../components/MonthlyTarget';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('Mar 6, 2025 - Mar 12, 2025');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - In real app, this would come from API
  const dashboardStats = {
    customers: {
      count: 3782,
      change: 11.01,
      trend: 'up'
    },
    orders: {
      count: 5359,
      change: 9.05,
      trend: 'up'
    },
    revenue: {
      amount: 328700,
      change: 15.3,
      trend: 'up'
    },
    properties: {
      count: 1247,
      change: 8.2,
      trend: 'up'
    }
  };

  const monthlyTarget = {
    percentage: 75.55,
    target: 20000,
    revenue: 26000,
    today: 2000,
    message: "You earn $328.7 today, it's higher than last month. Keep up your good work!"
  };

  const handleDownloadReport = (reportType) => {
    // Mock download functionality
    console.log(`Downloading ${reportType} report...`);
    // In real app, this would trigger actual file download
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's what's happening with your properties.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{dateRange}</span>
              </div>
              <button
                onClick={() => handleDownloadReport('overview')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => navigate('/admin/profile')}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Customers"
              value={dashboardStats.customers.count.toLocaleString()}
              change={dashboardStats.customers.change}
              trend={dashboardStats.customers.trend}
              icon={Users}
              onDownload={() => handleDownloadReport('customers')}
            />
            <StatsCard
              title="Orders"
              value={dashboardStats.orders.count.toLocaleString()}
              change={dashboardStats.orders.change}
              trend={dashboardStats.orders.trend}
              icon={ShoppingCart}
              onDownload={() => handleDownloadReport('orders')}
            />
            <StatsCard
              title="Revenue"
              value={`$${(dashboardStats.revenue.amount / 1000).toFixed(1)}K`}
              change={dashboardStats.revenue.change}
              trend={dashboardStats.revenue.trend}
              icon={DollarSign}
              onDownload={() => handleDownloadReport('revenue')}
            />
            <StatsCard
              title="Properties"
              value={dashboardStats.properties.count.toLocaleString()}
              change={dashboardStats.properties.change}
              trend={dashboardStats.properties.trend}
              icon={Home}
              onDownload={() => handleDownloadReport('properties')}
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2">
              <SalesChart onDownload={() => handleDownloadReport('sales')} />
            </div>

            {/* Monthly Target */}
            <div className="lg:col-span-1">
              <MonthlyTarget 
                data={monthlyTarget}
                onDownload={() => handleDownloadReport('monthly-target')}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Purchases */}
            <RecentPurchases onDownload={() => handleDownloadReport('recent-purchases')} />

            {/* Agent Performance */}
            <AgentPerformance onDownload={() => handleDownloadReport('agent-performance')} />
          </div>

          {/* Statistics Overview */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                  <p className="text-gray-600">Target you've set for each month</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activeTab === 'overview' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('sales')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activeTab === 'sales' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sales
                    </button>
                    <button
                      onClick={() => setActiveTab('revenue')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activeTab === 'revenue' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Revenue
                    </button>
                  </div>
                  <button
                    onClick={() => handleDownloadReport('statistics')}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Statistics Chart Placeholder */}
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600">Statistics chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
