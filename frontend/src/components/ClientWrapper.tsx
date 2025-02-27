'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useTheme } from '@/providers/ThemeProvider';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900"></div>;
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}