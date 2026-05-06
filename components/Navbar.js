'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from '@/lib/useTranslations';

export default function Navbar() {
  const [time,       setTime]       = useState('');
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [isHero,     setIsHero]     = useState(true);

  const pathname = usePathname();
  const router   = useRouter();
  const locale   = useLocale();
  const t        = useTranslations('nav');

  // Pages avec hero sombre (la navbar démarre transparente)
  const HERO_PAGES = [
    `/${locale}`,
    `/${locale}/hebergement`,
    `/${locale}/soutenir`,
    `/${locale}/contact`,
  ];
  const hasHero = HERO_PAGES.some(p => pathname === p) || /\/hebergement\/\w+/.test(pathname);

  // Scroll — seuil 80px pour dépasser le hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Heure Paris
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

  // Logique de style :
  // - Sur une page hero + non scrollé → transparent, texte blanc, logo blanc
  // - Dès scroll (ou page sans hero) → fond blanc, texte noir, logo noir
  const transparent = hasHero && !scrolled && !menuOpen;

  const bg       = transparent ? 'bg-transparent'                                            : 'bg-[#0C0C0A] border-b border-[rgba(255,255,255,0.05)]';
const textCol  = transparent ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.50)';
const textAct  = transparent ? '#FFFFFF'                : '#FFFFFF';
const logoFil  = 'brightness(0) invert(1)';
  const langCol  = (l) => locale === l
? '#FFFFFF'
: 'rgba(255,255,255,0.28)';

  const NAV_LINKS = [
    { label: t('hebergements'), href: '/hebergement' },
    { label: t('reserver'),     href: '/contact' },
    { label: t('club'),         href: '/soutenir' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${bg} ${scrolled ? 'py-4' : 'py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 flex justify-between items-center">

          {/* GAUCHE — Nav desktop */}
          <nav className="hidden md:flex gap-10">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={`/${locale}${href}`}
                  className="group relative font-sans text-[9px] tracking-[0.25em] uppercase transition-colors duration-400"
                  style={{ color: active ? textAct : textCol }}
                  onMouseEnter={e => e.currentTarget.style.color = textAct}
                  onMouseLeave={e => e.currentTarget.style.color = active ? textAct : textCol}>
                  {label}
                  {/* Soulignement bordeaux */}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#2B1022] transition-all duration-500 group-hover:w-full" />
                 {active && <span className="absolute -bottom-1.5 left-0 h-px w-full bg-[#2B1022]" />}
                </Link>
              );
            })}
          </nav>

          {/* CENTRE — Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href={`/${locale}`} aria-label="MYRA Society">
              <img src="/myra-logo.svg" alt="MYRA"
                className="h-4 w-auto transition-all duration-500 hover:opacity-60"
                style={{ filter: logoFil }} />
            </Link>
          </div>

          {/* DROITE — Heure + Langue + Burger */}
          <div className="flex items-center gap-6">

            {/* Heure desktop */}
            <div className="hidden md:flex items-center gap-4 font-sans text-[8px] tracking-[0.18em] uppercase"
              style={{ color: transparent ? 'rgba(255,255,255,0.30)' : 'rgba(12,12,10,0.25)' }}>
              <span>Marlenheim, FR</span>
              <div className="w-px h-3" style={{ backgroundColor: transparent ? 'rgba(255,255,255,0.12)' : 'rgba(12,12,10,0.10)' }} />
              <span className="tabular-nums">{time}</span>
            </div>

            {/* Sélecteur langue desktop */}
            <div className="hidden md:flex items-center gap-3 pl-4"
              style={{ borderLeft: `1px solid ${transparent ? 'rgba(255,255,255,0.10)' : 'rgba(12,12,10,0.08)'}` }}>
              {['fr', 'en', 'de'].map(l => (
                <button key={l} onClick={() => switchLocale(l)}
                  className="font-sans text-[8px] uppercase tracking-[0.30em] transition-colors duration-300"
                  style={{ color: langCol(l) }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Burger mobile */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-[5px] p-1 outline-none"
              aria-label={menuOpen ? 'Fermer' : 'Menu'}>
              {[0, 1, 2].map(i => (
                <span key={i} className="block w-5 h-px transition-all duration-400"
                  style={{
                    backgroundColor: transparent ? '#F3F2EF' : '#0C0C0A',
                    transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(6px)' : i === 2 ? 'rotate(-45deg) translateY(-6px)' : 'scaleX(0)') : 'none',
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 z-[99] bg-[#0C0C0A] flex flex-col items-center justify-center transition-all duration-700 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-10">
          {NAV_LINKS.map(({ label, href }, i) => (
            <Link key={href} href={`/${locale}${href}`}
              className="font-serif text-[32px] font-light italic text-[rgba(244,245,240,0.70)] hover:text-[#F3F2EF] transition-colors duration-500"
              style={{ transitionDelay: menuOpen ? `${i * 80}ms` : '0ms' }}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6 mt-16">
          {['fr', 'en', 'de'].map(l => (
            <button key={l} onClick={() => { switchLocale(l); setMenuOpen(false); }}
              className="font-sans text-[10px] uppercase tracking-[0.40em] transition-colors duration-300"
              style={{ color: locale === l ? '#F3F2EF' : 'rgba(244,245,240,0.22)' }}>
              {l}
            </button>
          ))}
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-8 bg-[rgba(43,16,34,0.50)]" />
          <span className="font-sans text-[8px] uppercase tracking-[0.45em] text-[rgba(244,245,240,0.20)]">Marlenheim, Alsace</span>
        </div>
      </div>
    </>
  );
}