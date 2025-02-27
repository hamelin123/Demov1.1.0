// src/providers/LanguageProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
}

// โหลดไฟล์ภาษา
const translations = {
  en: {
    navigation: {
      services: 'Services',
      tracking: 'Tracking',
      contact: 'Contact',
      login: 'Login'
    },
    hero: {
      title: "Temperature-Controlled Logistics Excellence",
      subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    // เพิ่มคำแปลอื่นๆ ตามที่ต้องการ
  },
  th: {
    navigation: {
      services: 'บริการ',
      tracking: 'ติดตามสินค้า',
      contact: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ'
    },
    hero: {
      title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
      subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
      getStarted: "เริ่มต้นใช้งาน",
      learnMore: "เรียนรู้เพิ่มเติม"
    },
    // เพิ่มคำแปลอื่นๆ ตามที่ต้องการ
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage === 'en' || storedLanguage === 'th') {
        setLanguageState(storedLanguage);
      }
      setMounted(true);
    }
  }, []);

// src/providers/LanguageProvider.tsx
// เพิ่มเติมในฟังก์ชัน setLanguage
const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      // ส่งเหตุการณ์แจ้งเตือนการเปลี่ยนภาษา
      window.dispatchEvent(new Event('languageChange')); // เพิ่มบรรทัดนี้
      console.log('Language changed to:', newLanguage);
    }
  };

  // Function to get translation
  const t = (key: string, section?: string): string => {
    try {
      if (section) {
        return translations[language][section]?.[key] || key;
      }
      
      // Split the key by dots to navigate nested objects
      const keys = key.split('.');
      let result = translations[language];
      
      for (const k of keys) {
        if (!result[k]) return key;
        result = result[k];
      }
      
      return result || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}