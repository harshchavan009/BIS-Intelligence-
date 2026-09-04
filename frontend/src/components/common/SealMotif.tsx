import React from 'react';

interface SealMotifProps {
  className?: string;
  size?: number;
}

export const SealMotif: React.FC<SealMotifProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {/* Outer Seal Ring */}
      <circle cx="24" cy="24" r="22" stroke="#B9862F" strokeWidth="2" strokeDasharray="3 2" opacity="0.85" />
      <circle cx="24" cy="24" r="19" stroke="#B9862F" strokeWidth="1.2" />
      
      {/* Central Geometric BIS Star / Diamond Emblem */}
      <polygon
        points="24,8 35,24 24,40 13,24"
        fill="#B9862F"
        fillOpacity="0.15"
        stroke="#B9862F"
        strokeWidth="1.5"
      />
      {/* Inner Standard Line */}
      <line x1="16" y1="24" x2="32" y2="24" stroke="#B9862F" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="16" x2="24" y2="32" stroke="#B9862F" strokeWidth="2" strokeLinecap="round" />
      
      {/* Center Verified Dot */}
      <circle cx="24" cy="24" r="3" fill="#B9862F" />
    </svg>
  );
};
