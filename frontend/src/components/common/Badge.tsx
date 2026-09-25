import React from 'react';

export type BadgeVariant = 'verified' | 'warning' | 'brand' | 'neutral' | 'outline' | 'ghost';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  pulse = false,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5'
  }[size];

  const variantClasses = {
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    brand: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    ghost: 'bg-white/10 text-white border-white/20'
  }[variant];

  const dotClasses = {
    verified: 'bg-emerald-500',
    warning: 'bg-amber-500',
    brand: 'bg-indigo-600',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-500',
    ghost: 'bg-emerald-400'
  }[variant];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-full border font-mono select-none ${sizeClasses} ${variantClasses} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses} ${pulse ? 'animate-pulse' : ''}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
