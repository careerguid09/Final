import axios from 'axios';


const authFetch = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


authFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('counselorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authFetch;  // ✅ YEH IMPORTANT - DEFAULT EXPORT