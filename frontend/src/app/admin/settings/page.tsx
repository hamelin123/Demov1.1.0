'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Save, Settings, Globe, Moon, Bell, Shield, 
  User, Server, AlertTriangle, CheckCircle, Monitor, 
  Smartphone, Database
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [settings, setSettings] = useState({
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

  const t = translations[language] || translations.en;

  const handleChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
    
    // ถ้าเป็นการเปลี่ยนภาษา ให้เปลี่ยนภาษาของแอปด้วย
    if (category === 'general' && setting === 'language') {
      setLanguage(value);
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
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.general}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.language}
              </label>
              <select
                value={settings.general.language}
                onChange={(e) => handleChange('general', 'language', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="th">{t.thai}</option>
                <option value="en">{t.english}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.theme}
              </label>
              <select
                value={settings.general.theme}
                onChange={(e) => handleChange('general', 'theme', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">{t.light}</option>
                <option value="dark">{t.dark}</option>
                <option value="system">{t.system}</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.general.notifications}
                onChange={(e) => handleChange('general', 'notifications', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.enableNotifications}
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.autoLogout}
              </label>
              <input
                type="number"
                value={settings.general.autoLogout}
                onChange={(e) => handleChange('general', 'autoLogout', parseInt(e.target.value))}
                min="1"
                max="120"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.system_settings}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="temperatureUnitCelsius"
                checked={settings.system.temperatureUnitCelsius}
                onChange={(e) => handleChange('system', 'temperatureUnitCelsius', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="temperatureUnitCelsius" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.celsius}
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.temperatureAlertThreshold}
              </label>
              <input
                type="number"
                value={settings.system.temperatureAlertThreshold}
                onChange={(e) => handleChange('system', 'temperatureAlertThreshold', parseFloat(e.target.value))}
                step="0.1"
                min="0.1"
                max="10"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.dataRetention}
              </label>
              <input
                type="number"
                value={settings.system.dataRetentionDays}
                onChange={(e) => handleChange('system', 'dataRetentionDays', parseInt(e.target.value))}
                min="1"
                max="365"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.maintenanceReminder}
              </label>
              <input
                type="number"
                value={settings.system.maintenanceReminderDays}
                onChange={(e) => handleChange('system', 'maintenanceReminderDays', parseInt(e.target.value))}
                min="1"
                max="30"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* API Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.api_settings}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.apiEndpoint}
              </label>
              <input
                type="text"
                value={settings.api.apiEndpoint}
                onChange={(e) => handleChange('api', 'apiEndpoint', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.refreshInterval}
              </label>
              <input
                type="number"
                value={settings.api.refreshInterval}
                onChange={(e) => handleChange('api', 'refreshInterval', parseInt(e.target.value))}
                min="1"
                max="60"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableWebhooks"
                checked={settings.api.enableWebhooks}
                onChange={(e) => handleChange('api', 'enableWebhooks', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableWebhooks" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.enableWebhooks}
              </label>
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.security}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.passwordExpiry}
              </label>
              <input
                type="number"
                value={settings.security.passwordExpiryDays}
                onChange={(e) => handleChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
                min="0"
                max="365"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.sessionTimeout}
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                min="1"
                max="120"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mfaRequired"
                checked={settings.security.mfaRequired}
                onChange={(e) => handleChange('security', 'mfaRequired', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mfaRequired" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.mfaRequired}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ipRestriction"
                checked={settings.security.ipRestriction}
                onChange={(e) => handleChange('security', 'ipRestriction', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.ipRestriction}
              </label>
            </div>
          </div>
        </div>
        
        {/* Client Platform Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Monitor className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.web}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {language === 'th' ? 
                  'การตั้งค่าแอปพลิเคชันเว็บสามารถปรับแต่งได้ในอนาคต' : 
                  'Web application settings will be customizable in the future.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Smartphone className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.mobile}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {language === 'th' ? 
                  'การตั้งค่าแอปพลิเคชันมือถือสามารถปรับแต่งได้ในอนาคต' : 
                  'Mobile application settings will be customizable in the future.'}
              </p>
            </div>
          </div>
        </div>
        
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