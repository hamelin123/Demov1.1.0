'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Search, Truck, MapPin, Thermometer, Battery, Clock, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function VehicleTrackingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  
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

        // จำลองการโหลดแผนที่
        setTimeout(() => {
          setMapLoaded(true);
        }, 1500);
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
      hours: 'hours ago',
      mapLoading: 'Loading map...',
      activeVehicles: 'Active Vehicles'
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
      hours: 'ชั่วโมงที่แล้ว',
      mapLoading: 'กำลังโหลดแผนที่...',
      activeVehicles: 'ยานพาหนะที่ใช้งานอยู่'
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

  // กรองข้อมูลตามคำค้นหา
  const filteredVehicles = activeVehicles.filter(vehicle => 
    searchQuery === '' || 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // แสดงผลแผนที่แบบจำลอง
  const renderMap = () => {
    if (!mapLoaded) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 h-96 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">{t.mapLoading}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 dark:bg-gray-800 h-96 relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Thailand Map Mockup */}
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10">
          {/* Map SVG mockup */}
          <svg viewBox="0 0 500 500" className="w-full h-full opacity-30">
            <path d="M150,100 C150,80 200,50 250,50 C300,50 350,80 350,100 C350,150 300,200 250,250 C200,200 150,150 150,100 Z" fill="currentColor" className="text-blue-500" />
            <path d="M180,270 C180,250 220,220 250,220 C280,220 320,250 320,270 C320,300 280,350 250,380 C220,350 180,300 180,270 Z" fill="currentColor" className="text-blue-500" />
            <path d="M220,400 C220,390 240,380 250,380 C260,380 280,390 280,400 C280,410 260,430 250,450 C240,430 220,410 220,400 Z" fill="currentColor" className="text-blue-500" />
          </svg>

          {/* Vehicle location markers */}
          {activeVehicles.map((vehicle, index) => {
            // Convert Thai coordinates to SVG coordinates (simplified for example)
            const x = ((vehicle.currentLocation.longitude - 97) / 9) * 400 + 50;
            const y = ((18 - vehicle.currentLocation.latitude) / 13) * 400 + 50;
            
            return (
              <div key={vehicle.id} 
                className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-pulse"
                style={{ left: `${x}px`, top: `${y}px` }}
                title={`${vehicle.name} (${vehicle.registrationNumber})`}
              >
                <div className="absolute -inset-1 bg-red-500 rounded-full opacity-30 animate-ping"></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      {/* Map */}
      {renderMap()}
      
      {/* Active Vehicles List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t.activeVehicles}
        </h2>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {t.noVehicles}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map(vehicle => (
              <div 
                key={vehicle.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Truck className="text-blue-500 mr-2" size={18} />
                    <span className="font-medium text-gray-900 dark:text-white">{vehicle.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.registrationNumber}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.driver}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{vehicle.driverName}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.location}</div>
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {vehicle.currentLocation.address}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.temperature}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                      <Thermometer size={14} className="mr-1" />
                      {vehicle.currentTemperature}°C
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.battery}</div>
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <Battery size={14} className="mr-1" />
                      {vehicle.batteryLevel}%
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {getTimeAgo(vehicle.currentLocation.updatedAt)}
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