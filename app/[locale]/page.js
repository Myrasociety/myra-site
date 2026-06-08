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
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0 }}
      animate={io ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: d }}>
      {children}
    </motion.div>
  );
}

function Cap({ children, accent = false, light = false, className = '' }) {
  return (
    <span className={`font-serif text-[14px] tracking-[0.28em] uppercase ${className}`}
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
      className={`relative overflow-hidden inline-flex items-center font-serif text-[9px] md:text-[11px] tracking-[0.45em] md:tracking-[0.55em] uppercase cursor-pointer select-none ${className}`}
      style={{
        padding,
        border: `1px solid ${hov ? WINE : dark ? 'rgba(255,255,255,0.18)' : BONE}`,
        color: hov ? '#f6f6f3' : dark ? 'rgba(255,255,255,0.65)' : INK,
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
    <section ref={ref} className="bg-[#f6f6f3] pt-11 md:pt-12">
      {/* Image pleine largeur avec signature + formulaire en overlay */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(460px, 78vh, 860px)' }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          preload="metadata"
          poster="/Complexe/1.jpg"
          aria-label="Vidéo d'ambiance — Domaine MYRA en Alsace"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) brightness(0.66) contrast(1.06)' }}
        >
          <source src="https://52nwkkdv96g3ruub.public.blob.vercel-storage.com/Alsace.mp4" type="video/mp4" />
        </video>

        {/* Voile pour lisibilité du texte en bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A]/20 via-transparent to-[#0C0C0A]/85" />

        {/* Grain analogique */}
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />

        {/* Bouton son */}
        <div className="absolute top-4 right-4 z-30">
          <button onClick={toggleSound} className="outline-none" aria-label={muted ? t('sound_on') : t('sound_off')} aria-pressed={!muted}>
            <div className="w-8 h-8 flex items-center justify-center border transition-all duration-500"
              style={{ borderColor: !muted ? WINE : 'rgba(244,245,240,0.30)' }}>
              {!muted ? (
                <div className="flex items-end gap-[1.5px] h-2.5">
                  {[1, 0.5, 0.85, 0.35, 0.92].map((h, i) => (
                    <motion.div key={i} className="w-[1px] rounded-full" style={{ backgroundColor: '#FFFFFF' }}
                      animate={{ height: ['2px', `${h * 8}px`, '2px'] }}
                      transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
                  ))}
                </div>
              ) : (
                <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.45)]" />
              )}
            </div>
          </button>
        </div>

        {/* Signature + formulaire — en overlay, bas */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-12 pb-6 md:pb-8">
          <motion.div
            className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-start md:items-end justify-end gap-6 md:gap-10"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
          >
            <h1 className="sr-only">
              Hébergement premium et recovery club en Alsace — suites privatives à Marlenheim
            </h1>

            {/* Formulaire membership — à droite */}
            <div className="w-full md:w-[420px]">
              {sent ? (
                <p className="font-serif text-[10px] tracking-[0.30em] uppercase text-[rgba(255,255,255,0.85)]">
                  {t('welcome')}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="w-full">
                  <label htmlFor="hero-email" className="block font-serif text-[9px] tracking-[0.45em] uppercase mb-2 text-[rgba(255,255,255,0.85)]">
                    {t('membership')}
                  </label>
                  <div
                    className="flex items-center gap-3 pb-2 border-b transition-all duration-700"
                    style={{ borderColor: focused ? WINE : 'rgba(255,255,255,0.45)' }}
                  >
                    <input
                      id="hero-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder={t('placeholder')}
                      className="flex-1 bg-transparent font-serif text-[10px] tracking-[0.20em] uppercase text-white placeholder:text-[rgba(255,255,255,0.55)] outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Transmettre"
                      className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.45)] hover:border-[#351421] transition-all duration-500 flex-shrink-0"
                    >
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2"
                        className="text-[rgba(255,255,255,0.80)]" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 01b — CONCEPT (mots-clés)
// ════════════════════════════════════════════════════════════════════════════
function Concept() {
  const t = useTranslations('concept');
  const ITEMS = [
    { cat: t('w1'), title: t('d1'), img: '/Visuels/Coaching.jpg',    ratio: '1 / 1' },
    { cat: t('w2'), title: t('d2'), img: '/Visuels/Hammam.jpg',      ratio: '2 / 3' },
    { cat: t('w3'), title: t('d3'), img: '/Edwige/1.jpg',            ratio: '5 / 4' },
    { cat: t('w4'), title: t('d4'), img: '/Visuels/Communauté.jpg',  ratio: '3 / 4' },
  ];
  return (
    <section aria-label={t('label')} className="bg-[#f6f6f3] pt-8 md:pt-12 pb-20 md:pb-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto md:px-12">
        {/* Mobile : flex scroll horizontal · Desktop : grid 4 cols */}
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-2 items-start
          overflow-x-auto md:overflow-visible snap-x md:snap-none snap-mandatory
          px-8 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingInline: '2rem' }}>
          {ITEMS.map((it, i) => (
            <div key={i} className={`snap-start shrink-0 w-[68vw] max-w-[280px] md:w-auto md:max-w-none ${i === ITEMS.length - 1 ? 'mr-8 md:mr-0' : ''}`}>
              <R d={i * 0.1}>
                <div className="relative overflow-hidden mb-5" style={{ aspectRatio: it.ratio }}>
                  <img src={it.img} alt={it.cat} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] hover:scale-[1.03]"
                    style={{ filter: 'saturate(0.92) contrast(1.02)' }} />
                </div>
                <p className="font-serif uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(12,12,10,0.40)' }}>
                  {it.cat}
                </p>
                <h3 className="font-serif font-light m-0" style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#0C0C0A', textWrap: 'pretty' }}>
                  {it.title}
                </h3>
              </R>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 02 — STATEMENT
// ════════════════════════════════════════════════════════════════════════════
function Statement() {
  const t = useTranslations('statement');

  const tagline = t('tagline');

  return (
    <section aria-labelledby="statement-label" className="bg-[#f6f6f3] overflow-hidden pt-10 md:pt-14 pb-16 md:pb-24">
      <div className="editorial-grid items-start">

        {/* Eyebrow — gauche */}
        <div className="col-span-12 md:col-span-3">
          <R>
            <span id="statement-label" className="font-serif uppercase block" style={{ fontSize: 'clamp(15px, 1.4vw, 21px)', letterSpacing: '0.18em', lineHeight: 1.1, color: '#0C0C0A' }}>
              {t('label')}
            </span>
          </R>
        </div>

        {/* Paragraphe serif — droite */}
        <div className="col-span-12 md:col-span-6 md:col-start-7 mt-6 md:mt-0">
          <R d={0.1}>
            <p className="font-sans font-light text-[#0C0C0A] m-0 text-left md:text-right"
              style={{ fontSize: 'clamp(16px, 1.9vw, 28px)', lineHeight: 1.4, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
              {tagline}
            </p>
          </R>
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
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
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
      className="bg-[#f6f6f3] overflow-hidden pt-10 md:pt-16 pb-4 md:pb-6">
      <div className="editorial-grid">
        <div className="col-span-12">
          <R>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
              <h2 id="services-intro-label" className="font-serif tracking-[0.28em] uppercase m-0"
                style={{ color: WINE, fontSize: '14px' }}>
                {t('label')}
              </h2>
            </div>
          </R>
          <R d={0.1}>
            <p className="font-serif font-light text-[#0C0C0A] m-0 whitespace-nowrap md:whitespace-normal"
              style={{ fontSize: 'clamp(22px, 2.6vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {(() => {
                const s = t('intro');
                const i = s.indexOf(',');
                return i === -1 ? s : <>{s.slice(0, i + 1)}<span className="italic">{s.slice(i + 1)}</span></>;
              })()}
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}

function EquinoxSections() {
  const locale = useLocale();
  const [active, setActive] = useState(0);

  const DISCIPLINES = [
    { id: 'suites', num: '01', title: 'Chambres & Suites', image: '/Edwige/1.jpg',
      desc: 'Suites privatives en Alsace, pensées pour la récupération et le ressourcement.',
      points: ['Suites privatives', 'Matières nobles, luxe discret', 'Le silence des vignes', 'Pensé pour le repos'],
      href: `/${locale}/hebergement`, cta: 'Découvrir les suites' },
    { id: 'table', num: '02', title: 'Table & Nutrition', image: '/Visuels/Restaurant.jpg',
      desc: 'Une table réelle, pas un catalogue. La cuisine comme acte de soin.',
      points: ['Restaurant diététique', 'Circuits courts', 'Accords pensés pour ton métabolisme', 'Le goût sans compromis'],
      href: `/${locale}/contact`, cta: 'En savoir plus' },
    { id: 'recovery', num: '03', title: 'Spa, Fitness & Récupération', image: '/Visuels/Coaching.jpg',
      desc: '200 m² dédiés au corps en mouvement et au repos, sans compromis sur l’intensité.',
      points: ['Plateau performance', 'Sauna · Hammam · Balnéo', 'Soins & massages', 'Revenir à soi'],
      href: `/${locale}/contact`, cta: "Découvrir l'espace" },
  ];

  const d = DISCIPLINES[active];

  return (
    <section id="disciplines" aria-label="Trois disciplines" className="bg-[#f6f6f3] overflow-hidden pt-4 md:pt-6 pb-10 md:pb-14">
      <div className="editorial-grid">
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">

          {/* GAUCHE — grande image de la discipline active */}
          <R d={0.1}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', maxHeight: '78vh' }}>
              <AnimatePresence mode="wait">
                <motion.img key={d.image} src={d.image} alt={d.title} loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }} />
              </AnimatePresence>
            </div>
          </R>

          {/* DROITE — sélecteur + description + points */}
          <div>
            {/* Sélecteur des 3 disciplines */}
            <ul className="m-0 p-0 list-none border-t" style={{ borderColor: 'rgba(12,12,10,0.12)' }}>
              {DISCIPLINES.map((x, i) => (
                <li key={x.id} className="border-b" style={{ borderColor: 'rgba(12,12,10,0.12)' }}>
                  <button onClick={() => setActive(i)} aria-pressed={i === active}
                    className="w-full flex items-baseline gap-4 py-3.5 text-left outline-none group">
                    <span className="font-serif tabular-nums" style={{ fontSize: '12px', color: i === active ? WINE : 'rgba(12,12,10,0.30)' }}>{x.num}</span>
                    <span className="font-serif uppercase tracking-[0.03em] transition-colors duration-300"
                      style={{ fontSize: 'clamp(18px, 2vw, 26px)', color: i === active ? INK : 'rgba(12,12,10,0.32)' }}>
                      {x.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Contenu de la discipline active */}
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EASE }} className="mt-8 md:mt-10">
                <p className="font-sans font-light m-0" style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(12,12,10,0.58)', textWrap: 'pretty' }}>
                  {d.desc}
                </p>
                <ul className="m-0 mt-6 p-0 list-none space-y-3">
                  {d.points.map((p, i) => (
                    <li key={i} className="flex items-baseline gap-3">
                      <span aria-hidden className="block w-1 h-1 rounded-full flex-shrink-0 translate-y-[-1px]" style={{ backgroundColor: WINE }} />
                      <span className="font-serif uppercase" style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(12,12,10,0.65)' }}>{p}</span>
                    </li>
                  ))}
                </ul>
                <Btn href={d.href} className="mt-9">{d.cta}</Btn>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 04 — CITATION
// ════════════════════════════════════════════════════════════════════════════
function Citation() {
  const t = useTranslations('citation');

  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'LodgingBusiness', '@id': 'https://myrasociety.com/#lodging', name: 'MYRA Society' },
    reviewBody: t('text'),
    author: { '@type': 'Person', name: t('author') },
  };

  return (
    <section className="relative bg-[#0C0C0A] py-24 md:py-40 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />

      {/* Grain analogique — signature sections Ink */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-6 md:px-12 text-center">
        {/* Citation */}
        <R d={0.1}>
          <blockquote className="m-0 p-0 mt-4 md:mt-6">
            <p className="font-sans font-light italic m-0"
              style={{ fontSize: 'clamp(22px, 3vw, 44px)', lineHeight: 1.35, letterSpacing: '-0.01em', textWrap: 'balance', color: 'rgba(244,245,240,0.94)' }}>
              {t('text')}
            </p>
            <footer className="mt-12 md:mt-16 flex flex-col items-center">
              <div className="w-10 h-px mb-6" style={{ backgroundColor: WINE, opacity: 0.5 }} />
              <cite className="font-sans uppercase not-italic m-0"
                style={{ fontSize: '11px', letterSpacing: '0.45em', color: 'rgba(244,245,240,0.85)' }}>
                {t('author')}
              </cite>
              <span className="font-sans uppercase mt-1.5"
                style={{ fontSize: '9px', letterSpacing: '0.40em', color: 'rgba(244,245,240,0.42)' }}>
                {t('role')}
              </span>
            </footer>
          </blockquote>
        </R>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 05 — COMPLEXE
// ════════════════════════════════════════════════════════════════════════════
function Complexe() {
  const t = useTranslations('complexe');
  return (
    <section id="complexe" aria-label={t('title')}
      className="bg-[#f6f6f3] py-16 md:py-24 overflow-hidden">
      <div className="editorial-grid">

        {/* LEFT — grid 3 lignes : top (label) / middle (titre+paragraphes centrés vertical) / bottom (vide) — aligné à gauche */}
        <div className="col-span-12 md:col-span-6 md:col-start-1 order-2 md:order-1
          py-10 md:py-0
          md:min-h-[78vh]
          grid grid-rows-[auto_auto_auto] md:grid-rows-[auto_1fr_auto]
          text-left gap-y-10 md:gap-y-0">

          {/* TITRE + paragraphes — remontés en haut */}
          <div className="flex items-center justify-start w-full">
            <div className="space-y-7 md:space-y-10 w-full max-w-[56ch]">
              <R d={0.15}>
                <h2 className="font-serif font-light text-[#0C0C0A] m-0"
                  style={{ fontSize: 'clamp(20px, 2.6vw, 36px)', lineHeight: 1.12, letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  {t('title')}
                </h2>
              </R>
              <R d={0.25}>
                <p className="font-sans font-light text-[rgba(12,12,10,0.55)] m-0"
                  style={{ fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.7, textWrap: 'pretty' }}>
                  {t('text')} {t('text_2')}
                </p>
              </R>
            </div>
          </div>

          {/* BOTTOM — vide pour Complexe */}
          <div aria-hidden="true" />
        </div>

        {/* RIGHT — image carrée, contenue dans la hauteur d'une page */}
        <div className="col-span-12 md:col-span-6 md:col-start-7 order-1 md:order-2">
          <R d={0.1}>
            <div className="relative overflow-hidden ml-auto"
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
  const tp = useTranslations('poster');
  const locale = useLocale();
  return (
    <section id="communaute" aria-labelledby="communaute-label"
      className="bg-[#f6f6f3] pt-16 md:pt-24 overflow-hidden">

        {/* Header hors bannière : Bienvenue (gauche) + texte (haut droite) */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12 md:mb-16 flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10">
          <R>
            <h2 id="communaute-label" className="font-serif font-light text-[#0C0C0A] m-0"
              style={{ fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              {t('welcome')}
            </h2>
          </R>
          <R d={0.12} className="w-full md:max-w-[620px] md:ml-auto md:text-right">
            <p className="font-sans font-light m-0"
              style={{ fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.7, color: 'rgba(12,12,10,0.55)', textWrap: 'balance' }}>
              {t('description')}
            </p>
          </R>
        </div>

        {/* Banner image plein largeur */}
        <div className="relative overflow-hidden"
          style={{ height: 'clamp(540px, 78vh, 820px)' }}>

          {/* Image cinématique */}
          <motion.img src="/Visuels/Communauté.jpg" alt={t('label')}
            loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) brightness(0.58) contrast(1.06)' }}
            />

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

          {/* Overlay : eyebrow + titre une ligne + CTA */}
          <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-6">
            <R>
              <span className="block font-sans uppercase mb-5 md:mb-7"
                style={{ fontSize: '11px', letterSpacing: '0.45em', color: 'rgba(244,245,240,0.70)' }}>
                Join the circle
              </span>
            </R>
            <R d={0.1}>
              <h2 className="font-serif font-light m-0 mb-8 md:mb-12 whitespace-nowrap"
                style={{ fontSize: 'clamp(18px, 2.4vw, 40px)', lineHeight: 1.0, letterSpacing: '-0.01em', color: '#F4F5F0' }}>
                Marlenheim is just day one.
              </h2>
            </R>
            <R d={0.22}>
              <Btn href={`/${locale}/contact`} dark size="large">Reach out</Btn>
            </R>
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
  const AXES = [
    { title: t('axis_1_title'), desc: t('axis_1_desc') },
    { title: t('axis_2_title'), desc: t('axis_2_desc') },
  ];
  return (
    <section id="hospitalite" aria-label={t('label')}
      className="bg-[#f6f6f3] pt-6 md:pt-10 pb-16 md:pb-24 overflow-hidden">
      <div className="editorial-grid">

        {/* LEFT — 2 images portrait side by side, calées à la hauteur d'une page */}
        <div className="col-span-12 md:col-span-7 md:col-start-1 order-1">
          <R d={0.1}>
            <div className="grid grid-cols-2 gap-2 md:h-[78vh]">
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

        {/* RIGHT — titre + sous-texte (performance/récupération) puis tags */}
        <div className="col-span-12 md:col-span-3 md:col-start-9 order-2
          py-10 md:py-0
          md:min-h-[78vh]
          flex flex-col justify-start text-left gap-8 md:gap-12">

          {/* Titre + sous-texte */}
          <R>
            <div>
              <h2 className="font-serif font-light text-[#0C0C0A] m-0"
                style={{ fontSize: 'clamp(22px, 2.6vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance' }}>
                {t('label')}
              </h2>
            </div>
          </R>

          {/* Axes de différenciation — numérotés, titre + description */}
          <R d={0.2}>
            <ul role="list" className="m-0 p-0 list-none w-full border-t" style={{ borderColor: 'rgba(12,12,10,0.14)' }}>
              {AXES.map((a, i) => (
                <li key={i} className="border-b" style={{ borderColor: 'rgba(12,12,10,0.14)' }}>
                  <div className="py-5 md:py-6">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif tabular-nums" style={{ fontSize: '11px', color: WINE }}>0{i + 1}</span>
                      <h3 className="font-serif uppercase m-0" style={{ fontSize: 'clamp(15px, 1.5vw, 20px)', letterSpacing: '0.04em', color: '#0C0C0A' }}>
                        {a.title}
                      </h3>
                    </div>
                    <p className="font-sans font-light m-0 mt-2.5" style={{ fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.7, color: 'rgba(12,12,10,0.55)', textWrap: 'pretty' }}>
                      {a.desc.split('\n').map((line, j) => (
                        <span key={j} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
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
                  style={{ backgroundColor: '#f6f6f3', width: `${progress * 100}%` }} />
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
  const [active, setActive] = useState(0);

  const EQUIPE = [
    { src: '/Tina.jpg',   name: 'Tina F.',   role: 'Head Coach',        quote: t('tina_quote'),   instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/tina-fourrier-44636a188/' },
    { src: '/Jérémy.jpg', name: 'Jérémy P.', role: 'Directeur Général', quote: t('jeremy_quote'), instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/jeremy-paulen/' },
  ];

  const m = EQUIPE[active];
  const go = (dir) => setActive((i) => (i + dir + EQUIPE.length) % EQUIPE.length);

  const peopleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': EQUIPE.map((p) => ({
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
      image: `https://myrasociety.com${p.src}`,
      worksFor: { '@id': 'https://myrasociety.com/#lodging' },
      sameAs: [p.instagram, p.linkedin],
    })),
  };

  return (
    <section id="equipe" aria-labelledby="equipe-label" className="bg-[#f6f6f3] overflow-hidden pt-16 md:pt-28 pb-8 md:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(peopleJsonLd) }} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-12 md:grid-cols-2 gap-4 md:gap-0 items-stretch">

        {/* GAUCHE — portrait : compact mobile (col-span-5), pleine moitié desktop */}
        <div className="col-span-5 md:col-span-1 relative overflow-hidden
          min-h-[clamp(280px,50vh,800px)] md:min-h-[clamp(440px,82vh,800px)]">
          <AnimatePresence mode="wait">
            <motion.img key={m.src} src={m.src} alt={`${m.name} — ${m.role}`} loading="lazy" decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }} />
          </AnimatePresence>
        </div>

        {/* DROITE — citation + auteur + flèches (col-span-7 mobile, col-span-1 desktop) */}
        <div className="col-span-7 md:col-span-1 flex flex-col justify-center px-3 md:px-12 lg:px-20 py-4 md:py-0">
          <h2 id="equipe-label" className="sr-only">{t('label')}</h2>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}>
              <blockquote className="m-0 p-0">
                <p className="font-serif font-light text-[#0C0C0A] m-0"
                  style={{ fontSize: 'clamp(13px, 1.9vw, 32px)', lineHeight: 1.4, letterSpacing: '-0.01em', textWrap: 'pretty', maxWidth: '32ch' }}>
                  &ldquo;{m.quote}&rdquo;
                </p>
              </blockquote>
              <p className="font-serif uppercase mt-4 md:mt-8 m-0" style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(12,12,10,0.45)' }}>
                <span className="md:hidden">{m.name}</span>
                <span className="hidden md:inline">{m.name} — {m.role}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Flèches précédent / suivant — plus petites sur mobile */}
          <div className="flex items-center gap-2 mt-6 md:mt-12">
            <button type="button" onClick={() => go(-1)} aria-label="Précédent"
              className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center border transition-colors duration-300 hover:bg-[#0C0C0A] hover:text-white"
              style={{ borderColor: 'rgba(12,12,10,0.20)', color: '#0C0C0A' }}>←</button>
            <button type="button" onClick={() => go(1)} aria-label="Suivant"
              className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center border transition-colors duration-300 hover:bg-[#0C0C0A] hover:text-white"
              style={{ borderColor: 'rgba(12,12,10,0.20)', color: '#0C0C0A' }}>→</button>
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
    <section id="soutenir-cta" aria-labelledby="poster-title" className="bg-[#f6f6f3] py-8 md:py-12">
      <div className="relative overflow-hidden" style={{ backgroundColor: INK, minHeight: 380 }}>
      <motion.img src="/DA/Double visage.jpg" alt="" loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.42) contrast(1.10)' }}
        />
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
        style={{ height: 'clamp(540px, 78vh, 820px)' }}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}>
        <div className="max-w-[560px] w-full">
          <h2 id="poster-title" className="font-serif font-light text-white mb-6"
            style={{ fontSize: 'clamp(26px, 3.4vw, 50px)', lineHeight: 1.0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            {t('title').split('\n').map((line, i) => (
              <span key={i} className={i === 1 ? 'italic block' : 'block'}>{line}</span>
            ))}
          </h2>
          <Btn href={`/${locale}/contact`} dark size="large">{t('cta')}</Btn>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="bg-[#f6f6f3]">
      {/* 1 — Hero manifeste */}
      <Hero />
      {/* 2 — Bloc manifeste */}
      <Statement />
      {/* 3 — Bloc complexe MYRA */}
      <Complexe />
      {/* 4 — Bloc recovery / body ritual */}
      <DoubleImage />
      {/* 5 — Commentaire / témoignage */}
      <Citation />
      {/* 6 — Bloc équipe / experts */}
      <Equipe />
      {/* 7 — Concept en mots-clés */}
      <Concept />
      {/* 7 — Bloc communauté privée */}
      <CommunautePrivee />
    </main>
  );
}