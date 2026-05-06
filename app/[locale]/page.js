'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const INK  = '#0C0C0A';
const WINE = '#2B1022';
const ASH  = 'rgba(12,12,10,0.42)';
const BONE = 'rgba(12,12,10,0.06)';
const EASE = [0.16, 1, 0.3, 1];

function R({ children, d = 0, y = 32, className = '' }) {
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

function Cap({ children, accent = false, light = false, className = '' }) {
  return (
    <span className={`font-sans text-[11px] tracking-[0.55em] uppercase ${className}`}
      style={{ color: accent ? WINE : light ? 'rgba(255,255,255,0.35)' : 'rgba(12,12,10,0.38)' }}>
      {children}
    </span>
  );
}

function Trait({ light = false, className = '' }) {
  return <div className={`h-px w-8 flex-shrink-0 ${className}`}
    style={{ backgroundColor: light ? 'rgba(255,255,255,0.15)' : 'rgba(43,16,34,0.40)' }} />;
}

function Btn({ children, dark = false, href, onClick, className = '' }) {
  const [hov, setHov] = useState(false);
  const Tag = href ? Link : 'button';
  return (
    <Tag href={href} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative overflow-hidden inline-flex items-center font-sans text-[11px] tracking-[0.55em] uppercase cursor-pointer select-none ${className}`}
      style={{
        padding: '15px 36px',
        border: `1px solid ${hov ? WINE : dark ? 'rgba(255,255,255,0.18)' : BONE}`,
        color: hov ? '#F3F2EF' : dark ? 'rgba(255,255,255,0.65)' : INK,
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
    <section ref={ref} className="relative w-full overflow-hidden bg-[#0C0C0A]"
      style={{ height: '100dvh', minHeight: 680 }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <video ref={videoRef} autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.52) grayscale(18%) contrast(1.06)', opacity: 0.85 }}>
          <source src="/Alsace.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0A]/55 via-transparent to-[#0C0C0A]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/30 via-transparent to-transparent" />
      <motion.div className="absolute inset-0 flex flex-col justify-between px-10 md:px-16 pt-36 pb-14 z-20"
        style={{ opacity }}>
        <div className="flex-1 flex items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: EASE, delay: 0.3 }}>
            <h1 className="font-serif font-light text-white leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
              {t('tagline_1')}<br /><em className="italic">{t('tagline_2')}</em>
            </h1>
            <div className="mt-8 flex items-center justify-center gap-5">
              <Trait light /><Cap light>{t('location')}</Cap><Trait light />
            </div>
          </motion.div>
        </div>
        <motion.div className="flex flex-col md:flex-row items-end justify-between gap-10 pt-8 border-t border-[rgba(255,255,255,0.06)]"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.8 }}>
          <div className="w-full md:w-[400px]">
            {sent ? (
              <p className="font-sans text-[11px] tracking-[0.40em] uppercase text-[rgba(255,255,255,0.40)]">{t('welcome')}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label className="block font-sans text-[10px] tracking-[0.55em] uppercase mb-4 text-[rgba(255,255,255,0.22)]">{t('membership')}</label>
                <div className="flex items-center gap-3 pb-3 border-b transition-all duration-700"
                  style={{ borderColor: focused ? WINE : 'rgba(255,255,255,0.12)' }}>
                  <input type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    placeholder={t('placeholder')}
                    className="flex-1 bg-transparent font-sans text-[11px] tracking-[0.25em] uppercase text-white placeholder:text-[rgba(255,255,255,0.14)] outline-none" />
                  <button type="submit" className="w-8 h-8 flex items-center justify-center border border-[rgba(255,255,255,0.12)] hover:border-[#2B1022] transition-all duration-500 flex-shrink-0">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[rgba(255,255,255,0.35)]" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="flex items-center gap-10">
            {[{ label: 'Instagram', href: 'https://instagram.com/myra.society' }, { label: 'TikTok', href: 'https://tiktok.com/@myra.society' }].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group relative pb-1 font-sans text-[10px] tracking-[0.45em] uppercase text-[rgba(255,255,255,0.22)] hover:text-[rgba(255,255,255,0.75)] transition-colors duration-500">
                {s.label}
                <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: WINE }} />
              </a>
            ))}
            <button onClick={toggleSound} className="group flex items-center gap-3 outline-none">
              <div className="w-8 h-8 flex items-center justify-center border transition-all duration-500"
                style={{ borderColor: !muted ? WINE : 'rgba(255,255,255,0.10)' }}>
                {!muted ? (
                  <div className="flex items-end gap-[2px] h-3">
                    {[1, 0.5, 0.85, 0.35, 0.92].map((h, i) => (
                      <motion.div key={i} className="w-[1.5px] rounded-full" style={{ backgroundColor: WINE }}
                        animate={{ height: ['2px', `${h * 10}px`, '2px'] }}
                        transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
                    ))}
                  </div>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.25)]" />
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
// 02 — STATEMENT (chiffres clés)
// ════════════════════════════════════════════════════════════════════════════
function Statement() {
  const t = useTranslations('statement');
  const STATS = [
    { val: '1 500', unit: 'm²', label: t('stat_1_label') },
    { val: '12',    unit: '',   label: t('stat_2_label') },
    { val: '3',     unit: '',   label: t('stat_3_label') },
  ];
  return (
    <section className="bg-[#F3F2EF] py-12 md:py-20 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-3 pt-1 flex flex-col gap-6">
            <R><Cap accent>{t('label')}</Cap></R>
            <R d={0.1}><div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} /></R>
          </div>
          <div className="col-span-12 md:col-span-9 md:pl-16">
            <R d={0.12}>
              <p className="font-sans text-[15px] md:text-[1.7vw] leading-[1.14] tracking-[-0.018em] font-light uppercase" style={{ color: INK }}>
                {t('tagline')}
              </p>
            </R>
            <R d={0.2}>
              <div className="mt-20 grid grid-cols-3 gap-8 pt-12" >
                {STATS.map((s, i) => (
                  <div key={i}>
                    <p className="font-serif font-light tracking-tight leading-none" style={{ fontSize: 'clamp(26px, 2.5vw, 40px)', color: INK }}>
                      {s.val}{s.unit && <span className="font-sans text-[14px] ml-1.5" style={{ color: ASH }}>{s.unit}</span>}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-px w-3.5 flex-shrink-0" style={{ backgroundColor: WINE, opacity: 0.5 }} />
                      <Cap>{s.label}</Cap>
                    </div>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 03 — TROIS SECTIONS EQUINOX
// Galerie gauche + texte droite / Texte gauche + galerie droite / alternance
// ════════════════════════════════════════════════════════════════════════════

// Galerie style Equinox — swipe 1:1 fluide, snap précis
function VerticalGallery({ images, reverse = false }) {
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

  // Snap vers l'index cible
  const snapTo = (i) => {
    const target = i * (slideW + GAP);
    setIdx(i);
    animate(x, -target, { type: 'spring', stiffness: 400, damping: 40 });
  };

  // Recalculer position si width change
  useEffect(() => {
    if (slideW > 0) x.set(-(idx * (slideW + GAP)));
  }, [slideW]);

  const handleDragEnd = (_, info) => {
    const current  = -x.get();
    const velocity = info.velocity.x;
    const moved    = info.offset.x;

    // Déterminer l'index cible selon vitesse ou distance
    let target = idx;
    if (velocity < -200 || moved < -slideW * 0.2)      target = Math.min(idx + 1, total - 1);
    else if (velocity > 200 || moved > slideW * 0.2)   target = Math.max(idx - 1, 0);

    snapTo(target);
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          minHeight: 440,
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {slideW > 0 && (
          <motion.div
            style={{
              x,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              display: 'flex',
              gap: GAP,
              cursor: 'grabbing',
              touchAction: 'pan-y',
              width: total * slideW + (total - 1) * GAP + PEEK,
            }}
            drag="x"
            dragConstraints={{
              left: -((total - 1) * (slideW + GAP)),
              right: 0,
            }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {visible.map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: slideW,
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <motion.img
                  src={src}
                  alt=""
                  draggable={false}
                  animate={{
                    filter: i === idx
                      ? 'saturate(0.90) brightness(1)'
                      : 'saturate(0.25) brightness(0.60)',
                  }}
                  transition={{ duration: 0.35 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Tirets */}
      <div style={{ display: 'flex', gap: 6 }}>
        {visible.map((_, i) => (
          <button
            key={i}
            onClick={() => snapTo(i)}
            aria-label={`Image ${i + 1}`}
            className="outline-none"
            style={{
              height: 2,
              flex: i === idx ? 3 : 1,
              backgroundColor: i === idx ? '#0C0C0A' : 'rgba(12,12,10,0.15)',
              transition: 'flex 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.3s',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}


function SectionText({ num, label, title, description, href, cta, locale, reverse = false }) {
  return (
    <div className={`flex flex-col justify-center h-full relative ${reverse ? 'md:pr-20' : 'md:pl-20'}`}>
      {/* Numéro géant en filigrane */}
      <div className="absolute -top-4 font-serif font-light select-none pointer-events-none"
        style={{
          fontSize: 'clamp(100px, 12vw, 160px)',
          color: 'rgba(12,12,10,0.04)',
          lineHeight: 1,
          left: reverse ? 'auto' : '60px',
          right: reverse ? '60px' : 'auto',
        }}>
        {num}
      </div>
      <R>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-6 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} />
          <Cap accent>{label}</Cap>
        </div>
      </R>
      <R d={0.1}>
        <h2 className="font-serif font-light leading-[0.92] tracking-[-0.02em] text-[#0C0C0A] mb-6"
          style={{ fontSize: 'clamp(32px, 3.5vw, 52px)' }}>
          {title}
        </h2>
      </R>
      <R d={0.18}>
        <p className="font-sans text-[13px] leading-[2.2] font-light text-[rgba(12,12,10,0.48)] mb-12 max-w-[380px]">
          {description}
        </p>
      </R>
      <R d={0.25}>
        <Btn href={href}>{cta}</Btn>
      </R>
    </div>
  );
}

function EquinoxSections() {
  const locale = useLocale();
  const t = useTranslations('services');

  const SECTIONS = [
    {
      num: '01',
      label: t('s4_tags'),
      title: 'Chambres & Suites',
      description: 'Suites privatives en Alsace. Chaque espace a été pensé pour la récupération et le ressourcement. Luxe discret, matières nobles, silence des vignes.',
      href: `/${locale}/hebergement`,
      cta: 'Découvrir les suites',
      images: ['/Edwige/1.jpg', '/Edwige/2.jpg', '/Wingert/1.jpg', '/Julia/1.jpg'],
      reverse: false, // image gauche, texte droite
    },
    {
      num: '02',
      label: t('s3_tags'),
      title: 'Table & Nutrition',
      description: 'Restaurant diététique, circuits courts, accords pensés pour votre métabolisme. Une table réelle, pas un catalogue. La cuisine comme acte de soin.',
      href: `/${locale}/soutenir`,
      cta: 'En savoir plus',
      images: ['/Restaurant/B.jpg', '/Restaurant/1.jpg', '/Restaurant/A.jpg', '/Restaurant/B.jpg'],
      reverse: true, // texte gauche, image droite
    },
    {
      num: '03',
      label: t('s2_tags'),
      title: 'Récupération & Spa',
      description: '200 m² dédiés à la récupération active. Sauna, hammam, balnéo, soins. Un espace pour revenir à soi, sans compromis sur l\'intensité.',
      href: `/${locale}/soutenir`,
      cta: 'Découvrir le spa',
      images: ['/Spa/A.jpg', '/Spa/1.jpg', '/Spa/3.jpg', '/Spa/A.jpg'],
      reverse: false, // image gauche, texte droite
    },
  ];

  return (
    <>
      {SECTIONS.map((s, idx) => (
        <section key={s.num} className="bg-[#F3F2EF] overflow-hidden"
          >
          <div className="max-w-container mx-auto py-16 md:py-24 relative">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch ${s.reverse ? 'md:flex-row-reverse' : ''}`}
              style={{ direction: s.reverse ? 'rtl' : 'ltr' }}>
              {/* Galerie */}
              <div style={{ direction: 'ltr' }}>
                  <VerticalGallery images={s.images} reverse={s.reverse} />
              </div>
              {/* Texte */}
              <div style={{ direction: 'ltr' }} className="flex items-center py-12 md:py-0">
                <SectionText
                  num={s.num}
                  label={s.label}
                  title={s.title}
                  description={s.description}
                  href={s.href}
                  cta={s.cta}
                  locale={locale}
                  reverse={s.reverse}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 04 — CITATION
// ════════════════════════════════════════════════════════════════════════════
function Citation() {
  const t = useTranslations('citation');
  return (
    <section className="overflow-hidden">
      <div className="relative w-full overflow-hidden" style={{ height: '62vh', minHeight: 380 }}>
        <motion.img src="/DA/Nouveau.png" alt="MYRA" className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.72) brightness(0.75)' }}
          initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 2.8, ease: EASE }} />
        <div className="absolute inset-0 bg-[rgba(12,12,10,0.40)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl text-center px-8">
            <motion.p
              className="font-serif font-light italic leading-[1.6] text-[rgba(244,245,240,0.90)]"
              style={{ fontSize: 'clamp(20px, 2.8vw, 36px)' }}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}>
              {t('text')}
            </motion.p>
            <motion.div className="mt-10 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.5 }}>
              <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.45 }} />
              <Cap light className="opacity-75">{t('author')}</Cap>
              <Cap light className="opacity-40">{t('role')}</Cap>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 05 — COMPLEXE (déplacé après citation)
