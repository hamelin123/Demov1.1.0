// src/components/ThemeProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // เมื่อคอมโพเนนต์ถูกโหลด ดึงค่าธีมจาก localStorage
    const storedTheme = localStorage.getItem('theme') as Theme || 'dark';
    setTheme(storedTheme);
    setMounted(true);
    
    // อัปเดตคลาส HTML ตามธีมที่เก็บไว้
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // อัปเดตคลาส HTML เมื่อมีการเปลี่ยนธีม
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // ส่งเหตุการณ์แจ้งเตือนการเปลี่ยนธีม
    window.dispatchEvent(new Event('themeChange'));
  };

  // ไม่แสดงเนื้อหาจนกว่าจะโหลดธีมเสร็จ เพื่อป้องกัน flashing
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}