'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThermometerSnowflake, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from 'next-themes';

export function HomeContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

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

  const content = {
    en: {
      title: "Temperature-Controlled Logistics Excellence",
      subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
      getStarted: "Get Started",
      learnMore: "Learn More",
      services: "Our Services",
      features: [
        {
          title: "Temperature Control",
          desc: "Precise Temperature Monitoring Throughout Transit",
          icon: <ThermometerSnowflake size={40} />
        },
        {
          title: "Real-Time Tracking",
          desc: "GPS Tracking for Complete Shipment Visibility",
          icon: <MapPin size={40} />
        },
        {
          title: "Quality Assured",
          desc: "Strict Quality Controls for Product Integrity",
          icon: <Shield size={40} />
        }
      ],
      cta: {
        title: "Ready to Get Started?",
        desc: "Contact us today to learn how our temperature-controlled logistics solutions can benefit your business.",
        button: "Contact Us"
      }
    },
    th: {
      title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
      subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
      getStarted: "เริ่มต้นใช้งาน",
      learnMore: "เรียนรู้เพิ่มเติม",
      services: "บริการของเรา",
      features: [
        {
          title: "ควบคุมอุณหภูมิ",
          desc: "การตรวจสอบอุณหภูมิอย่างแม่นยำตลอดการขนส่ง",
          icon: <ThermometerSnowflake size={40} />
        },
        {
          title: "การติดตามแบบเรียลไทม์",
          desc: "การติดตามด้วย GPS เพื่อการมองเห็นการจัดส่งอย่างครบถ้วน",
          icon: <MapPin size={40} />
        },
        {
          title: "การรับประกันคุณภาพ",
          desc: "การควบคุมคุณภาพที่เข้มงวดเพื่อความสมบูรณ์ของผลิตภัณฑ์",
          icon: <Shield size={40} />
        }
      ],
      cta: {
        title: "พร้อมที่จะเริ่มต้นหรือยัง?",
        desc: "ติดต่อเราวันนี้เพื่อเรียนรู้วิธีที่โซลูชันโลจิสติกส์ควบคุมอุณหภูมิของเราสามารถเป็นประโยชน์ต่อธุรกิจของคุณ",
        button: "ติดต่อเรา"
      }
    }
  };

  const c = content[language];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero py-24 bg-blue-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">{c.title}</h1>
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">{c.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary px-6 py-3 rounded-md">{c.getStarted}</Link>
              <Link href="/services" className="btn-secondary px-6 py-3 rounded-md">{c.learnMore}</Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <h2 className="section-heading text-center text-3xl font-bold mb-12 text-blue-600 dark:text-blue-400">{c.services}</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {c.features.map((feature, idx) => (
                <div key={idx} className="feature-card bg-blue-50 dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-300 dark:bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{c.cta.title}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{c.cta.desc}</p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-300">
              {c.cta.button}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}