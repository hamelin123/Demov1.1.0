'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';

type Language = 'en' | 'th';

<<<<<<< HEAD
const translations = {
  en: {
    navigation: {services: 'Services', tracking: 'Tracking', contact: 'Contact', login: 'Login'},
    hero: {title: "Temperature-Controlled Logistics Excellence", subtitle: "Advanced Cold Chain Solutions", getStarted: "Get Started"},
    common: {back: "Back", loading: "Loading...", save: "Save"}
  },
  th: {
    navigation: {services: 'บริการ', tracking: 'ติดตามสินค้า', contact: 'ติดต่อเรา', login: 'เข้าสู่ระบบ'},
    hero: {title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ", subtitle: "โซลูชันโซ่ความเย็นขั้นสูง", getStarted: "เริ่มต้นใช้งาน"},
    common: {back: "กลับ", loading: "กำลังโหลด...", save: "บันทึก"}
=======
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
}

// Load translations
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
    features: {
      temperatureControl: {
        title: "Temperature Control",
        description: "Precise Temperature Monitoring Throughout Transit"
      },
      tracking: {
        title: "Real-Time Tracking",
        description: "GPS Tracking for Complete Shipment Visibility"
      },
      quality: {
        title: "Quality Assured", 
        description: "Strict Quality Controls for Product Integrity"
      }
    },
    professionalServices: {
      title: "Professional Services",
      subtitle: "Temperature-Controlled Logistics Solutions for Your Valuable Cargo",
      temperatureControl: "Temperature Control",
      realTimeTracking: "Real-Time Tracking",
      qualityAssurance: "Quality Assurance"
    },
    contact: {
      title: "Contact Us",
      address: "123 Cold Storage Building\nDigital Park, Sukhumvit Road\nBangkok 10110, Thailand"
    },
    // Add more translations as needed
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
    features: {
      temperatureControl: {
        title: "ควบคุมอุณหภูมิ",
        description: "การตรวจสอบอุณหภูมิอย่างแม่นยำตลอดการขนส่ง"
      },
      tracking: {
        title: "การติดตามแบบเรียลไทม์",
        description: "การติดตามด้วย GPS เพื่อการเห็นสถานะการจัดส่งอย่างสมบูรณ์"
      },
      quality: {
        title: "รับประกันคุณภาพ", 
        description: "การควบคุมคุณภาพอย่างเข้มงวดเพื่อความสมบูรณ์ของสินค้า"
      }
    },
    professionalServices: {
      title: "บริการมืออาชีพ",
      subtitle: "โซลูชันโลจิสติกส์ควบคุมอุณหภูมิสำหรับสินค้ามีค่าของคุณ",
      temperatureControl: "ควบคุมอุณหภูมิ",
      realTimeTracking: "การติดตามแบบเรียลไทม์",
      qualityAssurance: "รับประกันคุณภาพ"
    },
    contact: {
      title: "ติดต่อเรา",
      address: "123 อาคารเก็บสินค้าเย็น\nปาร์คดิจิทัล ถนนสุขุมวิท\nกรุงเทพฯ 10110 ประเทศไทย"
    },
    // Add more translations as needed
>>>>>>> demo
  }
};

const LanguageContext = createContext({
  language: 'en' as Language,
  setLanguage: (lang: Language) => {},
  t: (key: string, section?: string): string => key
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [language, setLang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang === 'en' || storedLang === 'th') setLang(storedLang);
    setMounted(true);
  }, []);

<<<<<<< HEAD
  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languageChange'));
=======
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      // Send language change event
      window.dispatchEvent(new Event('languageChange'));
      console.log('Language changed to:', newLanguage);
    }
>>>>>>> demo
  };

  const t = (key: string, section?: string): string => {
    try {
      if (section) return translations[language][section]?.[key] || key;
      
      const keys = key.split('.');
      let result = translations[language];
      for (const k of keys) {
        if (!result[k]) return key;
        result = result[k];
      }
      return result || key;
    } catch {
      return key;
    }
  };

  return mounted ? (
    <LanguageContext.Provider value={{language, setLanguage, t}}>
      {children}
    </LanguageContext.Provider>
  ) : <>{children}</>;
}