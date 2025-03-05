'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { ArrowLeft, Search, Truck, MapPin, Battery, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function VehiclesTrackingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeVehicles, setActiveVehicles] = useState([]);
  
  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchActiveVehicles = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลอง
        const mockVehicles = [
          { 
            id: '1', 
            registrationNumber: 'บท-1234',
            name: 'Truck XL-01',
            type: 'refrigerated-truck',
            status: 'active',
            currentTemperature: -19.2,
            batteryLevel: 92,
            driverName: 'สมชาย มั่นคง',
            driverPhone: '081-234-5678',
            currentLocation: {
              latitude: 13.756,
              longitude: 100.501,
              address: 'กรุงเทพมหานคร',
              updatedAt: '2025-03-01T14:20:00.000Z'
            },
          },
          { 
            id: '2', 
            registrationNumber: 'ฮศ-5678',
            name: 'Truck MD-02',
            type: 'refrigerated-truck',
            status: 'active',
            currentTemperature: 4.8,
            batteryLevel: 78,
            driverName: 'วิภา สุขใจ',
            driverPhone: '089-876-5432',
            currentLocation: {
              latitude: 18.784,
              longitude: 98.993,
              address: 'เชียงใหม่',
              updatedAt: '2025-03-01T13:45:00.000Z'
            },
          },
          { 
            id: '5', 
            registrationNumber: 'พม-7890',
            name: 'Van SM-05',
            type: 'refrigerated-van',
            status: 'active',
            currentTemperature: 3.2,
            batteryLevel: 85,
            driverName: 'นภา ใจดี',
            driverPhone: '083-456-7890',
            currentLocation: {
              latitude: 7.884,
              longitude: 98.398,
              address: 'ภูเก็ต',
              updatedAt: '2025-03-01T12:30:00.000Z'
            },
          },
        ];
        
        setActiveVehicles(mockVehicles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active vehicles:', error);
        setLoading(false);
      }
    };
    
    fetchActiveVehicles();
  }, []);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  // ถ้าไม่ใช่ admin
  if (user?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Vehicle Tracking',
      description: 'Real-time tracking of active vehicles',
      searchPlaceholder: 'Search by registration or driver name',
      registrationNumber: 'Registration #',
      vehicleName: 'Vehicle Name',
      driver: 'Driver',
      location: 'Current Location',
      temperature: 'Temperature',
      battery: 'Battery',
      lastUpdate: 'Last Update',
      viewDetails: 'View Details',
      noVehicles: 'No active vehicles found',
      minutes: 'minutes ago',
      now: 'just now',
      hour: 'hour ago',
      hours: 'hours ago'
    },
    th: {
      title: 'การติดตามยานพาหนะ',
      description: 'ติดตามยานพาหนะที่ใช้งานอยู่แบบเรียลไทม์',
      searchPlaceholder: 'ค้นหาด้วยทะเบียนหรือชื่อคนขับ',
      registrationNumber: 'ทะเบียน',
      vehicleName: 'ชื่อยานพาหนะ',
      driver: 'คนขับ',
      location: 'ตำแหน่งปัจจุบัน',
      temperature: 'อุณหภูมิ',
      battery: 'แบตเตอรี่',
      lastUpdate: 'อัพเดทล่าสุด',
      viewDetails: 'ดูรายละเอียด',
      noVehicles: 'ไม่พบยานพาหนะที่ใช้งานอยู่',
      minutes: 'นาทีที่แล้ว',
      now: 'เมื่อสักครู่',
      hour: 'ชั่วโมงที่แล้ว',
      hours: 'ชั่วโมงที่แล้ว'
    }
  };

  const t = translations[language] || translations.en;

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const updatedAt = new Date(dateString);
    const diffInMinutes = Math.round((now - updatedAt) / (1000 * 60));
    
    if (diffInMinutes < 1) return t.now;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutes}`;
    
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours === 1) return `1 ${t.hour}`;
    return `${diffInHours} ${t.hours}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.description}
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 h-64 mb-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Interactive map will be displayed here</p>
      </div>
      
      {/* Active Vehicles List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <h2 className="p-4 border-b border-gray-200 dark:border-gray-700 font-medium">
          {language === 'en' ? 'Active Vehicles' : 'ยานพาหนะที่ใช้งานอยู่'}
        </h2>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeVehicles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t.noVehicles}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {activeVehicles.map(vehicle => (
              <div 
                key={vehicle.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Truck className="text-blue-500 mr-2" size={18} />
                    <span className="font-medium">{vehicle.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.registrationNumber}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.driver}</div>
                    <div className="text-sm">{vehicle.driverName}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.location}</div>
                    <div className="text-sm flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {vehicle.currentLocation.address}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.temperature}</div>
                    <div className="text-sm flex items-center">
                      <Thermometer size={14} className="mr-1 text-blue-500" />
                      {vehicle.currentTemperature}°C
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.battery}</div>
                    <div className="text-sm flex items-center">
                      <Battery size={14} className="mr-1 text-green-500" />
                      {vehicle.batteryLevel}%
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t.lastUpdate}: {getTimeAgo(vehicle.currentLocation.updatedAt)}
                  </div>
                  
                  <Link
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t.viewDetails}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}