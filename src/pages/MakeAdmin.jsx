import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const MakeAdmin = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/make-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Successfully updated to admin!');
        // Update the user in context
        updateUser(data.data.user);
        // Also update localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            User Role Management
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current User Info:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User Type:</strong> <span className={`font-semibold ${user?.userType === 'admin' ? 'text-green-600' : user?.userType === 'agent' ? 'text-blue-600' : 'text-gray-600'}`}>{user?.userType}</span></p>
              <p><strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {user?.userType !== 'admin' && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                To add properties, you need admin or agent privileges. Click the button below to make this user an admin.
              </p>
              <button
                onClick={handleMakeAdmin}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Make Admin'}
              </button>
            </div>
          )}

          {user?.userType === 'admin' && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800">
                  ✅ You already have admin privileges! You can now add properties.
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="text-center">
            <a
              href="/add-property"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Add Property Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAdmin;
