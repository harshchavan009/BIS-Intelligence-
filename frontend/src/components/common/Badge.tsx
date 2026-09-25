import React from 'react';

export type BadgeVariant = 'verified' | 'warning' | 'brand' | 'neutral' | 'outline' | 'ghost';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2 py-0.5 gap-1.5'
  }[size];

  // Official GIGW status badge styles: Rectangular, high contrast, 1px solid border
  const variantClasses = {
    verified: 'bg-status-success/15 text-status-success border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    brand: 'bg-brand-primary/15 text-brand-primary border-brand-primary/30',
    neutral: 'bg-surface-alt text-text-secondary border-border',
    outline: 'bg-transparent text-text-primary border-border',
    ghost: 'bg-surface-alt/50 text-text-primary border-border'
  }[variant];

  const dotClasses = {
    verified: 'bg-status-success',
    warning: 'bg-status-warning',
    brand: 'bg-brand-primary',
    neutral: 'bg-text-secondary',
    outline: 'bg-text-secondary',
    ghost: 'bg-status-success'
  }[variant];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-[2px] border font-mono select-none ${sizeClasses} ${variantClasses} ${onClick ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : ''} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
