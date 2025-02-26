import {Pathnames} from 'next-intl/navigation';

export const useTranslations = (namespace?: string) => {
  return (key: string) => {
    // แสดงค่า key ที่ส่งเข้ามาเลย
    return key.split('.').pop() || key;
  };
};

// จำลองข้อมูลการตั้งค่าภาษา
export const locales = ['en', 'th'] as const;

export const pathnames = {
  '/': '/',
  '/services': '/services',
  '/contact': '/contact'
};

export const localePrefix = 'always';

export type Locale = (typeof locales)[number];

// ฟังก์ชันจำลองอื่นๆ ที่อาจต้องใช้
export const useLocale = () => 'en';
export const useTranslation = () => {
  return {
    t: (key: string) => key.split('.').pop() || key,
    i18n: {
      changeLanguage: (lang: string) => {},
      language: 'en'
    }
  };
};