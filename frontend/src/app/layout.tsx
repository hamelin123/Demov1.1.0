import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers/ThemeProvider';
import { ClientWrapper } from '@/components/ClientWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'ColdChain - Premium Temperature Controlled Logistics',
  description: 'Professional cold chain transportation services with real-time temperature monitoring and GPS tracking',
  keywords: ['cold chain', 'logistics', 'temperature controlled', 'transportation', 'refrigerated transport'],
  openGraph: {
    title: 'ColdChain - Premium Temperature Controlled Logistics',
    description: 'Professional cold chain transportation services with real-time monitoring',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColdChain - Premium Temperature Controlled Logistics',
    description: 'Professional cold chain transportation services with real-time monitoring',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}