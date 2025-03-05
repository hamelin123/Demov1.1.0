'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Truck, MapPin, Clock, Thermometer, Package, 
  CheckCircle, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function TrackingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const trackingId = searchParams?.get('id') || '';
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchTrackingData = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ถ้าไม่มี trackingId ให้ใช้ค่าเริ่มต้น
        const orderNumber = trackingId || 'ORD-20250301-1234';
        
        // ข้อมูลจำลอง
        const mockData = {
          orderNumber: orderNumber,
          status: 'in-transit',
          origin: 'กรุงเทพมหานคร',
          destination: 'เชียงใหม่',
          customerName: 'John Doe',
          departureDate: '2025-03-01T08:00:00.000Z',
          estimatedArrival: '2025-03-03T16:00:00.000Z',
          currentTemperature: -19.2,
          expectedTemperature: '-20°C to -18°C',
          vehicle: {
            id: 'XL-01',
            name: 'Truck XL-01',
            type: 'refrigerated-truck',
            driver: {
              name: 'สมชาย มั่นคง',
              phone: '081-234-5678'
            }
          },
          currentLocation: {
            latitude: 15.1271,
            longitude: 101.4927,
            address: 'Highway 11, Lampang',
            timestamp: '2025-03-02T15:30:00.000Z'
          },
          trackingHistory: [
            {
              id: 1,
              status: 'ordered',
              location: 'Online Ordering System',
              timestamp: '2025-02-28T14:20:00.000Z',
              temperature: null,
              notes: 'Order placed and confirmed'
            },
            {
              id: 2,
              status: 'processing',
              location: 'Bangkok Warehouse, 123 Logistics Way, Bangkok 10110',
              timestamp: '2025-03-01T07:15:00.000Z',
              temperature: -19.5,
              notes: 'Order processed and ready for shipment'
            },
            {
              id: 3,
              status: 'departed',
              location: 'Bangkok Warehouse, 123 Logistics Way, Bangkok 10110',
              timestamp: '2025-03-01T08:00:00.000Z',
              temperature: -19.2,
              notes: 'Shipment departed from origin'
            },
            {
              id: 4,
              status: 'in-transit',
              location: 'Highway 11, Lampang',
              timestamp: '2025-03-02T15:30:00.000Z',
              temperature: -19.2,
              notes: 'Shipment in transit'
            }
          ]
        };
        
        setTracking(mockData);
        setCurrentLocation(mockData.currentLocation);
        setTrackingHistory(mockData.trackingHistory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Failed to load tracking information');
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchTrackingData();
    }
  }, [mounted, trackingId]);

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
      title: 'Shipment Tracking',
      orderNumber: 'Order Number',
      status: 'Status',
      origin: 'Origin',
      destination: 'Destination',
      customer: 'Customer',
      departureDate: 'Departure Date',
      estimatedArrival: 'Estimated Arrival',
      currentTemperature: 'Current Temperature',
      expectedTemperature: 'Expected Temperature',
      vehicle: 'Vehicle',
      driver: 'Driver',
      currentLocation: 'Current Location',
      lastUpdated: 'Last Updated',
      trackingHistory: 'Tracking History',
      backToOrders: 'Back to Orders',
      backToShipments: 'Back to Shipments',
      ordered: 'Ordered',
      processing: 'Processing',
      departed: 'Departed',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
      justNow: 'just now',
      locationNotAvailable: 'Location information not available',
      error: 'Error',
      mapPlaceholder: 'Interactive map will be displayed here',
    },
    th: {
      title: 'ติดตามการขนส่ง',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      status: 'สถานะ',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      customer: 'ลูกค้า',
      departureDate: 'วันที่ออกเดินทาง',
      estimatedArrival: 'คาดว่าจะถึง',
      currentTemperature: 'อุณหภูมิปัจจุบัน',
      expectedTemperature: 'อุณหภูมิที่กำหนด',
      vehicle: 'ยานพาหนะ',
      driver: 'คนขับ',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      lastUpdated: 'อัปเดตล่าสุด',
      trackingHistory: 'ประวัติการติดตาม',
      backToOrders: 'กลับไปยังคำสั่งซื้อ',
      backToShipments: 'กลับไปยังการขนส่ง',
      ordered: 'สั่งซื้อแล้ว',
      processing: 'กำลังดำเนินการ',
      departed: 'ออกเดินทางแล้ว',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      minutes: 'นาทีที่แล้ว',
      hours: 'ชั่วโมงที่แล้ว',
      days: 'วันที่แล้ว',
      justNow: 'เมื่อสักครู่',
      locationNotAvailable: 'ไม่มีข้อมูลตำแหน่ง',
      error: 'ข้อผิดพลาด',
      mapPlaceholder: 'แผนที่แบบโต้ตอบจะแสดงที่นี่',
    }
  };

  const t = translations[language] || translations.en;

  const getStatusLabel = (status) => {
    switch(status) {
      case 'ordered':
        return t.ordered;
      case 'processing':
        return t.processing;
      case 'departed':
        return t.departed;
      case 'in-transit':
        return t.inTransit;
      case 'delivered':
        return t.delivered;
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ordered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'departed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return t.justNow;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutes}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${t.hours}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t.days}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
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
        <div className="flex space-x-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.backToOrders}
          </Link>
          <Link
            href="/admin/shipments"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t.backToShipments}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/shipments" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}: {tracking?.orderNumber}
            </h1>
            {tracking && (
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tracking.status)}`}>
                  {getStatusLabel(tracking.status)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tracking ? (
        <div className="space-y-6">
          {/* Map Placeholder */}
          <div className="bg-gray-100 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">{t.mapPlaceholder}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.orderNumber}: {tracking.orderNumber}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.customer}</p>
                    <p className="font-medium">{tracking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicle}</p>
                    <p className="font-medium">{tracking.vehicle.name}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.origin}</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {tracking.origin}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.destination}</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {tracking.destination}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.departureDate}</p>
                    <p className="font-medium">{formatDateTime(tracking.departureDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.estimatedArrival}</p>
                    <p className="font-medium">{formatDateTime(tracking.estimatedArrival)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentTemperature}</p>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      <Thermometer className="h-4 w-4 inline mr-1" />
                      {tracking.currentTemperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.expectedTemperature}</p>
                    <p className="font-medium">{tracking.expectedTemperature}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <p className="font-medium">
                    {tracking.vehicle.driver.name} ({tracking.vehicle.driver.phone})
                  </p>
                </div>
              </div>
            </div>
            
            {/* Current Location */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.currentLocation}
              </h2>
              
              {currentLocation ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="font-medium flex items-center text-gray-900 dark:text-white">
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      {currentLocation.address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t.lastUpdated}: {getTimeAgo(currentLocation.timestamp)}
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Latitude: {currentLocation.latitude}, Longitude: {currentLocation.longitude}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">{t.locationNotAvailable}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tracking History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t.trackingHistory}
            </h2>
            
            <div className="relative">
              {trackingHistory.map((event, index) => (
                <div key={event.id} className="mb-6 relative pl-8">
                  {/* Timeline connector */}
                  {index < trackingHistory.length - 1 && (
                    <div className="absolute left-3.5 top-5 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                  
                  {/* Status marker */}
                  <div className="absolute left-0 top-1">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                      event.status === 'delivered' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {event.status === 'delivered' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Event details */}
                  <div>
                    <div className="flex flex-wrap justify-between mb-1 items-center">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        {formatDateTime(event.timestamp)}
                      </h3>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-2">{event.location}</p>
                    
                    {event.temperature !== null && (
                      <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">
                        <Thermometer className="h-4 w-4 inline mr-1" />
                        {event.temperature}°C
                      </p>
                    )}
                    
                    {event.notes && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{event.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 dark:text-gray-400">No tracking information available</p>
        </div>
      )}
    </div>
  );
}