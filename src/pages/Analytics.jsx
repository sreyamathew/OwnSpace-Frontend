import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MinimalSidebar from '../components/MinimalSidebar';
import NotificationDropdown from '../components/NotificationDropdown';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
    Activity,
    TrendingUp,
    AlertTriangle,
    Home,
    DollarSign,
    Info,
    Menu,
    LogOut,
    User,
    Settings,
    ChevronDown,
    Building,
    Search
} from 'lucide-react';

const Analytics = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [riskData, setRiskData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch basic stats first as it's critical
                try {
                    const statsRes = await analyticsAPI.getStats();
                    if (statsRes.success) setStats(statsRes.data);
                } catch (e) {
                    console.error('Stats fetch failed:', e);
                }

                // Fetch others in parallel but catch individually to prevent total failure
                const secondaryFetches = [
                    { key: 'location', fn: analyticsAPI.getLocationDistribution, setter: setLocationData },
                    {
                        key: 'trends', fn: analyticsAPI.getMonthlyTrends, setter: (data) => setTrendData(data.map(item => ({
                            name: `${item._id.month}/${item._id.year}`,
                            count: item.count,
                            avgPrice: item.avgPrice
                        })))
                    },
                    {
                        key: 'risk', fn: analyticsAPI.getRiskDistribution, setter: (data) => setRiskData([
                            { name: 'Low Risk', value: data.LOW, color: '#10B981' },
                            { name: 'Medium Risk', value: data.MEDIUM, color: '#F59E0B' },
                            { name: 'High Risk', value: data.HIGH, color: '#EF4444' }
                        ])
                    },
                    { key: 'insights', fn: analyticsAPI.getAIInsights, setter: setInsights }
                ];

                await Promise.all(secondaryFetches.map(async ({ key, fn, setter }) => {
                    try {
                        const res = await fn();
                        if (res.success) setter(res.data);
                    } catch (e) {
                        console.error(`${key} fetch failed:`, e);
                    }
                }));

                setLoading(false);
            } catch (err) {
                console.error('Global Analytics Error:', err);
                setError('A critical error occurred while loading analytics. Please try again.');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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

            {/* Main Content Area */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <Building className="h-6 w-6 text-blue-600" />
                                <span className="text-lg font-semibold text-gray-900">Analytics Dashboard</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search analytics..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <NotificationDropdown />

                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

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

                <main className="p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Analytics</h1>
                        <p className="text-gray-600">Real-time platform activity and AI-driven insights</p>
                    </div>

                    {error ? (
                        <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
                            <AlertTriangle className="mx-auto mb-2" size={48} />
                            <p className="text-xl font-semibold">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    title="Total Properties"
                                    value={stats?.totalProperties ?? 0}
                                    icon={<Home className="text-blue-500" />}
                                    bgColor="bg-blue-50"
                                />
                                <StatCard
                                    title="Active Listings"
                                    value={stats?.activeListings ?? 0}
                                    icon={<Activity className="text-green-500" />}
                                    bgColor="bg-green-50"
                                />
                                <StatCard
                                    title="Avg Predicted Price"
                                    value={stats ? `₹${(stats.avgPredictedPrice / 100000).toFixed(1)}L` : '₹0L'}
                                    icon={<DollarSign className="text-purple-500" />}
                                    bgColor="bg-purple-50"
                                />
                                <StatCard
                                    title="High Risk Assets"
                                    value={stats?.highRiskCount ?? 0}
                                    icon={<AlertTriangle className="text-red-500" />}
                                    bgColor="bg-red-50"
                                    highlight={stats?.highRiskCount > 0}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Average Price by Location</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={locationData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="_id" />
                                                    <YAxis tickFormatter={(val) => `₹${val / 100000}L`} />
                                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                                    <Legend />
                                                    <Bar dataKey="avgPrice" name="Avg Listing Price" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Property Listing Trend</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={trendData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="count" name="Properties Added" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Investment Risk Category</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={riskData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {riskData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="text-indigo-600" size={24} />
                                            <h3 className="text-lg font-semibold text-gray-700">AI Insights</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {insights.length > 0 ? insights.map((insight, idx) => (
                                                <div key={idx} className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                                    <Info className="text-indigo-500 shrink-0" size={18} />
                                                    <p className="text-sm text-indigo-900 leading-tight">{insight}</p>
                                                </div>
                                            )) : (
                                                <p className="text-gray-500 italic text-sm">Analyzing market patterns...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, bgColor, highlight }) => (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between bg-white ${highlight ? 'ring-2 ring-red-200' : ''}`}>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
    </div>
);

export default Analytics;
