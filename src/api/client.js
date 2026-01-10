import axios from 'axios';

// Normalize API URL - remove trailing slash if present
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL, // Remove /api from here
  withCredentials: true, // Changed to true for cookies/sessions
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Ensure the URL starts with /api
  if (config.url && !config.url.startsWith('/api/') && !config.url.startsWith('http')) {
    config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }
  return config;
});

export default apiClient;
