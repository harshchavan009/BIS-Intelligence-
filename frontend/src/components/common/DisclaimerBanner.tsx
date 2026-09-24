import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('bis_disclaimer_dismissed_session');
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    } catch {
      // Fallback if sessionStorage is disabled
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('bis_disclaimer_dismissed_session', 'true');
    } catch {
      // Ignored
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Statutory Independence and Non-Affiliation Disclaimer"
      className="bg-amber-50 border-b-2 border-amber-400 text-amber-950 px-4 py-2.5 sm:px-6 relative z-50 text-xs sm:text-sm font-sans shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 flex-1">
          <div className="p-1 rounded bg-amber-200 text-amber-900 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="leading-snug">
            <span className="font-bold text-amber-900 mr-1.5 uppercase tracking-wide text-[11px] sm:text-xs bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-300">
              Disclaimer
            </span>
            <span className="font-medium text-amber-950">
              This is an independent, unofficial project and is not affiliated with, endorsed by, or operated by the Bureau of Indian Standards or the Government of India. Information is provided for reference only — always verify against{' '}
              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline decoration-amber-600 hover:text-bis-red inline-flex items-center gap-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded px-0.5"
              >
                bis.gov.in
                <ExternalLink className="w-3 h-3 ml-0.5 inline" aria-label="(opens in new window)" />
              </a>
              .
            </span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1.5 rounded-md text-amber-800 hover:bg-amber-200 hover:text-amber-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          aria-label="Dismiss disclaimer banner for this session"
          title="Dismiss disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
