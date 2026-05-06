'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const instagramImages = ['/friends-image.png', '/studio.png', '/hotel.png', '/bg.png'];

export default function Footer() {
  const t      = useTranslations('footer');
  const locale = useLocale();
  const [email,   setEmail]   = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

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
    } catch {} finally { setSending(false); }
  }

  const navLinks = [
    { label: t('nav_hebergements'), href: `/${locale}/hebergement` },
    { label: t('nav_reserver'),     href: `/${locale}/contact` },
    { label: t('nav_club'),         href: `/${locale}/soutenir` },
  ];

  const legalLinks = [
    { label: t('legal'),   href: `/${locale}/mentions-legales` },
    { label: t('privacy'), href: `/${locale}/confidentialite` },
  ];

  return (
    <footer className="bg-[#F3F2EF] border-t border-[rgba(12,12,10,0.05)]">

      {/* ── GRILLE INSTAGRAM ── */}
      <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20 pt-24 pb-20">
        <div className="flex flex-col items-center">
          <img src="/myra-logo.svg" alt="MYRA" className="h-6 w-auto mb-12 opacity-60" />
          <p className="text-[9px] uppercase tracking-[0.55em] text-[rgba(12,12,10,0.30)] mb-10">
            {t('tagline')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 w-full">
            {instagramImages.map((src, i) => (
              <a key={i} href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer"
                className="group relative aspect-[4/5] overflow-hidden bg-[rgba(12,12,10,0.04)]">
                <img src={src} alt={`MYRA Society — ${i + 1}`}
                  className="w-full h-full object-cover grayscale brightness-90 transition-all duration-[2s] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.03]" />
              </a>
            ))}
          </div>
          <a href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer"
            className="group relative mt-8 inline-block pb-1">
            <span className="text-[8.5px] uppercase tracking-[0.5em] text-[rgba(12,12,10,0.25)] group-hover:text-[rgba(12,12,10,0.65)] transition-colors duration-500">
              @myra.society
            </span>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-[#2B1022] transition-all duration-700 group-hover:w-full" />
          </a>
        </div>
      </div>

      <div className="border-t border-[rgba(12,12,10,0.05)]" />

      {/* ── NAVIGATION + ADRESSE + NEWSLETTER ── */}
      <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

          {/* Navigation */}
          <div className="md:col-span-4">
            <p className="text-[9px] uppercase tracking-[0.55em] text-[rgba(12,12,10,0.25)] mb-8">{t('nav_label')}</p>
            <nav className="space-y-3">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="group block py-1 w-fit text-[12px] tracking-[0.10em] font-light uppercase text-[rgba(12,12,10,0.40)] hover:text-[rgba(12,12,10,0.80)] transition-colors duration-500">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Adresse */}
          <div className="md:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.55em] text-[rgba(12,12,10,0.25)] mb-8">{t('address_label')}</p>
            <address className="not-italic text-[12px] leading-[2] tracking-[0.06em] text-[rgba(12,12,10,0.40)] uppercase">
              MYRA Marlenheim<br />
              71 rue du Général de Gaulle<br />
              67520 Marlenheim<br />
              Alsace, France
            </address>
            <div className="mt-6 space-y-2">
              <a href="tel:+33637038677" className="block text-[12px] tracking-[0.06em] uppercase text-[rgba(12,12,10,0.40)] hover:text-[rgba(12,12,10,0.75)] transition-colors duration-400">
                +33 (0)6 37 03 86 77
              </a>
              <a href="mailto:contact@myrasociety.com" className="block text-[11px] tracking-[0.04em] uppercase text-[rgba(12,12,10,0.40)] hover:text-[rgba(12,12,10,0.75)] transition-colors duration-400">
                contact@myrasociety.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-5 md:pl-12 md:border-l border-[rgba(12,12,10,0.05)]">
            <p className="text-[9px] uppercase tracking-[0.55em] text-[rgba(12,12,10,0.25)] mb-8">{t('newsletter_label')}</p>
            <p className="text-[13px] leading-[1.75] font-light text-[rgba(12,12,10,0.40)] mb-8 max-w-[280px]">
              {t('newsletter_desc')}
            </p>
            {sent ? (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[rgba(43,16,34,0.60)]">{t('newsletter_welcome')}</p>
            ) : (
              <form onSubmit={subscribe}>
                <div className="flex items-center gap-4 pb-4 border-b border-[rgba(12,12,10,0.10)] focus-within:border-[rgba(43,16,34,0.40)] transition-colors duration-700">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={t('newsletter_placeholder')}
                    className="flex-1 bg-transparent text-[11px] tracking-[0.15em] uppercase placeholder:text-[rgba(12,12,10,0.20)] text-[rgba(12,12,10,0.65)] focus:outline-none" />
                  <button type="submit" disabled={sending} aria-label={t('send')}
                    className="flex-shrink-0 text-[rgba(12,12,10,0.20)] hover:text-[#2B1022] hover:translate-x-0.5 disabled:opacity-20 transition-all duration-500">
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

      <div className="border-t border-[rgba(12,12,10,0.05)]" />

      {/* ── BANDE LÉGALE ── */}
      <div className="bg-[#0C0C0A]">
        <div className="max-w-container mx-auto px-8 md:px-14 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <nav className="flex items-center gap-8">
            {legalLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-[8px] uppercase tracking-[0.40em] text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.65)] transition-colors duration-400">
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="text-[8px] uppercase tracking-[0.35em] text-[rgba(255,255,255,0.18)]">
            © {new Date().getFullYear()} MYRA Society — {t('rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}