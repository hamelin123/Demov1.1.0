// src/app/staff/temperature/page.tsx
'use client';

import { useState, useEffect } from 'react';
import StaffLayout from '@/components/layouts/StaffLayout';
import { Search, ThermometerSnowflake, TrendingUp, AlertCircle } from 'lucide-react';

export default function TemperaturePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTemperature, setNewTemperature] = useState({
    temperature: '',
    humidity: '',
    notes: ''
  });

  useEffect(() => {
    // ในการใช้งานจริง ควรเรียกจาก API
    const fetchOrders = async () => {
      try {
        // const response = await fetch('/api/orders/active');
        // const data = await response.json();
        // setOrders(data);
        
        // ข้อมูลจำลอง
        setOrders([
          { 
            id: '1', 
            orderNumber: 'CC-20250301-1234', 
            status: 'กำลังขนส่ง', 
            currentTemp: -18.5, 
            minTemp: -20, 
            maxTemp: -18, 
            lastUpdated: '2025-03-01 14:20',
            hasAlert: false
          },
          { 
            id: '2', 
            orderNumber: 'CC-20250301-1235', 
            status: 'กำลังขนส่ง', 
            currentTemp: 5.2, 
            minTemp: 2, 
            maxTemp: 6, 
            lastUpdated: '2025-03-01 14:30',
            hasAlert: false
          },
          { 
            id: '3', 
            orderNumber: 'CC-20250301-1236', 
            status: 'กำลังขนส่ง', 
            currentTemp: 6.8, 
            minTemp: 2, 
            maxTemp: 6, 
            lastUpdated: '2025-03-01 14:15',
            hasAlert: true
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleRecordTemperature = (order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemperature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // จำลองการบันทึกข้อมูล
      console.log('Recording temperature for order:', selectedOrder.orderNumber, newTemperature);
      
      // ในสถานการณ์จริง ส่งข้อมูลไปยัง API
      // await fetch('/api/temperature/log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: selectedOrder.id,
      //     ...newTemperature,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // รีเซ็ตฟอร์ม
      setNewTemperature({
        temperature: '',
        humidity: '',
        notes: ''
      });
      
      setIsFormOpen(false);
      
      // ในการใช้งานจริง ดึงข้อมูลใหม่หลังบันทึก
      // fetchOrders();
      
      // อัปเดตข้อมูลบนหน้าจอ (จำลอง)
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id 
            ? { 
                ...order, 
                currentTemp: parseFloat(newTemperature.temperature), 
                lastUpdated: new Date().toLocaleString('th-TH', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }).replace(',', '')
              } 
            : order
        )
      );
      
    } catch (error) {
      console.error('Error recording temperature:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกอุณหภูมิ');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">บันทึกอุณหภูมิ</h1>
        <p className="text-gray-600 dark:text-gray-400">บันทึกอุณหภูมิสำหรับสินค้าที่อยู่ระหว่างการขนส่ง</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาด้วยหมายเลขพัสดุ"
            className="w-full p-2 pl-10 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${
                order.hasAlert ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="p-4">
              // src/app/staff/temperature/page.tsx (ต่อ)
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {order.orderNumber}
                </h3>
                {order.hasAlert && (
                  <AlertCircle className="text-red-500" size={20} />
                )}
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">สถานะ: {order.status}</p>
                <div className="mt-2 flex items-center">
                  <ThermometerSnowflake className="text-blue-500 mr-2" size={18} />
                  <span className={`text-lg font-medium ${
                    (order.currentTemp > order.maxTemp || order.currentTemp < order.minTemp)
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {order.currentTemp}°C
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ช่วงที่กำหนด: {order.minTemp}°C - {order.maxTemp}°C
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  อัปเดตล่าสุด: {order.lastUpdated}
                </p>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
              <button
                onClick={() => handleRecordTemperature(order)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                บันทึกอุณหภูมิใหม่
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
    
    {/* Modal สำหรับบันทึกอุณหภูมิ */}
    {isFormOpen && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">บันทึกอุณหภูมิ</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">หมายเลขพัสดุ</p>
            <p className="font-medium">{selectedOrder.orderNumber}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ช่วงอุณหภูมิที่กำหนด</p>
            <p className="font-medium">{selectedOrder.minTemp}°C - {selectedOrder.maxTemp}°C</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                อุณหภูมิ (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={newTemperature.temperature}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ความชื้น (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="humidity"
                value={newTemperature.humidity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                บันทึกเพิ่มเติม
              </label>
              <textarea
                name="notes"
                value={newTemperature.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="บันทึกอื่นๆ เช่น สภาพบรรจุภัณฑ์ หรือความผิดปกติที่พบ"
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 dark:border-gray-600 dark:text-gray-300"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </StaffLayout>
);
}