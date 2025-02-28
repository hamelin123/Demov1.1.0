// src/app/admin/users/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Save, AlertCircle, UserPlus
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function CreateUserPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user',
    status: 'active',
    phone_number: '',
    address: '',
    password: ''
  });

  // Translations
  const translations = {
    th: {
      createUser: 'เพิ่มผู้ใช้ใหม่',
      backToUsers: 'กลับไปยังรายการผู้ใช้',
      username: 'ชื่อผู้ใช้',
      email: 'อีเมล',
      fullName: 'ชื่อ-นามสกุล',
      role: 'บทบาท',
      status: 'สถานะ',
      phone: 'หมายเลขโทรศัพท์',
      address: 'ที่อยู่',
      password: 'รหัสผ่าน',
      save: 'บันทึก',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      requiredField: 'จำเป็นต้องกรอกข้อมูลในช่องนี้',
      invalidEmail: 'รูปแบบอีเมลไม่ถูกต้อง',
      passwordMinLength: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
      createSuccess: 'สร้างผู้ใช้เรียบร้อยแล้ว',
      somethingWentWrong: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง'
    },
    en: {
      createUser: 'Create New User',
      backToUsers: 'Back to Users',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      role: 'Role',
      status: 'Status',
      phone: 'Phone Number',
      address: 'Address',
      password: 'Password',
      save: 'Save',
      admin: 'Admin',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email format',
      passwordMinLength: 'Password must be at least 8 characters long',
      createSuccess: 'User created successfully',
      somethingWentWrong: 'Something went wrong. Please try again.'
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

  const validateForm = () => {
    if (!formData.username) {
      setError(t.username + ': ' + t.requiredField);
      return false;
    }
    if (!formData.email) {
      setError(t.email + ': ' + t.requiredField);
      return false;
    }
    if (!formData.full_name) {
      setError(t.fullName + ': ' + t.requiredField);
      return false;
    }
    if (!formData.password) {
      setError(t.password + ': ' + t.requiredField);
      return false;
    }
    
    // ตรวจสอบรูปแบบอีเมล
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError(t.invalidEmail);
      return false;
    }
    
    // ตรวจสอบความยาวรหัสผ่าน
    if (formData.password.length < 8) {
      setError(t.passwordMinLength);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // ในโปรดักชัน จะใช้การเรียก API จริง
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || t.somethingWentWrong);
      // }
      
      // const data = await response.json();
      
      // จำลองการสร้างผู้ใช้
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // แสดงข้อความสำเร็จและกลับไปหน้ารายการผู้ใช้
      alert(t.createSuccess);
      router.push('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || t.somethingWentWrong);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserPlus className="h-6 w-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.createUser}</h1>
        </div>
        <Link 
          href="/admin/users" 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToUsers}
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fullName}
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              minLength={8}
            />
          </div>
          
          {/* Role */}
          <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.role}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="admin">{t.admin}</option>
              <option value="staff">{t.staff}</option>
              <option value="user">{t.user}</option>
            </select>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.status}
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.phone}
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        {/* Address (full width) */}
        <div className="mt-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.address}
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}