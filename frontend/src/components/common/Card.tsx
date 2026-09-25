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
  // Official GIGW Design System Props
  variant?: 'default' | 'elevated' | 'trust' | 'flat';
  accent?: 'none' | 'navy' | 'maroon' | 'green' | 'amber';
  category?: string;
  categoryIcon?: React.ReactNode;
  categoryVariant?: 'verified' | 'warning' | 'brand' | 'neutral';
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
  onKeyDown,
  variant = 'default',
  accent = 'none',
  category,
  categoryIcon,
  categoryVariant = 'neutral'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6'
  }[padding];

  const isInteractive = Boolean(hover || onClick);

  // Variant base styles: Solid crisp backgrounds with 1px hairline borders
  const variantClasses = {
    default: 'bg-surface border border-border shadow-xs',
    elevated: 'bg-surface border border-border shadow-sm',
    trust: 'bg-surface border border-status-success/50 shadow-xs',
    flat: 'bg-surface border border-border-light shadow-none'
  }[variant];

  // Left-border accent stripe (Government dossier card style)
  const accentClasses = {
    none: '',
    navy: 'border-l-4 border-l-brand-primary',
    maroon: 'border-l-4 border-l-brand-accent',
    green: 'border-l-4 border-l-status-success',
    amber: 'border-l-4 border-l-status-warning'
  }[accent];

  // Interactive states: Pure color/border highlight, strictly NO scale or translate
  const interactiveClasses = isInteractive
    ? 'hover:border-brand-primary hover:bg-surface-alt transition-colors duration-150 cursor-pointer'
    : 'transition-colors';

  // Category chip styling: Rectangular chip, using semantic pill tokens
  const categoryPillClasses = {
    verified: 'pill-badge-verified',
    warning: 'pill-badge-warning',
    brand: 'pill-badge-brand',
    neutral: 'pill-badge-neutral'
  }[categoryVariant];

  return (
    <Component
      id={id}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={`rounded-[3px] font-sans ${variantClasses} ${accentClasses} ${paddingClasses} ${interactiveClasses} ${className}`}
    >
      {(category || categoryIcon) && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10.5px] font-bold tracking-wider uppercase border font-mono ${categoryPillClasses}`}>
            {categoryIcon}
            {category && <span>{category}</span>}
          </span>
        </div>
      )}
      {children}
    </Component>
  );
};

export default Card;
