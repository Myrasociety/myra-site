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
        <div className="flex items-center gap-8 mb-12 md:mb-20">
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
                <p className="font-sans font-light text-[rgba(12,12,10,0.55)] text-[13px] leading-[2.0] md:text-[14px] md:leading-[2.2]">{t('genese_p1')}</p>
              </R>
              <R d={0.35}>
                <p className="font-sans font-light text-[rgba(12,12,10,0.55)] text-[13px] leading-[2.0] md:text-[14px] md:leading-[2.2]">{t('genese_p2')}</p>
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
// 03 — L'AVENIR (mirror Genèse : texte gauche, image droite)
// ════════════════════════════════════════════════════════════════════════════
function Avenir() {
  const t = useTranslations('soutenir');
  return (
    <section id="avenir" aria-labelledby="avenir-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto px-6 md:px-0">

        {/* Eyebrow seul, en haut */}
        <div className="mb-12 md:mb-20">
          <R>
            <div className="flex items-center gap-4">
              <Trait />
              <Cap accent>
                <span id="avenir-label">{t('avenir_label')}</span>
              </Cap>
            </div>
          </R>
        </div>

        {/* Body : texte gauche + portrait droite */}
        <div className="grid grid-cols-12 gap-8 items-stretch">
          {/* Texte gauche */}
          <div className="col-span-12 md:col-span-5 md:col-start-1 order-1 md:order-none md:flex md:flex-col md:justify-between md:py-2 space-y-10 md:space-y-0">

            {/* Titre + paragraphes */}
            <div className="space-y-7 md:space-y-9">
              <R>
                <h2 className="font-serif font-light italic text-[#0C0C0A] m-0"
                  style={{ fontSize: 'clamp(26px, 3.4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  {t('avenir_title')}
                </h2>
              </R>
              <R d={0.12}>
                <p className="font-sans font-light m-0"
                  style={{ fontSize: '13px', lineHeight: 2.0, color: 'rgba(12,12,10,0.55)' }}>
                  {t('avenir_p1')}
                </p>
              </R>
              <R d={0.22}>
                <p className="font-sans font-light m-0"
                  style={{ fontSize: '13px', lineHeight: 2.0, color: 'rgba(12,12,10,0.55)' }}>
                  {t('avenir_p2')}
                </p>
              </R>
            </div>

            {/* Signature seule, bas gauche */}
            <R d={0.32}>
              <div className="flex items-center gap-4 pt-8 md:pt-10 mt-10 md:mt-14 border-t border-[rgba(12,12,10,0.08)]">
                <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.40 }} />
                <span className="font-sans uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.45em', color: 'rgba(12,12,10,0.55)' }}>
                  {t('avenir_speaker_name')}
                </span>
              </div>
            </R>
          </div>

          {/* Portrait droite */}
          <div className="col-span-12 md:col-span-6 md:col-start-7 order-2 md:order-none relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <motion.img src="/Tina.jpg" alt={`MYRA — ${t('avenir_speaker_name')}`}
              loading="lazy" decoding="async"
              className="w-full h-full object-cover object-top"
              style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
              whileHover={{ scale: 1.03, filter: 'saturate(1)' }}
              transition={{ duration: 1.8, ease: EXPO }} />
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
      {/* Header — reste contenu max-w-container */}
      <div className="max-w-container mx-auto px-6 md:px-0 mb-12 md:mb-20">
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

      {/* Grille immersive — cards collées (gap-0) + marge latérale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 px-6 md:px-10 lg:px-14">
        {SERVICES.map((s, i) => (
          <R key={s.id} d={i * 0.08}>
            <a href={s.pdf} target="_blank" rel="noopener noreferrer"
              aria-label={`${s.label} — PDF`}
              className="group block outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#F4F5F0]">

              {/* Image grande portrait avec num overlay */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '9/14' }}>
                <motion.img src={s.image} alt={s.label}
                  loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1800ms] group-hover:scale-[1.04]"
                  style={{ filter: 'saturate(0.85) brightness(0.78) contrast(1.05)' }} />
                {/* Voile bas pour ancrer le texte overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(12,12,10,0.55) 0%, rgba(12,12,10,0.10) 35%, transparent 60%)' }} />
                {/* Num top-left */}
                <span className="absolute top-5 md:top-7 left-5 md:left-7 z-10 font-sans uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.55em', color: 'rgba(244,245,240,0.65)' }}>
                  {s.num}
                </span>
                {/* Titre + desc + CTA overlay bottom-left */}
                <div className="absolute bottom-5 md:bottom-8 left-5 md:left-8 right-5 md:right-8 z-10">
                  <h3 className="font-serif font-light italic m-0 mb-3 md:mb-4"
                    style={{ fontSize: 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.0, letterSpacing: '-0.01em', color: '#F4F5F0' }}>
                    {s.label}
                  </h3>
                  <p className="font-sans font-light m-0 mb-5 md:mb-6 max-w-xs"
                    style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(244,245,240,0.70)' }}>
                    {s.desc}
                  </p>
                  <div className="inline-flex items-center gap-3 relative pb-1">
                    <span className="font-sans uppercase transition-colors duration-400"
                      style={{ fontSize: '9px', letterSpacing: '0.45em', color: 'rgba(244,245,240,0.70)' }}>
                      {t('cercle_decouvrir')}
                    </span>
                    <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ backgroundColor: 'rgba(244,245,240,0.85)' }} />
                  </div>
                </div>
              </div>
            </a>
          </R>
        ))}
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
      <div className="px-6 md:px-10 lg:px-14">
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
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CERCLES — swipe horizontal sur mobile
// ════════════════════════════════════════════════════════════════════════════
const OFFRES = [
  {
    id: 'investir', num: '01', name: 'Investir dans MYRA',
    audience: 'Investisseurs privés, business angels, family offices, entrepreneurs, partenaires financiers.',
    description: "Participer au financement d'une adresse fondatrice pensée comme le premier chapitre d'un modèle duplicable.",
    contribution: ['Apport en capital', 'Prêt privé', 'Investissement minoritaire', 'Accompagnement stratégique', 'Mise en relation financière'],
    benefits: ['Entrer tôt dans le projet', 'Soutenir une marque à fort potentiel', 'Participer à une vision hospitality, wellness et community', "Accéder à une relation privilégiée avec l'équipe fondatrice"],
    cta: 'Nous contacter',
  },
  {
    id: 'partenaire', num: '02', name: 'Devenir partenaire fondateur',
    audience: 'Entreprises locales, marques premium, acteurs du bien-être, institutions, fournisseurs haut de gamme.',
    description: "Associer son nom à la création d'un lieu emblématique en Alsace, entre hospitalité, soin et performance.",
    contribution: ['Soutien financier', 'Partenariat produit', 'Équipement', 'Visibilité croisée', 'Mécénat', 'Dotation', 'Fourniture de matériaux ou services'],
    benefits: ['Visibilité premium', 'Association à une marque émergente', 'Accès à une clientèle qualifiée', "Présence dans l'écosystème MYRA", 'Invitations partenaires'],
    cta: 'Nous contacter',
  },
  {
    id: 'membres', num: '03', name: 'Rejoindre les membres fondateurs',
    audience: 'Futurs membres, entrepreneurs, sportifs, créatifs, profils premium, habitants influents du territoire.',
    description: "Faire partie du premier cercle MYRA avant l'ouverture officielle.",
    contribution: ['Pré-inscription membership', 'Accès fondateur', 'Soutien par réservation anticipée', 'Participation aux premiers événements', 'Recommandation de nouveaux membres'],
    benefits: ['Accès prioritaire', 'Statut membre fondateur', 'Invitations privées', 'Conditions préférentielles éventuelles', 'Participation à la construction de la communauté'],
    cta: 'Nous contacter',
  },
  {
    id: 'reservation', num: '04', name: 'Réserver en avant-première',
    audience: 'Clients privés, couples, groupes, entreprises, retraites, séjours bien-être, événements confidentiels.',
    description: 'Soutenir le lancement en réservant les premières expériences MYRA.',
    contribution: ['Réservation de séjour', 'Privatisation', 'Retraite privée', 'Événement bien-être', 'Expérience corporate premium'],
    benefits: ['Accès prioritaire au domaine', 'Expérience personnalisée', 'Possibilité de privatiser certains espaces', 'Accompagnement sur mesure'],
    cta: 'Nous contacter',
  },
  {
    id: 'recommander', num: '05', name: 'Recommander MYRA',
    audience: 'Prescripteurs, entrepreneurs, hôteliers, coachs, architectes, journalistes, créateurs de contenu, réseaux privés.',
    description: 'Faire connaître MYRA aux bonnes personnes : membres, investisseurs, partenaires ou clients.',
    contribution: ['Mise en relation', 'Recommandation de membres', 'Introduction investisseur', 'Introduction marque', 'Relais média ou réseau privé'],
    benefits: ['Reconnaissance comme prescripteur', 'Accès aux événements privés', 'Relation privilégiée avec MYRA', "Possibilité d'intégrer le cercle ambassadeur"],
    cta: 'Nous contacter',
  },
];

