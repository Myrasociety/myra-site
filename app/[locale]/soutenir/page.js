'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/useTranslations';

const INK  = '#0C0C0A';
const WINE = '#2B1022';
const ASH  = 'rgba(12,12,10,0.42)';
const BONE = 'rgba(12,12,10,0.06)';
const EXPO = [0.16, 1, 0.3, 1];
const EASE = [0.19, 1, 0.22, 1];

function R({ children, d = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const io  = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={io ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, ease: EASE, delay: d }}>
      {children}
    </motion.div>
  );
}

function Cap({ children, light = false, accent = false, className = '' }) {
  return (
    <span className={`inline-block font-sans text-[11px] tracking-[0.55em] uppercase ${accent ? 'text-[#2B1022]' : light ? 'text-[rgba(244,245,240,0.38)]' : 'text-[rgba(12,12,10,0.35)]'} ${className}`}>
      {children}
    </span>
  );
}

function Trait({ light = false, className = '' }) {
  return <div className={`h-px w-8 flex-shrink-0 ${className}`}
    style={{ backgroundColor: light ? 'rgba(244,245,240,0.15)' : 'rgba(43,16,34,0.35)' }} />;
}

// ════════════════════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════════════════════
function Hero() {
  const t = useTranslations('soutenir');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#0C0C0A]"
      style={{ height: '100dvh', minHeight: 640 }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img src="/Complexe/6.jpg" alt="MYRA"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.50) grayscale(18%)' }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A]/55 via-transparent to-[#0C0C0A]/90" />

      <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
        style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}>
          <h1 className="font-serif font-light italic text-[#F3F2EF] leading-[0.92] tracking-[-0.02em] mb-16"
            style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}>
            {t('hero_title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <motion.a href="/Pitch Deck.pdf" download
            whileHover={{ scale: 1.04 }}
            className="font-sans inline-flex items-center gap-5 px-10 py-5 border border-[rgba(244,245,240,0.22)] hover:border-[#2B1022] backdrop-blur-md bg-[rgba(244,245,240,0.06)] hover:bg-[rgba(43,16,34,0.20)] transition-all duration-500">
            <span className="text-[#F3F2EF] text-[11px] tracking-[0.30em] uppercase">{t('hero_download')}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V8M6 8L3 5M6 8L9 5M1 11H11" stroke="#F3F2EF" strokeWidth="1.2" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 inset-x-10 md:inset-x-16 flex justify-between items-end border-t border-[rgba(244,245,240,0.05)] pt-8">
        <div>
          <Cap light className="block mb-1.5 opacity-50">{t('hero_lieu')}</Cap>
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[rgba(244,245,240,0.50)]">{t('hero_lieu_val')}</span>
        </div>
        <div className="text-right">
          <Cap light className="block mb-1.5 opacity-50">{t('hero_edition')}</Cap>
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[rgba(244,245,240,0.50)]">{t('hero_edition_val')}</span>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GENÈSE
// ════════════════════════════════════════════════════════════════════════════
function Genese() {
  const t = useTranslations('soutenir');
  return (
    <section className="bg-[] py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="flex items-center gap-8 mb-16">
          <div className="h-px flex-1" style={{ backgroundColor: 'rgba(12,12,10,0.06)' }} />
          <span className="font-sans text-[9px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.18)' }}>MYRA</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'rgba(12,12,10,0.06)' }} />
        </div>
        <div className="grid grid-cols-12 gap-8 items-stretch">
          <div className="col-span-12 md:col-span-6 relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <motion.img src="/Complexe/3.jpg" alt="L'origine de MYRA"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.82)' }}
              whileHover={{ scale: 1.04, filter: 'saturate(1)' }}
              transition={{ duration: 1.8, ease: EXPO }} />
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-col justify-between py-6">
            <R><div className="flex items-center gap-4"><Trait /><Cap accent>{t('genese_label')}</Cap></div></R>
            <div className="my-14 md:my-0 space-y-6">
              <R d={0.1}>
                <h2 className="font-serif font-light italic leading-[1.07] text-[#0C0C0A]"
                  style={{ fontSize: 'clamp(32px, 3.8vw, 54px)' }}>
                  {t('genese_title')}
                </h2>
              </R>
              <R d={0.18}><div className="w-14 h-px my-8 bg-[rgba(12,12,10,0.06)]" /></R>
              <R d={0.25}>
                <p className="font-sans text-[14px] leading-[2.6] font-light text-[rgba(12,12,10,0.45)]">{t('genese_p1')}</p>
              </R>
              <R d={0.35}>
                <p className="font-sans text-[14px] leading-[2.6] font-light text-[rgba(12,12,10,0.45)]">{t('genese_p2')}</p>
              </R>
            </div>
            <R d={0.45}>
              <div className="pt-7 border-t border-[rgba(12,12,10,0.06)]">
                <Cap accent>{t('genese_location')}</Cap>
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICES
// ════════════════════════════════════════════════════════════════════════════
function Services() {
  const t = useTranslations('soutenir');
  const [hov, setHov] = useState(null);

  const SVCS = [
    { id: 'menu',  label: t('s1_label'), src: '/Restaurant/A.jpg', pdf: '/tarifs-restauration-myra.pdf', desc: t('s1_desc') },
    { id: 'spa',   label: t('s2_label'), src: '/Spa/A.jpg',        pdf: '/brochure-tarifs-spa.pdf',      desc: t('s2_desc') },
    { id: 'sport', label: t('s3_label'), src: '/Fitness/A.jpg',    pdf: '/offres-fitness-myra.pdf',      desc: t('s3_desc') },
  ];

  return (
    <section className="bg-[] py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="flex items-end justify-between mb-16 pb-12 border-b border-[rgba(12,12,10,0.06)]">
          <R><div className="flex items-center gap-4"><Trait /><Cap accent>{t('services_label')}</Cap></div></R>
          <R d={0.1}>
            <p className="font-serif font-light italic text-[rgba(12,12,10,0.35)]"
              style={{ fontSize: 'clamp(16px, 1.8vw, 24px)' }}>
              {t('services_subtitle')}
            </p>
          </R>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(12,12,10,0.06)]">
          {SVCS.map((s, i) => (
            <div key={s.id}>
              <div className="bg-[#F3F2EF] px-6 pt-6 pb-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-[10px] tracking-[0.45em] text-[rgba(12,12,10,0.25)]">0{i + 1}</span>
                  <h3 className="font-serif font-light italic text-[#0C0C0A]" style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>
                    {s.label}
                  </h3>
                </div>
              </div>
              <motion.div className="relative overflow-hidden cursor-default"
                onMouseEnter={() => setHov(s.id)} onMouseLeave={() => setHov(null)}
                style={{ aspectRatio: '3/4' }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 1.0, ease: EXPO, delay: i * 0.12 }}>
                <motion.img src={s.src} alt={s.label} className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: hov === s.id ? 1.06 : 1, filter: hov === s.id ? 'grayscale(0) saturate(0.95) brightness(0.68)' : 'grayscale(1) brightness(0.88)' }}
                  transition={{ duration: 1.4, ease: EXPO }} />
                <motion.div className="absolute inset-0 flex items-center justify-center z-10"
                  animate={{ opacity: hov === s.id ? 1 : 0 }} transition={{ duration: 0.35 }}>
                 <a href={s.pdf} download onClick={e => e.stopPropagation()}
  className="flex items-center justify-center transition-all duration-400"
  style={{
    width: 48, height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(244,242,239,0.18)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(244,242,239,0.30)',
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244,242,239,0.30)'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(244,242,239,0.18)'}>
  <svg width="14" height="14" fill="none" stroke="#F3F2EF" strokeWidth="1.2" viewBox="0 0 12 12">
    <path d="M6 1V8M6 8L3 5M6 8L9 5M1 11H11" strokeLinecap="round" />
  </svg>
</a>
                </motion.div>
                <motion.div className="absolute bottom-0 left-0 right-0 p-7 z-10"
                  style={{ background: 'linear-gradient(to top, rgba(12,12,10,0.80) 0%, transparent 100%)' }}
                  animate={{ opacity: hov === s.id ? 1 : 0 }} transition={{ duration: 0.4 }}>
                  <p className="font-sans text-[13px] leading-[1.85] font-light text-[rgba(244,245,240,0.78)] text-right">{s.desc}</p>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ÉQUIPE
// ════════════════════════════════════════════════════════════════════════════
function TeamCard({ m, i }) {
  const [hov, setHov] = useState(false);
  return (
    <R d={i * 0.1}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div className="relative overflow-hidden mb-7" style={{ aspectRatio: '3/4' }}>
          <motion.img src={m.src} alt={m.name} className="w-full h-full object-cover"
            animate={{ scale: hov ? 1.05 : 1, filter: hov ? 'grayscale(0) saturate(1)' : 'grayscale(1) brightness(0.93)' }}
            transition={{ duration: 1.2, ease: EXPO }} />
          <motion.div className="absolute inset-0 flex items-end p-6"
            animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(to top, rgba(12,12,10,0.65) 0%, transparent 58%)' }}>
            <p className="font-sans text-[12px] leading-[1.95] text-[rgba(244,245,240,0.80)] font-light">{m.bio}</p>
          </motion.div>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <h4 className="font-serif text-[22px] font-light italic text-[#0C0C0A]">{m.name}</h4>
            <span className="font-sans text-[10px] tracking-[0.32em] uppercase text-[rgba(12,12,10,0.35)]">{m.role}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={m.instagram} target="_blank" rel="noopener noreferrer"
              className="relative pb-1 group font-sans text-[10px] tracking-[0.32em] uppercase text-[rgba(12,12,10,0.35)] hover:text-[#0C0C0A] transition-colors duration-400">
              Instagram<span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-400 bg-[#2B1022]" />
            </a>
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
              className="relative pb-1 group font-sans text-[10px] tracking-[0.32em] uppercase text-[rgba(12,12,10,0.35)] hover:text-[#0C0C0A] transition-colors duration-400">
              LinkedIn<span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-400 bg-[#2B1022]" />
            </a>
          </div>
        </div>
        <div className="h-px w-full bg-[rgba(12,12,10,0.06)]" />
      </div>
    </R>
  );
}

function Team() {
  const t = useTranslations('soutenir');
  const TEAM = [
    { name: 'Tina F.',    role: 'Head Coach', src: '/Tina.jpg',    bio: t('tina_bio'),    instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/tina-fourrier-44636a188/' },
    { name: 'Jérémy P.',  role: 'DG',         src: '/Jérémy.jpg', bio: t('jeremy_bio'),  instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/jeremy-paulen/' },
  ];
  return (
    <section className="bg-[] py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="flex justify-between items-end mb-20">
          <R><div className="flex items-center gap-4"><Trait /><Cap accent>{t('team_label')}</Cap></div></R>
          <R d={0.1}><p className="font-sans max-w-[280px] text-[13px] leading-[2] font-light text-right text-[rgba(12,12,10,0.40)]">{t('team_desc')}</p></R>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {TEAM.map((m, i) => <TeamCard key={m.name} m={m} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BANNIÈRE
// ════════════════════════════════════════════════════════════════════════════
function Banner() {
  const t = useTranslations('soutenir');
  const words = [t('banner_w1'), t('banner_w2'), t('banner_w3')];
  return (
    <section className="bg-[#F3F2EF] overflow-hidden">
      <R y={30}>
        <div className="relative w-full overflow-hidden" style={{ height: '62vh', minHeight: 380 }}>
          <motion.img src="/DA/Nouveau.png" alt="MYRA" className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.72) brightness(0.75)' }}
            initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 3.5, ease: EXPO }} />
          <div className="absolute inset-0 bg-[rgba(12,12,10,0.35)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center">
              {words.map((w, i) => (
                <motion.div key={w} className="flex items-center"
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EXPO, delay: 0.2 + i * 0.14 }}>
                  <span className="font-sans text-[#F3F2EF] text-[13px] tracking-[0.60em] uppercase opacity-85 mx-8 md:mx-10">{w}</span>
                  {i < 2 && <span className="text-[#F3F2EF] opacity-30" style={{ fontSize: '6px' }}>●</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </R>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CERCLES DE PARTENAIRES
// ════════════════════════════════════════════════════════════════════════════
const OFFRES = [
  {
    id: 'engagement', num: 'I', name: 'Cercle Engagement',
    description: "L'entrée dans l'écosystème MYRA. Un levier pour renforcer votre marque employeur.",
    spots: 10, available: 4, price: '12 500',
    perks: [
      { label: 'Capital Bien-être',          desc: '50 accès annuels illimités aux installations.' },
      { label: 'Visibilité Institutionnelle', desc: 'Statut "Partenaire Engagé" sur le mur des membres.' },
      { label: 'Intelligence RH',             desc: 'Reporting trimestriel sur le bien-être de vos équipes.' },
    ],
    modalities: { image: 'Renforcement Marque Employeur', avantage: '-15% sur services', data: 'Dashboard inclus' },
  },
  {
    id: 'hospitalite', num: 'II', name: 'Cercle Hospitalité',
    description: 'Inclut tous les avantages du Cercle I. Transformez le Domaine en extension de votre siège.',
    spots: 5, available: 2, price: '28 000',
    perks: [
      { label: 'Immersion Client',      desc: 'Privatisation annuelle (2j/1n) pour 10 personnes.' },
      { label: 'Conciergerie Affaires', desc: 'Un interlocuteur unique pour organiser séjours et rendez-vous.' },
      { label: 'Réseau Exécutif',       desc: '5 adhésions Full Access + invitations networking.' },
    ],
    modalities: { conversion: 'Outil de closing haut niveau', heritage: 'Avantages Cercle I inclus', privilege: 'Accès prioritaire calendrier' },
  },
  {
    id: 'alliance', num: 'III', name: 'Cercle Alliance',
    description: "Le sommet de l'affiliation. Inclut les avantages des Cercles I et II.",
    spots: 2, available: 2, price: '55 000',
    perks: [
      { label: 'Gouvernance & Vision', desc: 'Siège au Comité Stratégique Annuel.' },
      { label: 'Synergie de Marque',   desc: "Co-branding exclusif et exclusivité sectorielle." },
    ],
    modalities: { affiliation: 'Partenariat stratégique direct', exclusivite: 'Protection concurrence', heritage: 'Avantages I & II inclus' },
  },
];

function ModalDetails({ offre, close }) {
  const t = useTranslations('soutenir');
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end backdrop-blur-xl bg-[rgba(12,12,10,0.04)]"
      onClick={close}>
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.6, ease: EXPO }}
        className="bg-[] h-full w-full max-w-xl border-l border-[rgba(12,12,10,0.06)] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="p-8 flex justify-end">
          <button onClick={close} className="group p-2 transition-transform hover:rotate-90 duration-300 outline-none">
            <svg width="18" height="18" fill="none" stroke="#0C0C0A" strokeWidth="1.2" viewBox="0 0 18 18">
              <path d="M1 1L17 17M17 1L1 17" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-12 md:px-16 pb-12">
          <div className="flex justify-between items-end mb-12 pb-8 border-b border-[rgba(12,12,10,0.06)]">
            <h2 className="font-serif text-[38px] font-light tracking-tight text-[#0C0C0A]">{offre.name}</h2>
            <span className="font-sans text-[11px] tracking-[0.20em] uppercase text-[rgba(12,12,10,0.35)]">{offre.available} / {offre.spots}</span>
          </div>
          <p className="font-serif text-[18px] leading-[1.8] italic max-w-md text-[rgba(12,12,10,0.50)] mb-16">{offre.description}</p>
          <section className="mb-16">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-10 text-[rgba(12,12,10,0.30)]">{t('cercle_actif')}</span>
            <div className="space-y-8">
              {offre.perks.map((p, i) => (
                <div key={i} className="flex gap-6">
                  <span className="font-serif text-[13px] italic text-[rgba(12,12,10,0.25)]">0{i + 1}</span>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.20em] font-medium mb-2 text-[#2B1022]">{p.label}</p>
                    <p className="font-sans text-[14px] font-light leading-[1.8] text-[rgba(12,12,10,0.65)]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-16 py-8 border-t border-[rgba(12,12,10,0.06)]">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-8 text-[rgba(12,12,10,0.30)]">{t('cercle_modalites')}</span>
            <div className="space-y-4">
              {Object.entries(offre.modalities).map(([key, val]) => (
                <div key={key} className="flex justify-between items-baseline pb-3 border-b border-[rgba(12,12,10,0.06)]">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[rgba(12,12,10,0.35)]">{key}</span>
                  <span className="font-sans text-[11px] font-medium uppercase text-right text-[#0C0C0A]">{val}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="pt-8 space-y-10 border-t border-[rgba(12,12,10,0.06)]">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest mb-2 text-[rgba(12,12,10,0.30)]">{t('cercle_droit')}</p>
              <p className="font-serif text-[48px] leading-none text-[#0C0C0A]">
                {offre.price} € <span className="font-sans text-[12px] uppercase text-[rgba(12,12,10,0.40)]">ht</span>
              </p>
            </div>
            <button className="font-sans w-full h-16 border text-[11px] uppercase tracking-[0.50em] font-medium transition-all duration-500 border-[#2B1022] text-[#2B1022]"
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2B1022'; e.currentTarget.style.color = ''; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2B1022'; }}>
              {t('cercle_solliciter')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardCercle({ offre }) {
  const t = useTranslations('soutenir');
  const [hov, setHov]   = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div onClick={() => setOpen(true)}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="group relative bg-[] border flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-700"
        style={{ borderColor: hov ? 'rgba(12,12,10,0.20)' : 'rgba(12,12,10,0.06)', minHeight: 680, padding: '2rem' }}>
        <motion.div className="absolute top-0 left-0 h-[2px] bg-[#2B1022]"
          initial={{ width: 0 }} animate={{ width: hov ? '100%' : 0 }} transition={{ duration: 0.8, ease: EXPO }} />
        <div className="absolute top-4 right-6 font-serif font-light select-none pointer-events-none"
          style={{ fontSize: '120px', color: 'rgba(12,12,10,0.04)', lineHeight: 1 }}>
          {offre.num}
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-baseline mb-12">
            <span className="font-serif text-[28px] italic text-[#0C0C0A]">{offre.num}.</span>
            <span className="font-sans text-[11px] tracking-[0.20em] font-medium text-[rgba(12,12,10,0.35)]">{offre.available} / {offre.spots} {t('cercle_disponibles')}</span>
          </div>
          <h3 className="font-serif text-[38px] mb-6 leading-[1.1] tracking-tight text-[#0C0C0A]">{offre.name}</h3>
          <p className="font-sans text-[14px] leading-[1.85] font-light max-w-[280px] mb-10 text-[rgba(12,12,10,0.45)]">{offre.description}</p>
          <div className="flex flex-col items-start gap-2 mb-8">
            {offre.perks.map((p, i) => (
              <div key={i} className="px-3 py-2 bg-[rgba(12,12,10,0.02)] group-hover:bg-[rgba(12,12,10,0.04)] transition-all duration-500">
                <span className="font-sans text-[10px] uppercase tracking-[0.20em] font-medium text-[rgba(12,12,10,0.40)] group-hover:text-[rgba(12,12,10,0.70)] transition-colors duration-500">
                  — {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex justify-between items-center pt-8 border-t border-[rgba(12,12,10,0.06)]">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.20em] mb-2 block italic text-[rgba(12,12,10,0.35)]">{t('cercle_investissement')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[36px] tracking-tighter text-[#0C0C0A]">{offre.price} €</span>
              <span className="font-sans text-[10px] uppercase text-[rgba(12,12,10,0.35)]">ht</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-14 w-40 border transition-all duration-500"
            style={{ borderColor: '#2B1022', backgroundColor: hov ? '#2B1022' : 'transparent' }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.40em] font-medium transition-colors duration-500"
              style={{ color: hov ? '' : '#2B1022' }}>
              {t('cercle_decouvrir')}
            </span>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{open && <ModalDetails offre={offre} close={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function SectionCercles() {
  const t = useTranslations('soutenir');
  return (
    <section className="bg-[] py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="mb-20">
          <R><div className="flex items-center gap-4"><Trait /><Cap accent>{t('cercles_label')}</Cap></div></R>
          <R d={0.1}>
            <h2 className="font-serif text-[32px] md:text-[48px] font-light italic mt-6 text-[rgba(12,12,10,0.28)]">
              {t('cercles_subtitle')}
            </h2>
          </R>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFRES.map(offre => <CardCercle key={offre.id} offre={offre} />)}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TIMELINE
// ════════════════════════════════════════════════════════════════════════════
const MILESTONES = [
  { id: 1, amount: 400000,  title: 'Restaurant & Bar',  status: 'done',
    desc: "Ouverture de l'espace gastronomique et du bar lounge.",
    items: ['Cuisine professionnelle', 'Cave à vin visitable', 'Terrasse panoramique'], img: '/Restaurant/1.jpg' },
  { id: 2, amount: 650000,  title: 'Espace Recovery',   status: 'current',
    desc: 'Installation du centre de bien-être : Saunas, zones de récupération.',
    items: ['Sauna bois brûlé', 'Hammam pierre naturelle', 'Zone de repos sensorielle'], img: '/Spa/1.jpg' },
  { id: 3, amount: 1700000, title: 'Extension Piscine',  status: 'horizon',
    desc: "Un bassin extérieur à débordement et une aile aquatique couverte.",
    items: ['Bassin de nage 25m', 'Système de filtration bio', 'Plage immergée'], img: '/Spa/3.jpg' },
];
const CURRENT_FUNDED = 520000;
const TOTAL_GOAL     = 1700000;

function StatusDot({ status }) {
  if (status === 'done') return (
    <svg width="10" height="10" viewBox="0 0 9 9" fill="none">
      <path d="M1 4.5l2.5 2.5L8 2" stroke="#2B1022" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (status === 'current') return (
    <motion.div className="w-2 h-2 rounded-full bg-[#2B1022]"
      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
  );
  return <div className="w-2 h-2 rounded-full border border-[rgba(12,12,10,0.20)]" />;
}

function FundingBar() {
  const t = useTranslations('soutenir');
  const progress = (CURRENT_FUNDED / TOTAL_GOAL) * 100;
  return (
    <div className="mb-32 mt-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-4 mb-4"><Trait /><Cap accent>{t('funding_label')}</Cap></div>
          <h2 className="font-serif leading-none text-[#0C0C0A]" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
            {CURRENT_FUNDED.toLocaleString('fr-FR')} €
            <span className="font-serif ml-4 font-light italic text-[rgba(12,12,10,0.25)]" style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>
              {t('funding_sur')} {TOTAL_GOAL.toLocaleString('fr-FR')} €
            </span>
          </h2>
        </div>
        <div className="text-right">
          <p className="font-sans text-[15px] font-medium text-[#0C0C0A]">{Math.round(progress)}%</p>
          <Cap className="opacity-40 mt-1">{t('funding_objectif')}</Cap>
        </div>
      </div>
      <div className="h-px w-full relative bg-[rgba(12,12,10,0.08)]">
        <motion.div className="absolute top-0 left-0 h-full bg-[#2B1022]"
          initial={{ width: 0 }} whileInView={{ width: `${progress}%` }} viewport={{ once: true }}
          transition={{ duration: 2.5, ease: EXPO }} />
        {MILESTONES.map((m, i) => (
          <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-[]"
            style={{ left: `${(m.amount / TOTAL_GOAL) * 100}%`, backgroundColor: CURRENT_FUNDED >= m.amount ? '#2B1022' : 'rgba(12,12,10,0.12)' }} />
        ))}
      </div>
    </div>
  );
}

function MRow({ m, i }) {
  const t = useTranslations('soutenir');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [hov, setHov] = useState(false);
  const unlocked = CURRENT_FUNDED >= m.amount;
  return (
    <motion.div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }} animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, ease: EXPO, delay: i * 0.1 }}
      className={`grid grid-cols-12 gap-8 py-14 relative border-t border-[rgba(12,12,10,0.08)] transition-all duration-700 ${!unlocked ? 'opacity-50 grayscale' : ''}`}>
      <div className="col-span-12 md:col-span-4">
        <div className="flex items-center gap-4 mb-5">
          <span className="font-sans text-[11px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.40)]">
            {t('funding_palier')} {m.amount.toLocaleString('fr-FR')} €
          </span>
          <StatusDot status={unlocked ? 'done' : m.status} />
        </div>
        <h3 className="font-serif leading-tight italic text-[#0C0C0A]" style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}>{m.title}</h3>
      </div>
      <div className="col-span-12 md:col-span-5">
        <p className="font-sans text-[14px] leading-[1.85] font-light mb-6 text-[rgba(12,12,10,0.45)]">{m.desc}</p>
        <div className="space-y-2">
          {m.items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-4 h-px bg-[rgba(12,12,10,0.20)]" />
              <span className="font-sans text-[12px] uppercase tracking-widest text-[rgba(12,12,10,0.40)]">{it}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <div className="relative overflow-hidden aspect-[3/4]">
          <motion.img src={m.img} alt={m.title} className="w-full h-full object-cover"
            animate={{ scale: hov ? 1.08 : 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          {!unlocked && <div className="absolute inset-0 backdrop-blur-[1px] bg-[rgba(244,245,240,0.18)]" />}
        </div>
      </div>
      {!unlocked && (
        <div className="absolute right-0 top-6 hidden lg:block">
          <span className="font-sans text-[10px] tracking-[0.30em] border px-3 py-1 uppercase border-[rgba(12,12,10,0.10)] text-[rgba(12,12,10,0.35)]">
            {t('funding_verrouille')}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function Timeline() {
  const t = useTranslations('soutenir');
  return (
    <section className="bg-[] py-20 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6"><Trait /><Cap accent>{t('timeline_label')}</Cap></div>
          <p className="font-serif text-[26px] italic max-w-xl text-[rgba(12,12,10,0.35)]">{t('timeline_subtitle')}</p>
        </div>
        <FundingBar />
        <div className="mt-24">{MILESTONES.map((m, i) => <MRow key={m.id} m={m} i={i} />)}</div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FINAL
// ════════════════════════════════════════════════════════════════════════════
function Final() {
  const t = useTranslations('soutenir');
  return (
    <section className="bg-[] overflow-hidden">
      <R y={30} d={0.2} className="w-full mb-24">
        <div className="relative group w-screen left-1/2 right-1/2 -ml-[50vw]"
          style={{ aspectRatio: '21/9', minHeight: '400px' }}>
          <img src="/Complexe/4.jpg" alt="MYRA Alsace"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            style={{ filter: 'grayscale(0.1) brightness(0.78)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.a href="/Pitch Deck.pdf" download="Pitch Deck.pdf" whileHover={{ scale: 1.05 }}
              className="font-sans inline-flex items-center gap-5 px-10 py-5 backdrop-blur-md border border-[rgba(244,245,240,0.30)] bg-[rgba(244,245,240,0.10)] hover:bg-[rgba(244,245,240,0.16)] transition-all">
              <span className="text-[] text-[12px] tracking-[0.20em] uppercase">{t('final_download')}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V8M6 8L3 5M6 8L9 5M1 11H11" stroke="" strokeWidth="1" />
              </svg>
            </motion.a>
          </div>
        </div>
      </R>
      <div className="max-w-container mx-auto pb-44">
        <div className="flex flex-col md:flex-row justify-between items-start gap-14">
          <R d={0.16} y={24}>
            <h2 className="font-serif font-light tracking-tight text-[#0C0C0A]"
              style={{ fontSize: 'clamp(60px, 8vw, 128px)', lineHeight: 0.88 }}>
              {t('final_thanks').includes('you') ? <>{t('final_thanks').replace('you.', '')}<em>you.</em></> : t('final_thanks')}
            </h2>
          </R>
          <R y={10}>
            <p className="font-sans max-w-[380px] text-[14px] leading-[2.65] font-light text-[rgba(12,12,10,0.45)]">
              {t('final_text')}
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function SoutenirPage() {
  return (
    <main className="bg-[]">
      <Hero />
      <Genese />
      <Services />
      <Team />
      <Banner />
      <SectionCercles />
      <Timeline />
      <Final />
    </main>
  );
}