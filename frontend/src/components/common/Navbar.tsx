import React from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { AccessibilityBar } from './AccessibilityBar';
import { SealMotif } from './SealMotif';
import { 
  MessageSquare, 
  Search, 
  Layers, 
  FlaskConical, 
  ShieldCheck, 
  Gem, 
  BarChart3, 
  BookOpen, 
  HelpCircle, 
  Building2,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const { t, language } = useTranslation();

  const navItems: { id: ActiveTab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'landing', labelKey: 'nav.home', icon: <SealMotif size={16} /> },
    { id: 'chat', labelKey: 'nav.assistant', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'finder', labelKey: 'nav.standards_finder', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'schemes', labelKey: 'nav.schemes', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'labs', labelKey: 'nav.labs', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'consumer', labelKey: 'nav.consumer_rights', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'hallmarking', labelKey: 'nav.hallmarking', icon: <Gem className="w-3.5 h-3.5" /> },
    { id: 'glossary', labelKey: 'nav.glossary', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'faq', labelKey: 'nav.faq', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'contact', labelKey: 'nav.contact', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'registry', labelKey: 'nav.doc_registry', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'analytics', labelKey: 'nav.analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'about', labelKey: 'nav.about', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-indigo-deep text-white shadow-md border-b border-white/10">
      {/* 1. GIGW Accessibility Utility Bar */}
      <AccessibilityBar />

      {/* 2. Ministry / Government Identity Bar */}
      <div className="bg-ink text-gray-300 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-brass font-medium">{t('nav.gov_india')}</span>
          <span className="text-gray-500">|</span>
          <span className="hidden sm:inline">{t('nav.ministry')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t('nav.prototype_badge')}
          </span>
        </div>
      </div>

      {/* 3. Main Brand Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark with Seal */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group mobile-touch-target"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveTab('landing')}
          aria-label="Bureau of Indian Standards Home"
        >
          <div className="p-1 rounded bg-white/5 border border-brass/30 group-hover:border-brass transition-colors">
            <SealMotif size={34} />
          </div>
          <div>
            <div className="text-[13px] sm:text-[14px] font-bold tracking-tight text-white flex items-center gap-2 font-serif-standard">
              <span>{t('nav.bis_title')}</span>
              <span className="hidden sm:inline text-[10px] text-brass font-mono px-1.5 py-0.2 bg-brass/10 border border-brass/30 rounded">
                {t('nav.motto')}
              </span>
            </div>
            <div className="text-[11px] text-gray-300 font-light tracking-wide">
              {t('nav.subtitle')}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full Navigation Tabs Bar (Scrollable on Mobile with proper touch targets) */}
      <nav 
        className="bg-indigo-deep-dark/80 border-t border-white/10 px-4 sm:px-8 overflow-x-auto scrollbar-none"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-1.5 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all mobile-touch-target ${
                  isActive
                    ? 'bg-brass text-white shadow-sm font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
