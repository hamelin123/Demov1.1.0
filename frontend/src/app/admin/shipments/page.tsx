// frontend/src/app/admin/shipments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { Search, Filter, RefreshCw, Truck, MapPin, Calendar, Package, ChevronDown } from 'lucide-react';

// เพิ่ม type definition สำหรับข้อมูล shipment
type ShipmentItem = {
  id: string;
  orderNumber: string;
  status: string;
  origin: string;
  destination: string;
  customerName: string;
  departureDate: string;
  arrivalDate: string;
  temperature: string;
  vehicle: string;
};

export default function ShipmentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [shipments, setShipments] = useState<ShipmentItem[]>([]); // กำหนด type ให้ state
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchShipments = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลอง
        const mockShipments: ShipmentItem[] = [
          { 
            id: '1', 
            orderNumber: 'CC-20250301-1234',
            status: 'pending',
            origin: 'กรุงเทพมหานคร',
            destination: 'เชียงใหม่',
            customerName: 'บริษัท อาหารไทย จำกัด',
            departureDate: '2025-03-05',
            arrivalDate: '2025-03-07',
            temperature: '-18°C',
            vehicle: 'รถบรรทุกห้องเย็น XL-01'
          },
          { 
            id: '2', 
            orderNumber: 'CC-20250301-1235',
            status: 'in-transit',
            origin: 'กรุงเทพมหานคร',
            destination: 'ขอนแก่น',
            customerName: 'ห้างหุ้นส่วนจำกัด สดใหม่',
            departureDate: '2025-03-03',
            arrivalDate: '2025-03-04',
            temperature: '4°C',
            vehicle: 'รถตู้ห้องเย็น SM-05'
          },
          { 
            id: '3', 
            orderNumber: 'CC-20250228-1233',
            status: 'delivered',
            origin: 'ระยอง',
            destination: 'กรุงเทพมหานคร',
            customerName: 'บริษัท ซีฟู้ด เอ็กซ์พอร์ต จำกัด',
            departureDate: '2025-02-28',
            arrivalDate: '2025-02-28',
            temperature: '2°C',
            vehicle: 'รถบรรทุกห้องเย็น MD-02'
          }
        ];
        
        setShipments(mockShipments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shipments:', error);
        setLoading(false);
      }
    };
    
    fetchShipments();
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
      title: 'Shipments',
      description: 'Manage all shipments and transportation',
      orderNumber: 'Order #',
      status: 'Status',
      origin: 'Origin',
      destination: 'Destination',
      customer: 'Customer',
      departsOn: 'Departs On',
      arrivesOn: 'Arrives On',
      temperature: 'Temperature',
      vehicle: 'Vehicle',
      actions: 'Actions',
      pending: 'Pending',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      view: 'View Details',
      track: 'Track',
      noShipments: 'No shipments found'
    },
    th: {
      title: 'การขนส่ง',
      description: 'จัดการการขนส่งและการเดินทางทั้งหมด',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      status: 'สถานะ',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      customer: 'ลูกค้า',
      departsOn: 'วันที่ออกเดินทาง',
      arrivesOn: 'วันที่ถึง',
      temperature: 'อุณหภูมิ',
      vehicle: 'ยานพาหนะ',
      actions: 'การกระทำ',
      pending: 'รอดำเนินการ',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      view: 'ดูรายละเอียด',
      track: 'ติดตาม',
      noShipments: 'ไม่พบการขนส่ง'
    }
  };

  // กำหนด type ให้ไม่มี error
  type TranslationLanguage = 'en' | 'th';
  const t = translations[language as TranslationLanguage] || translations.en;

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
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
      default:
        return status;
    }
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
      
      {/* Shipments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t.noShipments}
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
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.origin} / {t.destination}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.customer}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.departsOn} / {t.arrivesOn}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.temperature}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {shipment.orderNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(shipment.status)}`}>
                        {getStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <MapPin className="h-4 w-4 inline-block mr-1 text-gray-400" />
                        {shipment.origin}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 inline-block mr-1" />
                        {shipment.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{shipment.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <Calendar className="h-4 w-4 inline-block mr-1 text-gray-400" />
                        {new Date(shipment.departureDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 inline-block mr-1" />
                        {new Date(shipment.arrivalDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {shipment.temperature}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/shipments/${shipment.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {t.view}
                        </Link>
                        <Link 
                          href={`/admin/tracking/${shipment.orderNumber}`}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          {t.track}
                        </Link>
                      </div>
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