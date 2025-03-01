'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { User, Truck, Thermometer, Package, LogOut, Settings, Home } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('th');

  useEffect(() => {
    setIsLoading(true);
    if (!isAuthenticated && typeof window !== 'undefined') {
      !localStorage.getItem('user') && router.push('/login');
    }
    
    // Load theme/language
    if (typeof window !== 'undefined') {
      setTheme(localStorage.getItem('theme') || 'light');
      setLanguage(localStorage.getItem('language') || 'th');
      document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark');
    }
    
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const t = {
    th: {
      dashboard: "แดชบอร์ด", overview: "ภาพรวม", shipments: "การขนส่ง", tracking: "ติดตามสินค้า",
      profile: "โปรไฟล์", logout: "ออกจากระบบ", welcome: "ยินดีต้อนรับ", activeShipments: "การขนส่งที่กำลังดำเนินการ",
      completedShipments: "การขนส่งที่เสร็จสิ้น", temperatureAlerts: "การแจ้งเตือนอุณหภูมิ",
      recentActivity: "กิจกรรมล่าสุด", viewAll: "ดูทั้งหมด", noShipments: "ไม่มีการขนส่ง",
      settings: "ตั้งค่า", home: "หน้าหลัก"
    },
    en: {
      dashboard: "Dashboard", overview: "Overview", shipments: "Shipments", tracking: "Tracking",
      profile: "Profile", logout: "Logout", welcome: "Welcome", activeShipments: "Active Shipments",
      completedShipments: "Completed Shipments", temperatureAlerts: "Temperature Alerts", 
      recentActivity: "Recent Activity", viewAll: "View All", noShipments: "No shipments found",
      settings: "Settings", home: "Home"
    }
  }[language];

  // Mock data
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

  const toggleLanguage = () => {
    const newLang = language === 'th' ? 'en' : 'th';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Build cards data
  const cards = [
    { title: t.activeShipments, icon: <Truck size={24} />, value: mockData.activeShipments, color: 'blue' },
    { title: t.completedShipments, icon: <Package size={24} />, value: mockData.completedShipments, color: 'green' },
    { title: t.temperatureAlerts, icon: <Thermometer size={24} />, value: mockData.temperatureAlerts, color: 'red' }
  ];

  // Navigation tabs
  const tabs = ['overview', 'shipments', 'tracking', 'profile'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {isSidebarOpen ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : 
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
              </button>
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">ColdChain</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={toggleLanguage} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {language === 'th' ? 'EN' : 'ไทย'}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
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
      <aside className={`fixed w-64 h-full top-16 left-0 bottom-0 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform z-10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Link href="/" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              {t.home}
            </Link>
            
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === tab ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <span className={`mr-3 h-5 w-5 ${activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {tab === 'overview' && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                  {tab === 'shipments' && <Truck />}
                  {tab === 'tracking' && <Package />}
                  {tab === 'profile' && <User />}
                </span>
                {t[tab]}
              </button>
            ))}
          </div>
          
          <div className="mt-10">
            <button onClick={logout} className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
              {t.logout}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6">
          {activeTab === 'overview' ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.dashboard}</h1>
              
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                  {t.welcome}, {user?.name || 'User'}!
                </h2>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {cards.map((card, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400 mr-4`}>
                        {card.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</div>
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.recentActivity}</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t.viewAll}</button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockData.recentActivity.length > 0 ? mockData.recentActivity.map(activity => (
                    <div key={activity.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{activity.orderNumber}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            activity.status === 'in-transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                      {activity.type === 'temperature' && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Current temperature: {activity.temperature}</p>
                      )}
                    </div>
                  )) : (
                    <div className="p-6 text-center text-gray-500">{t.noShipments}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t[activeTab]}</h2>
              <p className="text-gray-600 dark:text-gray-400">This section is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}