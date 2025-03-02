// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/components/auth/AuthProvider';

export function RegisterForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    acceptTerms: false
  });

  const translations = {
    th: {
      name: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'บริษัท/องค์กร (ไม่จำเป็น)',
      password: 'รหัสผ่าน',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      acceptTerms: 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
      register: 'ลงทะเบียน',
      haveAccount: 'มีบัญชีอยู่แล้ว?',
      login: 'เข้าสู่ระบบ',
      nameRequired: 'กรุณากรอกชื่อ-นามสกุล',
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      phoneRequired: 'กรุณากรอกเบอร์โทรศัพท์',
      phoneInvalid: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
      passwordRequired: 'กรุณากรอกรหัสผ่าน',
      passwordMinLength: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
      passwordWeak: 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข',
      passwordNotMatch: 'รหัสผ่านไม่ตรงกัน',
      termsRequired: 'กรุณายอมรับข้อกำหนดและเงื่อนไข',
      registrationSuccess: 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ',
      registrationFailed: 'การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง'
    },
    en: {
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company/Organization (Optional)',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      acceptTerms: 'I accept the terms and conditions',
      register: 'Register',
      haveAccount: 'Already have an account?',
      login: 'Sign in',
      nameRequired: 'Full name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Invalid phone number format',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters long',
      passwordWeak: 'Password must include uppercase, lowercase, and numbers',
      passwordNotMatch: 'Passwords do not match',
      termsRequired: 'You must accept the terms and conditions',
      registrationSuccess: 'Registration successful! Please sign in.',
      registrationFailed: 'Registration failed. Please try again.'
    }
  };

  const t = translations[language] || translations.en;

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    // รองรับรูปแบบเบอร์โทรศัพท์ไทย
    const re = /^(\+66|0)\d{8,9}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    // ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
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
    setSuccess('');
    
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
    if (!validatePhone(formData.phone)) {
      setError(t.phoneInvalid);
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
    if (!validatePassword(formData.password)) {
      setError(t.passwordWeak);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordNotMatch);
      return;
    }
    if (!formData.acceptTerms) {
      setError(t.termsRequired);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const userData = {
        username: formData.email.split('@')[0], // Create username from email
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone_number: formData.phone,
        company: formData.company
      };
      
      // Send to API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Show success message
      setError('');
      setSuccess(t.registrationSuccess);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        company: '',
        acceptTerms: false
      });
      
      // If auto-login is enabled in API, login the user
      if (data.token && data.user) {
        login(data.user, data.token);
        
        // Redirect to appropriate dashboard
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Otherwise, redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || t.registrationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-200 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded-md bg-green-50 text-green-500 dark:bg-green-900/30 dark:text-green-200 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.name}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.email}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.phone}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+66 12 345 6789"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.company}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900