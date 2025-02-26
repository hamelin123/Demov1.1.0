'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Lock, Mail, Phone, Building, AlertCircle, Loader, ArrowLeft, Check
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [language, setLanguage] = useState('th'); // Default language
  const [theme, setTheme] = useState('light'); // Default theme

  // Language translations
  const translations = {
    th: {
      title: "สร้างบัญชีของคุณ",
      subtitle: "สมัครสมาชิกเพื่อใช้บริการขนส่งควบคุมอุณหภูมิของเรา",
      name: "ชื่อ-นามสกุล",
      email: "อีเมล",
      phone: "เบอร์โทรศัพท์",
      company: "บริษัท/องค์กร",
      password: "รหัสผ่าน",
      confirmPassword: "ยืนยันรหัสผ่าน",
      terms: "ฉันยอมรับ",
      termsLink: "ข้อกำหนดและเงื่อนไขการใช้งาน",
      registerButton: "สมัครสมาชิก",
      haveAccount: "มีบัญชีอยู่แล้ว?",
      login: "เข้าสู่ระบบ",
      backToHome: "กลับไปหน้าหลัก",
      nameRequired: "กรุณากรอกชื่อ-นามสกุล",
      emailRequired: "กรุณากรอกอีเมล",
      phoneRequired: "กรุณากรอกเบอร์โทรศัพท์",
      emailInvalid: "รูปแบบอีเมลไม่ถูกต้อง",
      passwordRequired: "กรุณากรอกรหัสผ่าน",
      passwordMinLength: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      passwordNotMatch: "รหัสผ่านไม่ตรงกัน",
      termsRequired: "กรุณายอมรับข้อกำหนดและเงื่อนไข",
      registrationSuccess: "ลงทะเบียนสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ..."
    },
    en: {
      title: "Create Your Account",
      subtitle: "Register to use our temperature-controlled logistics services",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      company: "Company/Organization",
      password: "Password",
      confirmPassword: "Confirm Password",
      terms: "I agree to the",
      termsLink: "Terms and Conditions",
      registerButton: "Register",
      haveAccount: "Already have an account?",
      login: "Login",
      backToHome: "Back to Home",
      nameRequired: "Please enter your full name",
      emailRequired: "Please enter your email",
      phoneRequired: "Please enter your phone number",
      emailInvalid: "Invalid email format",
      passwordRequired: "Please enter a password",
      passwordMinLength: "Password must be at least 8 characters long",
      passwordNotMatch: "Passwords do not match",
      termsRequired: "Please accept the terms and conditions",
      registrationSuccess: "Registration successful! Redirecting to login..."
    }
  };
  
  // Get translations based on selected language
  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.name) {
      setError(t.nameRequired);
      return;
    }
    if (!formData.email) {
      setError(t.emailRequired);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError(t.emailInvalid);
      return;
    }
    if (!formData.phone) {
      setError(t.phoneRequired);
      return;
    }
    if (!formData.password) {
      setError(t.passwordRequired);
      return;
    }
    if (formData.password.length < 8) {
      setError(t.passwordMinLength);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordNotMatch);
      return;
    }
    if (!acceptTerms) {
      setError(t.termsRequired);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In production, replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, always succeed
      // Show success message
      setError('');
      alert(t.registrationSuccess);
      
      // Redirect to login page
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        <div className={`max-w-2xl w-full rounded-xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <div>
                  <label 
                    htmlFor="name" 
                    className={`block mb-2 font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {t.name}
                  </label>
                  <div className={`relative rounded-lg overflow-hidden border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder={language === 'th' ? 'ชื่อ นามสกุล' : 'John Doe'}
                    />
                  </div>
                </div>

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
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div>
                  <label 
                    htmlFor="phone" 
                    className={`block mb-2 font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {t.phone}
                  </label>
                  <div className={`relative rounded-lg overflow-hidden border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0812345678"
                    />
                  </div>
                </div>

                {/* Company field */}
                <div>
                  <label 
                    htmlFor="company" 
                    className={`block mb-2 font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {t.company}
                  </label>
                  <div className={`relative rounded-lg overflow-hidden border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                    </div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder={language === 'th' ? 'บริษัท ตัวอย่าง จำกัด' : 'Example Company, Inc.'}
                    />
                  </div>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className={`block mb-2 font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {t.confirmPassword}
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
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-center">
                <div 
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer mr-2 ${
                    acceptTerms
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {acceptTerms && <Check size={14} />}
                </div>
                <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t.terms}{' '}
                  <a 
                    href="#"
                    className={`font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {t.termsLink}
                  </a>
                </label>
              </div>

              {/* Register button */}
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
                  t.registerButton
                )}
              </button>

              {/* Login link */}
              <div className="text-center mt-6">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {t.haveAccount}{' '}
                  <Link 
                    href="/login" 
                    className={`font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {t.login}
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