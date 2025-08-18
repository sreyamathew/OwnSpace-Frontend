// API Configuration
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

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
    console.log('Creating headers with auth:', !!token);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('Token added to headers');
    } else {
      console.log('No token found in localStorage');
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

    console.log('=== API Request Debug ===');
    console.log('URL:', url);
    console.log('Headers:', config.headers);
    console.log('Include Auth:', options.includeAuth);

    const response = await fetch(url, config);
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', data);

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

// Agent API functions
export const agentAPI = {
  // Get all agents (Admin only)
  getAllAgents: async () => {
    try {
      const response = await apiRequest('/agents', {
        method: 'GET',
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update agent (Admin only)
  updateAgent: async (agentId, agentData) => {
    try {
      const response = await apiRequest(`/agents/${agentId}`, {
        method: 'PUT',
        body: JSON.stringify(agentData),
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete agent (Admin only)
  deleteAgent: async (agentId) => {
    try {
      const response = await apiRequest(`/agents/${agentId}`, {
        method: 'DELETE',
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Property API functions
export const propertyAPI = {
  // Get all properties
  getAllProperties: async (filterParams = {}) => {
    try {
      const queryString = new URLSearchParams(filterParams).toString();
      const endpoint = queryString ? `/properties?${queryString}` : '/properties';
      
      const response = await apiRequest(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single property
  getProperty: async (propertyId) => {
    try {
      const response = await apiRequest(`/properties/${propertyId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      const response = await apiRequest('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update property
  updateProperty: async (propertyId, propertyData) => {
    try {
      const response = await apiRequest(`/properties/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (propertyId) => {
    try {
      const response = await apiRequest(`/properties/${propertyId}`, {
        method: 'DELETE',
        includeAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get properties by agent
  getPropertiesByAgent: async (agentId) => {
    try {
      const response = await apiRequest(`/properties/agent/${agentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Export default API object
const api = {
  auth: authAPI,
  agent: agentAPI,
  property: propertyAPI,
  healthCheck,
};

export default api;
