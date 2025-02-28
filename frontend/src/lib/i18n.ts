// Optimized i18n.ts
export const locales = ['en', 'th'] as const;
export type Locale = typeof locales[number];

// ข้อความแปลพื้นฐาน
const translations = {
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!"
    },
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      tracking: "Track",
      services: "Services",
      contact: "Contact",
      login: "Login",
      logout: "Logout"
    }
  },
  th: {
    common: {
      loading: "กำลังโหลด...",
      error: "เกิดข้อผิดพลาด",
      success: "สำเร็จ!"
    },
    nav: {
      home: "หน้าแรก",
      dashboard: "แดชบอร์ด",
      tracking: "ติดตาม",
      services: "บริการ",
      contact: "ติดต่อ",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ"
    }
  }
};

export function t(key: string, locale: Locale = 'en') {
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

export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('language') as Locale) || 'en';
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', locale);
  window.dispatchEvent(new Event('languageChange'));
}