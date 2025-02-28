'use client';

import {useState} from 'react';
import {useLanguage} from '@/providers/LanguageProvider';
import {CheckCircle, AlertCircle} from 'lucide-react';

export default function ContactForm() {
  const {language} = useLanguage();
  const [form, setForm] = useState({name: '', email: '', subject: '', message: ''});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  
  const t = {
    en: {
      name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
      send: 'Send Message', sending: 'Sending...',
      success: 'Thank you for your message! We will get back to you soon.',
      error: 'There was an error sending your message. Please try again.'
    },
    th: {
      name: 'ชื่อ', email: 'อีเมล', subject: 'หัวข้อ', message: 'ข้อความ',
      send: 'ส่งข้อความ', sending: 'กำลังส่ง...',
      success: 'ขอบคุณสำหรับข้อความ! เราจะติดต่อกลับโดยเร็ว',
      error: 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง'
    }
  }[language];
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setForm({name: '', email: '', subject: '', message: ''});
    } catch (error) {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{t.success}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{t.error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">{t.name}</label>
        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">{t.email}</label>
        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">{t.subject}</label>
        <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">{t.message}</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" />
      </div>
      
      <button type="submit" disabled={submitting} className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
        submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
        {submitting ? t.sending : t.send}
      </button>
    </form>
  );
}