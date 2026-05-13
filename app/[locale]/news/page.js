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
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y, filter: reduced ? 'blur(0px)' : 'blur(4px)' }}
      animate={io ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, ease: EXPO, delay: d }}>
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

      {/* ── HERO COMPACT ── */}
      <section aria-labelledby="news-title" className="max-w-container mx-auto px-6 md:px-14 lg:px-20 pt-28 md:pt-40 pb-12 md:pb-20">
        <R>
          <div className="flex items-center gap-3 mb-6 md:mb-10">
            <div className="w-4 h-px" style={{ backgroundColor: WINE, opacity: 0.4 }} />
            <span className="font-sans text-[11px] tracking-[0.55em] uppercase" style={{ color: WINE }}>
              MYRA · Journal
            </span>
          </div>
          <h1 id="news-title" className="font-serif font-light leading-[0.92] tracking-[-0.02em] text-[#0C0C0A] m-0"
            style={{ fontSize: 'clamp(48px, 7vw, 100px)' }}>
            {t('label')}
          </h1>
          <p className="font-serif italic font-light mt-4 md:mt-6"
            style={{ fontSize: 'clamp(16px, 1.6vw, 22px)', color: 'rgba(12,12,10,0.40)' }}>
            {t('tagline')}
          </p>
        </R>
      </section>

      {/* ── GRILLE ARTICLES ── */}
      <section className="max-w-container mx-auto px-6 md:px-14 lg:px-20 pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-10 md:gap-y-20">
          {ARTICLES.map((a, i) => (
            <R key={a.id} d={i * 0.1}>
              <article aria-labelledby={`article-${a.id}-title`}>
                <Link href={`/${locale}/news/${a.slug}`} className="group block">
                  <div className="relative overflow-hidden mb-5 md:mb-7" style={{ aspectRatio: '4/3' }}>
                    <img src={a.image} alt={a.title} loading="lazy" decoding="async"
                      className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-[1.03]"
                      style={{ filter: 'saturate(0.85) brightness(0.92) contrast(1.04)' }} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sans text-[9px] uppercase tracking-[0.45em]" style={{ color: 'rgba(12,12,10,0.30)' }}>
                      {a.date}
                    </span>
                    <span className="w-px h-3" style={{ backgroundColor: 'rgba(12,12,10,0.12)' }} />
                    <span className="font-sans text-[9px] uppercase tracking-[0.45em]" style={{ color: WINE, opacity: 0.65 }}>
                      {a.category}
                    </span>
                  </div>
                  <h2 id={`article-${a.id}-title`} className="font-serif font-light italic leading-[1.05] tracking-[-0.01em] mb-3"
                    style={{ fontSize: 'clamp(24px, 2.6vw, 38px)', color: INK }}>
                    {a.title}
                  </h2>
                  <p className="font-sans font-light leading-[1.85]"
                    style={{ fontSize: '14px', color: 'rgba(12,12,10,0.50)' }}>
                    {a.excerpt}
                  </p>
                </Link>
              </article>
            </R>
          ))}
        </div>
      </section>
    </main>
  );
}
