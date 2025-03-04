import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  // Check if this path should use this middleware
  const pathname = request.nextUrl.pathname;
  
  // Handle specific routes that need to be redirected
  if (pathname.match(/^\/admin\/users\/edit\/\d+$/)) {
    // This handles all /admin/users/edit/:id routes by rewriting them to the catch-all handler
    const url = request.nextUrl.clone();
    url.pathname = `/admin/users/edit_catch_all`;
    return NextResponse.rewrite(url);
  }
  
  // Check if this path is API or static file
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Get language from cookie (if exists)
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