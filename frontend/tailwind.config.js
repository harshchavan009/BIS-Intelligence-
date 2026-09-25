/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Government GIGW 3.0 Standard: Crisp, small rectangular radii (2-6px)
    borderRadius: {
      'none': '0px',
      'sm': '2px',
      DEFAULT: '3px',
      'md': '4px',
      'lg': '4px',
      'xl': '6px',
      '2xl': '6px',
      '3xl': '8px',
      'full': '9999px',
    },
    extend: {
      colors: {
        // GIGW Authentic Government Portal Palette
        gov: {
          navy: '#1A3C6E',       // Primary official navy (bis.gov.in / india.gov.in)
          'navy-dark': '#11294D', // Deep header / masthead navy
          'navy-light': '#244E8C',
          maroon: '#8B1D1D',     // Official deep red / maroon for notices and CTAs
          'maroon-dark': '#6D1414',
          gray: '#F4F6F9',       // Clean neutral gray for section banding
          border: '#D1D5DB',     // Hairline 1px borders
          'border-light': '#E5E7EB',
          text: '#111827',       // Near-black text
          muted: '#4B5563'       // Muted secondary text
        },
        // Semantic Brand System (Mapped to GIGW palette)
        brand: {
          navy: '#1A3C6E',
          'navy-dark': '#11294D',
          blue: '#1A3C6E',
          'blue-hover': '#11294D',
          'blue-light': '#EEF3F9',
          red: '#8B1D1D',
          'red-hover': '#6D1414',
          ink: '#111827'
        },
        // Functional Status Colors (Strict semantic meaning only)
        verified: {
          DEFAULT: '#166534', // Emerald-800 for high-contrast WCAG AAA
          light: '#F0FDF4',   // Emerald-50
          border: '#BBF7D0',  // Emerald-200
          dark: '#14532D'     // Emerald-900
        },
        warning: {
          DEFAULT: '#92400E', // Amber-800 for high-contrast WCAG AAA
          light: '#FEF3C7',   // Amber-50
          border: '#FDE68A',  // Amber-200
          dark: '#78350F'     // Amber-900
        },
        // Backward-compatible core tokens (re-skinned to formal palette)
        ink: {
          DEFAULT: '#111827',
          light: '#1F2937',
          muted: '#4B5563'
        },
        'indigo-deep': {
          DEFAULT: '#1A3C6E',
          dark: '#11294D',
          light: '#244E8C'
        },
        brass: {
          DEFAULT: '#8B1D1D', // Harmonized to institutional maroon
          dark: '#6D1414',
          light: '#B91C1C'
        },
        paper: {
          DEFAULT: '#F4F6F9', // Clean government banding gray
          card: '#FFFFFF',
          dark: '#E5E7EB'
        },
        line: {
          DEFAULT: '#D1D5DB',
          dark: '#9CA3AF'
        },
        'verified-green': {
          DEFAULT: '#166534',
          light: '#F0FDF4',
          border: '#BBF7D0'
        },
        'bis-navy': '#1A3C6E',
        'bis-navy-800': '#11294D',
        'bis-red': '#8B1D1D',
        'bis-ink': '#111827',
        // Neutralize pastel card floods to pure crisp white with hairline borders
        'card-pink': '#FFFFFF',
        'card-peach': '#FFFFFF',
        'card-lavender': '#FFFFFF',
        'card-mint': '#FFFFFF'
      },
      fontSize: {
        // Sober, Authoritative Institutional Typographic Hierarchy
        'hero-display': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'section-heading': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'card-headline': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-base': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-tight': ['0.8125rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '400' }],
        'caption-badge': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '700' }]
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace']
      },
      boxShadow: {
        // Crisp Hairline Elevations (No blurred drop shadows)
        'none': 'none',
        'xs': '0 1px 1px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'card-elevated': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'paper-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'paper': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'paper-lg': '0 2px 6px rgba(0, 0, 0, 0.08)',
        'glow-verified': 'none',
        'glow-brand': 'none'
      }
    },
  },
  plugins: [],
}
