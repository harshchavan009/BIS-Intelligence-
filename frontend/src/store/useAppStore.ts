import { create } from 'zustand';

export interface SourceCitation {
  document_title: string;
  source_file: string;
  clause_ref: string;
  page_number: number;
  excerpt: string;
  grounded: boolean;
  score?: number;
}

export type ActiveTab = 
  | 'landing' 
  | 'chat' 
  | 'finder' 
  | 'schemes' 
  | 'labs' 
  | 'consumer' 
  | 'hallmarking' 
  | 'analytics' 
  | 'about' 
  | 'registry';

export type LegalModalType = 
  | 'terms' 
  | 'privacy' 
  | 'accessibility' 
  | 'hyperlinking' 
  | 'copyright' 
  | 'sitemap' 
  | 'feedback' 
  | 'grievance' 
  | null;

interface AppState {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSource: SourceCitation | null;
  setSelectedSource: (source: SourceCitation | null) => void;
  isSourceDrawerOpen: boolean;
  setIsSourceDrawerOpen: (open: boolean) => void;
  queryPrefill: string;
  setQueryPrefill: (query: string) => void;
  openSource: (source: SourceCitation) => void;
  activeLegalModal: LegalModalType;
  setActiveLegalModal: (modal: LegalModalType) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  activeTab: 'landing',
  setActiveTab: (activeTab) => set({ activeTab }),
  selectedSource: null,
  setSelectedSource: (selectedSource) => set({ selectedSource }),
  isSourceDrawerOpen: false,
  setIsSourceDrawerOpen: (isSourceDrawerOpen) => set({ isSourceDrawerOpen }),
  queryPrefill: '',
  setQueryPrefill: (queryPrefill) => set({ queryPrefill }),
  openSource: (source: SourceCitation) => set({ selectedSource: source, isSourceDrawerOpen: true }),
  activeLegalModal: null,
  setActiveLegalModal: (activeLegalModal) => set({ activeLegalModal })
}));
