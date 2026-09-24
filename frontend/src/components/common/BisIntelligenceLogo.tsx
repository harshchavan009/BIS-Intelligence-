import React from 'react';

interface BisIntelligenceLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkColor?: 'white' | 'dark' | 'auto';
  tagline?: boolean;
}

export const BisIntelligenceLogo: React.FC<BisIntelligenceLogoProps> = ({
  className = '',
  size = 40,
  showWordmark = false,
  wordmarkColor = 'auto',
  tagline = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Custom Vector Monogram Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        role="img"
        aria-label="BIS Intelligence Logo"
      >
        <defs>
          <linearGradient id="bisNavyGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35569E" />
            <stop offset="100%" stopColor="#263F73" />
          </linearGradient>
          <linearGradient id="bisRedGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C92A1D" />
            <stop offset="100%" stopColor="#A42115" />
          </linearGradient>
        </defs>

        {/* Outer Shield Container in --bis-navy */}
        <path
          d="M50 8 L84 23 V50 C84 71 50 90 50 90 C50 90 16 71 16 50 V23 Z"
          fill="url(#bisNavyGradComp)"
        />

        {/* Inner Subtle Tint */}
        <path
          d="M50 15 L77 27 V48 C77 65 50 81 50 81 C50 81 23 65 23 48 V27 Z"
          fill="#FFFFFF"
          opacity="0.08"
        />

        {/* Monogram Pillar "I" */}
        <rect x="33" y="34" width="7" height="32" rx="1.5" fill="#FFFFFF" />

        {/* Monogram "B" Curve & Loops */}
        <path
          d="M46 34 H59 C63.5 34 66.5 36.2 66.5 40 C66.5 42.8 64.5 44.7 61.5 45.6 C65.5 46.5 67.5 49 67.5 53 C67.5 57.5 64 60.5 59 60.5 H46 V34 Z M53 39.5 V44 H58 C60 44 61 43 61 41.8 C61 40.5 60 39.5 58 39.5 H53 Z M53 49.5 V55 H59 C61 55 62 54 62 52.3 C62 50.5 61 49.5 59 49.5 H53 Z"
          fill="#FFFFFF"
        />

        {/* Intelligence Star / Sparkle in --bis-red */}
        <path
          d="M50 20 L52.2 24.8 L57 27 L52.2 29.2 L50 34 L47.8 29.2 L43 27 L47.8 24.8 Z"
          fill="url(#bisRedGradComp)"
        />
        <circle cx="50" cy="27" r="1.2" fill="#FFFFFF" />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-lg sm:text-xl font-sans ${
                wordmarkColor === 'white'
                  ? 'text-white'
                  : wordmarkColor === 'dark'
                  ? 'text-bis-ink'
                  : 'text-bis-ink dark:text-white'
              }`}
            >
              BIS Intelligence
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-bis-red text-white">
              AI
            </span>
          </div>
          {tagline && (
            <span
              className={`text-[11px] font-medium leading-tight ${
                wordmarkColor === 'white' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Independent AI Assistant for Indian Standards
            </span>
          )}
        </div>
      )}
    </div>
  );
};
