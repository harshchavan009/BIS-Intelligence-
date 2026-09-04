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
  | 'registry'
  | 'glossary'
  | 'faq'
  | 'contact'
  | 'analytics' 
  | 'about';

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

export type FontSizeOption = 'small' | 'normal' | 'large';

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
  
  // GIGW Accessibility States
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  screenReaderModalOpen: boolean;
  setScreenReaderModalOpen: (open: boolean) => void;

  // Walkthrough Tour
  tourCompleted: boolean;
  setTourCompleted: (done: boolean) => void;

  // Evaluator Auth
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
}

const getStoredFontSize = (): FontSizeOption => {
  try {
    const saved = localStorage.getItem('bis_font_size');
    if (saved === 'small' || saved === 'normal' || saved === 'large') return saved;
  } catch (e) {}
  return 'normal';
};

const getStoredContrast = (): boolean => {
  try {
    return localStorage.getItem('bis_high_contrast') === 'true';
  } catch (e) {}
  return false;
};

const getStoredTour = (): boolean => {
  try {
    return localStorage.getItem('bis_tour_dismissed') === 'true';
  } catch (e) {}
  return false;
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('bis_evaluator_token') || null;
  } catch (e) {}
  return null;
};

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
  setActiveLegalModal: (activeLegalModal) => set({ activeLegalModal }),

  fontSize: getStoredFontSize(),
  setFontSize: (fontSize) => {
    try {
      localStorage.setItem('bis_font_size', fontSize);
      const root = document.documentElement;
      if (fontSize === 'small') root.style.setProperty('--base-font-size', '14px');
      else if (fontSize === 'large') root.style.setProperty('--base-font-size', '18px');
      else root.style.setProperty('--base-font-size', '16px');
    } catch (e) {}
    set({ fontSize });
  },

  highContrast: getStoredContrast(),
  setHighContrast: (highContrast) => {
    try {
      localStorage.setItem('bis_high_contrast', String(highContrast));
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    } catch (e) {}
    set({ highContrast });
  },

  screenReaderModalOpen: false,
  setScreenReaderModalOpen: (screenReaderModalOpen) => set({ screenReaderModalOpen }),

  tourCompleted: getStoredTour(),
  setTourCompleted: (tourCompleted) => {
    try {
      localStorage.setItem('bis_tour_dismissed', String(tourCompleted));
    } catch (e) {}
    set({ tourCompleted });
  },

  adminToken: getStoredToken(),
  setAdminToken: (adminToken) => {
    try {
      if (adminToken) localStorage.setItem('bis_evaluator_token', adminToken);
      else localStorage.removeItem('bis_evaluator_token');
    } catch (e) {}
    set({ adminToken });
  }
}));
