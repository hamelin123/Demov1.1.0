'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/providers/LanguageProvider';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ถ้ายังไม่ได้โหลดเสร็จ แสดง loading
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const translations = {
    th: {
      title: 'ลืมรหัสผ่าน',
      description: 'ป้อนอีเมลของคุณเพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน',
      emailLabel: 'อีเมล',
      emailPlaceholder: 'ป้อนอีเมลของคุณ',
      submitButton: 'ส่งลิงก์รีเซ็ตรหัสผ่าน',
      backToLogin: 'กลับไปหน้าเข้าสู่ระบบ',
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      successMessage: 'เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว โปรดตรวจสอบอีเมลของคุณ',
      errorMessage: 'เกิดข้อผิดพลาดในการส่งอีเมล โปรดลองอีกครั้ง'
    },
    en: {
      title: 'Forgot Password',
      description: 'Enter your email to receive a password reset link',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      submitButton: 'Send Reset Link',
      backToLogin: 'Back to Login',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      successMessage: 'We have sent a password reset link to your email. Please check your inbox.',
      errorMessage: 'An error occurred while sending the email. Please try again.'
    }
  };

  const t = translations[language] || translations.en;

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email) {
      setError(t.emailRequired);
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t.emailInvalid);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // จำลองการส่ง API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะเรียก API
      // const response = await fetch(`/api/auth/forgot-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send reset link');
      // }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error sending reset link:', err);
      setError(t.errorMessage);
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.emailLabel}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t.emailPlaceholder}
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