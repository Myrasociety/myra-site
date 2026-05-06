// lib/fonts.js
import { Cormorant_Garamond } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

export const serif = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  display:  'swap',
  variable: '--font-serif',
});

export const sans = GeistSans;