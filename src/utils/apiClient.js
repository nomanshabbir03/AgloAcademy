import axios from 'axios';

// Backend URL
const BACKEND_URL = 'http://localhost:5000';

// Create Axios instance
const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`, // ✅ only once
  withCredentials: true, // send cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // JWT token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⚡️ DO NOT prepend /api again — baseURL already has it
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unified error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
