'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Save, Settings, Globe, Moon, Bell, Shield, 
  User, Server, AlertTriangle, CheckCircle, Monitor, 
  Smartphone, Database
} from 'lucide-react';

// กำหนด type สำหรับ Language
type Language = 'en' | 'th';

// กำหนด type สำหรับ settings object
type SettingsType = {
  general: {
    language: Language;
    theme: string;
    notifications: boolean;
    autoLogout: number;
  };
  system: {
    temperatureUnitCelsius: boolean;
    temperatureAlertThreshold: number;
    dataRetentionDays: number;
    maintenanceReminderDays: number;
  };
  api: {
    apiEndpoint: string;
    refreshInterval: number;
    enableWebhooks: boolean;
  };
  security: {
    passwordExpiryDays: number;
    mfaRequired: boolean;
    sessionTimeout: number;
    ipRestriction: boolean;
  };
}

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language, setLanguage } = useLanguage() as { language: Language; setLanguage: (lang: Language) => void };
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SettingsType>({
    general: {
      language: language || 'th',
      theme: 'system',
      notifications: true,
      autoLogout: 30
    },
    system: {
      temperatureUnitCelsius: true,
      temperatureAlertThreshold: 2,
      dataRetentionDays: 90,
      maintenanceReminderDays: 7
    },
    api: {
      apiEndpoint: 'https://api.coldchain.example.com',
      refreshInterval: 5,
      enableWebhooks: false
    },
    security: {
      passwordExpiryDays: 90,
      mfaRequired: false,
      sessionTimeout: 30,
      ipRestriction: false
    }
  });

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบสิทธิ์
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
  }, [isLoading, isAuthenticated, user]);

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
    th: {
      settings: 'ตั้งค่า',
      general: 'ทั่วไป',
      language: 'ภาษา',
      thai: 'ไทย',
      english: 'อังกฤษ',
      theme: 'ธีม',
      dark: 'มืด',
      light: 'สว่าง',
      system: 'ระบบ',
      notifications: 'การแจ้งเตือน',
      enableNotifications: 'เปิดใช้งานการแจ้งเตือน',
      autoLogout: 'ออกจากระบบอัตโนมัติ (นาที)',
      system_settings: 'ตั้งค่าระบบ',
      temperatureUnit: 'หน่วยอุณหภูมิ',
      celsius: 'เซลเซียส (°C)',
      fahrenheit: 'ฟาเรนไฮต์ (°F)',
      temperatureAlertThreshold: 'เกณฑ์การแจ้งเตือนอุณหภูมิ (°C)',
      dataRetention: 'การเก็บข้อมูล (วัน)',
      maintenanceReminder: 'การแจ้งเตือนการซ่อมบำรุง (วัน)',
      api_settings: 'ตั้งค่า API',
      apiEndpoint: 'จุดเชื่อมต่อ API',
      refreshInterval: 'ระยะเวลารีเฟรช (นาที)',
      enableWebhooks: 'เปิดใช้งาน Webhooks',
      security: 'ความปลอดภัย',
      passwordExpiry: 'อายุรหัสผ่าน (วัน)',
      mfaRequired: 'จำเป็นต้องยืนยันตัวตนหลายขั้นตอน (MFA)',
      sessionTimeout: 'หมดเวลาเซสชัน (นาที)',
      ipRestriction: 'เปิดใช้งานการจำกัด IP',
      saveChanges: 'บันทึกการเปลี่ยนแปลง',
      saving: 'กำลังบันทึก...',
      saveSuccess: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
      saveError: 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า',
      web: "เว็บ",
      mobile: "มือถือ",
      database: "ฐานข้อมูล"
    },
    en: {
      settings: 'Settings',
      general: 'General',
      language: 'Language',
      thai: 'Thai',
      english: 'English',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      system: 'System',
      notifications: 'Notifications',
      enableNotifications: 'Enable Notifications',
      autoLogout: 'Auto Logout (minutes)',
      system_settings: 'System Settings',
      temperatureUnit: 'Temperature Unit',
      celsius: 'Celsius (°C)',
      fahrenheit: 'Fahrenheit (°F)',
      temperatureAlertThreshold: 'Temperature Alert Threshold (°C)',
      dataRetention: 'Data Retention (days)',
      maintenanceReminder: 'Maintenance Reminder (days)',
      api_settings: 'API Settings',
      apiEndpoint: 'API Endpoint',
      refreshInterval: 'Refresh Interval (minutes)',
      enableWebhooks: 'Enable Webhooks',
      security: 'Security',
      passwordExpiry: 'Password Expiry (days)',
      mfaRequired: 'Multi-Factor Authentication Required',
      sessionTimeout: 'Session Timeout (minutes)',
      ipRestriction: 'Enable IP Restriction',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      saveSuccess: 'Settings saved successfully',
      saveError: 'Error saving settings',
      web: "Web",
      mobile: "Mobile",
      database: "Database"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleChange = (category: keyof SettingsType, setting: string, value: string | boolean | number) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
    
    // ถ้าเป็นการเปลี่ยนภาษา ให้เปลี่ยนภาษาของแอปด้วย
    if (category === 'general' && setting === 'language' && (value === 'en' || value === 'th')) {
      setLanguage(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      console.log('Saving settings:', settings);
      
      // แสดงข้อความสำเร็จ
      setSuccess(true);
      setSaving(false);
      
      // ซ่อนข้อความสำเร็จหลังจาก 3 วินาที
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(t.saveError);
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Settings className="mr-2 h-6 w-6" />
          {t.settings}
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
            <p className="text-green-700 dark:text-green-300">{t.saveSuccess}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ส่วนอื่นๆ ของฟอร์มยังคงเหมือนเดิม */}
        
        {/* Submit Button */}
        <div className="flex justify-end">
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
                {t.saveChanges}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}