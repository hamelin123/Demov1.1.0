// Optimized LanguageProvider
'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';

type Language = 'en' | 'th';
type Translations = Record<Language, Record<string, any>>;

// Simplified translations
const translations: Translations = {
  en: {
    navigation: {services: 'Services', tracking: 'Tracking', contact: 'Contact', login: 'Login'},
    hero: {
      title: "Temperature-Controlled Logistics Excellence",
      subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    common: {backToHome: "Back to Home", loading: "Loading...", save: "Save"}
  },
  th: {
    navigation: {services: 'บริการ', tracking: 'ติดตามสินค้า', contact: 'ติดต่อเรา', login: 'เข้าสู่ระบบ'},
    hero: {
      title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
      subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
      getStarted: "เริ่มต้นใช้งาน",
      learnMore: "เรียนรู้เพิ่มเติม"
    },
    common: {backToHome: "กลับไปหน้าหลัก", loading: "กำลังโหลด...", save: "บันทึก"}
  }
};

const LanguageContext = createContext({
  language: 'en' as Language,
  setLanguage: (lang: Language) => {},
  t: (key: string, section?: string): string => key
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language') as Language;
      if (storedLang === 'en' || storedLang === 'th') setLanguageState(storedLang);
      setMounted(true);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
      window.dispatchEvent(new Event('languageChange'));
    }
  };

  // Optimized translation function
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