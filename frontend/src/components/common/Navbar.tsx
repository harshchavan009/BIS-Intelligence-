import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { AccessibilityBar } from './AccessibilityBar';
import { BisIntelligenceLogo } from './BisIntelligenceLogo';
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
  FileText,
  ChevronDown,
  Menu,
  X,
  Lock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  Calendar,
  Compass,
  CheckCircle2,
  Phone
} from 'lucide-react';

type MegaMenuTab = 
  | 'about' 
  | 'standards' 
  | 'conformity' 
  | 'labs' 
  | 'hallmarking' 
  | 'resources' 
  | 'contact' 
  | null;

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setQueryPrefill, 
    setActiveLegalModal, 
    language, 
    setLanguage 
  } = useAppStore();
  const { t } = useTranslation();

  const [activeMega, setActiveMega] = useState<MegaMenuTab>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MegaMenuTab>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mega-menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation & Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMega(null);
        setMobileMenuOpen(false);
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (quickSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [quickSearchOpen]);

  const navigateTo = (tab: ActiveTab) => {
    setActiveTab(tab);
    setActiveMega(null);
    setMobileMenuOpen(false);
    setQuickSearchOpen(false);
  };

  const askAssistantWithPrompt = (promptText: string) => {
    setQueryPrefill(promptText);
    setActiveTab('chat');
    setActiveMega(null);
    setMobileMenuOpen(false);
    setQuickSearchOpen(false);
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) return;
    askAssistantWithPrompt(quickSearchInput.trim());
    setQuickSearchInput('');
  };

  const toggleMega = (tab: MegaMenuTab) => {
    setActiveMega(tab);
  };

  const navItems: { id: MegaMenuTab; label: string; labelHi: string }[] = [
    { id: 'about', label: 'About Us', labelHi: 'परिचय' },
    { id: 'standards', label: 'Standards', labelHi: 'भारतीय मानक' },
    { id: 'conformity', label: 'Conformity Assessment', labelHi: 'अनुरूपता निर्धारण' },
    { id: 'labs', label: 'Laboratory Services', labelHi: 'प्रयोगशाला सेवाएं' },
    { id: 'hallmarking', label: 'Hallmarking', labelHi: 'हॉलमार्किंग' },
    // "Ask the Assistant" is rendered directly as top-level button
    { id: 'resources', label: 'Resources', labelHi: 'संसाधन' },
    { id: 'contact', label: 'Contact Us', labelHi: 'संपर्क करें' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200" ref={navRef}>
      {/* 1. GIGW Accessibility Utility Bar */}
      <AccessibilityBar />

      {/* 2. ROW A: Main Identity & Primary Mega-Navigation (~90px on desktop) */}
      <div className="bg-white text-bis-ink border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[84px] py-2 flex items-center justify-between gap-4">
          
          {/* Left: BIS Intelligence Wordmark + Tagline */}
          <div
            onClick={() => navigateTo('landing')}
            className="cursor-pointer group flex items-center gap-3 min-h-[48px] py-1 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-bis-red rounded-lg pr-2"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo('landing')}
            aria-label="BIS Intelligence Home"
          >
            <BisIntelligenceLogo size={42} showWordmark={false} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-lg sm:text-xl font-sans text-bis-ink group-hover:text-bis-navy transition-colors">
                  BIS Intelligence
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-bis-red text-white">
                  AI
                </span>
              </div>
              <span className="text-[11px] font-medium leading-tight text-gray-600">
                {language === 'hi' ? (
                  <>भारतीय मानक ब्यूरो (BIS) नियामक मार्गदर्शन हेतु स्वतंत्र एआई सहायक</>
                ) : (
                  <>
                    Independent AI Assistant for Indian Standards (BIS) Information
                    <span className="sr-only"> (BUREAU OF INDIAN STANDARDS)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Center/Right: Desktop Mega-Menu Nav (8 Primary Items) */}
          <nav className="hidden xl:flex items-center gap-1 font-sans text-sm font-semibold" aria-label="Main Navigation">
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => toggleMega(item.id)}
                onMouseEnter={() => setActiveMega(item.id)}
                className={`relative px-3 py-2 rounded-md transition-colors flex items-center gap-1 text-[13.5px] ${
                  activeMega === item.id 
                    ? 'text-bis-red bg-red-50/60 font-bold' 
                    : 'text-bis-ink hover:text-bis-navy hover:bg-gray-50'
                }`}
                aria-expanded={activeMega === item.id}
                aria-haspopup="true"
              >
                <span>{language === 'hi' ? item.labelHi : item.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMega === item.id ? 'rotate-180 text-bis-red' : 'text-gray-400'}`} />
                {activeMega === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-bis-red rounded-full" />
                )}
              </button>
            ))}

            {/* Core Feature: ASK THE ASSISTANT (Dedicated top-level item) */}
            <button
              onClick={() => navigateTo('chat')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-[13.5px] font-bold shadow-sm ${
                activeTab === 'chat'
                  ? 'bg-bis-red text-white ring-2 ring-bis-red/40'
                  : 'bg-bis-red/10 text-bis-red hover:bg-bis-red hover:text-white border border-bis-red/30'
              }`}
              title="Open the Independent BIS AI Assistant"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{language === 'hi' ? 'एआई सहायक से पूछें' : 'Ask the Assistant'}</span>
            </button>

            {navItems.slice(5).map(item => (
              <button
                key={item.id}
                onClick={() => toggleMega(item.id)}
                onMouseEnter={() => setActiveMega(item.id)}
                className={`relative px-3 py-2 rounded-md transition-colors flex items-center gap-1 text-[13.5px] ${
                  activeMega === item.id 
                    ? 'text-bis-red bg-red-50/60 font-bold' 
                    : 'text-bis-ink hover:text-bis-navy hover:bg-gray-50'
                }`}
                aria-expanded={activeMega === item.id}
                aria-haspopup="true"
              >
                <span>{language === 'hi' ? item.labelHi : item.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMega === item.id ? 'rotate-180 text-bis-red' : 'text-gray-400'}`} />
                {activeMega === item.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-bis-red rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Far Right: Language toggle + Search icon button + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Trigger */}
            <button
              onClick={() => setQuickSearchOpen(!quickSearchOpen)}
              className="p-2 rounded-full text-bis-ink hover:text-bis-navy hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bis-red"
              aria-label="Search Indian Standards or Ask Assistant"
              title="Quick Search Standards"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-bold border border-bis-navy text-bis-navy hover:bg-bis-navy hover:text-white rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bis-red"
              title="Switch language (EN / HI)"
            >
              {language === 'en' ? 'HI' : 'EN'}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md text-bis-ink hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bis-red"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-bis-red" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Quick Search Popdown Bar */}
      {quickSearchOpen && (
        <div className="bg-bis-navy-800 text-white px-4 py-3 border-t border-white/10 animate-in fade-in duration-150">
          <form onSubmit={handleQuickSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-300 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder="Ask anything or search IS Number (e.g., IS 269, cement QCO, gold hallmarking, CRS)..."
              className="flex-1 bg-white text-bis-ink px-3.5 py-2 rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-bis-red"
            />
            <button
              type="submit"
              className="bg-bis-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
            >
              Ask
            </button>
            <button
              type="button"
              onClick={() => setQuickSearchOpen(false)}
              className="p-2 text-gray-300 hover:text-white"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. ROW B: Navy Secondary Utility Links Bar (~44px) */}
      <div className="bg-bis-navy text-white text-xs font-medium px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto min-h-[44px] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-1">
          <nav className="flex items-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-1">
            <button
              onClick={() => navigateTo('landing')}
              className={`hover:text-amber-200 transition-colors py-1 ${activeTab === 'landing' ? 'text-amber-300 font-bold underline underline-offset-4 decoration-bis-red decoration-2' : 'text-gray-100'}`}
            >
              {language === 'hi' ? 'होम' : 'Home'}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <button
              onClick={() => navigateTo('chat')}
              className={`hover:text-amber-200 transition-colors py-1 ${activeTab === 'chat' ? 'text-amber-300 font-bold underline underline-offset-4 decoration-bis-red decoration-2' : 'text-gray-100'}`}
            >
              {language === 'hi' ? 'एआई सहायक' : 'Chat with Assistant'}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <button
              onClick={() => navigateTo('faq')}
              className={`hover:text-amber-200 transition-colors py-1 ${activeTab === 'faq' ? 'text-amber-300 font-bold underline underline-offset-4 decoration-bis-red decoration-2' : 'text-gray-100'}`}
            >
              {language === 'hi' ? 'लोकप्रिय प्रश्न' : 'Popular Questions'}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <button
              onClick={() => navigateTo('registry')}
              className={`hover:text-amber-200 transition-colors py-1 ${activeTab === 'registry' ? 'text-amber-300 font-bold underline underline-offset-4 decoration-bis-red decoration-2' : 'text-gray-100'}`}
            >
              {language === 'hi' ? 'नया क्या है' : "What's New"}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <button
              onClick={() => navigateTo('analytics')}
              className={`hover:text-amber-200 transition-colors py-1 ${activeTab === 'analytics' ? 'text-amber-300 font-bold underline underline-offset-4 decoration-bis-red decoration-2' : 'text-gray-100'}`}
            >
              {language === 'hi' ? 'एनालिटिक्स' : 'Analytics'}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="text-gray-100 hover:text-amber-200 transition-colors py-1"
            >
              {language === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}
            </button>
            <span className="text-white/30 hidden sm:inline select-none">·</span>
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white transition-colors inline-flex items-center gap-1 font-semibold py-1"
              title="Official Bureau of Indian Standards Website (External Site)"
            >
              <span>{language === 'hi' ? 'बीआईएस लाइब्रेरी' : 'BIS Library'}</span>
              <span className="text-[10px] opacity-80">(external)</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" aria-label="(opens in new window)" />
            </a>
          </nav>

          {/* Right Utility: Evaluator Auth Link */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => navigateTo('evaluator-login')}
              className="inline-flex items-center gap-1.5 text-gray-200 hover:text-amber-300 transition-colors font-mono text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded"
              title="Evaluator & Internal Benchmark Console"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>{language === 'hi' ? 'मूल्यांकनकर्ता लॉगिन' : 'Evaluator Console'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay when any dropdown is active */}
      {activeMega && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity cursor-pointer animate-in fade-in duration-100"
          onClick={() => setActiveMega(null)}
          aria-hidden="true"
        />
      )}

      {/* 4. MEGA-MENU PANELS (Desktop: Opens directly below full nav bar with white background and light shadow) */}
      {activeMega && (
        <div 
          className="hidden xl:block absolute left-0 right-0 top-full bg-white text-bis-ink shadow-2xl border-b border-gray-300 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseLeave={() => setActiveMega(null)}
          role="region"
          aria-label={`${activeMega} mega menu`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">

            {/* TAB 1: ABOUT US (Two columns) */}
            {activeMega === 'about' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-7 space-y-3 border-r border-gray-100 pr-8">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base">
                    <Info className="w-5 h-5 text-bis-red" />
                    <span>About the Assistant</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    BIS Intelligence is an independent AI research project designed to help MSMEs, manufacturers, consumers, and compliance professionals navigate Indian Standards and conformity assessment procedures.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                      <div className="font-bold text-bis-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>What It Does</span>
                      </div>
                      <p className="text-gray-600 leading-normal">
                        Performs hybrid semantic retrieval across gazettes, maps product categories to IS standards, explains Quality Control Orders (QCOs), and calculates CBTF testing concessions.
                      </p>
                    </div>
                    <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 space-y-1">
                      <div className="font-bold text-bis-red flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-bis-red" />
                        <span>What It Doesn't Do</span>
                      </div>
                      <p className="text-gray-600 leading-normal">
                        Does not grant licenses, issue official certificates, or collect government fees. Always verify formal submissions directly at bis.gov.in.
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono pt-1">
                    Data Sources: Official Gazette S.O. 191(E), BIS Act 2016, Manakonline repository · Last Sync: 24 Sept 2026
                  </div>
                </div>

                <div className="col-span-5 space-y-3">
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-400">Quick Navigation</div>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigateTo('finder')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-bis-ink group-hover:text-bis-red text-sm">Standards Finder</div>
                        <div className="text-xs text-gray-500">Search IS numbers and product classifications</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-bis-red transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigateTo('schemes')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-bis-ink group-hover:text-bis-red text-sm">Certification Schemes</div>
                        <div className="text-xs text-gray-500">Scheme-I (ISI), Scheme-II (CRS), and Scheme-IV (CoC)</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-bis-red transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigateTo('hallmarking')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-bis-ink group-hover:text-bis-red text-sm">Hallmarking Guide</div>
                        <div className="text-xs text-gray-500">HUID verification rules and jeweller registration</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-bis-red transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-bis-ink group-hover:text-bis-red text-sm">Branch Offices & Contact</div>
                        <div className="text-xs text-gray-500">Official nodal contact info across all regions</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-bis-red transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STANDARDS (Single column list) */}
            {activeMega === 'standards' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base border-b border-gray-100 pb-2">
                    <Search className="w-5 h-5 text-bis-red" />
                    <span>Indian Standards Catalog & Repository</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => navigateTo('finder')}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Search Standards</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Look up standards by IS code, title, or product description</div>
                    </button>

                    <button
                      onClick={() => navigateTo('registry')}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>New Standards</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Recently formulated standards under Gazette notifications</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("What are the most recently revised Indian Standards and Quality Control Orders in 2025-2026?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Revised Standards</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Amendments, updated test methods, and compliance dates</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("Explain the specifications, testing methods, and mandatory compliance rules for IS 269 Ordinary Portland Cement.")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Standard of the Week: IS 269</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Deep dive into Ordinary Portland Cement (OPC 33, 43, 53)</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("How can I purchase or download official Indian Standards from the BIS portal?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Download Indian Standards</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Guidance on accessing standards from the Manakonline portal</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("List the 15 Technical Departments of BIS (e.g. Civil, Electrotechnical, Food, Chemical) and their standard domains.")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Technical Departments</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Civil, Electrotechnical, Chemical, Mechanical & Food divisions</div>
                    </button>
                  </div>
                </div>

                <div className="col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-bold text-bis-navy uppercase tracking-wider">Quick Action</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Need instant confirmation whether your product falls under mandatory certification or voluntary standards?
                  </p>
                  <button
                    onClick={() => navigateTo('finder')}
                    className="w-full bg-bis-navy hover:bg-bis-navy-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Open Standards Finder Tool</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CONFORMITY ASSESSMENT (Five columns matching BIS's own structure) */}
            {activeMega === 'conformity' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base">
                    <Layers className="w-5 h-5 text-bis-red" />
                    <span>Conformity Assessment Schemes (5 BIS Pillars)</span>
                  </div>
                  <button
                    onClick={() => navigateTo('schemes')}
                    className="text-xs font-bold text-bis-red hover:underline inline-flex items-center gap-1"
                  >
                    <span>Compare All Schemes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  {/* Col 1: Product Certification (ISI Mark) */}
                  <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 space-y-2">
                    <div className="font-bold text-sm text-bis-navy border-b border-gray-200 pb-1.5">
                      1. Product Certification
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">Scheme-I (ISI Mark)</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is an overview of BIS Scheme-I Product Certification (ISI Mark)?")} className="hover:text-bis-red transition-colors text-left">
                          • Overview & Scope
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the step-by-step application and factory audit process for ISI Mark Scheme-I?")} className="hover:text-bis-red transition-colors text-left">
                          • Grant Process
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are the application fees, marking fees, and MSME concessions for ISI mark certification?")} className="hover:text-bis-red transition-colors text-left">
                          • Fee Structure & MSME
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are the most common questions regarding Scheme-I ISI Mark surveillance and renewals?")} className="hover:text-bis-red transition-colors text-left">
                          • Scheme FAQ
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Systems Certification */}
                  <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 space-y-2">
                    <div className="font-bold text-sm text-bis-navy border-b border-gray-200 pb-1.5">
                      2. Systems Certification
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">MSCD Management Systems</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What management systems does BIS certify (ISO 9001 QMS, ISO 14001 EMS, ISO 22000 FSMS)?")} className="hover:text-bis-red transition-colors text-left">
                          • Overview (QMS/EMS)
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the two-stage audit process for BIS Management Systems Certification?")} className="hover:text-bis-red transition-colors text-left">
                          • Audit Process
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the assessment fee structure for BIS Quality Management Systems certification?")} className="hover:text-bis-red transition-colors text-left">
                          • Fee Guidelines
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("How does BIS Systems Certification differ from private certification bodies?")} className="hover:text-bis-red transition-colors text-left">
                          • Systems FAQ
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: FMCS */}
                  <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 space-y-2">
                    <div className="font-bold text-sm text-bis-navy border-b border-gray-200 pb-1.5">
                      3. FMCS Certification
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">Foreign Manufacturers Scheme</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the Foreign Manufacturers Certification Scheme (FMCS) and who is eligible?")} className="hover:text-bis-red transition-colors text-left">
                          • FMCS Overview
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the role of an Authorized Indian Representative (AIR) under BIS FMCS?")} className="hover:text-bis-red transition-colors text-left">
                          • AIR & Process
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are the inspection charges and performance bank guarantee for foreign manufacturers?")} className="hover:text-bis-red transition-colors text-left">
                          • Foreign Fees & PBG
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are common compliance pitfalls for overseas factories applying for BIS FMCS?")} className="hover:text-bis-red transition-colors text-left">
                          • FMCS FAQ
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 4: Registration Scheme (CRS) */}
                  <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 space-y-2">
                    <div className="font-bold text-sm text-bis-navy border-b border-gray-200 pb-1.5">
                      4. Registration Scheme
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">CRS for Electronics & IT</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What products fall under the Compulsory Registration Scheme (CRS) under MeitY and BIS?")} className="hover:text-bis-red transition-colors text-left">
                          • CRS Overview
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the self-declaration and test report submission procedure for BIS CRS?")} className="hover:text-bis-red transition-colors text-left">
                          • Self-Declaration Process
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are the official registration and renewal fees for BIS CRS electronics?")} className="hover:text-bis-red transition-colors text-left">
                          • CRS Fee Schedule
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the 90-day validity rule for test reports submitted for CRS registration?")} className="hover:text-bis-red transition-colors text-left">
                          • Test Report & FAQ
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Col 5: Scheme-X Certification */}
                  <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 space-y-2">
                    <div className="font-bold text-sm text-bis-navy border-b border-gray-200 pb-1.5">
                      5. Scheme-X Certification
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">Heavy Machinery & Capital Goods</div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is BIS Scheme-X and how does it apply to heavy industrial machinery and capital goods?")} className="hover:text-bis-red transition-colors text-left">
                          • Scheme-X Overview
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What is the design appraisal and witness testing process under Scheme-X?")} className="hover:text-bis-red transition-colors text-left">
                          • Technical Appraisal
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("What are the cost structures and batch inspection charges under Scheme-X?")} className="hover:text-bis-red transition-colors text-left">
                          • Cost Schedule
                        </button>
                      </li>
                      <li>
                        <button onClick={() => askAssistantWithPrompt("How does Scheme-X certification simplify customs clearance for project imports?")} className="hover:text-bis-red transition-colors text-left">
                          • Scheme-X FAQ
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LABORATORY SERVICES (Two columns) */}
            {activeMega === 'labs' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6 space-y-3 border-r border-gray-100 pr-8">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base">
                    <FlaskConical className="w-5 h-5 text-bis-red" />
                    <span>Laboratory Services Overview</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    BIS operates a network of testing laboratories across India, anchored by the Central Laboratory at Sahibabad (Ghaziabad) and 4 Regional Laboratories in Mumbai, Kolkata, Chennai, and Chandigarh.
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <button
                      onClick={() => askAssistantWithPrompt("What testing capabilities exist across the BIS Central Laboratory and Regional Laboratories?")}
                      className="w-full text-left p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-bis-ink">Central & Regional Laboratories</div>
                        <div className="text-gray-500">Chemical, electrical, mechanical, and microbiological testing disciplines</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => askAssistantWithPrompt("How does sample collection, dispatch, and witness testing operate under BIS market surveillance?")}
                      className="w-full text-left p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-bis-ink">Sample Testing & Surveillance</div>
                        <div className="text-gray-500">Factory sample testing and market purchase verification protocols</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="col-span-6 space-y-3">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-bis-red" />
                    <span>Lab Recognition Scheme (LRS) & MSME CBTF</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Under the Laboratory Recognition Scheme (LRS), BIS recognizes accredited third-party laboratories. Additionally, Cluster Based Test Facilities (CBTF) provide MSMEs with shared test apparatus.
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <button
                      onClick={() => navigateTo('labs')}
                      className="w-full text-left p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-bis-ink">Cluster Based Test Facilities (CBTF) Finder</div>
                        <div className="text-gray-500">Explore shared testing equipment concessions for small enterprises</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-bis-red" />
                    </button>
                    <button
                      onClick={() => askAssistantWithPrompt("What are the criteria for a commercial laboratory to gain BIS recognition under LRS 2020?")}
                      className="w-full text-left p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-bis-ink">LRS Recognition Guidelines</div>
                        <div className="text-gray-500">NABL accreditation alignment, audit cycle, and renewal norms</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HALLMARKING (Single column list) */}
            {activeMega === 'hallmarking' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base border-b border-gray-100 pb-2">
                    <Gem className="w-5 h-5 text-bis-red" />
                    <span>Gold & Silver Hallmarking System</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => navigateTo('hallmarking')}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Overview & Mandatory Districts</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Phased rollout across Indian districts for gold jewelry</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("What are the statutory provisions of the Hallmarking of Gold Jewellery and Gold Artefacts Order, 2020?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Hallmarking Regulation</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Legal requirements under the Bureau of Indian Standards Act</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("How does the 6-digit alphanumeric HUID (Hallmark Unique Identification) ensure consumer authenticity?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>HUID (Unique Identification)</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Laser inscription, tracking, and verification via BIS Care app</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("What is the zero-fee online registration process for jewelers selling hallmarked gold in India?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Jewellers Registration</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Automatic generation of registration certificate on Manakonline</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("What are the recognition and accreditation requirements for Gold Refineries and AHCs?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Gold Refinery & AHCs</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Assaying & Hallmarking Centre operating procedures</div>
                    </button>

                    <button
                      onClick={() => askAssistantWithPrompt("What are the consumer rights, purity testing charges, and compensation rules for sub-standard hallmarked gold?")}
                      className="p-3 text-left rounded-lg border border-gray-100 hover:border-bis-red/40 hover:bg-red-50/30 transition-all group"
                    >
                      <div className="font-bold text-sm text-bis-ink group-hover:text-bis-red flex items-center justify-between">
                        <span>Hallmarking FAQ & Redressal</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Consumer testing rights (₹45 fee) and compensation mechanisms</div>
                    </button>
                  </div>
                </div>

                <div className="col-span-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Hallmarking Purity Marks</div>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="p-2 bg-white rounded border border-amber-200 flex items-center justify-between">
                      <span className="font-bold text-bis-ink">24K Gold</span>
                      <span className="font-mono font-bold text-amber-800">999 Purity</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-amber-200 flex items-center justify-between">
                      <span className="font-bold text-bis-ink">22K Gold</span>
                      <span className="font-mono font-bold text-amber-800">916 Purity</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-amber-200 flex items-center justify-between">
                      <span className="font-bold text-bis-ink">18K Gold</span>
                      <span className="font-mono font-bold text-amber-800">750 Purity</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-amber-200 flex items-center justify-between">
                      <span className="font-bold text-bis-ink">14K Gold</span>
                      <span className="font-mono font-bold text-amber-800">585 Purity</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('hallmarking')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    View Interactive Hallmarking Guide
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: RESOURCES */}
            {activeMega === 'resources' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base border-b border-gray-100 pb-2">
                    <BookOpen className="w-5 h-5 text-bis-red" />
                    <span>Regulatory Intelligence Resources & Tools</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                      onClick={() => navigateTo('registry')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Document Registry</div>
                      <div className="text-xs text-gray-500">Search 1,340+ official gazettes, circulars & QCO orders</div>
                    </button>
                    <button
                      onClick={() => navigateTo('glossary')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Regulatory Glossary</div>
                      <div className="text-xs text-gray-500">Plain-language definitions of BIS, CRS, CoC, and HUID terms</div>
                    </button>
                    <button
                      onClick={() => navigateTo('faq')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Frequently Asked Questions</div>
                      <div className="text-xs text-gray-500">Curated answers for manufacturers, MSMEs, and consumers</div>
                    </button>
                    <button
                      onClick={() => navigateTo('consumer')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Consumer Verification</div>
                      <div className="text-xs text-gray-500">How to verify ISI Marks, R-numbers, and HUID via BIS Care</div>
                    </button>
                    <button
                      onClick={() => navigateTo('help')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Platform Help Center</div>
                      <div className="text-xs text-gray-500">Non-technical user guide and citation verification tips</div>
                    </button>
                    <button
                      onClick={() => navigateTo('sitemap')}
                      className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-1"
                    >
                      <div className="font-bold text-sm text-bis-ink">Portal Sitemap</div>
                      <div className="text-xs text-gray-500">Complete hierarchy of routes, guides, and tools</div>
                    </button>
                  </div>
                </div>

                <div className="col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-bold text-bis-navy uppercase tracking-wider">Statutory Policies</div>
                  <div className="space-y-1.5 text-xs">
                    <button
                      onClick={() => navigateTo('policies')}
                      className="w-full text-left py-1 text-gray-700 hover:text-bis-red transition-colors flex items-center justify-between"
                    >
                      <span>Website Policies & Terms</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveLegalModal('privacy')}
                      className="w-full text-left py-1 text-gray-700 hover:text-bis-red transition-colors flex items-center justify-between"
                    >
                      <span>Privacy & Data Protection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveLegalModal('accessibility')}
                      className="w-full text-left py-1 text-gray-700 hover:text-bis-red transition-colors flex items-center justify-between"
                    >
                      <span>GIGW 3.0 & WCAG Statement</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setActiveLegalModal('hyperlinking')}
                      className="w-full text-left py-1 text-gray-700 hover:text-bis-red transition-colors flex items-center justify-between"
                    >
                      <span>Hyperlinking Policy</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: CONTACT US */}
            {activeMega === 'contact' && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-7 space-y-3 border-r border-gray-100 pr-8">
                  <div className="flex items-center gap-2 text-bis-navy font-bold text-base">
                    <Phone className="w-5 h-5 text-bis-red" />
                    <span>Official BIS Regional Offices & Grievance</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Need to escalate a regulatory inquiry or submit formal documentation to a nodal officer? Access official addresses, emails, and helpdesk phone lines across North, South, East, West, and Central zones.
                  </p>
                  <button
                    onClick={() => navigateTo('contact')}
                    className="bg-bis-navy hover:bg-bis-navy-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>View All Branch Offices & Helpdesks</span>
                  </button>
                </div>

                <div className="col-span-5 space-y-3">
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-400">Headquarters Details</div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1.5 text-gray-700">
                    <div className="font-bold text-bis-navy">Bureau of Indian Standards (Headquarters)</div>
                    <div>Manak Bhavan, 9 Bahadur Shah Zafar Marg</div>
                    <div>New Delhi 110002, India</div>
                    <div className="pt-1 text-[11px] text-gray-500">Telephone: +91-11-23230131 · Portal: www.bis.gov.in</div>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveLegalModal('feedback')}
                      className="text-xs text-bis-red hover:underline font-bold"
                    >
                      Submit Feedback on this AI Platform »
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. MOBILE ACCORDION DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white text-bis-ink border-b border-gray-200 max-h-[80vh] overflow-y-auto p-4 space-y-2">
          {/* Ask the Assistant Mobile Hero CTA */}
          <button
            onClick={() => navigateTo('chat')}
            className="w-full bg-bis-red text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask the AI Assistant</span>
          </button>

          {/* Nav Items Accordions */}
          {navItems.map(item => (
            <div key={item.id} className="border-b border-gray-100 pb-1">
              <button
                onClick={() => setMobileAccordion(mobileAccordion === item.id ? null : item.id)}
                className="w-full py-2.5 px-2 flex items-center justify-between text-left font-semibold text-sm text-bis-ink hover:text-bis-red"
              >
                <span>{language === 'hi' ? item.labelHi : item.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === item.id ? 'rotate-180 text-bis-red' : 'text-gray-400'}`} />
              </button>

              {mobileAccordion === item.id && (
                <div className="pl-4 pr-2 py-2 space-y-2 bg-gray-50 rounded-lg text-xs">
                  {item.id === 'about' && (
                    <>
                      <p className="text-gray-600 mb-2">Independent AI research assistant for Indian Standards and conformity assessment.</p>
                      <button onClick={() => navigateTo('finder')} className="block py-1 text-bis-navy font-medium">Standards Finder</button>
                      <button onClick={() => navigateTo('schemes')} className="block py-1 text-bis-navy font-medium">Certification Schemes</button>
                      <button onClick={() => navigateTo('contact')} className="block py-1 text-bis-navy font-medium">Contact Branches</button>
                    </>
                  )}
                  {item.id === 'standards' && (
                    <>
                      <button onClick={() => navigateTo('finder')} className="block py-1 text-bis-navy font-medium">Search Standards</button>
                      <button onClick={() => navigateTo('registry')} className="block py-1 text-bis-navy font-medium">New & Revised Standards</button>
                      <button onClick={() => askAssistantWithPrompt("Explain the specifications of IS 269 Ordinary Portland Cement.")} className="block py-1 text-bis-navy font-medium">Standard of the Week: IS 269</button>
                    </>
                  )}
                  {item.id === 'conformity' && (
                    <>
                      <button onClick={() => navigateTo('schemes')} className="block py-1 text-bis-navy font-medium font-bold">Compare All Schemes</button>
                      <button onClick={() => askAssistantWithPrompt("What is the process for Scheme-I ISI Mark certification?")} className="block py-1 text-bis-navy font-medium">1. Scheme-I (ISI Mark)</button>
                      <button onClick={() => askAssistantWithPrompt("How does Scheme-II CRS registration work for electronics?")} className="block py-1 text-bis-navy font-medium">2. Scheme-II (CRS)</button>
                      <button onClick={() => askAssistantWithPrompt("What are the rules for FMCS foreign manufacturer certification?")} className="block py-1 text-bis-navy font-medium">3. FMCS Foreign Scheme</button>
                    </>
                  )}
                  {item.id === 'labs' && (
                    <>
                      <button onClick={() => navigateTo('labs')} className="block py-1 text-bis-navy font-medium">Cluster Based Test Facilities (CBTF)</button>
                      <button onClick={() => askAssistantWithPrompt("What is the BIS Laboratory Recognition Scheme (LRS)?")} className="block py-1 text-bis-navy font-medium">Lab Recognition Scheme (LRS)</button>
                    </>
                  )}
                  {item.id === 'hallmarking' && (
                    <>
                      <button onClick={() => navigateTo('hallmarking')} className="block py-1 text-bis-navy font-medium">Hallmarking Overview & Guide</button>
                      <button onClick={() => askAssistantWithPrompt("How do I verify 6-digit HUID code on gold jewelry?")} className="block py-1 text-bis-navy font-medium">HUID Verification</button>
                      <button onClick={() => askAssistantWithPrompt("What is the zero-fee jeweler registration process?")} className="block py-1 text-bis-navy font-medium">Jewellers Registration</button>
                    </>
                  )}
                  {item.id === 'resources' && (
                    <>
                      <button onClick={() => navigateTo('registry')} className="block py-1 text-bis-navy font-medium">Document Registry</button>
                      <button onClick={() => navigateTo('glossary')} className="block py-1 text-bis-navy font-medium">Regulatory Glossary</button>
                      <button onClick={() => navigateTo('faq')} className="block py-1 text-bis-navy font-medium">Frequently Asked Questions</button>
                      <button onClick={() => navigateTo('sitemap')} className="block py-1 text-bis-navy font-medium">Portal Sitemap</button>
                    </>
                  )}
                  {item.id === 'contact' && (
                    <>
                      <button onClick={() => navigateTo('contact')} className="block py-1 text-bis-navy font-medium">Branch Offices Directory</button>
                      <button onClick={() => setActiveLegalModal('feedback')} className="block py-1 text-bis-navy font-medium">Submit Platform Feedback</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Evaluator Auth Mobile */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <button
              onClick={() => navigateTo('evaluator-login')}
              className="text-bis-navy font-bold flex items-center gap-1.5 py-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-bis-red" />
              <span>Evaluator Login</span>
            </button>
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-bis-red flex items-center gap-1"
            >
              <span>BIS Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
