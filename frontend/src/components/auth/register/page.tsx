'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers/LanguageProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Check login status when loading the page
  useEffect(() => {
    setMounted(true);
    
    // If already logged in, redirect to dashboard
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
        // If user data is invalid, remove from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  const translations = {
    th: {
      title: 'ลงทะเบียน',
      createAccount: 'สร้างบัญชีผู้ใช้ใหม่',
      registerDescription: 'สร้างบัญชีเพื่อเข้าถึงบริการติดตามและควบคุมอุณหภูมิของเรา'
    },
    en: {
      title: 'Register',
      createAccount: 'Create a new account',
      registerDescription: 'Create an account to access our temperature-controlled logistics services'
    }
  };

  const t = translations[language] || translations.en;

  // If not loaded yet or redirecting, show loading
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
          {t.registerDescription}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}