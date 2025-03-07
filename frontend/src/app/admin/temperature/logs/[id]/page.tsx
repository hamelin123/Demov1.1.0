// frontend/src/app/admin/temperature/logs/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Thermometer, MapPin, Calendar, Clock, Truck, Package, AlertTriangle
} from 'lucide-react';

export default function TemperatureLogDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logData, setLogData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    // จำลองการดึงข้อมูลจาก API
    const fetchLogDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // สร้าง mock data สำหรับทุก ID
        const logId = id ? id.toString() : '1';
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const defaultLog = { 
          id: logId, 
          orderNumber: `CC-20250301-${logId}`,
          timestamp: '2025-03-01T14:30:00.000Z',
          temperature: -19.2,
          expectedRange: '-20°C to -18°C',
          location: 'กรุงเทพมหานคร',
          vehicleId: 'XL-01',
          vehicleName: 'รถบรรทุกห้องเย็น XL-01',
          registrationNumber: 'บท-1234',
          status: 'normal',
          driverName: 'สมชาย มั่นคง',
          driverPhone: '081-234-5678',
          productName: 'Frozen Food',
          temperatureHistory: [
            { timestamp: '2025-03-01T14:30:00.000Z', temperature: -19.2 },
            { timestamp: '2025-03-01T13:30:00.000Z', temperature: -19.0 },
            { timestamp: '2025-03-01T12:30:00.000Z', temperature: -18.8 },
            { timestamp: '2025-03-01T11:30:00.000Z', temperature: -18.5 },
            { timestamp: '2025-03-01T10:30:00.000Z', temperature: -18.7 }
          ],
          customer: {
            name: 'บริษัท อาหารไทย จำกัด',
            contact: 'คุณสมชาย มีสุข',
            phone: '081-234-5678'
          },
          notes: 'การขนส่งเป็นไปตามปกติ'
        };
        
        const mockLogs = {
          '1': defaultLog,
          '2': { 
            id: '2', 
            orderNumber: 'CC-20250301-1235',
            timestamp: '2025-03-01T14:45:00.000Z',
            temperature: 4.8,
            expectedRange: '2°C to 6°C',
            location: 'เชียงใหม่',
            vehicleId: 'MD-02',
            vehicleName: 'รถบรรทุกห้องเย็น MD-02',
            registrationNumber: 'ฮศ-5678',
            status: 'normal',
            driverName: 'วิภา สุขใจ',
            driverPhone: '089-876-5432',
            productName: 'Pharmaceutical Products',
            temperatureHistory: [
              { timestamp: '2025-03-01T14:45:00.000Z', temperature: 4.8 },
              { timestamp: '2025-03-01T13:45:00.000Z', temperature: 4.9 },
              { timestamp: '2025-03-01T12:45:00.000Z', temperature: 5.0 },
              { timestamp: '2025-03-01T11:45:00.000Z', temperature: 5.1 },
              { timestamp: '2025-03-01T10:45:00.000Z', temperature: 4.9 }
            ],
            customer: {
              name: 'ห้างหุ้นส่วนจำกัด สดใหม่',
              contact: 'คุณวิชัย ใจดี',
              phone: '089-456-7890'
            },
            notes: 'การขนส่งเป็นไปตามปกติ'
          },
          '3': { 
            id: '3', 
            orderNumber: 'CC-20250228-1233',
            timestamp: '2025-02-28T09:15:00.000Z',
            temperature: -16.5,
            expectedRange: '-20°C to -18°C',
            location: 'กรุงเทพมหานคร',
            vehicleId: 'XL-01',
            vehicleName: 'รถบรรทุกห้องเย็น XL-01',
            registrationNumber: 'บท-1234',
            status: 'alert',
            driverName: 'สมชาย มั่นคง',
            driverPhone: '081-234-5678',
            productName: 'Frozen Food',
            temperatureHistory: [
              { timestamp: '2025-02-28T09:15:00.000Z', temperature: -16.5 },
              { timestamp: '2025-02-28T08:15:00.000Z', temperature: -17.2 },
              { timestamp: '2025-02-28T07:15:00.000Z', temperature: -17.8 },
              { timestamp: '2025-02-28T06:15:00.000Z', temperature: -18.2 },
              { timestamp: '2025-02-28T05:15:00.000Z', temperature: -18.5 }
            ],
            customer: {
              name: 'บริษัท อาหารไทย จำกัด',
              contact: 'คุณสมชาย มีสุข',
              phone: '081-234-5678'
            },
            notes: 'มีการแจ้งเตือนอุณหภูมิสูงกว่าปกติ'
          }
        };
        
        // ใช้ข้อมูลเริ่มต้นถ้าไม่พบ ID
        const logData = mockLogs[logId] || defaultLog;
        setLogData(logData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching temperature log details:', error);
        setError('Failed to load log information');
        setLoading(false);
      }
    };
    
    if (mounted && !isLoading) {
      fetchLogDetails();
    }
  }, [mounted, id, router, isAuthenticated, isLoading, user, language]);

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Temperature Log Details',
      orderNumber: 'Order Number',
      time: 'Time',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      location: 'Location',
      status: 'Status',
      vehicle: 'Vehicle',
      driver: 'Driver',
      registrationNumber: 'Registration Number',
      phoneNumber: 'Phone Number',
      customer: 'Customer',
      contact: 'Contact Person',
      phone: 'Phone',
      product: 'Product',
      notes: 'Notes',
      temperatureHistory: 'Temperature History',
      datetime: 'Date & Time',
      temp: 'Temperature',
      backToLogs: 'Back to Logs',
      normal: 'Normal',
      alert: 'Alert',
      error: 'Error',
      logNotFound: 'Temperature log not found',
      viewOrder: 'View Order',
      trackShipment: 'Track Shipment'
    },
    th: {
      title: 'รายละเอียดบันทึกอุณหภูมิ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      time: 'เวลา',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      location: 'สถานที่',
      status: 'สถานะ',
      vehicle: 'ยานพาหนะ',
      driver: 'คนขับ',
      registrationNumber: 'ทะเบียนรถ',
      phoneNumber: 'หมายเลขโทรศัพท์',
      customer: 'ลูกค้า',
      contact: 'ผู้ติดต่อ',
      phone: 'โทรศัพท์',
      product: 'สินค้า',
      notes: 'หมายเหตุ',
      temperatureHistory: 'ประวัติอุณหภูมิ',
      datetime: 'วันที่และเวลา',
      temp: 'อุณหภูมิ',
      backToLogs: 'กลับไปยังบันทึกอุณหภูมิ',
      normal: 'ปกติ',
      alert: 'แจ้งเตือน',
      error: 'ข้อผิดพลาด',
      logNotFound: 'ไม่พบบันทึกอุณหภูมิ',
      viewOrder: 'ดูคำสั่งซื้อ',
      trackShipment: 'ติดตามการขนส่ง'
    }
  };

  const t = translations[language] || translations.en;

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'alert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ถ้ามีข้อผิดพลาด
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <h2 className="text-lg font-medium text-red-800 dark:text-red-300">{t.error}</h2>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
        <Link
          href="/admin/temperature/logs"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToLogs}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/temperature/logs" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            {logData && (
              <div className="mt-1 flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(logData.status)}`}>
                  {getStatusLabel(logData.status)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">{logData.orderNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {logData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column - Log Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.orderNumber}: {logData.orderNumber}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.time}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(logData.timestamp)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{logData.location}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer 
                      className={`h-5 w-5 mr-2 ${
                        logData.status === 'alert' ? 'text-red-500' : 'text-green-500'
                      }`} 
                    />
                    <p className={`font-medium ${
                      logData.status === 'alert' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {logData.temperature}°C
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.expectedRange}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {logData.expectedRange}
                    </p>
                  </div>
                </div>
              </div>
              
              {logData.notes && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.notes}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{logData.notes}</p>
                </div>
              )}
              
              <div className="mt-6 flex space-x-4">
                <Link
                  href={`/admin/orders/${logData.orderNumber.split('-').pop()}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.viewOrder}
                </Link>
                <Link
                  href={`/admin/tracking?id=${logData.orderNumber}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.trackShipment}
                </Link>
              </div>
            </div>
            
            {/* Temperature History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.temperatureHistory}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t.datetime}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t.temp}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {logData.temperatureHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDateTime(record.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`font-medium ${
                            record.temperature > -18 || record.temperature < -20
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {record.temperature}°C
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Second column - Vehicle and Customer Info */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.vehicle}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicle}</p>
                  <div className="flex items-center mt-1">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {logData.vehicleName} ({logData.vehicleId})
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.registrationNumber}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.registrationNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.driverName}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.phoneNumber}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.driverPhone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.customer}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.customer}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.customer.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.contact}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.customer.contact}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.customer.phone}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.product}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {logData.productName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg inline-block mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
              {t.logNotFound}
            </h2>
          </div>
          <div>
            <Link
              href="/admin/temperature/logs"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t.backToLogs}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}