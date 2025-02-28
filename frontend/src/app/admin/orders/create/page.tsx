'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Truck, Package, ThermometerSnowflake, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { createOrder } from '@/lib/api';

export default function CreateOrderPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_address: '',
    sender_phone: '',
    recipient_name: '',
    recipient_address: '',
    recipient_phone: '',
    package_weight: '',
    package_dimensions: '',
    special_instructions: '',
    temperature_requirements: '',
    estimated_delivery_date: '',
    status: 'pending'
  });

  // Translations
  const translations = {
    th: {
      createOrder: 'สร้างคำสั่งซื้อใหม่',
      backToOrders: 'กลับไปยังคำสั่งซื้อ',
      senderInfo: 'ข้อมูลผู้ส่ง',
      senderName: 'ชื่อผู้ส่ง',
      senderAddress: 'ที่อยู่ผู้ส่ง',
      senderPhone: 'เบอร์โทรผู้ส่ง',
      recipientInfo: 'ข้อมูลผู้รับ',
      recipientName: 'ชื่อผู้รับ',
      recipientAddress: 'ที่อยู่ผู้รับ',
      recipientPhone: 'เบอร์โทรผู้รับ',
      packageInfo: 'ข้อมูลพัสดุ',
      packageWeight: 'น้ำหนัก (กก.)',
      packageDimensions: 'ขนาด (กว้าง x ยาว x สูง ซม.)',
      specialInstructions: 'คำแนะนำพิเศษ',
      temperatureRequirements: 'ข้อกำหนดอุณหภูมิ',
      estimatedDeliveryDate: 'วันที่จัดส่งโดยประมาณ',
      createButton: 'สร้างคำสั่งซื้อ',
      saving: 'กำลังบันทึก...',
      validationError: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      creationError: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ',
      status: 'สถานะ',
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      inTransit: 'กำลังจัดส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิก',
      senderNameRequired: 'กรุณากรอกชื่อผู้ส่ง',
      senderAddressRequired: 'กรุณากรอกที่อยู่ผู้ส่ง',
      senderPhoneRequired: 'กรุณากรอกเบอร์โทรผู้ส่ง',
      recipientNameRequired: 'กรุณากรอกชื่อผู้รับ',
      recipientAddressRequired: 'กรุณากรอกที่อยู่ผู้รับ',
      recipientPhoneRequired: 'กรุณากรอกเบอร์โทรผู้รับ',
      packageWeightRequired: 'กรุณากรอกน้ำหนักพัสดุ',
      requiredField: 'ข้อมูลจำเป็น'
    },
    en: {
      createOrder: 'Create New Order',
      backToOrders: 'Back to Orders',
      senderInfo: 'Sender Information',
      senderName: 'Sender Name',
      senderAddress: 'Sender Address',
      senderPhone: 'Sender Phone',
      recipientInfo: 'Recipient Information',
      recipientName: 'Recipient Name',
      recipientAddress: 'Recipient Address',
      recipientPhone: 'Recipient Phone',
      packageInfo: 'Package Information',
      packageWeight: 'Weight (kg)',
      packageDimensions: 'Dimensions (W x L x H cm)',
      specialInstructions: 'Special Instructions',
      temperatureRequirements: 'Temperature Requirements',
      estimatedDeliveryDate: 'Estimated Delivery Date',
      createButton: 'Create Order',
      saving: 'Saving...',
      validationError: 'Please fill in all required fields',
      creationError: 'Error creating order',
      status: 'Status',
      pending: 'Pending',
      processing: 'Processing',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      senderNameRequired: 'Sender name is required',
      senderAddressRequired: 'Sender address is required',
      senderPhoneRequired: 'Sender phone is required',
      recipientNameRequired: 'Recipient name is required',
      recipientAddressRequired: 'Recipient address is required',
      recipientPhoneRequired: 'Recipient phone is required',
      packageWeightRequired: 'Package weight is required',
      requiredField: 'Required field'
    }
  };

  const t = translations[language] || translations.en;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.sender_name) {
      setError(t.senderNameRequired);
      return false;
    }
    if (!formData.sender_address) {
      setError(t.senderAddressRequired);
      return false;
    }
    if (!formData.sender_phone) {
      setError(t.senderPhoneRequired);
      return false;
    }
    if (!formData.recipient_name) {
      setError(t.recipientNameRequired);
      return false;
    }
    if (!formData.recipient_address) {
      setError(t.recipientAddressRequired);
      return false;
    }
    if (!formData.recipient_phone) {
      setError(t.recipientPhoneRequired);
      return false;
    }
    if (!formData.package_weight) {
      setError(t.packageWeightRequired);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // ในสถานการณ์จริง
      // const response = await createOrder(formData);
      
      // จำลองการสร้างคำสั่งซื้อ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // นำผู้ใช้กลับไปยังหน้ารายการคำสั่งซื้อ
      router.push('/admin/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      setError(t.creationError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.createOrder}</h1>
        <Link
          href="/admin/orders"
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t.backToOrders}
        </Link>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sender Information */}
        <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
            <Truck className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.senderInfo}
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.senderName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sender_name"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="sender_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.senderPhone} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sender_phone"
                name="sender_phone"
                value={formData.sender_phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="sender_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.senderAddress} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="sender_address"
                name="sender_address"
                value={formData.sender_address}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Recipient Information */}
        <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
            <Truck className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.recipientInfo}
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.recipientName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="recipient_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.recipientPhone} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipient_phone"
                name="recipient_phone"
                value={formData.recipient_phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="recipient_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.recipientAddress} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="recipient_address"
                name="recipient_address"
                value={formData.recipient_address}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Package Information */}
        <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900 dark:text-white">
            <Package className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
            {t.packageInfo}
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="package_weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.packageWeight} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                id="package_weight"
                name="package_weight"
                value={formData.package_weight}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="package_dimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.packageDimensions}
              </label>
              <input
                type="text"
                id="package_dimensions"
                name="package_dimensions"
                value={formData.package_dimensions}
                onChange={handleChange}
                placeholder="30x40x20"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.status}
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="pending">{t.pending}</option>
                <option value="processing">{t.processing}</option>
                <option value="in-transit">{t.inTransit}</option>
                <option value="delivered">{t.delivered}</option>
                <option value="cancelled">{t.cancelled}</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <ThermometerSnowflake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <label htmlFor="temperature_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.temperatureRequirements}
                </label>
                <input
                  type="text"
                  id="temperature_requirements"
                  name="temperature_requirements"
                  value={formData.temperature_requirements}
                  onChange={handleChange}
                  placeholder="-18°C"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="estimated_delivery_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.estimatedDeliveryDate}
              </label>
              <input
                type="date"
                id="estimated_delivery_date"
                name="estimated_delivery_date"
                value={formData.estimated_delivery_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-3">
              <label htmlFor="special_instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.specialInstructions}
              </label>
              <textarea
                id="special_instructions"
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-blue-600"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                {t.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                {t.createButton}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}