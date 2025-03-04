// frontend/src/app/auth/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ประเภทข้อมูลผู้ใช้
interface User {
  id: string;
  username?: string;
  full_name?: string;
  name?: string;
  email: string;
  role: string;
}

// ข้อมูลบริบทที่จะแบ่งปันในแอป
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

// สร้าง Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  checkTokenValidity: async () => false,
});

// Hook สำหรับใช้งาน Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // โหลดข้อมูลผู้ใช้จาก localStorage เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    setIsLoading(true);
    
    // ตรวจสอบว่าอยู่ใน browser
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (storedUser && token && isLoggedIn) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // ตรวจสอบความถูกต้องของ token เมื่อโหลดแอพ
          checkTokenValidity().catch(() => {
            // กรณี token ไม่ถูกต้อง ให้ล้างข้อมูลออก
            logout(false); // false เพื่อไม่ให้ redirect
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // ตรวจสอบความถูกต้องของ token
  const checkTokenValidity = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      // ตรวจสอบว่า token หมดอายุหรือไม่
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Token ไม่ถูกต้องหรือหมดอายุ
        logout(false); // ไม่ redirect เพื่อป้องกัน loop
        return false;
      }
      
      // อัปเดตข้อมูลผู้ใช้จาก API
      const userData = await response.json();
      if (userData && userData.user) {
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // ฟังก์ชันล็อกอิน
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    
    // ตรวจสอบบทบาทและ redirect ไปยังหน้าที่เหมาะสม
    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (userData.role === 'staff') {
      router.push('/staff/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  // ฟังก์ชันล็อกเอาท์
  const logout = (shouldRedirect = true) => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    
    if (shouldRedirect) {
      router.push('/');
    }
  };

  // ตรวจสอบ token ทุก 5 นาที
  useEffect(() => {
    if (user) {
      const tokenCheckInterval = setInterval(() => {
        checkTokenValidity();
      }, 5 * 60 * 1000);
      
      return () => {
        clearInterval(tokenCheckInterval);
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkTokenValidity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}