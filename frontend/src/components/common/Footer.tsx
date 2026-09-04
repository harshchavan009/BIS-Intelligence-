import React from 'react';
import { useAppStore, LegalModalType } from '../../store/useAppStore';
import { SealMotif } from './SealMotif';
import { ShieldCheck, Scale, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveLegalModal, setActiveTab, language } = useAppStore();

  const legalLinks: { id: LegalModalType; label: string }[] = [
    { id: 'terms', label: 'Terms of Use' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'accessibility', label: 'Accessibility Statement' },
    { id: 'hyperlinking', label: 'Hyperlinking Policy' },
    { id: 'copyright', label: 'Copyright Policy' },
    { id: 'sitemap', label: 'Sitemap' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'grievance', label: 'Grievance Officer' }
  ];

  return (
    <footer className="bg-ink text-gray-300 border-t border-brass/20 text-xs font-sans mt-auto">
      {/* Top Footer Strip: National Emblem & Scoped Pilot Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10">
        {/* Col 1: Identity & Scope */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <SealMotif size={28} />
            <div>
              <div className="font-serif font-bold text-white text-sm tracking-wide">
                BUREAU OF INDIAN STANDARDS
              </div>
              <div className="text-[11px] text-brass font-mono">
                मानक: पथप्रदर्शक: | The National Standards Body of India
              </div>
            </div>
          </div>
          <p className="text-[11.5px] text-gray-400 leading-relaxed">
            AI-Powered Intelligent Assistant for Indian Standards and BIS Conformity Services.
            Engineered with verifiable clause grounding against official Central Marks Department (CMD-I / CMD-II) notifications and gazetted Quality Control Orders.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon 2026 Submission Prototype</span>
          </div>
        </div>

        {/* Col 2: Transparent Architecture Links */}
        <div className="md:col-span-3 space-y-2">
          <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            System Transparency
          </div>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li>
              <button 
                onClick={() => setActiveTab('about')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>About / How This Works</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('registry')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>Document Registry (7 Official PDFs)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>Evaluation Telemetry & Eval Set</span>
              </button>
            </li>
            <li>
              <a 
                href="https://www.bis.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>Official BIS Portal (External)</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Institutional Pilot Scoping */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Pilot Scoping Notice
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            The active corpus indexes 7 official BIS guideline documents (325 chunk segments) and 40+ structured Indian Standards. Verification features operate on a local demo dataset.
          </p>
          <div className="p-2.5 bg-white/5 rounded border border-white/10 text-[10.5px] text-gray-300 font-mono">
            Evaluation Groundedness: 100% on 20 internal regression benchmarks.
          </div>
        </div>
      </div>

      {/* Bottom Mandatory Legal Links Bar (Section 2.1) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
          {legalLinks.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setActiveLegalModal(item.id)}
                className="hover:text-white hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-brass rounded"
                aria-label={`Open ${item.label}`}
              >
                {item.label}
              </button>
              {idx < legalLinks.length - 1 && <span className="text-gray-600 select-none">•</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="text-gray-500 text-[10.5px] font-mono select-none">
          © 2026 Government of India / BIS Assistant Pilot
        </div>
      </div>
    </footer>
  );
};
