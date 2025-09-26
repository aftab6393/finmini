import axios from 'axios';

// Production-ready API configuration
const baseURL = import.meta.env.VITE_API_BASE || 
                import.meta.env.VITE_API_URL || 
                'https://finmini-backend-aftab.onrender.com/api' || 
                'http://localhost:5000/api';

const api = axios.create({ 
  baseURL,
  timeout: 30000, // 30 second timeout for Render (important!)
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle Render cold start delays
    if (error.code === 'ECONNABORTED') {
      console.log('Request timeout - Render backend might be starting up');
    }
    
    return Promise.reject(error);
  }
);

export default api;
