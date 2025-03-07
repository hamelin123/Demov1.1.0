'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Package, User, Mail, Phone, MapPin, Truck, 
  Calendar, Thermometer, FileText, CheckCircle, AlertCircle
} from 'lucide-react';

// Define the type for order data
interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  pickup: {
    address: string;
    date: string;
  };
  delivery: {
    address: string;
    date: string;
  };
  currentLocation: string;
  locationUpdatedAt: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
    temperature: string;
    notes: string;
  }>;
  vehicle: {
    id: string;
    name: string;
    type: string;
    currentTemperature: number;
    driver: {
      name: string;
      phone: string;
    };
  };
  notes: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchOrderDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // แปลง id ให้เป็น string เสมอ
        const orderId = Array.isArray(id) ? id[0] : String(id);
        
        // Mock order data
        const mockOrder: OrderData = {
          id: orderId,
          orderNumber: `ORD-20250301-${orderId.padStart(4, '0')}`,
          status: 'in-transit',
          date: '2025-03-01T14:30:00.000Z',
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '081-234-5678'
          },
          pickup: {
            address: 'Bangkok Warehouse, 123 Logistics Way, Bangkok 10110',
            date: '2025-03-01T08:00:00.000Z'
          },
          delivery: {
            address: 'ABC Hospital, 456 Healthcare St, Chiang Mai 50000',
            date: '2025-03-03T16:00:00.000Z'
          },
          currentLocation: 'Highway 11, Lampang',
          locationUpdatedAt: '2025-03-02T15:30:00.000Z',
          items: [
            {
              id: 1,
              name: 'Frozen Vaccine',
              quantity: 200,
              unit: 'vials',
              temperature: '-18°C to -20°C',
              notes: 'Handle with care, temperature sensitive'
            },
            {
              id: 2,
              name: 'Medical Supplies',
              quantity: 50,
              unit: 'boxes',
              temperature: '-18°C to -20°C',
              notes: ''
            }
          ],
          vehicle: {
            id: 'XL-01',
            name: 'Truck XL-01',
            type: 'refrigerated-truck',
            currentTemperature: -19.2,
            driver: {
              name: 'สมชาย มั่นคง',
              phone: '081-234-5678'
            }
          },
          notes: 'Priority shipment for hospital supplies'
        };
        
        setOrderData(mockOrder);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order information');
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchOrderDetails();
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
      title: 'Order Details',
      orderNumber: 'Order Number',
      status: 'Status',
      date: 'Order Date',
      customerInfo: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      shippingInfo: 'Shipping Information',
      origin: 'Origin',
      destination: 'Destination',
      pickupDate: 'Pickup Date',
      deliveryDate: 'Delivery Date',
      currentLocation: 'Current Location',
      lastUpdate: 'Last Update',
      orderItems: 'Order Items',
      item: 'Item',
      quantity: 'Quantity',
      temperature: 'Required Temperature',
      notes: 'Notes',
      vehicleInfo: 'Vehicle Information',
      vehicleName: 'Vehicle',
      currentTemperature: 'Current Temperature',
      driver: 'Driver',
      additionalNotes: 'Additional Notes',
      backToOrders: 'Back to Orders',
      trackShipment: 'Track Shipment',
      noItems: 'No items found for this order',
      pending: 'Pending',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      error: 'Error',
      noOrder: 'Order not found'
    },
    th: {
      title: 'รายละเอียดคำสั่งซื้อ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      status: 'สถานะ',
      date: 'วันที่สั่งซื้อ',
      customerInfo: 'ข้อมูลลูกค้า',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      shippingInfo: 'ข้อมูลการจัดส่ง',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      pickupDate: 'วันที่รับสินค้า',
      deliveryDate: 'วันที่ส่งสินค้า',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      lastUpdate: 'อัปเดตล่าสุด',
      orderItems: 'รายการสินค้า',
      item: 'สินค้า',
      quantity: 'จำนวน',
      temperature: 'อุณหภูมิที่ต้องการ',
      notes: 'หมายเหตุ',
      vehicleInfo: 'ข้อมูลยานพาหนะ',
      vehicleName: 'ยานพาหนะ',
      currentTemperature: 'อุณหภูมิปัจจุบัน',
      driver: 'คนขับ',
      additionalNotes: 'หมายเหตุเพิ่มเติม',
      backToOrders: 'กลับไปยังคำสั่งซื้อ',
      trackShipment: 'ติดตามการขนส่ง',
      noItems: 'ไม่พบรายการสินค้าสำหรับคำสั่งซื้อนี้',
      pending: 'รอดำเนินการ',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิกแล้ว',
      error: 'ข้อผิดพลาด',
      noOrder: 'ไม่พบคำสั่งซื้อ'
    }
  };

  const t = translations[language] || translations.en;

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending':
        return t.pending;
      case 'in-transit':
        return t.inTransit;
      case 'delivered':
        return t.delivered;
      case 'cancelled':
        return t.cancelled;
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
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
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <h2 className="text-lg font-medium text-red-800 dark:text-red-300">{t.error}</h2>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToOrders}
        </Link>
      </div>
    );
  }

  // ถ้าไม่พบคำสั่งซื้อ
  if (!loading && !orderData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">{t.noOrder}</h2>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToOrders}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/orders" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}: {orderData?.orderNumber}
            </h1>
            {orderData && (
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(orderData.status)}`}>
                  {getStatusLabel(orderData.status)}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(orderData.date)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {orderData && orderData.status !== 'cancelled' && (
          <Link
            href={`/admin/tracking?id=${orderData.orderNumber}`}
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
      ) : orderData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column - Customer and Shipping Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.customerInfo}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.name}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{orderData.customer.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.email}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{orderData.customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.phone}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{orderData.customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.shippingInfo}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.origin}</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-gray-900 dark:text-white">{orderData.pickup.address}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-7 mt-1">
                    {t.pickupDate}: {formatDateTime(orderData.pickup.date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.destination}</p>
                  <div className="flex items-start mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-gray-900 dark:text-white">{orderData.delivery.address}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-7 mt-1">
                    {t.deliveryDate}: {formatDateTime(orderData.delivery.date)}
                  </p>
                </div>
                
                {orderData.status === 'in-transit' && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentLocation}</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="font-medium text-gray-900 dark:text-white">{orderData.currentLocation}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-7 mt-1">
                      {t.lastUpdate}: {formatDateTime(orderData.locationUpdatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.orderItems}
              </h2>
              
              {orderData.items && orderData.items.length > 0 ? (
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
                          {t.temperature}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t.notes}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {orderData.items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
                              {item.temperature}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {item.notes || '-'}
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
          
          {/* Second column - Vehicle and Notes */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.vehicleInfo}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicleName}</p>
                  <p className="font-medium flex items-center text-gray-900 dark:text-white">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    {orderData.vehicle.name} ({orderData.vehicle.id})
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentTemperature}</p>
                  <p className="font-medium flex items-center text-blue-600 dark:text-blue-400">
                    <Thermometer className="h-5 w-5 mr-2" />
                    {orderData.vehicle.currentTemperature}°C
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {orderData.vehicle.driver.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {orderData.vehicle.driver.phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.additionalNotes}
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {orderData.notes || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}