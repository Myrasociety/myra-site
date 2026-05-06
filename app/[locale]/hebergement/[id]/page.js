'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/useTranslations';
import { toKey } from '../../../../lib/useSmoobu';
import ContactSection from '../../../../components/Contact';

const INK    = '#0C0C0A';
const WINE   = '#2B1022';
const ASH    = 'rgba(12,12,10,0.45)';
const GROUND = '#F3F2EF';
const BONE   = 'rgba(12,12,10,0.06)';
const EXPO   = [0.16, 1, 0.3, 1];

const SUITES = {
  'Edwige': {
    number: '01', name: 'Edwige', smoobuId: 2450913,
    surface: '120 m²', capacity: '4 personnes', rooms: '3 pièces',
    description: 'Un volume habité par la lumière naturelle et le silence des vignes. Cuisine équipée, salon ouvert, matières nobles. Chaque détail a été pensé pour que le séjour devienne une parenthèse mémorable.',
    hero: ['/Edwige/1.jpg', '/Edwige/2.jpg'],
    images: ['/Edwige/1.jpg','/Edwige/2.jpg','/Edwige/3.jpg','/Edwige/4.jpg','/Edwige/5.jpg','/Edwige/6.jpg','/Edwige/7.jpg','/Edwige/8.jpg','/Edwige/9.jpg','/Edwige/10.jpg','/Edwige/11.jpg','/Edwige/12.jpg','/Edwige/13.jpg','/Edwige/14.jpg','/Edwige/15.jpg'],
    features: ['Cuisine entièrement équipée (four, induction, lave-vaisselle)','Salon ouvert avec cheminée décorative','Chambre principale avec literie haut de gamme','Salle de bain avec baignoire îlot','Accès privatif au sauna et bain nordique','Terrasse privée avec vue sur les vignes'],
    floorplan: 'Entrée · Salon ouvert 40 m² · Cuisine équipée · Chambre 1 (lit king) · Chambre 2 (lits jumeaux) · Salle de bain principale · WC indépendant · Terrasse 20 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
    testimonial: { text: '« Un séjour hors du temps. La lumière est absolument sublime. »', author: 'Marie-Laure D.', origin: 'Membre Strasbourg' },
  },
  'Wingert': {
    number: '02', name: 'Wingert', smoobuId: 2868461,
    surface: '120 m²', capacity: '4 personnes', rooms: '3 pièces',
    description: 'Palette boisée et organique. Une déclinaison plus intime, orientée vers les sous-bois, avec sa terrasse plein est.',
    hero: ['/Wingert/1.jpg', '/Wingert/2.jpg'],
    images: ['/Wingert/1.jpg','/Wingert/2.jpg','/Wingert/3.jpg','/Wingert/4.jpg','/Wingert/5.jpg','/Wingert/6.jpg','/Wingert/7.jpg','/Wingert/8.jpg','/Wingert/9.jpg','/Wingert/10.jpg','/Wingert/11.jpg','/Wingert/12.jpg','/Wingert/13.jpg','/Wingert/14.jpg'],
    features: ['Cuisine entièrement équipée','Salon avec cheminée et bibliothèque','Chambre principale avec dressing',"Salle de bain avec douche à l'italienne",'Accès au sauna et bain nordique','Terrasse orientée plein est'],
    floorplan: 'Entrée · Salon 38 m² · Cuisine équipée · Chambre 1 (lit king) · Chambre 2 (canapé-lit) · Salle de bain · WC · Terrasse 18 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
  },
  'Julia': {
    number: '03', name: 'Julia', smoobuId: 2637623,
    surface: '95 m²', capacity: '2 personnes', rooms: '2 pièces',
    description: "Cocon pour deux. Chaque recoin distille calme et élégance discrète, avec vue sur les vignes d'Alsace.",
    hero: ['/Julia/1.jpg', '/Julia/2.jpg'],
    images: ['/Julia/1.jpg','/Julia/2.jpg','/Julia/3.jpg','/Julia/4.jpg','/Julia/5.jpg','/Julia/6.jpg'],
    features: ['Kitchenette équipée','Salon intime','Chambre avec vue sur les vignes','Salle de bain avec douche de tête','Accès au sauna et bain nordique','Balcon privatif'],
    floorplan: 'Entrée · Séjour 30 m² · Kitchenette · Chambre principale (lit king) · Salle de bain · Balcon 8 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
  },
  'Etoile': {
    number: '04', name: 'Etoile', smoobuId: 1920032,
    surface: '150 m²', capacity: '6 personnes', rooms: '4 pièces',
    description: "La plus spacieuse. Généreuse, lumineuse — faite pour les séjours qui s'étendent et les familles qui se retrouvent.",
    hero: ['/club.png', '/rooms.png'],
    images: ['/club.png','/rooms.png','/hotel.png','/studio.png','/experience.png'],
    features: ['Grande cuisine ouverte entièrement équipée','Salon double avec espace jeux','Chambre parentale avec dressing','Accès prioritaire au sauna','Grande terrasse avec salon de jardin'],
    floorplan: 'Entrée · Grand séjour 55 m² · Cuisine ouverte · Terrasse 30 m²',
    address: '11 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
  },
};

