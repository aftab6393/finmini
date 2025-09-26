import axios from 'axios';

// Simple version with Render URL
const api = axios.create({ 
  baseURL: 'https://finmini-backend-aftab.onrender.com/api',
  timeout: 30000 // Important for Render!
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
