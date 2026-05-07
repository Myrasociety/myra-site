import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google';

export const serif = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  display:  'swap',
  variable: '--font-serif',
});

export const sans = Instrument_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600'],
  style:    ['normal', 'italic'],
  display:  'swap',
  variable: '--font-sans',
});