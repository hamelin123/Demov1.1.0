// src/app/services/page.tsx
'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { ThermometerSnowflake, BarChart3, Warehouse, Package, Shield, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ServicesPage() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="animate-pulse h-screen"></div>
      </div>
      <Footer />
    </div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {language === 'en' ? 'Our Services' : 'บริการของเรา'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Temperature-Controlled Transportation */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 mx-auto">
                <ThermometerSnowflake size={32} className="text-blue-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Temperature-Controlled Transportation' : 'การขนส่งแบบควบคุมอุณหภูมิ'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en' 
                  ? 'Safe and reliable transportation solutions for temperature-sensitive products with precise temperature control.'
                  : 'โซลูชันการขนส่งที่ปลอดภัยและเชื่อถือได้สำหรับผลิตภัณฑ์ที่ไวต่ออุณหภูมิด้วยการควบคุมอุณหภูมิที่แม่นยำ'}
              </p>
            </div>
            
            {/* Temperature Monitoring */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mb-4 mx-auto">
                <BarChart3 size={32} className="text-green-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Temperature Monitoring' : 'การติดตามอุณหภูมิ'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en'
                  ? 'Real-time temperature monitoring systems to ensure product integrity throughout the supply chain.'
                  : 'ระบบติดตามอุณหภูมิแบบเรียลไทม์เพื่อให้มั่นใจในความสมบูรณ์ของผลิตภัณฑ์ตลอดห่วงโซ่อุปทาน'}
              </p>
            </div>
            
            {/* Cold Storage Warehousing */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full mb-4 mx-auto">
                <Warehouse size={32} className="text-purple-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Cold Storage Warehousing' : 'คลังสินค้าห้องเย็น'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en'
                  ? 'Temperature-controlled warehousing facilities for short and long-term storage needs.'
                  : 'สิ่งอำนวยความสะดวกในการจัดเก็บควบคุมอุณหภูมิสำหรับความต้องการจัดเก็บระยะสั้นและระยะยาว'}
              </p>
            </div>
            
            {/* Specialized Packaging */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-800 rounded-full mb-4 mx-auto">
                <Package size={32} className="text-yellow-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Specialized Packaging' : 'บรรจุภัณฑ์เฉพาะทาง'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en'
                  ? 'Innovative packaging solutions designed to maintain temperature requirements during transit.'
                  : 'โซลูชันบรรจุภัณฑ์นวัตกรรมที่ออกแบบมาเพื่อรักษาข้อกำหนดด้านอุณหภูมิระหว่างการขนส่ง'}
              </p>
            </div>
            
            {/* Cold Chain Consulting */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full mb-4 mx-auto">
                <UserCog size={32} className="text-red-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Cold Chain Consulting' : 'ที่ปรึกษาซัพพลายเชนความเย็น'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en'
                  ? 'Expert advice on optimizing your cold chain logistics for maximum efficiency and compliance.'
                  : 'คำแนะนำจากผู้เชี่ยวชาญในการปรับโลจิสติกส์ซัพพลายเชนความเย็นให้เหมาะสมเพื่อประสิทธิภาพและการปฏิบัติตามกฎระเบียบสูงสุด'}
              </p>
            </div>
            
            {/* Quality Assurance */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-800 rounded-full mb-4 mx-auto">
                <Shield size={32} className="text-indigo-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
                {language === 'en' ? 'Quality Assurance' : 'การประกันคุณภาพ'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {language === 'en'
                  ? 'Comprehensive quality management systems to ensure regulatory compliance and product safety.'
                  : 'ระบบการจัดการคุณภาพที่ครอบคลุมเพื่อให้มั่นใจในการปฏิบัติตามกฎระเบียบและความปลอดภัยของผลิตภัณฑ์'}
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              {language === 'en' ? 'Industries We Serve' : 'อุตสาหกรรมที่เราให้บริการ'}
            </h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-lg p-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Pharmaceutical' : 'ยาและเวชภัณฑ์'}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Food & Beverage' : 'อาหารและเครื่องดื่ม'}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Biotech & Life Sciences' : 'เทคโนโลยีชีวภาพและวิทยาศาสตร์ชีวิต'}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Chemical Products' : 'ผลิตภัณฑ์เคมี'}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Flowers & Plants' : 'ดอกไม้และพืช'}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'en' ? 'Medical Supplies' : 'อุปกรณ์ทางการแพทย์'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}