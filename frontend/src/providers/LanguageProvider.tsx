'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';

type Language = 'en' | 'th';

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

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languageChange'));
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