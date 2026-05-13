const META = {
  fr: {
    title: 'Notes — MYRA Society',
    description: "Journal d'une maison qui prend forme. MYRA Society — Marlenheim, Alsace.",
  },
  en: {
    title: 'Notes — MYRA Society',
    description: 'Journal of a house taking shape. MYRA Society — Marlenheim, Alsace.',
  },
  de: {
    title: 'Notes — MYRA Society',
    description: 'Tagebuch eines Hauses, das Form annimmt. MYRA Society — Marlenheim, Elsass.',
  },
};

const OG_IMAGE = 'https://myrasociety.com/Complexe/1.jpg';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = META[locale] || META.fr;
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      type: 'website',
      url: `https://myrasociety.com/${locale}/news`,
      images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: 'MYRA Society' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: `https://myrasociety.com/${locale}/news`,
      languages: {
        'fr-FR': 'https://myrasociety.com/fr/news',
        'en-US': 'https://myrasociety.com/en/news',
        'de-DE': 'https://myrasociety.com/de/news',
      },
    },
  };
}

export default async function NewsLayout({ children, params }) {
  const { locale } = await params;
  const m = META[locale] || META.fr;
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `https://myrasociety.com/${locale}/news`,
    name: m.title,
    description: m.description,
    isPartOf: { '@id': 'https://myrasociety.com/#lodging' },
    inLanguage: locale,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      {children}
    </>
  );
}
