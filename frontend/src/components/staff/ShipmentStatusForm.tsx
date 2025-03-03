// src/components/staff/ShipmentStatusForm.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const statusOptions = [
  'พร้อมจัดส่ง',
  'กำลังขนส่ง',
  'ถึงสถานีขนส่ง',
  'กำลังนำส่ง',
  'จัดส่งสำเร็จ',
  'มีปัญหาในการจัดส่ง'
];

export default function ShipmentStatusForm({ shipment, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    status: shipment.status,
    location: shipment.location,
    notes: '',
    temperature: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // จำลองการเรียก API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({
        ...formData,
        shipmentId: shipment.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="absolute top-4 right-4">
        <button 
          type="button" 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">หมายเลขพัสดุ</p>
        <p className="font-medium">{shipment.orderNumber}</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          สถานะ
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          ตำแหน่ง
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          อุณหภูมิ (°C)
        </label>
        <input
          type="number"
          step="0.1"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          placeholder="เช่น 4.5 หรือ -18.2"
          className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">*ไม่จำเป็นต้องกรอกหากไม่เกี่ยวข้องกับการอัปเดตนี้</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          บันทึกเพิ่มเติม
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="รายละเอียดเพิ่มเติม..."
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 dark:border-gray-600 dark:text-gray-300"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-400"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
}