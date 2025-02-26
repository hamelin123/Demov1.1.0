// src/components/HomeContent.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThermometerSnowflake, MapPin, Shield } from 'lucide-react';

export function HomeContent() {
  const [language, setLanguage] = useState('en');
  
  // Load language preference from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(storedLanguage);
    }
  }, []);
  
  // Listen for language changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(storedLanguage);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for language changes within the app
    window.addEventListener('languageChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange);
    };
  }, []);

  // Translations
  const translations = {
    en: {
      hero: {
        title: "Temperature-Controlled Logistics Excellence",
        subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
        getStarted: "Get Started",
        learnMore: "Learn More"
      },
      services: {
        title: "Our Services",
        temperatureControl: {
          title: "Temperature Control",
          description: "Precise Temperature Monitoring Throughout Transit"
        },
        realTimeTracking: {
          title: "Real-Time Tracking",
          description: "GPS Tracking for Complete Shipment Visibility"
        },
        qualityAssured: {
          title: "Quality Assured",
          description: "Strict Quality Controls for Product Integrity"
        }
      },
      cta: {
        title: "Ready to Get Started?",
        description: "Contact us today to learn how our temperature-controlled logistics solutions can benefit your business.",
        button: "Contact Us"
      }
    },
    th: {
      hero: {
        title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
        subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
        getStarted: "เริ่มต้นใช้งาน",
        learnMore: "เรียนรู้เพิ่มเติม"
      },
      services: {
        title: "บริการของเรา",
        temperatureControl: {
          title: "ควบคุมอุณหภูมิ",
          description: "การตรวจสอบอุณหภูมิอย่างแม่นยำตลอดการขนส่ง"
        },
        realTimeTracking: {
          title: "การติดตามแบบเรียลไทม์",
          description: "การติดตามด้วย GPS เพื่อการมองเห็นการจัดส่งอย่างครบถ้วน"
        },
        qualityAssured: {
          title: "การรับประกันคุณภาพ",
          description: "การควบคุมคุณภาพที่เข้มงวดเพื่อความสมบูรณ์ของผลิตภัณฑ์"
        }
      },
      cta: {
        title: "พร้อมที่จะเริ่มต้นหรือยัง?",
        description: "ติดต่อเราวันนี้เพื่อเรียนรู้วิธีที่โซลูชันโลจิสติกส์ควบคุมอุณหภูมิของเราสามารถเป็นประโยชน์ต่อธุรกิจของคุณ",
        button: "ติดต่อเรา"
      }
    }
  };

  // Get translations for current language
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300">
                {t.hero.getStarted}
              </Link>
              <Link href="/services" className="px-6 py-3 border border-white hover:bg-white/10 text-white font-medium rounded-md transition duration-300">
                {t.hero.learnMore}
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              {t.services.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Temperature Control */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <ThermometerSnowflake size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t.services.temperatureControl.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.services.temperatureControl.description}
                </p>
              </div>
              
              {/* Real-Time Tracking */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <MapPin size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t.services.realTimeTracking.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.services.realTimeTracking.description}
                </p>
              </div>
              
              {/* Quality Assured */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <Shield size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t.services.qualityAssured.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.services.qualityAssured.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t.cta.title}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t.cta.description}
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-300">
              {t.cta.button}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}