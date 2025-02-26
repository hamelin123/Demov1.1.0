'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  User, Truck, Thermometer, Package, LogOut, Menu, X, Settings, Home
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('th');

  // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
  useEffect(() => {
    setIsLoading(true);
    // ถ้าไม่ได้ล็อกอิน ให้เปลี่ยนเส้นทางไปหน้า login
    if (!isAuthenticated && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  // โหลดข้อมูลตาม theme และ language จาก localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') || 'light';
      const storedLanguage = localStorage.getItem('language') || 'th';
      setTheme(storedTheme);
      setLanguage(storedLanguage);
      
      // ตั้งค่า dark mode สำหรับ HTML element
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // ถ้ากำลังโหลด แสดงข้อความกำลังโหลด
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // translations
  const translations = {
    th: {
      dashboard: "แดชบอร์ด",
      overview: "ภาพรวม",
      shipments: "การขนส่ง",
      tracking: "ติดตามสินค้า",
      profile: "โปรไฟล์",
      logout: "ออกจากระบบ",
      welcome: "ยินดีต้อนรับ",
      activeShipments: "การขนส่งที่กำลังดำเนินการ",
      completedShipments: "การขนส่งที่เสร็จสิ้น",
      temperatureAlerts: "การแจ้งเตือนอุณหภูมิ",
      recentActivity: "กิจกรรมล่าสุด",
      viewAll: "ดูทั้งหมด",
      noShipments: "ไม่มีการขนส่ง",
      settings: "ตั้งค่า",
      home: "หน้าหลัก"
    },
    en: {
      dashboard: "Dashboard",
      overview: "Overview",
      shipments: "Shipments",
      tracking: "Tracking",
      profile: "Profile",
      logout: "Logout",
      welcome: "Welcome",
      activeShipments: "Active Shipments",
      completedShipments: "Completed Shipments",
      temperatureAlerts: "Temperature Alerts",
      recentActivity: "Recent Activity",
      viewAll: "View All",
      noShipments: "No shipments found",
      settings: "Settings",
      home: "Home"
    }
  };

  // เลือกภาษา
  const t = translations[language];

  // ตัวอย่างข้อมูลสำหรับแสดงบนแดชบอร์ด
  const mockData = {
    activeShipments: 3,
    completedShipments: 12,
    temperatureAlerts: 0,
    recentActivity: [
      { id: 1, type: 'shipment', status: 'in-transit', orderNumber: 'TH123456789', timestamp: '2025-02-23 14:30' },
      { id: 2, type: 'shipment', status: 'delivered', orderNumber: 'TH123456788', timestamp: '2025-02-22 11:15' },
      { id: 3, type: 'temperature', status: 'normal', orderNumber: 'TH123456789', temperature: '-18.5°C', timestamp: '2025-02-23 12:00' }
    ]
  };

  // เปลี่ยนภาษา
  const toggleLanguage = () => {
    const newLanguage = language === 'th' ? 'en' : 'th';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // เปลี่ยน theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // ตั้งค่า dark mode สำหรับ HTML element
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // ออกจากระบบ
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">ColdChain</span>
              </div>
            </div>
            
            {/* Settings and user info */}
            <div className="flex items-center">
              {/* Toggle language */}
              <button 
                onClick={toggleLanguage} 
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 mx-1"
              >
                {language === 'th' ? 'EN' : 'ไทย'}
              </button>
              
              {/* Toggle theme */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 mx-1"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              
              {/* Settings */}
              <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 mx-1">
                <Settings size={20} />
              </button>
              
              {/* User menu */}
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed w-64 h-full top-16 left-0 bottom-0 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform z-10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {/* Home link */}
            <a
              href="/"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {t.home}
            </a>
            
            {/* Dashboard link */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'overview' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg className={`mr-3 h-5 w-5 ${
                activeTab === 'overview' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t.overview}
            </button>
            
            {/* Shipments link */}
            <button
              onClick={() => setActiveTab('shipments')}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'shipments' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Truck className={`mr-3 h-5 w-5 ${
                activeTab === 'shipments' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {t.shipments}
            </button>
            
            {/* Tracking link */}
            <button
              onClick={() => setActiveTab('tracking')}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'tracking' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Package className={`mr-3 h-5 w-5 ${
                activeTab === 'tracking' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {t.tracking}
            </button>
            
            {/* Profile link */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeTab === 'profile' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User className={`mr-3 h-5 w-5 ${
                activeTab === 'profile' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {t.profile}
            </button>
          </div>
          
          {/* Logout */}
          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
              {t.logout}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6">
          {/* Dashboard Content Based on Active Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t.dashboard}
              </h1>
              
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                  {t.welcome}, {user?.name || 'User'}!
                </h2>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Active Shipments */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                      <Truck size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.activeShipments}
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {mockData.activeShipments}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Completed Shipments */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.completedShipments}
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {mockData.completedShipments}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Temperature Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
                      <Thermometer size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.temperatureAlerts}
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {mockData.temperatureAlerts}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t.recentActivity}
                  </h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {t.viewAll}
                  </button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockData.recentActivity.length > 0 ? mockData.recentActivity.map(activity => (
                    <div key={activity.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {activity.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.timestamp}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'delivered' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : activity.status === 'in-transit'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                      {activity.type === 'temperature' && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Current temperature: {activity.temperature}
                        </p>
                      )}
                    </div>