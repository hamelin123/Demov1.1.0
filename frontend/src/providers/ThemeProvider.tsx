'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Effect for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      themes={['light', 'dark']}
    >
      {children}
    </NextThemeProvider>
  );
}