'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Package, Truck, MapPin, ThermometerSnowflake, Clock, Home, AlertCircle } from 'lucide-react';

export default function TrackingPage() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('th');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedLanguage = localStorage.getItem('language') || 'th';
    setTheme(storedTheme);
    setLanguage(storedLanguage);
    
    if (storedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    const queryParams = new URLSearchParams(window.location.search);
    const trackingParam = queryParams.get('tracking');
    if (trackingParam) {
      setTrackingNumber(trackingParam);
      handleTrackingSearch(trackingParam);
    }
  }, []);

  const t = {
    th: {
      title: "ติดตามสินค้า", subtitle: "กรอกหมายเลขพัสดุเพื่อติดตามสถานะการขนส่ง",
      placeholder: "กรอกหมายเลขพัสดุ (เช่น TH123456789)", button: "ติดตาม",
      error: "ไม่พบหมายเลขพัสดุในระบบ กรุณาตรวจสอบความถูกต้อง", backToHome: "กลับไปหน้าหลัก",
      shipmentInfo: "ข้อมูลการขนส่ง", orderNumber: "หมายเลขพัสดุ", status: "สถานะ",
      sender: "ผู้ส่ง", recipient: "ผู้รับ", currentTemp: "อุณหภูมิปัจจุบัน",
      currentLocation: "ตำแหน่งปัจจุบัน", eta: "เวลาถึงโดยประมาณ", trackingHistory: "ประวัติการติดตาม",
      loginToView: "เข้าสู่ระบบเพื่อดูข้อมูลเพิ่มเติม", login: "เข้าสู่ระบบ",
      statusMessages: {
        "pending": "รอดำเนินการ", "in-transit": "อยู่ระหว่างการขนส่ง",
        "out-for-delivery": "กำลังจัดส่ง", "delivered": "จัดส่งสำเร็จ", "cancelled": "ยกเลิก"
      },
      time: "เวลา", location: "สถานที่", note: "หมายเหตุ", viewMoreDetails: "ดูรายละเอียดเพิ่มเติม",
      temperatureLog: "บันทึกอุณหภูมิ", minTemp: "อุณหภูมิต่ำสุด", maxTemp: "อุณหภูมิสูงสุด", avgTemp: "อุณหภูมิเฉลี่ย"
    },
    en: {
      title: "Track & Trace", subtitle: "Enter your tracking number to check shipment status",
      placeholder: "Enter tracking number (e.g., TH123456789)", button: "Track",
      error: "Tracking number not found. Please check and try again.", backToHome: "Back to Home",
      shipmentInfo: "Shipment Information", orderNumber: "Tracking Number", status: "Status",
      sender: "Sender", recipient: "Recipient", currentTemp: "Current Temperature",
      currentLocation: "Current Location", eta: "Estimated Arrival", trackingHistory: "Tracking History",
      loginToView: "Login to view more details", login: "Login",
      statusMessages: {
        "pending": "Pending", "in-transit": "In Transit",
        "out-for-delivery": "Out for Delivery", "delivered": "Delivered", "cancelled": "Cancelled"
      },
      time: "Time", location: "Location", note: "Note", viewMoreDetails: "View More Details",
      temperatureLog: "Temperature Log", minTemp: "Minimum Temperature", maxTemp: "Maximum Temperature", avgTemp: "Average Temperature"
    }
  };

  const mockTrackingData = {
    "TH123456789": {
      orderNumber: "TH123456789", status: "in-transit",
      sender: { name: "บริษัท อาหารสด จำกัด", address: "123 ถ.สุขุมวิท กรุงเทพฯ 10110", phone: "02-123-4567" },
      recipient: { name: "โรงแรมแกรนด์พาเลซ", address: "456 ถ.เชียงใหม่-ลำปาง เชียงใหม่ 50000", phone: "053-987-6543" },
      currentTemperature: -18.5, minTemperature: -20.0, maxTemperature: -18.0, currentLocation: "นครราชสีมา",
      eta: "24 กุมภาพันธ์ 2025 15:30 น.",
      history: [
        { time: "22 กุมภาพันธ์ 2025 10:00 น.", location: "คลังสินค้า กรุงเทพฯ", status: "รับพัสดุเข้าระบบ", temperature: -20.0, note: "สินค้าบรรจุในตู้ควบคุมอุณหภูมิเรียบร้อย" },
        { time: "22 กุมภาพันธ์ 2025 11:30 น.", location: "กรุงเทพมหานคร", status: "กำลังจัดส่ง", temperature: -19.5, note: "เริ่มต้นการขนส่ง" },
        { time: "22 กุมภาพันธ์ 2025 17:45 น.", location: "สระบุรี", status: "กำลังจัดส่ง", temperature: -19.2, note: "ผ่านจุดตรวจสอบ" },
        { time: "23 กุมภาพันธ์ 2025 09:30 น.", location: "นครราชสีมา", status: "กำลังจัดส่ง", temperature: -18.5, note: "อยู่ระหว่างการเดินทาง" }
      ],
      temperatureLogs: Array(13).fill(null).map((_, i) => ({
        timestamp: `2025-02-${Math.floor(i/6) + 22}T${(i*2) % 24}:00:00`,
        temperature: -20 + i * 0.1,
        humidity: 63 + i % 4
      }))
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'th' ? 'en' : 'th';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleTrackingSearch = async (number = trackingNumber) => {
    if (!number) {
      setTrackingError(t[language].error);
      return;
    }

    setIsLoading(true);
    setTrackingError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const matchingTrackingKey = Object.keys(mockTrackingData).find(key => 
        key.toUpperCase() === number.trim().toUpperCase()
      );

      if (matchingTrackingKey) {
        setTrackingResult(mockTrackingData[matchingTrackingKey]);
        const newUrl = `${window.location.pathname}?tracking=${matchingTrackingKey}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        setTrackingError(t[language].error);
        setTrackingResult(null);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setTrackingError(t[language].error);
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackingSearch();
  };

  const themeClasses = {
    app: `min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`,
    header: 'p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm',
    button: `px-3 py-1 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
  };

  const renderStatusBadge = (status) => {
    const statusColorMap = {
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'out-for-delivery': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`;
  };

  return (
    <div className={themeClasses.app}>
      {/* Header */}
      <header className={themeClasses.header}>
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <Home size={24} />
          <span className="font-semibold text-lg">{t[language].backToHome}</span>
        </Link>
        <div className="flex gap-4">
          <button onClick={toggleLanguage} className={themeClasses.button}>
            {language === 'th' ? 'EN' : 'ไทย'}
          </button>
          <button onClick={toggleTheme} className={themeClasses.button}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tracking Form */}
          <div className={`mb-10 p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h1 className="text-3xl font-bold mb-4 text-center">{t[language].title}</h1>
            <p className="text-center mb-6 text-gray-500 dark:text-gray-400">{t[language].subtitle}</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t[language].placeholder}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search size={20} className="mr-2" />
                    {t[language].button}
                  </>
                )}
              </button>
            </form>
            
            {trackingError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{trackingError}</span>
              </div>
            )}
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="space-y-8">
              {/* Shipment Info Card */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Package size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                  {t[language].shipmentInfo}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].orderNumber}</div>
                      <div className="font-medium">{trackingResult.orderNumber}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].status}</div>
                      <div>
                        <span className={renderStatusBadge(trackingResult.status)}>
                          {t[language].statusMessages[trackingResult.status] || trackingResult.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].sender}</div>
                      <div className="font-medium">{trackingResult.sender.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{trackingResult.sender.address}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].recipient}</div>
                      <div className="font-medium">{trackingResult.recipient.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{trackingResult.recipient.address}</div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].currentTemp}</div>
                      <div className="flex items-center">
                        <ThermometerSnowflake className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
                        <span className="font-medium">{trackingResult.currentTemperature}°C</span>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{t[language].minTemp}: {trackingResult.minTemperature}°C</span>
                        <span>{t[language].maxTemp}: {trackingResult.maxTemperature}°C</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].currentLocation}</div>
                      <div className="flex items-center">
                        <MapPin className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
                        <span className="font-medium">{trackingResult.currentLocation}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t[language].eta}</div>
                      <div className="flex items-center">
                        <Clock className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
                        <span className="font-medium">{trackingResult.eta}</span>
                      </div>
                    </div>

                    <div>
                      <Link href="/login" className={`mt-4 inline-flex items-center text-sm font-medium ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {t[language].loginToView}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tracking History */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Truck size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                  {t[language].trackingHistory}
                </h2>
                
                <div className="relative">
                  <div className={`absolute h-full left-5 ${theme === 'dark' ? 'border-l border-gray-700' : 'border-l border-gray-300'}`}></div>
                  
                  <div className="space-y-8 relative">
                    {trackingResult.history.map((event, index) => (
                      <div key={index} className="ml-10 relative">
                        <div className={`absolute -left-14 mt-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${
                            event.status === 'รับพัสดุเข้าระบบ' || event.status === 'Order Created'
                              ? 'bg-green-500' : 'bg-blue-500'}`}
                          ></div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <h3 className="text-lg font-medium">{event.status}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{event.time}</span>
                          </div>
                          <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                            <MapPin size={16} className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                            <ThermometerSnowflake size={16} className="mr-1" />
                            <span>{event.temperature}°C</span>
                          </div>
                          {event.note && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{event.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Temperature Graph Placeholder */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <ThermometerSnowflake size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                  {t[language].temperatureLog}
                </h2>
                
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'th' 
                      ? 'กราฟอุณหภูมิจะแสดงที่นี่ (จำเป็นต้องใช้ library เช่น Chart.js)' 
                      : 'Temperature graph will be displayed here (requires a library like Chart.js)'}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {['minTemp', 'maxTemp', 'avgTemp'].map((key) => {
                    const temps = trackingResult.temperatureLogs.map(log => log.temperature);
                    const value = key === 'minTemp' ? Math.min(...temps) :
                                  key === 'maxTemp' ? Math.max(...temps) :
                                  (temps.reduce((sum, val) => sum + val, 0) / temps.length).toFixed(1);
                    
                    return (
                      <div key={key} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{t[language][key]}</div>
                        <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">{value}°C</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            © 2025 ColdChain Logistics. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved'}.
          </p>
        </div>
      </footer>
    </div>
  );
}