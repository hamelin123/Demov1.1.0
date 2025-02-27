// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/providers/LanguageProvider';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // ตรวจสอบว่า component ถูก mount แล้ว และดึงค่าธีมและภาษาจาก localStorage ถ้ามี
  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบว่าเป็น client-side และเรียกใช้ localStorage ได้
    if (typeof window !== 'undefined') {
      // ตรวจสอบว่ามีการเปลี่ยนธีมที่บันทึกไว้หรือไม่
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
      
      // ตรวจสอบ DOM สำหรับธีมปัจจุบัน
      if (theme === 'dark' || document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [setTheme]);
  
  // หากยังไม่ mount ก็จะไม่แสดงสถานะเพื่อป้องกัน hydration mismatch
  if (!mounted) {
    return <nav className="navbar py-4 bg-white dark:bg-[#0f172a]">
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
    // ตรวจสอบธีมปัจจุบันและเปลี่ยน
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // บันทึกธีมใหม่ลง localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    
    // ปรับ class ของ document ตามธีม
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // ตั้งค่าธีมใหม่
    setTheme(newTheme);
    
    console.log('Theme toggled to:', newTheme);
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'th' : 'en';
    setLanguage(newLanguage);
    // เพิ่มการ log เพื่อตรวจสอบ
    console.log('Language toggled to:', newLanguage);
  };

  return (
    <nav className="navbar py-4 bg-white dark:bg-[#0f172a] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            ColdChain
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('services', 'navigation')}
            </Link>
            <Link href="/tracking" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('tracking', 'navigation')}
            </Link>
            <Link href="/contact" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('contact', 'navigation')}
            </Link>
            
            {/* Theme Toggle - ทำให้ชัดเจนเพื่อแก้ปัญหาเรื่องการเปลี่ยนธีม */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} className="text-gray-800" />
              }
            </button>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle language"
            >
              <Globe size={20} className="mr-1 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
            >
              {t('login', 'navigation')}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} className="text-gray-800" />
              }
            </button>
            
            {/* ปุ่มเปลี่ยนภาษาบนมือถือ */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle language"
            >
              <Globe size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="ml-1 hidden xs:inline">{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={toggleMenu}
              >
                {t('services', 'navigation')}
              </Link>
              <Link 
                href="/tracking" 
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={toggleMenu}
              >
                {t('tracking', 'navigation')}
              </Link>
              <Link 
                href="/contact" 
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={toggleMenu}
              >
                {t('contact', 'navigation')}
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 w-full text-center"
                onClick={toggleMenu}
              >
                {t('login', 'navigation')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}