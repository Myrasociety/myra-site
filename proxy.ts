import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr',
});

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};