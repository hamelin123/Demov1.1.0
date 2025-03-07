'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { User, Mail, Phone, Building, Shield, AlertCircle, ArrowLeft, Edit, Trash, Clock, Calendar } from 'lucide-react';

export default function ViewUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    
    // ดึงข้อมูลผู้ใช้
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
            created_at: '2025-01-15T10:30:00Z',
            last_login: '2025-03-01T14:30:00Z',
            orders_count: 12,
            activity: [
              {
                action: 'login',
                timestamp: '2025-03-01T14:30:00Z',
                details: 'Login from 192.168.1.1'
              },
              {
                action: 'update_profile',
                timestamp: '2025-02-28T10:15:00Z',
                details: 'Updated phone number'
              },
              {
                action: 'create_order',
                timestamp: '2025-02-25T09:45:00Z',
                details: 'Created order #ORD-12345'
              }
            ]
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
            created_at: '2025-01-20T14:45:00Z',
            last_login: '2025-02-28T09:20:00Z',
            orders_count: 5,
            activity: [
              {
                action: 'login',
                timestamp: '2025-02-28T09:20:00Z',
                details: 'Login from 192.168.1.2'
              },
              {
                action: 'create_order',
                timestamp: '2025-02-20T13:30:00Z',
                details: 'Created order #ORD-67890'
              }
            ]
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
            created_at: '2025-02-01T09:15:00Z',
            last_login: '2025-02-27T16:45:00Z',
            orders_count: 0,
            activity: [
              {
                action: 'login',
                timestamp: '2025-02-27T16:45:00Z',
                details: 'Login from 192.168.1.3'
              },
              {
                action: 'update_shipment',
                timestamp: '2025-02-26T14:30:00Z',
                details: 'Updated shipment status for order #ORD-54321'
              }
            ]
          }
        };
        
        const userData = mockUsers[userId];
        
        if (!userData) {
          setError(language === 'en' ? 'User not found' : 'ไม่พบข้อมูลผู้ใช้');
          setLoading(false);
          return;
        }
        
        setUser(userData);
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
      userProfile: 'User Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
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
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      accountInfo: 'Account Information',
      userId: 'User ID',
      username: 'Username',
      createdAt: 'Created At',
      lastLogin: 'Last Login',
      ordersPlaced: 'Orders Placed',
      activity: 'Recent Activity',
      noActivity: 'No recent activity',
      viewAll: 'View All',
      confirmDelete: 'Confirm Delete',
      deleteConfirmMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      actions: {
        login: 'Login',
        update_profile: 'Profile Update',
        create_order: 'Order Created',
        update_shipment: 'Shipment Update'
      }
    },
    th: {
      userProfile: 'โปรไฟล์ผู้ใช้',
      personalInfo: 'ข้อมูลส่วนตัว',
      name: 'ชื่อ',
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
      editUser: 'แก้ไขผู้ใช้',
      deleteUser: 'ลบผู้ใช้',
      accountInfo: 'ข้อมูลบัญชี',
      userId: 'รหัสผู้ใช้',
      username: 'ชื่อผู้ใช้',
      createdAt: 'สร้างเมื่อ',
      lastLogin: 'เข้าสู่ระบบล่าสุด',
      ordersPlaced: 'คำสั่งซื้อที่สั่งแล้ว',
      activity: 'กิจกรรมล่าสุด',
      noActivity: 'ไม่มีกิจกรรมล่าสุด',
      viewAll: 'ดูทั้งหมด',
      confirmDelete: 'ยืนยันการลบ',
      deleteConfirmMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถยกเลิกได้',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      actions: {
        login: 'เข้าสู่ระบบ',
        update_profile: 'อัพเดทโปรไฟล์',
        create_order: 'สร้างคำสั่งซื้อ',
        update_shipment: 'อัพเดทสถานะการจัดส่ง'
      }
    }
  };

  const t = translations[language] || translations.en;

  const getActionLabel = (action) => {
    return t.actions[action] || action;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/users" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.userProfile}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/admin/users/edit/${user.id}`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t.editUser}
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-600 dark:bg-gray-800 dark:text-red-500 dark:hover:bg-red-900/20"
          >
            <Trash className="mr-2 h-4 w-4" />
            {t.deleteUser}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t.personalInfo}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.name}</p>
                <div className="flex items-center mt-1">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.email}</p>
                <div className="flex items-center mt-1">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                <div className="flex items-center mt-1">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{user.phone_number}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.company}</p>
                <div className="flex items-center mt-1">
                  <Building className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{user.company || '-'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                <div className="flex items-center mt-1">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.role === 'admin' ? t.admin : user.role === 'staff' ? t.staff : t.user}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.status}</p>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {user.status === 'active' ? t.active : t.inactive}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          {user.activity && user.activity.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t.activity}
                </h2>
                
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  {t.viewAll}
                </button>
              </div>
              
              <div className="space-y-4">
                {user.activity.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white mr-2">
                          {getActionLabel(item.action)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Account Information */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t.accountInfo}
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.userId}</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{user.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.username}</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{user.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.createdAt}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(user.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.lastLogin}</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(user.last_login)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.ordersPlaced}</p>
                <p className="font-medium text-blue-600 dark:text-blue-400 mt-1">{user.orders_count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t.confirmDelete}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.deleteConfirmMessage}
                      </p>
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.full_name} ({user.email})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // ในโปรดักชัน จะเรียก API เพื่อลบผู้ใช้
                    console.log('Deleting user:', user.id);
                    setShowDeleteModal(false);
                    // หลังจากลบเสร็จจะ redirect กลับไปหน้ารายการผู้ใช้
                    router.push('/admin/users');
                  }}
                >
                  {t.confirm}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}