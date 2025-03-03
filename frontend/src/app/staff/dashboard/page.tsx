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
        </div>
      </div>
    </div>
  );
}