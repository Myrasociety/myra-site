import '../../styles/globals.css';
import { serif } from '../../lib/fonts';
import { GeistSans } from 'geist/font/sans';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageTransition from '../../components/PageTransition';
import PageLoader from '../../components/PageLoader';
import { NextIntlClientProvider } from 'next-intl';

export const metadata = {
  title: 'MYRA Society — Private Recovery Club',
  description: 'Not a hotel. A way of living. Marlenheim, France.',
};

const LOCALES = ['fr', 'en', 'de'];

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const safeLocale = LOCALES.includes(locale) ? locale : 'fr';
  const messages   = (await import(`../../messages/${safeLocale}.json`)).default;

  return (
    <html lang={safeLocale} data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${serif.variable}`}>
      <body className="font-sans overflow-x-hidden">
        <NextIntlClientProvider  locale={safeLocale} messages={messages}>
          <PageLoader />
          <Navbar />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}