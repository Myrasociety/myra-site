const META = {
  fr: {
    title: 'Soutenir — MYRA Society',
    description: 'Devenez membre fondateur du club. MYRA Society — Marlenheim, Alsace.',
  },
  en: {
    title: 'Support — MYRA Society',
    description: 'Become a founding member of the club. MYRA Society — Marlenheim, Alsace.',
  },
  de: {
    title: 'Unterstützen — MYRA Society',
    description: 'Werden Sie Gründungsmitglied des Clubs. MYRA Society — Marlenheim, Elsass.',
  },
};

const OG_IMAGE = 'https://myrasociety.com/Visuels/Attente.jpg';

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
      url: `https://myrasociety.com/${locale}/soutenir`,
      images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: 'MYRA Society' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [OG_IMAGE],
    },
    alternates: {
      canonical: `https://myrasociety.com/${locale}/soutenir`,
      languages: {
        'fr-FR': 'https://myrasociety.com/fr/soutenir',
        'en-US': 'https://myrasociety.com/en/soutenir',
        'de-DE': 'https://myrasociety.com/de/soutenir',
      },
    },
  };
}

export default async function SoutenirLayout({ children, params }) {
  const { locale } = await params;
  const m = META[locale] || META.fr;
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `https://myrasociety.com/${locale}/soutenir`,
    name: m.title,
    description: m.description,
    about: { '@id': 'https://myrasociety.com/#lodging' },
    isPartOf: { '@id': 'https://myrasociety.com/#lodging' },
    inLanguage: locale,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      {children}
    </>
  );
}
