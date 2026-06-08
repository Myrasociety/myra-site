'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useTranslations, useLocale } from '@/lib/useTranslations';

const INK  = '#0C0C0A';
const WINE = '#351421';
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

function R({ children, d = 0, y = 32, className = '' }) {
  const ref = useRef(null);
  const io  = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotionSafe();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0 }}
      animate={io ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: EXPO, delay: d }}>
      {children}
    </motion.div>
  );
}

// Articles in-code constants (placeholders). À remplacer par du copy réel ensuite.
const ARTICLES = [
  {
    id: 'i',
    slug: 'notes-i',
    date: '2026 · 05',
    category: 'Construction',
    title: 'Notes I',
    excerpt: 'Le premier domaine prend forme à Marlenheim.',
    image: '/Complexe/3.jpg',
  },
  {
    id: 'ii',
    slug: 'notes-ii',
    date: '2026 · 04',
    category: 'Brand',
    title: 'Notes II',
    excerpt: "L'art de recevoir le corps.",
    image: '/DA/Nouveau.png',
  },
];

export default function NewsPage() {
  const t = useTranslations('news');
  const locale = useLocale();

  return (
    <main className="bg-[#F4F5F0] min-h-screen">

      {/* ── HERO ÉDITORIAL ── */}
      <section aria-labelledby="news-title" className="max-w-container mx-auto px-6 md:px-0 pt-32 md:pt-52 pb-16 md:pb-28">
        <R>
          <div className="flex items-center gap-4 mb-8 md:mb-14">
            <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
            <span className="font-sans uppercase m-0"
              style={{ fontSize: '11px', letterSpacing: '0.55em', color: WINE }}>
              MYRA · Journal
            </span>
          </div>
          <h1 id="news-title" className="font-serif font-light leading-[0.95] tracking-[-0.02em] text-[#0C0C0A] m-0"
            style={{ fontSize: 'clamp(48px, 6vw, 104px)' }}>
            {t('label')}
          </h1>
          <p className="font-sans font-light italic mt-5 md:mt-8 max-w-xl m-0"
            style={{ fontSize: 'clamp(16px, 1.5vw, 22px)', lineHeight: 1.4, color: 'rgba(12,12,10,0.45)' }}>
            {t('tagline')}
          </p>
        </R>
      </section>

      {/* ── ARTICLES — magazine spread alterné ── */}
      <section className="max-w-container mx-auto px-6 md:px-0 pb-24 md:pb-44">
        {/* Header séparateur */}
        <div className="flex items-end justify-between mb-16 md:mb-24 pb-6 md:pb-8 border-b border-[rgba(12,12,10,0.08)]">
          <span className="font-sans uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.55em', color: WINE }}>
            Notes récentes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-light italic"
              style={{ fontSize: '17px', color: 'rgba(12,12,10,0.55)', lineHeight: 1 }}>
              {String(ARTICLES.length).padStart(2, '0')}
            </span>
            <span className="font-sans uppercase"
              style={{ fontSize: '9px', letterSpacing: '0.45em', color: 'rgba(12,12,10,0.32)' }}>
              {ARTICLES.length > 1 ? 'notes' : 'note'}
            </span>
          </div>
        </div>

        {/* Spreads : chaque article = une ligne entière, image + content côte à côte, alternance gauche/droite */}
        <div className="space-y-20 md:space-y-36">
          {ARTICLES.map((a, i) => {
            const reverse = i % 2 === 1;
            return (
              <R key={a.id}>
                <article aria-labelledby={`article-${a.id}-title`} className="group">
                  <Link href={`/${locale}/news/${a.slug}`} className="block">
                    <div className="grid grid-cols-12 gap-8 md:gap-14 items-center">
                      {/* Image */}
                      <div className={`col-span-12 md:col-span-7 img-zoom overflow-hidden ${reverse ? 'md:order-2 md:col-start-6' : ''}`}
                        style={{ aspectRatio: '14/9' }}>
                        <img src={a.image} alt={a.title}
                          loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                          className="w-full h-full object-cover"
                          style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }} />
                      </div>

                      {/* Content */}
                      <div className={`col-span-12 md:col-span-4 ${reverse ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`}>
                        {/* Numéro */}
                        <span className="block font-serif font-light italic mb-5 md:mb-7"
                          style={{ fontSize: '15px', color: 'rgba(12,12,10,0.32)' }}>
                          /{String(i + 1).padStart(2, '0')}
                        </span>
                        {/* Date + category */}
                        <div className="flex items-center gap-3 mb-5">
                          <span className="font-sans uppercase"
                            style={{ fontSize: '10px', letterSpacing: '0.45em', color: 'rgba(12,12,10,0.40)' }}>
                            {a.date}
                          </span>
                          <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.15)' }} />
                          <span className="font-sans uppercase"
                            style={{ fontSize: '10px', letterSpacing: '0.45em', color: WINE, opacity: 0.72 }}>
                            {a.category}
                          </span>
                        </div>
                        {/* Titre */}
                        <h2 id={`article-${a.id}-title`} className="font-serif font-light italic leading-[1.0] tracking-[-0.01em] mb-5 md:mb-7 m-0"
                          style={{ fontSize: 'clamp(28px, 3.4vw, 48px)', color: INK }}>
                          {a.title}
                        </h2>
                        {/* Excerpt */}
                        <p className="font-sans font-light m-0 mb-7 md:mb-9"
                          style={{ fontSize: '14px', lineHeight: 2.0, color: 'rgba(12,12,10,0.55)' }}>
                          {a.excerpt}
                        </p>
                        {/* CTA */}
                        <div className="inline-flex items-center gap-3 relative pb-1">
                          <span className="font-sans uppercase transition-colors duration-400"
                            style={{ fontSize: '10px', letterSpacing: '0.45em', color: WINE }}>
                            Lire la note
                          </span>
                          <svg width="12" height="12" fill="none" stroke={WINE} strokeWidth="1.5" viewBox="0 0 24 24"
                            className="transition-transform duration-400 group-hover:translate-x-1">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                          </svg>
                          <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                            style={{ backgroundColor: WINE }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </R>
            );
          })}
        </div>
      </section>
    </main>
  );
}
