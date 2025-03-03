'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { Package, Clock, Settings, User } from 'lucide-react';

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ถ้ายังโหลดไม่เสร็จหรือยังไม่ได้ตรวจสอบสถานะการเข้าสู่ระบบ
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'User Dashboard' : 'แดชบอร์ดผู้ใช้'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? `Welcome back, ${user?.name || user?.full_name || 'User'}` 
              : `ยินดีต้อนรับกลับ, ${user?.name || user?.full_name || 'ผู้ใช้'}`}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'en' ? 'My Orders' : 'คำสั่งซื้อของฉัน'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'en' 
                ? 'View and manage your temperature-controlled shipments.' 
                : 'ดูและจัดการการขนส่งควบคุมอุณหภูมิของคุณ'}
            </p>
            <div className="mt-4">
              <Link 
                href="/orders"
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                {language === 'en' ? 'View Orders' : 'ดูคำสั่งซื้อ'}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Tracking Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'en' ? 'Track Shipments' : 'ติดตามการขนส่ง'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'en' 
                ? 'Monitor your shipments with real-time temperature data.' 
                : 'ติดตามการขนส่งของคุณด้วยข้อมูลอุณหภูมิแบบเรียลไทม์'}
            </p>
            <div className="mt-4">
              <Link 
                href="/tracking"
                className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center"
              >
                {language === 'en' ? 'Track Now' : 'ติดตามตอนนี้'}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'en' ? 'My Profile' : 'โปรไฟล์ของฉัน'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'en' 
                ? 'Manage your account settings and preferences.' 
                : 'จัดการการตั้งค่าบัญชีและการกำหนดค่าของคุณ'}
            </p>
            <div className="mt-4">
              <Link 
                href="/profile"
                className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center"
              >
                {language === 'en' ? 'View Profile' : 'ดูโปรไฟล์'}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}