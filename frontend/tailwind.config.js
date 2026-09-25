/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
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
        // Theme-aware semantic surface & background tokens
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          alt: 'var(--surface-alt)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
        },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',

        // GIGW Government Portal Palette (Dynamic via CSS variables)
        gov: {
          navy: 'var(--gov-navy)',
          'navy-dark': 'var(--gov-navy-dark)',
          'navy-light': 'var(--gov-navy-light)',
          maroon: 'var(--gov-maroon)',
          'maroon-dark': 'var(--gov-maroon-dark)',
          gray: 'var(--gov-gray)',
          border: 'var(--gov-border)',
          'border-light': 'var(--gov-border-light)',
          text: 'var(--gov-text)',
          muted: 'var(--gov-text-muted)'
        },
        // Semantic Brand System
        brand: {
          primary: 'var(--brand-primary)',
          accent: 'var(--brand-accent)',
          navy: 'var(--gov-navy)',
          'navy-dark': 'var(--gov-navy-dark)',
          blue: 'var(--brand-blue)',
          'blue-hover': 'var(--brand-blue-hover)',
          'blue-light': 'var(--brand-blue-light)',
          red: 'var(--brand-red)',
          'red-hover': 'var(--brand-red-hover)',
          ink: 'var(--brand-ink)'
        },
        // Functional Status Colors (Strict semantic meaning)
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)'
        },
        verified: {
          DEFAULT: 'var(--status-success)',
          light: 'var(--verified-light)',
          border: 'var(--verified-border)',
          dark: '#14532D'
        },
        warning: {
          DEFAULT: 'var(--status-warning)',
          light: 'var(--warning-light)',
          border: 'var(--warning-border)',
          dark: '#78350F'
        },
        // Backward-compatible core tokens (mapped dynamically to active theme)
        ink: {
          DEFAULT: 'var(--ink)',
          light: 'var(--text-secondary)',
          muted: 'var(--text-muted)'
        },
        'indigo-deep': {
          DEFAULT: 'var(--gov-navy)',
          dark: 'var(--gov-navy-dark)',
          light: 'var(--gov-navy-light)'
        },
        brass: {
          DEFAULT: 'var(--gov-maroon)',
          dark: 'var(--gov-maroon-dark)',
          light: 'var(--gov-maroon)'
        },
        paper: {
          DEFAULT: 'var(--paper)',
          card: 'var(--paper-card)',
          dark: 'var(--border-light)'
        },
        line: {
          DEFAULT: 'var(--line)',
          dark: 'var(--border)'
        },
        'verified-green': {
          DEFAULT: 'var(--verified-green)',
          light: 'var(--verified-light)',
          border: 'var(--verified-border)'
        },
        'bis-navy': 'var(--bis-navy)',
        'bis-navy-800': 'var(--gov-navy-dark)',
        'bis-red': 'var(--bis-red)',
        'bis-ink': 'var(--bis-ink)',
        'card-pink': 'var(--surface)',
        'card-peach': 'var(--surface)',
        'card-lavender': 'var(--surface)',
        'card-mint': 'var(--surface)'
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
