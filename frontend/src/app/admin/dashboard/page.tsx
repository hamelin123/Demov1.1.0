'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';

export default function AdminDashboardPage() {
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

  // ถ้าไม่ใช่ admin
  if (user?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Admin Dashboard' : 'แดชบอร์ดผู้ดูแลระบบ'}
      </h1>
      <p className="mb-4">
        {language === 'en' 
          ? `Logged in as: ${user.name || user.full_name || user.email} (Admin)` 
          : `เข้าสู่ระบบในฐานะ: ${user.name || user.full_name || user.email} (ผู้ดูแลระบบ)`}
      </p>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/users" className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center hover:bg-blue-200 dark:hover:bg-blue-800/30">
            {language === 'en' ? 'Manage Users' : 'จัดการผู้ใช้'}
          </a>
          <a href="/admin/orders" className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center hover:bg-green-200 dark:hover:bg-green-800/30">
            {language === 'en' ? 'Manage Orders' : 'จัดการคำสั่งซื้อ'}
          </a>
          <a href="/admin/shipments" className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center hover:bg-purple-200 dark:hover:bg-purple-800/30">
            {language === 'en' ? 'Shipments' : 'การขนส่ง'}
          </a>
          <a href="/admin/settings" className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-200 dark:hover:bg-gray-600">
            {language === 'en' ? 'Settings' : 'ตั้งค่า'}
          </a>
        </div>
      </div>
    </div>
  );
}