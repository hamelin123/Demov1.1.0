'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import {Menu, X, Sun, Moon, Globe} from 'lucide-react';
import {useTheme} from '@/providers/ThemeProvider';
import {useLanguage} from '@/providers/LanguageProvider';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {theme, toggleTheme} = useTheme();
  const {language, setLanguage, t} = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
=======
import { Menu, X, Sun, Moon, Globe, User } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/components/auth/AuthProvider';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <nav className="navbar py-4 bg-white dark:bg-[#0f172a]">
      <div className="container mx-auto px-4">
>>>>>>> demo
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">ColdChain</span>
          <div></div>
        </div>
      </div>
    </nav>
  );

<<<<<<< HEAD
  const navLinks = [
    {href: '/services', label: t('services', 'navigation')},
    {href: '/tracking', label: t('tracking', 'navigation')},
    {href: '/contact', label: t('contact', 'navigation')}
  ];
=======
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleLanguageHandler = () => {
    const newLanguage = language === 'en' ? 'th' : 'en';
    setLanguage(newLanguage);
  };

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/auth/login';
    
    switch(user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      default:
        return '/dashboard';
    }
  };
>>>>>>> demo

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">ColdChain</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
<<<<<<< HEAD
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {link.label}
              </Link>
            ))}
            
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} className="flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-700">
=======
            <Link href="/about" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {language === 'en' ? 'About' : 'เกี่ยวกับเรา'}
            </Link>
            <Link href="/services" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('services', 'navigation')}
            </Link>
            <Link href="/tracking" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('tracking', 'navigation')}
            </Link>
            <Link href="/contact" className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('contact', 'navigation')}
            </Link>
            
            {/* Theme Toggle */}
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
              onClick={toggleLanguageHandler}
              className="flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle language"
            >
>>>>>>> demo
              <Globe size={20} className="mr-1 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
<<<<<<< HEAD
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              {t('login', 'navigation')}
            </Link>
=======
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={getDashboardLink()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
                >
                  {language === 'en' ? 'Dashboard' : 'แดชบอร์ด'}
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {language === 'en' ? 'Logout' : 'ออกจากระบบ'}
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
              >
                {t('login', 'navigation')}
              </Link>
            )}
>>>>>>> demo
          </div>
          
          {/* Mobile Menu */}
          <div className="flex items-center space-x-3 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            
<<<<<<< HEAD
            <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
=======
            <button 
              onClick={toggleLanguageHandler}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle language"
            >
>>>>>>> demo
              <Globe size={20} className="text-blue-600 dark:text-blue-400" />
            </button>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
<<<<<<< HEAD
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-md w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                {t('login', 'navigation')}
              </Link>
=======
              <Link 
                href="/about" 
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={toggleMenu}
              >
                {language === 'en' ? 'About' : 'เกี่ยวกับเรา'}
              </Link>
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
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href={getDashboardLink()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 w-full text-center"
                    onClick={toggleMenu}
                  >
                    {language === 'en' ? 'Dashboard' : 'แดชบอร์ด'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 w-full text-left"
                  >
                    {language === 'en' ? 'Logout' : 'ออกจากระบบ'}
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 w-full text-center"
                  onClick={toggleMenu}
                >
                  {t('login', 'navigation')}
                </Link>
              )}
>>>>>>> demo
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}