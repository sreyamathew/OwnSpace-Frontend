// API Configuration
let __OWNSPACE_REDIRECTING__ = false;
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

// Helper for handling 401/expired tokens globally
const handleUnauthorizedAndRedirect = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (_) {}
  if (typeof window !== 'undefined' && !__OWNSPACE_REDIRECTING__) {
    __OWNSPACE_REDIRECTING__ = true;
    const fromPath = (window.location && (window.location.pathname + (window.location.search || ''))) || '/';
    // Small delay to allow UI state updates/logging
    setTimeout(() => {
      try {
        window.location.href = `/login?expired=1&from=${encodeURIComponent(fromPath)}`;
      } catch (_) {}
    }, 50);
  }
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
    let data;
    try {
      data = await response.json();
    } catch (_) {
      data = {};
    }

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      const msg = data?.message || data?.error || 'Something went wrong';
      // Handle 401 explicitly: clean auth and redirect to login
      if (response.status === 401) {
        handleUnauthorizedAndRedirect();
        const err = new Error(`${response.status}:${msg}`);
        err.code = 'AUTH';
        throw err;
      }
      const err = new Error(`${response.status}:${msg}`);
      err.code = String(response.status);
      throw err;
    }

    return data;
  } catch (error) {
    // Network down / server not running
    const message = String(error && error.message || '');
    const isNetworkError =
      (error && error.name === 'TypeError' && /Failed to fetch/i.test(message)) ||
      /NetworkError|Failed to fetch|ERR_CONNECTION_REFUSED/i.test(message);
    if (isNetworkError) {
      const err = new Error('Network unavailable: Unable to reach API server');
      err.code = 'NETWORK';
      console.error('API Request Error (Network):', message);
      throw err;
    }
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

  // Change password
  changePassword: async (data) => {
    try {
      const response = await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
        includeAuth: true
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  // Saved properties
  getSaved: async () => {
    try {
      return await apiRequest('/auth/saved', { method: 'GET', includeAuth: true });
    } catch (e) { throw e; }
  },
  addSaved: async (propertyId) => {
    try {
      return await apiRequest(`/auth/saved/${propertyId}`, { method: 'POST', includeAuth: true });
    } catch (e) { throw e; }
  },
  removeSaved: async (propertyId) => {
    try {
      return await apiRequest(`/auth/saved/${propertyId}`, { method: 'DELETE', includeAuth: true });
    } catch (e) { throw e; }
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

// Visit API functions
export const visitAPI = {
  // Create a visit request
  createVisitRequest: async ({ propertyId, scheduledAt, note }) => {
    try {
      const response = await apiRequest('/visits', {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ propertyId, scheduledAt, note }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Fetch availability for a property (public)
  getAvailability: async (propertyId) => {
    try {
      const response = await apiRequest(`/visits/availability/${propertyId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) { throw error; }
  },
  // Create slots for a given date (agent/admin)
  createSlots: async ({ propertyId, date, times }) => {
    try {
      const response = await apiRequest('/visits/slots', {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ propertyId, date, times }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Delete a slot (agent/admin)
  deleteSlot: async (slotId) => {
    try {
      const response = await apiRequest(`/visits/slots/${slotId}`, {
        method: 'DELETE',
        includeAuth: true,
      });
      return response;
    } catch (error) { throw error; }
  },
  // Mark date unavailable (agent/admin)
  markUnavailable: async ({ propertyId, date }) => {
    try {
      const response = await apiRequest('/visits/unavailable', {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ propertyId, date }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Remove unavailable date (agent/admin)
  unmarkUnavailable: async ({ propertyId, date }) => {
    try {
      const response = await apiRequest('/visits/unavailable', {
        method: 'DELETE',
        includeAuth: true,
        body: JSON.stringify({ propertyId, date }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Reschedule by requester
  reschedule: async (visitId, scheduledAt, note) => {
    try {
      const response = await apiRequest(`/visits/${visitId}/reschedule`, {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify({ scheduledAt, note }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Reschedule by recipient (keep approved)
  recipientReschedule: async (visitId, scheduledAt) => {
    try {
      const response = await apiRequest(`/visits/${visitId}/recipient-reschedule`, {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify({ scheduledAt }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Cancel by requester
  cancel: async (visitId) => {
    try {
      const response = await apiRequest(`/visits/${visitId}`, {
        method: 'DELETE',
        includeAuth: true,
      });
      return response;
    } catch (error) { throw error; }
  },
  // Update status (approve/reject)
  updateVisitStatus: async (visitId, status) => {
    try {
      const response = await apiRequest(`/visits/${visitId}/status`, {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Update visit status (visited/not visited)
  updateVisitOutcome: async (visitId, status) => {
    try {
      const response = await apiRequest(`/visits/${visitId}/visit-status`, {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  // List my requests
  myRequests: async (status) => {
    try {
      const endpoint = status ? `/visits/my?status=${encodeURIComponent(status)}` : '/visits/my';
      const response = await apiRequest(endpoint, { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
  // Visited properties convenience fetch
  getVisited: async () => {
    try {
      const response = await apiRequest('/visits/my?status=visited', { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
  // List requests assigned to me
  assignedToMe: async (status) => {
    try {
      const endpoint = status ? `/visits/assigned?status=${encodeURIComponent(status)}` : '/visits/assigned';
      const response = await apiRequest(endpoint, { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
};

// Offer API functions
export const offerAPI = {
  // Create a new offer (interest in buying)
  createOffer: async ({ propertyId, investorId, agentId, amount, message, preferredDate }) => {
    try {
      const response = await apiRequest('/offers', {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ propertyId, investorId, agentId, amount, message, preferredDate }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Get offers created by me
  getMyOffers: async () => {
    try {
      const response = await apiRequest('/offers/my', { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
  // For admin/agent: get offers received for my properties
  getOffersForMyProperties: async () => {
    try {
      const response = await apiRequest('/offers/received', { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
  // Explicitly fetch offers by agent id (agent/admin)
  getOffersByAgent: async (agentId) => {
    try {
      const response = await apiRequest(`/offers/agent/${agentId}`, { method: 'GET', includeAuth: true });
      return response;
    } catch (error) { throw error; }
  },
  // Update status (Approved/Rejected/Pending)
  updateOfferStatus: async (offerId, status) => {
    try {
      const response = await apiRequest(`/offers/${offerId}`, {
        method: 'PUT',
        includeAuth: true,
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) { throw error; }
  },
  // Mark advance paid
  markAdvancePaid: async ({ offerId, amount, orderId, paymentId, signature, method }) => {
    try {
      const response = await apiRequest(`/offers/${offerId}/advance`, {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ amount, orderId, paymentId, signature, method })
      });
      return response;
    } catch (e) { throw e; }
  }
};


// Payments API
export const paymentAPI = {
  createOrder: async ({ amount, currency = 'INR', receipt }) => {
    try {
      const response = await apiRequest('/payments/order', {
        method: 'POST',
        includeAuth: true,
        body: JSON.stringify({ amount, currency, receipt })
      });
      return response;
    } catch (e) { throw e; }
  }
};

// Export default API object
const api = {
  auth: authAPI,
  agent: agentAPI,
  property: propertyAPI,
  offer: offerAPI,
  payment: paymentAPI,
  healthCheck,
};

export default api;
