<<<<<<< HEAD
// frontend/src/app/staff/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { orderService, temperatureService } from '@/services/api';
import { Truck, Package, Thermometer, AlertCircle, RefreshCw } from 'lucide-react';

export default function StaffDashboard() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch active orders
        const ordersResponse = await orderService.getOrders();
        setOrders(ordersResponse.orders || []);
        
        // Fetch temperature alerts
        const alertsResponse = await temperatureService.getAlerts();
        setAlerts(alertsResponse.alerts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  // frontend/src/app/staff/dashboard/page.tsx (ต่อ)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t('staff.dashboard')}</h1>
        
        <button 
          onClick={() => router.refresh()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
          <span>{t('common.refresh')}</span>
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Orders Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('staff.activeOrders')}</h2>
              <p className="text-2xl font-semibold">{orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length}</p>
            </div>
          </div>
        </div>
        
        {/* Pending Temperature Logs */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <Thermometer size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('staff.pendingTemperatureLogs')}</h2>
              <p className="text-2xl font-semibold">{orders.filter(order => order.status === 'in-transit').length}</p>
            </div>
          </div>
        </div>
        
        {/* Temperature Alerts */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('staff.temperatureAlerts')}</h2>
              <p className="text-2xl font-semibold">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Shipments Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('staff.activeShipments')}</h2>
          <button 
            onClick={() => router.push('/staff/shipments')}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {t('common.viewAll')}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.orderNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.lastUpdate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders
                  .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
                  .map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        <button 
                          onClick={() => router.push(`/staff/orders/${order.id}`)}
                          className="hover:underline"
                        >
                          {order.order_number}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {order.user?.full_name || order.sender_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'in-transit' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                            : order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {t(`shipment.status.${order.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(order.updated_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/staff/temperature/log/${order.id}`)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            {t('staff.addTemperature')}
                          </button>
                          <button
                            onClick={() => router.push(`/staff/tracking/update/${order.id}`)}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          >
                            {t('staff.updateLocation')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {t('staff.noActiveShipments')}
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Temperature Alerts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('staff.recentAlerts')}</h2>
          <button 
            onClick={() => router.push('/staff/temperature/alerts')}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {t('common.viewAll')}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          {alerts.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.orderNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.temperature')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.acceptableRange')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.timestamp')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('staff.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      <button 
                        onClick={() => router.push(`/staff/orders/${alert.order_id}`)}
                        className="hover:underline"
                      >
                        {alert.order?.order_number || alert.order_id}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                      {alert.temperature}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {/* This would be product-specific in a real application */}
                      -20°C to -15°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => router.push(`/staff/temperature/alert/${alert.id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {t('staff.viewDetails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {t('staff.noAlerts')}
            </div>
          )}
=======
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';

export default function StaffDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  // ถ้าไม่ใช่ staff หรือ admin
  if (user?.role !== 'staff' && user?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Staff Dashboard' : 'แดชบอร์ดพนักงาน'}
      </h1>
      <p className="mb-4">
        {language === 'en' 
          ? `Logged in as: ${user.name || user.full_name || user.email} (Staff)` 
          : `เข้าสู่ระบบในฐานะ: ${user.name || user.full_name || user.email} (พนักงาน)`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipment Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Manage Shipments' : 'จัดการการขนส่ง'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'en' 
              ? 'Update and track shipment status and location' 
              : 'อัปเดตและติดตามสถานะและตำแหน่งของการขนส่ง'}
          </p>
          <a 
            href="/staff/shipments" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {language === 'en' ? 'View Shipments' : 'ดูการขนส่ง'}
          </a>
        </div>
        
        {/* Temperature Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Temperature Monitoring' : 'การตรวจสอบอุณหภูมิ'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'en' 
              ? 'Record and monitor temperature for active shipments' 
              : 'บันทึกและตรวจสอบอุณหภูมิสำหรับการขนส่งที่กำลังดำเนินการ'}
          </p>
          <a 
            href="/staff/temperature" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {language === 'en' ? 'Temperature Logs' : 'บันทึกอุณหภูมิ'}
          </a>
        </div>
        
        {/* Scan Shipment */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Scan Shipments' : 'สแกนการขนส่ง'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'en' 
              ? 'Scan QR codes to quickly update shipment information' 
              : 'สแกนคิวอาร์โค้ดเพื่ออัปเดตข้อมูลการขนส่งอย่างรวดเร็ว'}
          </p>
          <a 
            href="/staff/shipments/scan" 
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {language === 'en' ? 'Scan QR Code' : 'สแกนคิวอาร์โค้ด'}
          </a>
        </div>
        
        {/* Reports Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Daily Reports' : 'รายงานประจำวัน'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'en' 
              ? 'View and generate daily activity reports' 
              : 'ดูและสร้างรายงานกิจกรรมประจำวัน'}
          </p>
          <a 
            href="/staff/reports" 
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            {language === 'en' ? 'View Reports' : 'ดูรายงาน'}
          </a>
>>>>>>> demo
        </div>
      </div>
    </div>
  );
}