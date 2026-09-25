import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'verified';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-lg font-semibold',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-xl font-bold'
  }[size];

  const variantClasses = {
    primary: 'bg-bis-red hover:bg-red-700 text-white shadow-xs hover:shadow transition-all',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 transition-colors',
    outline: 'bg-transparent hover:bg-bis-navy/5 text-bis-navy border border-bis-navy/40 transition-colors',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors',
    verified: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all'
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};

export default Button;
