'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, AlertTriangle, CheckCircle, Save, Thermometer,
  MapPin, Calendar, Clock
} from 'lucide-react';

// กำหนด interface สำหรับข้อมูล alert
interface AlertType {
  id: string;
  orderNumber: string;
  timestamp: string;
  temperature: number;
  expectedRange: { min: number; max: number };
  location: string;
  status: string;
  severity: string;
  description: string;
  vehicle: {
    id: string;
    name: string;
    registrationNumber: string;
  };
  customer: {
    name: string;
  };
  product: {
    name: string;
    temperatureRequirement: string;
  };
  notes: string;
}

// กำหนด interface สำหรับ formData
interface FormDataType {
  status: string;
  severity: string;
  description: string;
  notes: string;
  resolutionNote: string;
}

export default function EditTemperatureAlertPage() {
  const params = useParams();
  const alertId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    status: '',
    severity: '',
    description: '',
    notes: '',
    resolutionNote: ''
  });

  useEffect(() => {
    setMounted(true);
    
    // จำลองการดึงข้อมูลจาก API
    const fetchAlertDetails = async () => {
      try {
        // จำลองความล่าช้าของเครือข่าย
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const mockAlerts: Record<string, AlertType> = {
          '1': { 
            id: '1', 
            orderNumber: 'CC-20250301-1234', 
            timestamp: '2025-03-01T14:20:00.000Z',
            temperature: -16.5,
            expectedRange: { min: -20, max: -18 },
            location: 'Bangkok Warehouse',
            status: 'pending',
            severity: 'high',
            description: 'Temperature above acceptable range',
            vehicle: {
              id: 'XL-01',
              name: 'รถบรรทุกห้องเย็น XL-01',
              registrationNumber: 'บท-1234'
            },
            customer: {
              name: 'บริษัท อาหารไทย จำกัด'
            },
            product: {
              name: 'Frozen Food',
              temperatureRequirement: '-20°C to -18°C'
            },
            notes: ''
          },
          '2': { 
            id: '2', 
            orderNumber: 'CC-20250228-9876', 
            timestamp: '2025-02-28T08:45:00.000Z',
            temperature: 7.3,
            expectedRange: { min: 2, max: 6 },
            location: 'Chiang Mai Distribution Center',
            status: 'pending',
            severity: 'high',
            description: 'Temperature above acceptable range',
            vehicle: {
              id: 'MD-02',
              name: 'รถบรรทุกห้องเย็น MD-02',
              registrationNumber: 'ฮศ-5678'
            },
            customer: {
              name: 'ห้างหุ้นส่วนจำกัด สดใหม่'
            },
            product: {
              name: 'Pharmaceutical Products',
              temperatureRequirement: '2°C to 6°C'
            },
            notes: 'Urgent attention required'
          },
          '3': { 
            id: '3', 
            orderNumber: 'CC-20250227-5432', 
            timestamp: '2025-02-27T16:30:00.000Z',
            temperature: 1.8,
            expectedRange: { min: 2, max: 6 },
            location: 'Phuket Checkpoint',
            status: 'pending',
            severity: 'medium',
            description: 'Temperature below acceptable range',
            vehicle: {
              id: 'SM-03',
              name: 'รถตู้ห้องเย็น SM-03',
              registrationNumber: 'กว-9012'
            },
            customer: {
              name: 'บริษัท ซีฟู้ด เอ็กซ์พอร์ต จำกัด'
            },
            product: {
              name: 'Seafood',
              temperatureRequirement: '2°C to 6°C'
            },
            notes: ''
          }
        };
        
        const alertData = mockAlerts[alertId];
        
        if (!alertData) {
          setError('Alert not found');
          setLoading(false);
          return;
        }
        
        setAlert(alertData);
        setFormData({
          status: alertData.status,
          severity: alertData.severity,
          description: alertData.description,
          notes: alertData.notes || '',
          resolutionNote: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching alert details:', error);
        setError('Failed to load alert information');
        setLoading(false);
      }
    };
    
    if (mounted) {
      fetchAlertDetails();
    }
  }, [mounted, alertId]);

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
      title: 'Edit Temperature Alert',
      orderNumber: 'Order Number',
      timestamp: 'Alert Time',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      location: 'Location',
      status: 'Status',
      severity: 'Severity',
      description: 'Description',
      notes: 'Notes',
      resolutionNote: 'Resolution Note',
      resolutionNotePlaceholder: 'Enter details about how this alert was resolved...',
      backToAlerts: 'Back to Alerts',
      backToDetails: 'Back to Alert Details',
      saveChanges: 'Save Changes',
      resolveAlert: 'Resolve Alert',
      pending: 'Pending',
      resolved: 'Resolved',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      error: 'Error',
      alertNotFound: 'Alert not found',
      saveSuccess: 'Alert updated successfully',
      saving: 'Saving...',
      notesPlaceholder: 'Enter any additional notes...',
      descriptionPlaceholder: 'Enter alert description...',
      vehicle: 'Vehicle',
      product: 'Product',
      customer: 'Customer'
    },
    th: {
      title: 'แก้ไขการแจ้งเตือนอุณหภูมิ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      timestamp: 'เวลาที่แจ้งเตือน',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      location: 'สถานที่',
      status: 'สถานะ',
      severity: 'ความรุนแรง',
      description: 'รายละเอียด',
      notes: 'หมายเหตุ',
      resolutionNote: 'บันทึกการแก้ไข',
      resolutionNotePlaceholder: 'กรอกรายละเอียดเกี่ยวกับวิธีการแก้ไขการแจ้งเตือนนี้...',
      backToAlerts: 'กลับไปยังการแจ้งเตือน',
      backToDetails: 'กลับไปยังรายละเอียดการแจ้งเตือน',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      resolveAlert: 'แก้ไขการแจ้งเตือน',
      pending: 'รอดำเนินการ',
      resolved: 'แก้ไขแล้ว',
      high: 'สูง',
      medium: 'ปานกลาง',
      low: 'ต่ำ',
      error: 'ข้อผิดพลาด',
      alertNotFound: 'ไม่พบข้อมูลการแจ้งเตือน',
      saveSuccess: 'อัปเดตการแจ้งเตือนเรียบร้อยแล้ว',
      saving: 'กำลังบันทึก...',
      notesPlaceholder: 'กรอกหมายเหตุเพิ่มเติม...',
      descriptionPlaceholder: 'กรอกรายละเอียดการแจ้งเตือน...',
      vehicle: 'ยานพาหนะ',
      product: 'สินค้า',
      customer: 'ลูกค้า'
    }
  };

  type LanguageType = 'en' | 'th';
  const t = translations[language as LanguageType] || translations.en;

  const getStatusLabel = (status: string): string => {
    switch(status) {
      case 'pending':
        return t.pending;
      case 'resolved':
        return t.resolved;
      default:
        return status;
    }
  };

  const getSeverityLabel = (severity: string): string => {
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

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving alert with data:', formData);
      
      // แสดงข้อความสำเร็จ
      setSuccess(t.saveSuccess);
      setSaving(false);
      
      // รอสักครู่แล้วกลับไปหน้ารายละเอียดการแจ้งเตือน
      setTimeout(() => {
        router.push(`/admin/temperature/alerts/${alertId}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving alert:', error);
      setError('Failed to save alert changes');
      setSaving(false);
    }
  };
  
  // เพิ่มฟังก์ชันเพื่อจัดการการแก้ไขแล้ว
  const handleResolve = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!formData.resolutionNote) {
      setError(language === 'th' ? 'กรุณากรอกบันทึกการแก้ไข' : 'Resolution note is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resolveData = {
        ...formData,
        status: 'resolved',
        resolvedBy: user?.full_name || user?.email || 'Admin',
        resolvedAt: new Date().toISOString()
      };
      
      console.log('Resolving alert with data:', resolveData);
      
      // แสดงข้อความสำเร็จ
      setSuccess(language === 'th' ? 'แก้ไขการแจ้งเตือนเรียบร้อยแล้ว' : 'Alert resolved successfully');
      setSaving(false);
      
      // รอสักครู่แล้วกลับไปหน้ารายการการแจ้งเตือน
      setTimeout(() => {
        router.push('/admin/temperature/alerts');
      }, 2000);
    } catch (error) {
      console.error('Error resolving alert:', error);
      setError(language === 'th' ? 'ไม่สามารถแก้ไขการแจ้งเตือนได้' : 'Failed to resolve alert');
      setSaving(false);
    }
  };

  // ถ้ามีข้อผิดพลาด
  if (error && !alert) {
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
          href="/admin/temperature/alerts"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToAlerts}
        </Link>
      </div>
    );
  }

  // ถ้าไม่พบข้อมูลการแจ้งเตือน
  if (!loading && !alert) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">{t.alertNotFound}</h2>
          </div>
        </div>
        <Link
          href="/admin/temperature/alerts"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.backToAlerts}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Link
          href={`/admin/temperature/alerts/${alertId}`} 
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          {alert && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t.orderNumber}: {alert.orderNumber}
            </p>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : alert ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.title}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.timestamp}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 dark:text-white">{formatDateTime(alert.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 dark:text-white">{alert.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
                    <div className="flex items-center mt-1">
                      <Thermometer 
                        className={`h-5 w-5 mr-2 ${
                          alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`} 
                      />
                      <p className={`${
                        alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {alert.temperature}°C
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.expectedRange}</p>
                    <div className="flex items-center mt-1">
                      <Thermometer className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 dark:text-white">
                        {alert.expectedRange.min}°C to {alert.expectedRange.max}°C
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.status}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="pending">{t.pending}</option>
                    <option value="resolved">{t.resolved}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.severity}
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="high">{t.high}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="low">{t.low}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.description}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t.descriptionPlaceholder}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.notes}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t.notesPlaceholder}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Resolution Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t.resolveAlert}
              </h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <label htmlFor="resolutionNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.resolutionNote}
                  </label>
                  <textarea
                    id="resolutionNote"
                    name="resolutionNote"
                    rows={5}
                    value={formData.resolutionNote}
                    onChange={handleChange}
                    placeholder={t.resolutionNotePlaceholder}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.vehicle}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.vehicle.name} ({alert.vehicle.registrationNumber})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.customer}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.customer.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.product}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.product.name} ({alert.product.temperatureRequirement})
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3 justify-end">
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={saving || !formData.resolutionNote}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? t.saving : t.resolveAlert}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <Link
              href={`/admin/temperature/alerts/${alertId}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t.backToDetails}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.saving}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {t.saveChanges}
                </span>
              )}
            </button>
          </div>
        </form>
              ) : null}
              </div>
            );
          }