// Mois/jours selon locale
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

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const t = useTranslations('suite');
  useEffect(() => {
    const h = (e) => { if (e.key==='Escape') onClose(); if (e.key==='ArrowLeft') onPrev(); if (e.key==='ArrowRight') onNext(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#0C0C0A] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <button onClick={onClose} className="absolute top-8 right-10 z-[110] group flex items-center gap-4 outline-none">
        <span className="font-sans text-[8px] uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('lightbox_close')}</span>
        <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
      </button>
      <button onClick={onPrev} className="absolute left-6 md:left-10 p-4 z-[110]" style={{ color: 'rgba(255,255,255,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.8)'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.2)'}>
        <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" /></svg>
      </button>
      <button onClick={onNext} className="absolute right-6 md:right-10 p-4 z-[110]" style={{ color: 'rgba(255,255,255,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.8)'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.2)'}>
        <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
      </button>
      <AnimatePresence mode="wait">
        <motion.div key={index} className="w-[80vw] h-[72vh] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EXPO }}>
          <img src={images[index]} alt="" className="max-w-full max-h-full object-contain" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-8">
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
          <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between py-6 text-left group outline-none">
            <span className="font-sans text-[10px] uppercase tracking-[0.45em] transition-colors duration-500" style={{ color: open===i ? INK : 'rgba(12,12,10,0.38)' }}>{item.label}</span>
            <div className="relative w-4 h-4 flex-shrink-0 ml-8">
              <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ backgroundColor: 'rgba(12,12,10,0.2)' }} />
              <motion.span className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2" style={{ backgroundColor: 'rgba(12,12,10,0.2)' }} animate={{ opacity: open===i ? 0 : 1 }} transition={{ duration: 0.25 }} />
            </div>
          </button>
          <motion.div initial={false} animate={{ height: open===i ? 'auto' : 0, opacity: open===i ? 1 : 0 }} transition={{ duration: 0.55, ease: EXPO }} style={{ overflow: 'hidden' }}>
            <div className="pb-8">{item.content}</div>
          </motion.div>
        </div>
      ))}
    </div>
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

  const changeMonth = (n) => setView(p => new Date(p.getFullYear(), p.getMonth() + n, 1));
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
    <section className="py-20 md:py-32 border-t border-[rgba(12,12,10,0.06)] bg-white">
      <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20">

        <div className="flex items-center gap-5 mb-16 md:mb-20">
          <div className="h-px w-8" style={{ backgroundColor: 'rgba(43,16,34,0.40)' }} />
          <span className="font-sans text-[11px] uppercase tracking-[0.65em] text-[rgba(12,12,10,0.35)]">{t('reservation_label')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* GAUCHE */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-serif font-light leading-[0.92] tracking-[-0.02em] text-[#0C0C0A] mb-3" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)' }}>
                {suite.name}
              </h2>
              <p className="font-sans text-[11px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.30)]">
                {suite.surface} · {suite.capacity}
              </p>
            </div>

            {/* Dates */}
            <div className="border border-[rgba(12,12,10,0.08)]">
              <div className="grid grid-cols-2 divide-x divide-[rgba(12,12,10,0.06)]">
                <div className="p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.50em] text-[rgba(12,12,10,0.28)] mb-3">{t('arrival')}</p>
                  <p className="font-serif italic" style={{ fontSize: '17px', color: checkIn ? '#0C0C0A' : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkIn)}</p>
                  {checkIn && <p className="font-sans text-[10px] uppercase tracking-widest mt-1 text-[rgba(12,12,10,0.25)]">{checkIn.getFullYear()}</p>}
                </div>
                <div className="p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.50em] text-[rgba(12,12,10,0.28)] mb-3">{t('departure')}</p>
                  <p className="font-serif italic" style={{ fontSize: '17px', color: checkOut ? '#0C0C0A' : 'rgba(12,12,10,0.20)' }}>{fmtDay(checkOut)}</p>
                  {checkOut && <p className="font-sans text-[10px] uppercase tracking-widest mt-1 text-[rgba(12,12,10,0.25)]">{checkOut.getFullYear()}</p>}
                </div>
              </div>
              {nights > 0 && (
                <div className="px-6 py-4 border-t border-[rgba(12,12,10,0.06)] bg-[rgba(12,12,10,0.02)]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.35)]">
                    {nights} {nights > 1 ? t('nights') : t('night')}
                  </p>
                </div>
              )}
            </div>

            {/* Prix + CTA */}
            <AnimatePresence mode="wait">
              {loadingAvail && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 py-4">
                  <motion.span className="w-4 h-4 border border-[rgba(12,12,10,0.12)] border-t-[#0C0C0A] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  <span className="font-sans text-[11px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.30)]">{t('loading')}</span>
                </motion.div>
              )}

              {!loadingAvail && priceInfo && isAvailable && (
                <motion.div key="price" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EXPO }} className="space-y-6">
                  <div className="border border-[rgba(12,12,10,0.08)] p-6 space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.50em] text-[rgba(12,12,10,0.28)] mb-2">{t('total_stay')}</p>
                        <p className="font-serif font-light leading-none text-[#0C0C0A]" style={{ fontSize: 'clamp(40px, 4.5vw, 60px)' }}>
                          {priceInfo.total.toLocaleString('fr-FR')} €
                        </p>
                      </div>
                      <div className="text-right pb-1">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-[rgba(12,12,10,0.22)] mb-1">{t('per_night')}</p>
                        <p className="font-serif italic text-[rgba(12,12,10,0.42)]" style={{ fontSize: '22px' }}>
                          {Math.round(priceInfo.total / priceInfo.nights).toLocaleString('fr-FR')} €
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[rgba(12,12,10,0.06)] flex items-center justify-between">
                      <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-[rgba(12,12,10,0.28)]">
                        {priceInfo.nights} {priceInfo.nights > 1 ? t('nights') : t('night')} · {t('tax')}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.30em] text-emerald-600">{t('available')}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleBooking}
                    className="w-full font-sans text-[11px] uppercase tracking-[0.55em] text-[#F3F2EF] py-5 px-8 transition-all duration-700 flex items-center justify-center gap-5"
                    style={{ backgroundColor: '#0C0C0A' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor='#2B1022'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor='#0C0C0A'}>
                    <span>{t('confirm')}</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" /></svg>
                  </button>
                  <p className="font-sans text-[10px] text-center tracking-[0.25em] text-[rgba(12,12,10,0.25)]">{t('secure')}</p>
                </motion.div>
              )}

              {!loadingAvail && checkIn && checkOut && !isAvailable && (
                <motion.div key="unavail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border border-[rgba(43,16,34,0.15)] p-6">
                  <p className="font-serif italic text-[rgba(43,16,34,0.60)]" style={{ fontSize: '16px' }}>{t('unavailable')}</p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-[rgba(12,12,10,0.30)] mt-2">{t('unavailable_sub')}</p>
                </motion.div>
              )}

              {!loadingAvail && (!checkIn || !checkOut) && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="font-serif italic text-[rgba(12,12,10,0.28)]" style={{ fontSize: '16px' }}>{t('select_dates')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DROITE — Calendrier */}
          <div className="border-t lg:border-t-0 lg:border-l border-[rgba(12,12,10,0.06)] pt-12 lg:pt-0 lg:pl-16">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => changeMonth(-1)} className="w-9 h-9 flex items-center justify-center border border-[rgba(12,12,10,0.06)] hover:border-[#2B1022] transition-all duration-400">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
                </button>
                <span className="font-sans text-[12px] uppercase tracking-[0.40em] text-[rgba(12,12,10,0.50)]">
                  {monthNames[view.getMonth()]} {view.getFullYear()}
                </span>
                <button onClick={() => changeMonth(1)} className="w-9 h-9 flex items-center justify-center border border-[rgba(12,12,10,0.06)] hover:border-[#2B1022] transition-all duration-400">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((d, i) => (
                  <div key={i} className="font-sans text-[10px] text-center uppercase tracking-wider py-2 text-[rgba(12,12,10,0.20)]">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const key       = toKey(d);
                  const dayData   = calendar[key];
                  const isStart   = isSame(d, checkIn);
                  const isEnd     = isSame(d, checkOut);
                  const inRange   = isInRange(d);
                  const isPast    = d < new Date().setHours(0,0,0,0);
                  const isBlocked = dayData && !dayData.available;
                  const price     = dayData?.price;
                  return (
                    <button key={i} onClick={() => clickDay(d)} disabled={isPast || isBlocked}
                      className={`h-14 flex flex-col items-center justify-center transition-all duration-200
                        ${isPast || isBlocked ? 'opacity-10 cursor-not-allowed' : 'hover:bg-[rgba(12,12,10,0.04)]'}
                        ${inRange ? 'bg-[rgba(12,12,10,0.04)]' : ''}`}
                      style={{ backgroundColor: (isStart || isEnd) ? '#0C0C0A' : undefined }}>
                      <span className="font-serif text-[13px] leading-none" style={{ color: (isStart || isEnd) ? '#F3F2EF' : '#0C0C0A' }}>{d.getDate()}</span>
                      {price && !isStart && !isEnd && !isPast && !isBlocked && (
                        <span className="font-sans text-[9px] mt-0.5 text-[rgba(12,12,10,0.28)]">{Math.round(price)}€</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-8 mt-8 pt-6 border-t border-[rgba(12,12,10,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#0C0C0A]" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[rgba(12,12,10,0.30)]">{t('selected')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[11px] line-through text-[rgba(12,12,10,0.20)]">12</span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[rgba(12,12,10,0.30)]">{t('full')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTENU DE LA SUITE ──────────────────────────────────────────────────────
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
              <span className="mt-[9px] w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(61,13,12,0.35)' }} />
              <span className="font-serif text-[15px] leading-[1.75] italic" style={{ color: 'rgba(12,12,10,0.55)' }}>{f}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: t('accordion_plan'),
      content: <p className="font-serif text-[15px] leading-[1.9] italic" style={{ color: 'rgba(12,12,10,0.5)' }}>{suite.floorplan}</p>,
    },
    {
      label: t('accordion_address'),
      content: <p className="font-serif text-[15px] leading-[2] italic whitespace-pre-line" style={{ color: 'rgba(12,12,10,0.5)' }}>{suite.address}</p>,
    },
  ];

  return (
    <div className="min-h-screen selection:bg-[#2B1022] selection:text-white" style={{ backgroundColor: GROUND }}>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox images={suite.images} index={galIdx} onClose={() => setLightboxOpen(false)} onNext={nextImg} onPrev={prevImg} />
        )}
      </AnimatePresence>

      {/* ── ENTÊTE ── */}
      <section className="max-w-container mx-auto px-8 md:px-14 lg:px-20 pt-44 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-sans flex items-center gap-3 text-[8px] uppercase tracking-[0.5em] mb-10" style={{ color: 'rgba(12,12,10,0.28)' }}>
              <a href={`/${locale}/hebergement`} className="transition-colors duration-400"
                onMouseEnter={e => e.currentTarget.style.color=INK} onMouseLeave={e => e.currentTarget.style.color='rgba(12,12,10,0.28)'}>
                {t('breadcrumb')}
              </a>
              <span style={{ color: 'rgba(12,12,10,0.15)' }}>·</span>
              <span>{suite.name}</span>
            </div>
            <h1 className="font-serif text-[56px] md:text-[80px] leading-[0.88] tracking-[-0.02em] font-light mb-8" style={{ color: INK }}>
              {suite.name}
            </h1>
            <div className="font-sans flex flex-wrap items-center gap-5" style={{ color: 'rgba(12,12,10,0.3)' }}>
              <span className="text-[8.5px] uppercase tracking-[0.45em]">{suite.surface}</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.1)' }} />
              <span className="text-[8.5px] uppercase tracking-[0.45em]">{suite.capacity}</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.1)' }} />
              <span className="text-[8.5px] uppercase tracking-[0.45em]">{suite.rooms}</span>
            </div>
          </div>
          <div className="md:pl-10">
            <p className="font-serif text-[18px] md:text-[20px] leading-[1.78] italic" style={{ color: 'rgba(12,12,10,0.58)' }}>
              {suite.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── IMAGES HERO ── */}
      <section className="pb-32">
        <div className="grid grid-cols-2 gap-1 mb-20">
          {suite.hero.map((img, i) => (
            <div key={i} style={{ aspectRatio: '16/11' }} className="overflow-hidden cursor-zoom-in group"
              onClick={() => { setGalIdx(suite.images.indexOf(img)); setLightboxOpen(true); }}>
              <img src={img} alt={`${suite.name} — vue ${i + 1}`}
                className="w-full h-full object-cover transition-all duration-[3s] ease-out"
                style={{ filter: 'saturate(0.85)' }}
                onMouseEnter={e => { e.currentTarget.style.filter='saturate(1)'; e.currentTarget.style.transform='scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter='saturate(0.85)'; e.currentTarget.style.transform='scale(1)'; }} />
            </div>
          ))}
        </div>
        <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20">
          <Accordion items={accordionItems} />
        </div>
      </section>

      {/* ── TÉMOIGNAGE ── */}
      {suite.testimonial && (
        <section className="py-32 text-center" style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BONE}`, borderBottom: `1px solid ${BONE}` }}>
          <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20">
            <div className="max-w-[800px] mx-auto">
              <span className="font-serif text-[72px] leading-none block mb-6 select-none" style={{ color: 'rgba(61,13,12,0.08)' }}>"</span>
              <blockquote className="font-serif text-[28px] md:text-[38px] leading-[1.28] italic mb-14" style={{ color: 'rgba(12,12,10,0.75)' }}>
                {suite.testimonial.text}
              </blockquote>
              <div className="flex flex-col items-center gap-5">
                <div className="w-12 h-px" style={{ backgroundColor: 'rgba(61,13,12,0.25)' }} />
                <p className="font-sans text-[9px] uppercase tracking-[0.65em] font-medium" style={{ color: INK }}>{suite.testimonial.author}</p>
                <p className="font-sans text-[8px] uppercase tracking-[0.45em]" style={{ color: 'rgba(61,13,12,0.4)' }}>{suite.testimonial.origin}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIE ── */}
      <section className="max-w-container mx-auto px-8 md:px-14 lg:px-20 py-20 md:py-32">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="h-px w-8" style={{ backgroundColor: 'rgba(61,13,12,0.35)' }} />
            <span className="font-sans text-[8.5px] uppercase tracking-[0.65em]" style={{ color: 'rgba(12,12,10,0.35)' }}>{t('gallery_label')}</span>
            <span className="font-sans text-[8.5px] tracking-widest" style={{ color: 'rgba(12,12,10,0.2)' }}>
              {String(galIdx + 1).padStart(2, '0')} / {String(suite.images.length).padStart(2, '0')}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={prevImg} className="w-11 h-11 flex items-center justify-center border transition-all duration-400" style={{ borderColor: BONE, color: 'rgba(12,12,10,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(12,12,10,0.25)'; e.currentTarget.style.color=INK; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=BONE; e.currentTarget.style.color='rgba(12,12,10,0.3)'; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" /></svg>
            </button>
            <button onClick={nextImg} className="w-11 h-11 flex items-center justify-center border transition-all duration-400" style={{ borderColor: BONE, color: 'rgba(12,12,10,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(12,12,10,0.25)'; e.currentTarget.style.color=INK; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=BONE; e.currentTarget.style.color='rgba(12,12,10,0.3)'; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        <div className="aspect-[21/9] overflow-hidden cursor-zoom-in group relative mb-3" onClick={() => setLightboxOpen(true)}>
          <img key={galIdx} src={suite.images[galIdx]} alt=""
            className="w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.03]"
            style={{ filter: 'saturate(0.88)' }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="px-6 py-3 border backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <span className="font-sans text-[8px] uppercase tracking-[0.45em] text-white">{t('gallery_enlarge')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-12">
          {[1, 2, 3].map(offset => {
            const i = (galIdx + offset) % suite.images.length;
            return (
              <div key={i} onClick={() => setGalIdx(i)} className="aspect-[16/10] overflow-hidden cursor-pointer group relative">
                <img src={suite.images[i]} alt=""
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06]"
                  style={{ filter: 'grayscale(0.35)', transition: 'filter 0.7s, transform 0.7s' }}
                  onMouseEnter={e => e.currentTarget.style.filter='grayscale(0)'}
                  onMouseLeave={e => e.currentTarget.style.filter='grayscale(0.35)'} />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button onClick={() => setLightboxOpen(true)}
            className="font-sans text-[8.5px] uppercase tracking-[0.5em] py-3 px-8 transition-colors duration-400"
            style={{ color: 'rgba(12,12,10,0.35)', borderBottom: '1px solid rgba(12,12,10,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.color=INK}
            onMouseLeave={e => e.currentTarget.style.color='rgba(12,12,10,0.35)'}>
            {t('gallery_browse')}
          </button>
        </div>
      </section>

      {/* ── RÉSERVATION ── */}
      <section className="max-w-container mx-auto px-8 md:px-14 lg:px-20 py-20 md:py-32">
        <ReservationPanel suite={suite} />
      </section>

      <ContactSection />
    </div>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function SuiteDetailPage({ params }) {
  const { id } = React.use(params);
  const suite  = SUITES[id];
  if (!suite) notFound();

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: GROUND }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-12 animate-pulse" style={{ backgroundColor: 'rgba(61,13,12,0.3)' }} />
          <span className="font-sans text-[8.5px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.3)' }}>
            Chargement
          </span>
        </div>
      </div>
    }>
      <SuiteContent suite={suite} />
    </Suspense>
  );
}