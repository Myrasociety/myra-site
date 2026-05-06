import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr',
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};