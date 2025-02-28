// Optimized languageUtils.ts
export type Language = 'en' | 'th';

// ฟังก์ชันส่ง event เมื่อเปลี่ยนภาษา
export const dispatchLanguageChange = (language: Language) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('languageChange', {
    detail: { language }
  }));
};

// ฟังก์ชันดึงภาษาปัจจุบัน
export const getCurrentLanguage = (): Language => 
  typeof window === 'undefined' ? 'en' : (localStorage.getItem('language') as Language) || 'en';

// ฟังก์ชันตั้งค่าภาษา
export const setLanguage = (language: Language) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', language);
  dispatchLanguageChange(language);
};

// แปลข้อความตามภาษา
export const translate = (key: string, language: Language = getCurrentLanguage()): string => {
  // ฟังก์ชันนี้ควรใช้กับข้อความที่ไม่ได้อยู่ใน context ของ LanguageProvider
  const translations = {
    en: {
      'app.name': 'ColdChain',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
    },
    th: {
      'app.name': 'ColdChain',
      'common.loading': 'กำลังโหลด...',
      'common.error': 'ข้อผิดพลาด',
      'common.success': 'สำเร็จ',
    }
  };
  
  return translations[language][key] || key;
};