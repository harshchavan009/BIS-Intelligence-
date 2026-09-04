import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface SimulatedBadgeProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const SimulatedBadge: React.FC<SimulatedBadgeProps> = ({ className = '', defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`rounded-md border border-amber-300 bg-amber-50/90 text-amber-950 text-xs transition-all ${className}`}>
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer select-none hover:bg-amber-100/60 transition-colors rounded-md"
        role="button"
        aria-expanded={expanded}
        aria-label="Toggle demo mode simulated lookup explanation"
      >
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>Demo Mode — Simulated Lookup</span>
        </div>
        <div className="flex items-center gap-1 text-[10.5px] text-amber-800 font-sans">
          <span>{expanded ? 'Hide Note' : 'Registry Notice'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-2.5 pt-1 text-[11px] leading-relaxed border-t border-amber-200 text-amber-900 font-sans space-y-1">
          <p>
            <strong>Simulated Demonstration: </strong>
            Not connected to the live government <em>BIS-CARE / Manakonline</em> registry.
            Responses are strictly constrained to a local verified demo dataset for evaluation illustration.
          </p>
          <p className="text-[10px] text-amber-800/90 italic">
            Arbitrary or unknown inputs will return a "Not found in demo dataset" message rather than a false verification.
          </p>
        </div>
      )}
    </div>
  );
};
