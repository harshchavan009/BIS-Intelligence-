import React from 'react';
import { useAppStore, LegalModalType } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { BisIntelligenceLogo } from './BisIntelligenceLogo';
import { ShieldCheck, ExternalLink, AlertTriangle, Monitor, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveLegalModal, setActiveTab } = useAppStore();
  const { t, language } = useTranslation();

  const legalLinks: { id: LegalModalType; labelKey: string }[] = [
    { id: 'terms', labelKey: 'footer.terms' },
    { id: 'privacy', labelKey: 'footer.privacy' },
    { id: 'accessibility', labelKey: 'footer.accessibility_stmt' },
    { id: 'hyperlinking', labelKey: 'footer.hyperlink_policy' },
    { id: 'copyright', labelKey: 'footer.copyright_policy' },
    { id: 'sitemap', labelKey: 'footer.sitemap' },
    { id: 'feedback', labelKey: 'footer.feedback' },
    { id: 'grievance', labelKey: 'footer.grievance' }
  ];

  return (
    <footer className="bg-bis-ink text-gray-300 border-t-2 border-bis-navy text-xs font-sans mt-auto">
      {/* 1. Full Non-Affiliation Disclaimer Banner (Mandatory Section 0 & 8) */}
      <div className="bg-[#131b35] border-b border-white/10 px-4 sm:px-8 py-4 text-gray-200">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-[13px] font-medium leading-relaxed text-amber-100">
            <span className="font-bold text-amber-300 uppercase tracking-wide mr-1.5">
              Notice:
            </span>
            This is an independent, unofficial project and is not affiliated with, endorsed by, or operated by the Bureau of Indian Standards or the Government of India. Information is provided for reference only — always verify against{' '}
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white underline decoration-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5"
            >
              bis.gov.in
              <ExternalLink className="w-3 h-3 ml-0.5" aria-label="(opens in new window)" />
            </a>
            .
          </p>
        </div>
      </div>

      {/* 2. Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10">
        
        {/* Col 1: About the Project & Identity */}
        <div className="md:col-span-4 space-y-4">
          <BisIntelligenceLogo size={42} showWordmark={true} wordmarkColor="white" tagline={true} />
          
          <p className="text-xs text-gray-400 leading-relaxed pr-4">
            An independent AI assistant that explains BIS standards, ISI Mark, CRS, CoC and Hallmarking rules using publicly available BIS documents. Built for MSMEs, industry professionals, and consumers.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2 text-[11.5px]">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>BIS Intelligence Project Team</span>
            </div>
            <div className="text-gray-400 font-mono text-[11px]">
              Data Sources: Gazette S.O. 191(E), BIS Act 2016 · Last Sync: 24 Sept 2026
            </div>
            <div className="pt-1.5 border-t border-white/10 flex items-center gap-2 text-emerald-400 font-mono text-[10.5px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>GIGW 3.0 &amp; WCAG 2.1 Level AA Compliant</span>
            </div>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
            Regulatory Tools
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <button 
                onClick={() => setActiveTab('finder')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Standards &amp; QCO Directory</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('schemes')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Certification Schemes Explorer</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('labs')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Cluster Based Test Facilities (CBTF)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('hallmarking')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Gold Hallmarking &amp; HUID Guide</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('consumer')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Consumer Rights &amp; Verification</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('chat')}
                className="hover:text-amber-200 transition-colors flex items-center gap-1.5 font-semibold text-white"
              >
                <ArrowRight className="w-3 h-3 text-bis-red" />
                <span>Ask the AI Assistant</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Resources & Transparency */}
        <div className="md:col-span-2 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
            Resources
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <button 
                onClick={() => setActiveTab('registry')}
                className="hover:text-amber-200 transition-colors"
              >
                Document Registry
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('glossary')}
                className="hover:text-amber-200 transition-colors"
              >
                Regulatory Glossary
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('faq')}
                className="hover:text-amber-200 transition-colors"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('help')}
                className="hover:text-amber-200 transition-colors"
              >
                Help Center
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('sitemap')}
                className="hover:text-amber-200 transition-colors"
              >
                Portal Sitemap
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('evaluator-login')}
                className="hover:text-amber-200 transition-colors font-mono text-[11px] text-amber-300"
              >
                Evaluator Console
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: External Official BIS Portals */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-bis-red" />
            <span>Official Government Portals</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 text-[11px] text-gray-300">
            <p className="text-[10.5px] text-amber-200/90 leading-snug">
              External link notice: You are navigating to official government web properties:
            </p>
            <ul className="space-y-1.5 pt-1 text-xs">
              <li>
                <a 
                  href="https://www.bis.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Bureau of Indian Standards (bis.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.manakonline.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Manakonline e-Services</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://consumeraffairs.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Dept of Consumer Affairs</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://dpiit.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>DPIIT Quality Orders</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* 3. Bottom Legal Links Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5">
          {legalLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveLegalModal(item.id)}
              className="hover:text-white transition-colors underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded"
            >
              {t(item.labelKey)}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('policies')}
            className="text-amber-300 hover:text-white font-semibold transition-colors"
          >
            Website Policies
          </button>
        </div>

        <div className="text-center sm:text-right text-gray-500 font-mono text-[10.5px]">
          © 2026 BIS Intelligence Team · Independent Research Initiative
        </div>
      </div>
    </footer>
  );
};
