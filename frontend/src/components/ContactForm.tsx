'use client';

import {useState} from 'react';
import {useLanguage} from '@/providers/LanguageProvider';
import {CheckCircle, AlertCircle} from 'lucide-react';

export default function ContactForm() {
  const {language} = useLanguage();
  const [formData, setFormData] = useState({name: '', email: '', subject: '', message: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  
  const tx = {
    en: {
      name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
      send: 'Send Message', sending: 'Sending...',
      success: 'Thank you for your message! We will get back to you soon.',
      error: 'There was an error sending your message. Please try again.'
    },
    th: {
      name: 'ชื่อ', email: 'อีเมล', subject: 'หัวข้อ', message: 'ข้อความ',
      send: 'ส่งข้อความ', sending: 'กำลังส่ง...',
      success: 'ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด',
      error: 'เกิดข้อผิดพลาดในการส่งข้อความของคุณ โปรดลองอีกครั้ง'
    }
  }[language];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({name: '', email: '', subject: '', message: ''});
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{tx.success}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{tx.error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">{tx.name}</label>
        <input
          type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">{tx.email}</label>
        <input
          type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">{tx.subject}</label>
        <input
          type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">{tx.message}</label>
        <textarea
          id="message" name="message" value={formData.message} onChange={handleChange} required rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
        />
      </div>
      
      <button
        type="submit" disabled={isSubmitting}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
          isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? tx.sending : tx.send}
      </button>
    </form>
  );
}