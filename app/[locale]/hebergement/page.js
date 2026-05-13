'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from '@/lib/useTranslations';
import { useRouter } from 'next/navigation';
import { useRates, useAvailability, toKey } from '../../../lib/useSmoobu';
import ContactSection from '../../../components/Contact';

const INK  = '#0C0C0A';
const WINE = '#351421';
const BONE = 'rgba(12,12,10,0.06)';
const EASE = [0.19, 1, 0.22, 1];
const EXPO = [0.16, 1, 0.3, 1];

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
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0 }}
      animate={io ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: d }}>
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

const SUITES = [
  { id: 'Edwige',  smoobuId: 2450913, name: 'Edwige',  surface: '130 m²', guests: 6,
    images: ['/Edwige/1.jpg','/Edwige/2.jpg','/Edwige/3.jpg','/Edwige/4.jpg','/Edwige/5.jpg'],
    excerpt: 'Lumière naturelle et silence des vignes.' },
  { id: 'Wingert', smoobuId: 2868461, name: 'Wingert', surface: '90 m²',  guests: 4,
    images: ['/Wingert/1.jpg','/Wingert/2.jpg','/Wingert/3.jpg','/Wingert/4.jpg','/Wingert/5.jpg'],
    excerpt: 'Palette boisée et organique.' },
  { id: 'Julia',   smoobuId: 2637623, name: 'Julia',   surface: '85 m²',  guests: 4,
    images: ['/Julia/1.jpg','/Julia/2.jpg','/Julia/3.jpg','/Julia/4.jpg','/Julia/5.jpg','/Julia/6.jpg'],
    excerpt: 'Cocon pour deux.' },
];

const TO_COME = [
  { id: 'Nova', name: 'Nova', surface: '80 m²',  guests: 2, images: ['/Visuels/Salon Nova.jpg','/Visuels/Cuisine Nova.jpg','/Visuels/Chambre Nova.jpg','/Visuels/SDB nova.jpg'],  excerpt: 'Éclat contemporain et volumes généreux.' },
  { id: 'Opal', name: 'Opal', surface: '90 m²',  guests: 4, images: ['/Visuels/Opal Salon.jpg','/Visuels/Jardin Opal.jpg'],                             excerpt: 'Douceur minérale et vue imprenable.' },
  { id: 'Asta', name: 'Asta', surface: '170 m²', guests: 8, images: ['/Visuels/Etoile.jpg'],                                           excerpt: "L'équilibre parfait entre héritage et modernité." },
];

const ALL_IDS  = SUITES.map(s => s.smoobuId);
const fmtShort = (d) => d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MONTHS_SHORT = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

// ─── GALERIE SWIPE (suites classiques) ───────────────────────────────────────
function ImageGallery({ images, name }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? setIdx(i => (i + 1) % images.length) : setIdx(i => (i - 1 + images.length) % images.length);
    startX.current = null;
  };

  return (
    <div className="relative w-full h-full group/gal overflow-hidden" style={{ backgroundColor: BONE }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <motion.img key={idx} src={images[idx]} alt={`${name} — vue ${idx + 1}`}
        loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }} />
      <div className="absolute inset-0 hidden md:flex items-center justify-between px-4 opacity-0 group-hover/gal:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
        <button type="button" onClick={prev} aria-label="Image précédente" className="pointer-events-auto w-9 h-9 flex items-center justify-center bg-[#F4F5F0]/80 hover:bg-[#F4F5F0] backdrop-blur-sm transition-all duration-300">
          <svg width="11" height="11" fill="none" stroke={INK} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
        </button>
        <button type="button" onClick={next} aria-label="Image suivante" className="pointer-events-auto w-9 h-9 flex items-center justify-center bg-[#F4F5F0]/80 hover:bg-[#F4F5F0] backdrop-blur-sm transition-all duration-300">
          <svg width="11" height="11" fill="none" stroke={INK} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button key={i} type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
            aria-label={`Image ${i + 1} sur ${images.length}`}
            aria-current={i === idx ? 'true' : undefined}
            className="h-px p-0 transition-all duration-500 outline-none cursor-pointer"
            style={{ width: i === idx ? 24 : 10, backgroundColor: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)', border: 'none' }} />
        ))}
      </div>
    </div>
  );
}

