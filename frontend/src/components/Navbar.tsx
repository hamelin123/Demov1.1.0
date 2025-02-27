'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { setLanguage as setAppLanguage } from '@/lib/languageUtils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('en');
  
  // ตรวจสอบว่า component ถูก mount แล้ว
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(storedLanguage);
    }
  }, []);
  
  // หากยังไม่ mount ก็จะไม่แสดงสถานะเพื่อป้องกัน hydration mismatch
  if (!mounted) {
    return <nav className="navbar py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">ColdChain</span>
          <div></div>
        </div>
      </div>
    </nav>;
  }

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'th' : 'en';
    setLanguage(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      
      if (typeof setAppLanguage === 'function') {
        setAppLanguage(newLanguage as 'en' | 'th');
      }
      
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language: newLanguage } 
      }));
      
      console.log('Language changed to:', newLanguage);
    }
  };

  // Translations
  const translations = {
    en: {
      services: 'Services',
      tracking: 'Tracking',
      contact: 'Contact',
      login: 'Login'
    },
    th: {
      services: 'บริการ',
      tracking: 'ติดตามสินค้า',
      contact: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ'
    }
  };

  // Get translations
  const t = translations[language];

  return (
    <nav className="navbar py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            ColdChain
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="nav-link">
              {t.services}
            </Link>
            <Link href="/tracking" className="nav-link">
              {t.tracking}
            </Link>
            <Link href="/contact" className="nav-link">
              {t.contact}
            </Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <Moon size={20} className="text-gray-800" /> : 
                <Sun size={20} className="text-yellow-300" />
              }
            </button>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe size={20} className="mr-1 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
            >
              {t.login}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <Moon size={20} className="text-gray-800" /> : 
                <Sun size={20} className="text-yellow-300" />
              }
            </button>
            
            {/* ปุ่มเปลี่ยนภาษาบนมือถือ */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="ml-1 hidden xs:inline">{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? 
                <X size={24} className="text-gray-800 dark:text-white" /> : 
                <Menu size={24} className="text-gray-800 dark:text-white" />
              }
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/services" 
                className="nav-link"
                onClick={toggleMenu}
              >
                {t.services}
              </Link>
              <Link 
                href="/tracking" 
                className="nav-link"
                onClick={toggleMenu}
              >
                {t.tracking}
              </Link>
              <Link 
                href="/contact" 
                className="nav-link"
                onClick={toggleMenu}
              >
                {t.contact}
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 w-full text-center"
                onClick={toggleMenu}
              >
                {t.login}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}