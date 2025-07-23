import axios from 'axios';
/* import cookies from 'js-cookie'; */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* API.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt-auth');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
); */

export default API;
