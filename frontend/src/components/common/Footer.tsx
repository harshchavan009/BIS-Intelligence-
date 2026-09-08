import React from 'react';
import { useAppStore, LegalModalType } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { SealMotif } from './SealMotif';
import { ShieldCheck, ExternalLink, Info, Monitor, CheckCircle2 } from 'lucide-react';

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
    <footer className="bg-ink text-gray-300 border-t border-brass/20 text-xs font-sans mt-auto">
      {/* GIGW Legible Prototype Disclaimer Notice Banner */}
      <div className="bg-[#172033] border-b border-brass/30 px-4 sm:px-8 py-3 text-gray-200">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-brass shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-[13px] font-medium leading-normal text-amber-200/90">
            {t('footer.prototype_disclaimer')}
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10">
        {/* Col 1: Identity & Mandatory Management Disclosure */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <SealMotif size={32} />
            <div>
              <div className="font-serif font-bold text-white text-sm tracking-wide">
                {t('nav.bis_title')}
              </div>
              <div className="text-[11px] text-brass font-mono">
                {t('nav.motto')} | {language === 'hi' ? 'राष्ट्रीय मानक निकाय' : 'The National Standards Body of India'}
              </div>
            </div>
          </div>

          {/* GIGW Content Management and Review Disclosures */}
          <div className="bg-white/5 border border-white/10 rounded-md p-3 space-y-1.5 text-[11.5px]">
            <div className="font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{t('footer.managed_by')}</span>
            </div>
            <div className="text-gray-400 font-mono text-[11px]">
              {language === 'hi' ? 'अंतिम समीक्षा तिथि: ' : 'Last Reviewed On: '}
              {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="pt-1.5 border-t border-white/10 flex items-center gap-2 text-emerald-400 font-mono text-[10.5px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'सुरक्षा ऑडिटेड (सिम्युलेटेड) | STQC पैनलबद्ध प्रारूप' : 'Security Audited (Simulated) | STQC Empanelled Format'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bureau of Indian Standards AI Consultation Platform</span>
          </div>
        </div>

        {/* Col 2: Transparent Architecture Links */}
        <div className="md:col-span-3 space-y-2">
          <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            {language === 'hi' ? 'सिस्टम पारदर्शिता एवं नेविगेशन' : 'System Transparency & Docs'}
          </div>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li>
              <button 
                onClick={() => setActiveTab('help')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{language === 'hi' ? 'सहायता केंद्र एवं मार्गदर्शिका' : 'Help Center & Citizen Guide'}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('sitemap')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{language === 'hi' ? 'श्रेणीबद्ध साइटमैप' : 'Portal Sitemap'}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('about')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.about')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('registry')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.doc_registry')} (7 Official PDFs)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('glossary')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.glossary')} (Plain Language)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('faq')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.faq')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('contact')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.contact')}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="hover:text-brass transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
              >
                <span>{t('nav.analytics')} (Evaluator Console)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Official Government Portals & External Registry Links */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-brass" />
            <span>{language === 'hi' ? 'आधिकारिक सरकारी पोर्टल एवं बाहरी लिंक' : 'Official Government Portals'}</span>
          </div>

          <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2 text-[11px] text-gray-300">
            <p className="text-[10.5px] text-amber-300/80 leading-snug">
              {language === 'hi'
                ? 'बाहरी लिंक सूचना: आप बीआईएस इंटेलिजेंस पोर्टल छोड़ रहे हैं और एक आधिकारिक भारत सरकार की वेबसाइट पर पुनर्निर्देशित किए जा रहे हैं।'
                : 'External link notice: You are leaving the BIS Intelligence Portal and being redirected to an official Government of India portal.'}
            </p>
            <ul className="space-y-1.5 pt-1 text-xs">
              <li>
                <a 
                  href="https://www.bis.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Bureau of Indian Standards (bis.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.manakonline.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Manakonline e-Governance (manakonline.in)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.bis.gov.in/the-bureau/bis-care-app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>BIS-CARE Consumer Verification App</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://standardsbis.bsbedge.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>National Standards Portal (standardsbis.bsbedge.com)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://consumeraffairs.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>Department of Consumer Affairs (consumeraffairs.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://dpiit.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>DPIIT Quality Control Orders (dpiit.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.india.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brass transition-colors inline-flex items-center gap-1.5 text-gray-200"
                >
                  <span>National Portal of India (india.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-brass/70 shrink-0" />
                </a>
              </li>
            </ul>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-emerald-400 font-mono text-[10.5px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? 'GIGW 3.0 एवं WCAG 2.1 AA दिशानिर्देशों के अनुरूप' : 'Built to GIGW 3.0 & WCAG 2.1 AA Guidelines'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Links Bar: Consolidated Website Policies Hub & RTI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5">
          <button
            onClick={() => setActiveTab('policies')}
            className="text-brass hover:text-white font-semibold underline-offset-2 hover:underline transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brass rounded"
          >
            <span>{language === 'hi' ? 'वेबसाइट नीतियां (शर्तें / गोपनीयता / सुगमता / सुरक्षा)' : 'Website Policies (Terms / Privacy / Security / GIGW)'}</span>
          </button>
          <span className="text-gray-600 select-none">•</span>
          <button
            onClick={() => setActiveTab('policies')}
            className="hover:text-white hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-brass rounded"
          >
            <span>{language === 'hi' ? 'सूचना का अधिकार (RTI)' : 'Right to Information (RTI)'}</span>
          </button>
          <span className="text-gray-600 select-none">•</span>
          <a
            href="https://rti.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brass transition-colors inline-flex items-center gap-0.5"
          >
            <span>rti.gov.in</span>
            <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
          </a>
          <span className="text-gray-600 select-none">•</span>
          <button
            onClick={() => setActiveTab('sitemap')}
            className="hover:text-white hover:underline transition-colors"
          >
            {t('footer.sitemap')}
          </button>
          <span className="text-gray-600 select-none">•</span>
          <button
            onClick={() => setActiveTab('help')}
            className="hover:text-white hover:underline transition-colors"
          >
            {language === 'hi' ? 'सहायता केंद्र' : 'Help Center'}
          </button>
          <span className="text-gray-600 select-none">•</span>
          <button
            onClick={() => setActiveLegalModal('feedback')}
            className="hover:text-white hover:underline transition-colors"
          >
            {t('footer.feedback')}
          </button>
          <span className="text-gray-600 select-none">•</span>
          <button
            onClick={() => setActiveLegalModal('grievance')}
            className="hover:text-white hover:underline transition-colors"
          >
            {t('footer.grievance')}
          </button>
        </div>

        <div className="text-gray-400 text-[11px] font-mono select-none text-center sm:text-right">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};
