import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
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
  const { t, language } = useTranslation();
  const [activeTab, setActiveTabState] = useState<TickerTab>('whats_new');

  const tickerData: Record<TickerTab, TickerItem[]> = {
    whats_new: [
      {
        id: 'wn-1',
        tag: t('alerts.items.wn-1.tag'),
        text: t('alerts.items.wn-1.text'),
        query: language === 'hi'
          ? 'CMD-I/2:12:7 के तहत बाजार निगरानी दिशानिर्देशों और बीआईएस केयर लाइसेंस सत्यापन की व्याख्या करें।'
          : 'Explain the market surveillance guidelines under CMD-I/2:12:7 and how BIS Care verifies licenses.'
      },
      {
        id: 'wn-2',
        tag: t('alerts.items.wn-2.tag'),
        text: t('alerts.items.wn-2.text'),
        query: language === 'hi'
          ? 'राजपत्र S.O. 191(E) अनुरूपता निर्धारण विनियम 2018 के मुख्य प्रावधान क्या हैं?'
          : 'What are the core provisions of Gazette S.O. 191(E) Conformity Assessment Regulations 2018?'
      },
      {
        id: 'wn-3',
        tag: t('alerts.items.wn-3.tag'),
        text: t('alerts.items.wn-3.text'),
        query: language === 'hi'
          ? '2025-2026 में योजना-I ISI मार्क की आवश्यकता वाले अनिवार्य QCO के तहत कौन से उत्पाद आते हैं?'
          : 'Which products are covered under mandatory QCOs requiring Scheme-I ISI Mark in 2025-2026?'
      }
    ],
    popular: [
      {
        id: 'pop-1',
        tag: t('alerts.items.pop-1.tag'),
        text: t('alerts.items.pop-1.text'),
        query: language === 'hi'
          ? 'एक उपभोक्ता या व्यवसाय वास्तविक ISI मार्क और 7-अंकीय CM/L लाइसेंस संख्या का सत्यापन कैसे कर सकता है?'
          : 'How can a consumer or business verify a genuine ISI mark and 7-digit CM/L license number?'
      },
      {
        id: 'pop-2',
        tag: t('alerts.items.pop-2.tag'),
        text: t('alerts.items.pop-2.text'),
        query: language === 'hi'
          ? 'IS 269 सीमेंट के लिए अनिवार्य संपीड़न शक्ति और सेटिंग समय परीक्षण पैरामीटर क्या हैं?'
          : 'What are the mandatory compressive strength and setting time test parameters for IS 269 cement?'
      },
      {
        id: 'pop-3',
        tag: t('alerts.items.pop-3.tag'),
        text: t('alerts.items.pop-3.text'),
        query: language === 'hi'
          ? '6-अंकीय HUID कोड सोने की शुद्धता को कैसे सत्यापित करता है और हॉलमार्किंग ट्रेसेबिलिटी सुनिश्चित करता है?'
          : 'How does the 6-digit HUID code verify gold purity and ensure hallmarking traceability?'
      }
    ],
    updates: [
      {
        id: 'up-1',
        tag: t('alerts.items.up-1.tag'),
        text: t('alerts.items.up-1.text'),
        query: language === 'hi'
          ? 'क्लस्टर आधारित परीक्षण सुविधा (CBTF) परिपत्र CMD-I/2:12:8 के तहत MSMEs को क्या छूट प्रदान की जाती है?'
          : 'What concessions are provided to MSMEs under the Cluster Based Test Facility (CBTF) circular CMD-I/2:12:8?'
      },
      {
        id: 'up-2',
        tag: t('alerts.items.up-2.tag'),
        text: t('alerts.items.up-2.text'),
        query: language === 'hi'
          ? 'योजना-IV अनुरूपता प्रमाणपत्र (CoC) के लिए 180-दिवसीय परीक्षण रिपोर्ट वैधता नियम क्या है?'
          : 'What is the 180-day test report validity rule for Scheme-IV Certificate of Conformity (CoC)?'
      },
      {
        id: 'up-3',
        tag: t('alerts.items.up-3.tag'),
        text: t('alerts.items.up-3.text'),
        query: language === 'hi'
          ? 'बीआईएस CRS योजना-II के तहत लिथियम बैटरी और मोबाइल एडेप्टर पर कौन से सुरक्षा परीक्षण मानक लागू होते हैं?'
          : 'What safety test standards apply to lithium batteries and mobile adapters under BIS CRS Scheme-II?'
      }
    ],
    events: [
      {
        id: 'ev-1',
        tag: t('alerts.items.ev-1.tag'),
        text: t('alerts.items.ev-1.text'),
        query: language === 'hi'
          ? 'राष्ट्रीय मानक सम्मेलन का विषय और तकनीकी दायरा क्या है?'
          : 'What is the theme and technical scope of the National Standards Conclave?'
      },
      {
        id: 'ev-2',
        tag: t('alerts.items.ev-2.tag'),
        text: t('alerts.items.ev-2.text'),
        query: language === 'hi'
          ? 'MSMEs बीआईएस मानक संवेदीकरण और तकनीकी समिति फीडबैक में कैसे भाग ले सकते हैं?'
          : 'How can MSMEs participate in BIS standards sensitization and technical committee feedback?'
      },
      {
        id: 'ev-3',
        tag: t('alerts.items.ev-3.tag'),
        text: t('alerts.items.ev-3.text'),
        query: language === 'hi'
          ? 'यदि हॉलमार्क सोना शुद्धता परीक्षण में विफल रहता है तो उपभोक्ता को क्या कदम उठाने चाहिए?'
          : 'What steps should a consumer take if hallmarked gold fails assaying purity tests?'
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
      aria-label={t('alerts.region_label')}
      className="bg-bis-ink text-white border-b border-gray-800 text-xs font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Tab Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none relative z-10 bg-bis-ink pr-3 md:pr-4 md:border-r border-gray-700/60">
          <div className="flex items-center gap-1 mr-1 text-bis-red">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-[11px] uppercase tracking-wider hidden sm:inline text-amber-300">
              {t('alerts.title')}
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
            {t('alerts.whats_new')}
          </button>

          <button
            onClick={() => setActiveTabState('popular')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'popular'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            {t('alerts.popular')}
          </button>

          <button
            onClick={() => setActiveTabState('updates')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'updates'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            {t('alerts.updates')}
          </button>

          <button
            onClick={() => setActiveTabState('events')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors shrink-0 ${
              activeTab === 'events'
                ? 'bg-bis-red text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            {t('alerts.events')}
          </button>
        </div>

        {/* Center: Single-Line Auto-Scrolling Marquee with Pause on Hover */}
        <div className="flex-1 overflow-hidden relative group w-full md:mx-3 py-0.5 ticker-track min-w-0">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-bis-ink to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-bis-ink to-transparent z-10 pointer-events-none" />
          <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] pl-4">
            {[...currentItems, ...currentItems].map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => handleItemClick(item.query)}
                className="inline-flex items-center gap-2 text-gray-200 hover:text-amber-300 transition-colors text-xs text-left shrink-0"
                title={language === 'hi' ? 'इस विषय पर सहायक से पूछने हेतु क्लिक करें' : 'Click to ask assistant about this item'}
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
            <span>{t('alerts.view_all')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
