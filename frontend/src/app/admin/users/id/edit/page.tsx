// src/app/admin/users/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Trash, AlertCircle, UserCog
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user',
    status: 'active',
    phone_number: '',
    address: '',
    password: '' // เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน
  });

  // Translations
  const translations = {
    th: {
      editUser: 'แก้ไขผู้ใช้',
      backToUsers: 'กลับไปยังรายการผู้ใช้',
      username: 'ชื่อผู้ใช้',
      email: 'อีเมล',
      fullName: 'ชื่อ-นามสกุล',
      role: 'บทบาท',
      status: 'สถานะ',
      phone: 'หมายเลขโทรศัพท์',
      address: 'ที่อยู่',
      password: 'รหัสผ่าน (เว้นว่างถ้าไม่ต้องการเปลี่ยน)',
      save: 'บันทึก',
      delete: 'ลบผู้ใช้',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      userNotFound: 'ไม่พบข้อมูลผู้ใช้',
      loadingError: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      requiredField: 'จำเป็นต้องกรอกข้อมูลในช่องนี้',
      invalidEmail: 'รูปแบบอีเมลไม่ถูกต้อง',
      updateSuccess: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
      confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?',
      somethingWentWrong: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง'
    },
    en: {
      editUser: 'Edit User',
      backToUsers: 'Back to Users',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      role: 'Role',
      status: 'Status',
      phone: 'Phone Number',
      address: 'Address',
      password: 'Password (leave empty to keep current)',
      save: 'Save Changes',
      delete: 'Delete User',
      admin: 'Admin',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      userNotFound: 'User not found',
      loadingError: 'Error loading user data',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email format',
      updateSuccess: 'User updated successfully',
      confirmDelete: 'Are you sure you want to delete this user?',
      somethingWentWrong: 'Something went wrong. Please try again.'
    }
  };

  const t = translations[language] || translations.en;

  // โหลดข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // ในโปรดักชัน จะใช้การเรียก API จริง
        // const response = await fetch(`/api/users/${params.id}`);
        // const data = await response.json();
        
        // จำลองการโหลดข้อมูลผู้ใช้สำหรับการพัฒนา
        await new Promise(resolve => setTimeout(resolve, 500)); // จำลองความล่าช้าของเครือข่าย
        
        // ข้อมูลจำลอง
        const mockUser = {
          id: params.id,
          username: 'johndoe',
          email: 'john@example.com',
          full_name: 'John Doe',
          role: 'admin',
          status: 'active',
          phone_number: '081-234-5678',
          address: '123 Main St, Bangkok, Thailand'
        };
        
        setUser(mockUser);
        setFormData({
          username: mockUser.username,
          email: mockUser.email,
          full_name: mockUser.full_name,
          role: mockUser.role,
          status: mockUser.status,
          phone_number: mockUser.phone_number || '',
          address: mockUser.address || '',
          password: ''
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(t.loadingError);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchUser();
    }
  }, [params.id, t]);

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
    
    // ตรวจสอบรูปแบบอีเมล
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError(t.invalidEmail);
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
      
      // เตรียมข้อมูลที่จะส่งไป
      const updateData = {...formData};
      if (!updateData.password) {
        delete updateData.password; // ไม่ส่งรหัสผ่านถ้าไม่ได้เปลี่ยน
      }
      
      // ในโปรดักชัน จะใช้การเรียก API จริง
      // const response = await fetch(`/api/users/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updateData),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || t.somethingWentWrong);
      // }
      
      // จำลองการอัปเดตข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // แสดงข้อความสำเร็จและกลับไปหน้ารายการผู้ใช้
      alert(t.updateSuccess);
      router.push('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || t.somethingWentWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t.confirmDelete)) {
      return;
    }
    
    try {
      // ในโปรดักชัน จะใช้การเรียก API จริง
      // const response = await fetch(`/api/users/${params.id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || t.somethingWentWrong);
      // }
      
      // จำลองการลบข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // กลับไปหน้ารายการผู้ใช้
      router.push('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || t.somethingWentWrong);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{t.userNotFound}</span>
        </div>
        <div className="mt-4">
          <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.backToUsers}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserCog className="h-6 w-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.editUser}</h1>
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
          
          {/* Password (optional) */}
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
        
        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash className="mr-2 h-4 w-4" />
            {t.delete}
          </button>
          
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