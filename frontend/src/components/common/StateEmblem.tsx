import React from 'react';

interface StateEmblemProps {
  className?: string;
  size?: number; // Height in pixels (~28-32px per GIGW guidelines)
  variant?: 'gold' | 'white' | 'dark';
}

/**
 * Official State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate).
 * Rendered with authentic vector geometry per the State Emblem of India specifications.
 */
export const StateEmblem: React.FC<StateEmblemProps> = ({ 
  className = '', 
  size = 30,
  variant = 'gold'
}) => {
  const src = variant === 'white' 
    ? '/emblem-india-white.svg' 
    : variant === 'dark' 
      ? '/emblem-india.svg' 
      : '/emblem-india-gold.svg';

  // The official State Emblem has viewBox aspect ratio 145.52 x 231.92 (~0.627)
  const width = Math.round((size * 145.52) / 231.92);

  return (
    <img
      src={src}
      alt="State Emblem of India"
      title="State Emblem of India"
      width={width}
      height={size}
      className={`inline-block select-none shrink-0 ${className}`}
      style={{ height: `${size}px`, width: `${width}px`, objectFit: 'contain' }}
      loading="eager"
      decoding="async"
    />
  );
};

