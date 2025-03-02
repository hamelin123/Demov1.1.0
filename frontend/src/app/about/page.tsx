// src/app/about/page.tsx
'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle, Award, TrendingUp, Users, Clock, Globe, Truck, Thermometer } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // เมื่อ component ถูก mount จะตั้งค่าให้ mounted เป็น true
  useEffect(() => {
    setMounted(true);
  }, []);

  // ก่อนที่ component จะถูก mount จะให้แสดง placeholder
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <div className="animate-pulse h-screen"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const translations = {
    en: {
      title: 'About ColdChain',
      subtitle: 'The Leaders in Temperature-Controlled Logistics',
      ourStory: 'Our Story',
      storyContent: 'Founded in 2018, ColdChain emerged from a vision to revolutionize the temperature-controlled logistics industry in Thailand. We identified critical gaps in the reliable transportation of temperature-sensitive products, from pharmaceuticals to food, and set out to create solutions that would ensure product integrity from pickup to delivery.',
      storyContent2: 'Today, ColdChain has grown into a trusted logistics partner for businesses across Thailand, with plans for expansion throughout Southeast Asia. Our commitment to innovation, quality, and customer satisfaction has positioned us as leaders in the cold chain logistics market.',
      ourMission: 'Our Mission',
      missionContent: 'To provide unparalleled temperature-controlled logistics solutions that ensure product integrity, safety, and compliance while exceeding customer expectations through innovation and exceptional service.',
      ourVision: 'Our Vision',
      visionContent: 'To become the most trusted and innovative temperature-controlled logistics provider in Southeast Asia, setting industry standards for quality, reliability, and sustainability.',
      values: 'Our Core Values',
      valuesIntegrity: 'Integrity',
      valuesIntegrityContent: 'We operate with honesty, transparency, and ethical standards in all our business dealings.',
      valuesInnovation: 'Innovation',
      valuesInnovationContent: 'We continuously seek new technologies and approaches to improve our services and solutions.',
      valuesExcellence: 'Excellence',
      valuesExcellenceContent: 'We strive for perfection in every aspect of our operations, from logistics to customer service.',
      valuesCustomerFocus: 'Customer Focus',
      valuesCustomerFocusContent: 'We prioritize understanding and meeting the unique needs of each customer.',
      valuesSustainability: 'Sustainability',
      valuesSustainabilityContent: 'We are committed to environmentally responsible practices throughout our operations.',
      ourTeam: 'Our Leadership Team',
      founderCEO: 'Founder & CEO',
      operationsDirector: 'Operations Director',
      techDirector: 'Technology Director',
      salesDirector: 'Sales & Marketing Director',
      keyStats: 'Key Statistics',
      clients: 'Satisfied Clients',
      deliveries: 'Successful Deliveries',
      vehicles: 'Temperature-Controlled Vehicles',
      countries: 'Cities Served',
      certifications: 'Our Certifications',
      iso9001: 'ISO 9001 - Quality Management',
      iso14001: 'ISO 14001 - Environmental Management',
      iso45001: 'ISO 45001 - Occupational Health and Safety',
      gdp: 'Good Distribution Practice (GDP) for Pharmaceuticals',
      haccp: 'HACCP Certification for Food Safety'
    },
    th: {
      title: 'เกี่ยวกับ ColdChain',
      subtitle: 'ผู้นำด้านโลจิสติกส์ควบคุมอุณหภูมิ',
      ourStory: 'เรื่องราวของเรา',
      storyContent: 'ก่อตั้งในปี 2561 ColdChain เกิดจากวิสัยทัศน์ที่จะปฏิวัติอุตสาหกรรมโลจิสติกส์ควบคุมอุณหภูมิในประเทศไทย เราระบุช่องว่างที่สำคัญในการขนส่งผลิตภัณฑ์ที่ไวต่ออุณหภูมิที่เชื่อถือได้ ตั้งแต่เวชภัณฑ์ไปจนถึงอาหาร และมุ่งมั่นที่จะสร้างโซลูชันที่จะรับรองความสมบูรณ์ของผลิตภัณฑ์ตั้งแต่การรับสินค้าไปจนถึงการส่งมอบ',
      storyContent2: 'ปัจจุบัน ColdChain ได้เติบโตเป็นพันธมิตรด้านโลจิสติกส์ที่ได้รับความไว้วางใจสำหรับธุรกิจทั่วประเทศไทย โดยมีแผนการขยายตัวทั่วเอเชียตะวันออกเฉียงใต้ ความมุ่งมั่นของเราในเรื่องนวัตกรรม คุณภาพ และความพึงพอใจของลูกค้าได้จัดวางให้เราเป็นผู้นำในตลาดโลจิสติกส์โซ่ความเย็น',
      ourMission: 'พันธกิจของเรา',
      missionContent: 'ให้บริการโซลูชันโลจิสติกส์ควบคุมอุณหภูมิที่ไม่มีใครเทียบได้ ซึ่งรับรองความสมบูรณ์ ความปลอดภัย และการปฏิบัติตามข้อกำหนดของผลิตภัณฑ์ ในขณะที่เกินความคาดหวังของลูกค้าผ่านนวัตกรรมและบริการที่ยอดเยี่ยม',
      ourVision: 'วิสัยทัศน์ของเรา',
      visionContent: 'เพื่อเป็นผู้ให้บริการโลจิสติกส์ควบคุมอุณหภูมิที่ได้รับความไว้วางใจและมีนวัตกรรมมากที่สุดในเอเชียตะวันออกเฉียงใต้ โดยกำหนดมาตรฐานของอุตสาหกรรมสำหรับคุณภาพ ความน่าเชื่อถือ และความยั่งยืน',
      values: 'ค่านิยมหลักของเรา',
      valuesIntegrity: 'ความซื่อสัตย์',
      valuesIntegrityContent: 'เราดำเนินงานด้วยความซื่อสัตย์ โปร่งใส และมาตรฐานทางจริยธรรมในการทำธุรกิจทั้งหมดของเรา',
      valuesInnovation: 'นวัตกรรม',
      valuesInnovationContent: 'เราแสวงหาเทคโนโลยีและวิธีการใหม่ๆ อย่างต่อเนื่องเพื่อปรับปรุงบริการและโซลูชันของเรา',
      valuesExcellence: 'ความเป็นเลิศ',
      valuesExcellenceContent: 'เรามุ่งมั่นสู่ความสมบูรณ์แบบในทุกด้านของการดำเนินงานของเรา ตั้งแต่โลจิสติกส์ไปจนถึงการบริการลูกค้า',
      valuesCustomerFocus: 'การเน้นลูกค้าเป็นศูนย์กลาง',
      valuesCustomerFocusContent: 'เราให้ความสำคัญกับการทำความเข้าใจและตอบสนองความต้องการเฉพาะของลูกค้าแต่ละราย',
      valuesSustainability: 'ความยั่งยืน',
      valuesSustainabilityContent: 'เรามุ่งมั่นในการปฏิบัติที่รับผิดชอบต่อสิ่งแวดล้อมตลอดการดำเนินงานของเรา',
      ourTeam: 'ทีมผู้นำของเรา',
      founderCEO: 'ผู้ก่อตั้งและซีอีโอ',
      operationsDirector: 'ผู้อำนวยการฝ่ายปฏิบัติการ',
      techDirector: 'ผู้อำนวยการฝ่ายเทคโนโลยี',
      salesDirector: 'ผู้อำนวยการฝ่ายขายและการตลาด',
      keyStats: 'สถิติสำคัญ',
      clients: 'ลูกค้าที่พึงพอใจ',
      deliveries: 'การจัดส่งที่สำเร็จ',
      vehicles: 'ยานพาหนะควบคุมอุณหภูมิ',
      countries: 'เมืองที่ให้บริการ',
      certifications: 'ใบรับรองของเรา',
      iso9001: 'ISO 9001 - การจัดการคุณภาพ',
      iso14001: 'ISO 14001 - การจัดการสิ่งแวดล้อม',
      iso45001: 'ISO 45001 - อาชีวอนามัยและความปลอดภัย',
      gdp: 'Good Distribution Practice (GDP) สำหรับเวชภัณฑ์',
      haccp: 'ใบรับรอง HACCP สำหรับความปลอดภัยด้านอาหาร'
    }
  };

  // ใช้ข้อความตามภาษาที่เลือก
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-700 py-20 text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
                <p className="text-xl text-blue-100">{t.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-200" />
                    <span>ISO 9001</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-200" />
                    <span>ISO 14001</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-200" />
                    <span>GDP Certified</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-60 z-10"></div>
                <div className="bg-blue-900 w-full h-full flex items-center justify-center">
                  <Truck className="h-32 w-32 text-blue-200 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.ourStory}</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.storyContent}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.storyContent2}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <Award className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t.ourMission}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t.missionContent}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t.ourVision}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t.visionContent}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.values}</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.valuesIntegrity}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.valuesIntegrityContent}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.valuesInnovation}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.valuesInnovationContent}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.valuesExcellence}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.valuesExcellenceContent}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.valuesCustomerFocus}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.valuesCustomerFocusContent}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.valuesSustainability}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.valuesSustainabilityContent}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics Section */}
        <section className="py-20 bg-blue-600 dark:bg-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4">{t.keyStats}</h2>
              <div className="h-1 w-20 bg-white mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">300+</div>
                <div className="text-blue-200">{t.clients}</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">45,000+</div>
                <div className="text-blue-200">{t.deliveries}</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">120+</div>
                <div className="text-blue-200">{t.vehicles}</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-blue-200">{t.countries}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.ourTeam}</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden text-center group">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Somchai Jaidee</h3>
                  <p className="text-blue-600 dark:text-blue-400">{t.founderCEO}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden text-center group">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wanida Somjai</h3>
                  <p className="text-blue-600 dark:text-blue-400">{t.operationsDirector}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden text-center group">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prasit Techthai</h3>
                  <p className="text-blue-600 dark:text-blue-400">{t.techDirector}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden text-center group">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Naree Saleman</h3>
                  <p className="text-blue-600 dark:text-blue-400">{t.salesDirector}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.certifications}</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-200">{t.iso9001}</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-200">{t.iso14001}</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-200">{t.iso45001}</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                  <Thermometer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-200">{t.gdp}</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-800 dark:text-gray-200">{t.haccp}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}