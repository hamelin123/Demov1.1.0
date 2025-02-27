'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThermometerSnowflake, MapPin, Shield } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider'; // แก้ไขการ import ให้ใช้ providers

export function HomeContent() {
  const { theme } = useTheme();
  const [language, setLanguage] = useState('en');
  
  // Load language preference from localStorage
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
    
    window.addEventListener('languageChange', handleStorageChange);
    
    return () => {
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

  // Get translations
  const t = translations[language];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl mb-8">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary px-6 py-3 rounded-md">
                {t.hero.getStarted}
              </Link>
              <Link href="/services" className="btn-secondary px-6 py-3 rounded-md">
                {t.hero.learnMore}
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container mx-auto px-4">
            <h2 className="section-heading">
              {t.services.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Temperature Control */}
              <div className="feature-card">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <ThermometerSnowflake size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.services.temperatureControl.title}
                </h3>
                <p>
                  {t.services.temperatureControl.description}
                </p>
              </div>
              
              {/* Real-Time Tracking */}
              <div className="feature-card">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <MapPin size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.services.realTimeTracking.title}
                </h3>
                <p>
                  {t.services.realTimeTracking.description}
                </p>
              </div>
              
              {/* Quality Assured */}
              <div className="feature-card">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <Shield size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.services.qualityAssured.title}
                </h3>
                <p>
                  {t.services.qualityAssured.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="cta-section py-16">
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