function ModalDetails({ offre, close }) {
  const t = useTranslations('soutenir');
  const locale = useLocale();
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
            <h2 id={modalTitleId} className="font-serif text-[28px] md:text-[38px] font-light tracking-tight text-[#0C0C0A] m-0">{offre.name}</h2>
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase text-[rgba(12,12,10,0.35)]">{offre.num}</span>
          </div>
          <p className="font-serif text-[16px] md:text-[18px] leading-[1.8] italic max-w-md text-[rgba(12,12,10,0.50)] mb-12 m-0">{offre.description}</p>

          {/* Pour qui */}
          <section className="mb-12">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-5 text-[rgba(12,12,10,0.30)]">Pour qui</span>
            <p className="font-sans text-[13px] md:text-[14px] font-light leading-[1.8] text-[rgba(12,12,10,0.65)] m-0">{offre.audience}</p>
          </section>

          {/* Contribution */}
          <section className="mb-12 pt-6 border-t border-[rgba(12,12,10,0.06)]">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-6 text-[rgba(12,12,10,0.30)]">Contribution</span>
            <ul role="list" className="space-y-3 m-0 p-0 list-none">
              {offre.contribution.map((c, i) => (
                <li key={i} className="flex gap-4 items-baseline">
                  <span className="font-serif text-[13px] italic text-[rgba(12,12,10,0.25)]">0{i + 1}</span>
                  <span className="font-sans text-[13px] md:text-[14px] font-light leading-[1.7] text-[rgba(12,12,10,0.65)]">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Bénéfice */}
          <section className="mb-12 pt-6 border-t border-[rgba(12,12,10,0.06)]">
            <span className="font-sans text-[11px] tracking-[0.40em] uppercase block mb-6 text-[rgba(12,12,10,0.30)]">Bénéfice</span>
            <ul role="list" className="space-y-3 m-0 p-0 list-none">
              {offre.benefits.map((b, i) => (
                <li key={i} className="flex items-baseline gap-4">
                  <div className="w-3 h-px flex-shrink-0" style={{ backgroundColor: 'rgba(53,20,33,0.40)' }} />
                  <span className="font-sans text-[13px] md:text-[14px] font-light leading-[1.7] text-[rgba(12,12,10,0.65)]">{b}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-6 border-t border-[rgba(12,12,10,0.06)]">
            <Link href={`/${locale}/contact`}
              className="font-sans w-full h-14 md:h-16 border text-[9px] md:text-[11px] uppercase tracking-[0.50em] font-medium transition-all duration-500 border-[#351421] text-[#351421] hover:bg-[#351421] hover:text-[#F4F5F0] flex items-center justify-center">
              {offre.cta}
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardCercle({ offre }) {
  const t = useTranslations('soutenir');
  const locale = useLocale();
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
        className="group relative border flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-700 outline-none focus-visible:ring-1 focus-visible:ring-[#351421]
          w-full h-full p-6"
        style={{ borderColor: hov ? 'rgba(12,12,10,0.20)' : 'rgba(12,12,10,0.06)', minHeight: 540 }}>
        <motion.div className="absolute top-0 left-0 h-[2px] bg-[#351421]"
          initial={{ width: 0 }} animate={{ width: hov ? '100%' : 0 }} transition={{ duration: 0.8, ease: EXPO }} />
        <div className="absolute top-4 right-6 font-serif font-light select-none pointer-events-none"
          style={{ fontSize: '100px', color: 'rgba(12,12,10,0.04)', lineHeight: 1 }}>
          {offre.num}
        </div>
        <div className="relative z-10">
          <div className="mb-8">
            <span className="font-serif text-[24px] italic text-[#0C0C0A]">{offre.num}.</span>
          </div>
          <h3 className="font-serif text-[28px] mb-4 leading-[1.1] tracking-tight text-[#0C0C0A]">{offre.name}</h3>
          <p className="font-sans text-[13px] leading-[1.85] font-light mb-8 text-[rgba(12,12,10,0.45)]">{offre.description}</p>
          <div className="flex flex-col items-start gap-2 mb-6">
            {offre.contribution.slice(0, 4).map((c, i) => (
              <div key={i} className="px-3 py-2 bg-[rgba(12,12,10,0.02)]">
                <span className="font-sans text-[9px] uppercase tracking-[0.20em] font-medium text-[rgba(12,12,10,0.40)]">— {c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 pt-6 border-t border-[rgba(12,12,10,0.06)]">
          <Link href={`/${locale}/contact`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center h-12 md:h-14 w-full border transition-all duration-500 px-3"
            style={{ borderColor: '#351421', backgroundColor: hov ? '#351421' : 'transparent' }}>
            <span className="font-sans text-[9px] uppercase tracking-[0.40em] font-medium transition-colors duration-500 text-center"
              style={{ color: hov ? '#F4F5F0' : '#351421' }}>
              {offre.cta}
            </span>
          </Link>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">{open && <ModalDetails offre={offre} close={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function SectionCercles() {
  const t = useTranslations('soutenir');
  const scrollRef = useRef(null);

  const scrollByCard = (dir) => {
    if (!scrollRef.current) return;
    // Largeur card desktop (360) + gap (24) ≈ 384
    const step = 384;
    scrollRef.current.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section id="cercles" aria-labelledby="cercles-label" className="py-16 md:py-32 overflow-hidden">
      <div className="max-w-container mx-auto">
        {/* Header — eyebrow + sous-titre + flèches navigation */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-6 md:px-0">
          <div>
            <R>
              <div className="flex items-center gap-4">
                <Trait />
                <Cap accent>
                  <span id="cercles-label">{t('cercles_label')}</span>
                </Cap>
              </div>
            </R>
            <R d={0.1}>
              <h2 className="font-serif text-[26px] md:text-[48px] font-light italic mt-4 m-0 text-[rgba(12,12,10,0.28)]">
                {t('cercles_subtitle')}
              </h2>
            </R>
          </div>

          {/* Flèches navigation — desktop seulement */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scrollByCard(-1)} aria-label="Précédent"
              className="group w-11 h-11 rounded-full border border-[rgba(12,12,10,0.15)] hover:border-[#351421] flex items-center justify-center transition-colors duration-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"
                className="text-[rgba(12,12,10,0.50)] group-hover:text-[#351421] transition-colors duration-400">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={() => scrollByCard(1)} aria-label="Suivant"
              className="group w-11 h-11 rounded-full border border-[rgba(12,12,10,0.15)] hover:border-[#351421] flex items-center justify-center transition-colors duration-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"
                className="text-[rgba(12,12,10,0.50)] group-hover:text-[#351421] transition-colors duration-400">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll horizontal unifié — mobile (touch) + desktop (boutons flèches) */}
        <div ref={scrollRef}
          className="flex items-stretch gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 px-6 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingInline: '1.5rem' }}>
          {OFFRES.map(offre => (
            <div key={offre.id} className="snap-start shrink-0 w-[85vw] max-w-[380px] md:w-[360px]">
              <CardCercle offre={offre} />
            </div>
          ))}
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
      <div className="px-6 md:px-10 lg:px-14 mb-16 md:mb-24">
        <R y={30} d={0.2} className="w-full">
          <div className="relative group w-full" style={{ aspectRatio: '21/9', minHeight: '260px' }}>
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
      </div>
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
      <Avenir />
      <Banner />
      <SectionCercles />
      <Timeline />
      <Final />
    </main>
  );
}