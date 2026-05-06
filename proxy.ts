import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  const locales = ['fr', 'en', 'de'];
  const hasLocale = locales.some(l => pathname.startsWith(`/${l}`));
  
  if (!hasLocale) {
    return NextResponse.redirect(new URL(`/fr${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};