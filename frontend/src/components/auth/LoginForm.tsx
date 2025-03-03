'use client';

<<<<<<< HEAD
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {User, Mail, Lock, Phone, Building, AlertCircle, CheckCircle} from 'lucide-react';
import {useLanguage} from '@/providers/LanguageProvider';
import {authService} from '@/services/api';

export function RegisterForm() {
  const router = useRouter();
  const {language} = useLanguage();
  const [loading, setLoading] = useState(false);
=======
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/components/auth/AuthProvider';

export function LoginForm() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> demo
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', 
    phone: '', company: '', acceptTerms: false
  });

<<<<<<< HEAD
  const t = {
    en: {
      name: 'Full Name', email: 'Email', phone: 'Phone Number', company: 'Company/Organization (Optional)',
      password: 'Password', confirmPassword: 'Confirm Password', acceptTerms: 'I accept the terms and conditions',
      register: 'Register', haveAccount: 'Already have an account?', login: 'Sign in',
      success: 'Registration successful! Please sign in.'
    },
    th: {
      name: 'ชื่อ-นามสกุล', email: 'อีเมล', phone: 'เบอร์โทรศัพท์', company: 'บริษัท/องค์กร (ไม่จำเป็น)',
      password: 'รหัสผ่าน', confirmPassword: 'ยืนยันรหัสผ่าน', acceptTerms: 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
      register: 'ลงทะเบียน', haveAccount: 'มีบัญชีอยู่แล้ว?', login: 'เข้าสู่ระบบ',
      success: 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ'
=======
  const translations = {
    th: {
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      rememberMe: 'จดจำฉัน',
      forgotPassword: 'ลืมรหัสผ่าน?',
      register: 'ลงทะเบียน',
      invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      passwordRequired: 'กรุณากรอกรหัสผ่าน',
      loginFailed: 'การเข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง'
    },
    en: {
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      register: 'Register',
      invalidCredentials: 'Invalid email or password',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      passwordRequired: 'Password is required',
      loginFailed: 'Login failed. Please try again.'
>>>>>>> demo
    }
  }[language];

  const handleChange = e => {
    const {name, value, type, checked} = e.target;
    setForm({...form, [name]: type === 'checkbox' ? checked : value});
  };

<<<<<<< HEAD
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
=======
  const t = translations[language] || translations.en;

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.email) {
      setError(t.emailRequired);
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError(t.emailInvalid);
      return;
    }
    
    if (!formData.password) {
      setError(t.passwordRequired);
      return;
    }
    
    setIsLoading(true);
>>>>>>> demo
    
    try {
      setLoading(true);
      await authService.register({
        username: form.email.split('@')[0],
        email: form.email,
        password: form.password,
        full_name: form.name,
        phone_number: form.phone,
        company: form.company
      });
      
      setSuccess(t.success);
      setForm({
        name: '', email: '', password: '', confirmPassword: '',
        phone: '', company: '', acceptTerms: false
      });
      
<<<<<<< HEAD
      setTimeout(() => router.push('/auth/login'), 2000);
=======
      if (!response.ok) {
        throw new Error(data.message || t.invalidCredentials);
      }
      
      // เพื่อการทดสอบ - ถ้าไม่มีการตอบกลับจริงๆ จาก API
      if (!data || !data.user) {
        // สร้างข้อมูลผู้ใช้จำลอง
        const mockUser = {
          id: '1',
          email: formData.email,
          name: formData.email.split('@')[0],
          role: formData.email.includes('admin') ? 'admin' : 
                formData.email.includes('staff') ? 'staff' : 'user'
        };
        
        // สำหรับการทดสอบเท่านั้น - ใช้ token ที่สร้างขึ้นมา
        const mockToken = 'mock_token_for_testing_only';
        
        // เรียกใช้ login ด้วยข้อมูลจำลอง
        login(mockUser, mockToken);
      } else {
        // กรณีได้รับข้อมูลจริงจาก API
        login(data.user, data.token);
      }
>>>>>>> demo
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 dark:bg-red-900/30 flex">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded-md bg-green-50 text-green-500 dark:bg-green-900/30 flex">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /><span>{success}</span>
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">{t.name}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border" />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">{t.email}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">{t.password}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" name="password" type="password" required value={form.password} onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 rounded-md border" />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">{t.confirmPassword}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} 
                onChange={handleChange} className="block w-full pl-10 pr-3 py-2 rounded-md border" />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">{t.phone}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border" />
          </div>
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">{t.company}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input id="company" name="company" type="text" value={form.company} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border" />
          </div>
        </div>
        
        <div className="flex items-center">
          <input id="acceptTerms" name="acceptTerms" type="checkbox" required checked={form.acceptTerms} 
            onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm">{t.acceptTerms}</label>
        </div>
        
        <button type="submit" disabled={loading} className="w-full py-2 px-4 border-transparent rounded-md 
          text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : t.register}
        </button>
        
        <div className="text-center">
          <p className="text-sm">
            {t.haveAccount}{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
              {t.login}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}