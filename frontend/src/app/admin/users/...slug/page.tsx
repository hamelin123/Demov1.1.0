'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { User, Mail, Phone, Building, Shield, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string[];
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
    
    // Parse the slug to determine what to render
    if (slug && slug.length > 0) {
      console.log('Slug:', slug);
      
      // Check if this is an edit request: /admin/users/edit/[id]
      if (slug.length >= 2 && slug[0] === 'edit') {
        const userId = slug[1];
        console.log('Edit user with ID:', userId);
        // Render edit user form
        renderEditUserPage(userId);
      } 
      // Check if this is a view request: /admin/users/[id]
      else if (slug.length === 1 && !isNaN(Number(slug[0]))) {
        const userId = slug[0];
        console.log('View user with ID:', userId);
        // Render user details
        renderUserDetailsPage(userId);
      }
      // Add other scenarios as needed
    }
    
    setLoading(false);
  }, [mounted, router, isAuthenticated, isLoading, currentUser, language, slug]);
  
  // ถ้ายังไม่ได้โหลดเสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Mock user data
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

  // Function to render edit user form
  const renderEditUserPage = (userId) => {
    const userData = mockUsers[userId];
    
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
    
    // ตัวอย่างฟอร์มแก้ไขข้อมูลผู้ใช้
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
            {language === 'en' ? 'Edit User' : 'แก้ไขผู้ใช้'}: {userData.full_name}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'User Details' : 'รายละเอียดผู้ใช้'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    defaultValue={userData.full_name}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Email' : 'อีเมล'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    defaultValue={userData.email}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Phone Number' : 'เบอร์โทรศัพท์'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    defaultValue={userData.phone_number}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Company/Organization' : 'บริษัท/องค์กร'}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    defaultValue={userData.company || ''}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Role' : 'บทบาท'}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    defaultValue={userData.role}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">{language === 'en' ? 'Administrator' : 'ผู้ดูแลระบบ'}</option>
                    <option value="staff">{language === 'en' ? 'Staff' : 'เจ้าหน้าที่'}</option>
                    <option value="user">{language === 'en' ? 'User' : 'ผู้ใช้ทั่วไป'}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Status' : 'สถานะ'}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <select
                    defaultValue={userData.status}
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">{language === 'en' ? 'Active' : 'ใช้งาน'}</option>
                    <option value="inactive">{language === 'en' ? 'Inactive' : 'ไม่ได้ใช้งาน'}</option>
                    <option value="suspended">{language === 'en' ? 'Suspended' : 'ระงับการใช้งาน'}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Link
                href="/admin/users"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {language === 'en' ? 'Cancel' : 'ยกเลิก'}
              </Link>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {language === 'en' ? 'Save Changes' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render user details page
  const renderUserDetailsPage = (userId) => {
    const userData = mockUsers[userId];
    
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
    
    // ตัวอย่างหน้าแสดงรายละเอียดผู้ใช้
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
            {language === 'en' ? 'User Details' : 'รายละเอียดผู้ใช้'}: {userData.full_name}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'User Information' : 'ข้อมูลผู้ใช้'}
            </h2>
            
            <div className="flex space-x-2">
              <Link 
                href={`/admin/users/edit/${userData.id}`}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center hover:bg-blue-100 dark:hover:bg-blue-800/30"
              >
                <User className="mr-1 h-4 w-4" />
                {language === 'en' ? 'Edit' : 'แก้ไข'}
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล'}
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {userData.full_name}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Email' : 'อีเมล'}
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {userData.email}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Phone Number' : 'เบอร์โทรศัพท์'}
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {userData.phone_number || '-'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Company/Organization' : 'บริษัท/องค์กร'}
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {userData.company || '-'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Role' : 'บทบาท'}
                </div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {userData.role === 'admin' ? (language === 'en' ? 'Administrator' : 'ผู้ดูแลระบบ') :
                   userData.role === 'staff' ? (language === 'en' ? 'Staff' : 'เจ้าหน้าที่') :
                   (language === 'en' ? 'User' : 'ผู้ใช้ทั่วไป')}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Status' : 'สถานะ'}
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    userData.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {userData.status === 'active' 
                      ? (language === 'en' ? 'Active' : 'ใช้งาน')
                      : (language === 'en' ? 'Inactive' : 'ไม่ได้ใช้งาน')}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Created At' : 'สร้างเมื่อ'}
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
                  {language === 'en' ? 'User ID' : 'รหัสผู้ใช้'}
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
  };
  
  // Determine what to render based on the slug
  if (slug && slug.length > 0) {
    // Edit user page
    if (slug.length >= 2 && slug[0] === 'edit') {
      const userId = slug[1];
      return renderEditUserPage(userId);
    } 
    // View user details page
    else if (slug.length === 1 && !isNaN(Number(slug[0]))) {
      const userId = slug[0];
      return renderUserDetailsPage(userId);
    }
  }
  
  // Default fallback for invalid routes
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Page not found' : 'ไม่พบหน้าที่คุณค้นหา'}
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