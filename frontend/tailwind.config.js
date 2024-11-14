// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'progress': 'progress 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { height: '0.75rem' },
          '50%': { height: '2rem' },
        },
        progress: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '100' },
        },
        slideUp: {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.10)',
      },
    },
  },
  plugins: [
    function ({ addBase, addComponents, addUtilities }) {
      addBase({
        'html': {
          '@apply antialiased': {},
        },
      });
      
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded-lg font-medium transition-all duration-200': {},
          '&:hover': {
            '@apply transform -translate-y-0.5': {},
          },
          '&:active': {
            '@apply transform translate-y-0': {},
          },
        },
        '.btn-primary': {
          '@apply bg-primary-600 text-white': {},
          '&:hover': {
            '@apply bg-primary-700': {},
          },
        },
        '.btn-secondary': {
          '@apply bg-secondary-200 text-secondary-800': {},
          '&:hover': {
            '@apply bg-secondary-300': {},
          },
        },
        '.card': {
          '@apply bg-white rounded-xl shadow-lg p-6': {},
        },
        '.input-field': {
          '@apply w-full px-4 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200': {},
        },
      });

      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}