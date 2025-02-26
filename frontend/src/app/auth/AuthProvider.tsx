'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ประเภทข้อมูลผู้ใช้
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ข้อมูลบริบทที่จะแบ่งปันในแอป
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// สร้าง Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// Hook สำหรับใช้งาน Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // โหลดข้อมูลผู้ใช้จาก localStorage เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    setIsLoading(true);
    
    // ตรวจสอบว่าอยู่ใน browser
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // ฟังก์ชันล็อกอิน
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  };

  // ฟังก์ชันล็อกเอาท์
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};