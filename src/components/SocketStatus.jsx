import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SocketStatus = () => {
  const { socketConnected } = useAuth();

  // Only show in development or when there are connection issues
  if (process.env.NODE_ENV === 'production' && socketConnected) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 ${
      socketConnected 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    }`}>
      {socketConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Real-time connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Polling mode (notifications may be delayed)</span>
        </>
      )}
    </div>
  );
};

export default SocketStatus;