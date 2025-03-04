'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { User, Mail, Phone, Building, Shield, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function AddUserPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company: '',
    role: 'user',
    status: 'active',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isLoading && isAuthenticated && currentUser?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [mounted, router, isAuthenticated, isLoading, currentUser]);
  
  // ถ้ายังไม่ได้โหลดเสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // คำแปลภาษา
  const translations = {
    en: {
      addUser: 'Add New User',
      userDetails: 'User Details',
      accountDetails: 'Account Details',
      saveUser: 'Save User',
      cancel: 'Cancel',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company/Organization',
      role: 'Role',
      status: 'Status',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      admin: 'Administrator',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      backToUsers: 'Back to Users',
      userSaved: 'User has been created successfully',
      errorSaving: 'Error creating user. Please try again.',
      optional: 'Optional',
      saving: 'Saving...',
      passwordRequirements: 'Password must be at least 8 characters and include uppercase, lowercase, and numbers',
      passwordMatch: 'Passwords must match',
      requiredField: 'This field is required',
      emailExists: 'This email is already in use',
      invalidEmail: 'Please enter a valid email address'
    },
    th: {
      addUser: 'เพิ่มผู้ใช้ใหม่',
      userDetails: 'รายละเอียดผู้ใช้',
      accountDetails: 'รายละเอียดบัญชี',
      saveUser: 'บันทึกผู้ใช้',
      cancel: 'ยกเลิก',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'บริษัท/องค์กร',
      role: 'บทบาท',
      status: 'สถานะ',
      password: 'รหัสผ่าน',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้ทั่วไป',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      suspended: 'ระงับการใช้งาน',
      backToUsers: 'กลับไปหน้ารายชื่อผู้ใช้',
      userSaved: 'สร้างผู้ใช้เรียบร้อยแล้ว',
      errorSaving: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้ กรุณาลองใหม่อีกครั้ง',
      optional: 'ไม่จำเป็น',
      saving: 'กำลังบันทึก...',
      passwordRequirements: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรและประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข',
      passwordMatch: 'รหัสผ่านต้องตรงกัน',
      requiredField: 'จำเป็นต้องกรอกข้อมูลช่องนี้',
      emailExists: 'อีเมลนี้ถูกใช้งานแล้ว',
      invalidEmail: 'กรุณากรอกอีเมลที่ถูกต้อง'
    }
  };
  
  const t = translations[language] || translations.en;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // ตรวจสอบว่ารหัสผ่านมีความยาวอย่างน้อย 8 ตัวอักษรและมีตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateForm = () => {
    // ตรวจสอบฟิลด์ที่จำเป็น
    if (!formData.full_name) {
      setError(t.requiredField + ': ' + t.fullName);
      return false;
    }
    
    if (!formData.email) {
      setError(t.requiredField + ': ' + t.email);
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      setError(t.invalidEmail);
      return false;
    }
    
    if (!formData.password) {
      setError(t.requiredField + ': ' + t.password);
      return false;
    }
    
    if (!validatePassword(formData.password)) {
      setError(t.passwordRequirements);
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMatch);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // ตรวจสอบความถูกต้องของฟอร์ม
    if (!validateForm()) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      console.log('Creating new user:', formData);
      
      // แสดงข้อความสำเร็จ
      setSuccess(t.userSaved);
      setSaveLoading(false);
      
      // รอสักครู่แล้วกลับไปยังหน้ารายการผู้ใช้
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(t.errorSaving);
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link 
          href="/admin/users"
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.addUser}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t.userDetails}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 dark:text-green-300">{success}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fullName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.email} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.company} <span className="text-gray-400 text-xs">({t.optional})</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.role} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">{t.admin}</option>
                  <option value="staff">{t.staff}</option>
                  <option value="user">{t.user}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.status} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                  <option value="suspended">{t.suspended}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t.accountDetails}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.password} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t.passwordRequirements}
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.confirmPassword} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t.cancel}
            </Link>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {saveLoading ? t.saving : t.saveUser}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}