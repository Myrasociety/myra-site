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

  // Pages avec hero (la navbar démarre transparente)
  const HERO_PAGES = [
    `/${locale}`,
    `/${locale}/hebergement`,
    `/${locale}/soutenir`,
  ];
  
  // Vérifie si la page actuelle a un Hero (inclus les pages dynamiques d'hébergement)
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

  // LOGIQUE DE STYLE
  // Si pas de hero OU si on a scrollé OU si menu ouvert -> fond Noir
  const isSolid = !hasHero || scrolled || menuOpen;
  
  const bgStyle = isSolid 
    ? 'bg-[#0C0C0A] border-b border-white/[0.05] py-4' 
    : 'bg-transparent py-6';

  // Dans tous les cas, le fond étant sombre (transparent sur image ou noir plein), 
  // le texte doit être clair.
  const textCol = 'rgba(255,255,255,0.60)';
  const textAct = '#FFFFFF';

  const NAV_LINKS = [
    { label: t('hebergements'), href: '/hebergement' },
    { label: t('reserver'),     href: '/contact' },
    { label: t('club'),         href: '/soutenir' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${bgStyle}`}>
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 flex justify-between items-center">

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

          {/* CENTRE — Logo (Toujours blanc) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href={`/${locale}`} aria-label="MYRA Society">
              <img src="/myra-logo.svg" alt="MYRA"
                className="h-4 w-auto transition-all duration-500 hover:opacity-60 invert brightness-0" 
                style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
          </div>

          {/* DROITE — Heure + Langue + Burger */}
          <div className="flex items-center gap-6">

            {/* Heure desktop */}
            <div className="hidden md:flex items-center gap-4 font-sans text-[8px] tracking-[0.18em] uppercase text-white/30">
              <span>Marlenheim, FR</span>
              <div className="w-px h-3 bg-white/10" />
              <span className="tabular-nums text-white/60">{time}</span>
            </div>

            {/* Sélecteur langue desktop */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
              {['fr', 'en', 'de'].map(l => (
                <button key={l} onClick={() => switchLocale(l)}
                  className="font-sans text-[8px] uppercase tracking-[0.30em] transition-colors duration-300"
                  style={{ color: locale === l ? '#FFFFFF' : 'rgba(255,255,255,0.25)' }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Burger mobile (Toujours blanc) */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-[5px] p-1 outline-none"
              aria-label={menuOpen ? 'Fermer' : 'Menu'}>
              {[0, 1, 2].map(i => (
                <span key={i} className="block w-5 h-px bg-[#F3F2EF] transition-all duration-400"
                  style={{
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
              className="font-serif text-[32px] font-light italic text-white/70 hover:text-white transition-colors duration-500"
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
      </div>
    </>
  );
}