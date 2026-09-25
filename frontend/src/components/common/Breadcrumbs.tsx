import React from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const { t } = useTranslation();

  if (activeTab === 'landing') {
    return (
      <nav aria-label="Breadcrumb" className="bg-surface-alt border-b border-border px-4 sm:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 font-medium text-text-secondary">
          <span className="flex items-center gap-1 text-text-primary font-semibold" aria-current="page">
            <Home className="w-3.5 h-3.5 text-brand-primary" />
            <span>{t('breadcrumbs.home')}</span>
          </span>
        </div>
      </nav>
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
      case 'policies': return t('breadcrumbs.policies');
      case 'help': return t('breadcrumbs.help');
      case 'sitemap': return t('breadcrumbs.sitemap');
      case 'analytics': return t('breadcrumbs.analytics');
      case 'about': return t('breadcrumbs.about');
      default: return tab;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-surface-alt border-b border-border px-4 sm:px-8 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap text-text-secondary">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-1 hover:text-brand-primary transition-colors font-medium hover:underline"
        >
          <Home className="w-3.5 h-3.5 text-text-secondary" />
          <span>{t('breadcrumbs.home')}</span>
        </button>

        <ChevronRight className="w-3 h-3 text-text-secondary/60" />

        <span className="text-text-primary font-semibold" aria-current="page">
          {getPageTitle(activeTab)}
        </span>
      </div>
    </nav>
  );
};
