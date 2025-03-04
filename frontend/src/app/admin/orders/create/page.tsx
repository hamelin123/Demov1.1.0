'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, MapPin, Phone, Thermometer, Package, Truck, Clock, AlertCircle, Plus, Trash, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function CreateOrderPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: '', quantity: 1, weight: '', temperature: '-18 to -20°C' }
  ]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_address: '',
    delivery_address: '',
    pickup_date: '',
    delivery_date: '',
    notes: ''
  });

  const translations = {
    th: {
      createOrder: 'สร้างคำสั่งซื้อใหม่',
      backToOrders: 'กลับไปยังคำสั่งซื้อ',
      customerInfo: 'ข้อมูลลูกค้า',
      name: 'ชื่อลูกค้า',
      namePlaceholder: 'กรอกชื่อลูกค้า',
      email: 'อีเมล',
      emailPlaceholder: 'กรอกอีเมลลูกค้า',
      phone: 'หมายเลขโทรศัพท์',
      phonePlaceholder: 'กรอกหมายเลขโทรศัพท์',
      shippingInfo: 'ข้อมูลการจัดส่ง',
      pickupAddress: 'ที่อยู่รับสินค้า',
      pickupAddressPlaceholder: 'กรอกที่อยู่ต้นทาง',
      deliveryAddress: 'ที่อยู่จัดส่ง',
      deliveryAddressPlaceholder: 'กรอกที่อยู่ปลายทาง',
      pickupDate: 'วันที่รับสินค้า',
      deliveryDate: 'วันที่ส่งสินค้า',
      orderItems: 'รายการสินค้า',
      itemName: 'ชื่อสินค้า',
      quantity: 'จำนวน',
      weight: 'น้ำหนัก (กก.)',
      temperature: 'อุณหภูมิที่ต้องการ',
      addItem: 'เพิ่มสินค้า',
      notes: 'หมายเหตุ',
      notesPlaceholder: 'หมายเหตุเพิ่มเติม',
      cancel: 'ยกเลิก',
      create: 'สร้าง',
      nameRequired: 'กรุณากรอกชื่อลูกค้า',
      emailRequired: 'กรุณากรอกอีเมล',
      emailInvalid: 'รูปแบบอีเมลไม่ถูกต้อง',
      phoneRequired: 'กรุณากรอกหมายเลขโทรศัพท์',
      phoneInvalid: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง',
      pickupAddressRequired: 'กรุณากรอกที่อยู่รับสินค้า',
      deliveryAddressRequired: 'กรุณากรอกที่อยู่จัดส่ง',
      pickupDateRequired: 'กรุณาเลือกวันที่รับสินค้า',
      deliveryDateRequired: 'กรุณาเลือกวันที่ส่งสินค้า',
      createSuccess: 'สร้างคำสั่งซื้อสำเร็จ',
      createError: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ'
    },
    en: {
      createOrder: 'Create New Order',
      backToOrders: 'Back to Orders',
      customerInfo: 'Customer Information',
      name: 'Customer Name',
      namePlaceholder: 'Enter customer name',
      email: 'Email',
      emailPlaceholder: 'Enter customer email',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter phone number',
      shippingInfo: 'Shipping Information',
      pickupAddress: 'Pickup Address',
      pickupAddressPlaceholder: 'Enter pickup address',
      deliveryAddress: 'Delivery Address',
      deliveryAddressPlaceholder: 'Enter delivery address',
      pickupDate: 'Pickup Date',
      deliveryDate: 'Delivery Date',
      orderItems: 'Order Items',
      itemName: 'Item Name',
      quantity: 'Quantity',
      weight: 'Weight (kg)',
      temperature: 'Required Temperature',
      addItem: 'Add Item',
      notes: 'Notes',
      notesPlaceholder: 'Additional notes',
      cancel: 'Cancel',
      create: 'Create',
      nameRequired: 'Customer name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Invalid phone number format',
      pickupAddressRequired: 'Pickup address is required',
      deliveryAddressRequired: 'Delivery address is required',
      pickupDateRequired: 'Pickup date is required',
      deliveryDateRequired: 'Delivery date is required',
      createSuccess: 'Order created successfully',
      createError: 'Error creating order'
    }
  };

  const t = translations[language] || translations.en;

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^(\+\d{1,3}[- ]?)?(\d{8,15})$/;
    return re.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    const newItemId = Math.max(...orderItems.map(item => item.id), 0) + 1;
    setOrderItems([
      ...orderItems,
      { id: newItemId, name: '', quantity: 1, weight: '', temperature: '-18 to -20°C' }
    ]);
  };

  const removeItem = (id) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.customer_name) {
      setError(t.nameRequired);
      return;
    }
    if (!formData.customer_email) {
      setError(t.emailRequired);
      return;
    }
    if (!validateEmail(formData.customer_email)) {
      setError(t.emailInvalid);
      return;
    }
    if (!formData.customer_phone) {
      setError(t.phoneRequired);
      return;
    }
    if (!validatePhone(formData.customer_phone)) {
      setError(t.phoneInvalid);
      return;
    }
    if (!formData.pickup_address) {
      setError(t.pickupAddressRequired);
      return;
    }
    if (!formData.delivery_address) {
      setError(t.deliveryAddressRequired);
      return;
    }
    if (!formData.pickup_date) {
      setError(t.pickupDateRequired);
      return;
    }
    if (!formData.delivery_date) {
      setError(t.deliveryDateRequired);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Prepare data to send
      const orderData = {
        ...formData,
        items: orderItems.map(({ id, ...item }) => item) // Remove the id from items
      };

      console.log('Creating order:', orderData);
      
      // In real implementation, call API
      // const response = await fetch('/api/admin/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create order');
      // }
      
      setSuccess(t.createSuccess);
      
      // Redirect to orders list after 2 seconds
      setTimeout(() => {
        router.push('/admin/orders');
      }, 2000);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(t.createError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.createOrder}</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-300">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.customerInfo}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.name}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.namePlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.phone}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="customer_phone"
                  name="customer_phone"
                  type="text"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.phonePlaceholder}
                />
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 pt-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.shippingInfo}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pickup_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.pickupAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="pickup_address"
                  name="pickup_address"
                  value={formData.pickup_address}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.pickupAddressPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.deliveryAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="delivery_address"
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t.deliveryAddressPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pickup_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.pickupDate}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="pickup_date"
                  name="pickup_date"
                  type="date"
                  value={formData.pickup_date}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.deliveryDate}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 pt-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t.orderItems}</h2>
          </div>

          {orderItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
              <div className="md:col-span-5">
                <label htmlFor={`item-name-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.itemName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id={`item-name-${item.id}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`item-quantity-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.quantity}
                </label>
                <input
                  id={`item-quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`item-weight-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.weight}
                </label>
                <input
                  id={`item-weight-${item.id}`}
                  type="text"
                  value={item.weight}
                  onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`item-temp-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.temperature}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Thermometer className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id={`item-temp-${item.id}`}
                    value={item.temperature}
                    onChange={(e) => handleItemChange(item.id, 'temperature', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="-18 to -20°C">-18 to -20°C</option>
                    <option value="2 to 6°C">2 to 6°C</option>
                    <option value="10 to 15°C">10 to 15°C</option>
                    <option value="Ambient">Ambient</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="py-2 px-2 rounded text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  disabled={orderItems.length <= 1}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t.addItem}
          </button>

          {/* Notes */}
          <div className="pt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.notes}
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="block w-full pl-3 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t.notesPlaceholder}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/admin/orders"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t.cancel}
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.create}...
                </div>
              ) : t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
สร้างหน้า admin/temperature/alerts/page.tsx gen ต่อสิ