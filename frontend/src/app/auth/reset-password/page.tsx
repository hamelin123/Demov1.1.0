'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/providers/LanguageProvider';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบว่ามี token หรือไม่
    if (!token && typeof window !== 'undefined') {
      router.push('/auth/forgot-password');
    }
  }, [token, router]);
  
  // ถ้ายังไม่ได้โหลดเสร็จ แสดง loading
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const translations = {
    th: {
      title: 'รีเซ็ตรหัสผ่าน',
      description: 'สร้างรหัสผ่านใหม่ของคุณ',
      passwordLabel: 'รหัสผ่านใหม่',
      passwordPlaceholder: 'ป้อนรหัสผ่านใหม่',
      confirmPasswordLabel: 'ยืนยันรหัสผ่านใหม่',
      confirmPasswordPlaceholder: 'ป้อนรหัสผ่านใหม่อีกครั้ง',
      submitButton: 'รีเซ็ตรหัสผ่าน',
      backToLogin: 'กลับไปหน้าเข้าสู่ระบบ',
      passwordRequired: 'กรุณากรอกรหัสผ่าน',
      passwordMinLength: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
      passwordWeak: 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข',
      passwordsNotMatch: 'รหัสผ่านไม่ตรงกัน',
      successMessage: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ',
      errorMessage: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน โปรดลองอีกครั้ง',
      invalidToken: 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว โปรดขอลิงก์ใหม่'
    },
    en: {
      title: 'Reset Password',
      description: 'Create your new password',
      passwordLabel: 'New Password',
      passwordPlaceholder: 'Enter new password',
      confirmPasswordLabel: 'Confirm New Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      submitButton: 'Reset Password',
      backToLogin: 'Back to Login',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordWeak: 'Password must include uppercase, lowercase, and numbers',
      passwordsNotMatch: 'Passwords do not match',
      successMessage: 'Your password has been reset successfully. Please login with your new password.',
      errorMessage: 'An error occurred while resetting your password. Please try again.',
      invalidToken: 'Invalid or expired password reset link. Please request a new one.'
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
    if (!formData.password) {
      setError(t.passwordRequired);
      return;
    }
    
    if (formData.password.length < 8) {
      setError(t.passwordMinLength);
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError(t.passwordWeak);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsNotMatch);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // จำลองการส่ง API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะเรียก API
      // const response = await fetch(`/api/auth/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     token, 
      //     password: formData.password 
      //   }),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   if (response.status === 400 && data.message === 'Invalid or expired token') {
      //     throw new Error(t.invalidToken);
      //   }
      //   throw new Error(data.message || 'Failed to reset password');
      // }
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message || t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">ColdChain</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t.description}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.passwordLabel}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t.passwordPlaceholder}
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
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
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
            
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}