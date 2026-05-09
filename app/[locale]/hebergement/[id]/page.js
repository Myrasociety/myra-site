'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/useTranslations';
import { toKey } from '../../../../lib/useSmoobu';
import ContactSection from '../../../../components/Contact';

const INK    = '#0C0C0A';
const WINE   = '#2B1022';
const GROUND = '#F3F2EF';
const BONE   = 'rgba(12,12,10,0.06)';
const EXPO   = [0.16, 1, 0.3, 1];

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MONTHS_SHORT = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

const SUITES = {
  'Edwige': {
    number: '01', name: 'Edwige', smoobuId: 2450913,
    surface: '120 m²', capacity: '4 personnes', rooms: '3 pièces',
    description: 'Un volume habité par la lumière naturelle et le silence des vignes. Cuisine équipée, salon ouvert, matières nobles. Chaque détail a été pensé pour que le séjour devienne une parenthèse mémorable.',
    images: ['/Edwige/1.jpg','/Edwige/2.jpg','/Edwige/3.jpg','/Edwige/4.jpg','/Edwige/5.jpg','/Edwige/6.jpg','/Edwige/7.jpg','/Edwige/8.jpg'],
    features: ['Cuisine entièrement équipée (four, induction, lave-vaisselle)','Salon ouvert avec cheminée décorative','Chambre principale avec literie haut de gamme','Salle de bain avec baignoire îlot','Accès privatif au sauna et bain nordique','Terrasse privée avec vue sur les vignes'],
    floorplan: 'Entrée · Salon ouvert 40 m² · Cuisine équipée · Chambre 1 (lit king) · Chambre 2 (lits jumeaux) · Salle de bain principale · WC indépendant · Terrasse 20 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
    testimonial: { text: '« Un séjour hors du temps. La lumière est absolument sublime. »', author: 'Marie-Laure D.', origin: 'Membre Strasbourg' },
  },
  'Wingert': {
    number: '02', name: 'Wingert', smoobuId: 2868461,
    surface: '120 m²', capacity: '4 personnes', rooms: '3 pièces',
    description: 'Palette boisée et organique. Une déclinaison plus intime, orientée vers les sous-bois, avec sa terrasse plein est.',
    images: ['/Wingert/1.jpg','/Wingert/2.jpg','/Wingert/3.jpg','/Wingert/4.jpg','/Wingert/5.jpg','/Wingert/6.jpg'],
    features: ['Cuisine entièrement équipée','Salon avec cheminée et bibliothèque','Chambre principale avec dressing',"Salle de bain avec douche à l'italienne",'Accès au sauna et bain nordique','Terrasse orientée plein est'],
    floorplan: 'Entrée · Salon 38 m² · Cuisine équipée · Chambre 1 (lit king) · Chambre 2 (canapé-lit) · Salle de bain · WC · Terrasse 18 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
  },
  'Julia': {
    number: '03', name: 'Julia', smoobuId: 2637623,
    surface: '95 m²', capacity: '2 personnes', rooms: '2 pièces',
    description: "Cocon pour deux. Chaque recoin distille calme et élégance discrète, avec vue sur les vignes d'Alsace.",
    images: ['/Julia/1.jpg','/Julia/2.jpg','/Julia/3.jpg','/Julia/4.jpg','/Julia/5.jpg','/Julia/6.jpg'],
    features: ['Kitchenette équipée','Salon intime','Chambre avec vue sur les vignes','Salle de bain avec douche de tête','Accès au sauna et bain nordique','Balcon privatif'],
    floorplan: 'Entrée · Séjour 30 m² · Kitchenette · Chambre principale (lit king) · Salle de bain · Balcon 8 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
  },
};

const MONTHS = {
  fr: ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  de: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
};
const DAYS = {
  fr: ['L','M','M','J','V','S','D'],
  en: ['M','T','W','T','F','S','S'],
  de: ['M','D','M','D','F','S','S'],
};

