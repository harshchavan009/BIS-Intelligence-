import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article';
  id?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
  as: Component = 'div',
  id,
  role,
  tabIndex,
  onKeyDown
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3.5',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  const hoverClasses = hover || onClick
    ? 'hover:shadow-paper hover:border-brass/50 transition-all cursor-pointer'
    : 'transition-all';

  return (
    <Component
      id={id}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={`bg-white border border-line rounded-lg shadow-paper-sm ${paddingClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Card;
