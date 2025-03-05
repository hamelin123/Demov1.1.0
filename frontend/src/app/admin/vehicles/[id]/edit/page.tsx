'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Save, AlertTriangle, CheckCircle, Truck, User, Phone, MapPin, 
  Calendar, Thermometer, FileText, Settings
} from 'lucide-react';

export default function EditVehiclePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    type: 'refrigerated-truck',
    status: 'active',
    temperatureRange: { min: 0, max: 0 },
    driverName: '',
    driverPhone: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    specifications: {
      brand: '',
      model: '',
      year: '',
      refrigerationUnit: '',
      cargoCapacity: '',
      fuelType: '',
      dimensions: ''
    }
  });

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
          }
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
            }
          }
        };
        
        // ใช้ default vehicle ถ้าไม่พบ ID ที่ต้องการ
        const vehicleData = mockVehicles[vehicleId] || defaultVehicle;
        
        // Set form data with vehicle details
        setFormData({
          name: vehicleData.name,
          registrationNumber: vehicleData.registrationNumber,
          type: vehicleData.type,
          status: vehicleData.status,
          temperatureRange: vehicleData.temperatureRange,
          driverName: vehicleData.driverName,
          driverPhone: vehicleData.driverPhone,
          lastMaintenanceDate: vehicleData.lastMaintenanceDate,
          nextMaintenanceDate: vehicleData.nextMaintenanceDate,
          specifications: {
            brand: vehicleData.specifications.brand,
            model: vehicleData.specifications.model,
            year: vehicleData.specifications.year,
            refrigerationUnit: vehicleData.specifications.refrigerationUnit,
            cargoCapacity: vehicleData.specifications.cargoCapacity,
            fuelType: vehicleData.specifications.fuelType,
            dimensions: vehicleData.specifications.dimensions
          }
        });
        
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

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Edit Vehicle',
      vehicleInfo: 'Vehicle Information',
      vehicleDetails: 'Vehicle Details',
      driverInfo: 'Driver Information',
      maintenanceInfo: 'Maintenance Information',
      specifications: 'Specifications',
      name: 'Vehicle Name',
      registrationNumber: 'Registration Number',
      type: 'Vehicle Type',
      status: 'Status',
      temperatureMin: 'Minimum Temperature (°C)',
      temperatureMax: 'Maximum Temperature (°C)',
      driver: 'Driver Name',
      phone: 'Phone Number',
      lastMaintenance: 'Last Maintenance Date',
      nextMaintenance: 'Next Maintenance Date',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      refrigerationUnit: 'Refrigeration Unit',
      cargoCapacity: 'Cargo Capacity',
      fuelType: 'Fuel Type',
      dimensions: 'Dimensions (LxWxH)',
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      success: 'Vehicle information has been updated successfully',
      error: 'Error updating vehicle information',
      backToVehicles: 'Back to Vehicles',
      backToDetails: 'Back to Vehicle Details',
      active: 'Active',
      maintenance: 'In Maintenance',
      inactive: 'Inactive',
      refrigeratedTruck: 'Refrigerated Truck',
      refrigeratedVan: 'Refrigerated Van',
      errorTitle: 'Error',
      vehicleNotFound: 'Vehicle not found'
    },
    th: {
      title: 'แก้ไขยานพาหนะ',
      vehicleInfo: 'ข้อมูลยานพาหนะ',
      vehicleDetails: 'รายละเอียดยานพาหนะ',
      driverInfo: 'ข้อมูลคนขับ',
      maintenanceInfo: 'ข้อมูลการซ่อมบำรุง',
      specifications: 'ข้อมูลจำเพาะ',
      name: 'ชื่อยานพาหนะ',
      registrationNumber: 'ทะเบียนรถ',
      type: 'ประเภทยานพาหนะ',
      status: 'สถานะ',
      temperatureMin: 'อุณหภูมิต่ำสุด (°C)',
      temperatureMax: 'อุณหภูมิสูงสุด (°C)',
      driver: 'ชื่อคนขับ',
      phone: 'หมายเลขโทรศัพท์',
      lastMaintenance: 'วันที่ซ่อมบำรุงล่าสุด',
      nextMaintenance: 'วันที่ซ่อมบำรุงครั้งถัดไป',
      brand: 'ยี่ห้อ',
      model: 'รุ่น',
      year: 'ปี',
      refrigerationUnit: 'หน่วยทำความเย็น',
      cargoCapacity: 'ความจุบรรทุก',
      fuelType: 'ประเภทเชื้อเพลิง',
      dimensions: 'ขนาด (ยาว×กว้าง×สูง)',
      save: 'บันทึกการเปลี่ยนแปลง',
      saving: 'กำลังบันทึก...',
      cancel: 'ยกเลิก',
      success: 'อัปเดตข้อมูลยานพาหนะเรียบร้อยแล้ว',
      error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
      backToVehicles: 'กลับไปยังรายการยานพาหนะ',
      backToDetails: 'กลับไปยังรายละเอียดยานพาหนะ',
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

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // ตรวจสอบว่าเป็นการอัปเดต specifications หรือไม่
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specField]: value
        }
      });
    } 
    // ตรวจสอบว่าเป็นการอัปเดต temperature range หรือไม่
    else if (name === 'temperatureMin') {
      setFormData({
        ...formData,
        temperatureRange: {
          ...formData.temperatureRange,
          min: parseFloat(value)
        }
      });
    } else if (name === 'temperatureMax') {
      setFormData({
        ...formData,
        temperatureRange: {
          ...formData.temperatureRange,
          max: parseFloat(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      console.log('Saving vehicle data:', formData);
      
      // แสดงข้อความสำเร็จ
      setSuccess(true);
      setSaving(false);
      
      // รอสักครู่แล้วกลับไปหน้ารายละเอียดยานพาหนะ
      setTimeout(() => {
        router.push(`/admin/vehicles/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setError(t.error);
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Link 
          href={`/admin/vehicles/${id}`}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-300">{t.success}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.vehicleDetails}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.registrationNumber}
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.type}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="refrigerated-truck">{t.refrigeratedTruck}</option>
                <option value="refrigerated-van">{t.refrigeratedVan}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.status}
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">{t.active}</option>
                <option value="maintenance">{t.maintenance}</option>
                <option value="inactive">{t.inactive}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="temperatureMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.temperatureMin}
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="number"
                  id="temperatureMin"
                  name="temperatureMin"
                  value={formData.temperatureRange.min}
                  onChange={handleChange}
                  step="0.1"
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="temperatureMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.temperatureMax}
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="number"
                  id="temperatureMax"
                  name="temperatureMax"
                  value={formData.temperatureRange.max}
                  onChange={handleChange}
                  step="0.1"
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Driver Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.driverInfo}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.driver}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="driverPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.phone}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  id="driverPhone"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Maintenance Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.maintenanceInfo}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.lastMaintenance}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  id="lastMaintenanceDate"
                  name="lastMaintenanceDate"
                  value={formData.lastMaintenanceDate}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="nextMaintenanceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.nextMaintenance}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  id="nextMaintenanceDate"
                  name="nextMaintenanceDate"
                  value={formData.nextMaintenanceDate}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.specifications}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.brand}
              </label>
              <input
                type="text"
                id="brand"
                name="specifications.brand"
                value={formData.specifications.brand}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.model}
              </label>
              <input
                type="text"
                id="model"
                name="specifications.model"
                value={formData.specifications.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.year}
              </label>
              <input
                type="text"
                id="year"
                name="specifications.year"
                value={formData.specifications.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
            <label htmlFor="refrigerationUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.refrigerationUnit}
              </label>
              <input
                type="text"
                id="refrigerationUnit"
                name="specifications.refrigerationUnit"
                value={formData.specifications.refrigerationUnit}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="cargoCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cargoCapacity}
              </label>
              <input
                type="text"
                id="cargoCapacity"
                name="specifications.cargoCapacity"
                value={formData.specifications.cargoCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fuelType}
              </label>
              <input
                type="text"
                id="fuelType"
                name="specifications.fuelType"
                value={formData.specifications.fuelType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.dimensions}
              </label>
              <input
                type="text"
                id="dimensions"
                name="specifications.dimensions"
                value={formData.specifications.dimensions}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/admin/vehicles/${id}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t.cancel}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t.save}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}