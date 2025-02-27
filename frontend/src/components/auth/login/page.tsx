// src/app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers/LanguageProvider';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // ตรวจสอบสถานะการล็อกอินเมื่อโหลดหน้า
  useEffect(() => {
    setMounted(true);
    
    // ถ้าล็อกอินแล้ว ให้ redirect ไปหน้าแดชบอร์ด
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    if (isLoggedIn && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        // กรณีข้อมูลผู้ใช้ไม่ถูกต้อง ให้ลบออกจาก localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  const translations = {
    th: {
      title: 'เข้าสู่ระบบ',
      welcomeMessage: 'ยินดีต้อนรับกลับ',
      loginToContinue: 'เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ดและจัดการบัญชีของคุณ'
    },
    en: {
      title: 'Sign In',
      welcomeMessage: 'Welcome back',
      loginToContinue: 'Sign in to access your dashboard and manage your account'
    }
  };

  const t = translations[language] || translations.en;

  // ถ้ายังไม่โหลดเสร็จ หรือกำลัง redirect ให้แสดง loading
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">ColdChain</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t.loginToContinue}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}