import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  // ตรวจสอบเส้นทางที่ควรใช้ middleware
  const pathname = request.nextUrl.pathname;
  
  // ข้ามไฟล์ API, ไฟล์ระบบ, และไฟล์สแตติก
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // ดึงภาษาจาก cookie
  const language = request.cookies.get('language')?.value || 'en';
  
  // ตรวจสอบว่าภาษาถูกต้อง
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // เพิ่ม header ภาษา
  const response = NextResponse.next();
  response.headers.set('x-language', validLocale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};