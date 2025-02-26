// src/services/api.ts
const API_URL = 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const getOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};