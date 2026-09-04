import React, { useState } from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { X, ChevronRight, ChevronLeft, Sparkles, Check, Info } from 'lucide-react';

interface TourStep {
  tab: ActiveTab;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  badgeEn: string;
  badgeHi: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    tab: 'landing',
    titleEn: 'Welcome to the BIS Intelligent Assistant',
    titleHi: 'बीआईएस एआई सहायक में आपका स्वागत है',
    descEn: 'This portal provides verified, clause-grounded regulatory guidance on Indian Standards, factory licensing, and consumer rights under the Bureau of Indian Standards.',
    descHi: 'यह पोर्टल भारतीय मानकों, कारखाना लाइसेंसिंग और उपभोक्ता अधिकारों पर सत्यापित, खंड-आधारित नियामक मार्गदर्शन प्रदान करता है।',
    badgeEn: 'Step 1 of 4: Introduction',
    badgeHi: 'चरण 1 / 4: परिचय'
  },
  {
    tab: 'finder',
    titleEn: 'Standards Finder & Mandatory QCOs',
    titleHi: 'मानक खोज एवं अनिवार्य QCO',
    descEn: 'Search 40+ structured Indian Standards across our 7-document pilot corpus by keyword or product name. Instantly see if a Quality Control Order (QCO) makes certification legally mandatory for your goods.',
    descHi: 'हमारे 7-दस्तावेज़ पायलट कॉर्पस में 40+ भारतीय मानकों में खोजें। तुरंत जानें कि क्या कोई गुणवत्ता नियंत्रण आदेश (QCO) आपके उत्पाद के लिए प्रमाणन कानूनी रूप से अनिवार्य बनाता है।',
    badgeEn: 'Step 2 of 4: Standards Lookup',
    badgeHi: 'चरण 2 / 4: मानक खोज'
  },
  {
    tab: 'schemes',
    titleEn: 'Certification Schemes (Scheme-I, II, IV)',
    titleHi: 'प्रमाणन योजनाएं (योजना-I, II, IV)',
    descEn: 'Compare product certification options: Scheme-I (Full factory ISI mark), Scheme-II (Electronics CRO registration), and Scheme-IV (Certificate of Conformity for batches).',
    descHi: 'प्रमाणन विकल्पों की तुलना करें: योजना-I (पूर्ण कारखाना ISI मार्क), योजना-II (इलेक्ट्रॉनिक्स सीआरओ पंजीकरण), और योजना-IV (खेप हेतु अनुरूपता प्रमाण पत्र)।',
    badgeEn: 'Step 3 of 4: Scheme Selection',
    badgeHi: 'चरण 3 / 4: योजना चयन'
  },
  {
    tab: 'labs',
    titleEn: 'Lab Finder & Cluster Facilities (CBTF)',
    titleHi: 'लैब खोज एवं क्लस्टर सुविधाएं (CBTF)',
    descEn: 'Cluster Based Test Facilities (CBTF) allow MSMEs to share expensive laboratory testing equipment across a 25–50 km radius, saving up to 70% on capital costs.',
    descHi: 'क्लस्टर आधारित परीक्षण सुविधाएं (CBTF) एमएसएमई को 25-50 किमी के दायरे में महंगी परीक्षण प्रयोगशालाएं साझा करने की अनुमति देती हैं, जिससे 70% तक पूंजी बचती है।',
    badgeEn: 'Step 4 of 4: MSME Facilities',
    badgeHi: 'चरण 4 / 4: एमएसएमई सुविधाएं'
  }
];

export const TourGuide: React.FC = () => {
  const { tourCompleted, setTourCompleted, setActiveTab } = useAppStore();
  const { language } = useTranslation();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (tourCompleted) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setTourCompleted(true);
    } else {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setActiveTab(TOUR_STEPS[nextIdx].tab);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      setActiveTab(TOUR_STEPS[prevIdx].tab);
    }
  };

  const handleDismiss = () => {
    setTourCompleted(true);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-md w-full p-1 animate-in slide-in-from-bottom-5 duration-300"
      role="dialog"
      aria-label="Interactive Portal Tour"
    >
      <div className="bg-indigo-deep text-white rounded-lg shadow-2xl border-2 border-brass/50 overflow-hidden">
        {/* Top bar */}
        <div className="bg-ink/80 px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs">
          <span className="text-brass font-mono font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? currentStep.badgeHi : currentStep.badgeEn}
          </span>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            title="Dismiss Tour"
            aria-label="Dismiss Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-bold font-serif-standard text-white">
            {language === 'hi' ? currentStep.titleHi : currentStep.titleEn}
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {language === 'hi' ? currentStep.descHi : currentStep.descEn}
          </p>

          {/* Dots progress indicator */}
          <div className="flex items-center gap-1.5 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIdx ? 'w-6 bg-brass' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="bg-ink/90 px-4 py-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {language === 'hi' ? 'टूर छोड़ें' : 'Skip Tour'}
          </button>

          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-white/10 text-white rounded hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पिछला' : 'Back'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-brass text-white font-semibold rounded hover:bg-brass-dark transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>
                {isLast 
                  ? (language === 'hi' ? 'समझ गया!' : 'Got it!') 
                  : (language === 'hi' ? 'अगला' : 'Next')}
              </span>
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              {isLast && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
