'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence, useInView, useMotionValue, animate } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '@/lib/useTranslations';
import ContactSection from '../../../../../components/Contact';

const INK  = '#0C0C0A';
const WINE = '#351421';
const BONE = 'rgba(12,12,10,0.06)';
const EXPO = [0.16, 1, 0.3, 1];

const SUITES = {
  'Nova': {
    id: 'Nova', name: 'Nova', surface: '80 m²', guests: 2,
    ouverture: 'Printemps 2026', ambiance: 'Éclat contemporain',
    description: 'Un volume contemporain baigné de lumière. Conçue pour deux, Nova allie minimalisme et chaleur dans un esprit de retraite exclusive.',
    descriptionLong: "Nova est pensée pour ceux qui cherchent l'essentiel — un espace épuré, lumineux, sans superflu. Matières naturelles, lignes sobres, lumière naturelle filtrée. Deux personnes, un seul espace, une présence totale.",
    images: ['/Nova/2.jpg', '/Nova/3.jpg', '/Nova/4.jpg', '/Nova/5.jpg'],
    features: ['Suite double premium', 'Terrasse privée', 'Accès spa & recovery', 'Vue sur les vignes', 'Literie haut de gamme', 'Salle de bain walk-in'],
    floorplan: 'Entrée · Séjour 30 m² · Suite parentale (lit king) · Salle de bain · Terrasse privée 12 m²',
    address: '71 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
    specs: [
      { label: 'Surface', val: '80 m²' },
      { label: 'Capacité', val: '2 personnes' },
      { label: 'Ouverture', val: 'Printemps 2026' },
      { label: 'Style', val: 'Contemporain' },
    ],
  },
  'Opal': {
    id: 'Opal', name: 'Opal', surface: '90 m²', guests: 4,
    ouverture: 'Printemps 2026', ambiance: 'Douceur minérale',
    description: "Douceur minérale et vue imprenable. Opal s'inspire des pierres naturelles d'Alsace pour créer un cocon hors du temps.",
    descriptionLong: "Opal tire son nom des pierres précieuses d'Alsace — une référence à la richesse minérale du territoire. La suite accueille jusqu'à 4 personnes dans un espace généreux où chaque texture rappelle la beauté brute de la région.",
    images: ['/Opal/1.jpg', '/Opal/2.jpg'],
    features: ['Suite familiale', 'Décoration minérale', 'Cuisine équipée', 'Accès spa & recovery', 'Deux chambres', 'Salon ouvert'],
    floorplan: 'Entrée · Salon 35 m² · Cuisine équipée · Chambre 1 (lit king) · Chambre 2 (lits jumeaux) · Salle de bain · WC',
    address: '71 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
    specs: [
      { label: 'Surface', val: '90 m²' },
      { label: 'Capacité', val: '4 personnes' },
      { label: 'Ouverture', val: 'Printemps 2026' },
      { label: 'Style', val: 'Minéral' },
    ],
  },
  'Asta': {
    id: 'Asta', name: 'Asta', surface: '170 m²', guests: 8,
    ouverture: 'Été 2026', ambiance: 'Héritage & modernité',
    description: "La plus grande suite du domaine. Asta est conçue pour les groupes et les familles qui souhaitent partager un espace d'exception sans compromis.",
    descriptionLong: "Asta, du vieux norrois signifiant « divin », est la suite de référence du domaine. 170 m² pensés pour accueillir jusqu'à 8 personnes dans un luxe discret. Un espace partagé sans concessions, pour les séjours qui deviennent des souvenirs.",
    images: ['/Asta/1.jpg'],
    features: ['Suite de groupe', '170 m² de surface', 'Salon commun', 'Cuisine ouverte', 'Accès privatif spa', '4 chambres', 'Terrasse panoramique'],
    floorplan: 'Entrée · Grand salon 60 m² · Cuisine ouverte · 4 chambres · 3 salles de bain · WC · Terrasse panoramique 40 m²',
    address: '71 rue du Général de Gaulle\n67520 Marlenheim\nAlsace, France',
    specs: [
      { label: 'Surface', val: '170 m²' },
      { label: 'Capacité', val: '8 personnes' },
      { label: 'Ouverture', val: 'Été 2026' },
      { label: 'Style', val: 'Héritage' },
    ],
  },
};

