import React from 'react';
import { Download, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

const RecentPurchases = ({ onDownload }) => {
  // Mock data for recent purchases
  const recentPurchases = [
    {
      id: 1,
      customer: 'John Smith',
      property: 'Luxury Villa in Beverly Hills',
      amount: 2500000,
      date: '2025-03-10',
      status: 'completed',
      agent: 'Sarah Johnson'
    },
    {
      id: 2,
      customer: 'Emily Davis',
      property: 'Modern Apartment Downtown',
      amount: 850000,
      date: '2025-03-09',
      status: 'pending',
      agent: 'Mike Wilson'
    },
    {
      id: 3,
      customer: 'Robert Brown',
      property: 'Family House in Suburbs',
      amount: 650000,
      date: '2025-03-08',
      status: 'completed',
      agent: 'Lisa Chen'
    },
    {
      id: 4,
      customer: 'Maria Garcia',
      property: 'Penthouse Suite',
      amount: 1200000,
      date: '2025-03-07',
      status: 'in-progress',
      agent: 'David Kim'
    },
    {
      id: 5,
      customer: 'James Wilson',
      property: 'Beachfront Condo',
      amount: 950000,
      date: '2025-03-06',
      status: 'completed',
      agent: 'Anna Martinez'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Purchase History</h3>
          <p className="text-gray-600">Latest property transactions</p>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentPurchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{purchase.customer}</p>
                    <p className="text-xs text-gray-500">{formatDate(purchase.date)}</p>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <p className="text-sm text-gray-900 max-w-xs truncate" title={purchase.property}>
                    {purchase.property}
                  </p>
                </td>
                <td className="py-3 px-2">
                  <p className="text-sm font-medium text-gray-900">
                    {formatAmount(purchase.amount)}
                  </p>
                </td>
                <td className="py-3 px-2">
                  <p className="text-sm text-gray-900">{purchase.agent}</p>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(purchase.status)}`}>
                    {purchase.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View All Purchases →
        </button>
      </div>
    </div>
  );
};

export default RecentPurchases;
