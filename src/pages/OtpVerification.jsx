import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get email from location state or query param
  const email = location.state?.email || new URLSearchParams(window.location.search).get('email') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await authAPI.verifyOtp({ email, otp });
      if (response.success) {
        setSuccess('OTP verified! Redirecting...');
        // Store token and user data
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="mb-4 text-gray-600 text-center">Enter the OTP sent to <span className="font-semibold">{email}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification; 