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
  // Standardized Design System Props
  variant?: 'default' | 'elevated' | 'trust' | 'flat';
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
  category,
  categoryIcon,
  categoryVariant = 'neutral'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  const isInteractive = Boolean(hover || onClick);

  // Variant base styles
  const variantClasses = {
    default: 'bg-white border border-slate-200/90 shadow-card',
    elevated: 'bg-white border border-slate-200/90 shadow-card-elevated',
    trust: 'bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-200/80 shadow-card hover:shadow-glow-verified',
    flat: 'bg-white border border-slate-200 shadow-none'
  }[variant];

  // Interactive elevation classes
  const interactiveClasses = isInteractive
    ? 'hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 ease-out cursor-pointer'
    : 'transition-colors';

  // Category chip styling
  const categoryPillClasses = {
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    brand: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  }[categoryVariant];

  return (
    <Component
      id={id}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={`rounded-xl overflow-hidden font-sans ${variantClasses} ${paddingClasses} ${interactiveClasses} ${className}`}
    >
      {(category || categoryIcon) && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border font-mono ${categoryPillClasses}`}>
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
