'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {Menu, X, Sun, Moon, Globe} from 'lucide-react';
import {useTheme} from '@/providers/ThemeProvider';
import {useLanguage} from '@/providers/LanguageProvider';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {theme, toggleTheme} = useTheme();
  const {language, setLanguage, t} = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">ColdChain</span>
            <div></div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    {href: '/services', label: t('services', 'navigation')},
    {href: '/tracking', label: t('tracking', 'navigation')},
    {href: '/contact', label: t('contact', 'navigation')}
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
            ColdChain
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link 
                key={link.href} href={link.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} 
                    className="flex items-center p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              <Globe size={20} className="mr-1 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'TH' : 'EN'}</span>
            </button>
            
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              {t('login', 'navigation')}
            </Link>
          </div>
          
          {/* Mobile Menu Controls */}
          <div className="flex items-center space-x-3 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} 
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              <Globe size={20} className="text-blue-600 dark:text-blue-400" />
            </button>
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} 
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              
              <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-md w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}>
                {t('login', 'navigation')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}