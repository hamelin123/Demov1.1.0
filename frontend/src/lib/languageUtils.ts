// src/lib/languageUtils.ts

// Function to dispatch a custom event when language changes
export const dispatchLanguageChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('languageChange'));
    }
  };
  
  // Function to get current language
  export const getCurrentLanguage = (): 'en' | 'th' => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as 'en' | 'th') || 'en';
    }
    return 'en';
  };
  
  // Function to set language
  export const setLanguage = (language: 'en' | 'th') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      dispatchLanguageChange();
    }
  };