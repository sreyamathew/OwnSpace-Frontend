import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Building,
  MapPin,
  Star,
  MessageSquare
} from 'lucide-react';

const AgentSidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/agent/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/agent/dashboard'
    },
    {
      name: 'Properties',
      icon: Home,
      children: [
        {
          name: 'All Properties',
          href: '/agent/properties',
          current: location.pathname === '/agent/properties'
        },
        {
          name: 'Add Property',
          href: '/agent/properties/add',
          current: location.pathname === '/agent/properties/add'
        },
        {
          name: 'Property Visits',
          href: '/agent/properties/visits',
          current: location.pathname === '/agent/properties/visits'
        }
      ]
    },
    {
      name: 'Clients',
      href: '/agent/clients',
      icon: Users,
      current: location.pathname === '/agent/clients'
    },
    {
      name: 'Appointments',
      href: '/agent/appointments',
      icon: Calendar,
      current: location.pathname === '/agent/appointments'
    },
    {
      name: 'Leads',
      href: '/agent/leads',
      icon: TrendingUp,
      current: location.pathname === '/agent/leads'
    },
    {
      name: 'Reports',
      href: '/agent/reports',
      icon: FileText,
      current: location.pathname === '/agent/reports'
    },
    {
      name: 'Purchase Management',
      href: '/agent/purchase-requests',
      icon: FileText,
      current: location.pathname === '/agent/purchase-requests'
    },
    {
      name: 'Messages',
      href: '/agent/messages',
      icon: MessageSquare,
      current: location.pathname === '/agent/messages'
    },
    {
      name: 'Profile',
      href: '/agent/profile',
      icon: Settings,
      current: location.pathname === '/agent/profile'
    }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">OwnSpace</h1>
              <p className="text-xs text-gray-500">Agent Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          child.current
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Agent Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Agent Portal</p>
              <p className="text-xs text-gray-500">Real Estate Agent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;