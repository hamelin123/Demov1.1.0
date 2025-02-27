import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  // ตรวจสอบว่าเส้นทางควรจะใช้ middleware นี้หรือไม่
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบว่า path นี้เป็น API หรือไม่
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // ดึงภาษาจาก cookie (ถ้ามี)
  const language = request.cookies.get('language')?.value || 'en';
  
  // ตรวจสอบว่าภาษาที่มีอยู่ถูกต้อง
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // ส่งข้อมูลภาษาใน headers
  const response = NextResponse.next();
  response.headers.set('x-language', validLocale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};