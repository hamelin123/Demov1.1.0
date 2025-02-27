// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useEffect, useState } from 'react';

export function Footer() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <footer className="py-6 bg-[#0f172a]"></footer>;
  }

  return (
    <footer className="footer py-12 bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">ColdChain</h2>
            <p className="mb-4 text-gray-300">
              {language === 'en' 
                ? "Premium temperature-controlled logistics solutions for pharmaceutical, food, and other temperature-sensitive products."
                : "โซลูชันโลจิสติกส์ควบคุมอุณหภูมิระดับพรีเมียมสำหรับผลิตภัณฑ์ยา อาหาร และผลิตภัณฑ์ที่ไวต่ออุณหภูมิอื่นๆ"}
            </p>
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
            <h3 className="text-lg font-semibold text-white mb-4">
              {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
                  {language === 'en' ? 'About Us' : 'เกี่ยวกับเรา'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition duration-300">
                  {t('services', 'navigation')}
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-300 hover:text-white transition duration-300">
                  {t('tracking', 'navigation')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  {t('contact', 'navigation')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('services', 'navigation')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#temperature-control" className="text-gray-300 hover:text-white transition duration-300">
                  {language === 'en' ? 'Temperature Control' : 'การควบคุมอุณหภูมิ'}
                </Link>
              </li>
              <li>
                <Link href="/services#real-time-tracking" className="text-gray-300 hover:text-white transition duration-300">
                  {language === 'en' ? 'Real-Time Tracking' : 'การติดตามแบบเรียลไทม์'}
                </Link>
              </li>
              <li>
                <Link href="/services#quality-assurance" className="text-gray-300 hover:text-white transition duration-300">
                  {language === 'en' ? 'Quality Assurance' : 'การรับประกันคุณภาพ'}
                </Link>
              </li>
              <li>
                <Link href="/services#cold-storage" className="text-gray-300 hover:text-white transition duration-300">
                  {language === 'en' ? 'Cold Storage' : 'คลังเย็น'}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('contact', 'navigation')}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-blue-300" />
                <span className="text-gray-300">
                  {language === 'en' 
                    ? '123 Logistics Way, Bangkok, Thailand 10110'
                    : '123 โลจิสติกส์เวย์, กรุงเทพฯ, ประเทศไทย 10110'}
                </span>
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
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-300">
          <p>
            {language === 'en'
              ? '© 2025 ColdChain Logistics. All rights reserved.'
              : '© 2025 ColdChain Logistics สงวนลิขสิทธิ์'}
          </p>
        </div>
      </div>
    </footer>
  );
}