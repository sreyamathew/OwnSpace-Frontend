import React from 'react';
import { Download, MoreHorizontal, TrendingUp, TrendingDown, Award, Star } from 'lucide-react';

const AgentPerformance = ({ onDownload }) => {
  // Mock data for agent performance
  const agents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      propertiesSold: 24,
      totalRevenue: 3200000,
      commission: 96000,
      rating: 4.9,
      change: 15.2,
      trend: 'up',
      status: 'top-performer'
    },
    {
      id: 2,
      name: 'Mike Wilson',
      avatar: '/api/placeholder/40/40',
      propertiesSold: 18,
      totalRevenue: 2400000,
      commission: 72000,
      rating: 4.7,
      change: 8.5,
      trend: 'up',
      status: 'good'
    },
    {
      id: 3,
      name: 'Lisa Chen',
      avatar: '/api/placeholder/40/40',
      propertiesSold: 15,
      totalRevenue: 1950000,
      commission: 58500,
      rating: 4.6,
      change: -2.1,
      trend: 'down',
      status: 'average'
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: '/api/placeholder/40/40',
      propertiesSold: 21,
      totalRevenue: 2800000,
      commission: 84000,
      rating: 4.8,
      change: 12.3,
      trend: 'up',
      status: 'good'
    },
    {
      id: 5,
      name: 'Anna Martinez',
      avatar: '/api/placeholder/40/40',
      propertiesSold: 12,
      totalRevenue: 1600000,
      commission: 48000,
      rating: 4.4,
      change: 5.7,
      trend: 'up',
      status: 'average'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'top-performer':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'top-performer':
        return <Award className="h-4 w-4" />;
      case 'good':
        return <Star className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agent Performance</h3>
          <p className="text-gray-600">Top performing agents this month</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Download Report"
          >
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Agent List */}
      <div className="space-y-4">
        {agents.map((agent, index) => (
          <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-bold text-gray-600">
                #{index + 1}
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                {agent.status === 'top-performer' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Award className="h-2.5 w-2.5 text-yellow-800" />
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className="ml-1">{agent.status.replace('-', ' ')}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{agent.propertiesSold} properties</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{agent.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(agent.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">Total Sales</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(agent.commission)}
                  </p>
                  <p className="text-xs text-gray-500">Commission</p>
                </div>
                <div className="flex items-center space-x-1">
                  {agent.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    agent.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {agent.trend === 'up' ? '+' : ''}{agent.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">90</p>
            <p className="text-xs text-gray-500">Total Properties Sold</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(11950000)}</p>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(358500)}</p>
            <p className="text-xs text-gray-500">Total Commission</p>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View All Agents →
        </button>
      </div>
    </div>
  );
};

export default AgentPerformance;
