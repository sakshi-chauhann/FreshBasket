import axios from 'axios';

// Use the live backend URL directly (no environment variable needed)
const API_URL = 'https://freshbasket-ppj4.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freshbasket_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;