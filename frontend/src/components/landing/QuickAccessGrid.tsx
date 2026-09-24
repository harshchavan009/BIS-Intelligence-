import React from 'react';
import { useAppStore } from '../../store/useAppStore';
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

  const cards: QuickCard[] = [
    {
      id: 'isi-mark',
      title: 'Ask About ISI Mark',
      desc: 'Scheme-I product certification eligibility, factory audits, marking fees & concession rules.',
      bgToken: 'bg-card-lavender',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-bis-navy',
      primaryAction: {
        label: 'Ask Now',
        action: () => {
          setQueryPrefill('How do I apply for the BIS ISI Mark under Scheme-I and what are the factory testing prerequisites?');
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: 'See Details',
        action: () => setActiveTab('schemes')
      }
    },
    {
      id: 'hallmarking',
      title: 'Hallmarking / HUID Help',
      desc: 'Verify 6-digit alphanumeric HUID codes, 916/750 purity grades, and jeweller portal registration.',
      bgToken: 'bg-card-peach',
      icon: Gem,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      primaryAction: {
        label: 'Ask Now',
        action: () => {
          setQueryPrefill('How can I verify a 6-digit HUID number on gold jewelry and what does the mark certify?');
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: 'See Details',
        action: () => setActiveTab('hallmarking')
      }
    },
    {
      id: 'qco-lookup',
      title: 'QCO Lookup',
      desc: 'Find whether Quality Control Orders mandate BIS certification for your specific manufactured product.',
      bgToken: 'bg-card-mint',
      icon: Search,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-800',
      primaryAction: {
        label: 'Lookup QCO',
        action: () => {
          setQueryPrefill('Is my product covered under a mandatory Quality Control Order (QCO) issued under Section 16 of the BIS Act?');
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: 'See Details',
        action: () => setActiveTab('finder')
      }
    },
    {
      id: 'latest-updates',
      title: 'Latest Standard Updates',
      desc: 'Track newly formulated Indian Standards, amendments, gazette notifications & revisions.',
      bgToken: 'bg-card-pink',
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-800',
      primaryAction: {
        label: 'View Updates',
        action: () => setActiveTab('registry')
      },
      secondaryAction: {
        label: 'Ask AI',
        action: () => {
          setQueryPrefill('Summarize the most recent Indian Standards updates and technical committee decisions.');
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'crs-status',
      title: 'Check CRS Registration Status',
      desc: 'Compulsory Registration Scheme for electronics, IT equipment, safety standards & test reports.',
      bgToken: 'bg-card-mint',
      icon: Layers,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-800',
      primaryAction: {
        label: 'Ask Now',
        action: () => {
          setQueryPrefill('What is the procedure for obtaining a BIS CRS registration for IT/electronic products under Scheme-II?');
          setActiveTab('chat');
        }
      },
      secondaryAction: {
        label: 'See Details',
        action: () => setActiveTab('schemes')
      }
    },
    {
      id: 'find-by-number',
      title: 'Find a Standard by Number',
      desc: 'Direct search for any Indian Standard code (e.g. IS 269, IS 1786, IS 13252, IS 1489) with scope.',
      bgToken: 'bg-card-lavender',
      icon: Hash,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-bis-navy',
      primaryAction: {
        label: 'Search IS Code',
        action: () => setActiveTab('finder')
      },
      secondaryAction: {
        label: 'Ask AI',
        action: () => {
          setQueryPrefill('What are the critical testing requirements under Indian Standard IS 1786 for High Strength Deformed Steel Bars?');
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      desc: 'Quick answers for MSMEs, foreign manufacturers, consumers, and laboratory managers.',
      bgToken: 'bg-card-peach',
      icon: HelpCircle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      primaryAction: {
        label: 'Read FAQ',
        action: () => setActiveTab('faq')
      },
      secondaryAction: {
        label: 'Ask AI',
        action: () => {
          setQueryPrefill('What are the most common questions and fee structures for BIS certification?');
          setActiveTab('chat');
        }
      }
    },
    {
      id: 'talk-human',
      title: 'Talk to a Human',
      desc: 'Branch office contacts, official grievance redressal, nodal officer emails & directory.',
      bgToken: 'bg-card-pink',
      icon: Headphones,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-800',
      primaryAction: {
        label: 'Branch Directory',
        action: () => setActiveTab('contact')
      },
      secondaryAction: {
        label: 'Feedback',
        action: () => {
          const { setActiveLegalModal } = useAppStore.getState();
          setActiveLegalModal('feedback');
        }
      }
    }
  ];

  return (
    <section 
      aria-label="Quick Access Services and Tools"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-bis-red bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Assistance &amp; Tools</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-bis-ink tracking-tight font-sans">
          Quick-Access Regulatory Navigator
        </h2>
        <p className="text-sm text-gray-600">
          Select a domain below for direct guidance, standards lookup, or conversational AI assistance.
        </p>
      </div>

      {/* 8 Cards: 2 rows x 4 columns on desktop, 2 columns on tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(card => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              className={`${card.bgToken} rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-black/5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
            >
              <div className="space-y-3">
                {/* Top Circular Icon */}
                <div className={`w-12 h-12 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>

                {/* Bold Title */}
                <h3 className="font-bold text-base sm:text-lg text-bis-ink font-sans tracking-tight leading-snug">
                  {card.title}
                </h3>

                {/* Concise Description */}
                <p className="text-xs text-bis-ink/80 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Dark Pill Action Buttons */}
              <div className="pt-5 flex items-center gap-2 flex-wrap">
                <button
                  onClick={card.primaryAction.action}
                  className="bg-bis-ink hover:bg-bis-navy text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors shadow-xs flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bis-red"
                >
                  <span>{card.primaryAction.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {card.secondaryAction && (
                  <button
                    onClick={card.secondaryAction.action}
                    className="bg-white/80 hover:bg-white text-bis-ink text-xs font-semibold px-3 py-1.5 rounded-full transition-colors border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bis-red"
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
