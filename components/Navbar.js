'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from '@/lib/useTranslations';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');

  const HERO_PAGES = [
    `/${locale}`,
    `/${locale}/hebergement`,
    `/${locale}/soutenir`,
  ];

  const hasHero = HERO_PAGES.some(p => pathname === p) && !pathname.includes('/hebergement/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const update = () => setTime(
      new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
    );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const switchLocale = (l) => router.push(pathname.replace(`/${locale}`, `/${l}`));
  const isActive = (href) => pathname === `/${locale}${href}` || pathname === href;

  const isSolid = !hasHero || scrolled || menuOpen;
  const bgStyle = isSolid
    ? 'bg-[#0C0C0A] border-b border-white/[0.05] py-4'
    : 'bg-transparent py-6';

  const textCol = 'rgba(255,255,255,0.60)';
  const textAct = '#FFFFFF';

  const NAV_LINKS = [
    { label: t('hebergements'), href: '/hebergement' },
    { label: t('reserver'),     href: '/contact' },
    { label: t('club'),         href: '/soutenir' },
  ];

  const IconInstagram = ({ size = 14 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );

  const IconLinkedin = ({ size = 14 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${bgStyle}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* GAUCHE — Nav desktop */}
          <nav className="hidden md:flex gap-10">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={`/${locale}${href}`}
                  className="group relative font-sans text-[9px] tracking-[0.25em] uppercase transition-colors duration-400"
                  style={{ color: active ? textAct : textCol }}>
                  {label}
                  <span className={`absolute -bottom-1.5 left-0 h-px transition-all duration-500 bg-[#2B1022] ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          {/* CENTRE — Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href={`/${locale}`} aria-label="MYRA Society">
              <img src="/myra-logo.svg" alt="MYRA"
                className="h-4 w-auto transition-all duration-500 hover:opacity-60"
                style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
          </div>

          {/* DROITE */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* Heure desktop */}
            <div className="hidden md:flex items-center gap-4 font-sans text-[8px] tracking-[0.18em] uppercase text-white/30">
              <span>Marlenheim, FR</span>
              <div className="w-px h-3 bg-white/10" />
              <span className="tabular-nums text-white/60">{time}</span>
            </div>

            {/* Langues desktop */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
              {['fr', 'en', 'de'].map(l => (
                <button key={l} onClick={() => switchLocale(l)}
                  className="font-sans text-[8px] uppercase tracking-[0.30em] transition-colors duration-300"
                  style={{ color: locale === l ? '#FFFFFF' : 'rgba(255,255,255,0.25)' }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Socials desktop */}
            <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10">
              <a href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors duration-400">
                <IconInstagram size={14} />
              </a>
              <a href="https://www.linkedin.com/company/myra-society" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors duration-400">
                <IconLinkedin size={14} />
              </a>
            </div>

            {/* Burger mobile */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-[5px] p-1 outline-none"
              aria-label={menuOpen ? 'Fermer' : 'Menu'}>
              {[0, 1, 2].map(i => (
                <span key={i} className="block w-5 h-px bg-[#F3F2EF] transition-all duration-400"
                  style={{
                    transform: menuOpen
                      ? (i === 0 ? 'rotate(45deg) translateY(6px)' : i === 2 ? 'rotate(-45deg) translateY(-6px)' : 'scaleX(0)')
                      : 'none',
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE — plein écran amélioré */}
      <div className={`fixed inset-0 z-[99] bg-[#0C0C0A] flex flex-col transition-all duration-700 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

        {/* Liens navigation — centrés verticalement */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0">
          {NAV_LINKS.map(({ label, href }, i) => (
            <Link key={href} href={`/${locale}${href}`}
              className="group relative py-5 font-serif text-[28px] font-light italic transition-colors duration-500"
              style={{
                color: isActive(href) ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                transitionDelay: menuOpen ? `${i * 80}ms` : '0ms',
              }}>
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-0 left-0 h-px w-full" style={{ backgroundColor: '#2B1022', opacity: 0.6 }} />
              )}
            </Link>
          ))}
        </div>

        {/* Bas du menu — langues + socials + adresse */}
        <div className="px-8 pb-14 space-y-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Socials + Langues */}
          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/myra.society" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors duration-400">
                <IconInstagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/myra-society" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 transition-colors duration-400">
                <IconLinkedin size={18} />
              </a>
            </div>
            <div className="flex items-center gap-5">
              {['fr', 'en', 'de'].map(l => (
                <button key={l} onClick={() => { switchLocale(l); setMenuOpen(false); }}
                  className="font-sans text-[9px] uppercase tracking-[0.40em] transition-colors duration-300"
                  style={{ color: locale === l ? '#F3F2EF' : 'rgba(244,245,240,0.22)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Adresse + contact */}
          <div className="flex items-end justify-between">
            <div>
              <p className="font-sans text-[8px] uppercase tracking-[0.45em] mb-2"
                style={{ color: 'rgba(255,255,255,0.18)' }}>
                Marlenheim, Alsace
              </p>
              <a href="tel:+33637038677"
                className="font-sans text-[9px] uppercase tracking-[0.25em]"
                style={{ color: 'rgba(255,255,255,0.30)' }}>
                +33 (0)6 37 03 86 77
              </a>
            </div>
            <span className="font-sans text-[8px] uppercase tracking-[0.35em] tabular-nums"
              style={{ color: 'rgba(255,255,255,0.20)' }}>
              {time}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}