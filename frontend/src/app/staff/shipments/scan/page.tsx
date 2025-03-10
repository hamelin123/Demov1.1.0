'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { QrCode, Camera, X, ArrowLeft, Check, Truck } from 'lucide-react';

export default function ScanShipmentPage() {
  const [mode, setMode] = useState('manual'); // 'manual' หรือ 'scan'
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = ค้นหา, 2 = ข้อมูล/อัปเดต, 3 = ยืนยัน
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');
  
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  // ถ้าไม่ใช่ staff หรือ admin
  if (user?.role !== 'staff' && user?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }
  
  // จำลองการสแกน QR Code
  useEffect(() => {
    if (mode === 'scan' && videoRef.current) {
      // ในการใช้งานจริง จะต้องใช้ไลบรารีอ่าน QR Code เช่น jsQR หรือ zxing
      // สำหรับตัวอย่างนี้ เราจะจำลองการสแกน
      const simulateScan = setTimeout(() => {
        // สุ่มหมายเลขพัสดุ
        const fakeOrderNumber = `CC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrderNumber(fakeOrderNumber);
        handleSearch();
      }, 3000);
      
      return () => clearTimeout(simulateScan);
    }
  }, [mode]);
  
  const handleSearch = async () => {
    if (!orderNumber) {
      setError(language === 'en' ? 'Please enter a tracking number' : 'กรุณากรอกหมายเลขพัสดุ');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // จำลองการเรียก API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ข้อมูลจำลอง
      setOrderDetails({
        id: '12345',
        orderNumber,
        status: language === 'en' ? 'Ready for shipping' : 'รอการจัดส่ง',
        sender: {
          name: language === 'en' ? 'Cold Food Company Ltd.' : 'บริษัท อาหารเย็น จำกัด',
          address: language === 'en' ? 'Bangkok' : 'กรุงเทพมหานคร'
        },
        recipient: {
          name: language === 'en' ? 'Grand Palace Hotel' : 'โรงแรมแกรนด์พาเลซ',
          address: language === 'en' ? 'Chiang Mai' : 'เชียงใหม่'
        },
        temperatureRange: {
          min: -20,
          max: -18
        },
        packageDetails: {
          weight: '15.5 kg',
          dimensions: '40x30x25 cm'
        }
      });
      
      setStep(2);
    } catch (error) {
      console.error('Error searching order:', error);
      setError(language === 'en' ? 'Shipment not found. Please check tracking number.' : 'ไม่พบข้อมูลพัสดุ โปรดตรวจสอบหมายเลขพัสดุอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ข้อมูลที่จะส่งไปยัง API
      const updateData = {
        orderId: orderDetails.id,
        status: language === 'en' ? 'In transit' : 'กำลังขนส่ง',
        location,
        notes,
        temperature: temperature ? parseFloat(temperature) : null
      };
      
      console.log('Updating shipment:', updateData);
      
      // ในสถานการณ์จริง ส่งข้อมูลไปยัง API
      // await fetch('/api/shipments/update-status', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData)
      // });
      
      setStep(3);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating shipment:', error);
      setError(language === 'en' ? 'Error updating shipment information' : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinish = () => {
    router.push('/staff/shipments');
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Scan Shipment' : 'สแกนพัสดุ'}
        </h1>
      </div>
      
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                <button
                  onClick={() => setMode('manual')}
                  className={`px-4 py-2 rounded-l-lg ${
                    mode === 'manual' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Truck className="mr-2" size={18} />
                    {language === 'en' ? 'Manual Entry' : 'กรอกเอง'}
                  </div>
                </button>
                <button
                  onClick={() => setMode('scan')}
                  className={`px-4 py-2 rounded-r-lg ${
                    mode === 'scan' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <QrCode className="mr-2" size={18} />
                    {language === 'en' ? 'Scan QR' : 'สแกน QR'}
                  </div>
                </button>
              </div>
            </div>
            
            {mode === 'manual' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language === 'en' ? 'Tracking Number' : 'หมายเลขพัสดุ'}
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. CC-20250301-1234' : 'เช่น CC-20250301-1234'}
                  className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="mb-4 relative mx-auto w-64 h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {videoRef.current ? (
                    <video 
                      ref={videoRef} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Waiting for QR Code...' : 'กำลังรอสแกน QR Code...'}
                </p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex items-center">
                <X className="mr-2" size={18} />
                {error}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              disabled={loading || !orderNumber}
              className={`px-4 py-2 rounded-lg ${
                loading || !orderNumber 
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (language === 'en' ? 'Searching...' : 'กำลังค้นหา...') : (language === 'en' ? 'Search' : 'ค้นหา')}
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && orderDetails && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Shipment Information' : 'ข้อมูลพัสดุ'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Tracking Number' : 'หมายเลขพัสดุ'}
              </p>
              <p className="font-medium">{orderDetails.orderNumber}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Current Status' : 'สถานะปัจจุบัน'}
              </p>
              <p className="font-medium">{orderDetails.status}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Sender' : 'ข้อมูลผู้ส่ง'}
              </p>
              <p className="font-medium">{orderDetails.sender.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{orderDetails.sender.address}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Recipient' : 'ข้อมูลผู้รับ'}
              </p>
              <p className="font-medium">{orderDetails.recipient.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{orderDetails.recipient.address}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Temperature Range' : 'ช่วงอุณหภูมิที่กำหนด'}
              </p>
              <p className="font-medium">{orderDetails.temperatureRange.min}°C - {orderDetails.temperatureRange.max}°C</p>
            </div>
            
            <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Package Details' : 'รายละเอียดพัสดุ'}
              </p>
              <p className="font-medium">{orderDetails.packageDetails.weight}, {orderDetails.packageDetails.dimensions}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-medium mb-4">
              {language === 'en' ? 'Update Shipment Status' : 'อัปเดตสถานะการขนส่ง'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Current Location' : 'ตำแหน่งปัจจุบัน'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={language === 'en' ? 'e.g. Bangkok Warehouse, Nakhon Ratchasima Checkpoint' : 'เช่น คลังสินค้ากรุงเทพ, ด่านตรวจนครราชสีมา'}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Current Temperature (°C)' : 'อุณหภูมิปัจจุบัน (°C)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={language === 'en' ? 'e.g. -18.5 or 4.2' : 'เช่น -18.5 หรือ 4.2'}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'en' ? 'Additional Notes' : 'บันทึกเพิ่มเติม'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={language === 'en' ? 'Additional notes about shipment status' : 'บันทึกเพิ่มเติมเกี่ยวกับสถานะการขนส่ง'}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 dark:border-gray-600 dark:text-gray-300"
              >
                {language === 'en' ? 'Back' : 'ย้อนกลับ'}
              </button>
              <button
                type="submit"
                disabled={loading || !location}
                className={`px-4 py-2 rounded-lg ${
                  loading || !location 
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (language === 'en' ? 'Updating...' : 'กำลังบันทึก...') : (language === 'en' ? 'Update Status' : 'อัปเดตสถานะ')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {step === 3 && success && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {language === 'en' ? 'Update Successful' : 'บันทึกข้อมูลสำเร็จ'}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? `Shipment status for ${orderDetails.orderNumber} has been updated successfully.` 
              : `อัปเดตสถานะการขนส่งสำหรับพัสดุหมายเลข ${orderDetails.orderNumber} เรียบร้อยแล้ว`}
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setOrderNumber('');
                setOrderDetails(null);
                setLocation('');
                setNotes('');
                setTemperature('');
                setSuccess(false);
                setStep(1);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg dark:border-gray-600 dark:text-gray-300"
            >
              {language === 'en' ? 'Scan Another Shipment' : 'สแกนพัสดุอื่น'}
            </button>
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {language === 'en' ? 'Back to Shipments' : 'กลับไปหน้ารายการ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}