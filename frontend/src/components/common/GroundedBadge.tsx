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
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-status-success bg-status-success/15 border border-status-success/30 px-2 py-0.5 rounded ${className}`}>
        <ShieldCheck className="w-3 h-3 text-status-success" />
        Verified Standard
      </span>
    ) : (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-status-warning bg-status-warning/15 border border-status-warning/30 px-2 py-0.5 rounded ${className}`}>
        <AlertCircle className="w-3 h-3 text-status-warning" />
        Needs Verification
      </span>
    );
  }

  return grounded ? (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-status-success/30 bg-status-success/15 text-status-success text-xs font-medium ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-status-success flex-shrink-0" />
      <span>Clause Verified</span>
      {score !== undefined && (
        <span className="text-[10px] bg-surface text-status-success font-mono px-1.5 py-0.2 rounded border border-status-success/30">
          {score}%
        </span>
      )}
    </div>
  ) : (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-status-warning/30 bg-status-warning/15 text-status-warning text-xs font-medium ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 text-status-warning flex-shrink-0" />
      <span>General Guidance</span>
    </div>
  );
};
