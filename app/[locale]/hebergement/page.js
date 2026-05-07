'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/lib/useTranslations';
import { useRates, useAvailability, toKey } from '../../../lib/useSmoobu';
import ContactSection from '../../../components/Contact';

const INK  = '#0C0C0A';
const WINE = '#2B1022';
const BONE = 'rgba(12,12,10,0.06)';
const EASE = [0.19, 1, 0.22, 1];
const EXPO = [0.16, 1, 0.3, 1];

function R({ children, d = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const io  = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={io ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: d }}>
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
  { id: 'Nova', name: 'Nova', surface: '80 m²',  guests: 2, images: ['/Nova/2.jpg','/Nova/3.jpg','/Nova/4.jpg','/Nova/5.jpg'],  excerpt: 'Éclat contemporain et volumes généreux.' },
  { id: 'Opal', name: 'Opal', surface: '90 m²',  guests: 4, images: ['/Opal/1.jpg','/Opal/2.jpg'],                             excerpt: 'Douceur minérale et vue imprenable.' },
  { id: 'Asta', name: 'Asta', surface: '170 m²', guests: 8, images: ['/Asta/1.jpg'],                                           excerpt: "L'équilibre parfait entre héritage et modernité." },
];

const ALL_IDS  = SUITES.map(s => s.smoobuId);
const fmtShort = (d) => d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';