// ─── GALERIE ─────────────────────────────────────────────────────────────────
function EquinoxGallery({ images, name }) {
  const [cur, setCur] = useState(0);
  const [width, setWidth] = useState(0);
  const wrapRef = useRef(null);
  const x = useMotionValue(0);
  const total = images.length;

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const PEEK   = width * 0.08;
  const GAP    = 20;
  const slideW = width > 0 ? width - (PEEK * 2) : 0;
  const getX   = (i) => PEEK - (i * (slideW + GAP));

  const snapTo = (i) => {
    const c = Math.max(0, Math.min(i, total - 1));
    setCur(c);
    animate(x, getX(c), { type: 'tween', duration: 0.65, ease: EXPO });
  };

  useEffect(() => { if (slideW > 0) x.set(getX(cur)); }, [slideW, width]);

  const handleDragEnd = (_, info) => {
    if (info.velocity.x < -200 || info.offset.x < -slideW * 0.1) snapTo(cur + 1);
    else if (info.velocity.x > 200 || info.offset.x > slideW * 0.1) snapTo(cur - 1);
    else snapTo(cur);
  };

  return (
    <div className="w-full">
      <div ref={wrapRef} className="relative overflow-hidden">
        {slideW > 0 && (
          <motion.div
            style={{ x, display: 'flex', gap: GAP, cursor: 'grab', touchAction: 'pan-y' }}
            drag="x"
            dragConstraints={{ left: getX(total - 1), right: getX(0) }}
            dragElastic={0.08} dragMomentum={false}
            onDragEnd={handleDragEnd}>
            {images.map((src, i) => (
              <motion.div key={i}
                style={{ flexShrink: 0, width: slideW, aspectRatio: '21/10', overflow: 'hidden' }}
                animate={{ opacity: i === cur ? 1 : 0.22, scale: i === cur ? 1 : 1 }}
                transition={{ duration: 0.6, ease: EXPO }}>
                <img src={src} alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{ filter: 'saturate(0.92)' }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      {/* Tirets */}
      <div className="max-w-container mx-auto px-6 md:px-20 mt-5 md:mt-10">
        <div className="flex items-center gap-2 w-full opacity-50">
          {images.map((_, i) => (
            <button key={i} onClick={() => snapTo(i)}
              className="h-[1px] transition-all duration-700 outline-none"
              style={{ flex: i === cur ? 8 : 1, backgroundColor: i === cur ? INK : 'rgba(12,12,10,0.12)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => { if (e.key==='Escape') onClose(); if (e.key==='ArrowLeft') onPrev(); if (e.key==='ArrowRight') onNext(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#0C0C0A] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <button onClick={onClose} className="absolute top-8 right-6 md:right-10 z-[110] outline-none"
        style={{ color: 'rgba(255,255,255,0.40)' }}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
      </button>
      <button onClick={onPrev} className="absolute left-4 md:left-10 p-3 z-[110]" style={{ color: 'rgba(255,255,255,0.20)' }}>
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" /></svg>
      </button>
      <button onClick={onNext} className="absolute right-4 md:right-10 p-3 z-[110]" style={{ color: 'rgba(255,255,255,0.20)' }}>
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={index} className="w-[92vw] md:w-[80vw] h-[65vh] md:h-[72vh] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EXPO }}>
          <img src={images[index]} alt="" className="max-w-full max-h-full object-contain" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6">
        <span className="font-sans text-[9px] uppercase tracking-[0.55em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}

// ─── ACCORDÉON ────────────────────────────────────────────────────────────────
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${BONE}` }}>
          <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between py-5 text-left outline-none">
            <span className="font-sans text-[10px] uppercase tracking-[0.45em] transition-colors duration-500" style={{ color: open===i ? INK : 'rgba(12,12,10,0.38)' }}>{item.label}</span>
            <div className="relative w-4 h-4 flex-shrink-0 ml-6">
              <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ backgroundColor: 'rgba(12,12,10,0.2)' }} />
              <motion.span className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2" style={{ backgroundColor: 'rgba(12,12,10,0.2)' }} animate={{ opacity: open===i ? 0 : 1 }} transition={{ duration: 0.25 }} />
            </div>
          </button>
          <motion.div initial={false} animate={{ height: open===i ? 'auto' : 0, opacity: open===i ? 1 : 0 }} transition={{ duration: 0.55, ease: EXPO }} style={{ overflow: 'hidden' }}>
            <div className="pb-6">{item.content}</div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── MONTH PICKER ─────────────────────────────────────────────────────────────
function MonthPicker({ current, onSelect, onClose }) {
  const monthOptions = Array.from({ length: 18 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + i); return d;
  });
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white z-[60] shadow-xl overflow-y-auto"
      style={{ width: 180, maxHeight: 260, border: '1px solid rgba(12,12,10,0.08)' }}>
      {monthOptions.map((d, i) => {
        const isActive = d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear();
        return (
          <button key={i} onClick={() => { onSelect(d); onClose(); }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
            style={{ backgroundColor: isActive ? INK : 'transparent' }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(12,12,10,0.04)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.35em]" style={{ color: isActive ? '#F3F2EF' : 'rgba(12,12,10,0.65)' }}>
              {MONTHS_SHORT[d.getMonth()]}
            </span>
            <span className="font-sans text-[9px]" style={{ color: isActive ? 'rgba(244,242,239,0.55)' : 'rgba(12,12,10,0.30)' }}>
              {d.getFullYear()}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── PANNEAU RÉSERVATION ──────────────────────────────────────────────────────
function ReservationPanel({ suite }) {
  const t      = useTranslations('suite');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [checkIn,      setCheckIn]      = useState(() => { const v = searchParams.get('arrival');   return v ? new Date(v) : null; });
  const [checkOut,     setCheckOut]     = useState(() => { const v = searchParams.get('departure'); return v ? new Date(v) : null; });
  const [view,         setView]         = useState(() => { const d = checkIn || new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [ratesData,    setRatesData]    = useState(null);
  const [availResult,  setAvailResult]  = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [picker,       setPicker]       = useState(false);

  useEffect(() => {
    fetch(`/api/smoobu/rates?apartments[]=${suite.smoobuId}`)
      .then(r => r.json()).then(setRatesData).catch(() => {});
  }, [suite.smoobuId]);

  useEffect(() => {
    if (!checkIn || !checkOut) { setAvailResult(null); return; }
    const run = async () => {
      setLoadingAvail(true);
      try {
        const r = await fetch('/api/smoobu/availability', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arrivalDate: toKey(checkIn), departureDate: toKey(checkOut), apartments: [suite.smoobuId] }),
        });
        setAvailResult(await r.json());
      } catch { setAvailResult(null); } finally { setLoadingAvail(false); }
    };
    run();
  }, [checkIn, checkOut, suite.smoobuId]);

  // Fermer picker si clic ailleurs
  useEffect(() => {
    if (!picker) return;
    const h = () => setPicker(false);
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, [picker]);

  const aptData     = ratesData?.data?.[suite.smoobuId] ?? ratesData?.data?.[String(suite.smoobuId)];
  const calendar    = aptData?.calendar ?? {};
  const priceInfo   = availResult?.prices?.[suite.smoobuId] ?? availResult?.prices?.[String(suite.smoobuId)];
  const isAvailable = availResult?.availableApartments?.includes(Number(suite.smoobuId)) || availResult?.availableApartments?.includes(String(suite.smoobuId));

  const handleBooking = async () => {
    if (!priceInfo) return;
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suiteName: suite.name, amount: priceInfo.total, checkIn: toKey(checkIn), checkOut: toKey(checkOut) }),
      });
      const data = await r.json();
      if (data.url) window.location.href = data.url;
    } catch (e) { console.error(e); }
  };

  const days = (() => {
    const y = view.getFullYear(), mo = view.getMonth();
    let f = new Date(y, mo, 1).getDay(); f = f===0 ? 6 : f-1;
    const tot = new Date(y, mo+1, 0).getDate();
    return [...Array(f).fill(null), ...Array.from({ length: tot }, (_, i) => new Date(y, mo, i+1))];
  })();

  const clickDay = (d) => {
    if (!d) return;
    const today = new Date(); today.setHours(0,0,0,0);
    if (d < today) return;
    if (calendar[toKey(d)] && !calendar[toKey(d)].available) return;
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(d); setCheckOut(null); }
    else if (d > checkIn) { setCheckOut(d); }
    else { setCheckIn(d); setCheckOut(null); }
  };

  const isSame    = (a, b) => a && b && toKey(a) === toKey(b);
  const isInRange = (d)    => d && checkIn && checkOut && d > checkIn && d < checkOut;
  const nights    = checkIn && checkOut ? Math.round((checkOut - checkIn) / 86400000) : 0;
  const fmtDay    = (d) => d?.toLocaleDateString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' }) ?? '—';
  const monthNames = MONTHS[locale] || MONTHS.fr;
  const dayNames   = DAYS[locale]   || DAYS.fr;

  return (
    <section style={{ backgroundColor: INK }}>
      <div className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-16 md:py-28">

        {/* Label */}
        <div className="flex items-center gap-5 mb-10 md:mb-14">
          <div className="h-px w-8" style={{ backgroundColor: WINE }} />
          <span className="font-sans text-[11px] uppercase tracking-[0.65em] text-white/40">{t('reservation_label')}</span>
        </div>

        {/* Carte blanche */}
        <div className="bg-white" style={{ border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)' }}>

          {/* Mobile — empilé verticalement */}
          <div className="block lg:hidden p-6 md:p-10">

            {/* Nom + infos */}
            <div className="mb-8 pb-6" style={{ borderBottom: `1px solid ${BONE}` }}>
              <h2 className="font-serif font-light italic leading-none mb-1" style={{ fontSize: 'clamp(26px, 6vw, 40px)', color: INK }}>
                {suite.name}
              </h2>
              <p className="font-sans text-[9px] uppercase tracking-[0.40em] text-black/30">
                {suite.surface} · {suite.capacity}
              </p>
            </div>

            {/* Calendrier — avec sélecteur mois cliquable */}
            <div className="mb-8">
              {/* Header mois cliquable */}
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
                </button>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setPicker(p => !p)}
                    className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.4em] hover:text-[#0C0C0A] transition-colors outline-none"
                    style={{ color: 'rgba(12,12,10,0.50)' }}>
                    {MONTHS_FR[view.getMonth()]} {view.getFullYear()}
                    <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                      style={{ transform: picker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {picker && (
                      <MonthPicker current={view} onSelect={(d) => setView(d)} onClose={() => setPicker(false)} />
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                  className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {dayNames.map((d, i) => (
                  <div key={i} className="font-sans text-[9px] text-center uppercase tracking-wider py-2 text-black/20">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const k = toKey(d);
                  const av = calendar[k]?.available;
                  const past = d < new Date().setHours(0,0,0,0);
                  const start = isSame(d, checkIn);
                  const end = isSame(d, checkOut);
                  const range = isInRange(d);
                  return (
                    <button key={i} onClick={() => clickDay(d)} disabled={past || av === false}
                      className={`h-10 flex flex-col items-center justify-center transition-all duration-200
                        ${past || av === false ? 'opacity-10 cursor-not-allowed' : 'hover:bg-black/5'}
                        ${range ? 'bg-black/[0.03]' : ''}
                        ${start || end ? 'text-white' : 'text-ink'}`}
                      style={{ backgroundColor: (start || end) ? INK : undefined }}>
                      <span className="font-serif text-[13px] leading-none">{d.getDate()}</span>
                      {calendar[k]?.price && !start && !end && !past && av !== false && (
                        <span className="font-sans text-[7px] mt-0.5 text-black/25">{Math.round(calendar[k].price)}€</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Récapitulatif dates */}
            <div className="grid grid-cols-2 mb-6" style={{ border: '1px solid rgba(12,12,10,0.08)' }}>
              <div className="p-4" style={{ borderRight: '1px solid rgba(12,12,10,0.06)' }}>
                <p className="font-sans text-[8px] uppercase tracking-[0.45em] text-black/30 mb-1.5">{t('arrival')}</p>
                <p className="font-serif italic text-[15px]" style={{ color: checkIn ? INK : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkIn)}</p>
              </div>
              <div className="p-4">
                <p className="font-sans text-[8px] uppercase tracking-[0.45em] text-black/30 mb-1.5">{t('departure')}</p>
                <p className="font-serif italic text-[15px]" style={{ color: checkOut ? INK : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkOut)}</p>
              </div>
            </div>

            {/* Prix + CTA */}
            <AnimatePresence mode="wait">
              {loadingAvail && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 flex items-center gap-3">
                  <div className="w-4 h-4 border border-t-[#2B1022] border-black/10 rounded-full animate-spin" />
                  <span className="font-sans text-[9px] uppercase tracking-widest text-black/20">{t('loading')}</span>
                </motion.div>
              )}
              {!loadingAvail && priceInfo && isAvailable && (
                <motion.div key="price" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="flex items-end justify-between pb-5" style={{ borderBottom: `1px solid ${BONE}` }}>
                    <div>
                      <p className="font-sans text-[8px] uppercase tracking-widest text-black/30 mb-1">{t('total_stay')}</p>
                      <p className="font-serif leading-none tabular-nums" style={{ fontSize: 'clamp(32px, 8vw, 48px)', color: INK }}>
                        {priceInfo.total.toLocaleString()}€
                      </p>
                    </div>
                    <div className="text-right pb-1">
                      <p className="font-serif italic text-black/35" style={{ fontSize: '16px' }}>
                        {Math.round(priceInfo.total / nights)}€
                        <span className="font-sans text-[8px] not-italic uppercase tracking-tight ml-1">/ nuit</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={handleBooking}
                    className="w-full py-5 font-sans text-[10px] uppercase tracking-[0.55em] relative overflow-hidden transition-colors duration-700"
                    style={{ backgroundColor: INK, color: '#F3F2EF' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = WINE}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = INK}>
                    {t('confirm')}
                  </button>
                </motion.div>
              )}
              {!loadingAvail && checkIn && checkOut && !isAvailable && (
                <motion.div key="unavail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 text-center" style={{ border: '1px dashed rgba(43,16,34,0.20)' }}>
                  <p className="font-serif italic text-[rgba(43,16,34,0.55)]" style={{ fontSize: '14px' }}>{t('unavailable')}</p>
                </motion.div>
              )}
              {!loadingAvail && (!checkIn || !checkOut) && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-6 text-center" style={{ border: '1px dashed rgba(12,12,10,0.10)' }}>
                  <p className="font-serif italic text-black/25" style={{ fontSize: '14px' }}>{t('select_dates')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop — 2 colonnes */}
          <div className="hidden lg:grid grid-cols-2 gap-0">
            {/* Gauche — infos + prix */}
            <div className="p-12 xl:p-16 flex flex-col gap-8" style={{ borderRight: `1px solid ${BONE}` }}>
              <div>
                <h2 className="font-serif font-light italic leading-none mb-2" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: INK }}>
                  {suite.name}
                </h2>
                <p className="font-sans text-[9px] uppercase tracking-[0.40em] text-black/30">
                  {suite.surface} · {suite.capacity}
                </p>
              </div>

              {/* Dates récap */}
              <div style={{ border: '1px solid rgba(12,12,10,0.08)' }}>
                <div className="grid grid-cols-2 divide-x divide-black/5">
                  <div className="p-5">
                    <p className="font-sans text-[8px] uppercase tracking-[0.45em] text-black/30 mb-2">{t('arrival')}</p>
                    <p className="font-serif italic text-[16px]" style={{ color: checkIn ? INK : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkIn)}</p>
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[8px] uppercase tracking-[0.45em] text-black/30 mb-2">{t('departure')}</p>
                    <p className="font-serif italic text-[16px]" style={{ color: checkOut ? INK : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkOut)}</p>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {loadingAvail && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 flex items-center gap-4">
                    <div className="w-4 h-4 border border-t-[#2B1022] border-black/10 rounded-full animate-spin" />
                    <span className="font-sans text-[10px] uppercase tracking-widest text-black/20">{t('loading')}</span>
                  </motion.div>
                )}
                {!loadingAvail && priceInfo && isAvailable && (
                  <motion.div key="price" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-end justify-between pb-6" style={{ borderBottom: `1px solid ${BONE}` }}>
                      <div>
                        <p className="font-sans text-[9px] uppercase tracking-widest text-black/30 mb-2">{t('total_stay')}</p>
                        <p className="font-serif text-5xl leading-none tabular-nums" style={{ color: INK }}>
                          {priceInfo.total.toLocaleString()}€
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif italic text-xl text-black/35">
                          {Math.round(priceInfo.total / nights)}€
                          <span className="font-sans text-[9px] not-italic uppercase tracking-tighter ml-1">/ nuit</span>
                        </p>
                      </div>
                    </div>
                    <button onClick={handleBooking}
                      className="w-full py-5 font-sans text-[10px] uppercase tracking-[0.55em] relative overflow-hidden transition-colors duration-700"
                      style={{ backgroundColor: INK, color: '#F3F2EF' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = WINE}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = INK}>
                      {t('confirm')}
                    </button>
                    <p className="font-sans text-[9px] text-center tracking-[0.25em] text-black/25">{t('secure')}</p>
                  </motion.div>
                )}
                {!loadingAvail && checkIn && checkOut && !isAvailable && (
                  <motion.div key="unavail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-5" style={{ border: '1px solid rgba(43,16,34,0.15)' }}>
                    <p className="font-serif italic text-[rgba(43,16,34,0.60)]" style={{ fontSize: '15px' }}>{t('unavailable')}</p>
                  </motion.div>
                )}
                {!loadingAvail && (!checkIn || !checkOut) && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="font-serif italic text-black/28" style={{ fontSize: '15px' }}>{t('select_dates')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Droite — calendrier */}
            <div className="p-12 xl:p-16">
              <div className="sticky top-28">
                {/* Header mois cliquable */}
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
                  </button>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setPicker(p => !p)}
                      className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.4em] hover:text-[#0C0C0A] transition-colors outline-none"
                      style={{ color: 'rgba(12,12,10,0.50)' }}>
                      {MONTHS_FR[view.getMonth()]} {view.getFullYear()}
                      <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                        style={{ transform: picker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {picker && (
                        <MonthPicker current={view} onSelect={(d) => setView(d)} onClose={() => setPicker(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                    className="w-8 h-8 flex items-center justify-center text-[rgba(12,12,10,0.22)] hover:text-[#0C0C0A] transition-colors">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {dayNames.map((d, i) => (
                    <div key={i} className="font-sans text-[9px] text-center uppercase tracking-wider py-2 text-black/20">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {days.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const k = toKey(d);
                    const av = calendar[k]?.available;
                    const past = d < new Date().setHours(0,0,0,0);
                    const start = isSame(d, checkIn);
                    const end = isSame(d, checkOut);
                    const range = isInRange(d);
                    return (
                      <button key={i} onClick={() => clickDay(d)} disabled={past || av === false}
                        className={`h-12 flex flex-col items-center justify-center transition-all duration-200
                          ${past || av === false ? 'opacity-10 cursor-not-allowed' : 'hover:bg-black/5'}
                          ${range ? 'bg-black/[0.03]' : ''}
                          ${start || end ? 'text-white' : 'text-ink'}`}
                        style={{ backgroundColor: (start || end) ? INK : undefined }}>
                        <span className="font-serif text-[13px] leading-none">{d.getDate()}</span>
                        {calendar[k]?.price && !start && !end && !past && av !== false && (
                          <span className="font-sans text-[8px] mt-0.5 text-black/28">{Math.round(calendar[k].price)}€</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTENU SUITE ────────────────────────────────────────────────────────────
function SuiteContent({ suite }) {
  const t      = useTranslations('suite');
  const locale = useLocale();
  const [galIdx,       setGalIdx]       = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImg = () => setGalIdx(i => (i + 1) % suite.images.length);
  const prevImg = () => setGalIdx(i => (i - 1 + suite.images.length) % suite.images.length);

  const accordionItems = [
    {
      label: t('accordion_features'),
      content: (
        <ul className="space-y-3">
          {suite.features.map((f, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-[9px] w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(43,16,34,0.40)' }} />
              <span className="font-serif text-[14px] leading-[1.75] italic" style={{ color: 'rgba(12,12,10,0.55)' }}>{f}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: t('accordion_plan'),
      content: <p className="font-serif text-[14px] leading-[1.9] italic" style={{ color: 'rgba(12,12,10,0.5)' }}>{suite.floorplan}</p>,
    },
    {
      label: t('accordion_address'),
      content: <p className="font-serif text-[14px] leading-[2] italic whitespace-pre-line" style={{ color: 'rgba(12,12,10,0.5)' }}>{suite.address}</p>,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: GROUND }}>
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox images={suite.images} index={galIdx} onClose={() => setLightboxOpen(false)} onNext={nextImg} onPrev={prevImg} />
        )}
      </AnimatePresence>

      {/* ── ENTÊTE ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 pt-24 md:pt-36 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-end">
          <div>
            <div className="flex items-center gap-3 font-sans text-[8px] uppercase tracking-[0.5em] mb-8"
              style={{ color: 'rgba(12,12,10,0.28)' }}>
              <a href={`/${locale}/hebergement`} className="transition-colors duration-400"
                onMouseEnter={e => e.currentTarget.style.color=INK}
                onMouseLeave={e => e.currentTarget.style.color='rgba(12,12,10,0.28)'}>
                {t('breadcrumb')}
              </a>
              <span style={{ color: 'rgba(12,12,10,0.15)' }}>·</span>
              <span>{suite.name}</span>
            </div>
            <h1 className="font-serif font-light leading-[0.88] tracking-[-0.03em] mb-5"
              style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: INK }}>
              {suite.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4" style={{ color: 'rgba(12,12,10,0.30)' }}>
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.surface}</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.12)' }} />
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.capacity}</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.12)' }} />
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.rooms}</span>
            </div>
          </div>
          <div>
            <p className="font-serif text-[16px] md:text-[18px] leading-[1.78] italic" style={{ color: 'rgba(12,12,10,0.55)' }}>
              {suite.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section className="pb-8 md:pb-14">
        <EquinoxGallery images={suite.images} name={suite.name} />
        <div className="flex justify-center mt-5 md:mt-6">
          <button onClick={() => setLightboxOpen(true)}
            className="font-sans text-[9px] uppercase tracking-[0.5em] py-2 px-5 transition-colors duration-400"
            style={{ color: 'rgba(12,12,10,0.35)', borderBottom: '1px solid rgba(12,12,10,0.12)' }}
            onMouseEnter={e => e.currentTarget.style.color = INK}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(12,12,10,0.35)'}>
            {t('gallery_browse')}
          </button>
        </div>
      </section>

      {/* ── TÉMOIGNAGE ── */}
      {suite.testimonial && (
        <section className="py-16 md:py-24 text-center"
          style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BONE}`, borderBottom: `1px solid ${BONE}` }}>
          <div className="max-w-container mx-auto px-6 md:px-14 lg:px-20">
            <div className="max-w-[680px] mx-auto">
              <div className="w-8 h-px mx-auto mb-8" style={{ backgroundColor: WINE, opacity: 0.4 }} />
              <blockquote className="font-serif font-light italic leading-[1.55] mb-8"
                style={{ fontSize: 'clamp(18px, 2.5vw, 32px)', color: 'rgba(12,12,10,0.72)' }}>
                {suite.testimonial.text}
              </blockquote>
              <p className="font-sans text-[9px] uppercase tracking-[0.55em] mb-1" style={{ color: INK }}>{suite.testimonial.author}</p>
              <p className="font-sans text-[8px] uppercase tracking-[0.40em]" style={{ color: 'rgba(43,16,34,0.40)' }}>{suite.testimonial.origin}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── ACCORDÉON ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-12 md:py-20">
        <Accordion items={accordionItems} />
      </section>

      {/* ── RÉSERVATION ── */}
      <ReservationPanel suite={suite} />

      {/* ── AUTRES SUITES ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-16 md:py-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
          <span className="font-sans text-[11px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.35)' }}>Autres suites</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(SUITES).filter(s => s.name !== suite.name).map((s, i) => (
            <a key={s.id} href={`/${locale}/hebergement/${s.name}`}
              className="group block" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '16/10' }}>
                <img src={s.images[0]} alt={s.name}
                  className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-[1.03]"
                  style={{ filter: 'saturate(0.80)' }} />
                <div className="absolute inset-0 bg-[rgba(12,12,10,0)] group-hover:bg-[rgba(12,12,10,0.10)] transition-all duration-500" />
              </div>
              <div className="py-4 flex items-end justify-between">
                <div>
                  <h3 className="font-serif font-light italic mb-1"
                    style={{ fontSize: '28px', color: INK }}>{s.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[9px] uppercase tracking-[0.35em]"
                      style={{ color: 'rgba(12,12,10,0.30)' }}>{s.surface}</span>
                    <span className="w-px h-3" style={{ backgroundColor: BONE }} />
                    <span className="font-sans text-[9px] uppercase tracking-[0.35em]"
                      style={{ color: 'rgba(12,12,10,0.30)' }}>{s.capacity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="font-sans text-[9px] uppercase tracking-[0.40em]"
                    style={{ color: 'rgba(12,12,10,0.40)' }}>Voir</span>
                  <svg width="10" height="10" fill="none" stroke="rgba(12,12,10,0.40)" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}

export default function SuiteDetailPage({ params }) {
  const { id } = React.use(params);
  const suite  = SUITES[id];
  if (!suite) notFound();

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: GROUND }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-12 animate-pulse" style={{ backgroundColor: 'rgba(43,16,34,0.3)' }} />
          <span className="font-sans text-[8.5px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.3)' }}>Chargement</span>
        </div>
      </div>
    }>
      <SuiteContent suite={suite} />
    </Suspense>
  );
}