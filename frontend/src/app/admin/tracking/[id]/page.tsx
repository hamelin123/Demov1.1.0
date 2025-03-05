'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { MapPin, Truck, Thermometer, Calendar, Clock, ArrowLeft, User, Phone, Package, Info, AlertTriangle, Mail } from 'lucide-react';

export default function TrackingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const trackingId = params.id;
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // ดึงข้อมูลการขนส่ง
    const fetchShipment = async () => {
      try {
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const mockShipment = {
          id: trackingId,
          status: 'in-transit',
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '081-234-5678'
          },
          origin: 'Bangkok Warehouse, 123 Logistics Way, Bangkok 10110',
          destination: 'ABC Hospital, 456 Healthcare St, Chiang Mai 50000',
          currentLocation: {
            address: 'Highway 11, Lampang',
            coordinates: { lat: 18.2, lng: 99.5 },
            updatedAt: '2025-03-02T08:30:00Z'
          },
          vehicle: {
            id: 'TRK-001',
            registrationNumber: 'บท-1234',
            name: 'Truck XL-01',
            driverName: 'สมชาย มั่นคง',
            driverPhone: '081-234-5678'
          },
          temperature: {
            current: -19.2,
            min: -20.1,
            max: -18.5,
            expectedRange: '-20°C to -18°C',
            lastUpdated: '2025-03-02T08:30:00Z'
          },
          timeline: [
            {
              status: 'created',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T10:00:00Z',
              temperature: null,
              notes: 'Order created and confirmed'
            },
            {
              status: 'processing',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T14:30:00Z',
              temperature: -18.5,
              notes: 'Preparing for shipment'
            },
            {
              status: 'picked-up',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T16:00:00Z',
              temperature: -18.8,
              notes: 'Picked up by driver'
            },
            {
              status: 'in-transit',
              location: 'Ayutthaya Checkpoint',
              timestamp: '2025-03-01T18:30:00Z',
              temperature: -19.2,
              notes: 'Passed through checkpoint'
            },
            {
              status: 'in-transit',
              location: 'Nakhon Sawan',
              timestamp: '2025-03-01T22:15:00Z',
              temperature: -19.0,
              notes: 'Driver rest stop'
            },
            {
              status: 'in-transit',
              location: 'Lampang',
              timestamp: '2025-03-02T08:30:00Z',
              temperature: -19.2,
              notes: 'Currently on Highway 11'
            }
          ],
          estimatedDelivery: '2025-03-02T14:00:00Z',
          items: [
            {
              name: 'Frozen Medical Samples',
              quantity: 3,
              temperature: '-20°C to -18°C'
            }
          ],
          alerts: [
            {
              type: 'temperature',
              timestamp: '2025-03-01T19:45:00Z',
              message: 'Temperature briefly rose to -17.9°C',
              severity: 'low',
              resolved: true
            }
          ]
        };
        
        setShipment(mockShipment);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shipment:', error);
        setLoading(false);
      }
    };
    
    if (mounted && !isLoading) {
      fetchShipment();
    }
  }, [mounted, trackingId, router, isAuthenticated, isLoading, currentUser]);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // ถ้าไม่พบข้อมูลการขนส่ง
  if (!shipment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Shipment not found' : 'ไม่พบข้อมูลการขนส่ง'}
            </h2>
          </div>
          <Link 
            href="/admin/tracking"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Back to Tracking' : 'กลับไปหน้าการติดตาม'}
          </Link>
        </div>
      </div>
    );
  }

  // Translations
  const translations = {
    en: {
      trackingDetails: 'Tracking Details',
      status: 'Status',
      created: 'Created',
      processing: 'Processing',
      pickedUp: 'Picked Up',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      customerInfo: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      shipmentInfo: 'Shipment Information',
      origin: 'Origin',
      destination: 'Destination',
      currentLocation: 'Current Location',
      estimatedDelivery: 'Estimated Delivery',
      vehicleInfo: 'Vehicle Information',
      vehicle: 'Vehicle',
      driver: 'Driver',
      temperature: 'Temperature',
      currentTemp: 'Current',
      expectedRange: 'Expected Range',
      lastUpdated: 'Last Updated',
      shipmentItems: 'Shipment Items',
      item: 'Item',
      quantity: 'Quantity',
      tempRequirement: 'Temperature Requirement',
      timeline: 'Shipment Timeline',
      time: 'Time',
      location: 'Location',
      notes: 'Notes',
      temp: 'Temp',
      alerts: 'Alerts',
      alertType: 'Type',
      message: 'Message',
      severity: 'Severity',
      resolved: 'Resolved',
      yes: 'Yes',
      no: 'No',
      backToTracking: 'Back to Tracking',
      temperatureAlert: 'Temperature Alert',
      systemAlert: 'System Alert'
    },
    th: {
      trackingDetails: 'รายละเอียดการติดตาม',
      status: 'สถานะ',
      created: 'สร้างแล้ว',
      processing: 'กำลังดำเนินการ',
      pickedUp: 'รับสินค้าแล้ว',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิกแล้ว',
      customerInfo: 'ข้อมูลลูกค้า',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      shipmentInfo: 'ข้อมูลการขนส่ง',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      estimatedDelivery: 'กำหนดส่ง',
      vehicleInfo: 'ข้อมูลยานพาหนะ',
      vehicle: 'ยานพาหนะ',
      driver: 'คนขับ',
      temperature: 'อุณหภูมิ',
      currentTemp: 'ปัจจุบัน',
      expectedRange: 'ช่วงที่กำหนด',
      lastUpdated: 'อัปเดตล่าสุด',
      shipmentItems: 'รายการสินค้า',
      item: 'รายการ',
      quantity: 'จำนวน',
      tempRequirement: 'ข้อกำหนดอุณหภูมิ',
      timeline: 'ไทม์ไลน์การขนส่ง',
      time: 'เวลา',
      location: 'ตำแหน่ง',
      notes: 'บันทึก',
      temp: 'อุณหภูมิ',
      alerts: 'การแจ้งเตือน',
      alertType: 'ประเภท',
      message: 'ข้อความ',
      severity: 'ความรุนแรง',
      resolved: 'แก้ไขแล้ว',
      yes: 'ใช่',
      no: 'ไม่',
      backToTracking: 'กลับไปหน้าการติดตาม',
      temperatureAlert: 'การแจ้งเตือนอุณหภูมิ',
      systemAlert: 'การแจ้งเตือนระบบ'
    }
  };

  const t = translations[language] || translations.en;

  // ฟังก์ชั่นสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ฟังก์ชั่นสำหรับแปลงสถานะ
  const getStatusText = (status) => {
    switch (status) {
      case 'created': return t.created;
      case 'processing': return t.processing;
      case 'picked-up': return t.pickedUp;
      case 'in-transit': return t.inTransit;
      case 'delivered': return t.delivered;
      case 'cancelled': return t.cancelled;
      default: return status;
    }
  };

  // ฟังก์ชั่นสำหรับกำหนดสีของสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'picked-up': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link 
          href="/admin/tracking"
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.trackingDetails}: {shipment.id}
        </h1>
      </div>
      
      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.status}</h2>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                {getStatusText(shipment.status)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.estimatedDelivery}</h2>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(shipment.estimatedDelivery)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.customerInfo}</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.name}</div>
              <div className="flex items-center mt-1">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{shipment.customer.name}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</div>
              <div className="flex items-center mt-1">
              <svg className="h-4 w-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
                <span className="text-gray-900 dark:text-white">{shipment.customer.email}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</div>
              <div className="flex items-center mt-1">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{shipment.customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.shipmentInfo}</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.origin}</div>
              <div className="flex items-start mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                <span className="text-gray-900 dark:text-white">{shipment.origin}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.destination}</div>
              <div className="flex items-start mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                <span className="text-gray-900 dark:text-white">{shipment.destination}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.currentLocation}</div>
              <div className="flex items-start mt-1">
                <MapPin className="h-4 w-4 text-blue-500 mr-2 mt-1" />
                <div>
                  <span className="text-gray-900 dark:text-white">{shipment.currentLocation.address}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.lastUpdated}: {formatDate(shipment.currentLocation.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Vehicle Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.vehicleInfo}</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.vehicle}</div>
              <div className="flex items-center mt-1">
                <Truck className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">
                  {shipment.vehicle.name} ({shipment.vehicle.registrationNumber})
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.driver}</div>
              <div className="flex items-center mt-1">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{shipment.vehicle.driverName}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">({shipment.vehicle.driverPhone})</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temperature Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.temperature}</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.currentTemp}</div>
              <div className="flex items-center mt-1">
                <Thermometer className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xl font-medium text-blue-600 dark:text-blue-400">
                  {shipment.temperature.current}°C
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.expectedRange}</div>
              <div className="flex items-center mt-1">
                <span className="text-gray-900 dark:text-white">{shipment.temperature.expectedRange}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.lastUpdated}</div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{formatDate(shipment.temperature.lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shipment Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.shipmentItems}</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.item}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.quantity}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.tempRequirement}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {shipment.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">{item.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.timeline}</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {shipment.timeline.map((event, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== shipment.timeline.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getStatusText(event.status)} - {event.location}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {event.notes}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap">
                        <div className="text-gray-500 dark:text-gray-400">
                          {formatDate(event.timestamp)}
                        </div>
                        {event.temperature !== null && (
                          <div className="mt-1 text-blue-600 dark:text-blue-400">
                            {event.temperature}°C
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Alerts */}
      {shipment.alerts && shipment.alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t.alerts}</h2>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.time}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.alertType}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.message}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.severity}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.resolved}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shipment.alerts.map((alert, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{formatDate(alert.timestamp)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {alert.type === 'temperature' ? t.temperatureAlert : t.systemAlert}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{alert.message}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {alert.resolved ? t.yes : t.no}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}