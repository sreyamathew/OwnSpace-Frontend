import React from 'react';
import { Download, MoreHorizontal, TrendingUp } from 'lucide-react';

const MonthlyTarget = ({ data, onDownload }) => {
  const { percentage, target, revenue, today, message } = data;

  // Calculate the stroke-dasharray for the circular progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Monthly Target</h3>
          <p className="text-gray-600">Target you've set for each month</p>
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

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Target</p>
          <p className="text-lg font-bold text-gray-900">${target / 1000}K</p>
          <div className="flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Revenue</p>
          <p className="text-lg font-bold text-gray-900">${revenue / 1000}K</p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Today</p>
          <p className="text-lg font-bold text-gray-900">${today / 1000}K</p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTarget;
