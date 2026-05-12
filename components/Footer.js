'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from '@/lib/useTranslations';

const instagramImages = ['/friends-image.png', '/studio.png', '/hotel.png', '/bg.png'];

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function subscribe(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setEmail('');
      setSent(true);
      setTimeout(() => setSent(false), 6000);
    } catch {}
    finally { setSending(false); }
  }

  const navLinks = [
    { label: t('nav_hebergements'), href: `/${locale}/hebergement` },
    { label: t('nav_reserver'), href: `/${locale}/contact` },
    { label: t('nav_club'), href: `/${locale}/soutenir` },
  ];

  const legalLinks = [
    { label: t('legal'), href: `/${locale}/mentions-legales` },
    { label: t('privacy'), href: `/${locale}/confidentialite` },
  ];

  return (
    <footer className="relative bg-[#0C0C0A] border-t border-[rgba(216,213,205,0.04)]">

      {/* Grain analogique — section Ink */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* ── GRILLE INSTAGRAM ── */}
      <div className="relative z-[2] max-w-container mx-auto px-6 md:px-14 lg:px-20 pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="flex flex-col items-center">

          <Image src="/myra-logo.svg" alt="MYRA" width={96} height={24} style={{ filter: 'brightness(0) invert(1)', height: '24px', width: 'auto' }} className="mb-8 md:mb-12 opacity-50" />

          <p className="font-sans text-[9px] uppercase tracking-[0.55em] text-[rgba(216,213,205,0.25)] mb-8 md:mb-10 text-center">
            {t('tagline')}
          </p>

          <div className="grid grid-cols-4 gap-px w-full">
            {instagramImages.map((src, i) => (
              <a key={i} href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden bg-[rgba(216,213,205,0.03)]">
                <img src={src} alt={`MYRA Society — Instagram ${i + 1}`} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-all duration-[2s] ease-out group-hover:scale-[1.03]"
                  style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.65)' }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(0%) contrast(1.0) brightness(0.85)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(100%) contrast(1.1) brightness(0.65)'} />
              </a>
            ))}
          </div>

          <a href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer" className="group relative mt-6 inline-block pb-1">
            <span className="font-sans text-[8.5px] uppercase tracking-[0.5em] text-[rgba(216,213,205,0.22)] group-hover:text-[rgba(216,213,205,0.65)] transition-colors duration-500">
              @myra.society
            </span>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-[#351421] transition-all duration-700 group-hover:w-full" />
          </a>
        </div>
      </div>

      {/* ── SÉPARATEUR ── */}
      <div className="relative z-[2] max-w-container mx-auto px-6 md:px-14 lg:px-20">
        <div className="w-full h-px bg-[rgba(216,213,205,0.06)]" />
      </div>

      {/* ── NAVIGATION + ADRESSE + NEWSLETTER ── */}
      <div className="relative z-[2] max-w-container mx-auto px-6 md:px-14 lg:px-20 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* Navigation + Adresse mobile */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0">
            <div>
              <h2 className="font-sans text-[9px] uppercase tracking-[0.55em] text-[rgba(70,83,100,0.7)] mb-5 md:mb-8 m-0">
                {t('nav_label')}
              </h2>
              <nav aria-label={t('nav_label')} className="space-y-2 md:space-y-3">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="block py-1 w-fit font-sans text-[11px] md:text-[12px] tracking-[0.10em] font-light uppercase text-[rgba(216,213,205,0.30)] hover:text-[rgba(216,213,205,0.80)] transition-colors duration-500">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Adresse mobile */}
            <div className="md:hidden">
              <h2 className="font-sans text-[9px] uppercase tracking-[0.55em] text-[rgba(70,83,100,0.7)] mb-5 m-0">
                {t('address_label')}
              </h2>
              <address className="not-italic font-sans text-[11px] leading-[2] tracking-[0.04em] text-[rgba(216,213,205,0.30)] uppercase">
                MYRA Marlenheim<br />
                67520 Marlenheim<br />
                Alsace, France
              </address>
              <div className="mt-4 space-y-1.5">
                <a href="tel:+33637038677" className="block font-sans text-[11px] tracking-[0.04em] uppercase text-[rgba(216,213,205,0.30)] hover:text-[rgba(216,213,205,0.70)] transition-colors duration-400">
                  +33 (0)6 37 03 86 77
                </a>
                <a href="mailto:contact@myrasociety.com" className="block font-sans text-[10px] tracking-[0.02em] uppercase text-[rgba(216,213,205,0.30)] hover:text-[rgba(216,213,205,0.70)] transition-colors duration-400">
                  contact@myrasociety.com
                </a>
              </div>
            </div>
          </div>

          {/* Adresse desktop */}
          <div className="hidden md:block md:col-span-3">
            <h2 className="font-sans text-[9px] uppercase tracking-[0.55em] text-[rgba(70,83,100,0.7)] mb-8 m-0">
              {t('address_label')}
            </h2>
            <address className="not-italic font-sans text-[12px] leading-[2] tracking-[0.06em] text-[rgba(216,213,205,0.30)] uppercase">
              MYRA Marlenheim<br />
              71 rue du Général de Gaulle<br />
              67520 Marlenheim<br />
              Alsace, France
            </address>
            <div className="mt-6 space-y-2">
              <a href="tel:+33637038677" className="block font-sans text-[12px] tracking-[0.06em] uppercase text-[rgba(216,213,205,0.30)] hover:text-[rgba(216,213,205,0.70)] transition-colors duration-400">
                +33 (0)6 37 03 86 77
              </a>
              <a href="mailto:contact@myrasociety.com" className="block font-sans text-[11px] tracking-[0.04em] uppercase text-[rgba(216,213,205,0.30)] hover:text-[rgba(216,213,205,0.70)] transition-colors duration-400">
                contact@myrasociety.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-5 md:pl-12 md:border-l border-[rgba(216,213,205,0.06)]">
            <h2 id="footer-newsletter-label" className="font-sans text-[9px] uppercase tracking-[0.55em] text-[rgba(70,83,100,0.7)] mb-5 md:mb-8 m-0">
              {t('newsletter_label')}
            </h2>
            <p className="font-serif italic font-light text-[14px] leading-[1.75] text-[rgba(216,213,205,0.30)] mb-6 md:mb-8 max-w-[280px]">
              {t('newsletter_desc')}
            </p>

            {sent ? (
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[rgba(53,20,33,0.80)]" role="status">
                {t('newsletter_welcome')}
              </p>
            ) : (
              <form onSubmit={subscribe} aria-labelledby="footer-newsletter-label">
                <div className="flex items-center gap-4 pb-3 md:pb-4 border-b border-[rgba(216,213,205,0.10)] focus-within:border-[rgba(53,20,33,0.55)] transition-colors duration-700">
                  <input id="footer-newsletter-email" aria-labelledby="footer-newsletter-label" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t('newsletter_placeholder')} className="flex-1 bg-transparent font-sans text-[11px] tracking-[0.15em] uppercase placeholder:text-[rgba(216,213,205,0.15)] text-[rgba(216,213,205,0.60)] focus:outline-none" />
                  <button type="submit" disabled={sending} aria-label={t('send')} className="flex-shrink-0 text-[rgba(216,213,205,0.20)] hover:text-[#351421] disabled:opacity-20 transition-all duration-500">
                    {sending ? (
                      <span className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── SÉPARATEUR ── */}
      <div className="relative z-[2] max-w-container mx-auto px-6 md:px-14 lg:px-20">
        <div className="w-full h-px bg-[rgba(216,213,205,0.04)]" />
      </div>

      {/* ── BANDE LÉGALE ── */}
      <div className="relative z-[2] max-w-container mx-auto px-6 md:px-14 lg:px-20 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <nav aria-label="Mentions" className="flex items-center gap-6 md:gap-8">
          {legalLinks.map(link => (
            <Link key={link.href} href={link.href} className="font-sans text-[8px] uppercase tracking-[0.40em] text-[rgba(216,213,205,0.18)] hover:text-[rgba(216,213,205,0.55)] transition-colors duration-400">
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="font-sans text-[8px] uppercase tracking-[0.35em] text-[rgba(216,213,205,0.15)]">
          © {new Date().getFullYear()} MYRA Society — {t('rights')}
        </span>
      </div>

    </footer>
  );
}