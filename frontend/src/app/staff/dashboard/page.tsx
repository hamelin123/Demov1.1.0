// src/app/staff/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/layouts/StaffLayout';
import { useAuth } from '@/providers/AuthProvider';

export default function StaffDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // ตรวจสอบสิทธิ์การเข้าถึง
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'staff') {
      router.push('/dashboard');
      return;
    }
    
    setLoading(false);
  }, [isAuthenticated, user, router]);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold mb-4">แดชบอร์ดสำหรับพนักงาน</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">อัปเดตข้อมูลการขนส่ง</h2>
          <p>อัปเดตสถานะและตำแหน่งของสินค้าที่กำลังขนส่ง</p>
          <button 
            onClick={() => router.push('/staff/shipments')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            จัดการการขนส่ง
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">บันทึกอุณหภูมิ</h2>
          <p>บันทึกข้อมูลอุณหภูมิของสินค้าระหว่างการขนส่ง</p>
          <button 
            onClick={() => router.push('/staff/temperature')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            บันทึกอุณหภูมิ
          </button>
        </div>
      </div>
    </StaffLayout>
  );
}