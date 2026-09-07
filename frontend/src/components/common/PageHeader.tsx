import React from 'react';
import { SealMotif } from './SealMotif';

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  icon,
  badge,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-line rounded-lg p-6 sm:p-7 shadow-paper-sm relative space-y-4 font-sans ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            {icon !== undefined ? icon : <SealMotif size={20} />}
            <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight font-normal leading-snug">
            {title}
          </h1>
          <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
            {description}
          </p>
        </div>

        {badge && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {badge}
          </div>
        )}
      </div>

      {children && (
        <div className="pt-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
