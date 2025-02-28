// src/i18n/index.ts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'th';

type Translations = {
  [locale in Language]: {
    [key: string]: any;
  };
};

const translations: Translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
    },
    navigation: {
      home: 'Home',
      dashboard: 'Dashboard',
      tracking: 'Track Shipment',
      services: 'Services',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    // ...rest of English translations
  },
  th: {
    common: {
      loading: 'กำลังโหลด...',
      error: 'เกิดข้อผิดพลาด',
      success: 'สำเร็จ!',
    },
    navigation: {
      home: 'หน้าแรก',
      dashboard: 'แดชบอร์ด',
      tracking: 'ติดตามสินค้า',
      services: 'บริการ',
      contact: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ',
      register: 'ลงทะเบียน',
      logout: 'ออกจากระบบ',
    },
    // ...rest of Thai translations
  }
};

// Create context
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Provider component
interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage on client side
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'th')) {
      setLanguage(storedLanguage);
    } else {
      // Default to browser language if available
      const browserLang = navigator.language.split('-')[0];
      setLanguage(browserLang === 'th' ? 'th' : 'en');
    }
    setMounted(true);
  }, []);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (!result[k]) return key;
      result = result[k];
    }
    
    return result || key;
  };

  // Update localStorage when language changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Dispatch event for components that might listen to language changes
    window.dispatchEvent(new Event('languageChange'));
  };

  // Prevent SSR issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use the i18n context
export const useI18n = () => useContext(I18nContext);