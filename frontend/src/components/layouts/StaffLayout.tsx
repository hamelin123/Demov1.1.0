// src/components/layouts/StaffLayout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Truck, Thermometer, Home, Menu, X, User, LogOut } from 'lucide-react';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:h-screen`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">ColdChain</span>
          <button 
            className="md:hidden text-gray-500 dark:text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-4 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/staff/dashboard" className="flex items-center p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Home className="mr-3" size={20} />
                แดชบอร์ด
              </Link>
            </li>
            <li>
              <Link href="/staff/shipments" className="flex items-center p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Truck className="mr-3" size={20} />
                การขนส่ง
              </Link>
            </li>
            <li>
              <Link href="/staff/temperature" className="flex items-center p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Thermometer className="mr-3" size={20} />
                บันทึกอุณหภูมิ
              </Link>
            </li>
            <li>
              <Link href="/staff/profile" className="flex items-center p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="mr-3" size={20} />
                โปรไฟล์
              </Link>
            </li>
            <li>
              <button 
                onClick={logout} 
                className="flex items-center p-2 w-full text-left rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3" size={20} />
                ออกจากระบบ
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-500 dark:text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.full_name}
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user?.full_name?.[0] || 'S'}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}