'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Lock, Mail, AlertCircle, Loader, ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [language, setLanguage] = useState('th'); // Default language
  const [theme, setTheme] = useState('light'); // Default theme

  // Language translation
  const translations = {
    th: {
      title: "เข้าสู่ระบบ",
      subtitle: "ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อจัดการการขนส่งของคุณ",
      email: "อีเมล",
      password: "รหัสผ่าน",
      rememberMe: "จดจำฉัน",
      forgotPassword: "ลืมรหัสผ่าน?",
      loginButton: "เข้าสู่ระบบ",
      noAccount: "ยังไม่มีบัญชี?",
      register: "สมัครสมาชิก",
      backToHome: "กลับไปหน้าหลัก",
      emailRequired: "กรุณากรอกอีเมล",
      passwordRequired: "กรุณากรอกรหัสผ่าน",
      invalidCredentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    },
    en: {
      title: "Login",
      subtitle: "Welcome back! Please login to manage your shipments",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Login",
      noAccount: "Don't have an account?",
      register: "Register",
      backToHome: "Back to Home",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      invalidCredentials: "Invalid email or password"
    }
  };
  
  // Get translations based on selected language
  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.email) {
      setError(t.emailRequired);
      return;
    }
    if (!formData.password) {
      setError(t.passwordRequired);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In production, replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes: hardcoded credentials check
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        // Success - redirect to dashboard
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
          name: 'Demo User', 
          email: formData.email,
          role: 'user'
        }));
        router.push('/dashboard');
      } else {
        // Failed login
        setError(t.invalidCredentials);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header with language and theme toggles */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={20} />
          <span>{t.backToHome}</span>
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={toggleLanguage}
            className={`px-3 py-1 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } border border-gray-300`}
          >
            {language === 'th' ? 'EN' : 'ไทย'}
          </button>
          <button 
            onClick={toggleTheme}
            className={`px-3 py-1 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } border border-gray-300`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className={`max-w-md w-full rounded-xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Left side with image/logo for larger screens */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {/* Email field */}
              <div>
                <label 
                  htmlFor="email" 
                  className={`block mb-2 font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {t.email}
                </label>
                <div className={`relative rounded-lg overflow-hidden border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white text-gray-900 placeholder-gray-500 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error && error.includes('email') ? 'border-red-500' : ''
                    }`}
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label 
                  htmlFor="password" 
                  className={`block mb-2 font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {t.password}
                </label>
                <div className={`relative rounded-lg overflow-hidden border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white text-gray-900 placeholder-gray-500 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error && error.includes('password') ? 'border-red-500' : ''
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className={`h-4 w-4 rounded ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-blue-500' 
                        : 'bg-white border-gray-300 text-blue-600'
                    }`}
                  />
                  <label 
                    htmlFor="remember" 
                    className={`ml-2 block text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t.rememberMe}
                  </label>
                </div>
                <a 
                  href="#" 
                  className={`text-sm font-medium ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {t.forgotPassword}
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    <span>{language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}</span>
                  </>
                ) : (
                  t.loginButton
                )}
              </button>

              {/* Register link */}
              <div className="text-center">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {t.noAccount}{' '}
                  <Link 
                    href="/register" 
                    className={`font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {t.register}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`p-4 text-center ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <p>© 2025 ColdChain Logistics. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved'}.</p>
      </footer>
    </div>
  );
}