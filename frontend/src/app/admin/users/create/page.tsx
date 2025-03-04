'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Lock, Phone, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function CreateUserPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    company: '',
    role: 'user',
    status: 'active'
  });

  const translations = {
    th: {
      createUser: 'สร้างผู้ใช้ใหม่',
      backToUsers: 'กลับไปยังหน้าผู้ใช้',
      userInfo: 'ข้อมูลผู้ใช้',
      username: 'ชื่อผู้ใช้',
      usernamePlaceholder: 'กรอกชื่อผู้ใช้',
      email: 'อีเมล',
      emailPlaceholder: 'กรอกอีเมล',
      password: 'รหัสผ่าน',
      passwordPlaceholder: 'กรอกรหัสผ่าน',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      confirmPasswordPlaceholder: 'กรอกรหัสผ่านอีกครั้ง',
      fullName: 'ชื่อ-นามสกุล',
      fullNamePlaceholder: 'กรอกชื่อ-นามสกุล',
      phone: 'หมายเลขโทรศัพท์',
      phonePlaceholder: 'กรอกหมายเลขโทรศัพท์',
      company: 'บริษัท/องค์กร (ไม่จำเป็น)',
      companyPlaceholder: 'กรอกชื่อบริษัทหรือองค์กร',
      role: 'บทบาท',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้',
      status: 'สถานะ',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      cancel: 'ยกเลิก',
      create: 'สร้าง',
      usernameRequired: 'กรุณากรอกชื่อผู้ใช้',
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      passwordRequired: 'กรุณากรอกรหัสผ่าน',
      passwordMinLength: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
      passwordWeak: 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข',
      passwordsNotMatch: 'รหัสผ่านไม่ตรงกัน',
      fullNameRequired: 'กรุณากรอกชื่อ-นามสกุล',
      phoneRequired: 'กรุณากรอกหมายเลขโทรศัพท์',
      phoneInvalid: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง',
      createSuccess: 'สร้างผู้ใช้สำเร็จ',
      createError: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้'
    },
    en: {
      createUser: 'Create New User',
      backToUsers: 'Back to Users',
      userInfo: 'User Information',
      username: 'Username',
      usernamePlaceholder: 'Enter username',
      email: 'Email',
      emailPlaceholder: 'Enter email',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter full name',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter phone number',
      company: 'Company/Organization (Optional)',
      companyPlaceholder: 'Enter company or organization name',
      role: 'Role',
      admin: 'Admin',
      staff: 'Staff',
      user: 'User',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      cancel: 'Cancel',
      create: 'Create',
      usernameRequired: 'Username is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters long',
      passwordWeak: 'Password must include uppercase, lowercase, and numbers',
      passwordsNotMatch: 'Passwords do not match',
      fullNameRequired: 'Full name is required',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Invalid phone number format',
      createSuccess: 'User created successfully',
      createError: 'Error creating user'
    }
  };

  const t = translations[language] || translations.en;

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^(\+\d{1,3}[- ]?)?(\d{8,15})$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.username) {
      setError(t.usernameRequired);
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
    if (!formData.full_name) {
      setError(t.fullNameRequired);
      return;
    }
    if (!formData.phone_number) {
      setError(t.phoneRequired);
      return;
    }
    if (!validatePhone(formData.phone_number)) {
      setError(t.phoneInvalid);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Creating user:', formData);
      
      // In a real implementation, you would call your API here
      // const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create user');
      // }
      
      setSuccess(t.createSuccess);
      
      // Redirect to users list after 2 seconds
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(t.createError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.createUser}</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-300">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.userInfo}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.username}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.usernamePlaceholder}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.passwordPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.confirmPasswordPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.fullNamePlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.phone}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.phonePlaceholder}
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
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.companyPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.role}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="admin">{t.admin}</option>
                <option value="staff">{t.staff}</option>
                <option value="user">{t.user}</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.status}
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">{t.active}</option>
                <option value="inactive">{t.inactive}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/admin/users"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t.cancel}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.create}...
                </div>
              ) : t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}