// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Temperature services
export const temperatureService = {
  getByOrderId: async (orderId: string) => {
    const response = await apiClient.get(`/temperature/order/${orderId}`);
    return response.data;
  },
  getStats: async (orderId: string) => {
    const response = await apiClient.get(`/temperature/stats/${orderId}`);
    return response.data;
  },
  addLog: async (data: { orderId: string; temperature: number; humidity?: number }) => {
    const response = await apiClient.post('/temperature/log', data);
    return response.data;
  },
  getAlerts: async () => {
    const response = await apiClient.get('/temperature/alerts');
    return response.data;
  },
};

// Tracking services
export const trackingService = {
  getByOrderId: async (orderId: string) => {
    const response = await apiClient.get(`/tracking/order/${orderId}`);
    return response.data;
  },
  getByTrackingNumber: async (trackingNumber: string) => {
    const response = await apiClient.get(`/tracking/track/${trackingNumber}`);
    return response.data;
  },
  addEvent: async (data: { 
    orderId: string; 
    status: string; 
    location?: string; 
    notes?: string 
  }) => {
    const response = await apiClient.post('/tracking/event', data);
    return response.data;
  },
};

// Order services
export const orderService = {
  getOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
  create: async (orderData: any) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },
  update: async (id: string, orderData: any) => {
    const response = await apiClient.put(`/orders/${id}`, orderData);
    return response.data;
  },
  cancel: async (id: string, reason: string) => {
    const response = await apiClient.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },
};

export default {
  auth: authService,
  temperature: temperatureService,
  tracking: trackingService,
  order: orderService,
};