import React from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const { t } = useTranslation();

  if (activeTab === 'landing') {
    return (
      <div className="bg-paper-light border-b border-line px-4 sm:px-8 py-2 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 font-medium">
          <span className="flex items-center gap-1 text-ink font-semibold">
            <Home className="w-3.5 h-3.5 text-brass" />
            <span>{t('breadcrumbs.home')}</span>
          </span>
          <span className="text-stone-400">/</span>
          <span className="text-stone-500 font-normal">
            {t('nav.bis_title')} (SIH 2026 Prototype)
          </span>
        </div>
      </div>
    );
  }

  const getPageTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'chat': return t('breadcrumbs.chat');
      case 'finder': return t('breadcrumbs.finder');
      case 'schemes': return t('breadcrumbs.schemes');
      case 'labs': return t('breadcrumbs.labs');
      case 'consumer': return t('breadcrumbs.consumer');
      case 'hallmarking': return t('breadcrumbs.hallmarking');
      case 'registry': return t('breadcrumbs.registry');
      case 'glossary': return t('breadcrumbs.glossary');
      case 'faq': return t('breadcrumbs.faq');
      case 'contact': return t('breadcrumbs.contact');
      case 'analytics': return t('breadcrumbs.analytics');
      case 'about': return t('breadcrumbs.about');
      default: return tab;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-paper-light border-b border-line px-4 sm:px-8 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap text-stone-600">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-1 hover:text-brass transition-colors font-medium hover:underline"
        >
          <Home className="w-3.5 h-3.5 text-stone-500" />
          <span>{t('breadcrumbs.home')}</span>
        </button>

        <ChevronRight className="w-3 h-3 text-stone-400" />

        <span className="text-ink font-semibold" aria-current="page">
          {getPageTitle(activeTab)}
        </span>
      </div>
    </nav>
  );
};
