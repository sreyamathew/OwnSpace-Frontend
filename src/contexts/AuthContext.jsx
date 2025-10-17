import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { authAPI, notificationAPI } from '../services/api';

const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const loadingRef = useRef(false);
  const userId = user?._id;

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('notifications:new');
      socketRef.current.off('notifications:unreadCount');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const handleUnreadEvent = useCallback((payload) => {
    if (!payload) return;
    setUnreadCount(Number(payload.unreadCount) || 0);
  }, []);

  const handleNewNotification = useCallback((payload) => {
    if (!payload) return;
    let shouldIncrement = false;
    setNotifications((prev) => {
      const exists = prev.find((item) => item._id === payload._id);
      if (!exists && !payload.isRead) {
        shouldIncrement = true;
      }
      const filtered = prev.filter((item) => item._id !== payload._id);
      return [payload, ...filtered].slice(0, 100);
    });
    if (shouldIncrement) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const connectSocket = useCallback((id) => {
    if (!id) return;
    disconnectSocket();
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { userId: id }
    });
    socket.on('notifications:new', handleNewNotification);
    socket.on('notifications:unreadCount', handleUnreadEvent);
    socketRef.current = socket;
  }, [disconnectSocket, handleNewNotification, handleUnreadEvent]);

  const loadNotifications = useCallback(async (targetUserId) => {
    const id = targetUserId || userId;
    if (!id || loadingRef.current) return;
    loadingRef.current = true;
    setNotificationsLoading(true);
    try {
      const res = await notificationAPI.list();
      if (res?.success) {
        const items = Array.isArray(res.data) ? res.data : [];
        setNotifications(items);
      } else {
        setNotifications([]);
      }
    } catch (_) {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
      loadingRef.current = false;
    }
  }, [userId]);

  const refreshUnreadCount = useCallback(async (targetUserId) => {
    const id = targetUserId || userId;
    if (!id) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await notificationAPI.unreadCount();
      if (res?.success) {
        setUnreadCount(Number(res.data?.unreadCount) || 0);
      } else {
        setUnreadCount(0);
      }
    } catch (_) {
      setUnreadCount(0);
    }
  }, [userId]);

  const markNotificationsRead = useCallback(async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0 || !userId) return;
    try {
      await notificationAPI.markRead(ids);
      setNotifications((prev) => prev.map((item) => (ids.includes(item._id) ? { ...item, isRead: true } : item)));
      refreshUnreadCount();
    } catch (_) {}
  }, [userId, refreshUnreadCount]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return;
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  }, [userId]);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = authAPI.getCurrentUser();
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          authAPI.clearAuthData();
        }
      } catch (_) {
        setUser(null);
        setIsAuthenticated(false);
        authAPI.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!userId) {
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    loadNotifications();
    refreshUnreadCount();
    connectSocket(userId);
    notificationAPI.refreshUnread().catch(() => {});
    return () => {
      disconnectSocket();
    };
  }, [userId, connectSocket, disconnectSocket, loadNotifications, refreshUnreadCount]);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    loadNotifications(userData?._id);
    refreshUnreadCount(userData?._id);
    connectSocket(userData?._id);
    notificationAPI.refreshUnread().catch(() => {});
  };

  const logout = () => {
    disconnectSocket();
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
    setUnreadCount(0);
    authAPI.clearAuthData();
  };

  const isAdmin = () => {
    return user && user.userType === 'admin';
  };

  const isAgent = () => {
    return user && user.userType === 'agent';
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin,
    isAgent,
    updateUser,
    notifications,
    notificationsLoading,
    unreadCount,
    loadNotifications,
    markNotificationsRead,
    markAllNotificationsRead,
    refreshUnreadCount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
