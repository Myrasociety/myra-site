import { Spectral } from 'next/font/google';
import localFont from 'next/font/local';

// Corps de texte — Spectral (réf. amelie.framer.media).
export const sans = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});

// Titres — Optician Sans (display). Exporté en `serif` car les titres du site
// utilisent déjà la classe `font-serif` (= var(--font-serif)).
export const serif = localFont({
  src: '../app/fonts/OpticianSans.woff2',
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});
