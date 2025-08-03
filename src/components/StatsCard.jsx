import React from 'react';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';

const StatsCard = ({ title, value, change, trend, icon: Icon, onDownload }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <button
          onClick={onDownload}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Download Report"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : '-'}{Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
