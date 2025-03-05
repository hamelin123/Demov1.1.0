'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Truck, MapPin, Calendar, Thermometer, Package, User, Phone,
  AlertTriangle, CheckCircle, Clock, Battery
} from 'lucide-react';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isLoading && isAuthenticated && currentUser?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    // จำลองการดึงข้อมูลจาก API
    const fetchVehicleDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // สร้าง mock data สำหรับทุก ID
        const vehicleId = id ? id.toString() : '1';
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const defaultVehicle = { 
          id: vehicleId, 
          registrationNumber: 'บท-1234',
          name: 'Truck XL-01',
          type: 'refrigerated-truck',
          status: 'active',
          temperatureRange: { min: -20, max: -18 },
          currentTemperature: -19.2,
          batteryLevel: 92,
          lastMaintenanceDate: '2025-01-15',
          nextMaintenanceDate: '2025-04-15',
          driverName: 'สมชาย มั่นคง',
          driverPhone: '081-234-5678',
          currentLocation: {
            latitude: 13.756,
            longitude: 100.501,
            address: 'กรุงเทพมหานคร'
          },
          lastUpdated: '2025-03-01T14:20:00.000Z',
          specifications: {
            brand: 'Isuzu',
            model: 'NPR 400',
            year: '2022',
            refrigerationUnit: 'Thermo King V-800 MAX',
            cargoCapacity: '5000 kg',
            fuelType: 'Diesel',
            dimensions: '6.5m x 2.3m x 2.8m'
          },
          maintenanceHistory: [
            {
              id: 1,
              type: 'Regular Maintenance',
              date: '2025-01-15',
              description: 'Oil change, filter replacement',
              technicianName: 'วิชัย ช่างดี',
              cost: 3500
            },
            {
              id: 2,
              type: 'Refrigeration Unit Service',
              date: '2024-12-10',
              description: 'Refrigeration unit inspection and service',
              technicianName: 'สมศักดิ์ เย็นดี',
              cost: 4500
            }
          ],
          temperatureLog: [
            { timestamp: '2025-03-01T14:20:00.000Z', temperature: -19.2 },
            { timestamp: '2025-03-01T13:20:00.000Z', temperature: -19.0 },
            { timestamp: '2025-03-01T12:20:00.000Z', temperature: -18.7 }
          ]
        };
        
        const mockVehicles = {
          '1': defaultVehicle,
          '2': { 
            id: '2', 
            registrationNumber: 'ฮศ-5678',
            name: 'Truck MD-02',
            type: 'refrigerated-truck',
            status: 'active',
            temperatureRange: { min: 2, max: 8 },
            currentTemperature: 4.8,
            batteryLevel: 78,
            lastMaintenanceDate: '2025-02-10',
            nextMaintenanceDate: '2025-05-10',
            driverName: 'วิภา สุขใจ',
            driverPhone: '089-876-5432',
            currentLocation: {
              latitude: 18.784,
              longitude: 98.993,
              address: 'เชียงใหม่'
            },
            lastUpdated: '2025-03-01T13:45:00.000Z',
            specifications: {
              brand: 'Hino',
              model: '300 Series',
              year: '2023',
              refrigerationUnit: 'Carrier Transicold Supra 750',
              cargoCapacity: '3000 kg',
              fuelType: 'Diesel',
              dimensions: '5.8m x 2.2m x 2.5m'
            },
            maintenanceHistory: [
              {
                id: 1,
                type: 'Regular Maintenance',
                date: '2025-02-10',
                description: 'Oil change, filter replacement, brake check',
                technicianName: 'วิชัย ช่างดี',
                cost: 3200
              }
            ],
            temperatureLog: [
              { timestamp: '2025-03-01T13:45:00.000Z', temperature: 4.8 },
              { timestamp: '2025-03-01T12:45:00.000Z', temperature: 5.0 },
              { timestamp: '2025-03-01T11:45:00.000Z', temperature: 4.9 }
            ]
          }
        };
        
        // ใช้ default vehicle ถ้าไม่พบ ID ที่ต้องการ
        const vehicleData = mockVehicles[vehicleId] || defaultVehicle;
        setVehicle(vehicleData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        setError('Failed to load vehicle information');
        setLoading(false);
      }
    };
    
    if (mounted && !isLoading) {
      fetchVehicleDetails();
    }
  }, [mounted, id, router, isAuthenticated, isLoading, currentUser, language]);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Vehicle Details',
      vehicleInfo: 'Vehicle Information',
      registrationNumber: 'Registration Number',
      name: 'Vehicle Name',
      type: 'Vehicle Type',
      status: 'Status',
      temperatureRange: 'Temperature Range',
      currentTemperature: 'Current Temperature',
      batteryLevel: 'Battery Level',
      maintenanceDates: 'Maintenance Dates',
      lastMaintenance: 'Last Maintenance',
      nextMaintenance: 'Next Maintenance',
      driver: 'Driver',
      phone: 'Phone',
      currentLocation: 'Current Location',
      lastUpdated: 'Last Updated',
      specifications: 'Specifications',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      refrigerationUnit: 'Refrigeration Unit',
      cargoCapacity: 'Cargo Capacity',
      fuelType: 'Fuel Type',
      dimensions: 'Dimensions',
      maintenanceHistory: 'Maintenance History',
      temperatureLog: 'Temperature Log',
      datetime: 'Date & Time',
      temperature: 'Temperature',
      date: 'Date',
      type: 'Type',
      description: 'Description',
      technician: 'Technician',
      cost: 'Cost',
      backToVehicles: 'Back to Vehicles',
      editVehicle: 'Edit Vehicle',
      active: 'Active',
      maintenance: 'In Maintenance',
      inactive: 'Inactive',
      refrigeratedTruck: 'Refrigerated Truck',
      refrigeratedVan: 'Refrigerated Van',
      errorTitle: 'Error',
      vehicleNotFound: 'Vehicle not found'
    },
    th: {
      title: 'รายละเอียดยานพาหนะ',
      vehicleInfo: 'ข้อมูลยานพาหนะ',
      registrationNumber: 'ทะเบียนรถ',
      name: 'ชื่อยานพาหนะ',
      type: 'ประเภทยานพาหนะ',
      status: 'สถานะ',
      temperatureRange: 'ช่วงอุณหภูมิ',
      currentTemperature: 'อุณหภูมิปัจจุบัน',
      batteryLevel: 'ระดับแบตเตอรี่',
      maintenanceDates: 'วันที่ซ่อมบำรุง',
      lastMaintenance: 'ซ่อมบำรุงครั้งล่าสุด',
      nextMaintenance: 'ซ่อมบำรุงครั้งถัดไป',
      driver: 'คนขับ',
      phone: 'โทรศัพท์',
      currentLocation: 'ตำแหน่งปัจจุบัน',
      lastUpdated: 'อัปเดตล่าสุด',
      specifications: 'ข้อมูลจำเพาะ',
      brand: 'ยี่ห้อ',
      model: 'รุ่น',
      year: 'ปี',
      refrigerationUnit: 'หน่วยทำความเย็น',
      cargoCapacity: 'ความจุบรรทุก',
      fuelType: 'ประเภทเชื้อเพลิง',
      dimensions: 'ขนาด',
      maintenanceHistory: 'ประวัติการซ่อมบำรุง',
      temperatureLog: 'บันทึกอุณหภูมิ',
      datetime: 'วันที่และเวลา',
      temperature: 'อุณหภูมิ',
      date: 'วันที่',
      type: 'ประเภท',
      description: 'รายละเอียด',
      technician: 'ช่างเทคนิค',
      cost: 'ค่าใช้จ่าย',
      backToVehicles: 'กลับไปยังรายการยานพาหนะ',
      editVehicle: 'แก้ไขยานพาหนะ',
      active: 'ใช้งานอยู่',
      maintenance: 'กำลังซ่อมบำรุง',
      inactive: 'ไม่ได้ใช้งาน',
      refrigeratedTruck: 'รถบรรทุกห้องเย็น',
      refrigeratedVan: 'รถตู้ห้องเย็น',
      errorTitle: 'ข้อผิดพลาด',
      vehicleNotFound: 'ไม่พบข้อมูลยานพาหนะ'
    }
  };

  const t = translations[language] || translations.en;

  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active':
        return t.active;
      case 'maintenance':
        return t.maintenance;
      case 'inactive':
        return t.inactive;
      default:
        return status;
    }
  };

  const getVehicleTypeLabel = (type) => {
    switch(type) {
      case 'refrigerated-truck':
        return t.refrigeratedTruck;
      case 'refrigerated-van':
        return t.refrigeratedVan;
      default:
        return type;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  // ถ้ามีข้อผิดพลาด
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <h2 className="text-lg font-medium text-red-800 dark:text-red-300">{t.errorTitle}</h2>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToVehicles}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/vehicles" 
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            {vehicle && (
              <div className="mt-1 flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(vehicle.status)}`}>
                  {getStatusLabel(vehicle.status)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">{vehicle.registrationNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          {vehicle && (
            <Link
              href={`/admin/vehicles/${vehicle.id}/edit`}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t.editVehicle}
            </Link>
          )}
        </div>
      </div>
      
      {vehicle ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column - Vehicle Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.vehicleInfo}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.name}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.registrationNumber}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.registrationNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.type}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{getVehicleTypeLabel(vehicle.type)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperatureRange}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {vehicle.temperatureRange.min}°C to {vehicle.temperatureRange.max}°C
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentTemperature}</p>
                  <div className="flex items-center">
                    <Thermometer 
                      className={`mr-1 h-5 w-5 ${
                        vehicle.currentTemperature <= vehicle.temperatureRange.max && 
                        vehicle.currentTemperature >= vehicle.temperatureRange.min
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`} 
                    />
                    <span className={`font-medium ${
                      vehicle.currentTemperature <= vehicle.temperatureRange.max && 
                      vehicle.currentTemperature >= vehicle.temperatureRange.min
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {vehicle.currentTemperature}°C
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.batteryLevel}</p>
                  <div className="flex items-center">
                    <Battery 
                      className={`mr-1 h-5 w-5 ${
                        vehicle.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'
                      }`} 
                    />
                    <span className={`font-medium ${
                      vehicle.batteryLevel > 20 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {vehicle.batteryLevel}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.lastMaintenance}</p>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(vehicle.lastMaintenanceDate)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.nextMaintenance}</p>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(vehicle.nextMaintenanceDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Driver and Location */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.driver}</p>
                  <div className="flex items-center mt-1">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{vehicle.driverName}</p>
                  </div>
                  <div className="flex items-center mt-1 ml-7">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-600 dark:text-gray-400">{vehicle.driverPhone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentLocation}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-900 dark:text-white">{vehicle.currentLocation.address}</p>
                  </div>
                  <div className="flex items-center mt-1 ml-7">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.lastUpdated}: {formatDateTime(vehicle.lastUpdated)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Maintenance History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.maintenanceHistory}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.date}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.type}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.description}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.technician}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.cost}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {vehicle.maintenanceHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(record.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{record.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.technicianName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">{formatCurrency(record.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Second column - Specifications and Temp Log */}
          <div className="space-y-6">
            {/* Specifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.specifications}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.brand}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.brand}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.model}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.model}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.year}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.year}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.refrigerationUnit}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.refrigerationUnit}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.cargoCapacity}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.cargoCapacity}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.fuelType}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.fuelType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.dimensions}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.specifications.dimensions}</p>
                </div>
              </div>
            </div>
            
            {/* Temperature Log */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.temperatureLog}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.datetime}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.temperature}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {vehicle.temperatureLog.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDateTime(log.timestamp)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                          <span className={`font-medium ${
                            (log.temperature <= vehicle.temperatureRange.max && log.temperature >= vehicle.temperatureRange.min)
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {log.temperature}°C
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg inline-block mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
              {t.vehicleNotFound}
            </h2>
          </div>
          <div>
            <Link
              href="/admin/vehicles"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t.backToVehicles}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}