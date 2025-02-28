'use client';

import Link from 'next/link';
import {Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail} from 'lucide-react';
import {useLanguage} from '@/providers/LanguageProvider';
import {useState, useEffect} from 'react';

export function Footer() {
  const {language, t} = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) return <footer className="py-6 bg-[#0f172a]"></footer>;

  const contactInfo = {
    address: language === 'en' 
      ? '123 Logistics Way, Bangkok, Thailand 10110'
      : '123 โลจิสติกส์เวย์, กรุงเทพฯ, ประเทศไทย 10110',
    phone: '+66 2 123 4567',
    email: 'info@coldchain.example'
  };

  const links = {
    quick: [
      {href: '/about', label: language === 'en' ? 'About Us' : 'เกี่ยวกับเรา'},
      {href: '/services', label: t('services', 'navigation')},
      {href: '/tracking', label: t('tracking', 'navigation')},
      {href: '/contact', label: t('contact', 'navigation')}
    ],
    services: [
      {href: '/services#temperature-control', label: language === 'en' ? 'Temperature Control' : 'การควบคุมอุณหภูมิ'},
      {href: '/services#real-time-tracking', label: language === 'en' ? 'Real-Time Tracking' : 'การติดตามแบบเรียลไทม์'},
      {href: '/services#quality-assurance', label: language === 'en' ? 'Quality Assurance' : 'การรับประกันคุณภาพ'},
      {href: '/services#cold-storage', label: language === 'en' ? 'Cold Storage' : 'คลังเย็น'}
    ]
  };

  const socials = [
    {icon: <Facebook size={20} />, href: '#'},
    {icon: <Twitter size={20} />, href: '#'},
    {icon: <Instagram size={20} />, href: '#'},
    {icon: <Linkedin size={20} />, href: '#'}
  ];

  return (
    <footer className="bg-[#0f172a] text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">ColdChain</h2>
            <p className="mb-4">
              {language === 'en' 
                ? "Premium temperature-controlled logistics solutions."
                : "โซลูชันโลจิสติกส์ควบคุมอุณหภูมิระดับพรีเมียม"}
            </p>
            <div className="flex space-x-4">
              {socials.map((link, i) => (
                <Link key={i} href={link.href} className="text-gray-300 hover:text-white">
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
            </h3>
            <ul className="space-y-2">
              {links.quick.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('services', 'navigation')}
            </h3>
            <ul className="space-y-2">
              {links.services.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
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
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-blue-300" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-blue-300" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
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