import React from 'react';
import { Download, MoreHorizontal } from 'lucide-react';

const SalesChart = ({ onDownload }) => {
  // Mock data for the chart
  const chartData = [
    { month: 'Jan', value: 200 },
    { month: 'Feb', value: 350 },
    { month: 'Mar', value: 250 },
    { month: 'Apr', value: 400 },
    { month: 'May', value: 300 },
    { month: 'Jun', value: 280 },
    { month: 'Jul', value: 450 },
    { month: 'Aug', value: 200 },
    { month: 'Sep', value: 380 },
    { month: 'Oct', value: 420 },
    { month: 'Nov', value: 350 },
    { month: 'Dec', value: 250 }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
          <p className="text-gray-600">Sales performance over the year</p>
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

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>400</span>
          <span>300</span>
          <span>200</span>
          <span>100</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-4 h-64 flex items-end justify-between space-x-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer"
                style={{
                  height: `${(item.value / maxValue) * 240}px`,
                  minHeight: '4px'
                }}
                title={`${item.month}: ${item.value}`}
              />
              <span className="text-xs text-gray-500 mt-2">{item.month}</span>
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 ml-4">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="absolute w-full border-t border-gray-100"
              style={{ top: `${line * 25}%` }}
            />
          ))}
        </div>
      </div>

      {/* Chart legend/info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Sales</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">Total: $2.4M</p>
          <p className="text-xs">+12.5% from last year</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
