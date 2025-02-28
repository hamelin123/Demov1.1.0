// src/app/admin/users/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Trash, AlertCircle, User
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Translations
  const translations = {
    th: {
      userDetails: 'รายละเอียดผู้ใช้',
      backToUsers: 'กลับไปยังรายการผู้ใช้',
      username: 'ชื่อผู้ใช้',
      email: 'อีเมล',
      fullName: 'ชื่อ-นามสกุล',
      role: 'บทบาท',
      status: 'สถานะ',
      phone: 'หมายเลขโทรศัพท์',
      address: 'ที่อยู่',
      createdAt: 'สร้างเมื่อ',
      updatedAt: 'อัปเดตล่าสุดเมื่อ',
      edit: 'แก้ไขผู้ใช้',
      delete: 'ลบผู้ใช้',
      admin: 'ผู้ดูแลระบบ',
      staff: 'เจ้าหน้าที่',
      user: 'ผู้ใช้',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      userNotFound: 'ไม่พบข้อมูลผู้ใช้',
      loadingError: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?',
      somethingWentWrong: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง',
      orders: 'คำสั่งซื้อ',
      recentOrders: 'คำสั่งซื้อล่าสุด',
      noOrders: 'ไม่มีคำสั่งซื้อ',
      viewAllOrders: 'ดูคำสั่งซื้อทั้งหมด'
    },
    en: {
      userDetails: 'User Details',
      backToUsers: 'Back to Users',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      role: 'Role',
      status: 'Status',
      phone: 'Phone Number',
      address: 'Address',
      createdAt: 'Created At',
      updatedAt: 'Last Updated',
      edit: 'Edit User',
      delete: 'Delete User',
      admin: 'Admin',
      staff: 'Staff',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive',
      userNotFound: 'User not found',
      loadingError: 'Error loading user data',
      confirmDelete: 'Are you sure you want to delete this user?',
      somethingWentWrong: 'Something went wrong. Please try again.',
      orders: 'Orders',
      recentOrders: 'Recent Orders',
      noOrders: 'No orders found',
      viewAllOrders: 'View All Orders'
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
          address: '123 Main St, Bangkok, Thailand',
          created_at: '2025-01-15T10:30:00Z',
          updated_at: '2025-02-20T14:45:00Z',
          recentOrders: [
            {
              id: '1',
              order_number: 'ORD-12345',
              status: 'delivered',
              total: 15000,
              created_at: '2025-02-15T08:30:00Z'
            },
            {
              id: '2',
              order_number: 'ORD-12346',
              status: 'processing',
              total: 8500,
              created_at: '2025-02-18T09:15:00Z'
            }
          ]
        };
        
        setUser(mockUser);
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', options);
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
          <User className="h-6 w-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.userDetails}</h1>
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
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* User Information */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                {t.userDetails}
              </h2>
              
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.username}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{user.username}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{user.email}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.fullName}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{user.full_name}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.role}</dt>
                  <dd className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : user.role === 'staff' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {user.role === 'admin' ? t.admin : user.role === 'staff' ? t.staff : t.user}
                    </span>
                  </dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.status}</dt>
                  <dd className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.status === 'active' ? t.active : t.inactive}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                {t.userDetails}
              </h2>
              
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{user.phone_number || '-'}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.address}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{user.address || '-'}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.createdAt}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{formatDate(user.created_at)}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.updatedAt}</dt>
                  <dd className="text-sm text-gray-900 dark:text-white">{formatDate(user.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleDelete}
              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash className="mr-2 h-4 w-4" />
              {t.delete}
            </button>
            
            <Link
              href={`/admin/users/${params.id}/edit`}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t.edit}
            </Link>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
              {t.recentOrders}
            </h2>
            <Link 
              href={`/admin/orders?userId=${params.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t.viewAllOrders}
            </Link>
          </div>
          
          {user.recentOrders && user.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.status}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.createdAt}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {user.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Link href={`/admin/orders/${order.id}`}>
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : order.status === 'processing' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ฿{order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-24 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">{t.noOrders}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}