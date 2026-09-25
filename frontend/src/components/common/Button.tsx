import React from 'react';

export type ButtonVariant = 'primary' | 'maroon' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'verified';
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
    sm: 'text-xs px-2.5 py-1 gap-1.5 rounded-[2px]',
    md: 'text-sm px-3.5 py-1.5 gap-2 rounded-[3px] font-semibold',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-[3px] font-bold'
  }[size];

  // Official GIGW button styling: Solid fills, sharp 2-3px radius, crisp 1px borders, zero soft shadow
  const variantClasses = {
    primary: 'bg-gov-navy hover:bg-gov-navy-dark text-white border border-gov-navy transition-colors',
    maroon: 'bg-gov-maroon hover:bg-gov-maroon-dark text-white border border-gov-maroon transition-colors',
    secondary: 'bg-white hover:bg-gov-gray text-gov-navy border border-gov-border transition-colors',
    ghost: 'bg-transparent hover:bg-slate-100 text-gov-text border border-transparent transition-colors',
    outline: 'bg-transparent hover:bg-gov-navy/5 text-gov-navy border border-gov-navy transition-colors',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors',
    verified: 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-700 transition-colors'
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};

export default Button;
