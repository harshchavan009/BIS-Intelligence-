import React, { useState, useRef, useEffect } from 'react';
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
  FileText,
  ChevronDown,
  Menu,
  X,
  Lock,
  ExternalLink,
  Shield,
  Scale
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const { t, language } = useTranslation();

  const [openDropdown, setOpenDropdown] = useState<'services' | 'resources' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const servicesItems: { id: ActiveTab; labelKey: string; descEn: string; descHi: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'finder',
      labelKey: 'nav.standards_finder',
      descEn: 'Search product descriptions, IS numbers, and mandatory QCO gazette orders',
      descHi: 'उत्पाद का नाम, IS नंबर और अनिवार्य QCO राजपत्र आदेश खोजें',
      icon: Search
    },
    {
      id: 'schemes',
      labelKey: 'nav.schemes',
      descEn: 'Compare Scheme-I (ISI), Scheme-II (CRO), Scheme-IV (CoC), and MSME CBTF',
      descHi: 'योजना-I (ISI), योजना-II (CRO), योजना-IV (CoC) और एमएसएमई CBTF की तुलना करें',
      icon: Layers
    },
    {
      id: 'labs',
      labelKey: 'nav.labs',
      descEn: 'Cluster Based Test Facilities (CBTF) & recognized testing apparatus for MSMEs',
      descHi: 'क्लस्टर आधारित परीक्षण सुविधाएं (CBTF) एवं एमएसएमई इन-हाउस उपकरण',
      icon: FlaskConical
    },
    {
      id: 'consumer',
      labelKey: 'nav.consumer_rights',
      descEn: 'Inspect genuine ISI mark features, simulated CM/L license verification, and BIS Care complaints',
      descHi: 'असली ISI मार्क विशेषताएं, CM/L लाइसेंस सत्यापन और उपभोक्ता शिकायतें',
      icon: ShieldCheck
    },
    {
      id: 'hallmarking',
      labelKey: 'nav.hallmarking',
      descEn: '6-digit alphanumeric HUID verification, gold purity standards, and hallmarking rules',
      descHi: '6-अंकीय HUID सत्यापन, स्वर्ण शुद्धता मानक और हॉलमार्किंग नियम',
      icon: Gem
    }
  ];

  const resourcesItems: { id: ActiveTab; labelKey: string; descEn: string; descHi: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'glossary',
      labelKey: 'nav.glossary',
      descEn: 'Institutional definitions for standards, schemes, and conformity assessment terms',
      descHi: 'मानकों, योजनाओं और अनुरूपता मूल्यांकन शब्दों की सरल परिभाषाएं',
      icon: BookOpen
    },
    {
      id: 'faq',
      labelKey: 'nav.faq',
      descEn: 'Answers to frequently asked questions on licensing, testing, and QCO enforcement',
      descHi: 'लाइसेंसिंग, परीक्षण और QCO प्रवर्तन पर अक्सर पूछे जाने वाले प्रश्नों के उत्तर',
      icon: HelpCircle
    },
    {
      id: 'registry',
      labelKey: 'nav.doc_registry',
      descEn: 'Transparent catalog of all 7 indexed official gazettes, schemes, and regulatory PDFs',
      descHi: 'सूचकांकित सभी 7 आधिकारिक राजपत्रों, योजनाओं और विनियमों की सूची',
      icon: FileText
    },
    {
      id: 'policies',
      labelKey: 'nav.policies',
      descEn: 'Terms of Use, Privacy, Accessibility (GIGW 3.0), Hyperlinking, and RTI disclosures',
      descHi: 'उपयोग की शर्तें, गोपनीयता, सुगमता (GIGW 3.0), हाइपरलिंकिंग और RTI प्रकटीकरण',
      icon: Scale
    }
  ];

  const isServicesActive = ['finder', 'schemes', 'labs', 'consumer', 'hallmarking'].includes(activeTab);
  const isResourcesActive = ['glossary', 'faq', 'registry', 'policies'].includes(activeTab);

  const navigateTo = (tab: ActiveTab) => {
    setActiveTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-indigo-deep text-white shadow-md border-b border-white/10" ref={dropdownRef}>
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

      {/* 3. Main Brand & Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark with Seal */}
        <div 
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-3 cursor-pointer group min-h-[44px] select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigateTo('landing')}
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

        {/* Mobile Hamburger Toggle Button (min 44×44px touch target) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 flex items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brass"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Desktop Mega-Menu Navigation Bar (Structured into 7 Clean Groupings) */}
      <nav 
        className="hidden lg:block bg-indigo-deep-dark/90 border-t border-white/10 px-4 sm:px-8 relative"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1 text-xs">
          {/* Home */}
          <button
            onClick={() => navigateTo('landing')}
            className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'landing'
                ? 'bg-brass text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <SealMotif size={14} />
            <span>{t('nav.home')}</span>
          </button>

          {/* AI Assistant */}
          <button
            onClick={() => navigateTo('chat')}
            className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-brass text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('nav.assistant')}</span>
          </button>

          {/* Services Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
              className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                isServicesActive || openDropdown === 'services'
                  ? 'bg-brass text-white shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              aria-haspopup="true"
              aria-expanded={openDropdown === 'services'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('nav.services')}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>

            {/* Services Mega-Menu Dropdown Panel */}
            {openDropdown === 'services' && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white text-ink rounded-lg shadow-paper-lg border border-line p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 border-b border-line/60">
                  {language === 'hi' ? 'मानक एवं प्रमाणन सेवाएं' : 'Standards & Certification Services'}
                </div>
                <div className="py-1 space-y-0.5">
                  {servicesItems.map((item) => {
                    const Icon = item.icon;
                    const isCur = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full text-left p-2.5 rounded-md transition-colors flex items-start gap-3 ${
                          isCur ? 'bg-paper-dark border-l-2 border-brass' : 'hover:bg-paper'
                        }`}
                        role="menuitem"
                      >
                        <div className={`p-1.5 rounded ${isCur ? 'bg-brass text-white' : 'bg-paper text-indigo-deep'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs font-semibold ${isCur ? 'text-brass font-bold' : 'text-ink'}`}>
                            {t(item.labelKey)}
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug line-clamp-1">
                            {language === 'hi' ? item.descHi : item.descEn}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                isResourcesActive || openDropdown === 'resources'
                  ? 'bg-brass text-white shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              aria-haspopup="true"
              aria-expanded={openDropdown === 'resources'}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('nav.resources')}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>

            {/* Resources Mega-Menu Dropdown Panel */}
            {openDropdown === 'resources' && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white text-ink rounded-lg shadow-paper-lg border border-line p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 border-b border-line/60">
                  {language === 'hi' ? 'नियामक संदर्भ एवं नीतियां' : 'Regulatory References & Governance'}
                </div>
                <div className="py-1 space-y-0.5">
                  {resourcesItems.map((item) => {
                    const Icon = item.icon;
                    const isCur = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full text-left p-2.5 rounded-md transition-colors flex items-start gap-3 ${
                          isCur ? 'bg-paper-dark border-l-2 border-brass' : 'hover:bg-paper'
                        }`}
                        role="menuitem"
                      >
                        <div className={`p-1.5 rounded ${isCur ? 'bg-brass text-white' : 'bg-paper text-indigo-deep'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs font-semibold ${isCur ? 'text-brass font-bold' : 'text-ink'}`}>
                            {t(item.labelKey)}
                          </div>
                          <div className="text-[11px] text-gray-500 leading-snug line-clamp-1">
                            {language === 'hi' ? item.descHi : item.descEn}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact Branches */}
          <button
            onClick={() => navigateTo('contact')}
            className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'bg-brass text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('nav.contact')}</span>
          </button>

          {/* About */}
          <button
            onClick={() => navigateTo('about')}
            className={`px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-brass text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('nav.about')}</span>
          </button>

          {/* Analytics (Keep separate and last, evaluator auth-gated) */}
          <button
            onClick={() => navigateTo('analytics')}
            className={`ml-auto px-3 py-2 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-verified-green text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Evaluator Telemetry & Evaluation Harness (Auth-Gated)"
          >
            <Lock className="w-3 h-3 text-brass" />
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('nav.analytics')}</span>
          </button>
        </div>
      </nav>

      {/* 5. Mobile Drawer Navigation Overlay (<1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content Panel */}
          <div className="relative w-4/5 max-w-sm bg-indigo-deep text-white h-full shadow-2xl overflow-y-auto flex flex-col z-10 border-r border-white/10">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SealMotif size={24} />
                <span className="font-serif font-bold text-sm text-white">BIS AI Portal</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items */}
            <div className="p-4 space-y-4 flex-1">
              {/* Primary Fast Links */}
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('landing')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded text-xs font-semibold min-h-[44px] ${
                    activeTab === 'landing' ? 'bg-brass text-white' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <SealMotif size={18} />
                  <span>{t('nav.home')}</span>
                </button>
                <button
                  onClick={() => navigateTo('chat')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded text-xs font-semibold min-h-[44px] ${
                    activeTab === 'chat' ? 'bg-brass text-white' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-brass" />
                  <span>{t('nav.assistant')}</span>
                </button>
              </div>

              {/* Services Group */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-brass">
                  {t('nav.services')}
                </div>
                {servicesItems.map((item) => {
                  const Icon = item.icon;
                  const isCur = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs min-h-[44px] text-left transition-colors ${
                        isCur ? 'bg-brass text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-brass" />
                      <span className="truncate">{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Resources Group */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-brass">
                  {t('nav.resources')}
                </div>
                {resourcesItems.map((item) => {
                  const Icon = item.icon;
                  const isCur = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs min-h-[44px] text-left transition-colors ${
                        isCur ? 'bg-brass text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-brass" />
                      <span className="truncate">{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Static Links & Evaluator Analytics */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <button
                  onClick={() => navigateTo('contact')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs min-h-[44px] ${
                    activeTab === 'contact' ? 'bg-brass text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-brass" />
                  <span>{t('nav.contact')}</span>
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs min-h-[44px] ${
                    activeTab === 'about' ? 'bg-brass text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-brass" />
                  <span>{t('nav.about')}</span>
                </button>
                <button
                  onClick={() => navigateTo('analytics')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs min-h-[44px] ${
                    activeTab === 'analytics' ? 'bg-verified-green text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{t('nav.analytics')} (Evaluator Only)</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Notice */}
            <div className="p-3 bg-ink text-[10px] text-gray-400 font-mono border-t border-white/10 text-center">
              SIH 2026 Submission Prototype • GIGW 3.0
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
