import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr',
  localePrefix: 'always',
});

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};