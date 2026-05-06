import { serif } from '../lib/fonts';
import { GeistSans } from 'geist/font/sans';

export default function RootLayout({ children }) {
  return (
    <html className={`${GeistSans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}