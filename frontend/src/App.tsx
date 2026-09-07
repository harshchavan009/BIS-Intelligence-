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
import { StandardsFinder } from './components/features/StandardsFinder';
import { SchemeExplorer } from './components/features/SchemeExplorer';
import { LabFinder } from './components/features/LabFinder';
import { ConsumerMode } from './components/features/ConsumerMode';
import { HallmarkingGuide } from './components/features/HallmarkingGuide';
import { AnalyticsView } from './components/features/AnalyticsView';
import { AboutPage } from './components/features/AboutPage';
import { DocumentRegistry } from './components/features/DocumentRegistry';
import { GlossaryPage } from './components/features/GlossaryPage';
import { FAQPage } from './components/features/FAQPage';
import { BranchContact } from './components/features/BranchContact';
import { WebsitePolicies } from './components/features/WebsitePolicies';
import { HelpPage } from './components/features/HelpPage';
import { SitemapPage } from './components/features/SitemapPage';
import { CookieConsent } from './components/common/CookieConsent';

export const App: React.FC = () => {
  const { activeTab, fetchEvalBenchmark, fontSize, highContrast, language } = useAppStore();

  React.useEffect(() => {
    fetchEvalBenchmark();
  }, [fetchEvalBenchmark]);

  // Synchronize persistent GIGW accessibility preferences to document root
  React.useEffect(() => {
    try {
      const root = document.documentElement;
      if (fontSize === 'small') root.style.setProperty('--base-font-size', '14px');
      else if (fontSize === 'large') root.style.setProperty('--base-font-size', '18px');
      else root.style.setProperty('--base-font-size', '16px');

      if (highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
    } catch (e) {}
  }, [fontSize, highContrast]);

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans selection:bg-brass selection:text-white">
      {/* Authentic GIGW 3.0 Skip to main content link - Guaranteed #1 Focusable Element in DOM */}
      <a href="#main-content" className="skip-link">
        {language === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* GIGW Accessible Header & Navigation */}
      <Navbar />

      {/* Orientation Breadcrumbs on every page */}
      <Breadcrumbs />

      {/* Authentic Skip Target with id="main-content" */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-8 focus:outline-none">
        {activeTab === 'landing' && <LandingHero />}
        {activeTab === 'chat' && <ChatWorkspace />}
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
