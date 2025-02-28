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
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    // Set auth data in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    return data;
  },
  
  register: async (userData: any) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  },
  
  getCurrentUser: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};

// Temperature services
export const temperatureService = {
  getByOrderId: async (orderId: string) => {
    const { data } = await apiClient.get(`/temperature/order/${orderId}`);
    return data;
  },
  
  getStats: async (orderId: string) => {
    const { data } = await apiClient.get(`/temperature/stats/${orderId}`);
    return data;
  },
  
  addLog: async (logData: { 
    orderId: string; 
    temperature: number; 
    humidity?: number; 
    notes?: string 
  }) => {
    const { data } = await apiClient.post('/temperature/log', logData);
    return data;
  },
  
  getAlerts: async () => {
    const { data } = await apiClient.get('/temperature/alerts');
    return data;
  },
};

// Tracking services
export const trackingService = {
  getByOrderId: async (orderId: string) => {
    const { data } = await apiClient.get(`/tracking/order/${orderId}`);
    return data;
  },
  
  getByTrackingNumber: async (trackingNumber: string) => {
    const { data } = await apiClient.get(`/tracking/track/${trackingNumber}`);
    return data;
  },
  
  addEvent: async (eventData: { 
    orderId: string; 
    status: string; 
    location?: string; 
    notes?: string 
  }) => {
    const { data } = await apiClient.post('/tracking/event', eventData);
    return data;
  },
};

// Order services
export const orderService = {
  getOrders: async (params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    status?: string; 
    sort?: string;
  }) => {
    const { data } = await apiClient.get('/orders/my-orders', { params });
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
  },
  
  create: async (orderData: any) => {
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },
  
  update: async (id: string, orderData: any) => {
    const { data } = await apiClient.put(`/orders/${id}`, orderData);
    return data;
  },
  
  cancel: async (id: string, reason: string) => {
    const { data } = await apiClient.patch(`/orders/${id}/cancel`, { reason });
    return data;
  },
};

export default {
  auth: authService,
  temperature: temperatureService,
  tracking: trackingService,
  order: orderService,
};