import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      // Debug: Log the token being sent
      console.log('🔑 Sending token:', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and provide better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login if needed
        Cookies.remove('auth_token');
        // Don't auto-redirect here, let components handle it
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden:', data?.message || 'Insufficient permissions');
      } else if (status === 429) {
        // Rate limit exceeded
        console.error('Rate limit exceeded. Please try again later.');
      } else if (status >= 500) {
        // Server error
        console.error('Server error occurred. Please try again later.');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
    } else {
      // Other error
      console.error('An unexpected error occurred:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
