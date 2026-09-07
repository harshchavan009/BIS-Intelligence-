import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { X, Eye, Headphones, CheckCircle2, Volume2, ExternalLink } from 'lucide-react';

export const ScreenReaderModal: React.FC = () => {
  const { screenReaderModalOpen, setScreenReaderModalOpen } = useAppStore();
  const { t, language } = useTranslation();

  if (!screenReaderModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="screen-reader-title"
    >
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-2xl border border-line overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-indigo-deep text-white px-6 py-4 flex items-center justify-between border-b border-brass/30">
          <div className="flex items-center gap-2.5">
            <Headphones className="w-5 h-5 text-brass" />
            <h2 id="screen-reader-title" className="text-base font-semibold">
              {t('a11y.screen_reader_title')}
            </h2>
          </div>
          <button
            onClick={() => setScreenReaderModalOpen(false)}
            aria-label={t('a11y.screen_reader_close')}
            className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-ink text-sm leading-relaxed">
          <p className="text-stone-700 font-medium">
            {t('a11y.screen_reader_desc')}
          </p>

          <div className="bg-paper-light border border-line rounded p-4 space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-brass flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {language === 'hi' ? 'समर्थित स्क्रीन रीडर्स एवं सेटअप गाइड' : 'Supported Screen Readers & Setup Guidance'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-white rounded border border-line/60 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-ink block">NVDA (Windows)</span>
                  <span className="text-stone-500 text-[11px]">Free & Open Source</span>
                </div>
                <a
                  href="https://www.nvaccess.org/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-deep hover:text-brass font-medium underline"
                  aria-label="Download NVDA Screen Reader (external link)"
                >
                  <span>Download NVDA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-3 bg-white rounded border border-line/60 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-ink block">JAWS (Windows)</span>
                  <span className="text-stone-500 text-[11px]">Commercial Standard</span>
                </div>
                <a
                  href="https://www.freedomscientific.com/products/software/jaws/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-deep hover:text-brass font-medium underline"
                  aria-label="Freedom Scientific JAWS Software (external link)"
                >
                  <span>JAWS Official Info</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-3 bg-white rounded border border-line/60 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-ink block">VoiceOver</span>
                  <span className="text-stone-500 text-[11px]">macOS & iOS Built-in</span>
                </div>
                <span className="text-[10.5px] text-stone-600 font-mono">
                  Cmd + F5 to activate
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-ink">
              {language === 'hi' ? 'कीबोर्ड नेविगेशन शॉर्टकट' : 'Keyboard Navigation & Landmark Structure'}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>
                <strong>Tab / Shift+Tab:</strong> {language === 'hi' ? 'सभी इंटरैक्टिव बटन और इनपुट के बीच घूमें।' : 'Move forwards and backwards through focusable interactive elements.'}
              </li>
              <li>
                <strong>Skip to Content:</strong> {language === 'hi' ? 'पेज लोड होने पर Tab दबाकर सीधे मुख्य सामग्री पर पहुंचें।' : 'Press Tab immediately after page load to bypass navigation and jump straight to #main-content.'}
              </li>
              <li>
                <strong>Text Sizing:</strong> {language === 'hi' ? 'शीर्ष उपयोगिता बार में A-, A, A+ का उपयोग कर पाठ का आकार 14px, 16px, या 18px करें।' : 'Use A-, A, A+ in the top utility bar to set site-wide base typography from 14px to 18px.'}
              </li>
              <li>
                <strong>High Contrast:</strong> {language === 'hi' ? 'उच्च कंट्रास्ट टॉगल करें जो कम दृष्टि वाले उपयोगकर्ताओं हेतु रंगों को अनुकूलित करता है।' : 'Toggle High Contrast mode to maximize readability with pure black backgrounds and high-visibility gold/white text.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-line flex justify-end">
          <button
            onClick={() => setScreenReaderModalOpen(false)}
            className="px-4 py-1.5 bg-indigo-deep text-white text-xs font-medium rounded hover:bg-ink transition-colors"
          >
            {t('a11y.screen_reader_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
