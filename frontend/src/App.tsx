import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LegalModal } from './components/common/LegalModal';
import { SourcePanel } from './components/common/SourcePanel';
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

export const App: React.FC = () => {
  const { activeTab } = useAppStore();

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans selection:bg-brass selection:text-white">
      <Navbar />

      <main className="flex-1 pb-8">
        {activeTab === 'landing' && <LandingHero />}
        {activeTab === 'chat' && <ChatWorkspace />}
        {activeTab === 'finder' && <StandardsFinder />}
        {activeTab === 'schemes' && <SchemeExplorer />}
        {activeTab === 'labs' && <LabFinder />}
        {activeTab === 'consumer' && <ConsumerMode />}
        {activeTab === 'hallmarking' && <HallmarkingGuide />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'registry' && <DocumentRegistry />}
      </main>

      {/* Persistent Legal Footer (Requirement 2.1) */}
      <Footer />

      {/* Global Interactive Legal Modal (Terms, Privacy, Accessibility, etc.) */}
      <LegalModal />

      {/* Global Source Inspection Panel with Visual Highlight */}
      <SourcePanel />
    </div>
  );
};

export default App;
