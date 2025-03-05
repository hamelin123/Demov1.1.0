'use client';

import React from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function TemperatureLogsPage() {
  const { language } = useLanguage();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Temperature Logs' : 'บันทึกอุณหภูมิ'}
      </h1>
      <p>
        {language === 'en' 
          ? 'Temperature logs monitoring page - Coming soon' 
          : 'หน้าติดตามบันทึกอุณหภูมิ - เร็วๆ นี้'}
      </p>
    </div>
  );
}