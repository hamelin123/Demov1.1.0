'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // ถ้ายังไม่ได้โหลดเสร็จ หรือกำลังตรวจสอบการเข้าสู่ระบบ แสดง loading
  if (!mounted || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!isAuthenticated) {
    return null; // router.push แล้วไม่ต้องแสดงอะไร
  }

  const translations = {
    th: {
      title: 'เปลี่ยนรหัสผ่าน',
      currentPasswordLabel: 'รหัสผ่านปัจจุบัน',
      currentPasswordPlaceholder: 'ป้อนรหัสผ่านปัจจุบัน',
      newPasswordLabel: 'รหัสผ่านใหม่',
      newPasswordPlaceholder: 'ป้อนรหัสผ่านใหม่',
      confirmPasswordLabel: 'ยืนยันรหัสผ่านใหม่',
      confirmPasswordPlaceholder: 'ป้อนรหัสผ่านใหม่อีกครั้ง',
      submitButton: 'เปลี่ยนรหัสผ่าน',
      backToProfile: 'กลับไปหน้าโปรไฟล์',
      currentPasswordRequired: 'กรุณากรอกรหัสผ่านปัจจุบัน',
      newPasswordRequired: 'กรุณากรอกรหัสผ่านใหม่',
      passwordMinLength: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
      passwordWeak: 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข',
      passwordsNotMatch: 'รหัสผ่านไม่ตรงกัน',
      successMessage: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว',
      errorMessage: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน โปรดลองอีกครั้ง',
      incorrectCurrentPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
    },
    en: {
      title: 'Change Password',
      currentPasswordLabel: 'Current Password',
      currentPasswordPlaceholder: 'Enter your current password',
      newPasswordLabel: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmPasswordLabel: 'Confirm New Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      submitButton: 'Change Password',
      backToProfile: 'Back to Profile',
      currentPasswordRequired: 'Current password is required',
      newPasswordRequired: 'New password is required',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordWeak: 'Password must include uppercase, lowercase, and numbers',
      passwordsNotMatch: 'Passwords do not match',
      successMessage: 'Your password has been changed successfully',
      errorMessage: 'An error occurred while changing your password. Please try again.',
      incorrectCurrentPassword: 'Current password is incorrect'
    }
  };

  const t = translations[language] || translations.en;

  const validatePassword = (password: string) => {
    if (password.length < 8) return false;
    
    // ตรวจสอบว่ามีตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.currentPassword) {
      setError(t.currentPasswordRequired);
      return;
    }
    
    if (!formData.newPassword) {
      setError(t.newPasswordRequired);
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError(t.passwordMinLength);
      return;
    }
    
    if (!validatePassword(formData.newPassword)) {
      setError(t.passwordWeak);
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t.passwordsNotMatch);
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      // จำลองการส่ง API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะเรียก API
      // const response = await fetch(`/api/auth/change-password`, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ 
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword
      //   }),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   if (response.status === 401 && data.message === 'Current password is incorrect') {
      //     throw new Error(t.incorrectCurrentPassword);
      //   }
      //   throw new Error(data.message || 'Failed to change password');
      // }
      
      setSuccess(true);
      // รีเซ็ตฟอร์ม
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || t.errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button 
              onClick={() => router.push('/profile')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ArrowLeft size={20} className="mr-2" />
              {t.backToProfile}
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {t.title}
              </h1>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {success ? (
                <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">
                        {t.successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800 dark:text-red-400">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.currentPasswordLabel}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t.currentPasswordPlaceholder}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.newPasswordLabel}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t.newPasswordPlaceholder}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.confirmPasswordLabel}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t.confirmPasswordPlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t.submitButton}...
                        </>
                      ) : (
                        t.submitButton
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}