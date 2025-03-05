'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { Search, Filter, RefreshCw, Thermometer, MapPin, Calendar, Package, ChevronDown } from 'lucide-react';

export default function TemperatureLogsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchTemperatureLogs = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลอง
        const mockLogs = [
          { 
            id: '1', 
            orderNumber: 'CC-20250301-1234',
            timestamp: '2025-03-01T14:30:00.000Z',
            temperature: -19.2,
            expectedRange: '-20°C to -18°C',
            location: 'กรุงเทพมหานคร',
            vehicleId: 'XL-01',
            status: 'normal'
          },
          { 
            id: '2', 
            orderNumber: 'CC-20250301-1235',
            timestamp: '2025-03-01T14:45:00.000Z',
            temperature: 4.8,
            expectedRange: '2°C to 6°C',
            location: 'เชียงใหม่',
            vehicleId: 'MD-02',
            status: 'normal'
          },
          { 
            id: '3', 
            orderNumber: 'CC-20250228-1233',
            timestamp: '2025-02-28T09:15:00.000Z',
            temperature: -16.5,
            expectedRange: '-20°C to -18°C',
            location: 'กรุงเทพมหานคร',
            vehicleId: 'XL-01',
            status: 'alert'
          }
        ];
        
        setLogs(mockLogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching temperature logs:', error);
        setLoading(false);
      }
    };
    
    fetchTemperatureLogs();
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
      title: 'Temperature Logs',
      description: 'Monitor and review temperature logs for all shipments',
      orderNumber: 'Order #',
      timestamp: 'Time Recorded',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      location: 'Location',
      vehicle: 'Vehicle',
      status: 'Status',
      actions: 'Actions',
      normal: 'Normal',
      alert: 'Alert',
      view: 'View Details',
      noLogs: 'No temperature logs found'
    },
    th: {
      title: 'บันทึกอุณหภูมิ',
      description: 'ตรวจสอบและทบทวนบันทึกอุณหภูมิสำหรับการขนส่งทั้งหมด',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      timestamp: 'เวลาที่บันทึก',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      location: 'ตำแหน่ง',
      vehicle: 'ยานพาหนะ',
      status: 'สถานะ',
      actions: 'การกระทำ',
      normal: 'ปกติ',
      alert: 'แจ้งเตือน',
      view: 'ดูรายละเอียด',
      noLogs: 'ไม่พบบันทึกอุณหภูมิ'
    }
  };

  const t = translations[language] || translations.en;

  const getStatusClass = (status) => {
    switch(status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'alert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'normal':
        return t.normal;
      case 'alert':
        return t.alert;
      default:
        return status;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
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
      
      {/* Temperature Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t.noLogs}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.orderNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.timestamp}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.temperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.expectedRange}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.location}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.vehicle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.orderNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <Calendar className="h-4 w-4 inline-block mr-1 text-gray-400" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Thermometer className="h-4 w-4 inline-block mr-1" />
                        {log.temperature}°C
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {log.expectedRange}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <MapPin className="h-4 w-4 inline-block mr-1 text-gray-400" />
                        {log.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.vehicleId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(log.status)}`}>
                        {getStatusLabel(log.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/temperature/logs/${log.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {t.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}