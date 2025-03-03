import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
<<<<<<< HEAD
  // ตรวจสอบเส้นทางที่ควรใช้ middleware
  const pathname = request.nextUrl.pathname;
  
  // ข้ามไฟล์ API, ไฟล์ระบบ, และไฟล์สแตติก
=======
  // Check if this path should use this middleware
  const pathname = request.nextUrl.pathname;
  
  // Check if this path is API or static file
>>>>>>> demo
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
<<<<<<< HEAD
  // ดึงภาษาจาก cookie
  const language = request.cookies.get('language')?.value || 'en';
  
  // ตรวจสอบว่าภาษาถูกต้อง
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // เพิ่ม header ภาษา
=======
  // Get language from cookie (if exists)
  const language = request.cookies.get('language')?.value || 'en';
  
  // Check if language is valid
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // Send language in headers
>>>>>>> demo
  const response = NextResponse.next();
  response.headers.set('x-language', validLocale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};