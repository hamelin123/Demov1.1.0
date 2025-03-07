// src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, ShoppingBag, Truck, Thermometer, BarChart2, Settings, LogOut,
  Menu, X, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/providers/LanguageProvider';

// เพิ่ม interface สำหรับข้อมูล User
interface User {
  id?: string;
  username?: string;
  full_name?: string;
  email?: string;
  role: string;
}

// เพิ่ม interface สำหรับ menu item
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  submenu: boolean;
  items?: Array<{
    name: string;
    href: string;
  }>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Translations
  const translations = {
    th: {
      dashboard: 'แดชบอร์ด',
      users: 'จัดการผู้ใช้',
      orders: 'คำสั่งซื้อ',
      shipments: 'การขนส่ง',
      temperature: 'ข้อมูลอุณหภูมิ',
      vehicles: 'ยานพาหนะ',
      reports: 'รายงาน',
      settings: 'ตั้งค่า',
      logout: 'ออกจากระบบ',
      notAuthorized: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      redirecting: 'กำลังเปลี่ยนเส้นทาง...',
      welcome: 'ยินดีต้อนรับ',
      usersList: 'รายชื่อผู้ใช้',
      createUser: 'สร้างผู้ใช้ใหม่',
      ordersList: 'รายการคำสั่งซื้อ',
      createOrder: 'สร้างคำสั่งซื้อใหม่',
      shipmentsList: 'รายการขนส่ง',
      temperatureAlerts: 'การแจ้งเตือนอุณหภูมิ',
      temperatureLogs: 'บันทึกอุณหภูมิ',
      vehiclesList: 'รายการยานพาหนะ',
      vehicleTracking: 'ติดตามยานพาหนะ',
      salesReport: 'รายงานยอดขาย',
      temperatureReport: 'รายงานอุณหภูมิ',
      adminPanel: 'แผงควบคุมผู้ดูแลระบบ'
    },
    en: {
      dashboard: 'Dashboard',
      users: 'Users',
      orders: 'Orders',
      shipments: 'Shipments',
      temperature: 'Temperature',
      vehicles: 'Vehicles',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout',
      notAuthorized: 'You are not authorized to access this page',
      redirecting: 'Redirecting...',
      welcome: 'Welcome',
      usersList: 'Users List',
      createUser: 'Create User',
      ordersList: 'Orders List',
      createOrder: 'Create Order',
      shipmentsList: 'Shipments List',
      temperatureAlerts: 'Temperature Alerts',
      temperatureLogs: 'Temperature Logs',
      vehiclesList: 'Vehicles List',
      vehicleTracking: 'Vehicle Tracking',
      salesReport: 'Sales Report',
      temperatureReport: 'Temperature Report',
      adminPanel: 'Admin Panel'
    }
  };

  const t = translations[language] || translations.en;

  // นิยามเมนูด้านข้าง
  const sidebarMenu: MenuItem[] = [
    {
      name: t.dashboard,
      icon: <BarChart2 className="h-5 w-5" />,
      href: '/admin/dashboard',
      submenu: false
    },
    {
      name: t.users,
      icon: <Users className="h-5 w-5" />,
      submenu: true,
      items: [
        { name: t.usersList, href: '/admin/users' },
        { name: t.createUser, href: '/admin/users/create' }
      ]
    },
    {
      name: t.orders,
      icon: <ShoppingBag className="h-5 w-5" />,
      submenu: true,
      items: [
        { name: t.ordersList, href: '/admin/orders' },
        { name: t.createOrder, href: '/admin/orders/create' }
      ]
    },
    {
      name: t.shipments,
      icon: <Truck className="h-5 w-5" />,
      href: '/admin/shipments',
      submenu: false
    },
    {
      name: t.temperature,
      icon: <Thermometer className="h-5 w-5" />,
      submenu: true,
      items: [
        { name: t.temperatureAlerts, href: '/admin/temperature/alerts' },
        { name: t.temperatureLogs, href: '/admin/temperature/logs' }
      ]
    },
    {
      name: t.vehicles,
      icon: <Truck className="h-5 w-5" />,
      submenu: true,
      items: [
        { name: t.vehiclesList, href: '/admin/vehicles' },
        { name: t.vehicleTracking, href: '/admin/vehicles/tracking' }
      ]
    },
    {
      name: t.reports,
      icon: <BarChart2 className="h-5 w-5" />,
      submenu: true,
      items: [
        { name: t.salesReport, href: '/admin/reports/sales' },
        { name: t.temperatureReport, href: '/admin/reports/temperature' }
      ]
    },
    {
      name: t.settings,
      icon: <Settings className="h-5 w-5" />,
      href: '/admin/settings',
      submenu: false
    }
  ];

  // ตรวจสอบสิทธิ์การเข้าถึง
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ตรวจสอบจาก localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          // ไม่มีข้อมูลการเข้าสู่ระบบ ให้กลับไปหน้า login
          router.push('/auth/login');
          return;
        }
        
        // แปลงข้อมูลเป็น object
        const userObj = JSON.parse(userData) as User;
        
        // ตรวจสอบว่าเป็น admin หรือไม่
        if (userObj.role !== 'admin') {
          // ไม่ใช่ admin ให้กลับไปหน้า dashboard ปกติ
          router.push('/dashboard');
          return;
        }
        
        // เป็น admin ให้เก็บข้อมูลไว้ใช้งาน
        setUser(userObj);
        setLoading(false);
        
      } catch (error) {
        console.error('Authentication error:', error);
        // กรณีมีข้อผิดพลาด ให้กลับไปหน้า login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  // Toggle submenu
  const toggleMenu = (menuName: string) => {
    setMenuOpen((prev: Record<string, boolean>) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.push('/auth/login');
    
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 1000);
  };

  // กรณีกำลังโหลดหรือตรวจสอบสิทธิ์
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-700 dark:text-gray-300">{t.redirecting}</p>
        </div>
      </div>
    );
  }

  // ถ้าไม่ใช่ admin (กรณีที่ยังไม่ได้ redirect ออกไป)
  if (user && user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-4 text-xl font-bold text-red-600 dark:text-red-400">{t.notAuthorized}</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{t.redirecting}</p>
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
            <div className="h-full animate-pulse bg-blue-500 dark:bg-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Mobile Toggle Button */}
      <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 lg:hidden">
        <button 
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" 
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="ml-4 flex-1 text-lg font-semibold text-gray-800 dark:text-white">
          {t.adminPanel}
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white pt-16 shadow-lg transition-transform dark:bg-gray-800 lg:pt-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
          <Link 
            href="/admin/dashboard" 
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            ColdChain Admin
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-5 space-y-1 px-2">
          {sidebarMenu.map(item => (
            <div key={item.name} className="py-1">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </span>
                    {item.name}
                    <ChevronDown 
                      className={`ml-auto h-4 w-4 transform transition-transform ${isMenuOpen[item.name] ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {isMenuOpen[item.name] && item.items && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.items.map(subItem => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          onClick={() => {
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group mt-8 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t.logout}
          </button>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col pt-16 lg:ml-64 lg:pt-0">
        {/* Main Content Header */}
        <header className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 lg:flex">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t.adminPanel}
          </h1>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t.welcome}, <span className="font-medium">{user?.full_name || user?.username}</span>
            </span>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-500">
              <span className="flex h-full w-full items-center justify-center text-lg font-medium text-white">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}