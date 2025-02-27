// src/providers/ThemeProviderWrapper.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';
import { LanguageProvider } from './LanguageProvider';

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}