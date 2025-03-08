'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Thermometer, MapPin, Calendar, AlertTriangle, CheckCircle,
  Truck, Clock, Package, User, Phone
} from 'lucide-react';

// เพิ่ม interface สำหรับ alert
interface AlertType {
  id: string;
  orderNumber: string;
  timestamp: string;
  temperature: number;
  expectedRange: { min: number; max: number };
  location: string;
  status: string;
  severity: string;
  description: string;
  vehicle: {
    id: string;
    name: string;
    registrationNumber: string;
    driver: {
      name: string;
      phone: string;
    }
  };
  customer: {
    name: string;
    contact: string;
    phone: string;
  };
  product: {
    name: string;
    temperatureRequirement: string;
  };
  notes: string;
}

export default function TemperatureAlertDetailsPage() {
  const params = useParams();
  const alertId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchAlertDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลองสำหรับการทดสอบ - สร้าง default alert ในกรณีที่ไม่พบ ID
        const defaultAlert: AlertType = { 
          id: alertId, 
          orderNumber: `CC-20250301-${alertId}`, 
          timestamp: '2025-03-01T14:20:00.000Z',
          temperature: -16.5,
          expectedRange: { min: -20, max: -18 },
          location: 'Bangkok Warehouse',
          status: 'pending',
          severity: 'high',
          description: 'Temperature above acceptable range',
          vehicle: {
            id: 'XL-01',
            name: 'รถบรรทุกห้องเย็น XL-01',
            registrationNumber: 'บท-1234',
            driver: {
              name: 'สมชาย มั่นคง',
              phone: '081-234-5678'
            }
          },
          customer: {
            name: 'บริษัท อาหารไทย จำกัด',
            contact: 'คุณสมชาย มีสุข',
            phone: '081-234-5678'
          },
          product: {
            name: 'Frozen Food',
            temperatureRequirement: '-20°C to -18°C'
          },
          notes: ''
        };
        
        const mockAlerts: Record<string, AlertType> = {
          '1': defaultAlert,
          '2': { 
            id: '2', 
            orderNumber: 'CC-20250228-9876', 
            timestamp: '2025-02-28T08:45:00.000Z',
            temperature: 7.3,
            expectedRange: { min: 2, max: 6 },
            location: 'Chiang Mai Distribution Center',
            status: 'pending',
            severity: 'high',
            description: 'Temperature above acceptable range',
            vehicle: {
              id: 'MD-02',
              name: 'รถบรรทุกห้องเย็น MD-02',
              registrationNumber: 'ฮศ-5678',
              driver: {
                name: 'วิภา สุขใจ',
                phone: '089-876-5432'
              }
            },
            customer: {
              name: 'ห้างหุ้นส่วนจำกัด สดใหม่',
              contact: 'คุณวิชัย ใจดี',
              phone: '089-456-7890'
            },
            product: {
              name: 'Pharmaceutical Products',
              temperatureRequirement: '2°C to 6°C'
            },
            notes: 'Urgent attention required'
          },
          '3': { 
            id: '3', 
            orderNumber: 'CC-20250227-5432', 
            timestamp: '2025-02-27T16:30:00.000Z',
            temperature: 1.8,
            expectedRange: { min: 2, max: 6 },
            location: 'Phuket Checkpoint',
            status: 'pending',
            severity: 'medium',
            description: 'Temperature below acceptable range',
            vehicle: {
              id: 'SM-03',
              name: 'รถตู้ห้องเย็น SM-03',
              registrationNumber: 'กว-9012',
              driver: {
                name: 'ประสิทธิ์ เก่งกล้า',
                phone: '062-345-6789'
              }
            },
            customer: {
              name: 'บริษัท ซีฟู้ด เอ็กซ์พอร์ต จำกัด',
              contact: 'คุณนภา ทะเล',
              phone: '074-123-4567'
            },
            product: {
              name: 'Seafood',
              temperatureRequirement: '2°C to 6°C'
            },
            notes: ''
          }
        };
        
        // ใช้ data เป็น default ถ้าไม่พบ ID ในข้อมูลจำลอง
        const alertData = mockAlerts[alertId] || defaultAlert;
        setAlert(alertData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching alert details:', error);
        setError('Failed to load alert information');
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchAlertDetails();
    }
  }, [mounted, alertId]);

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
      title: 'Temperature Alert Details',
      orderNumber: 'Order Number',
      timestamp: 'Alert Time',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      location: 'Location',
      status: 'Status',
      severity: 'Severity',
      description: 'Description',
      vehicle: 'Vehicle',
      driver: 'Driver',
      registrationNumber: 'Registration Number',
      customer: 'Customer',
      contact: 'Contact Person',
      phone: 'Phone',
      product: 'Product',
      temperatureRequirement: 'Temperature Requirement',
      notes: 'Notes',
      backToAlerts: 'Back to Alerts',
      resolveAlert: 'Resolve Alert',
      editAlert: 'Edit Alert',
      pending: 'Pending',
      resolved: 'Resolved',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      error: 'Error',
      alertNotFound: 'Alert not found',
      resolutionNote: 'Resolution Note',
      resolvedBy: 'Resolved By',
      resolvedAt: 'Resolved At',
      viewShipment: 'View Shipment',
      trackShipment: 'Track Shipment'
    },
    th: {
      title: 'รายละเอียดการแจ้งเตือนอุณหภูมิ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      timestamp: 'เวลาที่แจ้งเตือน',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      location: 'สถานที่',
      status: 'สถานะ',
      severity: 'ความรุนแรง',
      description: 'รายละเอียด',
      vehicle: 'ยานพาหนะ',
      driver: 'คนขับ',
      registrationNumber: 'ทะเบียนรถ',
      customer: 'ลูกค้า',
      contact: 'ผู้ติดต่อ',
      phone: 'โทรศัพท์',
      product: 'สินค้า',
      temperatureRequirement: 'อุณหภูมิที่ต้องการ',
      notes: 'หมายเหตุ',
      backToAlerts: 'กลับไปยังการแจ้งเตือน',
      resolveAlert: 'แก้ไขการแจ้งเตือน',
      editAlert: 'แก้ไขข้อมูล',
      pending: 'รอดำเนินการ',
      resolved: 'แก้ไขแล้ว',
      high: 'สูง',
      medium: 'ปานกลาง',
      low: 'ต่ำ',
      error: 'ข้อผิดพลาด',
      alertNotFound: 'ไม่พบข้อมูลการแจ้งเตือน',
      resolutionNote: 'บันทึกการแก้ไข',
      resolvedBy: 'แก้ไขโดย',
      resolvedAt: 'แก้ไขเมื่อ',
      viewShipment: 'ดูการขนส่ง',
      trackShipment: 'ติดตามการขนส่ง'
    }
  };

  type LanguageType = 'en' | 'th';
  const t = translations[language as LanguageType] || translations.en;

  const getStatusClass = (status: string): string => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityClass = (severity: string): string => {
    switch(severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch(status) {
      case 'pending':
        return t.pending;
      case 'resolved':
        return t.resolved;
      default:
        return status;
    }
  };

  const getSeverityLabel = (severity: string): string => {
    switch(severity) {
      case 'high':
        return t.high;
      case 'medium':
        return t.medium;
      case 'low':
        return t.low;
      default:
        return severity;
    }
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  const handleResolveAlert = () => {
    // ในการใช้งานจริงจะเรียก API เพื่อแก้ไขสถานะการแจ้งเตือน
    // สำหรับการจำลอง เราจะแสดงข้อความแจ้งเตือน
    window.alert('Alert resolution functionality would be implemented in a real application');
  };

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
          href="/admin/temperature/alerts"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToAlerts}
        </Link>
      </div>
    );
  }

  // เปลี่ยนการตรวจสอบสำหรับ alert ไม่ว่า loading จะเสร็จหรือไม่ เราก็จะแสดงข้อมูล alert
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/temperature/alerts" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            {alert && (
              <div className="mt-1 flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(alert.status)}`}>
                  {getStatusLabel(alert.status)}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                  {getSeverityLabel(alert.severity)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          {alert && alert.status === 'pending' && (
            <>
              <button
                onClick={handleResolveAlert}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t.resolveAlert}
              </button>
              <Link
                href={`/admin/temperature/alerts/${alert.id}/edit`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t.editAlert}
              </Link>
            </>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : alert ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column - Alert and Vehicle Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Alert Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.orderNumber}: {alert.orderNumber}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.timestamp}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(alert.timestamp)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{alert.location}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer 
                      className={`h-5 w-5 mr-2 ${
                        alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`} 
                    />
                    <p className={`font-medium ${
                      alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {alert.temperature}°C
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.expectedRange}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.expectedRange.min}°C to {alert.expectedRange.max}°C
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.description}</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{alert.description}</p>
              </div>
              
              {alert.notes && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.notes}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{alert.notes}</p>
                </div>
              )}
              
              <div className="mt-6 flex space-x-4">
                <Link
                  href={`/admin/shipments/${alert.orderNumber.split('-').pop()}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.viewShipment}
                </Link>
                <Link
                  href={`/admin/tracking?id=${alert.orderNumber}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.trackShipment}
                </Link>
              </div>
            </div>
            
            {/* Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.vehicle}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicle}</p>
                  <div className="flex items-center mt-1">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.vehicle.name} ({alert.vehicle.id})
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.registrationNumber}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.vehicle.registrationNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.vehicle.driver.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.vehicle.driver.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second column - Customer and Product Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.customer}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.customer}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.customer.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.contact}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.customer.contact}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.customer.phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Product Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.product}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.product}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.product.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperatureRequirement}</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {alert.product.temperatureRequirement}
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
              {t.alertNotFound}
            </h2>
          </div>
          <div>
            <Link
              href="/admin/temperature/alerts"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t.backToAlerts}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}