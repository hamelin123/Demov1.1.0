'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Search, Filter, RefreshCw, Plus, Edit, Trash, 
  ChevronDown, Truck, Thermometer, Battery, MapPin, 
  AlertCircle, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';
import Link from 'next/link';

export default function VehiclesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchVehicles = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลอง
        const mockVehicles = [
          { 
            id: '1', 
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
            lastUpdated: '2025-03-01T14:20:00.000Z'
          },
          { 
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
            lastUpdated: '2025-03-01T13:45:00.000Z'
          },
          { 
            id: '3', 
            registrationNumber: 'กว-9012',
            name: 'Van SM-03',
            type: 'refrigerated-van',
            status: 'maintenance',
            temperatureRange: { min: 2, max: 6 },
            currentTemperature: null,
            batteryLevel: 100,
            lastMaintenanceDate: '2025-02-28',
            nextMaintenanceDate: '2025-05-28',
            driverName: 'ประสิทธิ์ เก่งกล้า',
            driverPhone: '062-345-6789',
            currentLocation: {
              latitude: 13.727,
              longitude: 100.527,
              address: 'ศูนย์ซ่อมบำรุงกรุงเทพฯ'
            },
            lastUpdated: '2025-02-28T09:30:00.000Z'
          },
          { 
            id: '4', 
            registrationNumber: 'นส-3456',
            name: 'Truck LG-04',
            type: 'refrigerated-truck',
            status: 'inactive',
            temperatureRange: { min: -25, max: -20 },
            currentTemperature: null,
            batteryLevel: 0,
            lastMaintenanceDate: '2025-01-20',
            nextMaintenanceDate: '2025-04-20',
            driverName: 'not assigned',
            driverPhone: '',
            currentLocation: {
              latitude: 16.429,
              longitude: 102.835,
              address: 'ขอนแก่น'
            },
            lastUpdated: '2025-02-20T10:15:00.000Z'
          },
          { 
            id: '5', 
            registrationNumber: 'พม-7890',
            name: 'Van SM-05',
            type: 'refrigerated-van',
            status: 'active',
            temperatureRange: { min: 0, max: 4 },
            currentTemperature: 3.2,
            batteryLevel: 85,
            lastMaintenanceDate: '2025-02-05',
            nextMaintenanceDate: '2025-05-05',
            driverName: 'นภา ใจดี',
            driverPhone: '083-456-7890',
            currentLocation: {
              latitude: 7.884,
              longitude: 98.398,
              address: 'ภูเก็ต'
            },
            lastUpdated: '2025-03-01T12:30:00.000Z'
          },
        ];
        
        setVehicles(mockVehicles);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: mockVehicles.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  // ถ้าไม่ใช่ admin
  if (user?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const confirmDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    // ในโปรดักชัน จะเรียก API เพื่อลบยานพาหนะ
    setVehicles(prevVehicles => 
      prevVehicles.filter(vehicle => vehicle.id !== vehicleToDelete.id)
    );
    setShowDeleteModal(false);
  };

  const refreshData = () => {
    setLoading(true);
    // จำลองการรีเฟรชข้อมูล
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // กรองข้อมูลตามเงื่อนไขการค้นหา
  let filteredVehicles = vehicles;

  // กรองตามคำค้นหา
  if (searchQuery) {
    filteredVehicles = filteredVehicles.filter(vehicle => 
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // กรองตามสถานะ
  if (statusFilter !== 'all') {
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === statusFilter);
  }

  // กรองตามประเภท
  if (typeFilter !== 'all') {
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === typeFilter);
  }

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Vehicles Management',
      description: 'Manage your temperature-controlled vehicles fleet',
      search: 'Search by registration number or name',
      status: 'Status',
      type: 'Vehicle Type',
      allVehicles: 'All Vehicles',
      active: 'Active',
      maintenance: 'In Maintenance',
      inactive: 'Inactive',
      allTypes: 'All Types',
      truck: 'Refrigerated Truck',
      van: 'Refrigerated Van',
      refresh: 'Refresh',
      addVehicle: 'Add Vehicle',
      registrationNumber: 'Registration',
      name: 'Vehicle Name',
      currentTemp: 'Current Temp',
      driver: 'Driver',
      location: 'Location',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View Details',
      track: 'Track',
      noVehicles: 'No vehicles found',
      showingResults: 'Showing {start}-{end} of {total} vehicles',
      deleteVehicle: 'Delete Vehicle',
      deleteConfirmation: 'Are you sure you want to delete this vehicle? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      previous: 'Previous',
      next: 'Next',
      notAvailable: 'N/A',
      maintenanceRequired: 'Maintenance Required',
      maintenanceDue: 'Maintenance due on',
      batteryLow: 'Battery Low',
      temperatureAlert: 'Temperature Alert'
    },
    th: {
      title: 'จัดการยานพาหนะ',
      description: 'จัดการกองยานพาหนะควบคุมอุณหภูมิของคุณ',
      search: 'ค้นหาด้วยทะเบียนหรือชื่อ',
      status: 'สถานะ',
      type: 'ประเภทยานพาหนะ',
      allVehicles: 'ยานพาหนะทั้งหมด',
      active: 'ใช้งานอยู่',
      maintenance: 'กำลังซ่อมบำรุง',
      inactive: 'ไม่ได้ใช้งาน',
      allTypes: 'ทุกประเภท',
      truck: 'รถบรรทุกห้องเย็น',
      van: 'รถตู้ห้องเย็น',
      refresh: 'รีเฟรช',
      addVehicle: 'เพิ่มยานพาหนะ',
      registrationNumber: 'ทะเบียน',
      name: 'ชื่อยานพาหนะ',
      currentTemp: 'อุณหภูมิปัจจุบัน',
      driver: 'คนขับ',
      location: 'ตำแหน่งปัจจุบัน',
      lastUpdated: 'อัปเดตล่าสุด',
      actions: 'การกระทำ',
      edit: 'แก้ไข',
      delete: 'ลบ',
      view: 'ดูรายละเอียด',
      track: 'ติดตาม',
      noVehicles: 'ไม่พบยานพาหนะ',
      showingResults: 'แสดง {start}-{end} จาก {total} รายการ',
      deleteVehicle: 'ลบยานพาหนะ',
      deleteConfirmation: 'คุณแน่ใจหรือไม่ว่าต้องการลบยานพาหนะนี้? การกระทำนี้ไม่สามารถยกเลิกได้',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
      notAvailable: 'ไม่มีข้อมูล',
      maintenanceRequired: 'ต้องการการซ่อมบำรุง',
      maintenanceDue: 'กำหนดซ่อมบำรุงวันที่',
      batteryLow: 'แบตเตอรี่ต่ำ',
      temperatureAlert: 'เตือนอุณหภูมิ'
    }
  };

  const t = translations[language] || translations.en;

  const formatDate = (dateString) => {
    if (!dateString) return t.notAvailable;
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'maintenance':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'inactive':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status) => {
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

  const getVehicleTypeText = (type) => {
    switch(type) {
      case 'refrigerated-truck':
        return t.truck;
      case 'refrigerated-van':
        return t.van;
      default:
        return type;
    }
  };

  const getVehicleAlerts = (vehicle) => {
    const alerts = [];
    
    // Check for maintenance due
    if (vehicle.nextMaintenanceDate) {
      const today = new Date();
      const maintenanceDate = new Date(vehicle.nextMaintenanceDate);
      const diffTime = maintenanceDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7 && diffDays > 0) {
        alerts.push({
          type: 'maintenance',
          message: `${t.maintenanceDue} ${vehicle.nextMaintenanceDate}`
        });
      }
    }
    
    // Check for battery level
    if (vehicle.batteryLevel !== null && vehicle.batteryLevel <= 20 && vehicle.status === 'active') {
      alerts.push({
        type: 'battery',
        message: `${t.batteryLow} (${vehicle.batteryLevel}%)`
      });
    }
    
    // Check for temperature out of range
    if (vehicle.currentTemperature !== null && vehicle.temperatureRange && vehicle.status === 'active') {
      if (vehicle.currentTemperature > vehicle.temperatureRange.max || 
          vehicle.currentTemperature < vehicle.temperatureRange.min) {
        alerts.push({
          type: 'temperature',
          message: `${t.temperatureAlert} (${vehicle.currentTemperature}°C)`
        });
      }
    }
    
    return alerts;
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
      
      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
            >
              <option value="all">{t.allVehicles}</option>
              <option value="active">{t.active}</option>
              <option value="maintenance">{t.maintenance}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </div>
          
          {/* Type Filter */}
          <div className="relative">
            <Truck className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
            >
              <option value="all">{t.allTypes}</option>
              <option value="refrigerated-truck">{t.truck}</option>
              <option value="refrigerated-van">{t.van}</option>
            </select>
          </div>
          
          {/* Empty space for layout */}
          <div></div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={refreshData}
            className="px-4 py-2 flex items-center text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RefreshCw size={16} className="mr-2" />
            {t.refresh}
          </button>
          <Link
            href="/admin/vehicles/add"
            className="px-4 py-2 flex items-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            {t.addVehicle}
          </Link>
        </div>
      </div>
      
      {/* Vehicles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t.noVehicles}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.registrationNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.name}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.currentTemp}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.driver}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.location}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.lastUpdated}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{getVehicleTypeText(vehicle.type)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                        {getStatusText(vehicle.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.currentTemperature !== null ? (
                        <div className="flex items-center">
                          <Thermometer 
                            size={16} 
                            className={`mr-1 ${
                              vehicle.temperatureRange && (
                                vehicle.currentTemperature > vehicle.temperatureRange.max || 
                                vehicle.currentTemperature < vehicle.temperatureRange.min
                              )
                                ? 'text-red-500'
                                : 'text-green-500'
                            }`} 
                          />
                          <span className={`font-medium ${
                            vehicle.temperatureRange && (
                              vehicle.currentTemperature > vehicle.temperatureRange.max || 
                              vehicle.currentTemperature < vehicle.temperatureRange.min
                            )
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {vehicle.currentTemperature}°C
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.notAvailable}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.driverName && vehicle.driverName !== 'not assigned' ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{vehicle.driverName}</div>
                          {vehicle.driverPhone && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{vehicle.driverPhone}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.notAvailable}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.currentLocation ? (
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{vehicle.currentLocation.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{t.notAvailable}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(vehicle.lastUpdated)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/vehicles/${vehicle.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {t.view}
                        </Link>
                        <Link 
                          href={`/admin/vehicles/${vehicle.id}/edit`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          {t.edit}
                        </Link>
                        <button
                          onClick={() => confirmDelete(vehicle)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          {t.delete}
                        </button>
                      </div>
                      
                      {/* Vehicle Alerts */}
                      {getVehicleAlerts(vehicle).length > 0 && (
                        <div className="mt-2 flex flex-col items-end space-y-1">
                          {getVehicleAlerts(vehicle).map((alert, index) => (
                            <div key={index} className="flex items-center">
                              {alert.type === 'maintenance' && (
                                <AlertTriangle size={14} className="text-orange-500 mr-1" />
                              )}
                              {alert.type === 'battery' && (
                                <Battery size={14} className="text-red-500 mr-1" />
                              )}
                              {alert.type === 'temperature' && (
                                <AlertCircle size={14} className="text-red-500 mr-1" />
                              )}
                              <span className="text-xs text-red-600 dark:text-red-400">{alert.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t.showingResults
                .replace('{start}', ((pagination.currentPage - 1) * 10) + 1)
                .replace('{end}', Math.min(pagination.currentPage * 10, filteredVehicles.length))
                .replace('{total}', filteredVehicles.length)
              }
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50"
              >
                {t.previous}
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50"
              >
                {t.next}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t.deleteVehicle}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.deleteConfirmation}
                      </p>
                      {vehicleToDelete && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {vehicleToDelete.name} ({vehicleToDelete.registrationNumber})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  {t.confirm}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}