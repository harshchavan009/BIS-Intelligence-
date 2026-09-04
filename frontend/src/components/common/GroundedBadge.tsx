import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface GroundedBadgeProps {
  grounded?: boolean;
  score?: number;
  className?: string;
  minimal?: boolean;
}

export const GroundedBadge: React.FC<GroundedBadgeProps> = ({
  grounded = true,
  score,
  className = '',
  minimal = false
}) => {
  if (minimal) {
    return grounded ? (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-verified-green bg-verified-green/10 border border-verified-green/30 px-2 py-0.5 rounded ${className}`}>
        <ShieldCheck className="w-3 h-3 text-verified-green" />
        Verified Standard
      </span>
    ) : (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded ${className}`}>
        <AlertCircle className="w-3 h-3 text-amber-600" />
        Needs Verification
      </span>
    );
  }

  return grounded ? (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-verified-green/30 bg-emerald-50 text-emerald-900 text-xs font-medium ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-verified-green flex-shrink-0" />
      <span>Clause Verified</span>
      {score !== undefined && (
        <span className="text-[10px] bg-white text-verified-green font-mono px-1.5 py-0.2 rounded border border-verified-green/20">
          {score}%
        </span>
      )}
    </div>
  ) : (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-300 bg-amber-50 text-amber-900 text-xs font-medium ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      <span>General Guidance</span>
    </div>
  );
};
