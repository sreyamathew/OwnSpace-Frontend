import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
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
    Search,
    Calendar,
    MapPin,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const SoldReports = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [riskData, setRiskData] = useState([]);
    const [soldList, setSoldList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, locationRes, trendRes, riskRes, listRes] = await Promise.all([
                    reportAPI.getSoldStats(),
                    reportAPI.getSalesByLocation(),
                    reportAPI.getSalesTrend(),
                    reportAPI.getRiskDistribution(),
                    reportAPI.getSoldList()
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (locationRes.success) {
                    setLocationData(locationRes.data.map(item => ({
                        name: item._id || 'Unknown',
                        totalSales: item.totalSales,
                        count: item.count
                    })));
                }
                if (trendRes.success) {
                    setTrendData(trendRes.data.map(item => ({
                        name: item._id,
                        totalSales: item.totalSales,
                        count: item.count
                    })));
                }
                if (riskRes.success) {
                    const colors = { 'Low': '#10B981', 'Medium': '#F59E0B', 'High': '#EF4444', 'Unknown': '#9CA3AF' };
                    setRiskData(riskRes.data.map(item => ({
                        name: item._id,
                        value: item.count,
                        color: colors[item._id] || '#8B5CF6'
                    })));
                }
                if (listRes.success) setSoldList(listRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Reports Loading Error:', err);
                setError('Failed to load sold properties reports. Please check your connection.');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const generateInsights = () => {
        if (!stats || !locationData.length) return ["Analyzing sales data..."];

        const insights = [];
        if (stats.totalSold > 0) {
            insights.push(`Total revenue of ₹${(stats.totalRevenue / 10000000).toFixed(2)}Cr generated from ${stats.totalSold} sold properties.`);
        }

        if (locationData.length > 0) {
            const topLoc = locationData[0];
            insights.push(`${topLoc.name} is the top-performing location with ₹${(topLoc.totalSales / 100000).toFixed(1)}L in total sales.`);
        }

        if (stats.highRiskCount > 0) {
            insights.push(`Caution: ${stats.highRiskCount} high-risk sales detected. Review sale prices vs predicted values.`);
        } else {
            insights.push("All recent sales align well with predicted market values, showing low risk.");
        }

        return insights;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Generating Live Reports...</p>
                </div>
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
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">Sold Properties Reports</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <NotificationDropdown />
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center space-x-2 p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                >
                                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white shadow-sm">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <button onClick={() => navigate('/admin/profile')} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                            <User size={16} /> <span>Profile</span>
                                        </button>
                                        <button onClick={() => navigate('/admin/settings')} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                            <Settings size={16} /> <span>Settings</span>
                                        </button>
                                        <hr className="my-2 border-gray-100" />
                                        <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut size={16} /> <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {/* Page Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sold Analytics</h1>
                            <p className="text-gray-500 mt-1 font-medium">Tracking sales performance and AI-driven risk assessments</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                LIVE UPDATES
                            </span>
                            <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                Export Report
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-12 text-center bg-white border border-red-100 rounded-2xl shadow-sm">
                            <AlertTriangle className="mx-auto mb-4 text-red-500" size={56} />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
                            <p className="text-gray-500 mb-6 font-medium">We encountered a problem while fetching the latest sales data.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard
                                    title="Total Properties Sold"
                                    value={stats?.totalSold ?? 0}
                                    icon={<Home className="text-blue-600" />}
                                    trend="+12%"
                                    trendColor="text-green-600"
                                    bgColor="bg-blue-50"
                                />
                                <StatCard
                                    title="Total Sales Value"
                                    value={stats ? `₹${(stats.totalRevenue / 10000000).toFixed(2)}Cr` : '₹0Cr'}
                                    icon={<DollarSign className="text-emerald-600" />}
                                    trend="+8.5%"
                                    trendColor="text-green-600"
                                    bgColor="bg-emerald-50"
                                />
                                <StatCard
                                    title="Avg Sale Price"
                                    value={stats ? `₹${(stats.avgSalePrice / 100000).toFixed(1)}L` : '₹0L'}
                                    icon={<Activity className="text-purple-600" />}
                                    trend="-2.1%"
                                    trendColor="text-red-600"
                                    bgColor="bg-purple-50"
                                />
                                <StatCard
                                    title="High Risk Sales"
                                    value={stats?.highRiskCount ?? 0}
                                    icon={<AlertTriangle className="text-rose-600" />}
                                    highlight={stats?.highRiskCount > 0}
                                    bgColor="bg-rose-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                {/* Charts Left Column */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-800">Sales Value by Location</h3>
                                            <button className="text-blue-600 text-sm font-bold hover:underline">View Details</button>
                                        </div>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={locationData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <YAxis tickFormatter={(val) => `₹${val / 100000}L`} tick={{ fontSize: 12, fontWeight: 500, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Sales']}
                                                    />
                                                    <Bar dataKey="totalSales" name="Sales Value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-800">Monthly Sales Trend</h3>
                                            <select className="bg-gray-50 border-none text-sm font-bold rounded-lg px-3 py-1 text-gray-600 outline-none">
                                                <option>Last 12 Months</option>
                                                <option>Last 6 Months</option>
                                            </select>
                                        </div>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={trendData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                    <Line type="monotone" dataKey="count" name="Properties Sold" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 6, fill: '#8B5CF6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Risk & Insights */}
                                <div className="space-y-8">
                                    <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 h-full flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Risk Distribution</h3>
                                        <div className="flex-grow flex items-center justify-center">
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={riskData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={70}
                                                            outerRadius={95}
                                                            paddingAngle={8}
                                                            dataKey="value"
                                                            stroke="none"
                                                        >
                                                            {riskData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                                        <Legend verticalAlign="bottom" height={36} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                    <TrendingUp size={20} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {generateInsights().map((insight, idx) => (
                                                    <div key={idx} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                                                        <Info className="text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={16} />
                                                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">{insight}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Sold List Table */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-800">Recent Sales Details</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="text" placeholder="Filter property..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64" />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sold Price</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Market Prediction</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Level</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sold Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {soldList.length > 0 ? soldList.map((item) => (
                                                <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin size={14} className="mr-1.5 text-gray-400" />
                                                            {item.address?.city}, {item.address?.state}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-blue-600">₹{(item.soldPrice || item.price).toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                                            ₹{(item.predictedPrice || 0).toLocaleString()}
                                                            {(item.soldPrice && item.predictedPrice) && (
                                                                <span className={`ml-2 flex items-center ${item.soldPrice >= item.predictedPrice ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {item.soldPrice >= item.predictedPrice ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                                    {Math.abs(((item.soldPrice - item.predictedPrice) / item.predictedPrice) * 100).toFixed(1)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.riskCategory === 'Low' ? 'bg-green-100 text-green-700' :
                                                                item.riskCategory === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                                    item.riskCategory === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {item.riskCategory || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar size={14} className="mr-1.5 text-gray-400" />
                                                            {item.soldDate ? new Date(item.soldDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium italic">No sold properties found in the records.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, trendColor, bgColor, highlight }) => (
    <div className={`p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between bg-white relative overflow-hidden group hover:shadow-lg transition-all ${highlight ? 'ring-2 ring-rose-200' : ''}`}>
        <div className="relative z-10">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{value}</h3>
            {trend && (
                <div className={`flex items-center gap-1.5 text-xs font-bold ${trendColor}`}>
                    {trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend} from last month
                </div>
            )}
        </div>
        <div className={`p-4 rounded-xl ${bgColor} group-hover:scale-110 transition-transform shadow-inner`}>
            {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
        </div>
        {/* Subtle Background Pattern */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            {React.cloneElement(icon, { size: 100 })}
        </div>
    </div>
);

export default SoldReports;
