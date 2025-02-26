/**
 * API Service สำหรับเชื่อมต่อกับ Backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * ฟังก์ชันสำหรับเรียกใช้ API โดยรวม
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // ตรวจสอบสถานะของการตอบกลับ
    if (response.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    // กรณีอื่น ๆ
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

/**
 * ฟังก์ชันสำหรับการเข้าสู่ระบบ
 */
export async function login(email: string, password: string) {
  const response = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // บันทึกข้อมูลการเข้าสู่ระบบ
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
  }

  return response;
}

/**
 * ฟังก์ชันสำหรับการลงทะเบียน
 */
export async function register(userData: any) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * ฟังก์ชันสำหรับการออกจากระบบ
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
 */
export async function getCurrentUser() {
  return fetchAPI('/auth/me');
}

/**
 * ฟังก์ชันสำหรับติดตามพัสดุ
 */
export async function trackShipment(trackingNumber: string) {
  return fetchAPI(`/tracking/${trackingNumber}`);
}

/**
 * ฟังก์ชันสำหรับดึงคำสั่งซื้อทั้งหมดของผู้ใช้
 */
export async function getUserOrders() {
  return fetchAPI('/orders/my-orders');
}

/**
 * ฟังก์ชันสำหรับดึงคำสั่งซื้อตาม ID
 */
export async function getOrderById(orderId: string) {
  return fetchAPI(`/orders/${orderId}`);
}

/**
 * ฟังก์ชันสำหรับสร้างคำสั่งซื้อใหม่
 */
export async function createOrder(orderData: any) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * ฟังก์ชันสำหรับอัปเดตคำสั่งซื้อ
 */
export async function updateOrder(orderId: string, orderData: any) {
  return fetchAPI(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  });
}

/**
 * ฟังก์ชันสำหรับยกเลิกคำสั่งซื้อ
 */
export async function cancelOrder(orderId: string, reason: string) {
  return fetchAPI(`/orders/${orderId}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลอุณหภูมิตาม Order ID
 */
export async function getTemperatureByOrderId(orderId: string) {
  return fetchAPI(`/temperature/order/${orderId}`);
}

/**
 * ฟังก์ชันสำหรับดึงสถิติอุณหภูมิตาม Order ID
 */
export async function getTemperatureStats(orderId: string) {
  return fetchAPI(`/temperature/stats/${orderId}`);
}

/**
 * ฟังก์ชันสำหรับดึงการแจ้งเตือนอุณหภูมิตาม Order ID
 */
export async function getTemperatureAlerts(orderId: string) {
  return fetchAPI(`/temperature/alerts/${orderId}`);
}

/**
 * ฟังก์ชันสำหรับคำนวณราคาขนส่ง
 */
export async function calculateShippingPrice(data: {
  weight: number;
  dimensions: string;
  fromZipcode: string;
  toZipcode: string;
  temperature: number;
  services?: string[];
}) {
  return fetchAPI('/price/calculate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  trackShipment,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
  getTemperatureByOrderId,
  getTemperatureStats,
  getTemperatureAlerts,
  calculateShippingPrice
};