'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, AlertTriangle, CheckCircle, Save, Thermometer
} from 'lucide-react';

// เพิ่ม interface สำหรับอธิบายโครงสร้างข้อมูล alert
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
}

// กำหนด interface สำหรับ translations
interface Translations {
  title: string;
  backToAlerts: string;
  alertInfo: string;
  location: string;
  timestamp: string;
  temperature: string;
  expectedRange: string;
  resolutionNote: string;
  resolutionNotePlaceholder: string;
  resolveAlert: string;
  saving: string;
  error: string;
  alertNotFound: string;
}

export default function ResolveAlertPage() {
  const params = useParams();
  const alertId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

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
            description: 'Temperature above acceptable range'
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
            description: 'Temperature above acceptable range'
          }
        };
        
        const alertData = mockAlerts[alertId];
        
        if (!alertData) {
          setError('Alert not found');
          setLoading(false);
          return;
        }
        
        setAlert(alertData);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!resolutionNote) {
      setError(language === 'th' ? 'กรุณากรอกบันทึกการแก้ไข' : 'Resolution note is required');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Resolving alert:', {
        id: alertId,
        status: 'resolved',
        resolutionNote,
        resolvedBy: user?.full_name || user?.email || 'Admin',
        resolvedAt: new Date().toISOString()
      });
      
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

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(language === 'en' ? 'en-US' : 'th-TH');
  };

  // กำหนด translations แยกออกมาก่อน
  const translations: Record<string, Translations> = {
    en: {
      title: 'Resolve Temperature Alert',
      backToAlerts: 'Back to Alerts',
      alertInfo: 'Alert Information',
      location: 'Location',
      timestamp: 'Time',
      temperature: 'Temperature',
      expectedRange: 'Expected Range',
      resolutionNote: 'Resolution Note',
      resolutionNotePlaceholder: 'Enter details about how this alert was resolved...',
      resolveAlert: 'Resolve Alert',
      saving: 'Saving...',
      error: 'Error',
      alertNotFound: 'Alert not found'
    },
    th: {
      title: 'แก้ไขการแจ้งเตือนอุณหภูมิ',
      backToAlerts: 'กลับไปยังรายการแจ้งเตือน',
      alertInfo: 'ข้อมูลการแจ้งเตือน',
      location: 'สถานที่',
      timestamp: 'เวลา',
      temperature: 'อุณหภูมิ',
      expectedRange: 'ช่วงที่กำหนด',
      resolutionNote: 'บันทึกการแก้ไข',
      resolutionNotePlaceholder: 'กรอกรายละเอียดเกี่ยวกับวิธีการแก้ไขการแจ้งเตือนนี้...',
      resolveAlert: 'แก้ไขการแจ้งเตือน',
      saving: 'กำลังบันทึก...',
      error: 'ข้อผิดพลาด',
      alertNotFound: 'ไม่พบข้อมูลการแจ้งเตือน'
    }
  };

  // แยกการเลือกใช้ translations ออกมา
  const t = translations[language as 'en' | 'th'] || translations.en;

  if (!mounted || isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

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

  if (!alert) {
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
          href="/admin/temperature/alerts" 
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {alert.orderNumber}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t.alertInfo}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
              <p className="font-medium text-gray-900 dark:text-white">{alert.location}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.timestamp}</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(alert.timestamp)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.temperature}</p>
              <div className="flex items-center">
                <Thermometer 
                  className={`h-5 w-5 mr-2 ${
                    alert.temperature > alert.expectedRange.max || alert.temperature < alert.expectedRange.min
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`} 
                />
                <p className={`font-medium ${
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
              <p className="font-medium text-gray-900 dark:text-white">
                {alert.expectedRange.min}°C to {alert.expectedRange.max}°C
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <label htmlFor="resolutionNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.resolutionNote} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resolutionNote"
              rows={6}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder={t.resolutionNotePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !resolutionNote}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t.resolveAlert}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}