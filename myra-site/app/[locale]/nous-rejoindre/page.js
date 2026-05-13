'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/useTranslations';

const INK  = '#0C0C0A';
const WINE = '#351421';
const ASH  = 'rgba(12,12,10,0.42)';
const BONE = 'rgba(12,12,10,0.06)';
const EXPO = [0.16, 1, 0.3, 1];
const EASE = [0.19, 1, 0.22, 1];

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

function R({ children, d = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const io  = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotionSafe();
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y, filter: reduced ? 'blur(0px)' : 'blur(4px)' }}
      animate={io ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, ease: EASE, delay: d }}>
      {children}
    </motion.div>
  );
}

function Cap({ children, light = false, accent = false, className = '' }) {
  return (
    <span className={`inline-block font-sans text-[11px] tracking-[0.55em] uppercase ${accent ? 'text-[#351421]' : light ? 'text-[rgba(244,245,240,0.38)]' : 'text-[rgba(12,12,10,0.35)]'} ${className}`}>
      {children}
    </span>
  );
}

function Trait({ light = false, className = '' }) {
  return <div className={`h-px w-4 flex-shrink-0 ${className}`}
    style={{ backgroundColor: light ? 'rgba(244,245,240,0.15)' : 'rgba(53,20,33,0.40)' }} />;
}

