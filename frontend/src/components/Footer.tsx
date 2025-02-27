// src/components/Footer.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider'; // เปลี่ยนจาก '@/components/ThemeProvider'

export function Footer() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  
  // Load preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') || 'en';
      const storedTheme = localStorage.getItem('theme') || 'dark';
      setLanguage(storedLanguage);
      setTheme(storedTheme);
    }
  }, []);
  
  // Listen for changes
  useEffect(() => {
    const handleChange = () => {
      if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('language') || 'en';
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setLanguage(storedLanguage);
        setTheme(storedTheme);
      }
    };
    
    window.addEventListener('storage', handleChange);
    window.addEventListener('languageChange', handleChange);
    window.addEventListener('themeChange', handleChange);
    
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('languageChange', handleChange);
      window.removeEventListener('themeChange', handleChange);
    };
  }, []);

  // ... ส่วนที่เหลือของ Footer คงเดิม

  // Translations
  const translations = {
    en: {
      companyDescription: "Premium temperature-controlled logistics solutions for pharmaceutical, food, and other temperature-sensitive products.",
      quickLinks: "Quick Links",
      aboutUs: "About Us",
      ourServices: "Our Services",
      trackShipment: "Track Shipment",
      faq: "FAQ",
      services: "Services",
      temperatureControl: "Temperature Control",
      realTimeTracking: "Real-Time Tracking",
      qualityAssurance: "Quality Assurance",
      coldStorage: "Cold Storage",
      contactInfo: "Contact Us",
      address: "123 Logistics Way, Bangkok, Thailand 10110",
      copyright: "© 2025 ColdChain Logistics. All rights reserved."
    },
    th: {
      companyDescription: "โซลูชันโลจิสติกส์ควบคุมอุณหภูมิระดับพรีเมียมสำหรับผลิตภัณฑ์ยา อาหาร และผลิตภัณฑ์ที่ไวต่ออุณหภูมิอื่นๆ",
      quickLinks: "ลิงก์ด่วน",
      aboutUs: "เกี่ยวกับเรา",
      ourServices: "บริการของเรา",
      trackShipment: "ติดตามการจัดส่ง",
      faq: "คำถามที่พบบ่อย",
      services: "บริการ",
      temperatureControl: "การควบคุมอุณหภูมิ",
      realTimeTracking: "การติดตามแบบเรียลไทม์",
      qualityAssurance: "การรับประกันคุณภาพ",
      coldStorage: "คลังเย็น",
      contactInfo: "ติดต่อเรา",
      address: "123 โลจิสติกส์เวย์, กรุงเทพฯ, ประเทศไทย 10110",
      copyright: "© 2025 ColdChain Logistics สงวนลิขสิทธิ์"
    }
  };

  // Get translations
  const t = translations[language];

  return (
    <footer className="footer py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">ColdChain</h2>
            <p className="mb-4">{t.companyDescription}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition duration-300">
                  {t.ourServices}
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-300 hover:text-white transition duration-300">
                  {t.trackShipment}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition duration-300">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.services}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#temperature-control" className="text-gray-300 hover:text-white transition duration-300">
                  {t.temperatureControl}
                </Link>
              </li>
              <li>
                <Link href="/services#real-time-tracking" className="text-gray-300 hover:text-white transition duration-300">
                  {t.realTimeTracking}
                </Link>
              </li>
              <li>
                <Link href="/services#quality-assurance" className="text-gray-300 hover:text-white transition duration-300">
                  {t.qualityAssurance}
                </Link>
              </li>
              <li>
                <Link href="/services#cold-storage" className="text-gray-300 hover:text-white transition duration-300">
                  {t.coldStorage}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.contactInfo}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-blue-300" />
                <span className="text-gray-300">{t.address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-blue-300" />
                <span className="text-gray-300">+66 2 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-blue-300" />
                <span className="text-gray-300">info@coldchain.example</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}