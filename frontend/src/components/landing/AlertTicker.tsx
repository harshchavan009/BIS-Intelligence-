import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Bell, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

type TickerTab = 'whats_new' | 'popular' | 'updates' | 'events';

interface TickerItem {
  id: string;
  tag: string;
  text: string;
  query: string;
}

export const AlertTicker: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const [activeTab, setActiveTabState] = useState<TickerTab>('whats_new');

  const tickerData: Record<TickerTab, TickerItem[]> = {
    whats_new: [
      {
        id: 'wn-1',
        tag: 'Gazette',
        text: 'CMD-I/2:12:7 Market Surveillance & BIS Care App Verification Guidelines in effect',
        query: 'Explain the market surveillance guidelines under CMD-I/2:12:7 and how BIS Care verifies licenses.'
      },
      {
        id: 'wn-2',
        tag: 'Regulation',
        text: 'Gazette S.O. 191(E): BIS (Conformity Assessment) Regulations 2018 Master Schedule active',
        query: 'What are the core provisions of Gazette S.O. 191(E) Conformity Assessment Regulations 2018?'
      },
      {
        id: 'wn-3',
        tag: 'QCO Order',
        text: 'Mandatory Quality Control Orders enforce ISI marking for footwear, steel, and toys',
        query: 'Which products are covered under mandatory QCOs requiring Scheme-I ISI Mark in 2025-2026?'
      }
    ],
    popular: [
      {
        id: 'pop-1',
        tag: 'ISI Mark',
        text: 'How to distinguish authentic ISI mark from counterfeit licenses using CM/L number',
        query: 'How can a consumer or business verify a genuine ISI mark and 7-digit CM/L license number?'
      },
      {
        id: 'pop-2',
        tag: 'Cement',
        text: 'Mandatory testing parameters for IS 269:2015 Ordinary Portland Cement (OPC 33, 43, 53)',
        query: 'What are the mandatory compressive strength and setting time test parameters for IS 269 cement?'
      },
      {
        id: 'pop-3',
        tag: 'Hallmarking',
        text: '6-digit alphanumeric HUID gold jewelry verification process via BIS Care App',
        query: 'How does the 6-digit HUID code verify gold purity and ensure hallmarking traceability?'
      }
    ],
    updates: [
      {
        id: 'up-1',
        tag: 'MSME CBTF',
        text: 'Cluster Based Test Facility concessions for small enterprise in-house test apparatus',
        query: 'What concessions are provided to MSMEs under the Cluster Based Test Facility (CBTF) circular CMD-I/2:12:8?'
      },
      {
        id: 'up-2',
        tag: 'CRS Validity',
        text: 'Scheme-IV Certificate of Conformity test report 180-day validity mandate guidelines',
        query: 'What is the 180-day test report validity rule for Scheme-IV Certificate of Conformity (CoC)?'
      },
      {
        id: 'up-3',
        tag: 'Electronics',
        text: 'Compulsory Registration Scheme (CRS) MeitY safety standards for power adaptors & batteries',
        query: 'What safety test standards apply to lithium batteries and mobile adapters under BIS CRS Scheme-II?'
      }
    ],
    events: [
      {
        id: 'ev-1',
        tag: 'Conclave',
        text: 'National Standards Conclave — World Standards Day technical workshop & industry panel',
        query: 'What is the theme and technical scope of the National Standards Conclave?'
      },
      {
        id: 'ev-2',
        tag: 'Webinar',
        text: 'MSME Standards Sensitization: Navigating Mandatory QCOs in engineering & electrical',
        query: 'How can MSMEs participate in BIS standards sensitization and technical committee feedback?'
      },
      {
        id: 'ev-3',
        tag: 'Awareness',
        text: 'Consumer Awareness Program: Verifying Hallmarked Gold and Submitting Complaints',
        query: 'What steps should a consumer take if hallmarked gold fails assaying purity tests?'
      }
    ]
  };

  const currentItems = tickerData[activeTab];

  const handleItemClick = (query: string) => {
    setQueryPrefill(query);
    setActiveTab('chat');
  };

  return (
    <div 
      role="region"
      aria-label="Regulatory Updates Ticker"
      className="bg-bis-ink text-white border-b border-gray-800 text-xs font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Tab Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none relative z-10 bg-bis-ink pr-3 md:pr-4 md:border-r border-gray-700/60">
          <div className="flex items-center gap-1 mr-1 text-bis-red">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-[11px] uppercase tracking-wider hidden sm:inline text-amber-300">
              Alerts:
            </span>
          </div>

          <button
            onClick={() => setActiveTabState('whats_new')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'whats_new'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            What's New
          </button>

          <button
            onClick={() => setActiveTabState('popular')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'popular'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            Popular Topics
          </button>

          <button
            onClick={() => setActiveTabState('updates')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'updates'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            Recent Updates
          </button>

          <button
            onClick={() => setActiveTabState('events')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'events'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            Events
          </button>
        </div>

        {/* Center: Single-Line Auto-Scrolling Marquee with Pause on Hover */}
        <div className="flex-1 overflow-hidden relative group w-full md:mx-3 py-0.5 ticker-track min-w-0">
          {/* Subtle gradient edges so text doesn't sharply collide */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-bis-ink to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-bis-ink to-transparent z-10 pointer-events-none" />
          <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] pl-4">
            {/* Duplicated for seamless loop */}
            {[...currentItems, ...currentItems].map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => handleItemClick(item.query)}
                className="inline-flex items-center gap-2 text-gray-200 hover:text-amber-300 transition-colors text-xs text-left shrink-0"
                title="Click to ask assistant about this item"
              >
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-white/15 text-amber-300 border border-white/10">
                  {item.tag}
                </span>
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: View All → Link */}
        <div className="shrink-0 flex items-center gap-1 self-end md:self-auto relative z-10 bg-bis-ink pl-3 md:border-l border-gray-700/60">
          <button
            onClick={() => setActiveTab('registry')}
            className="text-amber-300 hover:text-white font-bold text-[11px] inline-flex items-center gap-0.5 hover:underline"
          >
            <span>View All →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
