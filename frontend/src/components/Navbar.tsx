'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@nextui-org/react';
import { Sun, Moon, Menu, X, Thermometer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Thermometer className="text-blue-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">ColdChain</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('services')}
            </Link>
            <Link href="/tracking" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('tracking')}
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('contact')}
            </Link>
            <LanguageSwitcher />
            <Button
              variant="light"
              isIconOnly
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-gray-100 dark:bg-gray-800"
            >
              {theme === 'dark' ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} className="text-gray-600" />
              }
            </Button>
            <Button 
              color="primary" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              onPress={() => {}}
            >
              {t('login')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            className="md:hidden bg-gray-100 dark:bg-gray-800"
            variant="light"
            isIconOnly
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <X className="text-gray-600 dark:text-gray-300" /> : 
              <Menu className="text-gray-600 dark:text-gray-300" />
            }
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col space-y-4">
            <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('services')}
            </Link>
            <Link href="/tracking" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('tracking')}
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('contact')}
            </Link>
            <LanguageSwitcher />
            <Button
              variant="light"
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-gray-100 dark:bg-gray-800 justify-start"
            >
              {theme === 'dark' ? 
                <Sun size={20} className="text-yellow-400 mr-2" /> : 
                <Moon size={20} className="text-gray-600 mr-2" />
              }
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button 
              color="primary" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              onPress={() => {}}
            >
              {t('login')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}