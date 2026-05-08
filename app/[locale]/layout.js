import '../../styles/globals.css';
import { serif, sans } from '../../lib/fonts';
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

export default function LocaleLayout({ children, params }) {
  const { locale } = params;

  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable} overflow-x-hidden`}>
      <body className="font-sans overflow-x-hidden" style={{ maxWidth: '100vw' }}>
        <PageLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}