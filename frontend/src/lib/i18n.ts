// src/lib/i18n.ts
export const locales = ['en', 'th'] as const;
export type Locale = typeof locales[number];

const translations = {
  en: {
    navigation: {
      services: "Services",
      tracking: "Tracking",
      contact: "Contact",
      login: "Login"
    },
    hero: {
      title: "Temperature-Controlled Logistics Excellence",
      subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
      getStarted: "Get Started",
      learnMore: "Learn More"
    },
    // Add more translations as needed
  },
  th: {
    navigation: {
      services: "บริการ",
      tracking: "ติดตามสินค้า",
      contact: "ติดต่อเรา",
      login: "เข้าสู่ระบบ"
    },
    hero: {
      title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
      subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
      getStarted: "เริ่มต้นใช้งาน",
      learnMore: "เรียนรู้เพิ่มเติม"
    },
    // Add more translations as needed
  }
};

// ฟังก์ชันสำหรับดึงคำแปลตามภาษาและ key
export function getTranslation(locale: Locale, key: string) {
  try {
    const parts = key.split('.');
    let result = translations[locale];
    
    for (const part of parts) {
      if (!result[part]) return key;
      result = result[part];
    }
    
    return result || key;
  } catch (e) {
    return key;
  }
}

// ฟังก์ชันจำลอง useTranslations
export function useTranslations(namespace?: string) {
  const locale = typeof window !== 'undefined' ? 
    (localStorage.getItem('language') as Locale || 'en') : 'en';
  
  return (key: string) => {
    if (namespace) {
      return getTranslation(locale, `${namespace}.${key}`);
    }
    return getTranslation(locale, key);
  };
}

// ฟังก์ชันจำลองอื่นๆ ที่อาจต้องใช้
export const useLocale = () => {
  return typeof window !== 'undefined' ? 
    (localStorage.getItem('language') as Locale || 'en') : 'en';
};