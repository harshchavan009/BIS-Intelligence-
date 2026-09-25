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
    verified: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    brand: 'bg-indigo-50 text-gov-navy border-slate-300',
    neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    outline: 'bg-transparent text-gray-800 border-gray-300',
    ghost: 'bg-white/10 text-white border-white/30'
  }[variant];

  const dotClasses = {
    verified: 'bg-emerald-700',
    warning: 'bg-amber-700',
    brand: 'bg-gov-navy',
    neutral: 'bg-gray-600',
    outline: 'bg-gray-600',
    ghost: 'bg-emerald-400'
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
