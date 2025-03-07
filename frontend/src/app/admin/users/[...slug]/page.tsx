// frontend/src/app/admin/users/[...slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { User, Mail, Phone, Building, Shield, Lock, AlertCircle, CheckCircle, ArrowLeft, Save } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string[];
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company: '',
    role: 'user',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState('view'); // 'view' or 'edit'
  
  useEffect(() => {
    setMounted(true);
    
    // Check authentication and authorization
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isLoading && isAuthenticated && currentUser?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    // Parse the slug to determine the mode and user ID
    if (slug && slug.length > 0) {
      // Check if this is an edit request: /admin/users/edit/[id]
      if (slug.length >= 2 && slug[0] === 'edit') {
        const userId = slug[1];
        setMode('edit');
        fetchUserData(userId);
      } 
      // Check if this is a view request: /admin/users/[id]
      else if (slug.length === 1) {
        const userId = slug[0];
        setMode('view');
        fetchUserData(userId);
      }
    }
    
    setLoading(false);
  }, [mounted, router, isAuthenticated, isLoading, currentUser, language, slug]);
  
  // Mock user data - in real app, fetch from API
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
    },
    '4': {
      id: '4',
      username: 'alicejones',
      full_name: 'Alice Jones',
      email: 'alice@example.com',
      phone_number: '091-234-5678',
      role: 'user',
      status: 'inactive',
      created_at: '2025-02-10T11:20:00Z'
    },
    '5': {
      id: '5',
      username: 'davidlee',
      full_name: 'David Lee',
      email: 'david@example.com',
      phone_number: '083-456-7890',
      company: 'Tech Company',
      role: 'user',
      status: 'active',
      created_at: '2025-02-18T16:30:00Z'
    }
  };
  
  const fetchUserData = (userId) => {
    // In real app, this would be an API call
    const user = mockUsers[userId];
    if (user) {
      setUserData(user);
      setFormData({
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        company: user.company || '',
        role: user.role,
        status: user.status
      });
    } else {
      setError(language === 'en' ? 'User not found' : 'ไม่พบข้อมูลผู้ใช้');
    }
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
    setSaving(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would call your update API
      console.log('Saving user data:', formData);
      
      // Success message
      setSuccess(true);
      setSaving(false);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error saving user:', error);
      setError(language === 'en' ? 'Error saving user data' : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setSaving(false);
    }
  };
  
  // If still loading or not mounted
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // User not found
  if (!userData) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'User not found' : 'ไม่พบข้อมูลผู้ใช้'}
            </h2>
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
  
  // Translations
  const translations = {
    en: {
      viewUser: 'User Details',
      editUser: 'Edit User',
      userInfo: 'User Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company/Organization',
      role: 'Role',
      status: 'Status',
      createdAt: 'Created At',
      userId: 'User ID',
      admin: 'Administrator',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      edit: 'Edit',
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      backToUsers: 'Back to Users',
      success: 'User data saved successfully'
    },
    th: {
      viewUser: 'รายละเอียดผู้ใช้',
      editUser: 'แก้ไขผู้ใช้',
      userInfo: 'ข้อมูลผู้ใช้',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'บริษัท/องค์กร',
      role: 'บทบาท',
      status: 'สถานะ',
      createdAt: 'สร้างเมื่อ',
      userId: 'รหัสผู้ใช้',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้ทั่วไป',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      suspended: 'ระงับการใช้งาน',
      edit: 'แก้ไข',
      save: 'บันทึกการเปลี่ยนแปลง',
      saving: 'กำลังบันทึก...',
      cancel: 'ยกเลิก',
      backToUsers: 'กลับไปหน้ารายชื่อผู้ใช้',
      success: 'บันทึกข้อมูลผู้ใช้เรียบร้อยแล้ว'
    }
  };
  
  const t = translations[language] || translations.en;
  
  // Render edit form
  if (mode === 'edit') {
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
            {t.editUser}: {userData.full_name}
          </h1>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 dark:text-green-300">{t.success}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.userInfo}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
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
                  {t.company}
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
            
            <div className="mt-6 flex justify-end space-x-3">
              <Link
                href="/admin/users"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.save}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Render view details page
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
          {t.viewUser}: {userData.full_name}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t.userInfo}
          </h2>
          
          <div className="flex space-x-2">
            <Link 
              href={`/admin/users/edit/${userData.id}`}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center hover:bg-blue-100 dark:hover:bg-blue-800/30"
            >
              <User className="mr-1 h-4 w-4" />
              {t.edit}
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.fullName}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.full_name}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.email}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.email}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.phone}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.phone_number || '-'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.company}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.company || '-'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.role}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.role === 'admin' ? t.admin :
                 userData.role === 'staff' ? t.staff : t.user}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.status}
              </div>
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  userData.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {userData.status === 'active' ? t.active : t.inactive}
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.createdAt}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {new Date(userData.created_at).toLocaleString(
                  language === 'en' ? 'en-US' : 'th-TH', 
                  { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.userId}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {userData.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}