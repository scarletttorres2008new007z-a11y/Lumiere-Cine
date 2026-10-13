/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0B',
          900: '#111113',
          850: '#16161A',
          800: '#1D1D21',
          700: '#2A2A30',
          600: '#3A3A42',
        },
        cream: {
          50: '#FBF8F2',
          100: '#F2EBDD',
          300: '#D9CDB6',
        },
        carmine: {
          400: '#E2384D',
          500: '#C8102E',
          600: '#A50D26',
          700: '#7F0A1D',
        },
        gold: {
          400: '#E0B867',
          500: '#C99A3E',
        },
        muted: '#9C9AA3',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
  plugins: [],
};
