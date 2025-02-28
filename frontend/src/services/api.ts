// Optimized api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'}
});

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// Handle unauthorized errors
apiClient.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/auth/login';
  }
  return Promise.reject(error);
});

// Auth services
export const authService = {
  login: async (email, password) => {
    const {data} = await apiClient.post('/auth/login', {email, password});
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    return data;
  },
  register: async userData => (await apiClient.post('/auth/register', userData)).data,
  logout: () => {
    ['token', 'user', 'isLoggedIn'].forEach(item => localStorage.removeItem(item));
  },
  getCurrentUser: async () => (await apiClient.get('/auth/me')).data
};

// Temperature services
export const temperatureService = {
  getByOrderId: async orderId => (await apiClient.get(`/temperature/order/${orderId}`)).data,
  getStats: async orderId => (await apiClient.get(`/temperature/stats/${orderId}`)).data,
  addLog: async logData => (await apiClient.post('/temperature/log', logData)).data,
  getAlerts: async () => (await apiClient.get('/temperature/alerts')).data
};

// Tracking services
export const trackingService = {
  getByOrderId: async orderId => (await apiClient.get(`/tracking/order/${orderId}`)).data,
  getByTrackingNumber: async trackingNumber => (await apiClient.get(`/tracking/track/${trackingNumber}`)).data,
  addEvent: async eventData => (await apiClient.post('/tracking/event', eventData)).data
};

// Order services
export const orderService = {
  getOrders: async params => (await apiClient.get('/orders/my-orders', {params})).data,
  getById: async id => (await apiClient.get(`/orders/${id}`)).data,
  create: async orderData => (await apiClient.post('/orders', orderData)).data,
  update: async (id, orderData) => (await apiClient.put(`/orders/${id}`, orderData)).data,
  cancel: async (id, reason) => (await apiClient.patch(`/orders/${id}/cancel`, {reason})).data
};

export default {auth: authService, temperature: temperatureService, tracking: trackingService, order: orderService};