import { useState, useEffect, useRef } from 'react';
import { Bell, Loader2, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TYPE_ICON = {
  visit: Clock,
  purchase: CheckCircle,
  payment: CheckCircle,
  status: AlertTriangle,
  general: Info
};

const TYPE_BG = {
  visit: 'bg-blue-100 text-blue-600',
  purchase: 'bg-green-100 text-green-600',
  payment: 'bg-emerald-100 text-emerald-600',
  status: 'bg-amber-100 text-amber-600',
  general: 'bg-gray-100 text-gray-600'
};

const formatTimestamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const NotificationDropdown = ({ align = 'right', buttonClassName = '' }) => {
  const { notifications, notificationsLoading, unreadCount, markNotificationsRead, markAllNotificationsRead } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const unreadIds = notifications.filter((item) => !item.isRead).map((item) => item._id);
    if (unreadIds.length > 0) {
      markNotificationsRead(unreadIds);
    }
  }, [open, notifications, markNotificationsRead]);

  const renderIcon = (type) => {
    const Icon = TYPE_ICON[type] || Info;
    const style = TYPE_BG[type] || TYPE_BG.general;
    return (
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${style}`}>
        <Icon className="h-4 w-4" />
      </div>
    );
  };

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonClassName}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl ${alignmentClass}`}>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            <button
              onClick={handleMarkAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
              disabled={notifications.length === 0}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notificationsLoading ? (
              <div className="flex items-center justify-center space-x-2 px-4 py-6 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`flex items-start space-x-3 px-4 py-3 ${item.isRead ? 'bg-white' : 'bg-blue-50'} border-b border-gray-100 last:border-b-0`}
                >
                  {renderIcon(item.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-600">{item.message}</div>
                    <div className="mt-2 text-xs text-gray-400">{formatTimestamp(item.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
