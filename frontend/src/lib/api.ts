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
  return fetchAPI(`/tracking/track/${trackingNumber}`);
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

/**
 * ฟังก์ชันสำหรับบันทึกอุณหภูมิโดยพนักงาน
 */
export async function recordTemperature(data: {
  orderId: string;
  temperature: number;
  humidity?: number;
  location?: string;
  notes?: string;
}) {
  return fetchAPI('/staff/temperature', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับอัปเดตสถานะการขนส่งโดยพนักงาน
 */
export async function updateShipmentStatus(data: {
  orderId: string;
  status: string;
  location: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}) {
  return fetchAPI('/staff/shipment-status', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ admin)
 */
export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);
  
  return fetchAPI(`/users?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับเปลี่ยนบทบาทผู้ใช้ (สำหรับ superadmin)
 */
export async function updateUserRole(userId: string, data: {
  role: 'admin' | 'staff' | 'user';
  permissions?: string[];
}) {
  return fetchAPI(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับเปลี่ยนสถานะผู้ใช้ (สำหรับ admin/superadmin)
 */
export async function updateUserStatus(userId: string, data: {
  status: 'active' | 'inactive';
}) {
  return fetchAPI(`/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่ (สำหรับ admin/superadmin)
 */
/**
 * ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่ (สำหรับ admin/superadmin)
 */
export async function createUser(userData: any) {
  return fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ตาม ID
 */
export async function getUserById(userId: string) {
  return fetchAPI(`/users/${userId}`);
}

/**
 * ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
 */
export async function updateUser(userId: string, userData: any) {
  return fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

/**
 * ฟังก์ชันสำหรับลบผู้ใช้
 */
export async function deleteUser(userId: string) {
  return fetchAPI(`/users/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลการขนส่งทั้งหมด (สำหรับ admin)
 */
export async function getAllShipments(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  
  return fetchAPI(`/admin/shipments?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลการแจ้งเตือนทั้งหมด (สำหรับ admin)
 */
export async function getAllAlerts(params: {
  page?: number;
  limit?: number;
  type?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.type) queryParams.append('type', params.type);
  
  return fetchAPI(`/admin/alerts?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด (สำหรับ admin)
 */
export async function getAllStaff(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  
  return fetchAPI(`/admin/staff?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับดึงประวัติการกระทำของพนักงาน (สำหรับ admin)
 */
export async function getStaffActions(staffId: string, params: {
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  return fetchAPI(`/admin/staff/${staffId}/actions?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลกระดานข้อมูล (Dashboard) สำหรับ admin
 */
export async function getAdminDashboardData() {
  return fetchAPI('/admin/dashboard');
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลกระดานข้อมูล (Dashboard) สำหรับ staff
 */
export async function getStaffDashboardData() {
  return fetchAPI('/staff/dashboard');
}

/**
 * ฟังก์ชันสำหรับดึงการสั่งซื้อที่ต้องดำเนินการโดยพนักงาน
 */
export async function getActiveShipments() {
  return fetchAPI('/staff/active-shipments');
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลยานพาหนะทั้งหมด
 */
export async function getAllVehicles(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  
  return fetchAPI(`/vehicles?${queryParams.toString()}`);
}

/**
 * ฟังก์ชันสำหรับสร้างรายงานตามช่วงเวลา
 */
export async function generateReport(data: {
  type: 'sales' | 'temperature' | 'staff' | 'shipments';
  startDate: string;
  endDate: string;
  format?: 'pdf' | 'csv' | 'excel';
}) {
  return fetchAPI('/admin/reports/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับอัปเดตโปรไฟล์ผู้ใช้
 */
export async function updateProfile(profileData: any) {
  return fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

/**
 * ฟังก์ชันสำหรับเปลี่ยนรหัสผ่าน
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  return fetchAPI('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับลืมรหัสผ่าน (ส่งอีเมล)
 */
export async function forgotPassword(email: string) {
  return fetchAPI('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * ฟังก์ชันสำหรับรีเซ็ตรหัสผ่านด้วยโทเค็น
 */
export async function resetPassword(data: {
  token: string;
  newPassword: string;
}) {
  return fetchAPI('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับยืนยันอีเมล
 */
export async function verifyEmail(token: string) {
  return fetchAPI(`/auth/verify-email/${token}`);
}

/**
 * ฟังก์ชันสำหรับดึงการตั้งค่าระบบ (สำหรับ superadmin)
 */
export async function getSystemSettings() {
  return fetchAPI('/admin/settings');
}

/**
 * ฟังก์ชันสำหรับอัปเดตการตั้งค่าระบบ (สำหรับ superadmin)
 */
export async function updateSystemSettings(settings: any) {
  return fetchAPI('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

/**
 * ฟังก์ชันสำหรับแสกน QR code ของพัสดุ (สำหรับพนักงาน)
 */
export async function scanShipmentQR(trackingNumber: string) {
  return fetchAPI(`/staff/scan/${trackingNumber}`);
}

/**
 * ฟังก์ชันสำหรับส่งเหตุการณ์ติดตามอุปกรณ์ IoT
 */
export async function sendIoTEvent(data: {
  deviceId: string;
  temperature: number;
  humidity?: number;
  batteryLevel?: number;
  timestamp?: string;
}) {
  return fetchAPI('/iot/event', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ฟังก์ชันสำหรับเชื่อมต่ออุปกรณ์ IoT กับพัสดุ
 */
export async function linkDeviceToOrder(data: {
  orderId: string;
  deviceId: string;
}) {
  return fetchAPI('/admin/iot/link', {
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
  calculateShippingPrice,
  recordTemperature,
  updateShipmentStatus,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllShipments,
  getAllAlerts,
  getAllStaff,
  getStaffActions,
  getAdminDashboardData,
  getStaffDashboardData,
  getActiveShipments,
  getAllVehicles,
  generateReport,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getSystemSettings,
  updateSystemSettings,
  scanShipmentQR,
  sendIoTEvent,
  linkDeviceToOrder
};
ตรงนี้ที่เสนอมา อยากให้ข้ามขั้นตอน iot ตอน เนื่องจากยังไม่มี อุปกรณ์ในการทำงาน แต่เราสามารถพัฒนาระบบอื่นๆก่อนได้มั้ย