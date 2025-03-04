'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { User, Mail, Phone, Building, Shield, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company: '',
    role: 'user',
    status: 'active'
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
    
    // ดึงข้อมูลผู้ใช้ที่ต้องการแก้ไข
    const fetchUser = async () => {
      try {
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const mockUsers = {
          '1': {
            id: '1',
            username: 'johndoe',
            full_name: 'John Doe',
            email: 'john@example.com',
            phone_number: '081-234-5678',
            company: 'ABC Company',
            role: 'admin',
            status: 'active',
            created_at: '2025-01-15T10:30:00Z'
          },
          '2': {
            id: '2',
            username: 'janedoe',
            full_name: 'Jane Doe',
            email: 'jane@example.com',
            phone_number: '089-876-5432',
            company: 'XYZ Corporation',
            role: 'user',
            status: 'active',
            created_at: '2025-01-20T14:45:00Z'
          },
          '3': {
            id: '3',
            username: 'bobsmith',
            full_name: 'Bob Smith',
            email: 'bob@example.com',
            phone_number: '062-345-6789',
            company: 'DEF Organization',
            role: 'staff',
            status: 'active',
            created_at: '2025-02-01T09:15:00Z'
          }
        };
        
        const userData = mockUsers[userId];
        
        if (!userData) {
          setError(language === 'en' ? 'User not found' : 'ไม่พบข้อมูลผู้ใช้');
          setLoading(false);
          return;
        }
        
        setUser(userData);
        setFormData({
          full_name: userData.full_name,
          email: userData.email,
          phone_number: userData.phone_number,
          company: userData.company || '',
          role: userData.role,
          status: userData.status
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(language === 'en' ? 'Failed to load user data' : 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
        setLoading(false);
      }
    };
    
    if (mounted && !isLoading) {
      fetchUser();
    }
  }, [mounted, userId, router, isAuthenticated, isLoading, currentUser, language]);
  
  // ถ้ายังไม่ได้โหลดเสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // ถ้าไม่พบข้อมูลผู้ใช้
  if (!user) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">{error}</h2>
          </div>
          <Link 
            href="/admin/users"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Back to Users' : 'กลับไปหน้ารายชื่อผู้ใช้'}
          </Link>
        </div>
      </div>
    );
  }
  
  // คำแปลภาษา
  const translations = {
    en: {
      editUser: 'Edit User',
      userDetails: 'User Details',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company/Organization',
      role: 'Role',
      status: 'Status',
      admin: 'Administrator',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      backToUsers: 'Back to Users',
      userSaved: 'User information has been updated successfully',
      errorSaving: 'Error saving user information. Please try again.',
      optional: 'Optional',
      accountInfo: 'Account Information',
      lastLogin: 'Last Login',
      createdAt: 'Created At',
      saveChanging: 'Saving...'
    },
    th: {
      editUser: 'แก้ไขผู้ใช้',
      userDetails: 'รายละเอียดผู้ใช้',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      cancel: 'ยกเลิก',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'บริษัท/องค์กร',
      role: 'บทบาท',
      status: 'สถานะ',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้ทั่วไป',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      suspended: 'ระงับการใช้งาน',
      backToUsers: 'กลับไปหน้ารายชื่อผู้ใช้',
      userSaved: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
      errorSaving: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
      optional: 'ไม่จำเป็น',
      accountInfo: 'ข้อมูลบัญชี',
      lastLogin: 'เข้าสู่ระบบล่าสุด',
      createdAt: 'สร้างเมื่อ',
      saveChanging: 'กำลังบันทึก...'
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaveLoading(true);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      console.log('Saving user data:', formData);
      
      // แสดงข้อความสำเร็จ
      setSuccess(t.userSaved);
      setSaveLoading(false);
      
      // รอสักครู่แล้วกลับไปยังหน้ารายการผู้ใช้
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error saving user:', error);
      setError(t.errorSaving);
      setSaveLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          {t.editUser}: {user.full_name}
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
                {t.fullName}
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
                {t.email}
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
                {t.role}
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
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
                {t.status}
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
              {t.accountInfo}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 dark:text-gray-400">{t.createdAt}</span>
                <span className="block text-gray-900 dark:text-white font-medium">
                  {formatDate(user.created_at)}
                </span>
              </div>
              
              <div>
                <span className="block text-gray-500 dark:text-gray-400">ID</span>
                <span className="block text-gray-900 dark:text-white font-medium">
                  {user.id}
                </span>
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
              {saveLoading ? t.saveChanging : t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}