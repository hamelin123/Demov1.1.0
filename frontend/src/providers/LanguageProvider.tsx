// src/providers/LanguageProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
}

interface TranslationsType {
  [key: string]: {
    [key: string]: any;
  };
}

const translations: TranslationsType = {
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
    services: {
      title: "Our Services",
      temperatureControl: "Temperature Control",
      monitoring: "Temperature Monitoring",
      storage: "Cold Storage Warehousing",
      tracking: "Real-Time Tracking",
      packaging: "Specialized Packaging",
      consulting: "Cold Chain Consulting",
      quality: "Quality Assurance",
      industries: "Industries We Serve"
    },
    contact: {
      title: "Contact Us",
      info: "Contact Information",
      send: "Send Message"
    },
    footer: {
      companyDescription: "Premium temperature-controlled logistics solutions for pharmaceutical, food, and other temperature-sensitive products.",
      quickLinks: "Quick Links",
      aboutUs: "About Us",
      ourServices: "Our Services",
      trackShipment: "Track Shipment",
      contact: "Contact Us",
      copyright: "© 2025 ColdChain Logistics. All rights reserved."
    }
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
    services: {
      title: "บริการของเรา",
      temperatureControl: "ควบคุมอุณหภูมิ",
      monitoring: "ตรวจสอบอุณหภูมิ",
      storage: "คลังสินค้าห้องเย็น",
      tracking: "การติดตามแบบเรียลไทม์",
      packaging: "บรรจุภัณฑ์เฉพาะทาง",
      consulting: "ที่ปรึกษาซัพพลายเชนความเย็น",
      quality: "การรับประกันคุณภาพ",
      industries: "อุตสาหกรรมที่เราให้บริการ"
    },
    contact: {
      title: "ติดต่อเรา",
      info: "ข้อมูลการติดต่อ",
      send: "ส่งข้อความ"
    },
    footer: {
      companyDescription: "โซลูชันโลจิสติกส์ควบคุมอุณหภูมิระดับพรีเมียมสำหรับผลิตภัณฑ์ยา อาหาร และผลิตภัณฑ์ที่ไวต่ออุณหภูมิอื่นๆ",
      quickLinks: "ลิงก์ด่วน",
      aboutUs: "เกี่ยวกับเรา",
      ourServices: "บริการของเรา",
      trackShipment: "ติดตามการจัดส่ง",
      contact: "ติดต่อเรา",
      copyright: "© 2025 ColdChain Logistics สงวนลิขสิทธิ์"
    }
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

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      console.log('Language changed to:', newLanguage);
    }
  };

  // Function to get translation for a key
  const t = (key: string, section?: string): string => {
    try {
      if (section) {
        // @ts-ignore - อาจมี type error แต่เราจะอนุญาตให้ใช้งานได้
        return translations[language][section]?.[key] || key;
      }
      
      // Split the key by dots to navigate nested objects
      const keys = key.split('.');
      let result: any = translations[language];
      
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