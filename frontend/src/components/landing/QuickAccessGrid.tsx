import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  ShieldCheck, 
  Gem, 
  Search, 
  FileText, 
  Layers, 
  Hash, 
  HelpCircle, 
  Headphones, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface QuickCard {
  id: string;
  title: string;
  desc: string;
  bgToken: 'bg-card-lavender' | 'bg-card-peach' | 'bg-card-mint' | 'bg-card-pink';
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  primaryAction: {
    label: string;
    action: () => void;
  };
  secondaryAction?: {
    label: string;
    action: () => void;
  };
}

export const QuickAccessGrid: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const { t, language } = useTranslation();

  const cards: QuickCard[] = [
    {
      id: 'isi-mark',
      title: t('quick_access.cards.isi-mark.title'),
      desc: t('quick_access.cards.isi-mark.desc'),
      bgToken: 'bg-card-lavender',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-bis-navy',
      primaryAction: {
        label: t('quick_access.cards.isi-mark.primary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'मैं योजना-I के तहत बीआईएस ISI मार्क के लिए कैसे आवेदन करूं और कारखाने में परीक्षण की क्या पूर्व-शर्तें हैं?'
            : 'How do I apply for the BIS ISI Mark under Scheme-I and what are the factory testing prerequisites?'
          );
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: t('quick_access.cards.isi-mark.secondary'),
        action: () => setActiveTab('schemes')
      }
    },
    {
      id: 'hallmarking',
      title: t('quick_access.cards.hallmarking.title'),
      desc: t('quick_access.cards.hallmarking.desc'),
      bgToken: 'bg-card-peach',
      icon: Gem,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      primaryAction: {
        label: t('quick_access.cards.hallmarking.primary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'मैं सोने के आभूषणों पर 6-अंकीय HUID संख्या का सत्यापन कैसे कर सकता हूं और यह चिह्न क्या प्रमाणित करता है?'
            : 'How can I verify a 6-digit HUID number on gold jewelry and what does the mark certify?'
          );
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: t('quick_access.cards.hallmarking.secondary'),
        action: () => setActiveTab('hallmarking')
      }
    },
    {
      id: 'qco-lookup',
      title: t('quick_access.cards.qco-lookup.title'),
      desc: t('quick_access.cards.qco-lookup.desc'),
      bgToken: 'bg-card-mint',
      icon: Search,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-800',
      primaryAction: {
        label: t('quick_access.cards.qco-lookup.primary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'क्या मेरा उत्पाद बीआईएस अधिनियम की धारा 16 के तहत जारी अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) के अंतर्गत आता है?'
            : 'Is my product covered under a mandatory Quality Control Order (QCO) issued under Section 16 of the BIS Act?'
          );
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: t('quick_access.cards.qco-lookup.secondary'),
        action: () => setActiveTab('finder')
      }
    },
    {
      id: 'latest-updates',
      title: t('quick_access.cards.latest-updates.title'),
      desc: t('quick_access.cards.latest-updates.desc'),
      bgToken: 'bg-card-pink',
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-800',
      primaryAction: {
        label: t('quick_access.cards.latest-updates.primary'),
        action: () => setActiveTab('registry')
      },
      secondaryAction: {
        label: t('quick_access.cards.latest-updates.secondary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'हाल के भारतीय मानक अद्यतनों और तकनीकी समिति के निर्णयों का सारांश प्रस्तुत करें।'
            : 'Summarize the most recent Indian Standards updates and technical committee decisions.'
          );
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'crs-status',
      title: t('quick_access.cards.crs-status.title'),
      desc: t('quick_access.cards.crs-status.desc'),
      bgToken: 'bg-card-mint',
      icon: Layers,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-800',
      primaryAction: {
        label: t('quick_access.cards.crs-status.primary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'योजना-II के तहत आईटी/इलेक्ट्रॉनिक उत्पादों के लिए बीआईएस CRS पंजीकरण प्राप्त करने की प्रक्रिया क्या है?'
            : 'What is the procedure for obtaining a BIS CRS registration for IT/electronic products under Scheme-II?'
          );
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: t('quick_access.cards.crs-status.secondary'),
        action: () => setActiveTab('schemes')
      }
    },
    {
      id: 'find-by-number',
      title: t('quick_access.cards.find-by-number.title'),
      desc: t('quick_access.cards.find-by-number.desc'),
      bgToken: 'bg-card-lavender',
      icon: Hash,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-bis-navy',
      primaryAction: {
        label: t('quick_access.cards.find-by-number.primary'),
        action: () => setActiveTab('finder')
      },
      secondaryAction: {
        label: t('quick_access.cards.find-by-number.secondary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'उच्च शक्ति विकृत स्टील बार्स के लिए भारतीय मानक IS 1786 के तहत आवश्यक परीक्षण क्या हैं?'
            : 'What are the critical testing requirements under Indian Standard IS 1786 for High Strength Deformed Steel Bars?'
          );
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'faq',
      title: t('quick_access.cards.faq.title'),
      desc: t('quick_access.cards.faq.desc'),
      bgToken: 'bg-card-peach',
      icon: HelpCircle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      primaryAction: {
        label: t('quick_access.cards.faq.primary'),
        action: () => setActiveTab('faq')
      },
      secondaryAction: {
        label: t('quick_access.cards.faq.secondary'),
        action: () => {
          setQueryPrefill(language === 'hi'
            ? 'बीआईएस प्रमाणन के लिए सबसे सामान्य प्रश्न और शुल्क संरचनाएं क्या हैं?'
            : 'What are the most common questions and fee structures for BIS certification?'
          );
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'talk-human',
      title: t('quick_access.cards.talk-human.title'),
      desc: t('quick_access.cards.talk-human.desc'),
      bgToken: 'bg-card-pink',
      icon: Headphones,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-800',
      primaryAction: {
        label: t('quick_access.cards.talk-human.primary'),
        action: () => setActiveTab('contact')
      },
      secondaryAction: {
        label: t('quick_access.cards.talk-human.secondary'),
        action: () => {
          const { setActiveLegalModal } = useAppStore.getState();
          setActiveLegalModal('feedback');
        }
      }
    }
  ];

  return (
    <section 
      aria-label={t('quick_access.region_label')}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent bg-surface-alt border border-brand-accent/30 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('quick_access.badge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-sans">
          {t('quick_access.title')}
        </h2>
        <p className="text-sm text-text-secondary">
          {t('quick_access.subtitle')}
        </p>
      </div>

      {/* 8 Cards: 2 rows x 4 columns on desktop, 2 columns on tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(card => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              className="bg-surface rounded-xl p-5 sm:p-6 flex flex-col justify-between border border-border shadow-xs hover:border-brand-primary/50 transition-colors group"
            >
              <div className="space-y-3">
                {/* Top Icon */}
                <div className="w-12 h-12 rounded-xl bg-surface-alt text-brand-primary border border-border flex items-center justify-center transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>

                {/* Bold Title */}
                <h3 className="font-bold text-base sm:text-lg text-text-primary font-sans tracking-tight leading-snug">
                  {card.title}
                </h3>

                {/* Concise Description */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center gap-2 flex-wrap">
                <button
                  onClick={card.primaryAction.action}
                  className="bg-brand-primary hover:brightness-110 text-white text-xs font-bold px-3.5 py-1.5 rounded-md transition-colors shadow-xs flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  <span>{card.primaryAction.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {card.secondaryAction && (
                  <button
                    onClick={card.secondaryAction.action}
                    className="bg-surface-alt hover:bg-border/40 text-text-primary text-xs font-semibold px-3 py-1.5 rounded-md transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <span>{card.secondaryAction.label}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
