'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/lib/useTranslations';

const INK  = '#0C0C0A';
const WINE = '#351421';
const ASH  = 'rgba(12,12,10,0.42)';
const BONE = 'rgba(12,12,10,0.06)';
const EASE = [0.16, 1, 0.3, 1];

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

function useCursorParallax(intensity = 10) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduced = useReducedMotionSafe();

  const onMouseMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    animate(x, -cx * intensity, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(y, -cy * intensity, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
  };

  const onMouseLeave = () => {
    animate(x, 0, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    animate(y, 0, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
}

function R({ children, d = 0, y = 32, className = '' }) {
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

function Cap({ children, accent = false, light = false, className = '' }) {
  return (
    <span className={`font-sans text-[11px] tracking-[0.55em] uppercase ${className}`}
      style={{ color: accent ? WINE : light ? 'rgba(255,255,255,0.35)' : 'rgba(12,12,10,0.38)' }}>
      {children}
    </span>
  );
}

function Trait({ light = false, className = '' }) {
  return <div className={`h-px w-4 flex-shrink-0 ${className}`}
    style={{ backgroundColor: light ? 'rgba(255,255,255,0.15)' : 'rgba(53,20,33,0.40)' }} />;
}

function Btn({ children, dark = false, href, onClick, size = 'default', className = '' }) {
  const [hov, setHov] = useState(false);
  const Tag = href ? Link : 'button';
  const padding = size === 'large' ? '20px 52px' : '15px 36px';
  return (
    <Tag href={href} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative overflow-hidden inline-flex items-center font-sans text-[9px] md:text-[11px] tracking-[0.45em] md:tracking-[0.55em] uppercase cursor-pointer select-none ${className}`}
      style={{
        padding,
        border: `1px solid ${hov ? WINE : dark ? 'rgba(255,255,255,0.18)' : BONE}`,
        color: hov ? '#F4F5F0' : dark ? 'rgba(255,255,255,0.65)' : INK,
        transition: 'border-color 0.5s, color 0.5s',
      }}>
      <motion.span className="absolute inset-0" style={{ backgroundColor: WINE }}
        initial={{ x: '-100%' }}
        animate={{ x: hov ? '0%' : '-100%' }}
        transition={{ duration: 0.55, ease: EASE }} />
      <span className="relative z-10">{children}</span>
    </Tag>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 01 — HERO
// ════════════════════════════════════════════════════════════════════════════
function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [muted, setMuted]     = useState(true);
  const [email, setEmail]     = useState('');
  const [focused, setFocused] = useState(false);
  const [sent, setSent]       = useState(false);
  const videoRef = useRef(null);
  const ref      = useRef(null);
  const reducedMotion = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setEmail('');
      setSent(true);
    } catch {}
  }

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#0C0C0A]"
      style={{ height: '100dvh', minHeight: 680 }}
    >
      <motion.div className="absolute inset-0" style={reducedMotion ? undefined : { y }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          preload="metadata"
          poster="/Complexe/1.jpg"
          aria-label="Vidéo d'ambiance — Domaine MYRA en Alsace"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) brightness(0.62) contrast(1.06)', opacity: 0.85 }}
        >
          <source src="https://52nwkkdv96g3ruub.public.blob.vercel-storage.com/Alsace.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A]/55 via-transparent to-[#0C0C0A]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/30 via-transparent to-transparent" />

      {/* Grain analogique */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Bouton son — mobile */}
      <div className="absolute top-20 right-6 z-30 md:hidden">
        <button onClick={toggleSound} className="outline-none" aria-label={muted ? t('sound_on') : t('sound_off')} aria-pressed={!muted}>
          <div
            className="w-8 h-8 flex items-center justify-center border transition-all duration-500"
            style={{ borderColor: !muted ? WINE : 'rgba(216,213,205,0.15)' }}
          >
            {!muted ? (
              <div className="flex items-end gap-[1.5px] h-2.5">
                {[1, 0.5, 0.85, 0.35, 0.92].map((h, i) => (
                  <motion.div key={i} className="w-[1px] rounded-full" style={{ backgroundColor: WINE }}
                    animate={{ height: ['2px', `${h * 8}px`, '2px'] }}
                    transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
                ))}
              </div>
            ) : (
              <div className="w-1 h-1 rounded-full bg-[rgba(216,213,205,0.20)]" />
            )}
          </div>
        </button>
      </div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-12 z-20"
        style={{ opacity }}
      >
        {/* Proposition de valeur — Brand Book : "Not a hotel. A way of living." */}
        <motion.div
          className="flex flex-col items-start mb-10 md:mb-16"
          initial={{ opacity: 0, x: reducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2.0, ease: EASE, delay: 0.3 }}
        >
          <h1
            className="font-serif font-light text-white uppercase"
            style={{ fontSize: 'clamp(36px, 5vw, 80px)', letterSpacing: '-0.01em', lineHeight: 0.88 }}
          >
            <span className="block">{t('tagline_1')}</span>
            <span className="font-serif font-light italic block mt-3" style={{ color: 'rgba(216,213,205,0.55)', fontSize: 'clamp(28px, 4vw, 60px)', letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'none' }}>
              {t('tagline_2')}
            </span>
          </h1>

          {/* H2 sémantique pour SEO — visuellement caché, présent dans le DOM/AX */}
          <h2 className="sr-only">
            Hébergement premium et recovery club en Alsace — suites privatives à Marlenheim
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-end justify-between gap-6 md:gap-10"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.8 }}
        >
          {/* Formulaire membership */}
          <div className="w-full md:w-[420px]">
            {sent ? (
              <p className="font-sans text-[10px] tracking-[0.30em] uppercase text-[rgba(216,213,205,0.40)]">
                {t('welcome')}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <label htmlFor="hero-email" className="block font-sans text-[9px] tracking-[0.45em] uppercase mb-4 text-[rgba(216,213,205,0.22)]">
                  {t('membership')}
                </label>
                <div
                  className="flex items-center gap-3 pb-2 border-b transition-all duration-700"
                  style={{ borderColor: focused ? WINE : 'rgba(216,213,205,0.12)' }}
                >
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={t('placeholder')}
                    className="flex-1 bg-transparent font-sans text-[10px] tracking-[0.20em] uppercase text-white placeholder:text-[rgba(216,213,205,0.14)] outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Transmettre"
                    className="w-7 h-7 flex items-center justify-center border border-[rgba(216,213,205,0.12)] hover:border-[#351421] transition-all duration-500 flex-shrink-0"
                  >
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2"
                      className="text-[rgba(216,213,205,0.35)]" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Socials + son — desktop */}
          <div className="hidden md:flex items-center gap-8 mb-1">
            {[
              { label: 'Instagram', href: 'https://instagram.com/myra.society' },
              { label: 'TikTok',    href: 'https://tiktok.com/@myra.society' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group relative pb-1 font-sans text-[9px] tracking-[0.35em] uppercase text-[rgba(216,213,205,0.22)] hover:text-[rgba(216,213,205,0.75)] transition-colors duration-500">
                {s.label}
                <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: WINE }} />
              </a>
            ))}

            <button onClick={toggleSound} className="group flex items-center gap-3 outline-none" aria-label={muted ? t('sound_on') : t('sound_off')} aria-pressed={!muted}>
              <div
                className="w-7 h-7 flex items-center justify-center border transition-all duration-500"
                style={{ borderColor: !muted ? WINE : 'rgba(216,213,205,0.10)' }}
              >
                {!muted ? (
                  <div className="flex items-end gap-[1.5px] h-2.5">
                    {[1, 0.5, 0.85, 0.35, 0.92].map((h, i) => (
                      <motion.div key={i} className="w-[1px] rounded-full" style={{ backgroundColor: WINE }}
                        animate={{ height: ['2px', `${h * 8}px`, '2px'] }}
                        transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
                    ))}
                  </div>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-[rgba(216,213,205,0.20)]" />
                )}
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 02 — STATEMENT
// ════════════════════════════════════════════════════════════════════════════
function Statement() {
  const t = useTranslations('statement');

  // Split la tagline en heading (2 premières phrases) + subhead (le reste)
  const tagline = t('tagline');
  const parts = tagline.split(/\.\s+/).filter(Boolean).map(s => s.endsWith('.') ? s : s + '.');
  const heading = parts.slice(0, 2).join(' ');
  const subhead = parts.slice(2).join(' ');

  return (
    <section aria-labelledby="statement-label" className="bg-[#F4F5F0] overflow-hidden py-14 md:py-24">
      <div className="editorial-grid">

        {/* Eyebrow */}
        <div className="col-span-12 md:col-span-3">
          <R>
            <div className="flex items-center gap-3">
              <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
              <Cap accent>
                <span id="statement-label">{t('label')}</span>
              </Cap>
            </div>
          </R>
        </div>

        {/* Manifesto — gros titre + sous-phrase d'action */}
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0">
          <R d={0.1}>
            <h2 className="font-serif font-light italic text-[#0C0C0A] m-0"
              style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              {heading}
            </h2>
          </R>
          {subhead && (
            <R d={0.2}>
              <p className="font-serif font-light italic mt-7 md:mt-12 m-0"
                style={{ fontSize: 'clamp(20px, 2.5vw, 36px)', lineHeight: 1.3, color: 'rgba(12,12,10,0.42)' }}>
                {subhead}
              </p>
            </R>
          )}
        </div>

      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 03 — EQUINOX SECTIONS
// ════════════════════════════════════════════════════════════════════════════
function VerticalGallery({ images, title }) {
  const [idx,   setIdx]   = useState(0);
  const [width, setWidth] = useState(0);
  const wrapRef = useRef(null);
  const x       = useMotionValue(0);
  const visible = images.slice(0, 4);
  const total   = visible.length;
  const PEEK = 56;
  const GAP  = 8;

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const slideW = width > 0 ? width - PEEK : 0;

  const snapTo = (i) => {
    setIdx(i);
    animate(x, -(i * (slideW + GAP)), { type: 'spring', stiffness: 400, damping: 40 });
  };

  useEffect(() => {
    if (slideW > 0) x.set(-(idx * (slideW + GAP)));
  }, [slideW]);

  const handleDragEnd = (_, info) => {
    let target = idx;
    if (info.velocity.x < -200 || info.offset.x < -slideW * 0.2) target = Math.min(idx + 1, total - 1);
    else if (info.velocity.x > 200 || info.offset.x > slideW * 0.2) target = Math.max(idx - 1, 0);
    snapTo(target);
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <div ref={wrapRef} style={{ position: 'relative', aspectRatio: '3/4', minHeight: 340, overflow: 'hidden', flex: 1 }}>
        {slideW > 0 && (
          <motion.div style={{ x, position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', gap: GAP, cursor: 'grabbing', touchAction: 'pan-y', width: total * slideW + (total - 1) * GAP + PEEK }}
            drag="x" dragConstraints={{ left: -((total - 1) * (slideW + GAP)), right: 0 }}
            dragElastic={0} dragMomentum={false} onDragEnd={handleDragEnd}>
            {visible.map((src, i) => (
              <div key={i} style={{ flexShrink: 0, width: slideW, height: '100%', overflow: 'hidden' }}>
                <motion.img src={src} alt={`${title} — vue ${i + 1}`} loading="lazy" decoding="async" draggable={false}
                  animate={{ filter: i === idx ? 'saturate(0.85) brightness(0.92) contrast(1.04)' : 'saturate(0.30) brightness(0.55)' }}
                  transition={{ duration: 0.35 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {visible.map((_, i) => (
          <button key={i} onClick={() => snapTo(i)} aria-label={`Image ${i + 1} sur ${total}`} aria-current={i === idx ? 'true' : undefined} className="outline-none"
            style={{ height: 2, flex: i === idx ? 3 : 1, backgroundColor: i === idx ? '#0C0C0A' : 'rgba(12,12,10,0.15)', transition: 'flex 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.3s', border: 'none', padding: 0, cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}

function SectionContent({ num, label, title, description, href, cta, headingId, reverse = false, isSignature = false }) {
  return (
    <div className={`flex flex-col justify-center w-full h-full relative ${reverse ? 'md:pr-20' : 'md:pl-20'}`}>
      <div className="absolute -top-4 font-serif font-light select-none pointer-events-none hidden md:block"
        style={{
          fontSize: isSignature ? 'clamp(120px, 13vw, 200px)' : 'clamp(100px, 12vw, 160px)',
          color: isSignature ? 'rgba(53,20,33,0.06)' : 'rgba(12,12,10,0.04)',
          lineHeight: 1,
          left: reverse ? 'auto' : '60px',
          right: reverse ? '60px' : 'auto',
        }}>
        {num}
      </div>
      <R>
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-8">
          <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
          <Cap accent>{label}</Cap>
        </div>
      </R>
      <R d={0.1}>
        <h2 id={headingId} className={`font-serif font-light leading-[0.92] tracking-[-0.02em] text-[#0C0C0A] mb-4 md:mb-6 ${
          isSignature
            ? 'text-[clamp(32px,6.5vw,48px)] md:text-[clamp(36px,4vw,58px)]'
            : 'text-[clamp(28px,6vw,42px)] md:text-[clamp(32px,3.5vw,52px)]'
        }`}>
          {title}
        </h2>
      </R>
      <R d={0.18}>
        <p className="font-sans text-[12px] md:text-[13px] leading-[2.2] font-light text-[rgba(12,12,10,0.48)] mb-6 md:mb-12 max-w-[380px]">
          {description}
        </p>
      </R>
      <R d={0.25}>
        <Btn href={href}>{cta}</Btn>
      </R>
    </div>
  );
}

function ServicesIntro() {
  const t = useTranslations('services');
  return (
    <section id="services-intro" aria-labelledby="services-intro-label"
      className="bg-[#F4F5F0] overflow-hidden py-10 md:py-16">
      <div className="editorial-grid">
        <div className="col-span-12">
          <R>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
              <h2 id="services-intro-label" className="font-sans text-[11px] tracking-[0.55em] uppercase m-0"
                style={{ color: WINE }}>
                {t('label')}
              </h2>
            </div>
          </R>
          <R d={0.1}>
            <p className="font-serif font-light italic text-[#0C0C0A] m-0 whitespace-nowrap md:whitespace-normal"
              style={{ fontSize: 'clamp(26px, 3.8vw, 60px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {t('intro')}
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}

function EquinoxSections() {
  const locale = useLocale();
  const t = useTranslations('services');

  const SECTIONS = [
    { id: 'suites', num: '01', label: t('s4_tags'), title: 'Chambres & Suites',
      description: 'Suites privatives en Alsace. Chaque espace a été pensé pour la récupération et le ressourcement. Luxe discret, matières nobles, silence des vignes.',
      href: `/${locale}/hebergement`, cta: 'Découvrir les suites',
      images: ['/Edwige/1.jpg', '/Edwige/2.jpg', '/Wingert/1.jpg', '/Julia/1.jpg'], reverse: false },
    { id: 'table', num: '02', label: t('s3_tags'), title: 'Table & Nutrition',
      description: 'Restaurant diététique, circuits courts, accords pensés pour votre métabolisme. Une table réelle, pas un catalogue. La cuisine comme acte de soin.',
      href: `/${locale}/nous-rejoindre`, cta: 'En savoir plus',
      images: ['/Visuels/Restaurant.jpg', '/Restaurant/B.jpg', '/Restaurant/A.jpg'], reverse: true },
    { id: 'recovery', num: '03', label: t('s2_tags'), title: 'Spa, Fitness & Récupération',
      description: "200 m² dédiés au corps en mouvement et au repos. Plateau performance, sauna, hammam, balnéo, soins. Un espace pour revenir à soi, sans compromis sur l'intensité.",
      href: `/${locale}/nous-rejoindre`, cta: "Découvrir l'espace",
      images: ['/Visuels/Coaching.jpg', '/Visuels/Hammam.jpg', '/Fitness/A.jpg', '/Visuels/Massage.jpg'], reverse: false },
  ];

  return (
    <div className="block">
      {SECTIONS.map((s) => {
        const headingId = `${s.id}-title`;
        const isSignature = s.num === '01';
        return (
          <section key={s.num} id={s.id} aria-labelledby={headingId}
            className="w-full bg-[#F4F5F0] overflow-hidden">
            <div className={`max-w-container mx-auto relative ${isSignature ? 'py-12 md:py-20' : 'py-10 md:py-16'}`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch" style={{ direction: s.reverse ? 'rtl' : 'ltr' }}>
                {/* Galerie — col-span-7 desktop (image dominante) */}
                <div style={{ direction: 'ltr' }} className="md:col-span-7 order-2 md:order-none">
                  <VerticalGallery images={s.images} title={s.title} />
                </div>
                {/* Contenu — col-span-5 desktop, order-1 sur mobile (texte au-dessus) */}
                <div style={{ direction: 'ltr' }} className="md:col-span-5 order-1 md:order-none px-6 md:px-0 pb-6 md:pb-0 md:flex md:items-center md:py-0">
                  <SectionContent num={s.num} label={s.label} title={s.title} description={s.description}
                    href={s.href} cta={s.cta} headingId={headingId} reverse={s.reverse} isSignature={isSignature} />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 04 — CITATION
// ════════════════════════════════════════════════════════════════════════════
function Citation() {
  const t = useTranslations('citation');

  // Structure prête à recevoir N témoignages. Pour ajouter une voix : ajouter une entrée ici
  // (et étendre les keys i18n correspondantes dans messages/*.json).
  const QUOTES = [
    { text: t('text'), author: t('author'), role: t('role') },
  ];

  const [idx, setIdx] = useState(0);
  const current = QUOTES[idx];
  const hasMultiple = QUOTES.length > 1;

  const reviewJsonLd = hasMultiple
    ? {
        '@context': 'https://schema.org',
        '@graph': QUOTES.map((q) => ({
          '@type': 'Review',
          itemReviewed: { '@type': 'LodgingBusiness', '@id': 'https://myrasociety.com/#lodging', name: 'MYRA Society' },
          reviewBody: q.text,
          author: { '@type': 'Person', name: q.author },
        })),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: { '@type': 'LodgingBusiness', '@id': 'https://myrasociety.com/#lodging', name: 'MYRA Society' },
        reviewBody: current.text,
        author: { '@type': 'Person', name: current.author },
      };

  return (
    <section className="overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
      <figure className="relative w-full overflow-hidden m-0" style={{ height: '70vh', minHeight: 380 }}>
        <motion.img src="/DA/Nouveau.png" alt="" loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
          initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 3.5, ease: EASE }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(12,12,10,0.35) 0%, rgba(12,12,10,0.70) 100%)' }} />
        {/* Grain analogique — sections Ink */}
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-8 md:px-32 z-[2]">
          <div className="max-w-2xl text-center">
            <motion.div className="mb-8 flex justify-center"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
              <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.6 }} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 1.4, ease: EASE }}>
                <blockquote className="m-0 p-0">
                  <p className="font-serif font-light leading-[1.4] text-white m-0"
                    style={{ fontSize: 'clamp(20px, 3vw, 38px)', letterSpacing: '-0.01em' }}>
                    {current.text}
                  </p>
                </blockquote>
                <figcaption className="mt-10 md:mt-12 flex flex-col items-center gap-1">
                  <cite className="font-serif font-light italic" style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', color: 'rgba(255,255,255,0.65)' }}>
                    — {current.author}
                  </cite>
                  <span className="font-sans uppercase mt-1" style={{ fontSize: '10px', letterSpacing: '0.40em', color: 'rgba(255,255,255,0.30)' }}>
                    {current.role}
                  </span>
                </figcaption>
              </motion.div>
            </AnimatePresence>

            {hasMultiple && (
              <div className="mt-10 flex justify-center gap-2" role="group" aria-label="Témoignages">
                {QUOTES.map((_, i) => (
                  <button key={i} type="button" onClick={() => setIdx(i)}
                    aria-label={`Témoignage ${i + 1} sur ${QUOTES.length}`}
                    aria-current={i === idx ? 'true' : undefined}
                    className="h-px p-0 transition-all duration-500 outline-none cursor-pointer"
                    style={{ width: i === idx ? 24 : 10, backgroundColor: i === idx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', border: 'none' }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </figure>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 05 — COMPLEXE
// ════════════════════════════════════════════════════════════════════════════
function Complexe() {
  const t = useTranslations('complexe');
  return (
    <section id="complexe" aria-labelledby="complexe-label"
      className="bg-[#F4F5F0] section-lg overflow-hidden">
      <div className="editorial-grid">

        {/* LEFT — grid 3 lignes : top (label) / middle (titre+paragraphes centrés vertical) / bottom (vide) — aligné à gauche */}
        <div className="col-span-12 md:col-span-6 md:col-start-1 order-2 md:order-1
          py-10 md:py-0 px-4 md:px-8 lg:px-14
          md:min-h-[78vh]
          grid grid-rows-[auto_auto_auto] md:grid-rows-[auto_1fr_auto]
          text-left gap-y-10 md:gap-y-0">

          {/* TOP — label seul, aligné gauche */}
          <div className="flex items-center justify-start w-full">
            <R>
              <div className="flex items-center gap-3">
                <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                <h3 id="complexe-label" className="font-sans text-[11px] tracking-[0.55em] uppercase m-0"
                  style={{ color: WINE }}>
                  {t('label')}
                </h3>
              </div>
            </R>
          </div>

          {/* MIDDLE — titre + paragraphes ensemble, centrés verticalement mais aligné gauche */}
          <div className="flex items-center justify-start w-full">
            <div className="space-y-7 md:space-y-10 max-w-md">
              <R d={0.15}>
                <h2 className="font-serif font-light italic text-[#0C0C0A] m-0"
                  style={{ fontSize: 'clamp(28px, 3.8vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  {t('title')}
                </h2>
              </R>
              <R d={0.25}>
                <div className="space-y-7 md:space-y-9">
                  <p className="font-sans font-light text-[rgba(12,12,10,0.55)] m-0"
                    style={{ fontSize: '13px', lineHeight: 1.9 }}>
                    {t('text')}
                  </p>
                  <p className="font-sans font-light text-[rgba(12,12,10,0.55)] m-0"
                    style={{ fontSize: '13px', lineHeight: 1.9 }}>
                    {t('text_2')}
                  </p>
                </div>
              </R>
            </div>
          </div>

          {/* BOTTOM — vide pour Complexe */}
          <div aria-hidden="true" />
        </div>

        {/* RIGHT — image carrée, contenue dans la hauteur d'une page */}
        <div className="col-span-12 md:col-span-6 md:col-start-7 order-1 md:order-2">
          <R d={0.1}>
            <div className="relative overflow-hidden mx-auto"
              style={{ aspectRatio: '1/1', maxHeight: '78vh' }}>
              <motion.img src="/Visuels/Exterieur 71.jpg" alt={`MYRA — ${t('label')}`}
                loading="lazy" decoding="async"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
                whileHover={{ scale: 1.02 }} transition={{ duration: 2.5, ease: EASE }} />
            </div>
          </R>
        </div>

      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 05 — COMMUNAUTÉ PRIVÉE (banner cinématique)
// ════════════════════════════════════════════════════════════════════════════
function CommunautePrivee() {
  const t = useTranslations('communaute');
  const locale = useLocale();
  return (
    <section id="communaute" aria-labelledby="communaute-label"
      className="bg-[#F4F5F0] section-lg overflow-hidden">
      <div className="editorial-grid">

        {/* Banner image avec titre + texte + CTA superposés en overlay */}
        <div className="col-span-12 relative overflow-hidden"
          style={{ height: 'clamp(540px, 78vh, 820px)' }}>

          {/* Image cinématique */}
          <motion.img src="/Visuels/Communauté.jpg" alt={t('label')}
            loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) brightness(0.58) contrast(1.06)' }}
            initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 4, ease: EASE }} />

          {/* Voile dégradé renforcé pour la lisibilité du texte overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(12,12,10,0.40) 0%, rgba(12,12,10,0.28) 45%, rgba(12,12,10,0.58) 100%)' }} />

          {/* Grain analogique */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              opacity: 0.035,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px',
            }} />

          {/* Overlay : titre + texte + CTA stack centré */}
          <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-6 md:px-16 gap-8 md:gap-12">
            <R>
              <h3 className="font-serif font-light italic m-0"
                style={{ fontSize: 'clamp(44px, 6.5vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#F4F5F0' }}>
                {t('welcome')}
              </h3>
            </R>
            <R d={0.12}>
              <p className="font-sans font-light m-0 max-w-xl mx-auto"
                style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', lineHeight: 1.9, color: 'rgba(244,245,240,0.72)' }}>
                {t('description')}
              </p>
            </R>
            <R d={0.24}>
              <Link href={`/${locale}/nous-rejoindre`} aria-label={t('cta')}
                className="inline-flex items-center px-8 md:px-12 py-4 md:py-5
                  border border-[rgba(244,245,240,0.30)] hover:border-[#F4F5F0]
                  backdrop-blur-md bg-[rgba(244,245,240,0.06)] hover:bg-[rgba(244,245,240,0.14)]
                  transition-all duration-500">
                <span className="font-sans uppercase text-[#F4F5F0]"
                  style={{ fontSize: '10px', letterSpacing: '0.45em' }}>
                  {t('cta')}
                </span>
              </Link>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 06 — DOUBLE IMAGE
// ════════════════════════════════════════════════════════════════════════════
function DoubleImage() {
  const t = useTranslations('double');
  const spaces = [t('space_1'), t('space_2'), t('space_3'), t('space_4'), t('space_5')];
  return (
    <section id="hospitalite" aria-labelledby="double-label"
      className="bg-[#F4F5F0] section-lg overflow-hidden">
      <div className="editorial-grid">

        {/* LEFT — 2 images portrait side by side, calées à la hauteur d'une page */}
        <div className="col-span-12 md:col-span-7 md:col-start-1 order-1">
          <R d={0.1}>
            <div className="grid grid-cols-2 gap-2 md:gap-3 md:h-[78vh]">
              <div className="relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-full">
                <motion.img src="/Complexe/C.jpg" alt="MYRA — Complexe"
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
                  whileHover={{ scale: 1.03 }} transition={{ duration: 2, ease: EASE }} />
              </div>
              <div className="relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-full">
                <motion.img src="/Fitness/C.jpg" alt="MYRA — Fitness"
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
                  whileHover={{ scale: 1.03 }} transition={{ duration: 2, ease: EASE }} />
              </div>
            </div>
          </R>
        </div>

        {/* RIGHT — grid 3 lignes : top (label) / middle (paragraphe centré vertical) / bottom (liste) */}
        <div className="col-span-12 md:col-span-4 md:col-start-9 order-2
          py-10 md:py-0 px-4 md:px-8 lg:px-14
          md:min-h-[78vh]
          grid grid-rows-[auto_auto_auto] md:grid-rows-[auto_1fr_auto]
          text-center gap-y-10 md:gap-y-0">

          {/* TOP — label */}
          <div className="flex items-center justify-center w-full">
            <R>
              <div className="flex items-center gap-3">
                <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                <h3 id="double-label" className="font-sans text-[11px] tracking-[0.55em] uppercase m-0"
                  style={{ color: WINE }}>
                  {t('label')}
                </h3>
                <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
              </div>
            </R>
          </div>

          {/* MIDDLE — paragraphe centré vertical */}
          <div className="flex items-center justify-center w-full">
            <R d={0.15} className="w-full">
              <p className="font-sans font-light text-[rgba(12,12,10,0.55)] m-0 max-w-md mx-auto"
                style={{ fontSize: '13px', lineHeight: 1.9 }}>
                {t('text')}
              </p>
            </R>
          </div>

          {/* BOTTOM — liste horizontale */}
          <R d={0.35}>
            <ul role="list" className="m-0 p-0 list-none flex flex-wrap items-center justify-center gap-x-3 gap-y-2 max-w-sm mx-auto">
              {spaces.map((s, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="font-sans uppercase whitespace-nowrap"
                    style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(12,12,10,0.45)' }}>
                    {s}
                  </span>
                  {i < spaces.length - 1 && (
                    <span aria-hidden="true" style={{ color: 'rgba(12,12,10,0.20)', fontSize: '5px' }}>●</span>
                  )}
                </li>
              ))}
            </ul>
          </R>

        </div>

      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 07 — GALLERY
// ════════════════════════════════════════════════════════════════════════════
function Gallery() {
  const t = useTranslations('gallery');
  const GALLERY_IMGS = [
    { src: '/Complexe/A.jpg',   label: t('img1') },
    { src: '/Fitness/2.jpg',    label: t('img2') },
    { src: '/Restaurant/1.jpg', label: t('img3') },
    { src: '/Spa/1.jpg',        label: t('img4') },
    { src: '/Complexe/6.jpg',   label: t('img5') },
  ];
  const DURATION = 5000;
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const reducedMotion = useReducedMotionSafe();

  const goTo = (i) => { setCur(i); setProgress(0); };
  const next = () => goTo((cur + 1) % GALLERY_IMGS.length);
  const prev = () => goTo((cur - 1 + GALLERY_IMGS.length) % GALLERY_IMGS.length);

  useEffect(() => {
    setProgress(0);
    if (reducedMotion) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p < 1) { intervalRef.current = requestAnimationFrame(tick); }
      else { setCur(c => (c + 1) % GALLERY_IMGS.length); }
    };
    intervalRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(intervalRef.current);
  }, [cur, reducedMotion]);

  const handleDragStart = (e) => {
    startRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragging(true);
  };
  const handleDragEnd = (e) => {
    if (!dragging) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startRef.current - endX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setDragging(false);
  };

  return (
    <section id="gallery" role="region" className="bg-[#0C0C0A] overflow-hidden select-none relative"
      style={{ cursor: 'grab' }}
      onMouseDown={handleDragStart} onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}>

      {/* Ratio responsive — 4/3 sur mobile, 21/9 sur desktop */}
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.img key={cur} src={GALLERY_IMGS[cur].src} alt={GALLERY_IMGS[cur].label} loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            draggable={false} />
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(12,12,10,0.65) 0%, transparent 55%)' }} />

      {/* Grain analogique — section Ink */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Label image — caché sur mobile */}
      <div className="absolute bottom-16 left-8 md:left-14 z-10 hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div key={GALLERY_IMGS[cur].label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.55em]"
              style={{ color: 'rgba(244,245,240,0.45)' }}>
              {GALLERY_IMGS[cur].label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compteur — caché sur mobile */}
      <div className="absolute bottom-16 right-8 md:right-14 z-10 hidden md:block">
        <span className="font-sans text-[10px] tracking-[0.45em] tabular-nums"
          style={{ color: 'rgba(244,245,240,0.30)' }}>
          {String(cur + 1).padStart(2, '0')} / {String(GALLERY_IMGS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Tirets seulement — centré bas */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
        <div className="flex gap-2" style={{ width: 160 }}>
          {GALLERY_IMGS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              aria-label={`Image ${i + 1} sur ${GALLERY_IMGS.length}`}
              aria-current={i === cur ? 'true' : undefined}
              className="relative flex-1 outline-none cursor-pointer overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', height: 2 }}>
              {i === cur && (
                <motion.div className="absolute top-0 left-0 h-full"
                  style={{ backgroundColor: '#F4F5F0', width: `${progress * 100}%` }} />
              )}
              {i < cur && (
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.55)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 08 — ÉQUIPE
// ════════════════════════════════════════════════════════════════════════════
function Equipe() {
  const t = useTranslations('team');
  const [act, setAct] = useState(0);

  const EQUIPE = [
    { src: '/Tina.jpg',   name: 'Tina F.',   role: 'Head Coach',       quote: t('tina_quote'),   instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/tina-fourrier-44636a188/' },
    { src: '/Jérémy.jpg', name: 'Jérémy P.', role: 'Directeur Général', quote: t('jeremy_quote'), instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/jeremy-paulen/' },
  ];

  const peopleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': EQUIPE.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      image: `https://myrasociety.com${m.src}`,
      worksFor: { '@id': 'https://myrasociety.com/#lodging' },
      sameAs: [m.instagram, m.linkedin],
    })),
  };

  return (
    <section id="equipe" aria-labelledby="equipe-label" className="bg-[#F4F5F0] overflow-hidden py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(peopleJsonLd) }} />
      <div className="max-w-container mx-auto px-6 md:px-0">
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <Trait />
          <h2 id="equipe-label" className="font-sans text-[11px] tracking-[0.55em] uppercase m-0" style={{ color: WINE }}>
            {t('label')}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
          <div className="lg:col-span-8 relative overflow-hidden" style={{ aspectRatio: '4/5', minHeight: 460 }}>
            <AnimatePresence mode="wait">
              <motion.img key={EQUIPE[act].src} src={EQUIPE[act].src} alt={EQUIPE[act].name} loading="lazy" decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }} />
            </AnimatePresence>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between px-0 lg:px-10 py-10 lg:py-0"
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
                      {EQUIPE[act].quote}
                    </p>
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              {/* Sélecteur — au dessus des liens sur mobile */}
              <ul role="list" className="flex items-center gap-6 mb-6 m-0 p-0 list-none">
                {EQUIPE.map((m, i) => (
                  <li key={i}>
                    <button onClick={() => setAct(i)} aria-label={`${m.name} — ${m.role}`} aria-pressed={i === act} className="flex items-center gap-4 outline-none">
                      <motion.div className="relative overflow-hidden flex-shrink-0" style={{ width: 52, height: 64 }}
                        animate={{ opacity: i === act ? 1 : 0.25, filter: i === act ? 'saturate(0.85) brightness(0.92) contrast(1.04)' : 'saturate(0.30) brightness(0.55)' }}
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
              <div className="flex items-center gap-6 pt-6" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
                {['instagram', 'linkedin'].map(r => (
                  <a key={r} href={EQUIPE[act][r]} target="_blank" rel="noopener noreferrer"
                    className="group/link relative pb-1 font-sans text-[9px] tracking-[0.40em] uppercase transition-colors duration-400"
                    style={{ color: 'rgba(12,12,10,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.color = INK}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(12,12,10,0.25)'}>
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
// 09 — SUPPORT POSTER
// ════════════════════════════════════════════════════════════════════════════
function SupportPoster() {
  const t = useTranslations('poster');
  const locale = useLocale();
  const reducedMotion = useReducedMotionSafe();
  return (
    <section id="soutenir-cta" aria-labelledby="poster-title" className="relative overflow-hidden" style={{ backgroundColor: INK, minHeight: 380 }}>
      <motion.img src="/DA/Double visage.jpg" alt="" loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.42) contrast(1.10)' }}
        initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 3, ease: EASE }} />
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${INK}CC 0%, ${INK}55 50%, ${INK}DD 100%)` }} />
      {/* Grain analogique — section Ink */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />
      <motion.div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-8 py-12 md:py-20"
        style={{ minHeight: 380 }}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}>
        <div className="max-w-[560px] w-full">
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-px w-8 opacity-40" style={{ backgroundColor: WINE }} />
            <Cap light style={{ opacity: 0.40 }}>{t('label')}</Cap>
            <div className="h-px w-8 opacity-40" style={{ backgroundColor: WINE }} />
          </div>
          <h2 id="poster-title" className="font-serif font-light text-white leading-[1.02] mb-6"
            style={{ fontSize: 'clamp(30px, 4vw, 62px)', color: '#FFFFFF' }}>
            {t('title').split('\n').map((line, i) => (
              <span key={i} className={i === 1 ? 'italic block' : 'block'}>{line}</span>
            ))}
          </h2>
          <p className="font-sans font-light tracking-[0.18em] uppercase mb-10 mx-auto"
            style={{ fontSize: '11px', lineHeight: '2.2', color: 'rgba(255,255,255,0.25)', maxWidth: 280 }}>
            {t('text')}
          </p>
          <Btn href={`/${locale}/nous-rejoindre`} dark size="large">{t('cta')}</Btn>
        </div>
      </motion.div>
      <footer className="relative z-10 px-6 md:px-16 py-6 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="font-sans text-[8px] tracking-[0.30em] uppercase" style={{ color: 'rgba(244,245,240,0.18)' }}>{t('copyright')}</span>
        <span className="font-sans text-[8px] tracking-[0.30em] uppercase" style={{ color: 'rgba(244,245,240,0.18)' }}>{t('location')}</span>
      </footer>
    </section>
  );
}

export default function Page() {
  return (
    <main className="bg-[#F4F5F0]">
      {/* 1 — Hero manifeste */}
      <Hero />
      {/* 2 — Bloc manifeste */}
      <Statement />
      {/* 3 — Bloc complexe MYRA */}
      <Complexe />
      {/* 4 — Bloc recovery / body ritual */}
      <DoubleImage />
      {/* 5 — Bloc équipe / experts */}
      <Equipe />
      {/* 6 — Bloc communauté privée */}
      <CommunautePrivee />
      {/* 7 — Collection d'expériences (intro + carrousels) */}
      <ServicesIntro />
      <EquinoxSections />
      {/* 8 — Bloc expansion */}
      <SupportPoster />
    </main>
  );
}