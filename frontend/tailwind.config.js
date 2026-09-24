/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
          DEFAULT: '#2F6B4F',
          light: '#EAF3ED',
          border: '#458E6C'
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
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper-sm': '0 1px 3px rgba(16, 24, 43, 0.05)',
        'paper': '0 4px 12px rgba(16, 24, 43, 0.08)',
        'paper-lg': '0 8px 24px rgba(16, 24, 43, 0.12)',
      }
    },
  },
  plugins: [],
}
