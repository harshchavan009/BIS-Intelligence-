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

export const App: React.FC = () => {
  const { activeTab } = useAppStore();

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans selection:bg-brass selection:text-white">
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
    </div>
  );
};

export default App;
