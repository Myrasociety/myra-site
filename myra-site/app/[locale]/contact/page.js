import ContactSection from '../../../components/Contact';

const TITLE = 'Contact — MYRA Society';
const DESCRIPTION = 'On vous garde une place. Écrivez-nous.';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'website',
      url: `https://myrasociety.com/${locale}/contact`,
      images: [{ url: 'https://myrasociety.com/Complexe/1.jpg', width: 1200, height: 800, alt: 'MYRA Society' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: ['https://myrasociety.com/Complexe/1.jpg'],
    },
    alternates: {
      canonical: `https://myrasociety.com/${locale}/contact`,
      languages: {
        'fr-FR': 'https://myrasociety.com/fr/contact',
        'en-US': 'https://myrasociety.com/en/contact',
        'de-DE': 'https://myrasociety.com/de/contact',
      },
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `https://myrasociety.com/${locale}/contact`,
    name: TITLE,
    mainEntity: { '@id': 'https://myrasociety.com/#lodging' },
  };
  return (
    <main className="bg-[#F4F5F0] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      <div className="pt-0">
        <ContactSection />
      </div>
    </main>
  );
}
