//  import axios from 'axios';
//  const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
//  const api = axios.create({ baseURL });
//  api.interceptors.request.use((config) => {
//  const token = localStorage.getItem('token');
//  if (token) config.headers.Authorization = `Bearer ${token}`;
//  return config;
//  });
//  export default api;


import axios from 'axios';

// Production-ready API configuration
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

const api = axios.create({ 
  baseURL,
  timeout: 30000, // 30 seconds for deployment
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

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle network errors for deployment
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.log('Network timeout - backend might be starting up');
    }
    
    return Promise.reject(error);
  }
);

export default api;
