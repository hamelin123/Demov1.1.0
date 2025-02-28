'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Printer, Truck, Package, ThermometerSnowflake, 
  MapPin, Clock, ChevronDown, ChevronUp, Users, AlertTriangle, FileText 
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { getOrderById } from '@/lib/api';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [openSections, setOpenSections] = useState({
    customer: true,
    package: true,
    tracking: true,
    temperature: true
  });

  const { id } = params;

  // Translations
  const translations = {
    th: {
      orderDetails: 'รายละเอียดคำสั่งซื้อ',
      backToOrders: 'กลับไปยังคำสั่งซื้อ',
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      editOrder: 'แก้ไขคำสั่งซื้อ',
      printOrder: 'พิมพ์',
      orderCreated: 'สร้างเมื่อ',
      status: 'สถานะ',
      orderTotal: 'ยอดรวม',
      estimatedDelivery: 'กำหนดส่ง',
      customerInfo: 'ข้อมูลลูกค้า',
      senderInfo: 'ข้อมูลผู้ส่ง',
      name: 'ชื่อ',
      address: 'ที่อยู่',
      phone: 'เบอร์โทร',
      email: 'อีเมล',
      recipientInfo: 'ข้อมูลผู้รับ',
      packageInfo: 'ข้อมูลพัสดุ',
      weight: 'น้ำหนัก',
      dimensions: 'ขนาด',
      specialInstructions: 'คำแนะนำพิเศษ',
      temperatureInfo: 'ข้อมูลอุณหภูมิ',
      requiredTemperature: 'อุณหภูมิที่กำหนด',
      currentTemperature: 'อุณหภูมิปัจจุบัน',
      highestRecorded: 'อุณหภูมิสูงสุดที่บันทึกได้',
      lowestRecorded: 'อุณหภูมิต่ำสุดที่บันทึกได้',
      temperatureEvents: 'ประวัติอุณหภูมิ',
      trackingInfo: 'ข้อมูลการติดตาม',
      trackingEvents: 'ประวัติการติดตาม',
      notAvailable: 'ไม่มีข้อมูล',
      viewTemperatureLog: 'ดูบันทึกอุณหภูมิทั้งหมด',
      timestamp: 'เวลา',
      location: 'ตำแหน่ง',
      notes: 'หมายเหตุ',
      noTrackingInfo: 'ไม่มีข้อมูลการติดตาม',
      noTemperatureInfo: 'ไม่มีข้อมูลอุณหภูมิ',
      time: 'เวลา',
      temperature: 'อุณหภูมิ',
      warning: 'คำเตือน',
      warningMessage: 'อุณหภูมินอกเกณฑ์ที่กำหนด',
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      inTransit: 'กำลังจัดส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิก',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      humidity: 'ความชื้น'
    },
    en: {
      orderDetails: 'Order Details',
      backToOrders: 'Back to Orders',
      loading: 'Loading...',
      error: 'Error loading order data',
      editOrder: 'Edit Order',
      printOrder: 'Print',
      orderCreated: 'Created',
      status: 'Status',
      orderTotal: 'Total',
      estimatedDelivery: 'Est. Delivery',
      customerInfo: 'Customer Information',
      senderInfo: 'Sender Information',
      name: 'Name',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      recipientInfo: 'Recipient Information',
      packageInfo: 'Package Information',
      weight: 'Weight',
      dimensions: 'Dimensions',
      specialInstructions: 'Special Instructions',
      temperatureInfo: 'Temperature Information',
      requiredTemperature: 'Required Temperature',
      currentTemperature: 'Current Temperature',
      highestRecorded: 'Highest Recorded',
      lowestRecorded: 'Lowest Recorded',
      temperatureEvents: 'Temperature History',
      trackingInfo: 'Tracking Information',
      trackingEvents: 'Tracking Events',
      notAvailable: 'Not Available',
      viewTemperatureLog: 'View Full Temperature Log',
      timestamp: 'Timestamp',
      location: 'Location',
      notes: 'Notes',
      noTrackingInfo: 'No tracking information available',
      noTemperatureInfo: 'No temperature information available',
      time: 'Time',
      temperature: 'Temperature',
      warning: 'Warning',
      warningMessage: 'Temperature outside of specified range',
      pending: 'Pending',
      processing: 'Processing',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      orderNumber: 'Order Number',
      humidity: 'Humidity'
    }
  };

  const t = translations[language] || translations.en;

  // โหลดข้อมูลคำสั่งซื้อ
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // ในสถานการณ์จริง
        // const data = await getOrderById(id);
        
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockOrder = {
          id: id,
          order_number: 'CC-20250227-1001',
          status: 'in-transit',
          created_at: '27 ก.พ. 2025',
          total_amount: '฿32,500',
          estimated_delivery_date: '1 มี.ค. 2025',
          customer: {
            name: 'บริษัท ฟาร์มาซี จำกัด',
            email: 'contact@pharmacy.example.com'
          },
          sender: {
            name: 'บริษัท ฟาร์มาซี จำกัด',
            address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
            phone: '02-123-4567',
            email: 'contact@pharmacy.example.com'
          },
          recipient: {
            name: 'โรงพยาบาลศิริราช',
            address: '2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพฯ 10700',
            phone: '02-987-6543',
            email: 'supply@siriraj.example.com'
          },
          package: {
            weight: '15.5 kg',
            dimensions: '30 x 40 x 20 cm',
            special_instructions: 'ควบคุมอุณหภูมิที่ -18°C ตลอดเวลา ระวังการกระแทก'
          },
          temperature: {
            required: '-18°C',
            current: '-18.2°C',
            highest: '-17.9°C',
            lowest: '-18.5°C',
            has_warning: false,
            logs: [
              { timestamp: '28 ก.พ. 2025 10:00', temperature: '-18.2°C', humidity: '65%' },
              { timestamp: '28 ก.พ. 2025 08:00', temperature: '-18.3°C', humidity: '64%' },
              { timestamp: '28 ก.พ. 2025 06:00', temperature: '-18.1°C', humidity: '65%' },
              { timestamp: '28 ก.พ. 2025 04:00', temperature: '-18.0°C', humidity: '66%' },
              { timestamp: '28 ก.พ. 2025 02:00', temperature: '-18.2°C', humidity: '65%' }
            ]
          },
          tracking: [
            { timestamp: '28 ก.พ. 2025 10:00', location: 'ศูนย์กระจายสินค้านครราชสีมา', status: 'in-transit', notes: 'พัสดุอยู่ระหว่างการขนส่ง' },
            { timestamp: '28 ก.พ. 2025 06:00', location: 'ศูนย์กระจายสินค้าสระบุรี', status: 'in-transit', notes: 'พัสดุถึงศูนย์กระจายสินค้า' },
            { timestamp: '27 ก.พ. 2025 22:00', location: 'ศูนย์กระจายสินค้ากรุงเทพฯ', status: 'processing', notes: 'พัสดุอยู่ระหว่างการขนส่ง' },
            { timestamp: '27 ก.พ. 2025 18:00', location: 'คลังสินค้ากรุงเทพฯ', status: 'processing', notes: 'พัสดุถูกจัดเตรียมเพื่อขนส่ง' },
            { timestamp: '27 ก.พ. 2025 14:00', location: 'คลังสินค้ากรุงเทพฯ', status: 'pending', notes: 'รับพัสดุเข้าระบบ' }
          ]
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, t]);

  // ฟังก์ชันสลับการแสดงเนื้อหาในส่วนต่างๆ
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ฟังก์ชันแสดงสถานะเป็นข้อความ
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t.pending;
      case 'processing': return t.processing;
      case 'in-transit': return t.inTransit;
      case 'delivered': return t.delivered;
      case 'cancelled': return t.cancelled;
      default: return status;
    }
  };
  
  // ฟังก์ชันกำหนดสีตามสถานะ
  const getStatusColors = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // แสดงหน้าโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <span className="ml-2 text-gray-500 dark:text-gray-400">{t.loading}</span>
      </div>
    );
  }

  // แสดงหน้าข้อผิดพลาด
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-300" />
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <div className="mt-4">
              <Link
                href="/admin/orders"
                className="rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                {t.backToOrders}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center">
          <Link
            href="/admin/orders"
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.orderDetails}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.orderNumber}: {order.order_number}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/admin/orders/${id}/edit`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-600"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t.editOrder}
          </Link>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            {t.printOrder}
          </button>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Created Date */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.orderCreated}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{order.created_at}</div>
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.status}</div>
              <div className="mt-1">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColors(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Total */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.orderTotal}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{order.total_amount}</div>
            </div>
          </div>
        </div>
        
        {/* Estimated Delivery */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.estimatedDelivery}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{order.estimated_delivery_date}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Information */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
          onClick={() => toggleSection('customer')}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            <Users className="mr-2 inline h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.customerInfo}
          </h2>
          <div>
            {openSections.customer ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
        
        {openSections.customer && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Sender Information */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{t.senderInfo}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.name}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.sender.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.address}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.sender.address}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.sender.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.sender.email}</div>
                  </div>
                </div>
              </div>
              
              {/* Recipient Information */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{t.recipientInfo}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.name}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.recipient.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.address}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.recipient.address}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.recipient.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</div>
                    <div className="text-sm text-gray-900 dark:text-white">{order.recipient.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Package Information */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
          onClick={() => toggleSection('package')}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            <Package className="mr-2 inline h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.packageInfo}
          </h2>
          <div>
            {openSections.package ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
        
        {openSections.package && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.weight}</div>
                <div className="text-sm text-gray-900 dark:text-white">{order.package.weight}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.dimensions}</div>
                <div className="text-sm text-gray-900 dark:text-white">{order.package.dimensions}</div>
              </div>
              <div className="md:col-span-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.specialInstructions}</div>
                <div className="text-sm text-gray-900 dark:text-white">{order.package.special_instructions || t.notAvailable}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Temperature Information */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
          onClick={() => toggleSection('temperature')}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            <ThermometerSnowflake className="mr-2 inline h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.temperatureInfo}
          </h2>
          <div>
            {openSections.temperature ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
        
        {openSections.temperature && (
          <div className="p-6">
            {order.temperature ? (
              <>
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.requiredTemperature}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.temperature.required}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.currentTemperature}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.temperature.current}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.lowestRecorded}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.temperature.lowest}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.highestRecorded}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.temperature.highest}</div>
                  </div>
                </div>
                
                {order.temperature.has_warning && (
                  <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-300" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{t.warning}</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>{t.warningMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{t.temperatureEvents}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.time}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.temperature}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.humidity}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {order.temperature.logs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {log.timestamp}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {log.temperature}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {log.humidity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-right">
                  <Link
                    href={`/admin/temperature/orders/${id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {t.viewTemperatureLog}
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                {t.noTemperatureInfo}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tracking Information */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div
          className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700"
          onClick={() => toggleSection('tracking')}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            <Truck className="mr-2 inline h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.trackingInfo}
          </h2>
          <div>
            {openSections.tracking ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
        
        {openSections.tracking && (
          <div className="p-6">
            {order.tracking && order.tracking.length > 0 ? (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{t.trackingEvents}</h3>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div 
                    className="absolute h-full left-6 border-l border-gray-300 dark:border-gray-700"
                  ></div>
                  
                  {/* Timeline events */}
                  <div className="space-y-8 relative">
                    {order.tracking.map((event, index) => (
                      <div key={index} className="ml-12 relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <div className={`w-2 h-2 rounded-full ${
                            event.status === 'pending' 
                              ? 'bg-yellow-500'
                              : event.status === 'processing'
                              ? 'bg-purple-500'
                              : event.status === 'in-transit'
                              ? 'bg-blue-500'
                              : event.status === 'delivered'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}></div>
                        </div>
                        
                        {/* Event content */}
                        <div className="mb-4">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white">{getStatusText(event.status)}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</span>
                          </div>
                          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                            <MapPin size={16} className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                          {event.notes && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                {t.noTrackingInfo}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}