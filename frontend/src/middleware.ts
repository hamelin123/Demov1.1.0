// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  // Check if this path should use this middleware
  const pathname = request.nextUrl.pathname;
  
  // Check if this path is API or static file
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Get language from cookie or localStorage (if exists)
  const language = request.cookies.get('language')?.value || 'en';
  
  // Check if language is valid
  const validLocale = locales.includes(language as any) ? language : 'en';
  
  // Send language in headers
  const response = NextResponse.next();
  response.headers.set('x-language', validLocale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};