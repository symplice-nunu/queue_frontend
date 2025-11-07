import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const queueAPI = {
  getCurrent: () => api.get('/queue/current'),
  getDisplay: () => api.get('/queue/display'),
  addPatient: (data) => api.post('/queue/add', data),
  callPatient: (id) => api.put(`/queue/${id}/call`),
  completePatient: (id) => api.put(`/queue/${id}/complete`),
  updatePriority: (id, priority) => api.put(`/queue/${id}/priority`, { priority }),
  removePatient: (id) => api.delete(`/queue/${id}`),
};

export default api;

