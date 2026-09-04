import React from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { SealMotif } from './SealMotif';
import { MessageSquare, Search, Layers, FlaskConical, ShieldCheck, Gem, BarChart3, Globe, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, language, setLanguage } = useAppStore();

  const navItems: { id: ActiveTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { id: 'landing', labelEn: 'Home', labelHi: 'होम', icon: <SealMotif size={16} /> },
    { id: 'chat', labelEn: 'Assistant', labelHi: 'एआई सहायक', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'finder', labelEn: 'Standards Finder', labelHi: 'मानक खोज', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'schemes', labelEn: 'Schemes', labelHi: 'प्रमाणन योजनाएं', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'labs', labelEn: 'Lab Finder (CBTF)', labelHi: 'लैब खोज', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'consumer', labelEn: 'Consumer Rights', labelHi: 'उपभोक्ता अधिकार', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'hallmarking', labelEn: 'Hallmarking', labelHi: 'हॉलमार्किंग', icon: <Gem className="w-3.5 h-3.5" /> },
    { id: 'registry', labelEn: 'Doc Registry', labelHi: 'दस्तावेज रजिस्ट्री', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'analytics', labelEn: 'Analytics', labelHi: 'एनालिटिक्स', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'about', labelEn: 'About', labelHi: 'परिचय', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-indigo-deep text-white shadow-md border-b border-white/10">
      {/* Top micro-banner */}
      <div className="bg-ink text-gray-300 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-brass font-medium">GOVERNMENT OF INDIA</span>
          <span className="text-gray-500">|</span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SIH 2026 Submission Prototype (Local Offline / Online)
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark with Seal */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-1 rounded bg-white/5 border border-brass/30 group-hover:border-brass transition-colors">
            <SealMotif size={32} />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-tight text-white flex items-center gap-2">
              <span>BUREAU OF INDIAN STANDARDS</span>
              <span className="hidden sm:inline text-[10px] text-brass font-mono px-1.5 py-0.2 bg-brass/10 border border-brass/30 rounded">
                मानक: पथप्रदर्शक:
              </span>
            </div>
            <div className="text-[11px] text-gray-300 font-light tracking-wide">
              {language === 'hi' ? 'भारतीय मानक ब्यूरो — आधिकारिक एआई सहायक' : 'AI Assistant for Indian Standards & Conformity Assessment'}
            </div>
          </div>
        </div>

        {/* Action Controls: Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-indigo-deep-dark border border-white/15 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-brass text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>EN</span>
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                language === 'hi'
                  ? 'bg-brass text-white shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>हिंदी</span>
            </button>
          </div>
        </div>
      </div>

      {/* Capability Tabs Bar */}
      <nav className="bg-indigo-deep-dark/60 border-t border-white/10 px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brass text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
