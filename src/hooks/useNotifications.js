import { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      const res = await notificationAPI.list();
      if (res?.success) {
        const items = Array.isArray(res.data) ? res.data : [];
        setNotifications(items);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, loading]);

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    
    try {
      const res = await notificationAPI.unreadCount();
      if (res?.success) {
        setUnreadCount(Number(res.data?.unreadCount) || 0);
      }
    } catch (error) {
      console.error('Failed to refresh unread count:', error);
    }
  }, [userId]);

  const markAsRead = useCallback(async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0 || !userId) return;
    
    try {
      await notificationAPI.markRead(ids);
      setNotifications(prev => 
        prev.map(item => 
          ids.includes(item._id) ? { ...item, isRead: true } : item
        )
      );
      refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  }, [userId, refreshUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    try {
      await notificationAPI.markAllRead();
      setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [userId]);

  // Auto-refresh notifications periodically
  useEffect(() => {
    if (!userId) return;

    loadNotifications();
    refreshUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
      refreshUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, loadNotifications, refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead
  };
};