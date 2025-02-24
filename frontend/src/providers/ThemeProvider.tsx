'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      themes={['light', 'dark']}
    >
      <NextUIProvider>
        <I18nextProvider i18n={i18n}>
          <div className="min-h-screen transition-colors duration-300">
            {children}
          </div>
        </I18nextProvider>
      </NextUIProvider>
    </NextThemeProvider>
  );
}