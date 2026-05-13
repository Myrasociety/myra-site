const SUITES_SEO = [
  { id: 'Edwige',  name: 'Edwige',  surface: '130 m²', guests: 6 },
  { id: 'Wingert', name: 'Wingert', surface: '90 m²',  guests: 4 },
  { id: 'Julia',   name: 'Julia',   surface: '85 m²',  guests: 4 },
];

const META = {
  fr: {
    title: 'Hébergement — MYRA Society',
    description: 'Suites privatives à Marlenheim, Alsace. Edwige, Wingert, Julia. MYRA Society.',
  },
  en: {
    title: 'Lodging — MYRA Society',
    description: 'Private suites in Marlenheim, Alsace. Edwige, Wingert, Julia. MYRA Society.',
  },
  de: {
    title: 'Unterkunft — MYRA Society',
    description: 'Privatsuiten in Marlenheim, Elsass. Edwige, Wingert, Julia. MYRA Society.',
  },
};

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
      url: `https://myrasociety.com/${locale}/hebergement`,
      images: [{ url: 'https://myrasociety.com/Edwige/1.jpg', width: 1200, height: 800, alt: 'MYRA — Suites' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: ['https://myrasociety.com/Edwige/1.jpg'],
    },
    alternates: {
      canonical: `https://myrasociety.com/${locale}/hebergement`,
      languages: {
        'fr-FR': 'https://myrasociety.com/fr/hebergement',
        'en-US': 'https://myrasociety.com/en/hebergement',
        'de-DE': 'https://myrasociety.com/de/hebergement',
      },
    },
  };
}

export default async function HebergementLayout({ children, params }) {
  const { locale } = await params;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SUITES_SEO.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Suite',
        name: `MYRA — ${s.name}`,
        url: `https://myrasociety.com/${locale}/hebergement/${s.id}`,
        floorSize: { '@type': 'QuantitativeValue', value: s.surface },
        occupancy: { '@type': 'QuantitativeValue', maxValue: s.guests, unitText: 'persons' },
        containedInPlace: { '@id': 'https://myrasociety.com/#lodging' },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {children}
    </>
  );
}