function R({ children, d = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const io  = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={io ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.6, ease: EXPO, delay: d }}>
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

// ─── GALERIE EQUINOX ──────────────────────────────────────────────────────────
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

// ─── ACCORDÉON ────────────────────────────────────────────────────────────────
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${BONE}` }}>
          <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between py-5 text-left outline-none">
            <span className="font-sans text-[10px] uppercase tracking-[0.45em] transition-colors duration-500"
              style={{ color: open===i ? INK : 'rgba(12,12,10,0.38)' }}>{item.label}</span>
            <div className="relative w-4 h-4 flex-shrink-0 ml-6">
              <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ backgroundColor: 'rgba(12,12,10,0.2)' }} />
              <motion.span className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2"
                style={{ backgroundColor: 'rgba(12,12,10,0.2)' }}
                animate={{ opacity: open===i ? 0 : 1 }} transition={{ duration: 0.25 }} />
            </div>
          </button>
          <motion.div initial={false}
            animate={{ height: open===i ? 'auto' : 0, opacity: open===i ? 1 : 0 }}
            transition={{ duration: 0.55, ease: EXPO }} style={{ overflow: 'hidden' }}>
            <div className="pb-6">{item.content}</div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── FORMULAIRE INTÉRÊT ───────────────────────────────────────────────────────
function InterestForm({ suite, onClose }) {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [focused, setFocused] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subject: `Intérêt — Suite ${suite.name}`,
          message: `Suite : ${suite.name}\nOuverture : ${suite.ouverture}\n\n${form.message}`,
        }),
      });
      setSent(true);
    } catch {} finally { setSending(false); }
  }

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ backgroundColor: 'rgba(12,12,10,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div className="w-full md:max-w-lg bg-[#F4F5F0] p-8 md:p-12"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: EXPO }}
        onClick={e => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} />
                  <Cap accent>Manifester mon intérêt</Cap>
                </div>
                <h3 className="font-serif font-light italic" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: INK }}>
                  Suite {suite.name}
                </h3>
                <p className="font-sans text-[9px] uppercase tracking-[0.40em] mt-1"
                  style={{ color: 'rgba(12,12,10,0.35)' }}>
                  {suite.ouverture} · {suite.surface} · {suite.guests} pers. max
                </p>
              </div>
              <button onClick={onClose} className="outline-none mt-1"
                style={{ color: 'rgba(12,12,10,0.30)' }}
                onMouseEnter={e => e.currentTarget.style.color = INK}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(12,12,10,0.30)'}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={submit} className="space-y-6">
              {[
                { key: 'name',    label: 'Nom',     type: 'text',  placeholder: 'Votre nom' },
                { key: 'email',   label: 'Email',   type: 'email', placeholder: 'votre@email.com' },
                { key: 'message', label: 'Message', type: 'area',  placeholder: 'Dates envisagées, questions...' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} className="space-y-2">
                  <label className="block font-sans text-[9px] uppercase tracking-[0.50em]"
                    style={{ color: 'rgba(12,12,10,0.30)' }}>{label}</label>
                  {type === 'area' ? (
                    <textarea required rows={3} value={form[key]} onChange={set(key)}
                      onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                      placeholder={placeholder}
                      className="w-full bg-transparent border-b pb-2 font-sans text-[13px] text-[#0C0C0A] placeholder:text-[rgba(12,12,10,0.18)] focus:outline-none transition-colors duration-500 resize-none"
                      style={{ borderColor: focused === key ? WINE : 'rgba(12,12,10,0.12)' }} />
                  ) : (
                    <input type={type} required value={form[key]} onChange={set(key)}
                      onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                      placeholder={placeholder}
                      className="w-full bg-transparent border-b pb-2 font-sans text-[13px] text-[#0C0C0A] placeholder:text-[rgba(12,12,10,0.18)] focus:outline-none transition-colors duration-500"
                      style={{ borderColor: focused === key ? WINE : 'rgba(12,12,10,0.12)' }} />
                  )}
                </div>
              ))}
              <button type="submit" disabled={sending}
                className="w-full py-4 font-sans text-[10px] uppercase tracking-[0.55em] transition-all duration-500 disabled:opacity-40"
                style={{ backgroundColor: INK, color: '#F4F5F0' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = WINE}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = INK}>
                {sending ? 'Envoi…' : 'Envoyer ma demande'}
              </button>
            </form>
          </>
        ) : (
          <motion.div className="text-center py-8 space-y-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-8 h-px mx-auto" style={{ backgroundColor: WINE, opacity: 0.5 }} />
            <p className="font-serif font-light italic" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: INK }}>
              Merci pour votre intérêt.
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.40em]"
              style={{ color: 'rgba(53,20,33,0.50)' }}>
              Nous vous contacterons à l'ouverture des réservations.
            </p>
            <button onClick={onClose}
              className="mt-4 font-sans text-[9px] uppercase tracking-[0.45em] pb-1"
              style={{ color: 'rgba(12,12,10,0.35)', borderBottom: '1px solid rgba(12,12,10,0.15)' }}>
              Fermer
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── PAGE SUITE ───────────────────────────────────────────────────────────────
function SuiteContent({ suite }) {
  const locale = useLocale();
  const [formOpen, setFormOpen] = useState(false);

  const accordionItems = [
    {
      label: 'Équipements',
      content: (
        <ul className="space-y-3">
          {suite.features.map((f, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-[9px] w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(53,20,33,0.40)' }} />
              <span className="font-serif text-[14px] leading-[1.75] italic" style={{ color: 'rgba(12,12,10,0.55)' }}>{f}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Plan',
      content: (
        <p className="font-serif text-[14px] leading-[1.9] italic" style={{ color: 'rgba(12,12,10,0.5)' }}>
          {suite.floorplan}
        </p>
      ),
    },
    {
      label: 'Adresse',
      content: (
        <p className="font-serif text-[14px] leading-[2] italic whitespace-pre-line" style={{ color: 'rgba(12,12,10,0.5)' }}>
          {suite.address}
        </p>
      ),
    },
  ];

  return (
    <motion.div className="min-h-screen bg-[#F4F5F0]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EXPO }}>

      <AnimatePresence>
        {formOpen && <InterestForm suite={suite} onClose={() => setFormOpen(false)} />}
      </AnimatePresence>

      {/* ── ENTÊTE ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 pt-24 md:pt-36 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-end">
          <div>
            <div className="flex items-center gap-3 font-sans text-[8px] uppercase tracking-[0.5em] mb-8"
              style={{ color: 'rgba(12,12,10,0.28)' }}>
              <Link href={`/${locale}/hebergement`}
                className="transition-colors duration-400"
                onMouseEnter={e => e.currentTarget.style.color=INK}
                onMouseLeave={e => e.currentTarget.style.color='rgba(12,12,10,0.28)'}>
                Hébergement
              </Link>
              <span style={{ color: 'rgba(12,12,10,0.15)' }}>·</span>
              <span>{suite.name}</span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.5 }} />
              <span className="font-sans text-[9px] uppercase tracking-[0.50em]"
                style={{ color: 'rgba(53,20,33,0.65)' }}>{suite.ouverture}</span>
            </div>

            <h1 className="font-serif font-light leading-[0.88] tracking-[-0.03em] mb-5"
              style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: INK }}>
              {suite.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4" style={{ color: 'rgba(12,12,10,0.30)' }}>
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.surface}</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.12)' }} />
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.guests} personnes max</span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.12)' }} />
              <span className="font-sans text-[9px] uppercase tracking-[0.45em]">{suite.ambiance}</span>
            </div>
          </div>
          <div>
            <p className="font-serif text-[16px] md:text-[18px] leading-[1.78] italic"
              style={{ color: 'rgba(12,12,10,0.55)' }}>
              {suite.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section className="pb-8 md:pb-14">
        <EquinoxGallery images={suite.images} name={suite.name} />
      </section>

      {/* ── DESCRIPTION + SPECS côte à côte ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <R>
            <p className="font-serif font-light italic leading-[1.85]"
              style={{ fontSize: '17px', color: 'rgba(12,12,10,0.52)' }}>
              {suite.descriptionLong}
            </p>
          </R>
          {/* Specs toujours visibles à droite */}
          <R d={0.1}>
            <div>
              {suite.specs.map((s, i) => (
                <div key={i} className="flex items-baseline justify-between py-4"
                  style={{ borderBottom: '1px solid rgba(12,12,10,0.05)' }}>
                  <span className="font-sans text-[9px] uppercase tracking-[0.45em]"
                    style={{ color: 'rgba(12,12,10,0.25)' }}>{s.label}</span>
                  <span className="font-serif font-light"
                    style={{ fontSize: '18px', color: INK }}>{s.val}</span>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ── ACCORDÉON : équipements + plan + adresse ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 pb-12 md:pb-20">
        <Accordion items={accordionItems} />
      </section>

      {/* ── RÉSERVATION PRIORITAIRE ── */}
      <section style={{ backgroundColor: INK }}>
        <div className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-16 md:py-28">

          <div className="flex items-center gap-5 mb-10 md:mb-14">
            <div className="h-px w-8" style={{ backgroundColor: WINE }} />
            <span className="font-sans text-[11px] uppercase tracking-[0.65em] text-white/40">
              Réservation prioritaire
            </span>
          </div>

          {/* Carte blanche */}
          <div className="bg-white" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* GAUCHE — infos suite */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between"
                style={{ borderBottom: '1px solid rgba(12,12,10,0.06)' }}>
                <div>
                  {/* Titre suite */}
                  <div className="mb-10 pb-8" style={{ borderBottom: '1px solid rgba(12,12,10,0.06)' }}>
                    <p className="font-sans text-[9px] uppercase tracking-[0.50em] mb-3"
                      style={{ color: 'rgba(12,12,10,0.28)' }}>Suite à venir</p>
                    <h2 className="font-serif font-light italic leading-none mb-2"
                      style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: INK }}>
                      {suite.name}
                    </h2>
                    <p className="font-sans text-[9px] uppercase tracking-[0.40em]"
                      style={{ color: 'rgba(53,20,33,0.55)' }}>
                      {suite.ouverture}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-0 mb-10">
                    {suite.specs.map((s, i) => (
                      <div key={i} className="flex items-baseline justify-between py-4"
                        style={{ borderBottom: '1px solid rgba(12,12,10,0.05)' }}>
                        <span className="font-sans text-[9px] uppercase tracking-[0.40em]"
                          style={{ color: 'rgba(12,12,10,0.28)' }}>{s.label}</span>
                        <span className="font-serif font-light"
                          style={{ fontSize: '17px', color: INK }}>{s.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="font-serif font-light italic leading-[1.8]"
                    style={{ fontSize: '15px', color: 'rgba(12,12,10,0.45)' }}>
                    Soyez parmi les premiers informés à l'ouverture des réservations pour la suite {suite.name}.
                  </p>
                </div>
              </div>

              {/* DROITE — CTA */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-[#F9F8F6]">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                    <span className="font-sans text-[9px] uppercase tracking-[0.50em]"
                      style={{ color: 'rgba(53,20,33,0.55)' }}>Accès prioritaire</span>
                  </div>
                  <h3 className="font-serif font-light italic leading-[0.95] mb-6"
                    style={{ fontSize: 'clamp(26px, 3vw, 42px)', color: INK }}>
                    Être informé en premier
                  </h3>
                  <p className="font-sans text-[12px] leading-[2] font-light mb-10"
                    style={{ color: 'rgba(12,12,10,0.42)' }}>
                    Manifestez votre intérêt pour bénéficier d'un accès prioritaire dès l'ouverture des réservations. Aucun engagement requis.
                  </p>

                  {/* Features courtes */}
                  <div className="space-y-3 mb-10">
                    {['Notification en avant-première', 'Tarif de lancement', 'Assistance personnalisée'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-px flex-shrink-0" style={{ backgroundColor: WINE, opacity: 0.4 }} />
                        <span className="font-sans text-[10px] uppercase tracking-[0.30em]"
                          style={{ color: 'rgba(12,12,10,0.40)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setFormOpen(true)}
                  className="w-full py-5 font-sans text-[10px] uppercase tracking-[0.55em] transition-all duration-500"
                  style={{ backgroundColor: INK, color: '#F4F5F0' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = WINE}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = INK}>
                  Je manifeste mon intérêt
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── AUTRES SUITES ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 py-16 md:py-24">
        <R>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
            <Cap accent>Autres suites à venir</Cap>
          </div>
        </R>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(SUITES).filter(s => s.id !== suite.id).map((s, i) => (
            <R key={s.id} d={i * 0.08}>
              <Link href={`/${locale}/hebergement/prochainement/${s.id}`}
                className="group block" style={{ borderTop: '1px solid rgba(12,12,10,0.06)' }}>
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '16/10' }}>
                  <img src={s.images[0]} alt={s.name}
                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-[1.03]"
                    style={{ filter: 'saturate(0.75)' }} />
                  <div className="absolute inset-0 bg-[rgba(12,12,10,0)] group-hover:bg-[rgba(12,12,10,0.12)] transition-all duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="font-sans text-[8px] uppercase tracking-[0.40em] px-2 py-1"
                      style={{ backgroundColor: 'rgba(12,12,10,0.55)', color: 'rgba(244,245,240,0.65)' }}>
                      {s.ouverture}
                    </span>
                  </div>
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
                        style={{ color: 'rgba(12,12,10,0.30)' }}>{s.ambiance}</span>
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
              </Link>
            </R>
          ))}
        </div>
      </section>

      <ContactSection />
    </motion.div>
  );
}

export default function SuiteProchainementPage({ params }) {
  const { id } = React.use(params);
  const suite  = SUITES[id];
  if (!suite) notFound();
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F4F5F0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-12 animate-pulse" style={{ backgroundColor: 'rgba(53,20,33,0.3)' }} />
          <span className="font-sans text-[8.5px] uppercase tracking-[0.55em]" style={{ color: 'rgba(12,12,10,0.3)' }}>Chargement</span>
        </div>
      </div>
    }>
      <SuiteContent suite={suite} />
    </Suspense>
  );
}