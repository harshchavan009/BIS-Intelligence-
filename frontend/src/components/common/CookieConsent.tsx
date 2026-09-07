import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Cookie, ArrowRight, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { cookieConsentDismissed, setCookieConsentDismissed, setActiveTab, language } = useAppStore();

  if (cookieConsentDismissed) return null;

  return (
    <aside 
      aria-label={language === 'hi' ? 'कुकी एवं स्थानीय भंडारण सहमति' : 'Cookie and Local Storage Consent'}
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-[#0B122C]/95 backdrop-blur-md border-t-2 border-brass text-white shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-brass/20 text-brass shrink-0 mt-0.5 sm:mt-0">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold flex items-center gap-2 text-stone-100">
              <span>{language === 'hi' ? 'स्थानीय भंडारण एवं कुकी प्रकटीकरण (GIGW 3.0)' : 'Client Storage & Accessibility Preferences (GIGW 3.0)'}</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                {language === 'hi' ? 'शून्य ट्रैकिंग कुकीज़' : 'Zero Tracking Cookies'}
              </span>
            </div>
            <p className="text-gray-300 text-[11.5px] leading-relaxed max-w-3xl">
              {language === 'hi'
                ? 'यह पोर्टल केवल आपकी सुलभता प्राथमिकताओं (फ़ॉन्ट आकार, उच्च कंट्रास्ट) एवं सत्र स्थिति को बनाए रखने के लिए स्थानीय भंडारण (Local Storage) का उपयोग करता है। हम किसी भी तृतीय-पक्ष विज्ञापन या ट्रैकिंग कुकीज़ का उपयोग नहीं करते हैं।'
                : 'This portal uses browser local storage exclusively to remember your accessibility preferences (text sizing, high-contrast mode) and session state. No third-party marketing, behavioral, or tracking cookies are ever deployed.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setActiveTab('policies')}
            className="px-3 py-1.5 rounded text-gray-300 hover:text-white hover:bg-white/10 text-[11px] font-medium transition-colors underline-offset-2 hover:underline"
          >
            {language === 'hi' ? 'नीति पढ़ें' : 'View Policy'}
          </button>
          <button
            onClick={() => setCookieConsentDismissed(true)}
            className="px-4 py-1.5 bg-brass hover:bg-brass-dark text-white rounded text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'स्वीकार करें' : 'Acknowledge & Accept'}</span>
          </button>
          <button
            onClick={() => setCookieConsentDismissed(true)}
            aria-label={language === 'hi' ? 'सहमति बैनर बंद करें' : 'Dismiss cookie consent'}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
