'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Printer, Package, ThermometerSnowflake, 
  MapPin, Clock, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { orderService } from '@/services/api';

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
  const t = {
    en: {
      orderDetails: 'Order Details',
      back: 'Back to Orders',
      loading: 'Loading...',
      error: 'Error loading order data',
      edit: 'Edit Order',
      print: 'Print',
      created: 'Created',
      status: 'Status',
      orderTotal: 'Total',
      estDelivery: 'Est. Delivery',
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
      instructions: 'Special Instructions',
      tempInfo: 'Temperature Information',
      reqTemp: 'Required Temperature',
      currTemp: 'Current Temperature',
      highestTemp: 'Highest Recorded',
      lowestTemp: 'Lowest Recorded',
      tempEvents: 'Temperature History',
      trackingInfo: 'Tracking Information',
      events: 'Tracking Events',
      na: 'Not Available',
      viewTempLog: 'View Full Temperature Log',
      timestamp: 'Timestamp',
      location: 'Location',
      notes: 'Notes',
      noTracking: 'No tracking information available',
      noTemp: 'No temperature information available',
      time: 'Time',
      temperature: 'Temperature',
      warning: 'Warning',
      warningMsg: 'Temperature outside of specified range',
      statusTypes: {
        pending: 'Pending',
        processing: 'Processing',
        inTransit: 'In Transit',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    },
    th: {
      orderDetails: 'รายละเอียดคำสั่งซื้อ',
      back: 'กลับไปยังคำสั่งซื้อ',
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      edit: 'แก้ไขคำสั่งซื้อ',
      print: 'พิมพ์',
      created: 'สร้างเมื่อ',
      status: 'สถานะ',
      orderTotal: 'ยอดรวม',
      estDelivery: 'กำหนดส่ง',
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
      instructions: 'คำแนะนำพิเศษ',
      tempInfo: 'ข้อมูลอุณหภูมิ',
      reqTemp: 'อุณหภูมิที่กำหนด',
      currTemp: 'อุณหภูมิปัจจุบัน',
      highestTemp: 'อุณหภูมิสูงสุดที่บันทึกได้',
      lowestTemp: 'อุณหภูมิต่ำสุดที่บันทึกได้',
      tempEvents: 'ประวัติอุณหภูมิ',
      trackingInfo: 'ข้อมูลการติดตาม',
      events: 'ประวัติการติดตาม',
      na: 'ไม่มีข้อมูล',
      viewTempLog: 'ดูบันทึกอุณหภูมิทั้งหมด',
      timestamp: 'เวลา',
      location: 'ตำแหน่ง',
      notes: 'หมายเหตุ',
      noTracking: 'ไม่มีข้อมูลการติดตาม',
      noTemp: 'ไม่มีข้อมูลอุณหภูมิ',
      time: 'เวลา',
      temperature: 'อุณหภูมิ',
      warning: 'คำเตือน',
      warningMsg: 'อุณหภูมินอกเกณฑ์ที่กำหนด',
      statusTypes: {
        pending: 'รอดำเนินการ',
        processing: 'กำลังดำเนินการ',
        inTransit: 'กำลังจัดส่ง',
        delivered: 'จัดส่งแล้ว',
        cancelled: 'ยกเลิก'
      }
    }
  }[language];

  // โหลดข้อมูลคำสั่งซื้อ
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockOrder = {
          id,
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
            logs: Array(5).fill(null).map((_, i) => ({
              timestamp: new Date(Date.now() - i * 7200000).toLocaleString(), 
              temperature: (-18 - Math.random() * 0.5).toFixed(1) + '°C',
              humidity: (64 + Math.random() * 3).toFixed(0) + '%'
            }))
          },
          tracking: Array(5).fill(null).map((_, i) => ({
            timestamp: new Date(Date.now() - i * 14400000).toLocaleString(),
            location: ['นครราชสีมา', 'สระบุรี', 'กรุงเทพฯ (ศูนย์กระจายสินค้า)', 
                      'กรุงเทพฯ (คลังสินค้า)', 'คลังสินค้ากรุงเทพฯ'][i],
            status: i === 0 ? 'in-transit' : i < 3 ? 'processing' : 'pending', 
            notes: i === 0 ? 'พัสดุอยู่ระหว่างการขนส่ง' : i === 1 ? 'พัสดุถึงศูนย์กระจายสินค้า' : 
                   i === 2 ? 'พัสดุอยู่ระหว่างการขนส่ง' : i === 3 ? 'พัสดุถูกจัดเตรียมเพื่อขนส่ง' : 'รับพัสดุเข้าระบบ'
          }))
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, t]);

  // ฟังก์ชันสลับการแสดงเนื้อหาในส่วนต่างๆ
  const toggleSection = (section) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}));
  };

  // ฟังก์ชันแสดงสถานะเป็นข้อความ
  const getStatusText = (status) => t.statusTypes[status] || status;
  
  // ฟังก์ชันกำหนดสีตามสถานะ
  const getStatusColors = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
          <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <div className="mt-4">
              <Link
                href="/admin/orders"
                className="rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                {t.back}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Edit className="mr-2 h-4 w-4" />{t.edit}
          </Link>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Printer className="mr-2 h-4 w-4" />{t.print}
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Created Date */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.created}</span>
              <p className="font-medium text-gray-900 dark:text-white">{order.created_at}</p>
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.status}</span>
              <p>
                <span className={`inline-flex rounded-full px-2 text-xs font-medium leading-5 ${getStatusColors(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Total Amount */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.orderTotal}</span>
              <p className="font-medium text-gray-900 dark:text-white">{order.total_amount}</p>
            </div>
          </div>
        </div>
        
        {/* Est. Delivery */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.estDelivery}</span>
              <p className="font-medium text-gray-900 dark:text-white">{order.estimated_delivery_date}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information Sections */}
      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <div 
            className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50"
            onClick={() => toggleSection('customer')}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.customerInfo}</h3>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              {openSections.customer ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
          
          {openSections.customer && (
            <div className="divide-y divide-gray-200 px-4 py-5 dark:divide-gray-700 sm:p-6">
              {/* Sender Information */}
              <div className="mb-6 pb-6">
                <h4 className="mb-4 text-base font-medium text-gray-900 dark:text-white">{t.senderInfo}</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.name}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.sender.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.sender.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.sender.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.address}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.sender.address}</p>
                  </div>
                </div>
              </div>
              
              {/* Recipient Information */}
              <div className="pt-6">
                <h4 className="mb-4 text-base font-medium text-gray-900 dark:text-white">{t.recipientInfo}</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.name}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.recipient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.email}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.recipient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.phone}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.recipient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.address}</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.recipient.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Package Information Section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <div 
            className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50"
            onClick={() => toggleSection('package')}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.packageInfo}</h3>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              {openSections.package ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
          
          {openSections.package && (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.weight}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.package.weight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.dimensions}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.package.dimensions}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.instructions}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.package.special_instructions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Temperature Information Section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <div 
            className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50"
            onClick={() => toggleSection('temperature')}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.tempInfo}</h3>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              {openSections.temperature ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
          
          {openSections.temperature && (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.reqTemp}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.temperature.required}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.currTemp}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.temperature.current}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.highestTemp}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.temperature.highest}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.lowestTemp}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.temperature.lowest}</p>
                </div>
              </div>
              
              {order.temperature.has_warning && (
                <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{t.warning}</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                        <p>{t.warningMsg}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Temperature History */}
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t.tempEvents}</h4>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.time}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t.temperature}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Humidity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {order.temperature.logs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {log.timestamp}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {log.temperature}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {log.humidity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-right">
                  <Link
                    href={`/admin/temperature/logs/${id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t.viewTempLog}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Tracking Information Section */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <div 
            className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50"
            onClick={() => toggleSection('tracking')}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.trackingInfo}</h3>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              {openSections.tracking ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
          
          {openSections.tracking && (
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-medium text-gray-900 dark:text-white">{t.events}</h4>
              
              {order.tracking.length > 0 ? (
                <div className="relative mt-6 pb-6">
                  {/* Timeline */}
                  <div className="absolute bottom-0 left-5 top-0 border-l-2 border-gray-200 dark:border-gray-600"></div>
                  
                  {/* Timeline Events */}
                  <div className="mb-8 space-y-8">
                    {order.tracking.map((event, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className="absolute -left-1 mt-1.5 h-6 w-6 rounded-full border-2 border-white bg-gray-300 dark:border-gray-800 dark:bg-gray-600"></div>
                        
                        {/* Event Content */}
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                          <div className="flex flex-wrap justify-between">
                            <div className="mb-2">
                              <span className={`inline-flex rounded-full px-2 text-xs font-medium leading-5 ${getStatusColors(event.status)}`}>
                                {getStatusText(event.status)}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {event.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-start space-x-1">
                              <MapPin className="mt-0.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span>{event.location}</span>
                            </div>
                            {event.notes && (
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.noTracking}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}