// ════════════════════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════════════════════
function Hero() {
  const t = useTranslations('soutenir');
  const ref = useRef(null);
  const reducedMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section id="hero" aria-labelledby="soutenir-hero-title" ref={ref} className="relative w-full overflow-hidden bg-[#0C0C0A]"
      style={{ height: '100dvh', minHeight: 640 }}>
      <motion.div className="absolute inset-0" style={reducedMotion ? undefined : { scale }}>
        <motion.img src="/Visuels/Attente.jpg" alt="MYRA Society — domaine"
          loading="eager" fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) brightness(0.50) contrast(1.06)' }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A]/55 via-transparent to-[#0C0C0A]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/30 via-transparent to-transparent" />

      {/* Grain analogique — section Ink */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      <motion.div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-10 md:pb-12 z-20"
        style={{ opacity }}>

        <motion.div className="flex flex-col items-start mb-8 md:mb-16"
          initial={{ opacity: 0, x: reducedMotion ? 0 : -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
          <h1 id="soutenir-hero-title" className="font-serif font-light italic text-[#F4F5F0] leading-[1.1] tracking-[-0.02em] text-left"
            style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
            {t('hero_title').split('\n')[0]}
          </h1>
          <h2 className="font-serif font-light text-[#F4F5F0] leading-[1.1] tracking-[-0.01em] text-left mt-2 uppercase"
            style={{ fontSize: 'clamp(32px, 4.5vw, 64px)' }}>
            {t('hero_title').split('\n')[1]}
          </h2>
        </motion.div>

        <motion.div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}>
          
          {/* Bouton téléchargement */}
          <motion.a href="/Pitch Deck.pdf" download whileHover={{ scale: 1.02 }}
            className="font-sans inline-flex items-center gap-4 px-6 py-4 border border-[rgba(244,245,240,0.15)] hover:border-[#351421] backdrop-blur-md bg-[rgba(244,245,240,0.04)] hover:bg-[rgba(53,20,33,0.20)] transition-all duration-500">
            <span className="text-[#F4F5F0] text-[9px] md:text-[10px] tracking-[0.30em] uppercase">{t('hero_download')}</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V8M6 8L3 5M6 8L9 5M1 11H11" stroke="#F4F5F0" strokeWidth="1.2" />
            </svg>
          </motion.a>

          {/* Marlenheim — desktop seulement, lieu + edition cachés sur mobile */}
          <div className="hidden md:flex items-center gap-12 text-right mb-1">
            <div>
              <Cap light className="block mb-1 opacity-30 text-[9px] uppercase">{t('hero_lieu')}</Cap>
              <span className="font-sans text-[10px] uppercase tracking-[0.20em] text-[rgba(244,245,240,0.50)]">{t('hero_lieu_val')}</span>
            </div>
            <div>
              <Cap light className="block mb-1 opacity-30 text-[9px] uppercase">{t('hero_edition')}</Cap>
              <span className="font-sans text-[10px] uppercase tracking-[0.20em] text-[rgba(244,245,240,0.50)]">{t('hero_edition_val')}</span>
            </div>
          </div>


        </motion.div>
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GENÈSE
// ════════════════════════════════════════════════════════════════════════════
function Genese() {
  const t = useTranslations('soutenir');
  return (
    <section id="genese" aria-labelledby="genese-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-0">
        <div className="flex items-center gap-8 mb-10 md:mb-16">
          <div className="h-px flex-1" style={{ backgroundColor: 'rgba(12,12,10,0.06)' }} />
          <span className="font-sans text-[9px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.18)' }}>MYRA</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'rgba(12,12,10,0.06)' }} />
        </div>

        <div className="grid grid-cols-12 gap-8 items-stretch">
          {/* Image — DOM first, ordered after text on mobile via order */}
          <div className="col-span-12 md:col-span-6 order-2 md:order-none relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <motion.img src="/Complexe/3.jpg" alt="MYRA — L'origine"
              loading="lazy" decoding="async"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
              whileHover={{ scale: 1.04, filter: 'saturate(1)' }}
              transition={{ duration: 1.8, ease: EXPO }} />
          </div>
          {/* Texte — order-1 mobile (au-dessus), col-start-8 desktop */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 order-1 md:order-none md:flex md:flex-col md:justify-between md:py-6 space-y-5 md:space-y-0">
            <R>
              <div className="flex items-center gap-4">
                <Trait />
                <Cap accent>
                  <span id="genese-label">{t('genese_label')}</span>
                </Cap>
              </div>
            </R>
            <div className="space-y-5 md:space-y-6">
              <R d={0.1}>
                <h2 className="font-serif font-light italic leading-[1.07] text-[#0C0C0A] text-[clamp(28px,6vw,44px)] md:text-[clamp(32px,3.8vw,54px)] m-0">
                  {t('genese_title')}
                </h2>
              </R>
              <R d={0.18}>
                <div className="w-10 md:w-14 h-px bg-[rgba(12,12,10,0.06)]" />
              </R>
              <R d={0.25}>
                <p className="font-sans font-light text-[rgba(12,12,10,0.45)] text-[13px] leading-[2.4] md:text-[14px] md:leading-[2.6]">{t('genese_p1')}</p>
              </R>
              <R d={0.35}>
                <p className="font-sans font-light text-[rgba(12,12,10,0.45)] text-[13px] leading-[2.4] md:text-[14px] md:leading-[2.6]">{t('genese_p2')}</p>
              </R>
            </div>
            <R d={0.45}>
              <div className="hidden md:block pt-7 border-t border-[rgba(12,12,10,0.06)]">
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
  const SERVICES = [
    { id: 'spa',        image: '/Spa/A.jpg',        pdf: '/Pitch Deck.pdf', num: '01', label: t('s2_label'), desc: t('s2_desc') },
    { id: 'fitness',    image: '/Fitness/A.jpg',    pdf: '/Pitch Deck.pdf', num: '02', label: t('s3_label'), desc: t('s3_desc') },
    { id: 'restaurant', image: '/Restaurant/A.jpg', pdf: '/Pitch Deck.pdf', num: '03', label: t('s1_label'), desc: t('s1_desc') },
  ];

  return (
    <section id="services" aria-labelledby="services-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-0">
        <div className="mb-12 md:mb-20">
          <R>
            <div className="flex items-center gap-4">
              <Trait />
              <Cap accent>
                <span id="services-label">{t('services_label')}</span>
              </Cap>
            </div>
          </R>
          <R d={0.1}>
            <h2 className="font-serif font-light italic mt-4 m-0 text-[rgba(12,12,10,0.32)]"
              style={{ fontSize: 'clamp(26px, 3.6vw, 48px)', lineHeight: 1.1 }}>
              {t('services_subtitle')}
            </h2>
          </R>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-14">
          {SERVICES.map((s, i) => (
            <R key={s.id} d={i * 0.08}>
              <a href={s.pdf} target="_blank" rel="noopener noreferrer"
                aria-label={`${s.label} — PDF`}
                className="group block outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#351421]">
                <div className="relative overflow-hidden mb-7 md:mb-9" style={{ aspectRatio: '3/4' }}>
                  <motion.img src={s.image} alt={s.label}
                    loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                    style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-px" style={{ backgroundColor: 'rgba(53,20,33,0.40)' }} />
                  <span className="font-sans text-[10px] uppercase tracking-[0.55em] text-[rgba(12,12,10,0.40)]">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-serif font-light italic text-[#0C0C0A] m-0 mb-4"
                  style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', lineHeight: 1.0, letterSpacing: '-0.01em' }}>
                  {s.label}
                </h3>
                <p className="font-sans font-light max-w-xs m-0 mb-6"
                  style={{ fontSize: '13px', lineHeight: 2.0, color: 'rgba(12,12,10,0.45)' }}>
                  {s.desc}
                </p>
                <div className="inline-flex items-center gap-3 relative pb-1">
                  <span className="font-sans text-[9px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.45)] group-hover:text-[#351421] transition-colors duration-400">
                    {t('cercle_decouvrir')}
                  </span>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none"
                    className="transition-transform duration-400 group-hover:translate-x-1 text-[rgba(12,12,10,0.40)] group-hover:text-[#351421]">
                    <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: '#351421' }} />
                </div>
              </a>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EQUIPE
// ════════════════════════════════════════════════════════════════════════════
function Equipe() {
  const t = useTranslations('team');
  const [act, setAct] = useState(0);

  const EQUIPE = [
    { src: '/Tina.jpg',   name: 'Tina F.',   role: 'Head Coach',       quote: t('tina_quote'),   instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/tina-fourrier-44636a188/' },
    { src: '/Jérémy.jpg', name: 'Jérémy P.', role: 'Directeur Général', quote: t('jeremy_quote'), instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/jeremy-paulen/' },
  ];

  const Selector = () => (
    <ul role="list" className="flex items-center gap-6 m-0 p-0 list-none">
      {EQUIPE.map((m, i) => (
        <li key={i}>
          <button type="button" onClick={() => setAct(i)} aria-label={`${m.name} — ${m.role}`} aria-pressed={i === act} className="flex items-center gap-4 outline-none">
            <motion.div className="relative overflow-hidden flex-shrink-0" style={{ width: 52, height: 64 }}
              animate={{ opacity: i === act ? 1 : 0.25, filter: i === act ? 'grayscale(1) contrast(1.05)' : 'grayscale(1)' }}
              transition={{ duration: 0.4 }}>
              <img src={m.src} alt={m.name} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
              {i === act && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: WINE }} />}
            </motion.div>
            <div className="text-left">
              <p className="font-sans text-[10px] uppercase tracking-[0.30em]" style={{ color: i === act ? INK : 'rgba(12,12,10,0.25)' }}>{m.name}</p>
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] mt-0.5" style={{ color: 'rgba(12,12,10,0.20)' }}>{m.role}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="equipe" aria-labelledby="equipe-label" className="bg-[#F4F5F0] overflow-hidden">
      <div className="max-w-container mx-auto py-14 md:py-20 px-6 md:px-0">
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <Trait />
          <Cap accent>
            <span id="equipe-label">{t('label')}</span>
          </Cap>
        </div>

        {/* Thumbnails — au dessus du portrait sur mobile */}
        <div className="lg:hidden mb-6"><Selector /></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', minHeight: 380 }}>
            <AnimatePresence mode="wait">
              <motion.img key={EQUIPE[act].src} src={EQUIPE[act].src} alt={EQUIPE[act].name} loading="lazy" decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{ filter: 'grayscale(1) contrast(1.05)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }} />
            </AnimatePresence>
          </div>
          <div className="flex flex-col justify-between px-0 md:px-14 py-10 md:py-0"
            style={{ borderLeft: '1px solid rgba(12,12,10,0.06)' }}>
            <div className="md:pt-2">
              <AnimatePresence mode="wait">
                <motion.div key={act}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: EASE }}>
                  <p className="font-sans text-[10px] uppercase tracking-[0.45em] mb-1" style={{ color: WINE }}>
                    <cite className="not-italic">{EQUIPE[act].name}</cite>
                  </p>
                  <p className="font-sans text-[9px] uppercase tracking-[0.35em] mb-8" style={{ color: 'rgba(12,12,10,0.28)' }}>{EQUIPE[act].role}</p>
                  <blockquote className="m-0 p-0">
                    <p className="font-serif font-light italic leading-[1.6] m-0"
                      style={{ fontSize: 'clamp(18px, 2vw, 26px)', color: 'rgba(12,12,10,0.68)' }}>
                      &laquo;&nbsp;{EQUIPE[act].quote}&nbsp;&raquo;
                    </p>
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <div className="hidden lg:flex items-center gap-6 mb-6"><Selector /></div>
              <div className="flex items-center gap-6 pt-6" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
                {['instagram', 'linkedin'].map(r => (
                  <a key={r} href={EQUIPE[act][r]} target="_blank" rel="noopener noreferrer"
                    className="group/link relative pb-1 font-sans text-[9px] tracking-[0.40em] uppercase transition-colors duration-400 text-[rgba(12,12,10,0.25)] hover:text-[#0C0C0A]">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                    <span className="absolute bottom-0 left-0 h-px w-0 group-hover/link:w-full transition-all duration-400" style={{ backgroundColor: WINE }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
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
  const reducedMotion = useReducedMotionSafe();
  const words = [t('banner_w1'), t('banner_w2'), t('banner_w3')];
  return (
    <section className="bg-[#F4F5F0] overflow-hidden">
      <R y={30}>
        <div className="relative w-full overflow-hidden" style={{ height: '62vh', minHeight: 280 }}>
          <motion.img src="/DA/Nouveau.png" alt="MYRA" loading="lazy" decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.72) brightness(0.75)' }}
            initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 3.5, ease: EXPO }} />
          <div className="absolute inset-0 bg-[rgba(12,12,10,0.45)]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <ul role="list" className="flex items-center justify-center flex-wrap md:flex-nowrap m-0 p-0 list-none">
              {words.map((w, i) => (
                <li key={w} className="flex items-center">
                  <motion.span className="font-sans text-[#F4F5F0] uppercase opacity-85 text-[10px] md:text-[13px] tracking-[0.55em] md:tracking-[0.60em] mx-3 md:mx-10"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }} whileInView={{ opacity: 0.85, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: EXPO, delay: 0.2 + i * 0.14 }}>
                    {w}
                  </motion.span>
                  {i < 2 && <span aria-hidden="true" className="text-[#F4F5F0] opacity-30" style={{ fontSize: '6px' }}>●</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </R>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CERCLES — swipe horizontal sur mobile
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
  const closeBtnRef = useRef(null);
  const modalTitleId = `modal-${offre.id}-title`;
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    if (closeBtnRef.current) closeBtnRef.current.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [close]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end backdrop-blur-xl bg-[rgba(12,12,10,0.04)]"
      onClick={close}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby={modalTitleId}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.6, ease: EXPO }}
        className="bg-white h-full w-full max-w-xl border-l border-[rgba(12,12,10,0.06)] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8 flex justify-end">
          <button ref={closeBtnRef} type="button" onClick={close} aria-label="Fermer"
            className="group p-2 transition-transform hover:rotate-90 duration-300 outline-none">
            <svg width="18" height="18" fill="none" stroke="#0C0C0A" strokeWidth="1.2" viewBox="0 0 18 18">
              <path d="M1 1L17 17M17 1L1 17" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 md:px-16 pb-12">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-[rgba(12,12,10,0.06)]">
            <h2 id={modalTitleId} className="font-serif text-[28px] md:text-[38px] font-light tracking-tight text-[#0C0C0A]">{offre.name}</h2>
            <span className="font-sans text-[11px] tracking-[0.20em] uppercase text-[rgba(12,12,10,0.35)]">{offre.available} / {offre.spots}</span>
          </div>
          <p className="font-serif text-[16px] md:text-[18px] leading-[1.8] italic max-w-md text-[rgba(12,12,10,0.50)] mb-12">{offre.description}</p>
          <section className="mb-12">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-8 text-[rgba(12,12,10,0.30)]">{t('cercle_actif')}</span>
            <div className="space-y-6">
              {offre.perks.map((p, i) => (
                <div key={i} className="flex gap-5">
                  <span className="font-serif text-[13px] italic text-[rgba(12,12,10,0.25)]">0{i + 1}</span>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-[0.20em] font-medium mb-1 text-[#351421]">{p.label}</p>
                    <p className="font-sans text-[13px] md:text-[14px] font-light leading-[1.8] text-[rgba(12,12,10,0.65)]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-12 py-6 border-t border-[rgba(12,12,10,0.06)]">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-6 text-[rgba(12,12,10,0.30)]">{t('cercle_modalites')}</span>
            <div className="space-y-3">
              {Object.entries(offre.modalities).map(([key, val]) => (
                <div key={key} className="flex justify-between items-baseline pb-3 border-b border-[rgba(12,12,10,0.06)]">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[rgba(12,12,10,0.35)]">{key}</span>
                  <span className="font-sans text-[10px] md:text-[11px] font-medium uppercase text-right text-[#0C0C0A]">{val}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="pt-6 space-y-8 border-t border-[rgba(12,12,10,0.06)]">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest mb-2 text-[rgba(12,12,10,0.30)]">{t('cercle_droit')}</p>
              <p className="font-serif text-[38px] md:text-[48px] leading-none text-[#0C0C0A]">
                {offre.price} € <span className="font-sans text-[12px] uppercase text-[rgba(12,12,10,0.40)]">ht</span>
              </p>
            </div>
            <button type="button" className="font-sans w-full h-14 md:h-16 border text-[9px] md:text-[11px] uppercase tracking-[0.50em] font-medium transition-all duration-500 border-[#351421] text-[#351421] hover:bg-[#351421] hover:text-[#F4F5F0]">
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
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
  };
  return (
    <>
      <motion.div role="button" tabIndex={0}
        aria-haspopup="dialog" aria-expanded={open} aria-label={offre.name}
        onClick={() => setOpen(true)} onKeyDown={handleKey}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        onFocus={() => setHov(true)} onBlur={() => setHov(false)}
        className="group relative border flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-700 flex-shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-[#351421]"
        style={{ borderColor: hov ? 'rgba(12,12,10,0.20)' : 'rgba(12,12,10,0.06)', minHeight: 580, padding: '1.5rem', width: '85vw', maxWidth: 380 }}>
        <motion.div className="absolute top-0 left-0 h-[2px] bg-[#351421]"
          initial={{ width: 0 }} animate={{ width: hov ? '100%' : 0 }} transition={{ duration: 0.8, ease: EXPO }} />
        <div className="absolute top-4 right-6 font-serif font-light select-none pointer-events-none"
          style={{ fontSize: '100px', color: 'rgba(12,12,10,0.04)', lineHeight: 1 }}>
          {offre.num}
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-baseline mb-8">
            <span className="font-serif text-[24px] italic text-[#0C0C0A]">{offre.num}.</span>
            <span className="font-sans text-[10px] tracking-[0.20em] font-medium text-[rgba(12,12,10,0.35)]">{offre.available} / {offre.spots} {t('cercle_disponibles')}</span>
          </div>
          <h3 className="font-serif text-[28px] mb-4 leading-[1.1] tracking-tight text-[#0C0C0A]">{offre.name}</h3>
          <p className="font-sans text-[13px] leading-[1.85] font-light mb-8 text-[rgba(12,12,10,0.45)]">{offre.description}</p>
          <div className="flex flex-col items-start gap-2 mb-6">
            {offre.perks.map((p, i) => (
              <div key={i} className="px-3 py-2 bg-[rgba(12,12,10,0.02)]">
                <span className="font-sans text-[9px] uppercase tracking-[0.20em] font-medium text-[rgba(12,12,10,0.40)]">— {p.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex justify-between items-center pt-6 border-t border-[rgba(12,12,10,0.06)]">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.20em] mb-1 block italic text-[rgba(12,12,10,0.35)]">{t('cercle_investissement')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[28px] tracking-tighter text-[#0C0C0A]">{offre.price} €</span>
              <span className="font-sans text-[9px] uppercase text-[rgba(12,12,10,0.35)]">ht</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-12 w-32 border transition-all duration-500"
            style={{ borderColor: '#351421', backgroundColor: hov ? '#351421' : 'transparent' }}>
            <span className="font-sans text-[9px] uppercase tracking-[0.40em] font-medium transition-colors duration-500"
              style={{ color: hov ? '#F4F5F0' : '#351421' }}>
              {t('cercle_decouvrir')}
            </span>
          </div>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">{open && <ModalDetails offre={offre} close={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function SectionCercles() {
  const t = useTranslations('soutenir');
  const [cur, setCur] = useState(0);
  const x = useMotionValue(0);
  const wrapRef = useRef(null);
  const [wrapW, setWrapW] = useState(0);
  const CARD_W = typeof window !== 'undefined' && window.innerWidth < 768 ? window.innerWidth * 0.85 : 380;
  const GAP = 16;

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setWrapW(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const snapTo = (i) => {
    setCur(i);
    animate(x, -(i * (CARD_W + GAP)), { type: 'tween', duration: 0.55, ease: EXPO });
  };

  const handleDragEnd = (_, info) => {
    if (info.velocity.x < -200 || info.offset.x < -(CARD_W * 0.2)) snapTo(Math.min(cur + 1, OFFRES.length - 1));
    else if (info.velocity.x > 200 || info.offset.x > CARD_W * 0.2) snapTo(Math.max(cur - 1, 0));
    else snapTo(cur);
  };

  return (
    <section id="cercles" aria-labelledby="cercles-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-0">
        <div className="mb-12 md:mb-20">
          <R>
            <div className="flex items-center gap-4">
              <Trait />
              <Cap accent>
                <span id="cercles-label">{t('cercles_label')}</span>
              </Cap>
            </div>
          </R>
          <R d={0.1}>
            <h2 className="font-serif text-[26px] md:text-[48px] font-light italic mt-4 text-[rgba(12,12,10,0.28)]">
              {t('cercles_subtitle')}
            </h2>
          </R>
        </div>

        {/* Desktop — 3 colonnes */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {OFFRES.map(offre => <CardCercle key={offre.id} offre={offre} />)}
        </div>

        {/* Mobile — swipe horizontal */}
        <div className="md:hidden" ref={wrapRef}>
          <div className="overflow-hidden">
            <motion.div style={{ x, display: 'flex', gap: GAP, cursor: 'grab', touchAction: 'pan-y' }}
              drag="x"
              dragConstraints={{ left: -((OFFRES.length - 1) * (CARD_W + GAP)), right: 0 }}
              dragElastic={0.04} dragMomentum={false} onDragEnd={handleDragEnd}>
              {OFFRES.map(offre => <CardCercle key={offre.id} offre={offre} />)}
            </motion.div>
          </div>
          {/* Tirets navigation */}
          <div className="flex gap-2 mt-6 justify-center">
            {OFFRES.map((_, i) => (
              <button key={i} type="button" onClick={() => snapTo(i)}
                aria-label={`Cercle ${i + 1} sur ${OFFRES.length}`}
                aria-current={i === cur ? 'true' : undefined}
                className="outline-none transition-all duration-400"
                style={{ height: 2, width: i === cur ? 32 : 12, backgroundColor: i === cur ? INK : 'rgba(12,12,10,0.15)', border: 'none', padding: 0, cursor: 'pointer' }} />
            ))}
          </div>
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
    items: ['Cuisine professionnelle', 'Cave à vin visitable', 'Terrasse panoramique'],
    img: '/Visuels/Restaurant.jpg' },
  { id: 2, amount: 650000,  title: 'Espace Recovery',   status: 'current',
    desc: 'Installation du centre de bien-être : saunas, hammam, zones de récupération.',
    items: ['Sauna bois brûlé', 'Hammam pierre naturelle', 'Zone de repos sensorielle'],
    img: '/Visuels/Hammam.jpg' },
  { id: 3, amount: 1700000, title: 'Extension Piscine',  status: 'horizon',
    desc: "Un bassin extérieur à débordement et une aile aquatique couverte.",
    items: ['Bassin de nage 25m', 'Système de filtration bio', 'Plage immergée'],
    img: '/Visuels/Piscine.jpg' },
];

function StatusDot({ status, light = false }) {
  const reducedMotion = useReducedMotionSafe();
  const tint = light ? '#F4F5F0' : '#351421';
  if (status === 'done') return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 9 9" fill="none">
      <path d="M1 4.5l2.5 2.5L8 2" stroke={tint} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (status === 'current') return (
    <motion.div aria-hidden="true" className="w-2 h-2 rounded-full"
      style={{ backgroundColor: tint }}
      animate={reducedMotion ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
      transition={reducedMotion ? undefined : { duration: 2, repeat: Infinity }} />
  );
  return <div aria-hidden="true" className="w-2 h-2 rounded-full border"
    style={{ borderColor: light ? 'rgba(244,245,240,0.30)' : 'rgba(12,12,10,0.20)' }} />;
}

const CURRENT_FUNDED = 520000;
const TOTAL_GOAL     = 1700000;

function FundingBar() {
  const t = useTranslations('soutenir');
  const reducedMotion = useReducedMotionSafe();
  const progress = (CURRENT_FUNDED / TOTAL_GOAL) * 100;
  return (
    <div className="mb-16 md:mb-28 mt-8 md:mt-14">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-7 md:mb-10">
        <div>
          <div className="flex items-center gap-4 mb-3 md:mb-5">
            <Trait />
            <Cap accent>{t('funding_label')}</Cap>
          </div>
          <h2 className="font-serif font-light leading-none text-[#0C0C0A] m-0"
            style={{ fontSize: 'clamp(32px, 5vw, 72px)', letterSpacing: '-0.02em' }}>
            {CURRENT_FUNDED.toLocaleString('fr-FR')} €
            <span className="font-serif ml-2 md:ml-4 font-light italic"
              style={{ fontSize: 'clamp(14px, 2vw, 28px)', color: 'rgba(12,12,10,0.25)' }}>
              {t('funding_sur')} {TOTAL_GOAL.toLocaleString('fr-FR')} €
            </span>
          </h2>
        </div>
        <div className="md:text-right">
          <p className="font-serif font-light italic m-0"
            style={{ fontSize: 'clamp(20px, 2vw, 28px)', color: '#0C0C0A' }}>
            {Math.round(progress)}%
          </p>
          <Cap className="opacity-40 mt-1">{t('funding_objectif')}</Cap>
        </div>
      </div>
      <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}
        aria-label={t('funding_label')}
        className="h-px w-full relative bg-[rgba(12,12,10,0.08)]">
        <motion.div aria-hidden="true" className="absolute top-0 left-0 h-full bg-[#351421]"
          initial={{ width: reducedMotion ? `${progress}%` : 0 }}
          whileInView={{ width: `${progress}%` }} viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 2.5, ease: EXPO }} />
        {MILESTONES.map((m, i) => (
          <div key={i} aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2"
            style={{
              left: `${(m.amount / TOTAL_GOAL) * 100}%`,
              backgroundColor: CURRENT_FUNDED >= m.amount ? '#351421' : 'rgba(12,12,10,0.12)',
              borderColor: '#F4F5F0',
            }} />
        ))}
      </div>
    </div>
  );
}

function MRow({ m, i }) {
  const t = useTranslations('soutenir');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useReducedMotionSafe();
  const [hov, setHov] = useState(false);
  const unlocked = CURRENT_FUNDED >= m.amount;
  return (
    <motion.article ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 32, filter: reducedMotion ? 'blur(0px)' : 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.1, ease: EXPO, delay: i * 0.1 }}
      className={`grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 relative border-t border-[rgba(12,12,10,0.08)] transition-all duration-700 ${!unlocked ? 'opacity-50 grayscale' : ''}`}>
      <div className="col-span-12 md:col-span-4">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <span className="font-sans text-[10px] uppercase tracking-[0.45em]"
            style={{ color: 'rgba(12,12,10,0.45)' }}>
            {t('funding_palier')} {m.amount.toLocaleString('fr-FR')} €
          </span>
          <StatusDot status={unlocked ? 'done' : m.status} />
        </div>
        <h3 className="font-serif font-light italic text-[#0C0C0A] m-0"
          style={{ fontSize: 'clamp(26px, 3.2vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
          {m.title}
        </h3>
      </div>
      <div className="col-span-12 md:col-span-4">
        <p className="font-sans font-light mb-6 m-0"
          style={{ fontSize: '13px', lineHeight: 2.0, color: 'rgba(12,12,10,0.50)' }}>
          {m.desc}
        </p>
        <div className="space-y-3">
          {m.items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-3 h-px" style={{ backgroundColor: 'rgba(12,12,10,0.25)' }} />
              <span className="font-sans text-[10px] uppercase tracking-[0.40em]"
                style={{ color: 'rgba(12,12,10,0.45)' }}>
                {it}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block col-span-4">
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <motion.img src={m.img} alt={m.title} loading="lazy" decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
            animate={{ scale: hov ? 1.06 : 1 }}
            transition={{ duration: 1.2, ease: EXPO }} />
          {!unlocked && (
            <div aria-hidden="true" className="absolute inset-0 backdrop-blur-[1px]"
              style={{ backgroundColor: 'rgba(244,245,240,0.18)' }} />
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Timeline() {
  const t = useTranslations('soutenir');
  return (
    <section id="timeline" aria-labelledby="timeline-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-0">
        <div className="mb-12 md:mb-20">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <Trait />
            <Cap accent>
              <span id="timeline-label">{t('timeline_label')}</span>
            </Cap>
          </div>
          <p className="font-serif font-light italic m-0 max-w-xl"
            style={{ fontSize: 'clamp(20px, 2.6vw, 30px)', lineHeight: 1.25, color: 'rgba(12,12,10,0.40)' }}>
            {t('timeline_subtitle')}
          </p>
        </div>
        <FundingBar />
        <div className="mt-10 md:mt-20">
          {MILESTONES.map((m, i) => <MRow key={m.id} m={m} i={i} />)}
        </div>
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
    <section id="final" aria-labelledby="final-title" className="overflow-hidden">
      <R y={30} d={0.2} className="w-full mb-16 md:mb-24">
        <div className="relative group w-full" style={{ aspectRatio: '16/9', minHeight: '280px' }}>
          <motion.img src="/Complexe/4.jpg" alt="MYRA Society — Marlenheim, Alsace"
            loading="lazy" decoding="async"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            style={{ filter: 'saturate(0.85) brightness(0.78) contrast(1.04)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.a href="/Pitch Deck.pdf" download="Pitch Deck.pdf" whileHover={{ scale: 1.05 }}
              className="font-sans inline-flex items-center gap-4 px-6 md:px-10 py-4 md:py-5 backdrop-blur-md border border-[rgba(244,245,240,0.30)] bg-[rgba(244,245,240,0.10)] hover:bg-[rgba(244,245,240,0.16)] transition-all">
              <span className="text-white text-[9px] md:text-[12px] tracking-[0.20em] uppercase">{t('final_download')}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V8M6 8L3 5M6 8L9 5M1 11H11" stroke="white" strokeWidth="1" />
              </svg>
            </motion.a>
          </div>
        </div>
      </R>
      <div className="max-w-container mx-auto px-6 md:px-0 pb-20 md:pb-44">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-14">
          <R d={0.16} y={24}>
            <h2 id="final-title" className="font-serif font-light tracking-tight text-[#0C0C0A]"
              style={{ fontSize: 'clamp(48px, 8vw, 128px)', lineHeight: 0.88 }}>
              {t('final_thanks').includes('you') ? <>{t('final_thanks').replace('you.', '')}<em>you.</em></> : t('final_thanks')}
            </h2>
          </R>
          <R y={10}>
            <p className="font-sans max-w-[380px] text-[13px] leading-[2.4] font-light text-[rgba(12,12,10,0.45)]">
              {t('final_text')}
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}

export default function NousRejoindrePage() {
  return (
    <main>
      <Hero />
      <Genese />
      <Services />
      <Equipe />
      <Banner />
      <SectionCercles />
      <Timeline />
      <Final />
    </main>
  );
}