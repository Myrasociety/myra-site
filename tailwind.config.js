/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        porcelain: '#F4F5F0',
        stone:     '#D8D5CD',
        ink:       '#0C0C0A',
        wood:      '#2A1712',
        bordeaux:  '#2B1022',
        denim:     '#465364',
      },
      maxWidth: {
        container: '1440px',
        prose:     '68ch',
      },
      transitionTimingFunction: {
        expo:   'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transitionDuration: {
        '400':  '400ms',
        '600':  '600ms',
        '800':  '800ms',
        '1200': '1200ms',
      },
      lineHeight: {
        display: '0.88',
        tight:   '0.92',
        body:    '1.82',
      },
      letterSpacing: {
        cap:      '0.65em',
        label:    '0.20em',
        'wide-2': '0.38em',
      },
    },
  },
  plugins: [],
};