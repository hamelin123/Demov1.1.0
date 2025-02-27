// src/components/HomeContent.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThermometerSnowflake, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from 'next-themes';

export function HomeContent() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // เมื่อ component ถูก mount จะตั้งค่าให้ mounted เป็น true
  useEffect(() => {
    setMounted(true);
  }, []);

  // ก่อนที่ component จะถูก mount จะให้แสดง placeholder
  if (!mounted) {
    return <div className="flex flex-col min-h-screen">
      <div className="animate-pulse bg-blue-50 dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero py-24 bg-blue-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              {language === 'en' ? 
                "Temperature-Controlled Logistics Excellence" : 
                "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ"}
            </h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
              {language === 'en' ? 
                "Advanced Cold Chain Solutions with Real-Time Monitoring" : 
                "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary px-6 py-3 rounded-md">
                {language === 'en' ? "Get Started" : "เริ่มต้นใช้งาน"}
              </Link>
              <Link href="/services" className="btn-secondary px-6 py-3 rounded-md">
                {language === 'en' ? "Learn More" : "เรียนรู้เพิ่มเติม"}
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="section-heading text-center text-3xl font-bold mb-12 text-blue-600 dark:text-blue-400">
              {language === 'en' ? "Our Services" : "บริการของเรา"}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Temperature Control */}
              <div className="feature-card bg-blue-50 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <ThermometerSnowflake size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'en' ? "Temperature Control" : "ควบคุมอุณหภูมิ"}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'en' ? 
                    "Precise Temperature Monitoring Throughout Transit" : 
                    "การตรวจสอบอุณหภูมิอย่างแม่นยำตลอดการขนส่ง"}
                </p>
              </div>
              
              {/* Real-Time Tracking */}
              <div className="feature-card bg-blue-50 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <MapPin size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'en' ? "Real-Time Tracking" : "การติดตามแบบเรียลไทม์"}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'en' ? 
                    "GPS Tracking for Complete Shipment Visibility" : 
                    "การติดตามด้วย GPS เพื่อการมองเห็นการจัดส่งอย่างครบถ้วน"}
                </p>
              </div>
              
              {/* Quality Assured */}
              <div className="feature-card bg-blue-50 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <Shield size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'en' ? "Quality Assured" : "การรับประกันคุณภาพ"}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'en' ? 
                    "Strict Quality Controls for Product Integrity" : 
                    "การควบคุมคุณภาพที่เข้มงวดเพื่อความสมบูรณ์ของผลิตภัณฑ์"}
                </p>
              </div>
            </div>
          </div>
        </section>

{/* CTA Section - เปลี่ยนเฉพาะสีพื้นหลังในธีมสว่างให้อ่อนลง */}
        <section className="py-16 bg-blue-300 dark:bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' ? "Ready to Get Started?" : "พร้อมที่จะเริ่มต้นหรือยัง?"}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {language === 'en' ? 
                "Contact us today to learn how our temperature-controlled logistics solutions can benefit your business." : 
                "ติดต่อเราวันนี้เพื่อเรียนรู้วิธีที่โซลูชันโลจิสติกส์ควบคุมอุณหภูมิของเราสามารถเป็นประโยชน์ต่อธุรกิจของคุณ"}
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-300">
              {language === 'en' ? "Contact Us" : "ติดต่อเรา"}
            </Link>
          </div>
        </section>
            </main>
          </div>
        );
      }