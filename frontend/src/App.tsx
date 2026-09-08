import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/common/Navbar';
import { Breadcrumbs } from './components/common/Breadcrumbs';
import { Footer } from './components/common/Footer';
import { LegalModal } from './components/common/LegalModal';
import { SourcePanel } from './components/common/SourcePanel';
import { ScreenReaderModal } from './components/common/ScreenReaderModal';
import { TourGuide } from './components/common/TourGuide';
import { LandingHero } from './components/landing/LandingHero';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { CookieConsent } from './components/common/CookieConsent';

// Code-split heavy secondary views so landing & chat load instantly with minimal initial bundle
const StandardsFinder = React.lazy(() => import('./components/features/StandardsFinder').then(m => ({ default: m.StandardsFinder })));
const SchemeExplorer = React.lazy(() => import('./components/features/SchemeExplorer').then(m => ({ default: m.SchemeExplorer })));
const LabFinder = React.lazy(() => import('./components/features/LabFinder').then(m => ({ default: m.LabFinder })));
const ConsumerMode = React.lazy(() => import('./components/features/ConsumerMode').then(m => ({ default: m.ConsumerMode })));
const HallmarkingGuide = React.lazy(() => import('./components/features/HallmarkingGuide').then(m => ({ default: m.HallmarkingGuide })));
const AnalyticsView = React.lazy(() => import('./components/features/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const EvaluatorLogin = React.lazy(() => import('./components/auth/EvaluatorLogin').then(m => ({ default: m.EvaluatorLogin })));
const AboutPage = React.lazy(() => import('./components/features/AboutPage').then(m => ({ default: m.AboutPage })));
const DocumentRegistry = React.lazy(() => import('./components/features/DocumentRegistry').then(m => ({ default: m.DocumentRegistry })));
const GlossaryPage = React.lazy(() => import('./components/features/GlossaryPage').then(m => ({ default: m.GlossaryPage })));
const FAQPage = React.lazy(() => import('./components/features/FAQPage').then(m => ({ default: m.FAQPage })));
const BranchContact = React.lazy(() => import('./components/features/BranchContact').then(m => ({ default: m.BranchContact })));
const WebsitePolicies = React.lazy(() => import('./components/features/WebsitePolicies').then(m => ({ default: m.WebsitePolicies })));
const HelpPage = React.lazy(() => import('./components/features/HelpPage').then(m => ({ default: m.HelpPage })));
const SitemapPage = React.lazy(() => import('./components/features/SitemapPage').then(m => ({ default: m.SitemapPage })));

const ViewLoader: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3 font-sans">
    <div className="w-8 h-8 border-3 border-brass border-t-transparent rounded-full animate-spin mx-auto" />
    <p className="text-xs font-mono text-stone-500">Loading BIS Regulatory Module...</p>
  </div>
);

export const App: React.FC = () => {
  const { activeTab, setActiveTab, fetchEvalBenchmark, fontSize, highContrast, language } = useAppStore();

  React.useEffect(() => {
    fetchEvalBenchmark();
  }, [fetchEvalBenchmark]);

  // Support direct route or hash for /evaluator-login or /evaluator-console or /internal/analytics
  React.useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('evaluator-login') || hash.includes('evaluator-login')) {
        setActiveTab('evaluator-login');
      } else if (
        path.includes('evaluator') || 
        path.includes('internal/analytics') || 
        hash.includes('evaluator') || 
        hash.includes('internal/analytics') ||
        hash.includes('analytics')
      ) {
        setActiveTab('analytics');
      }
    };
    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, [setActiveTab]);

  // Synchronize persistent GIGW accessibility preferences to document root
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
    root.setAttribute('data-fontsize', fontSize);
  }, [highContrast, fontSize]);

  return (
    <div className={`min-h-screen flex flex-col bg-paper text-ink transition-colors duration-150`}>
      {/* Authentic GIGW 3.0 Skip to main content link - Guaranteed #1 Focusable Element in DOM */}
      <a href="#main-content" className="skip-link">
        {language === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* Authentic High-Contrast Switch & GIGW Direct Header */}
      <Navbar />

      {/* Orientation Breadcrumbs on every page */}
      <Breadcrumbs />

      {/* Authentic Skip Target with id="main-content" */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-8 focus:outline-none">
        {activeTab === 'landing' && <LandingHero />}
        {activeTab === 'chat' && <ChatWorkspace />}
        
        <React.Suspense fallback={<ViewLoader />}>
          {activeTab === 'evaluator-login' && (
            <div className="py-8">
              <EvaluatorLogin onSuccess={() => setActiveTab('analytics')} />
            </div>
          )}
          {activeTab === 'finder' && <StandardsFinder />}
          {activeTab === 'schemes' && <SchemeExplorer />}
          {activeTab === 'labs' && <LabFinder />}
          {activeTab === 'consumer' && <ConsumerMode />}
          {activeTab === 'hallmarking' && <HallmarkingGuide />}
          {activeTab === 'glossary' && <GlossaryPage />}
          {activeTab === 'faq' && <FAQPage />}
          {activeTab === 'contact' && <BranchContact />}
          {activeTab === 'policies' && <WebsitePolicies />}
          {activeTab === 'help' && <HelpPage />}
          {activeTab === 'sitemap' && <SitemapPage />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'about' && <AboutPage />}
          {activeTab === 'registry' && <DocumentRegistry />}
        </React.Suspense>
      </main>

      {/* Persistent GIGW Disclosures & Legal Footer */}
      <Footer />

      {/* Global Interactive Legal Modal (Terms, Privacy, Accessibility, etc.) */}
      <LegalModal />

      {/* Global Source Inspection Panel with Visual Clause Highlight */}
      <SourcePanel />

      {/* GIGW Screen Reader Access Modal */}
      <ScreenReaderModal />

      {/* Dismissible First-Visit Interactive Walkthrough Tour */}
      <TourGuide />

      {/* GIGW 3.0 Mandatory Cookie & Local Storage Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default App;
