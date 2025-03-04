import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  // ตรวจสอบว่าเส้นทางนี้ควรใช้ middleware นี้หรือไม่
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบว่าเส้นทางนี้เป็น API หรือไฟล์สถิติหรือไม่
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // รับภาษาจากคุกกี้ (ถ้ามี)
  const language = request.cookies.get('language')?.value || 'en';
  
  // ตรวจสอบว่าภาษาถูกต้องหรือไม่
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // ส่งภาษาในส่วนหัว
  const response = NextResponse.next();
  response.headers.set('x-language', validLocale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};