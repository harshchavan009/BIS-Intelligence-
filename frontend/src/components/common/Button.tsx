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
    primary: 'bg-brand-primary hover:brightness-110 text-white border border-brand-primary transition-colors',
    maroon: 'bg-brand-accent hover:brightness-110 text-white border border-brand-accent transition-colors',
    secondary: 'bg-surface hover:bg-surface-alt text-text-primary border border-border transition-colors',
    ghost: 'bg-transparent hover:bg-surface-alt text-text-primary border border-transparent transition-colors',
    outline: 'bg-transparent hover:bg-brand-primary/10 text-brand-primary border border-brand-primary transition-colors',
    danger: 'bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-status-danger/30 transition-colors',
    verified: 'bg-status-success hover:brightness-110 text-white border border-status-success transition-colors'
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