// ─── GALERIE PROCHAINEMENT (indépendante, avec flèches fonctionnelles) ────────
function ToComeGallery({ images, name }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? setIdx(i => (i + 1) % images.length) : setIdx(i => (i - 1 + images.length) % images.length);
    startX.current = null;
  };

  return (
    <div className="relative w-full h-full group/toc overflow-hidden" style={{ backgroundColor: BONE }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <motion.img key={idx} src={images[idx]} alt={`${name} — vue ${idx + 1}`}
        loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }} />
      {/* Flèches — toujours visibles au hover, sur desktop ET mobile */}
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-3 z-20 pointer-events-none
          opacity-0 group-hover/toc:opacity-100 transition-opacity duration-400">
          <button type="button" onClick={prev} aria-label="Image précédente"
            className="pointer-events-auto w-8 h-8 flex items-center justify-center transition-all duration-300"
            style={{ backgroundColor: 'rgba(12,12,10,0.50)', backdropFilter: 'blur(8px)' }}>
            <svg width="10" height="10" fill="none" stroke="rgba(244,245,240,0.80)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" onClick={next} aria-label="Image suivante"
            className="pointer-events-auto w-8 h-8 flex items-center justify-center transition-all duration-300"
            style={{ backgroundColor: 'rgba(12,12,10,0.50)', backdropFilter: 'blur(8px)' }}>
            <svg width="10" height="10" fill="none" stroke="rgba(244,245,240,0.80)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button key={i} type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
            aria-label={`Image ${i + 1} sur ${images.length}`}
            aria-current={i === idx ? 'true' : undefined}
            className="h-px p-0 transition-all duration-500 outline-none cursor-pointer"
            style={{ width: i === idx ? 20 : 8, backgroundColor: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.30)', border: 'none' }} />
        ))}
      </div>
    </div>
  );
}