function ImageGallery({ images, name }) {
  const [idx, setIdx] = useState(0);
  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  return (
    <div className="relative w-full h-full group/gal overflow-hidden" style={{ backgroundColor: BONE }}>
      <motion.img key={idx} src={images[idx]} alt={`${name} — vue ${idx + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ filter: 'saturate(0.85)' }} />
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover/gal:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
        <button onClick={prev} className="pointer-events-auto w-9 h-9 flex items-center justify-center bg-[#F3F2EF]/80 hover:bg-[#F3F2EF] backdrop-blur-sm transition-all duration-300">
          <svg width="11" height="11" fill="none" stroke={INK} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
        </button>
        <button onClick={next} className="pointer-events-auto w-9 h-9 flex items-center justify-center bg-[#F3F2EF]/80 hover:bg-[#F3F2EF] backdrop-blur-sm transition-all duration-300">
          <svg width="11" height="11" fill="none" stroke={INK} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
        {images.map((_, i) => (
          <div key={i} className="h-px transition-all duration-500"
            style={{ width: i === idx ? 24 : 10, backgroundColor: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>
    </div>
  );
}

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
    <div className={`group transition-all duration-[1200ms] ${isOff ? 'opacity-20 pointer-events-none' : ''}`}>
      {isToCome ? (
        <div className="relative overflow-hidden mb-7" style={{ aspectRatio: '3/4' }}>
          <ImageGallery images={suite.images} name={suite.name} />
          <div className="absolute top-6 left-6 z-30">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] px-3 py-1.5"
              style={{ backgroundColor: 'rgba(12,12,10,0.60)', color: 'rgba(244,242,239,0.55)' }}>
              {t('coming_soon_badge')}
            </span>
          </div>
        </div>
      ) : (
        <Link href={href} className="block relative overflow-hidden mb-7 outline-none" style={{ aspectRatio: '14/10' }}>
          <ImageGallery images={suite.images} name={suite.name} />
        </Link>
      )}
      <div className="pt-2">
        <R>
          <div className="flex justify-between items-baseline mb-3 gap-4">
            <h3 className="font-serif font-light italic leading-[0.95]"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)', color: dark ? 'rgba(244,242,239,0.85)' : '#0C0C0A' }}>
              {suite.name}
            </h3>
            {price && (
              <div className="flex items-baseline gap-2 flex-shrink-0">
                <span className="font-sans text-[9px] uppercase tracking-[0.30em]"
                  style={{ color: dark ? 'rgba(244,242,239,0.25)' : 'rgba(12,12,10,0.30)' }}>
                  {suite.priceInfo ? t('total') : t('from')}
                </span>
                <p className="font-serif font-light"
                  style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', color: dark ? 'rgba(244,242,239,0.75)' : '#0C0C0A' }}>
                  {Math.round(price).toLocaleString('fr-FR')} €
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Cap light={dark}>{suite.surface}</Cap>
            <span className="w-px h-3" style={{ backgroundColor: dark ? 'rgba(244,242,239,0.10)' : BONE }} />
            <Cap light={dark}>{suite.guests} {t('max_guests')}</Cap>
          </div>
          <div className="h-px w-full mb-4" style={{ backgroundColor: dark ? 'rgba(244,242,239,0.06)' : BONE }} />
          <p className="font-serif font-light italic"
            style={{ fontSize: '16px', lineHeight: 1.72, color: dark ? 'rgba(244,242,239,0.35)' : 'rgba(12,12,10,0.42)' }}>
            {suite.excerpt}
          </p>
          {!isToCome && (
            <div className="flex items-center gap-3 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Trait /><Cap accent>{t('discover')}</Cap>
            </div>
          )}
        </R>
      </div>
    </div>
  );
}

function DoubleCalendar({ checkIn, checkOut, onChange, ratesData }) {
  const [viewDate, setViewDate] = useState(new Date());
  const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const DAYS   = ['L','M','M','J','V','S','D'];

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

  const renderMonth = (date) => {
    const y = date.getFullYear(), mo = date.getMonth();
    let first = new Date(y, mo, 1).getDay();
    first = first === 0 ? 6 : first - 1;
    const total = new Date(y, mo + 1, 0).getDate();
    const days = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => new Date(y, mo, i + 1))];
    return (
      <div className="flex-1 min-w-[260px]">
        <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-center mb-8 text-[rgba(12,12,10,0.38)]">{MONTHS[mo]} {y}</p>
        <div className="grid grid-cols-7">
          {DAYS.map((d, i) => (
            <div key={i} className="font-sans text-[9px] text-center uppercase tracking-wider mb-4 text-[rgba(12,12,10,0.20)]">{d}</div>
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
                className={`h-11 flex flex-col items-center justify-center transition-all duration-150
                  ${isStart || isEnd ? 'text-[#F3F2EF]' : 'hover:bg-[rgba(12,12,10,0.04)]'}
                  ${inRange ? 'bg-[rgba(12,12,10,0.04)]' : ''}
                  ${isBlocked || isPast ? 'opacity-10 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: (isStart || isEnd) ? INK : undefined }}>
                <span className="font-serif text-[13px] leading-none">{d.getDate()}</span>
                {data?.price && !isStart && !isEnd && !isPast && !isBlocked && (
                  <span className="font-sans text-[8px] mt-0.5 text-[rgba(12,12,10,0.30)]">{Math.round(data.price)}€</span>
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
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.25)] hover:text-[#0C0C0A] transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
        </button>
        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.25)] hover:text-[#0C0C0A] transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-14 md:gap-20">
        {renderMonth(viewDate)}{renderMonth(nextMonthDate)}
      </div>
    </div>
  );
}

function Hero({ checkIn, checkOut, guests, setGuests, onDateChange, panelOpen, setPanelOpen, isLoading, ratesData }) {
  const t = useTranslations('hebergement');
  const filterRef = useRef(null);
  const barRef = useRef(null);
  const [dir, setDir] = useState('bottom');
  const datesSelected = !!(checkIn && checkOut);

  useEffect(() => {
    if (panelOpen && barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      setDir(window.innerHeight - rect.bottom < 500 ? 'top' : 'bottom');
    }
  }, [panelOpen]);

  return (
    <section className="relative w-full flex flex-col bg-[#0C0C0A]" style={{ height: '100dvh', minHeight: 680 }}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img src="/Complexe/1.jpg" alt="Domaine MYRA"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.35) contrast(1.1)' }}
          initial={{ scale: 1.04 }} animate={{ scale: 1 }}
          transition={{ duration: 3.5, ease: EASE }} />
      </div>
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(12,12,10,0.92) 100%)' }} />

      {/* Spacer pour pousser le contenu vers le bas */}
      <div className="flex-1" />

      {/* Tagline + Logo — ALIGNÉ SUR LE CONTENEUR */}
      <div className="relative z-10 w-full pb-6">
        <div className="max-w-container mx-auto px-10 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: EASE, delay: 0.2 }}>
            <div className="flex items-center gap-4">
              <h1 className="font-serif font-light italic text-white leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(64px, 9vw, 130px)' }}>
                {t('hero_title')}
              </h1>
              <img src="/myra-logo.svg" alt="MYRA"
                style={{ height: 'clamp(40px, 5.5vw, 80px)', filter: 'brightness(0) invert(1)', opacity: 0.45 }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Adresse + barre — UTILISE LE MÊME CONTENEUR */}
      <div className="relative z-40 w-full pb-12" ref={filterRef}>
        <div className="max-w-container mx-auto px-10 md:px-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}>
            <p className="font-sans text-[9px] uppercase tracking-[0.45em] mb-5"
              style={{ color: 'rgba(244,245,240,0.18)' }}>
              71 rue du Général de Gaulle — 67520 Marlenheim, Alsace
            </p>
            
            <div className="relative" ref={barRef}>
              <AnimatePresence>
                {panelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: dir === 'top' ? -8 : 8 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`absolute ${dir === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 right-0 bg-[#F3F2EF] z-50 max-h-[75vh] overflow-y-auto`}
                    style={{ border: '1px solid rgba(12,12,10,0.06)', boxShadow: '0 40px 100px rgba(0,0,0,0.25)' }}>
                    <div className="px-8 md:px-12 pt-10 pb-12">
                      {panelOpen === 'dates' ? (
                        <DoubleCalendar checkIn={checkIn} checkOut={checkOut} onChange={onDateChange} ratesData={ratesData} />
                      ) : (
                        <div className="max-w-xl">
                          <Cap className="block mb-10">{t('guests_label')}</Cap>
                          <div className="flex flex-wrap gap-3">
                            {[1,2,3,4,5,6].map(n => (
                              <button key={n} onClick={() => { setGuests(n); setPanelOpen(null); }}
                                className="w-14 h-14 transition-all duration-500 border font-sans text-[13px]"
                                style={{ backgroundColor: guests === n ? INK : 'transparent', color: guests === n ? '#F3F2EF' : 'rgba(12,12,10,0.40)', borderColor: guests === n ? INK : BONE }}>
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

              <div className="flex items-center"
                style={{
                  borderTop: '1px solid rgba(244,245,240,0.12)',
                  borderBottom: '1px solid rgba(244,245,240,0.06)',
                  backgroundColor: 'rgba(244,245,240,0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}>
                <button onClick={() => setPanelOpen(panelOpen === 'dates' ? null : 'dates')}
                  className="flex-1 flex items-center gap-6 py-5 pl-6 pr-8 outline-none text-left hover:bg-[rgba(244,245,240,0.04)] transition-colors"
                  style={{ borderRight: '1px solid rgba(244,245,240,0.08)' }}>
                  <span className="font-sans text-[9px] uppercase tracking-[0.50em] flex-shrink-0"
                    style={{ color: 'rgba(244,245,240,0.28)' }}>{t('search_dates')}</span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.30em]"
                    style={{ color: datesSelected ? 'rgba(244,245,240,0.80)' : 'rgba(244,245,240,0.35)' }}>
                    {datesSelected ? `${fmtShort(checkIn)} — ${fmtShort(checkOut)}` : '—'}
                  </span>
                </button>
                <button onClick={() => setPanelOpen(panelOpen === 'guests' ? null : 'guests')}
                  className="flex items-center gap-6 py-5 px-8 outline-none text-left hover:bg-[rgba(244,245,240,0.04)] transition-colors"
                  style={{ borderRight: '1px solid rgba(244,245,240,0.08)' }}>
                  <span className="font-sans text-[9px] uppercase tracking-[0.50em] flex-shrink-0"
                    style={{ color: 'rgba(244,245,240,0.28)' }}>{t('search_guests')}</span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.30em]"
                    style={{ color: guests > 0 ? 'rgba(244,245,240,0.80)' : 'rgba(244,245,240,0.35)' }}>
                    {guests > 0 ? `${guests}` : '—'}
                  </span>
                </button>
                <button
                  onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                  className="py-5 pl-8 pr-6 font-sans text-[9px] uppercase tracking-[0.55em] outline-none transition-colors duration-400 hover:bg-[rgba(244,245,240,0.04)]"
                  style={{ color: 'rgba(244,245,240,0.30)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(244,245,240,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,245,240,0.30)'}>
                  {isLoading ? '…' : t('search_verify')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HebergementPage() {
  const t = useTranslations('hebergement');
  const [checkIn,   setCheckIn]   = useState(null);
  const [checkOut,  setCheckOut]  = useState(null);
  const [guests,    setGuests]    = useState(0);
  const [panelOpen, setPanelOpen] = useState(null);
  const panelRef = useRef(null);

  const { ratesData }                          = useRates(ALL_IDS);
  const { availData, isLoading: availLoading } = useAvailability(checkIn, checkOut, ALL_IDS, guests);
  const datesSelected = !!(checkIn && checkOut);

  useEffect(() => {
    const h = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
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
    <motion.div className="min-h-screen bg-[#F3F2EF]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EXPO }}>
      <div ref={panelRef}>
        <Hero checkIn={checkIn} checkOut={checkOut} guests={guests} setGuests={setGuests}
          onDateChange={handleDateChange} panelOpen={panelOpen} setPanelOpen={setPanelOpen}
          isLoading={availLoading} ratesData={ratesData} />
      </div>

      {/* ── COLLECTION — 2 colonnes ── */}
      <section id="collection">
        <div className="max-w-container mx-auto py-24 md:py-32">
          <div className="flex items-end justify-between mb-20 pb-10"
            style={{ borderBottom: '1px solid rgba(12,12,10,0.06)' }}>
            <R>
              <div className="flex items-center gap-5"><Trait /><Cap accent>{t('collection_label')}</Cap></div>
            </R>
            <div className="flex items-center gap-5">
              {availLoading && (
                <div className="flex items-center gap-2.5">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#2B1022]"
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <Cap>{t('search_checking')}</Cap>
                </div>
              )}
              <Cap>
                {datesSelected
                  ? `${availableCount} ${availableCount !== 1 ? t('availables') : t('available')}`
                  : `${visible.length} ${visible.length > 1 ? t('suites') : t('suite')}`}
              </Cap>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-24">
            {visible.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: EXPO, delay: i * 0.12 }}>
                <SuiteCard suite={s} datesSelected={datesSelected} checkIn={checkIn} checkOut={checkOut} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCHAINEMENT — fond noir, 3 colonnes ── */}
      <section style={{ backgroundColor: INK }}>
        <div className="max-w-container mx-auto py-24 md:py-32 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-end justify-between mb-20 pb-10"
              style={{ borderBottom: '1px solid rgba(244,242,239,0.06)' }}>
              <R>
                <div className="flex items-center gap-5">
                  <div className="w-8 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                  <Cap light>{t('coming_soon_label')}</Cap>
                </div>
              </R>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-20">
              {TO_COME.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EXPO, delay: i * 0.12 }}>
                  <SuiteCard suite={s} datesSelected={false} checkIn={checkIn} checkOut={checkOut} isToCome={true} dark={true} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </motion.div>
  );
}