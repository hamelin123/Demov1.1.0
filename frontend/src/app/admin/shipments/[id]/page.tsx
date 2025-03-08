'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Truck, MapPin, Calendar, Thermometer, Package, User, Phone,
  CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

  type ShipmentType = {
    id: string;
    orderNumber: string;
    status: string;
    origin: string;
    destination: string;
    customer: {
      name: string;
      contact: string;
      phone: string;
      email: string;
    };
    departureDate: string;
    arrivalDate: string;
    temperature: string; // เปลี่ยนจาก temperatureRange
    expectedRange: string;
    currenttemperature: number; // t ตัวพิมพ์เล็ก
    vehicle: {
      id: string;
      name: string;
      driver: {
        name: string;
        phone: string;
      }
    };
    trackingEvents: Array<{
      id: number;
      timestamp: string;
      location: string;
      status: string;
      notes: string; // เปลี่ยนจาก note เป็น notes
    }>;
  };

export default function ShipmentDetailsPage() {
  const { id } = useParams();
  const shipmentId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<ShipmentType | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchShipmentDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { id } = useParams();
        const shipmentId = Array.isArray(id) ? id[0] : id;
        // ข้อมูลจำลองสำหรับการทดสอบ
        const mockShipment: ShipmentType = {
          id: shipmentId,
          orderNumber: `CC-20250301-${Array.isArray(id) ? id[0].padStart(4, '0') : id.padStart(4, '0')}`,
          status: 'in-transit',
          origin: 'กรุงเทพมหานคร',
          destination: 'เชียงใหม่',
          customer: {
            name: 'บริษัท อาหารไทย จำกัด',
            contact: 'คุณสมชาย มีสุข',
            phone: '081-234-5678',
            email: 'somchai@example.com'
          },
          departureDate: '2025-03-05T08:00:00.000Z',
          arrivalDate: '2025-03-07T16:00:00.000Z',
          temperature: '-18°C',
          expectedRange: '-20°C to -18°C',
          currenttemperature : -19.2,
          vehicle: {
            id: 'XL-01',
            name: 'รถบรรทุกห้องเย็น XL-01',
            driver: {
              name: 'สมชาย มั่นคง',
              phone: '081-234-5678'
            }
          },
          currentLocation: {
            address: 'Highway 11, Lampang',
            timestamp: '2025-03-02T15:30:00.000Z',
            coordinates: {
              latitude: 15.1271,
              longitude: 101.4927
            }
          },
          items: [
            {
              id: 1,
              name: 'อาหารแช่แข็ง',
              quantity: 200,
              weight: '500 kg',
              temperature: '-18°C'
            },
            {
              id: 2,
              name: 'เนื้อสัตว์แช่แข็ง',
              quantity: 150,
              weight: '300 kg',
              temperature: '-18°C'
            }
          ],
          trackingEvents: [
            {
              id: 1,
              status: 'ordered',
              location: 'Online System',
              timestamp: '2025-03-01T10:00:00.000Z',
              notes: 'Order created'
            },
            {
              id: 2,
              status: 'processing',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-02T08:00:00.000Z',
              notes: 'Order processing started'
            },
            {
              id: 3,
              status: 'departed',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-02T09:30:00.000Z',
              notes: 'Shipment departed from origin'
            },
            {
              id: 4,
              status: 'in-transit',
              location: 'Highway 11, Lampang',
              timestamp: '2025-03-02T15:30:00.000Z',
              notes: 'Shipment in transit'
            }
          ]
        };
        
        setShipment(mockShipment);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shipment details:', error);
        setError('Failed to load shipment information');
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchShipmentDetails();
    }
  }, [mounted, id]);

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
      title: 'Shipment Details',
      orderNumber: 'Order Number',
      status: 'Status',
      origin: 'Origin',
      destination: 'Destination',
      customer: 'Customer',
      contact: 'Contact Person',
      phone: 'Phone',
      email: 'Email',
      departureDate: 'Departure Date',
      arrivalDate: 'Arrival Date',
      temperature: 'Temperature',
      expectedRange: 'Expected Temperature Range',
      currentTemperature: 'Current Temperature',
      vehicle: 'Vehicle',
      driver: 'Driver',
      currentLocation: 'Current Location',
      lastUpdated: 'Last Updated',
      items: 'Shipment Items',
      item: 'Item',
      quantity: 'Quantity',
      weight: 'Weight',
      trackingHistory: 'Tracking History',
      backToShipments: 'Back to Shipments',
      trackShipment: 'Track Shipment',
      ordered: 'Ordered',
      processing: 'Processing',
      departed: 'Departed',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      pending: 'Pending',
      cancelled: 'Cancelled',
      error: 'Error',
      shipmentNotFound: 'Shipment not found',
      noItems: 'No items found for this shipment'
    },
    th: {
      title: 'รายละเอียดการขนส่ง',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      status: 'สถานะ',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      customer: 'ลูกค้า',
      contact: 'ผู้ติดต่อ',
      phone: 'โทรศัพท์',
      email: 'อีเมล',
      departureDate: 'วันที่ออกเดินทาง',
      arrivalDate: 'วันที่ถึง',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงอุณหภูมิที่กำหนด',
      currentTemperature: 'อุณหภูมิปัจจุบัน',
      vehicle: 'ยานพาหนะ',
      driver: 'คนขับ',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      lastUpdated: 'อัปเดตล่าสุด',
      items: 'รายการสินค้า',
      item: 'สินค้า',
      quantity: 'จำนวน',
      weight: 'น้ำหนัก',
      trackingHistory: 'ประวัติการติดตาม',
      backToShipments: 'กลับไปยังการขนส่ง',
      trackShipment: 'ติดตามการขนส่ง',
      ordered: 'สั่งซื้อแล้ว',
      processing: 'กำลังดำเนินการ',
      departed: 'ออกเดินทางแล้ว',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      pending: 'รอดำเนินการ',
      cancelled: 'ยกเลิกแล้ว',
      error: 'ข้อผิดพลาด',
      shipmentNotFound: 'ไม่พบข้อมูลการขนส่ง',
      noItems: 'ไม่พบรายการสินค้าสำหรับการขนส่งนี้'
    }
  };

  const t = translations[language] || translations.en;

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'departed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'ordered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending':
        return t.pending;
      case 'in-transit':
        return t.inTransit;
      case 'delivered':
        return t.delivered;
      case 'cancelled':
        return t.cancelled;
      case 'processing':
        return t.processing;
      case 'departed':
        return t.departed;
      case 'ordered':
        return t.ordered;
      default:
        return status;
    }
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
        <Link
          href="/admin/shipments"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToShipments}
        </Link>
      </div>
    );
  }

  // ถ้าไม่พบข้อมูลการขนส่ง
  if (!loading && !shipment) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">{t.shipmentNotFound}</h2>
          </div>
        </div>
        <Link
          href="/admin/shipments"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToShipments}
        </Link>
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
              {t.title}: {shipment?.orderNumber}
            </h1>
            {shipment && (
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(shipment.status)}`}>
                  {getStatusLabel(shipment.status)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {shipment && shipment.status !== 'cancelled' && (
          <Link
            href={`/admin/tracking?id=${shipment.orderNumber}`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Truck className="mr-2 h-4 w-4" />
            {t.trackShipment}
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : shipment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column - Main Shipment Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Shipment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.orderNumber}: {shipment.orderNumber}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.origin}</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.origin}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.destination}</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.destination}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.departureDate}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(shipment.departureDate)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.arrivalDate}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(shipment.arrivalDate)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-blue-600 dark:text-blue-400">{shipment.temperature}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentTemperature}</p>
                  <div className="flex items-center mt-1">
                    <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
                    <p className="font-medium text-blue-600 dark:text-blue-400">{shipment.currentTemperature}°C</p>
                  </div>
                </div>
              </div>
              
              {shipment.status === 'in-transit' && shipment.currentLocation && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.currentLocation}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.currentLocation.address}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-7 mt-1">
                    {t.lastUpdated}: {formatDateTime(shipment.currentLocation.timestamp)}
                  </p>
                </div>
              )}
            </div>
            
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.customer}
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.customer}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{shipment.customer.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.contact}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{shipment.customer.contact}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.customer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                <span className="h-5 w-5 text-gray-400 mr-2">✉️</span>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.email}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.customer.email}</p>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Shipment Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.items}
              </h2>
              
              {shipment.items && shipment.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.item}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.quantity}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.weight}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.temperature}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {shipment.items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.weight}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
                              {item.temperature}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t.noItems}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Second column - Vehicle and Tracking */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.vehicle}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicle}</p>
                  <p className="font-medium flex items-center text-gray-900 dark:text-white">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    {shipment.vehicle.name} ({shipment.vehicle.id})
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {shipment.vehicle.driver.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {shipment.vehicle.driver.phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tracking History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.trackingHistory}
              </h2>
              
              <div className="relative">
                {shipment.trackingEvents.map((event, index) => (
                  <div key={event.id} className="mb-6 relative pl-8">
                    {/* Timeline connector */}
                    {index < shipment.trackingEvents.length - 1 && (
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
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusClass(event.status)}`}>
                            {getStatusLabel(event.status)}
                          </span>
                          {formatDateTime(event.timestamp)}
                        </h3>
                      </div>
                      
                      <p className="text-gray-500 dark:text-gray-400 mb-2">{event.location}</p>
                      
                      {event.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}