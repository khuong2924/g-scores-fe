import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add request interceptor to handle errors
api.interceptors.request.use(
  (config) => {
    // Ensure we're using HTTP
    if (config.url.startsWith('https://')) {
      config.url = config.url.replace('https://', 'http://');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check if the backend server is running');
    }
    return Promise.reject(error);
  }
);

export default api; 