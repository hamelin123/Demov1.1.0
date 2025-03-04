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
      company: 'บริษ