import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'}
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    ['token', 'user', 'isLoggedIn'].forEach(key => localStorage.removeItem(key));
    window.location.href = '/auth/login';
  }
  return Promise.reject(error);
});

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
  logout: () => ['token', 'user', 'isLoggedIn'].forEach(key => localStorage.removeItem(key)),
  getCurrentUser: async () => (await apiClient.get('/auth/me')).data
};

export const temperatureService = {
  getByOrderId: async orderId => (await apiClient.get(`/temperature/order/${orderId}`)).data,
  getStats: async orderId => (await apiClient.get(`/temperature/stats/${orderId}`)).data,
  addLog: async logData => (await apiClient.post('/temperature/log', logData)).data,
  getAlerts: async () => (await apiClient.get('/temperature/alerts')).data
};

export const trackingService = {
  getByOrderId: async orderId => (await apiClient.get(`/tracking/order/${orderId}`)).data,
  getByTrackingNumber: async trackingNumber => (await apiClient.get(`/tracking/track/${trackingNumber}`)).data,
  addEvent: async eventData => (await apiClient.post('/tracking/event', eventData)).data
};

export const orderService = {
  getOrders: async params => (await apiClient.get('/orders/my-orders', {params})).data,
  getById: async id => (await apiClient.get(`/orders/${id}`)).data,
  create: async orderData => (await apiClient.post('/orders', orderData)).data,
  update: async (id, orderData) => (await apiClient.put(`/orders/${id}`, orderData)).data,
  cancel: async (id, reason) => (await apiClient.patch(`/orders/${id}/cancel`, {reason})).data
};

export default {auth: authService, temperature: temperatureService, tracking: trackingService, order: orderService};