// ─── SUITE CARD ─────────────────────────────────────────────────────────────
function SuiteCard({ suite, datesSelected, checkIn, checkOut, isToCome = false, dark = false }) {
  const t = useTranslations('hebergement');
  const locale = useLocale();
  const isOff = datesSelected && suite.isAvailable === false;

  const href = (() => {
    const base = `/${locale}/hebergement/${suite.id}`;
    const p = new URLSearchParams();
    if (checkIn)  p.append('arrival',   toKey(checkIn));
    if (checkOut) p.append('departure', toKey(checkOut));
    const q = p.toString();
    return q ? `${base}?${q}` : base;
  })();

  const price = suite.priceInfo ? suite.priceInfo.total : suite.minPrice;

  return (
    <article aria-labelledby={`suite-${suite.id}-name`} className={`group transition-all duration-[1200ms] ${isOff ? 'opacity-20 pointer-events-none' : ''}`}>
      {isToCome ? (
        /* Desktop: Link cliquable avec galerie dédiée */
        <Link href={`/${locale}/hebergement/prochainement/${suite.id}`}
          className="block relative overflow-hidden mb-5 md:mb-7 outline-none cursor-pointer"
          style={{ aspectRatio: '3/4' }}>
          <ToComeGallery images={suite.images} name={suite.name} />
          <div className="absolute top-4 left-4 z-30">
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] px-2 py-1"
              style={{ backgroundColor: 'rgba(12,12,10,0.60)', color: 'rgba(244,245,240,0.55)' }}>
              {t('coming_soon_badge')}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ pointerEvents: 'none' }}>
            <div className="flex items-center gap-2 px-4 py-2"
              style={{ backgroundColor: 'rgba(12,12,10,0.55)', backdropFilter: 'blur(8px)' }}>
              <span className="font-sans text-[8px] uppercase tracking-[0.40em]"
                style={{ color: 'rgba(244,245,240,0.70)' }}>{t('discover')}</span>
              <svg width="8" height="8" fill="none" stroke="rgba(244,245,240,0.70)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </Link>
      ) : (
        <Link href={href} className="block relative overflow-hidden mb-5 md:mb-7 outline-none" style={{ aspectRatio: '14/10' }}>
          <ImageGallery images={suite.images} name={suite.name} />
        </Link>
      )}
      <div className="pt-1">
        <R>
          <div className="flex justify-between items-baseline mb-3 gap-3">
            <h3 id={`suite-${suite.id}-name`} className="font-serif font-light italic leading-[0.95]"
              style={{ fontSize: 'clamp(26px, 3.4vw, 48px)', letterSpacing: '-0.01em', color: dark ? 'rgba(244,245,240,0.85)' : '#0C0C0A' }}>
              {suite.name}
            </h3>
            {price && (
              <div className="flex items-baseline gap-1.5 flex-shrink-0">
                <span className="font-sans text-[9px] uppercase tracking-[0.30em]"
                  style={{ color: dark ? 'rgba(244,245,240,0.30)' : 'rgba(12,12,10,0.35)' }}>
                  {suite.priceInfo ? t('total') : t('from')}
                </span>
                <p className="font-serif font-light m-0"
                  style={{ fontSize: 'clamp(16px, 1.8vw, 24px)', color: dark ? 'rgba(244,245,240,0.78)' : '#0C0C0A' }}>
                  {Math.round(price).toLocaleString('fr-FR')} €
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Cap light={dark}>{suite.surface}</Cap>
            <span className="w-px h-3" style={{ backgroundColor: dark ? 'rgba(244,245,240,0.12)' : BONE }} />
            <Cap light={dark}>{suite.guests} {t('max_guests')}</Cap>
          </div>
          <div className="h-px w-full mb-4" style={{ backgroundColor: dark ? 'rgba(244,245,240,0.08)' : BONE }} />
          <p className="font-serif font-light italic m-0"
            style={{ fontSize: '15px', lineHeight: 1.85, color: dark ? 'rgba(244,245,240,0.40)' : 'rgba(12,12,10,0.48)' }}>
            {suite.excerpt}
          </p>
          {!isToCome && (
            <div className="flex items-center gap-2 mt-5 transition-opacity duration-500 opacity-60 group-hover:opacity-100">
              <Cap accent>{t('discover')}</Cap>
              <svg width="10" height="10" fill="none" stroke={WINE} strokeWidth="1.5" viewBox="0 0 24 24"
                className="transition-transform duration-500 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </R>
      </div>
    </article>
  );
}

// ─── MOIS PICKER ─────────────────────────────────────────────────────────────
function MonthPicker({ current, onSelect, onClose }) {
  const monthOptions = Array.from({ length: 18 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + i);
    return d;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white z-[60] shadow-xl overflow-y-auto"
      style={{ width: 180, maxHeight: 260, border: '1px solid rgba(12,12,10,0.08)' }}>
      {monthOptions.map((d, i) => {
        const isActive = d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear();
        return (
          <button key={i}
            onClick={() => { onSelect(d); onClose(); }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
            style={{ backgroundColor: isActive ? INK : 'transparent' }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(12,12,10,0.04)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.35em]"
              style={{ color: isActive ? '#F4F5F0' : 'rgba(12,12,10,0.65)' }}>
              {MONTHS_SHORT[d.getMonth()]}
            </span>
            <span className="font-sans text-[9px]"
              style={{ color: isActive ? 'rgba(244,245,240,0.55)' : 'rgba(12,12,10,0.30)' }}>
              {d.getFullYear()}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── CALENDRIER DOUBLE ───────────────────────────────────────────────────────
function DoubleCalendar({ checkIn, checkOut, onChange, ratesData }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [picker, setPicker] = useState(null);
  const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  const DAYS = ['L','M','M','J','V','S','D'];

  const getDayData = (d) => {
    if (!d || !ratesData?.data) return null;
    const key = toKey(d);
    return Object.values(ratesData.data).reduce((acc, apt) => {
      const day = apt.calendar?.[key];
      if (!day) return acc;
      if (!acc) return day;
      return { available: acc.available || day.available, price: Math.min(acc.price ?? Infinity, day.price ?? Infinity) || null };
    }, null);
  };

  useEffect(() => {
    if (!picker) return;
    const h = () => setPicker(null);
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, [picker]);

  const renderMonth = (date, side) => {
    const y = date.getFullYear(), mo = date.getMonth();
    let first = new Date(y, mo, 1).getDay();
    first = first === 0 ? 6 : first - 1;
    const total = new Date(y, mo + 1, 0).getDate();
    const days = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => new Date(y, mo, i + 1))];

    const prevMonth = () => {
      if (side === 'left') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
      else setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };
    const nextMonth = () => {
      if (side === 'left') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
      else setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 2, 1));
    };

    return (
      <div className="flex-1 min-w-[240px]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth}
            className="w-7 h-7 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
          </button>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPicker(picker === side ? null : side)}
              className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.4em] hover:text-[#0C0C0A] transition-colors outline-none"
              style={{ color: 'rgba(12,12,10,0.50)' }}>
              {MONTHS_FR[mo]} {y}
              <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                style={{ transform: picker === side ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <AnimatePresence>
              {picker === side && (
                <MonthPicker
                  current={date}
                  onSelect={(d) => {
                    if (side === 'left') setViewDate(d);
                    else setViewDate(new Date(d.getFullYear(), d.getMonth() - 1, 1));
                  }}
                  onClose={() => setPicker(null)}
                />
              )}
            </AnimatePresence>
          </div>
          <button onClick={nextMonth}
            className="w-7 h-7 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-7">
          {DAYS.map((d, i) => (
            <div key={i} className="font-sans text-[9px] text-center uppercase tracking-wider mb-3 text-[rgba(12,12,10,0.20)]">{d}</div>
          ))}
          {days.map((d, i) => {
            if (!d) return <div key={i} />;
            const key       = toKey(d);
            const isPast    = d < new Date().setHours(0, 0, 0, 0);
            const data      = getDayData(d);
            const isBlocked = data && !data.available;
            const isStart   = checkIn  && toKey(checkIn)  === key;
            const isEnd     = checkOut && toKey(checkOut) === key;
            const inRange   = checkIn && checkOut && d > checkIn && d < checkOut;
            return (
              <button key={i} onClick={() => !isPast && !isBlocked && onChange(d)} disabled={isPast || isBlocked}
                className={`h-10 flex flex-col items-center justify-center transition-all duration-150
                  ${isStart || isEnd ? 'text-[#F4F5F0]' : 'hover:bg-[rgba(12,12,10,0.04)]'}
                  ${inRange ? 'bg-[rgba(12,12,10,0.04)]' : ''}
                  ${isBlocked || isPast ? 'opacity-10 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: (isStart || isEnd) ? INK : undefined }}>
                <span className="font-serif text-[12px] leading-none">{d.getDate()}</span>
                {data?.price && !isStart && !isEnd && !isPast && !isBlocked && (
                  <span className="font-sans text-[7px] mt-0.5 text-[rgba(12,12,10,0.30)]">{Math.round(data.price)}€</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="md:hidden">{renderMonth(viewDate, 'left')}</div>
      <div className="hidden md:flex flex-row gap-14 md:gap-20">
        {renderMonth(viewDate, 'left')}
        {renderMonth(nextMonthDate, 'right')}
      </div>
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero({ checkIn, checkOut, guests, setGuests, onDateChange, panelOpen, setPanelOpen, isLoading, ratesData }) {
  const t = useTranslations('hebergement');
  const filterRef = useRef(null);
  const barRef = useRef(null);
  const [dir, setDir] = useState('bottom');
  const datesSelected = !!(checkIn && checkOut);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    if (panelOpen && barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      setDir(window.innerHeight - rect.bottom < 500 ? 'top' : 'bottom');
    }
  }, [panelOpen]);

  return (
    <section id="hero" className="relative w-full flex flex-col bg-[#0C0C0A]" style={{ height: '100dvh', minHeight: 680 }}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.img src="/Complexe/1.jpg" alt="Domaine MYRA"
          loading="eager" fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) brightness(0.58) contrast(1.06)' }}
          />
      </div>
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(12,12,10,0.20) 0%, transparent 35%, rgba(12,12,10,0.85) 100%)' }} />

      {/* Grain analogique — section Ink */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      <div className="flex-1" />

      <div className="relative z-10 w-full pb-4 md:pb-6">
        <div className="max-w-container mx-auto px-6 md:px-16">
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
            <div className="flex items-center gap-3 md:gap-4">
              <h1 className="font-serif font-light italic text-white leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(48px, 9vw, 130px)' }}>
                {t('hero_title')}
              </h1>
              <Image src="/myra-logo.svg" alt="MYRA" width={80} height={80}
                style={{ height: 'clamp(30px, 5.5vw, 80px)', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.45 }} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-40 w-full pb-8 md:pb-12" ref={filterRef}>
        <div className="max-w-container mx-auto px-6 md:px-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.8 }}>
            <p className="hidden md:block font-sans text-[9px] uppercase tracking-[0.45em] mb-5"
              style={{ color: 'rgba(244,245,240,0.18)' }}>
              71 rue du Général de Gaulle — 67520 Marlenheim, Alsace
            </p>
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative" ref={barRef}>
              <AnimatePresence mode="wait">
                {panelOpen && (
                  <motion.div
                    id="hero-search-panel"
                    initial={{ opacity: 0, y: dir === 'top' ? -8 : 8 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`absolute ${dir === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 right-0 bg-[#F4F5F0] z-50 max-h-[75vh] overflow-y-auto`}
                    style={{ border: '1px solid rgba(12,12,10,0.06)', boxShadow: '0 40px 100px rgba(0,0,0,0.25)' }}>
                    <div className="px-5 md:px-12 pt-8 pb-10">
                      {panelOpen === 'dates' ? (
                        <DoubleCalendar checkIn={checkIn} checkOut={checkOut} onChange={onDateChange} ratesData={ratesData} />
                      ) : (
                        <div className="max-w-xl">
                          <Cap className="block mb-8">{t('guests_label')}</Cap>
                          <div className="flex flex-wrap gap-3" role="group" aria-label={t('guests_label')}>
                            {[1,2,3,4,5,6].map(n => (
                              <button key={n} onClick={() => { setGuests(n); setPanelOpen(null); }}
                                aria-label={`${n} ${n > 1 ? t('persons') : t('person')}`}
                                aria-pressed={guests === n}
                                className="w-12 h-12 md:w-14 md:h-14 transition-all duration-500 border font-sans text-[13px]"
                                style={{ backgroundColor: guests === n ? INK : 'transparent', color: guests === n ? '#F4F5F0' : 'rgba(12,12,10,0.40)', borderColor: guests === n ? INK : BONE }}>
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row items-stretch"
                style={{
                  border: '1px solid rgba(244,245,240,0.18)',
                  backgroundColor: 'rgba(244,245,240,0.08)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}>
                <button type="button" onClick={() => setPanelOpen(panelOpen === 'dates' ? null : 'dates')}
                  aria-expanded={panelOpen === 'dates'}
                  aria-controls="hero-search-panel"
                  className="flex items-center gap-4 px-5 py-4 md:flex-1 md:py-5 md:pl-6 md:pr-8 outline-none text-left transition-colors"
                  style={{ borderBottom: '1px solid rgba(244,245,240,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(244,245,240,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                  <span className="font-sans text-[9px] uppercase tracking-[0.45em] flex-shrink-0"
                    style={{ color: 'rgba(244,245,240,0.48)' }}>{t('search_dates')}</span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: datesSelected ? 'rgba(244,245,240,0.85)' : 'rgba(244,245,240,0.35)' }}>
                    {datesSelected ? `${fmtShort(checkIn)} — ${fmtShort(checkOut)}` : '—'}
                  </span>
                </button>
                <div className="flex md:contents">
                  <button type="button" onClick={() => setPanelOpen(panelOpen === 'guests' ? null : 'guests')}
                    aria-expanded={panelOpen === 'guests'}
                    aria-controls="hero-search-panel"
                    className="flex-1 flex items-center gap-4 px-5 py-4 md:w-auto md:py-5 md:px-8 outline-none text-left transition-colors"
                    style={{ borderRight: '1px solid rgba(244,245,240,0.08)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(244,245,240,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                    <span className="font-sans text-[9px] uppercase tracking-[0.45em] flex-shrink-0"
                      style={{ color: 'rgba(244,245,240,0.40)' }}>{t('search_guests')}</span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em]"
                      style={{ color: guests > 0 ? 'rgba(244,245,240,0.85)' : 'rgba(244,245,240,0.35)' }}>
                      {guests > 0 ? `${guests}` : '—'}
                    </span>
                  </button>
                  <button type="submit" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-3 px-5 py-4 md:py-5 md:pl-8 md:pr-6 font-sans text-[9px] uppercase tracking-[0.45em] outline-none transition-colors"
                    style={{ color: 'rgba(244,245,240,0.70)' }}
                    onMouseEnter={e => e.currentTarget.style.color='#F4F5F0'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(244,245,240,0.70)'}>
                    <span className="relative">
                      {isLoading ? '…' : t('search_verify')}
                      <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: WINE }} />
                    </span>
                    {!isLoading && (
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="transition-transform duration-500 group-hover:translate-x-1">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function HebergementPage() {
  const t = useTranslations('hebergement');
  const locale = useLocale();
  const router = useRouter();
  const [checkIn,   setCheckIn]   = useState(null);
  const [checkOut,  setCheckOut]  = useState(null);
  const [guests,    setGuests]    = useState(0);
  const [panelOpen, setPanelOpen] = useState(null);
  const panelRef = useRef(null);

  const { ratesData }                          = useRates(ALL_IDS);
  const { availData, isLoading: availLoading } = useAvailability(checkIn, checkOut, ALL_IDS, guests);
  const datesSelected = !!(checkIn && checkOut);

  useEffect(() => {
    const onClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(null); };
    const onKey = (e) => { if (e.key === 'Escape') setPanelOpen(null); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleDateChange = (d) => {
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(d); setCheckOut(null); }
    else if (d > checkIn) { setCheckOut(d); setTimeout(() => setPanelOpen(null), 500); }
    else { setCheckIn(d); setCheckOut(null); }
  };

  const suites = useMemo(() => SUITES.map(s => ({
    ...s,
    isAvailable: availData?.availableApartments?.includes(s.smoobuId) ?? null,
    priceInfo:   availData?.prices?.[s.smoobuId] ?? null,
    matchGuests: guests === 0 || s.guests >= guests,
    minPrice:    ratesData?.data?.[s.smoobuId]?.stats?.minPrice ?? null,
  })), [availData, ratesData, guests]);

  const visible        = suites.filter(s => s.matchGuests);
  const availableCount = datesSelected ? visible.filter(s => s.isAvailable).length : visible.length;

  return (
    <motion.div className="min-h-screen bg-[#F4F5F0]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EXPO }}>
      <div ref={panelRef}>
        <Hero checkIn={checkIn} checkOut={checkOut} guests={guests} setGuests={setGuests}
          onDateChange={handleDateChange} panelOpen={panelOpen} setPanelOpen={setPanelOpen}
          isLoading={availLoading} ratesData={ratesData} />
      </div>

      {/* ── COLLECTION ── */}
      <section id="collection" aria-labelledby="collection-label">
        <div className="max-w-container mx-auto py-16 md:py-32 px-6 md:px-0">
          <div className="flex items-end justify-between mb-10 md:mb-20 pb-6 md:pb-10"
            style={{ borderBottom: '1px solid rgba(12,12,10,0.06)' }}>
            <R>
              <div className="flex items-center gap-5">
                <Trait />
                <h2 id="collection-label" className="inline-block font-sans text-[11px] tracking-[0.55em] uppercase m-0" style={{ color: WINE }}>
                  {t('collection_label')}
                </h2>
              </div>
            </R>
            <div className="flex items-center gap-4" aria-live="polite">
              {availLoading && (
                <motion.span role="status" aria-label={t('search_checking')}
                  className="w-1.5 h-1.5 rounded-full bg-[#351421]"
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              )}
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-light italic" style={{ fontSize: '17px', color: 'rgba(12,12,10,0.55)', lineHeight: 1 }}>
                  {datesSelected ? availableCount : visible.length}
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.45em]" style={{ color: 'rgba(12,12,10,0.32)' }}>
                  {datesSelected
                    ? (availableCount !== 1 ? t('availables') : t('available'))
                    : (visible.length > 1 ? t('suites') : t('suite'))}
                </span>
              </div>
            </div>
          </div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.45 }} />
                <span aria-hidden="true" className="font-serif font-light italic" style={{ fontSize: '32px', color: 'rgba(12,12,10,0.40)', lineHeight: 1 }}>—</span>
                <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.45 }} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-x-10 md:gap-y-28">
              {visible.map((s, i) => (
                <R key={s.id} d={i * 0.12} y={32}>
                  <SuiteCard suite={s} datesSelected={datesSelected} checkIn={checkIn} checkOut={checkOut} />
                </R>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROCHAINEMENT ── */}
      <section id="prochainement" aria-labelledby="prochainement-label" className="relative" style={{ backgroundColor: INK }}>
        {/* Grain analogique — section Ink */}
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />
        <div className="relative z-[2] max-w-container mx-auto py-16 md:py-32 px-6 md:px-0">
          <div className="flex items-end justify-between mb-12 md:mb-20 pb-6 md:pb-10"
            style={{ borderBottom: '1px solid rgba(244,245,240,0.08)' }}>
            <R>
              <div className="flex items-center gap-5">
                <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                <h2 id="prochainement-label" className="inline-block font-sans text-[11px] tracking-[0.55em] uppercase m-0" style={{ color: 'rgba(244,245,240,0.45)' }}>
                  {t('coming_soon_label')}
                </h2>
              </div>
            </R>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-light italic" style={{ fontSize: '17px', color: 'rgba(244,245,240,0.55)', lineHeight: 1 }}>
                {TO_COME.length}
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]" style={{ color: 'rgba(244,245,240,0.32)' }}>
                {TO_COME.length > 1 ? t('suites') : t('suite')}
              </span>
            </div>
          </div>

          {/* Desktop — 3 colonnes */}
          <div className="hidden md:grid grid-cols-3 gap-x-8 gap-y-20">
            {TO_COME.map((s, i) => (
              <R key={s.id} d={i * 0.12} y={32}>
                <SuiteCard suite={s} datesSelected={false} checkIn={checkIn} checkOut={checkOut} isToCome={true} dark={true} />
              </R>
            ))}
          </div>

          {/* Mobile — stack vertical 1 colonne (cohérence avec Collection) */}
          <div className="md:hidden grid grid-cols-1 gap-12">
            {TO_COME.map((s, i) => (
              <R key={s.id} d={i * 0.08} y={24}>
                <article aria-labelledby={`tocome-${s.id}-name`}>
                  <Link href={`/${locale}/hebergement/prochainement/${s.id}`} className="block">
                    <div className="relative overflow-hidden mb-5" style={{ aspectRatio: '3/4' }}>
                      <ToComeGallery images={s.images} name={s.name} />
                      <div className="absolute top-4 left-4 z-30">
                        <span className="font-sans text-[9px] uppercase tracking-[0.35em] px-2.5 py-1"
                          style={{ backgroundColor: 'rgba(12,12,10,0.60)', color: 'rgba(244,245,240,0.65)' }}>
                          {t('coming_soon_badge')}
                        </span>
                      </div>
                    </div>
                    <h3 id={`tocome-${s.id}-name`} className="font-serif font-light italic mb-2"
                      style={{ fontSize: '22px', color: 'rgba(244,245,240,0.85)', lineHeight: 1 }}>
                      {s.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-[10px] uppercase tracking-[0.30em]"
                          style={{ color: 'rgba(244,245,240,0.35)' }}>{s.surface}</span>
                        <span className="w-px h-3" style={{ backgroundColor: 'rgba(244,245,240,0.12)' }} />
                        <span className="font-sans text-[10px] uppercase tracking-[0.30em]"
                          style={{ color: 'rgba(244,245,240,0.25)' }}>{s.guests} {s.guests > 1 ? t('persons') : t('person')}</span>
                      </div>
                      <svg aria-hidden="true" width="10" height="10" fill="none" stroke={WINE} strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.65 }}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                      </svg>
                    </div>
                  </Link>
                </article>
              </R>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </motion.div>
  );
}