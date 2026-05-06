import '../../styles/globals.css';
import { serif } from '../../lib/fonts';
import { GeistSans } from 'geist/font/sans';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageLoader from '../../components/PageLoader';

export const metadata = {
  title: 'MYRA Society — Private Recovery Club',
  description: 'Not a hotel. A way of living. Marlenheim, France.',
};

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }, { locale: 'de' }];
}

export const dynamic = 'force-static';

export default function LocaleLayout({ children, params }) {
  const { locale } = params;

  return (
    <html lang={locale}
      className={`${GeistSans.variable} ${serif.variable}`}>
      <body className="font-sans overflow-x-hidden">
        <PageLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}