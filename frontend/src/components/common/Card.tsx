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
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  const isInteractive = Boolean(hover || onClick);

  const elevationClasses = isInteractive
    ? 'shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] hover:border-brass/60 transition-all duration-200 ease-out cursor-pointer'
    : 'shadow-none transition-colors';

  return (
    <Component
      id={id}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={`bg-white border border-line rounded-xl ${paddingClasses} ${elevationClasses} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Card;
