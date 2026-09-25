/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Brand System
        brand: {
          navy: '#1E2A5E',
          'navy-dark': '#141C40',
          blue: '#35569E',
          'blue-hover': '#263F73',
          'blue-light': '#F0F4FF',
          red: '#A42115',
          'red-hover': '#88190F',
          ink: '#0B122C'
        },
        // Semantic Status Tokens
        verified: {
          DEFAULT: '#15803D', // Emerald-700 for high contrast WCAG AA
          light: '#F0FDF4',   // Emerald-50
          border: '#BBF7D0',  // Emerald-200
          dark: '#14532D'     // Emerald-900
        },
        warning: {
          DEFAULT: '#B45309', // Amber-700 for high contrast WCAG AA
          light: '#FFFBEB',   // Amber-50
          border: '#FDE68A',  // Amber-200
          dark: '#78350F'     // Amber-900
        },
        // Backward-compatible core tokens
        ink: {
          DEFAULT: '#10182B',
          light: '#222E48',
          muted: '#4A5568'
        },
        'indigo-deep': {
          DEFAULT: '#1E2A5E',
          dark: '#141C40',
          light: '#2D3D82'
        },
        brass: {
          DEFAULT: '#B9862F',
          dark: '#966A1F',
          light: '#DCAB55'
        },
        paper: {
          DEFAULT: '#F7F5EF',
          card: '#FFFFFF',
          dark: '#EFECE2'
        },
        line: {
          DEFAULT: '#DCD6C6',
          dark: '#BDB6A2'
        },
        'verified-green': {
          DEFAULT: '#15803D',
          light: '#F0FDF4',
          border: '#BBF7D0'
        },
        'bis-navy': '#35569E',
        'bis-navy-800': '#263F73',
        'bis-red': '#A42115',
        'bis-ink': '#0B122C',
        'card-pink': '#F2D7F9',
        'card-peach': '#F4D4C9',
        'card-lavender': '#D6DAF5',
        'card-mint': '#D5F9D4'
      },
      fontSize: {
        // Semantic Typographic Scale Hierarchy
        'hero-display': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'section-heading': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],
        'card-headline': ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-base': ['0.9375rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'body-tight': ['0.8125rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '400' }],
        'caption-badge': ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.025em', fontWeight: '600' }]
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
        'card-elevated': '0 4px 14px 0 rgba(15, 23, 42, 0.07)',
        'glow-verified': '0 0 16px -2px rgba(21, 128, 61, 0.25)',
        'glow-brand': '0 0 16px -2px rgba(53, 86, 158, 0.25)',
        'paper-sm': '0 1px 3px rgba(16, 24, 43, 0.05)',
        'paper': '0 4px 12px rgba(16, 24, 43, 0.08)',
        'paper-lg': '0 8px 24px rgba(16, 24, 43, 0.12)',
      }
    },
  },
  plugins: [],
}
