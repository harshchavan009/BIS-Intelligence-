import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { Headphones, Eye, Sun, Calendar, Globe } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast, 
    setScreenReaderModalOpen,
    language,
    setLanguage
  } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="bg-[#0b1120] text-gray-300 text-[11px] border-b border-white/10 px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
      {/* Authentic Skip to main content (GIGW mandatory) */}
      <a href="#main-content" className="skip-link">
        {t('a11y.skip_to_content')}
      </a>

      {/* Left controls: Screen Reader & Typography scaling */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {/* Screen Reader Access */}
        <button
          onClick={() => setScreenReaderModalOpen(true)}
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors underline-offset-2 hover:underline focus:outline-none"
          title={t('a11y.screen_reader_access')}
        >
          <Headphones className="w-3 h-3 text-brass" />
          <span className="hidden xs:inline sm:inline">{t('a11y.screen_reader_access')}</span>
          <span className="sm:hidden text-[10px]">Reader</span>
        </button>

        <span className="text-white/20 hidden sm:inline">|</span>

        {/* Text Size Controls: A- A A+ */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-1 py-0.5" role="group" aria-label="Text Size Controls">
          <button
            onClick={() => setFontSize('small')}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
              fontSize === 'small' ? 'bg-brass text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Decrease Font Size (14px)"
            aria-pressed={fontSize === 'small'}
          >
            {t('a11y.decrease_text')}
          </button>
          <button
            onClick={() => setFontSize('normal')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
              fontSize === 'normal' ? 'bg-brass text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Standard Font Size (16px)"
            aria-pressed={fontSize === 'normal'}
          >
            {t('a11y.normal_text')}
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-1.5 py-0.5 rounded text-[12px] font-bold transition-colors ${
              fontSize === 'large' ? 'bg-brass text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Increase Font Size (18px)"
            aria-pressed={fontSize === 'large'}
          >
            {t('a11y.increase_text')}
          </button>
        </div>

        <span className="text-white/20 hidden sm:inline">|</span>

        {/* High Contrast Mode Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
            highContrast 
              ? 'bg-[#FFD700] text-black border-[#FFD700] font-bold shadow-sm' 
              : 'bg-white/5 text-gray-300 border-white/15 hover:text-white hover:border-white/30'
          }`}
          title="Toggle High Contrast for Low Vision"
          aria-pressed={highContrast}
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">{highContrast ? t('a11y.standard_contrast') : t('a11y.high_contrast')}</span>
          <span className="sm:hidden text-[10px]">{highContrast ? 'STD' : 'HC'}</span>
        </button>
      </div>

      {/* Right controls: Last Updated & Language Switcher */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Page Last Updated Date (GIGW convention) */}
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono hidden md:flex">
          <Calendar className="w-3 h-3 text-brass/70" />
          <span>{t('a11y.last_updated')}</span>
        </div>

        <span className="text-white/20 hidden md:inline">|</span>

        {/* Bilingual Language Switcher */}
        <div className="flex items-center bg-white/5 border border-white/15 rounded p-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
              language === 'en' ? 'bg-brass text-white shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
            aria-pressed={language === 'en'}
          >
            <Globe className="w-2.5 h-2.5" />
            <span>English</span>
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              language === 'hi' ? 'bg-brass text-white shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
            aria-pressed={language === 'hi'}
          >
            <span>हिंदी</span>
          </button>
        </div>
      </div>
    </div>
  );
};
