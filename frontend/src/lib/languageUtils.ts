// src/lib/languageUtils.ts

export type Language = 'en' | 'th';

// Function to dispatch a custom event when language changes
export const dispatchLanguageChange = (language: Language) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language }
    }));
    console.log('Language change event dispatched:', language);
  }
};

// Function to get current language
export const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('language') as Language) || 'en';
  }
  return 'en';
};

// Function to set language
export const setLanguage = (language: Language) => {
  if (typeof window !== 'undefined') {
    console.log('Setting language to:', language);
    localStorage.setItem('language', language);
    dispatchLanguageChange(language);
  }
};