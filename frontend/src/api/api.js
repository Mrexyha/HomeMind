import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
};

export const devicesAPI = {
  getAll: () => api.get('/api/devices'),
  getOne: (id) => api.get(`/api/devices/${id}`),
  create: (data) => api.post('/api/devices', data),
  update: (id, data) => api.patch(`/api/devices/${id}`, data),
  delete: (id) => api.delete(`/api/devices/${id}`),
  sendCommand: (id, command, payload) => api.post(`/api/devices/${id}/command`, { command, payload }),
};

export const automationsAPI = {
  getAll: () => api.get('/api/automations'),
  getOne: (id) => api.get(`/api/automations/${id}`),
  create: (data) => api.post('/api/automations', data),
  update: (id, data) => api.patch(`/api/automations/${id}`, data),
  delete: (id) => api.delete(`/api/automations/${id}`),
  execute: (id) => api.post(`/api/automations/${id}/execute`),
};

export const telemetryAPI = {
  getByDevice: (deviceId, from, to) => api.get('/api/telemetry', { params: { deviceId, from, to } }),
};

export default api;

