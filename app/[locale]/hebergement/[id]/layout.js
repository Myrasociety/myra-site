const SUITES_META = {
  Edwige:  { surface: '120 m²', surfaceValue: 120, capacity: 4, rooms: 3, image: '/Edwige/1.jpg' },
  Wingert: { surface: '120 m²', surfaceValue: 120, capacity: 4, rooms: 3, image: '/Wingert/1.jpg' },
  Julia:   { surface: '95 m²',  surfaceValue: 95,  capacity: 2, rooms: 2, image: '/Julia/1.jpg' },
};

const META = {
  fr: {
    titleSuffix: '— MYRA Society',
    description: (name, surface) => `Suite privée ${name}, ${surface}. MYRA Society — Marlenheim, Alsace.`,
  },
  en: {
    titleSuffix: '— MYRA Society',
    description: (name, surface) => `Private suite ${name}, ${surface}. MYRA Society — Marlenheim, Alsace.`,
  },
  de: {
    titleSuffix: '— MYRA Society',
    description: (name, surface) => `Privatsuite ${name}, ${surface}. MYRA Society — Marlenheim, Elsass.`,
  },
};

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const meta = SUITES_META[id];
  const m = META[locale] || META.fr;
  if (!meta) {
    return {
      title: `Suite ${m.titleSuffix}`,
      description: m.description(id, ''),
    };
  }
  const title = `Suite ${id} ${m.titleSuffix}`;
  const description = m.description(id, meta.surface);
  const imageUrl = `https://myrasociety.com${meta.image}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://myrasociety.com/${locale}/hebergement/${id}`,
      images: [{ url: imageUrl, width: 1200, height: 800, alt: `MYRA — Suite ${id}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://myrasociety.com/${locale}/hebergement/${id}`,
      languages: {
        'fr-FR': `https://myrasociety.com/fr/hebergement/${id}`,
        'en-US': `https://myrasociety.com/en/hebergement/${id}`,
        'de-DE': `https://myrasociety.com/de/hebergement/${id}`,
      },
    },
  };
}

const BREADCRUMB_LODGING = {
  fr: 'Hébergement',
  en: 'Lodging',
  de: 'Unterkunft',
};

export default async function SuiteLayout({ children, params }) {
  const { locale, id } = await params;
  const meta = SUITES_META[id];

  const suiteJsonLd = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'Suite',
        '@id': `https://myrasociety.com/${locale}/hebergement/${id}#suite`,
        name: `MYRA — ${id}`,
        url: `https://myrasociety.com/${locale}/hebergement/${id}`,
        image: `https://myrasociety.com${meta.image}`,
        floorSize: { '@type': 'QuantitativeValue', value: meta.surfaceValue, unitText: 'm²' },
        numberOfRooms: meta.rooms,
        occupancy: { '@type': 'QuantitativeValue', maxValue: meta.capacity, unitText: 'persons' },
        containedInPlace: { '@id': 'https://myrasociety.com/#lodging' },
      }
    : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'MYRA Society', item: `https://myrasociety.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: BREADCRUMB_LODGING[locale] || BREADCRUMB_LODGING.fr, item: `https://myrasociety.com/${locale}/hebergement` },
      { '@type': 'ListItem', position: 3, name: id, item: `https://myrasociety.com/${locale}/hebergement/${id}` },
    ],
  };

  return (
    <>
      {suiteJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(suiteJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
