import '../../styles/globals.css';
import { serif, sans } from '../../lib/fonts';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageLoader from '../../components/PageLoader';
import SmoothScroll from '../../components/SmoothScroll';

export const metadata = {
  title: 'MYRA Society — Private Recovery Club',
  description: 'Not a hotel. A way of living. Club privé de récupération et d\'hébergement premium. Marlenheim, Alsace.',
  keywords: 'club privé, recovery, hébergement premium, spa, wellness, Alsace, Marlenheim',
  openGraph: {
    title: 'MYRA Society — Private Recovery Club',
    description: 'Not a hotel. A way of living. Club privé de récupération premium en Alsace.',
    url: 'https://myrasociety.com',
    siteName: 'MYRA Society',
    images: [
      {
        url: 'https://myrasociety.com/Complexe/1.jpg',
        width: 1200,
        height: 630,
        alt: 'MYRA Society — Private Recovery Club',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MYRA Society — Private Recovery Club',
    description: 'Not a hotel. A way of living. Club privé de récupération premium en Alsace.',
    images: ['https://myrasociety.com/Complexe/1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://myrasociety.com'),
};

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }, { locale: 'de' }];
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': 'https://myrasociety.com/#lodging',
  name: 'MYRA Society',
  description: 'Club privé de récupération et d\'hébergement premium. Suites privatives, recovery et coaching d\'élite en Alsace.',
  url: 'https://myrasociety.com',
  image: 'https://myrasociety.com/Complexe/1.jpg',
  telephone: '+33637038677',
  priceRange: '€€€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '71 rue du Général de Gaulle',
    addressLocality: 'Marlenheim',
    postalCode: '67520',
    addressRegion: 'Alsace',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.6225,
    longitude: 7.4925,
  },
  sameAs: [
    'https://instagram.com/myra.society',
    'https://www.linkedin.com/company/myra-society',
    'https://tiktok.com/@myra.society',
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Spa & Recovery', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Suites privatives', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Coaching privé', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Restaurant diététique', value: true },
  ],
};

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable} overflow-x-hidden`}>
      <body className="font-sans overflow-x-hidden" style={{ maxWidth: '100vw' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        <PageLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}