// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const createHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: createHeaders(options.includeAuth),
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Store token in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Store token in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiRequest('/auth/profile', {
        method: 'GET',
        includeAuth: true,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        includeAuth: true,
      });

      // Update user data in localStorage
      if (response.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiRequest('/auth/logout', {
        method: 'POST',
        includeAuth: true,
      });

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return response;
    } catch (error) {
      // Clear localStorage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken();
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Register agent (Admin only)
  registerAgent: async (agentData) => {
    try {
      const response = await apiRequest('/auth/register-agent', {
        method: 'POST',
        body: JSON.stringify(agentData),
        includeAuth: true,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyOtp,

  // Forgot password
  forgotPassword: async (data) => {
    try {
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (data) => {
    try {
      const response = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await apiRequest('/health');
    return response;
  } catch (error) {
    throw error;
  }
};

// Export default API object
const api = {
  auth: authAPI,
  healthCheck,
};

export default api;
