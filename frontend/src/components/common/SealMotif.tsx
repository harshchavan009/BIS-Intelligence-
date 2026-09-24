import React from 'react';
import { BisIntelligenceLogo } from './BisIntelligenceLogo';

interface SealMotifProps {
  className?: string;
  size?: number;
}

/**
 * Standard BIS Intelligence Monogram Motif.
 * Redirects to the distinct independent logo to ensure Section 0 compliance.
 */
export const SealMotif: React.FC<SealMotifProps> = ({ className = '', size = 36 }) => {
  return (
    <BisIntelligenceLogo 
      size={size} 
      className={className} 
      showWordmark={false} 
    />
  );
};
