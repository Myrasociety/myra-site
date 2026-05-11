import { Montserrat, Cormorant_Garamond } from 'next/font/google';

export const sans = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});