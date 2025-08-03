import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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

  useEffect(() => {
    // Check if user is already logged in on app start
    const initializeAuth = () => {
      try {
        const storedUser = authAPI.getCurrentUser();
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          // Ensure clean state if no valid auth data
          setUser(null);
          setIsAuthenticated(false);
          authAPI.clearAuthData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        setUser(null);
        setIsAuthenticated(false);
        authAPI.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authAPI.clearAuthData();
  };

  const isAdmin = () => {
    return user && user.userType === 'admin';
  };

  const isAgent = () => {
    return user && user.userType === 'agent';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin,
    isAgent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};