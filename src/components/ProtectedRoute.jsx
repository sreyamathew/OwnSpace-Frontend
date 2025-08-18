import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireAgent = false, requireAdminOrAgent = false }) => {
  const { isAuthenticated, isLoading, user, isAdmin, isAgent } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Check agent access
  if (requireAgent && !isAgent()) {
    return <Navigate to="/" replace />;
  }

  // Check admin or agent access
  if (requireAdminOrAgent && !isAdmin() && !isAgent()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;