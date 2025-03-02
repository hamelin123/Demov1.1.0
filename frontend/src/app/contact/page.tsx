// src/app/contact/page.tsx
'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme } from 'next-themes';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import GoogleMap from '@/components/GoogleMap';

export default function ContactPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
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
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'en' ? 'Contact Us' : 'ติดต่อเรา'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                {language === 'en' ? 'Contact Information' : 'ข้อมูลการติดต่อ'}
              </h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <Phone className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {language === 'en' ? 'Phone' : 'โทรศัพท์'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">+66 2 123 4567</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {language === 'en' ? 'Email' : 'อีเมล'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@coldchain.example.com</p>
                  </div>
                </div>
                
                {/* Address */}
                <div className="flex items-center space-x-4">
                  <MapPin className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {language === 'en' ? 'Address' : 'ที่อยู่'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Cold Storage Building<br />
                      Digital Park, Sukhumvit Road<br />
                      Bangkok 10110, Thailand
                    </p>
                  </div>
                </div>
                
                {/* Working Hours */}
                <div className="flex items-center space-x-4">
                  <Clock className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {language === 'en' ? 'Working Hours' : 'เวลาทำการ'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday-Friday: 8am - 6pm<br />
                      Saturday: 9am - 3pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'en' ? 'Follow Us' : 'ติดตามเรา'}
                </h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                {language === 'en' ? 'Send Us a Message' : 'ส่งข้อความถึงเรา'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'en' ? 'Name' : 'ชื่อ'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'en' ? 'Email' : 'อีเมล'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'en' ? 'Subject' : 'หัวข้อ'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'en' ? 'Message' : 'ข้อความ'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Send Message' : 'ส่งข้อความ'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              {language === 'en' ? 'Find Us' : 'หาเราให้พบ'}
            </h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg h-96 overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5438175427905!2d100.56295467475735!3d13.756700297975753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ee109dab6e1%3A0xfd15aa1c632d9677!2sSukhumvit%20Road%2C%20Bangkok!5e0!3m2!1sen!2sth!4v1709780892477!5m2!1sen!2sth" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}