// ════════════════════════════════════════════════════════════════════════════
function Complexe() {
  const t = useTranslations('complexe');
  return (
    <section className="bg-[#F3F2EF] py-12 md:py-20 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Texte haut gauche */}
          <div className="col-span-12 md:col-span-4">
            <R>
              <div className="space-y-6">
                <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} />
                <Cap accent>{t('label')}</Cap>
                <p className="font-sans text-[13px] leading-[2.5] font-light" style={{ color: ASH }}>{t('text')}</p>
              </div>
            </R>
          </div>
          {/* Image droite */}
          <div className="col-span-12 md:col-span-8">
            <R d={0.1}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <motion.img src="/Complexe/1.jpg" alt="Le Complexe MYRA"
                  className="w-full h-full object-cover" style={{ filter: 'saturate(0.82)' }}
                  whileHover={{ scale: 1.03, filter: 'saturate(1)' }} transition={{ duration: 1.8, ease: EASE }} />
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 06 — DOUBLE IMAGE (déplacé après complexe)
// ════════════════════════════════════════════════════════════════════════════
function DoubleImage() {
  const t = useTranslations('double');
  return (
    <section className="bg-[#F3F2EF] py-12 md:py-20 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-12 gap-10 items-end">
          {/* Images gauche */}
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-2 gap-4">
              {['/Complexe/C.jpg', '/Fitness/C.jpg'].map((src, i) => (
                <R key={i} d={i * 0.1}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                    <motion.img src={src} className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.8)' }}
                      whileHover={{ scale: 1.04, filter: 'saturate(1)' }}
                      transition={{ duration: 1.6, ease: EASE }} />
                  </div>
                </R>
              ))}
            </div>
          </div>
          {/* Texte bas droite */}
          <div className="col-span-12 md:col-span-3 pb-4">
            <R d={0.15}>
              <div className="space-y-6">
                <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} />
                <Cap accent>{t('label')}</Cap>
                <p className="font-sans text-[13px] leading-[2.5] font-light" style={{ color: ASH }}>{t('text')}</p>
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 07 — GALERIE
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
  const [cur, setCur] = useState(0);
  const next = () => setCur(p => (p + 1) % GALLERY_IMGS.length);
  const prev = () => setCur(p => (p - 1 + GALLERY_IMGS.length) % GALLERY_IMGS.length);

  return (
    <section className="bg-[#F3F2EF] py-12 md:py-20 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <R>
            <div className="flex items-center gap-5">
              <Trait />
              <Cap accent>{t('label')}</Cap>
            </div>
          </R>
          <R d={0.05}>
            <div className="flex items-center gap-6">
              <button onClick={prev} className="w-10 h-10 flex items-center justify-center border border-[rgba(12,12,10,0.08)] hover:border-[#2B1022] transition-all duration-400">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-[rgba(12,12,10,0.40)]"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
              </button>
              <span className="font-sans text-[11px] tracking-[0.40em] text-[rgba(12,12,10,0.30)]">
                {String(cur + 1).padStart(2, '0')} / {String(GALLERY_IMGS.length).padStart(2, '0')}
              </span>
              <button onClick={next} className="w-10 h-10 flex items-center justify-center border border-[rgba(12,12,10,0.08)] hover:border-[#2B1022] transition-all duration-400">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-[rgba(12,12,10,0.40)]"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
              </button>
            </div>
          </R>
        </div>
        <div className="relative w-full overflow-hidden cursor-pointer" style={{ aspectRatio: '16/7' }} onClick={next}>
          <AnimatePresence mode="wait">
            <motion.img key={cur} src={GALLERY_IMGS[cur].src} alt={GALLERY_IMGS[cur].label}
              className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.82)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }} />
          </AnimatePresence>
          <div className="absolute bottom-8 left-8">
            <AnimatePresence mode="wait">
              <motion.div key={GALLERY_IMGS[cur].label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Cap light>{GALLERY_IMGS[cur].label}</Cap>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-[rgba(12,12,10,0.06)] relative overflow-hidden">
          <motion.div className="absolute top-0 left-0 h-full" style={{ backgroundColor: WINE }}
            animate={{ width: `${((cur + 1) / GALLERY_IMGS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }} />
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
    { src: '/Tina.jpg',   name: 'Tina F.',   role: 'Head Coach', quote: t('tina_quote'),   instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/tina-fourrier-44636a188/' },
    { src: '/Jérémy.jpg', name: 'Jérémy P.', role: 'DG',         quote: t('jeremy_quote'), instagram: 'https://instagram.com/myra.society', linkedin: 'https://www.linkedin.com/in/jeremy-paulen/' },
  ];

  return (
    <section className="bg-[#F3F2EF] py-12 md:py-20 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-5 mb-20"><Trait /><Cap accent>{t('label')}</Cap></div>
              <AnimatePresence mode="wait">
                <motion.div key={act} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6, ease: EASE }}>
                  <p className="font-sans text-[11px] tracking-[0.40em] uppercase mb-1" style={{ color: WINE }}>{EQUIPE[act].name}</p>
                  <p className="font-sans text-[11px] tracking-[0.30em] uppercase mb-12 text-[rgba(12,12,10,0.35)]">{EQUIPE[act].role}</p>
                  <p className="font-serif font-light italic leading-[1.6] text-[rgba(12,12,10,0.65)]" style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}>
                    &laquo;&nbsp;{EQUIPE[act].quote}&nbsp;&raquo;
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-8 pt-8 border-t border-[rgba(12,12,10,0.06)]">
              {['instagram', 'linkedin'].map(r => (
                <a key={r} href={EQUIPE[act][r]} target="_blank" rel="noopener noreferrer"
                  className="group relative pb-1 font-sans text-[11px] tracking-[0.30em] uppercase text-[rgba(12,12,10,0.35)] hover:text-[#0C0C0A] transition-colors duration-400">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                  <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-400" style={{ backgroundColor: WINE }} />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: 620 }}>
            <AnimatePresence mode="wait">
              <motion.img key={EQUIPE[act].src} src={EQUIPE[act].src} alt={EQUIPE[act].name}
                className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.88)' }}
                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }} />
            </AnimatePresence>
          </div>
          <div className="lg:col-span-3 flex lg:flex-col gap-6 items-center justify-center pt-8 lg:pt-0">
            {EQUIPE.map((m, i) => (
              <motion.div key={i} onClick={() => setAct(i)}
                className="relative overflow-hidden cursor-pointer flex-shrink-0" style={{ width: 80, height: 96 }}
                animate={{ opacity: i === act ? 1 : 0.35, filter: i === act ? 'grayscale(0)' : 'grayscale(1)' }}
                transition={{ duration: 0.5 }}>
                <img src={m.src} alt={m.name} className="w-full h-full object-cover" />
                {i === act && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: WINE }} />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 09 — POSTER SOUTIEN
// ════════════════════════════════════════════════════════════════════════════
function SupportPoster() {
  const t = useTranslations('poster');
  const locale = useLocale();
  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-between"
      style={{ height: '100dvh', minHeight: 580, backgroundColor: INK }}>
      <div className="absolute inset-0 z-0">
        <img src="/DA/Double visage.jpg" alt="" className="w-full h-full object-cover"
          style={{ filter: 'grayscale(1) brightness(0.28) contrast(1.12)' }} />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${INK}CC 0%, ${INK}55 50%, ${INK}DD 100%)` }} />
      </div>
      <motion.div className="relative z-10 flex-1 flex items-center justify-center px-8"
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}>
        <div className="max-w-[500px] text-center">
          <div className="flex items-center justify-center gap-8 mb-14">
            <div className="h-px w-12 opacity-40" style={{ backgroundColor: WINE }} />
            <Cap light style={{ opacity: 0.55 }}>{t('label')}</Cap>
            <div className="h-px w-12 opacity-40" style={{ backgroundColor: WINE }} />
          </div>
<h2 className="font-serif font-light italic text-white mb-8 leading-[1.1]"
  style={{ fontSize: 'clamp(32px, 4vw, 54px)', color: '#FFFFFF' }}>
            {t('title')}
          </h2>
          <p className="font-sans font-light tracking-[0.18em] uppercase mb-14 text-[rgba(255,255,255,0.35)]"
            style={{ fontSize: '12px', lineHeight: '2.2' }}>
            {t('text')}
          </p>
          <Btn href={`/${locale}/soutenir`} dark>{t('cta')}</Btn>
        </div>
      </motion.div>
      <div className="relative z-10 px-10 md:px-16 pb-10 pt-6 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-8">
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[rgba(244,245,240,0.20)]">{t('copyright')}</span>
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[rgba(244,245,240,0.20)]">{t('location')}</span>
      </div>
    </section>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main className="bg-[#F3F2EF]">
      <Hero />
      <Statement />
      <EquinoxSections />
      <Citation />
      <Complexe />
      <DoubleImage />
      <Equipe />
      <Gallery />
      <SupportPoster />
    </main>
  );
}