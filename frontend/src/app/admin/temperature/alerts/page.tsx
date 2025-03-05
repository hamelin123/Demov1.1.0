'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Filter, RefreshCw, Download, ArrowDownToLine, ThermometerSnowflake, Calendar, CheckCircle, Search } from 'lucide-react';

export default function TemperatureAlertsPage() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchAlerts = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลอง
        const mockAlerts = [
          { 
            id: '1', 
            orderNumber: 'CC-20250301-1234', 
            timestamp: '2025-03-01T14:20:00.000Z',
            temperature: -16.5,
            expectedRange: { min: -20, max: -18 },
            location: 'Bangkok Warehouse',
            status: 'pending',
            severity: 'high',
            description: 'Temperature above acceptable range'
          },
          { 
            id: '2', 
            orderNumber: 'CC-20250228-9876', 
            timestamp: '2025-02-28T08:45:00.000Z',
            temperature: 7.3,
            expectedRange: { min: 2, max: 6 },
            location: 'Chiang Mai Distribution Center',
            status: 'pending',
            severity: 'high',
            description: 'Temperature above acceptable range'
          },
          { 
            id: '3', 
            orderNumber: 'CC-20250227-5432', 
            timestamp: '2025-02-27T16:30:00.000Z',
            temperature: 1.8,
            expectedRange: { min: 2, max: 6 },
            location: 'Phuket Checkpoint',
            status: 'pending',
            severity: 'medium',
            description: 'Temperature below acceptable range'
          },
          { 
            id: '4', 
            orderNumber: 'CC-20250226-4321', 
            timestamp: '2025-02-26T10:15:00.000Z',
            temperature: -21.2,
            expectedRange: { min: -20, max: -18 },
            location: 'Korat Distribution Hub',
            status: 'resolved',
            severity: 'medium',
            description: 'Temperature below acceptable range',
            resolvedBy: 'Somchai J.',
            resolvedAt: '2025-02-26T11:30:00.000Z',
            resolutionNote: 'Adjusted refrigeration unit settings and verified temperature stabilization'
          },
          { 
            id: '5', 
            orderNumber: 'CC-20250225-7654', 
            timestamp: '2025-02-25T13:40:00.000Z',
            temperature: 6.8,
            expectedRange: { min: 2, max: 6 },
            location: 'Khon Kaen Checkpoint',
            status: 'resolved',
            severity: 'low',
            description: 'Temperature slightly above acceptable range',
            resolvedBy: 'Wanida S.',
            resolvedAt: '2025-02-25T14:20:00.000Z',
            resolutionNote: 'Adjusted AC in transport vehicle and monitored temperature return to normal range'
          },
        ];
        
        setAlerts(mockAlerts);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: mockAlerts.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching temperature alerts:', error);
        setLoading(false);
      }
    };
    
    fetchAlerts();
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleResolveAlert = (alertId) => {
    // ในโปรดักชัน จะเรียก API เพื่อแก้ไขสถานะการแจ้งเตือน
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: 'resolved',
              resolvedBy: `${user?.name || user?.full_name || user?.email}`,
              resolvedAt: new Date().toISOString()
            } 
          : alert
      )
    );
  };

  const refreshData = () => {
    setLoading(true);
    // จำลองการรีเฟรชข้อมูล
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // จำลองการส่งออกข้อมูล
    alert(language === 'en' ? 'Exporting data...' : 'กำลังส่งออกข้อมูล...');
  };

  // กรองข้อมูลตามเงื่อนไขการค้นหา
  let filteredAlerts = alerts;

  // กรองตามคำค้นหา
  if (searchQuery) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // กรองตามสถานะ
  if (statusFilter !== 'all') {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === statusFilter);
  }

  // กรองตามช่วงวันที่
  if (dateRange.start) {
    filteredAlerts = filteredAlerts.filter(alert => 
      new Date(alert.timestamp) >= new Date(dateRange.start)
    );
  }
  
  if (dateRange.end) {
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Set to end of day
    filteredAlerts = filteredAlerts.filter(alert => 
      new Date(alert.timestamp) <= endDate
    );
  }

  // คำแปลภาษา
  const translations = {
    en: {
      title: 'Temperature Alerts',
      description: 'Monitor and manage temperature alerts across all shipments',
      search: 'Search by tracking or location',
      status: 'Status',
      allAlerts: 'All Alerts',
      pending: 'Pending',
      resolved: 'Resolved',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      refresh: 'Refresh',
      export: 'Export',
      id: 'Alert ID',
      trackingNumber: 'Tracking Number',
      timestamp: 'Time',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      location: 'Location',
      severity: 'Severity',
      description: 'Description',
      actions: 'Actions',
      resolve: 'Resolve',
      view: 'View Details',
      resolvedBy: 'Resolved By',
      resolvedAt: 'Resolved At',
      resolutionNote: 'Resolution Note',
      noAlerts: 'No temperature alerts found',
      showingResults: 'Showing {start}-{end} of {total} alerts',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      previous: 'Previous',
      next: 'Next'
    },
    th: {
      title: 'การแจ้งเตือนอุณหภูมิ',
      description: 'ตรวจสอบและจัดการการแจ้งเตือนอุณหภูมิในการขนส่งทั้งหมด',
      search: 'ค้นหาด้วยหมายเลขพัสดุหรือสถานที่',
      status: 'สถานะ',
      allAlerts: 'การแจ้งเตือนทั้งหมด',
      pending: 'รอดำเนินการ',
      resolved: 'แก้ไขแล้ว',
      dateRange: 'ช่วงวันที่',
      startDate: 'วันที่เริ่มต้น',
      endDate: 'วันที่สิ้นสุด',
      refresh: 'รีเฟรช',
      export: 'ส่งออก',
      id: 'รหัสแจ้งเตือน',
      trackingNumber: 'หมายเลขพัสดุ',
      timestamp: 'เวลา',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      location: 'สถานที่',
      severity: 'ความรุนแรง',
      description: 'รายละเอียด',
      actions: 'การกระทำ',
      resolve: 'แก้ไข',
      view: 'ดูรายละเอียด',
      resolvedBy: 'แก้ไขโดย',
      resolvedAt: 'แก้ไขเมื่อ',
      resolutionNote: 'บันทึกการแก้ไข',
      noAlerts: 'ไม่พบการแจ้งเตือนอุณหภูมิ',
      showingResults: 'แสดง {start}-{end} จาก {total} รายการ',
      high: 'สูง',
      medium: 'ปานกลาง',
      low: 'ต่ำ',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป'
    }
  };

  const t = translations[language] || translations.en;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'low':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getSeverityText = (severity) => {
    switch(severity) {
      case 'high':
        return t.high;
      case 'medium':
        return t.medium;
      case 'low':
        return t.low;
      default:
        return severity;
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
      
      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
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
              <option value="all">{t.allAlerts}</option>
              <option value="pending">{t.pending}</option>
              <option value="resolved">{t.resolved}</option>
            </select>
          </div>
          
          {/* Date Range */}
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.startDate}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.endDate}
              />
            </div>
          </div>
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
          <button
            onClick={exportData}
            className="px-4 py-2 flex items-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ArrowDownToLine size={16} className="mr-2" />
            {t.export}
          </button>
        </div>
      </div>
      
      {/* Alerts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {t.noAlerts}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.trackingNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.timestamp}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.temperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.location}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.severity}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders/${alert.orderNumber}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {alert.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(alert.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ThermometerSnowflake 
                          size={16} 
                          className={`mr-1 ${
                            alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`} 
                        />
                        <span className={`font-medium ${
                          alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {alert.temperature}°C
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({alert.expectedRange.min}°C - {alert.expectedRange.max}°C)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {alert.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                        {getSeverityText(alert.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.status === 'resolved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {alert.status === 'resolved' ? t.resolved : t.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/temperature/alerts/${alert.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {t.view}
                        </Link>
                        {alert.status !== 'resolved' && (
                          <Link
                            href={`/admin/temperature/alerts/${alert.id}/edit`}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          >
                            {language === 'th' ? 'แก้ไข' : 'Edit'}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && filteredAlerts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t.showingResults
                .replace('{start}', ((pagination.currentPage - 1) * 10) + 1)
                .replace('{end}', Math.min(pagination.currentPage * 10, filteredAlerts.length))
                .replace('{total}', filteredAlerts.length)
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
    </div>
  );
}