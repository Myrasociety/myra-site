import { getTranslations } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = getTranslations(locale, 'legal');
  return { title: t('meta_title') };
}

export default async function MentionsLegales({ params }) {
  const { locale } = params;
  const t = getTranslations(locale, 'legal');

  const sections = [
    { title: t('editor_title'), content: 'MYRA Society\n71 rue du Général de Gaulle\n67520 Marlenheim, France\ncontact@myrasociety.com\n+33 (0)6 37 03 86 77' },
    { title: t('hosting_title'), content: t('hosting_text') },
    { title: t('ip_title'), content: t('ip_text') },
    { title: t('liability_title'), content: t('liability_text') },
  ];

  return (
    <main className="bg-[#F3F2EF] min-h-screen">
      <div className="max-w-[860px] mx-auto px-8 md:px-14 pt-44 pb-32">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-8 bg-[rgba(43,16,34,0.35)]" />
          <span className="font-sans text-[8px] uppercase tracking-[0.55em] text-[#2B1022]">
            {t('label')}
          </span>
        </div>
        <h1 className="font-serif text-[48px] md:text-[64px] font-light leading-[0.92] text-[#0C0C0A] mb-20">
          {t('title_line1')}<br /><em>{t('title_line2')}</em>
        </h1>
        <div className="space-y-14 font-sans text-[13px] leading-[2.4] font-light text-[rgba(12,12,10,0.55)]">
          {sections.map((s, i) => (
            <div key={i}>
              <section>
                <h2 className="font-sans text-[9px] uppercase tracking-[0.50em] text-[#0C0C0A] mb-6">{s.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{s.content}</p>
              </section>
              {i < sections.length - 1 && <div className="h-px bg-[rgba(12,12,10,0.06)] mt-14" />}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}