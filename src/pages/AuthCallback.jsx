import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        // Handle error cases
        let errorMessage = 'Authentication failed';
        switch (error) {
          case 'auth_failed':
            errorMessage = 'Google authentication failed';
            break;
          case 'server_error':
            errorMessage = 'Server error during authentication';
            break;
          case 'google_auth_failed':
            errorMessage = 'Google authentication was cancelled or failed';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(errorMessage)}`);
        }, 2000);
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Update auth context
          login(user, token);
          
          // Redirect based on user type
          setTimeout(() => {
            if (user.userType === 'admin') {
              navigate('/admin/dashboard');
            } else if (user.userType === 'agent') {
              navigate('/agent/dashboard');
            } else {
              navigate('/');
            }
          }, 2000);
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setTimeout(() => {
            navigate('/login?error=Invalid authentication data');
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate('/login?error=Missing authentication data');
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  const error = searchParams.get('error');
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {error ? (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Authentication Failed
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {error === 'auth_failed' && 'Google authentication failed'}
                  {error === 'server_error' && 'Server error during authentication'}
                  {error === 'google_auth_failed' && 'Google authentication was cancelled or failed'}
                  {!['auth_failed', 'server_error', 'google_auth_failed'].includes(error) && 'An unknown error occurred'}
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to login page...
                </p>
              </>
            ) : token ? (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Authentication Successful
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  You have been successfully signed in with Google.
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to your dashboard...
                </p>
              </>
            ) : (
              <>
                <Loader className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Processing Authentication
                </h2>
                <p className="text-sm text-gray-600">
                  Please wait while we complete your sign-in...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;