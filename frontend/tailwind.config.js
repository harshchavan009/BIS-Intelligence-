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
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          alt: 'rgb(var(--color-surface-alt) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
        },
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',

        // GIGW Government Portal Palette (Dynamic via CSS variables)
        gov: {
          navy: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'navy-dark': 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'navy-light': 'rgb(var(--color-brand-primary) / <alpha-value>)',
          maroon: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          'maroon-dark': 'rgb(var(--color-brand-accent) / <alpha-value>)',
          gray: 'rgb(var(--color-surface-alt) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          'border-light': 'rgb(var(--color-border-light) / <alpha-value>)',
          text: 'rgb(var(--color-text-primary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-secondary) / <alpha-value>)'
        },
        // Semantic Brand System
        brand: {
          primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          accent: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          navy: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'navy-dark': 'rgb(var(--color-brand-primary) / <alpha-value>)',
          blue: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'blue-hover': 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'blue-light': 'rgb(var(--color-surface-alt) / <alpha-value>)',
          red: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          'red-hover': 'rgb(var(--color-brand-accent) / <alpha-value>)',
          ink: 'rgb(var(--color-text-primary) / <alpha-value>)'
        },
        // Functional Status Colors (Strict semantic meaning)
        status: {
          success: 'rgb(var(--color-status-success) / <alpha-value>)',
          warning: 'rgb(var(--color-status-warning) / <alpha-value>)',
          danger: 'rgb(var(--color-status-danger) / <alpha-value>)'
        },
        verified: {
          DEFAULT: 'rgb(var(--color-status-success) / <alpha-value>)',
          light: 'var(--verified-light)',
          border: 'var(--verified-border)',
          dark: '#14532D'
        },
        warning: {
          DEFAULT: 'rgb(var(--color-status-warning) / <alpha-value>)',
          light: 'var(--warning-light)',
          border: 'var(--warning-border)',
          dark: '#78350F'
        },
        // Backward-compatible core tokens (mapped dynamically to active theme)
        ink: {
          DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
          light: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)'
        },
        'indigo-deep': {
          DEFAULT: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          light: 'rgb(var(--color-brand-primary) / <alpha-value>)'
        },
        brass: {
          DEFAULT: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          light: 'rgb(var(--color-brand-accent) / <alpha-value>)'
        },
        paper: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          card: 'rgb(var(--color-surface) / <alpha-value>)',
          dark: 'rgb(var(--color-surface-alt) / <alpha-value>)'
        },
        line: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          dark: 'rgb(var(--color-border) / <alpha-value>)'
        },
        'verified-green': {
          DEFAULT: 'rgb(var(--color-status-success) / <alpha-value>)',
          light: 'var(--verified-light)',
          border: 'var(--verified-border)'
        },
        'bis-navy': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'bis-navy-800': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'bis-red': 'rgb(var(--color-brand-accent) / <alpha-value>)',
        'bis-ink': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'card-pink': 'rgb(var(--color-surface) / <alpha-value>)',
        'card-peach': 'rgb(var(--color-surface) / <alpha-value>)',
        'card-lavender': 'rgb(var(--color-surface) / <alpha-value>)',
        'card-mint': 'rgb(var(--color-surface) / <alpha-value>)'
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
