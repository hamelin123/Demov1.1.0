// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProviderWrapper from '@/providers/ThemeProviderWrapper';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ColdChain - Temperature Controlled Logistics',
  description: 'Professional cold chain transportation services with real-time temperature monitoring and GPS tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}