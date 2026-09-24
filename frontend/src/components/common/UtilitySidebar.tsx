import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Lock, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Globe, 
  Eye, 
  X, 
  Sliders, 
  Sun, 
  Headphones,
  Sparkles
} from 'lucide-react';

export const UtilitySidebar: React.FC = () => {
  const { 
    setActiveTab, 
    setActiveLegalModal, 
    language, 
    setLanguage, 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast,
    setScreenReaderModalOpen
  } = useAppStore();

  const [mobileFabOpen, setMobileFabOpen] = useState(false);
  const [a11yPopoverOpen, setA11yPopoverOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      {/* 1. DESKTOP VERTICAL ICON RAIL (Hidden on mobile < md) */}
      <aside
        aria-label="Quick Utility and Accessibility Rail"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 flex-col bg-bis-navy text-white rounded-l-xl shadow-xl border-l border-y border-white/20 py-2"
      >
        {/* Item 1: Login / Account */}
        <button
          onClick={() => setActiveTab('evaluator-login')}
          className="group relative p-2.5 hover:bg-bis-navy-800 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Evaluator Console & Benchmark Login"
        >
          <Lock className="w-4 h-4 text-amber-300" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-bis-ink text-white text-[11px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            {language === 'hi' ? 'मूल्यांकनकर्ता लॉगिन' : 'Evaluator Login'}
          </span>
        </button>

        {/* Item 2: FAQ */}
        <button
          onClick={() => setActiveTab('faq')}
          className="group relative p-2.5 hover:bg-bis-navy-800 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Frequently Asked Questions"
        >
          <HelpCircle className="w-4 h-4 text-gray-200 group-hover:text-white" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-bis-ink text-white text-[11px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ'}
          </span>
        </button>

        {/* Item 3: Feedback */}
        <button
          onClick={() => setActiveLegalModal('feedback')}
          className="group relative p-2.5 hover:bg-bis-navy-800 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="Submit Platform Feedback"
        >
          <MessageSquare className="w-4 h-4 text-gray-200 group-hover:text-white" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-bis-ink text-white text-[11px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            {language === 'hi' ? 'प्रतिक्रिया' : 'Feedback'}
          </span>
        </button>

        {/* Item 4: Blog / Updates */}
        <button
          onClick={() => setActiveTab('registry')}
          className="group relative p-2.5 hover:bg-bis-navy-800 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label="What's New & Updates"
        >
          <FileText className="w-4 h-4 text-gray-200 group-hover:text-white" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-bis-ink text-white text-[11px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            {language === 'hi' ? 'दस्तावेज व अपडेट्स' : "What's New / Registry"}
          </span>
        </button>

        {/* Item 5: Language Toggle (EN / HI) */}
        <button
          onClick={toggleLanguage}
          className="group relative p-2.5 hover:bg-bis-navy-800 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
        >
          <span className="w-4 h-4 text-[10px] font-bold font-mono text-amber-300 flex items-center justify-center">
            {language === 'en' ? 'हिं' : 'EN'}
          </span>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-bis-ink text-white text-[11px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            {language === 'en' ? 'हिन्दी (Hindi)' : 'अंग्रेजी (EN)'}
          </span>
        </button>

        {/* Item 6: Accessibility Controls Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setA11yPopoverOpen(!a11yPopoverOpen)}
            className={`p-2.5 transition-colors flex items-center justify-center ${
              a11yPopoverOpen || highContrast ? 'bg-amber-400 text-black' : 'hover:bg-bis-navy-800 text-gray-200'
            }`}
            aria-expanded={a11yPopoverOpen}
            aria-label="Toggle Accessibility Preferences"
            title="Accessibility Controls"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Accessibility Popover Panel */}
          {a11yPopoverOpen && (
            <div className="absolute right-full mr-3 bottom-0 bg-white text-bis-ink p-4 rounded-xl shadow-2xl border border-gray-200 w-64 space-y-3 z-50 text-xs animate-in fade-in slide-in-from-right-1 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-bis-navy">Accessibility Settings</span>
                <button
                  onClick={() => setA11yPopoverOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600"
                  aria-label="Close accessibility controls"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Font Size Scaling */}
              <div>
                <div className="text-[11px] text-gray-500 font-medium mb-1">Text Sizing (GIGW 3.0)</div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setFontSize('small')}
                    className={`flex-1 py-1 rounded text-[11px] font-bold ${
                      fontSize === 'small' ? 'bg-bis-navy text-white' : 'text-gray-600 hover:text-bis-ink'
                    }`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`flex-1 py-1 rounded text-[11px] font-bold ${
                      fontSize === 'normal' ? 'bg-bis-navy text-white' : 'text-gray-600 hover:text-bis-ink'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`flex-1 py-1 rounded text-[11px] font-bold ${
                      fontSize === 'large' ? 'bg-bis-navy text-white' : 'text-gray-600 hover:text-bis-ink'
                    }`}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* High Contrast Mode */}
              <div>
                <div className="text-[11px] text-gray-500 font-medium mb-1">Contrast Mode</div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    highContrast 
                      ? 'bg-amber-400 text-black border-amber-500' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{highContrast ? 'Standard Contrast' : 'High Contrast Mode'}</span>
                </button>
              </div>

              {/* Screen Reader Dialog Link */}
              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={() => {
                    setA11yPopoverOpen(false);
                    setScreenReaderModalOpen(true);
                  }}
                  className="w-full text-left text-[11px] text-bis-navy font-semibold hover:underline flex items-center gap-1"
                >
                  <Headphones className="w-3 h-3 text-bis-red" />
                  <span>Screen Reader Information</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE COLLAPSED FLOATING ACTION BUTTON (FAB) (Visible on mobile < md) */}
      <div className="md:hidden fixed right-4 bottom-5 z-40">
        {mobileFabOpen ? (
          <div className="bg-bis-navy text-white p-3 rounded-2xl shadow-2xl border border-white/20 space-y-2 mb-2 w-48 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-white/15">
              <span className="font-bold text-amber-300 text-[11px]">Quick Utilities</span>
              <button onClick={() => setMobileFabOpen(false)} className="p-1 text-gray-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setActiveTab('evaluator-login');
                setMobileFabOpen(false);
              }}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Evaluator Console</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('faq');
                setMobileFabOpen(false);
              }}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-2"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => {
                setActiveLegalModal('feedback');
                setMobileFabOpen(false);
              }}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback</span>
            </button>
            <button
              onClick={() => {
                toggleLanguage();
                setMobileFabOpen(false);
              }}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'अंग्रेजी (EN)'}</span>
            </button>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                setMobileFabOpen(false);
              }}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{highContrast ? 'Standard Contrast' : 'High Contrast'}</span>
            </button>
          </div>
        ) : null}

        <button
          onClick={() => setMobileFabOpen(!mobileFabOpen)}
          className="w-12 h-12 rounded-full bg-bis-navy text-white shadow-xl flex items-center justify-center hover:bg-bis-navy-800 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white border border-white/20"
          aria-label={mobileFabOpen ? 'Close Utilities' : 'Open Quick Utilities'}
          aria-expanded={mobileFabOpen}
        >
          {mobileFabOpen ? <X className="w-6 h-6" /> : <Sliders className="w-5 h-5 text-amber-300" />}
        </button>
      </div>
    </>
  );
};
