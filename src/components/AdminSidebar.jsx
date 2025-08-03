import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Users,
  Calendar,
  User,
  ClipboardList,
  FileText,
  Database,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Building,
  UserPlus,
  Settings,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    ecommerce: true,
    analytics: false,
    marketing: false,
    crm: false,
    stocks: false,
    saas: false,
    task: false,
    forms: false,
    tables: false,
    pages: false
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      expandable: false
    },
    {
      key: 'ecommerce',
      label: 'eCommerce',
      icon: ShoppingCart,
      expandable: true,
      subItems: [
        { label: 'Properties', path: '/admin/properties' },
        { label: 'Orders', path: '/admin/orders' },
        { label: 'Customers', path: '/admin/customers' }
      ]
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'PRO',
      expandable: true,
      subItems: [
        { label: 'Sales Report', path: '/admin/analytics/sales' },
        { label: 'Revenue Report', path: '/admin/analytics/revenue' },
        { label: 'Monthly Report', path: '/admin/analytics/monthly' }
      ]
    },
    {
      key: 'marketing',
      label: 'Marketing',
      icon: MessageSquare,
      badge: 'PRO',
      expandable: true,
      subItems: [
        { label: 'Campaigns', path: '/admin/marketing/campaigns' },
        { label: 'Email Marketing', path: '/admin/marketing/email' }
      ]
    },
    {
      key: 'crm',
      label: 'CRM',
      icon: Users,
      badge: 'PRO',
      expandable: true,
      subItems: [
        { label: 'Leads', path: '/admin/crm/leads' },
        { label: 'Contacts', path: '/admin/crm/contacts' }
      ]
    },
    {
      key: 'agents',
      label: 'Agent Management',
      icon: UserPlus,
      expandable: true,
      subItems: [
        { label: 'All Agents', path: '/admin/agents' },
        { label: 'Add Agent', path: '/admin/agents/add' },
        { label: 'Agent Performance', path: '/admin/agents/performance' }
      ]
    },
    {
      key: 'stocks',
      label: 'Stocks',
      icon: BarChart3,
      badge: 'NEW',
      badgeColor: 'green',
      expandable: false,
      path: '/admin/stocks'
    },
    {
      key: 'saas',
      label: 'SaaS',
      icon: Database,
      badge: 'NEW',
      badgeColor: 'green',
      expandable: false,
      path: '/admin/saas'
    },
    {
      key: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      expandable: false,
      path: '/admin/calendar'
    },
    {
      key: 'profile',
      label: 'User Profile',
      icon: User,
      expandable: false,
      path: '/admin/profile'
    },
    {
      key: 'task',
      label: 'Task',
      icon: ClipboardList,
      expandable: true,
      subItems: [
        { label: 'Task List', path: '/admin/tasks' },
        { label: 'Create Task', path: '/admin/tasks/create' }
      ]
    },
    {
      key: 'forms',
      label: 'Forms',
      icon: FileText,
      expandable: true,
      subItems: [
        { label: 'Form Elements', path: '/admin/forms/elements' },
        { label: 'Form Validation', path: '/admin/forms/validation' }
      ]
    },
    {
      key: 'tables',
      label: 'Tables',
      icon: FileSpreadsheet,
      expandable: true,
      subItems: [
        { label: 'Basic Tables', path: '/admin/tables/basic' },
        { label: 'Data Tables', path: '/admin/tables/data' }
      ]
    },
    {
      key: 'pages',
      label: 'Pages',
      icon: FileText,
      expandable: true,
      subItems: [
        { label: 'Settings', path: '/admin/settings' },
        { label: 'Profile', path: '/admin/profile' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (subItems) => {
    return subItems?.some(item => location.pathname === item.path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Building className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">OwnSpace</span>
        <span className="ml-1 text-sm text-blue-600 font-medium">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            MENU
          </p>
          
          {menuItems.map((item) => (
            <div key={item.key} className="mb-1">
              {item.expandable ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isParentActive(item.subItems)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badgeColor === 'green' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {expandedMenus[item.key] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {expandedMenus[item.key] && item.subItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.badgeColor === 'green' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="px-3 mt-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            SUPPORT
          </p>
          <Link
            to="/admin/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </Link>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
