// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { setLanguage as setAppLanguage } from '@/lib/languageUtils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  
  // Load theme and language preference from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') || 'light';
      const storedLanguage = localStorage.getItem('language') || 'en';
      
      setTheme(storedTheme);
      setLanguage(storedLanguage);
      
      // Apply theme to document
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'th' : 'en';
    setLanguage(newLanguage);
    
    // ใช้ฟังก์ชัน setAppLanguage แทนการตั้งค่าโดยตรง
    setAppLanguage(newLanguage as 'en' | 'th');
    
    // ยังคงต้องใช้ localStorage เพื่อจัดเก็บภาษา
    localStorage.setItem('language', newLanguage);
    
    // แจ้งเตือนให้คอมโพเนนต์อื่นๆ ทราบว่ามีการเปลี่ยนภาษา
    window.dispatchEvent(new Event('languageChange'));
  };

  // Translations object
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

  // Get translations for current language
  const t = translations[language];

  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            ColdChain
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-gray-300 hover:text-white transition duration-300">
              {t.services}
            </Link>
            <Link href="/tracking" className="text-gray-300 hover:text-white transition duration-300">
              {t.tracking}
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">
              {t.contact}
            </Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-gray-300 hover:text-white transition duration-300"
              aria-label="Toggle language"
            >
              <Globe size={20} className="mr-1" />
              <span>{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
            >
              {t.login}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Theme Toggle - Mobile */}
            <button 
              onClick={toggleTheme}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* Language Toggle - Mobile */}
            <button 
              onClick={toggleLanguage}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Toggle language"
            >
              <Globe size={20} />
            </button>
            
            <button 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/services" 
                className="text-gray-300 hover:text-white transition duration-300"
                onClick={toggleMenu}
              >
                {t.services}
              </Link>
              <Link 
                href="/tracking" 
                className="text-gray-300 hover:text-white transition duration-300"
                onClick={toggleMenu}
              >
                {t.tracking}
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-white transition duration-300"
                onClick={toggleMenu}
              >
                {t.contact}
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300 w-full text-center"
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