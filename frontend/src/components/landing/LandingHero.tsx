import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  Search, 
  Layers, 
  FlaskConical, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { AlertTicker } from './AlertTicker';
import { TrustAccuracyStrip } from './TrustAccuracyStrip';
import { QuickAccessGrid } from './QuickAccessGrid';
import { MediaGallery } from './MediaGallery';
import { BisIntelligenceLogo } from '../common/BisIntelligenceLogo';

export const LandingHero: React.FC = () => {
  const { setActiveTab, setQueryPrefill, openSource, evalBenchmark, fetchEvalBenchmark } = useAppStore();
  const { t, language } = useTranslation();

  useEffect(() => {
    fetchEvalBenchmark();
  }, [fetchEvalBenchmark]);

  // Live Typing Demo Simulation
  const sampleDemoAnswer = {
    query: language === 'hi'
      ? "निर्माण में प्रयुक्त सीमेंट के लिए कौन सा भारतीय मानक और गुणवत्ता नियंत्रण आदेश (QCO) लागू होता है?"
      : "Which Indian Standard and Quality Control Order (QCO) governs cement used in construction?",
    text: language === 'hi'
      ? "सीमेंट (गुणवत्ता नियंत्रण) आदेश, 2003 के अंतर्गत निर्माण सीमेंट हेतु अनिवार्य प्रमाणन लागू है [1]। मुख्य लागू मानक निम्नलिखित हैं:\n• IS 269: 2015 — साधारण पोर्टलैंड सीमेंट (OPC 33, 43, 53 ग्रेड) [1]\n• IS 1489 (भाग 1): पोर्टलैंड पोज़ोलाना सीमेंट (फ्लाई-ऐश आधारित) [1]\n• IS 12330: सल्फेट प्रतिरोधी पोर्टलैंड सीमेंट [1]\n\nयोजना: योजना-I (ISI मार्क)। बीआईएस अधिनियम की धारा 17 एवं 29 के तहत बिना मानक चिह्न निर्माण या विक्रय निषिद्ध है [2]।"
      : "Under the Cement (Quality Control) Order, 2003, mandatory certification is enforced for construction cement [1]. Key applicable standards include:\n• IS 269: 2015 — Ordinary Portland Cement (OPC 33, 43, 53 grade) [1]\n• IS 1489 (Part 1): Portland Pozzolana Cement (Fly-ash based) [1]\n• IS 12330: Sulphate Resisting Portland Cement [1]\n\nScheme: Scheme-I (ISI Mark). Manufacturing or selling without the standard mark is prohibited under Section 17 & 29 of the BIS Act [2].",
    sources: [
      {
        document_title: language === 'hi' ? "योजना-I विशिष्ट उत्पाद दिशानिर्देश एवं अनिवार्य QCO मैपिंग" : "Scheme-I Specific Product Guidelines & Mandatory QCO Mapping",
        source_file: "scheme1-specific-guidelines.pdf",
        clause_ref: "Sr No. 1 - Cement",
        page_number: 1,
        excerpt: "Cement (any variety of cement manufactured or sold in India) such as IS 12330 Sulphate Resisting Portland Cement, IS 1489 Part 1 & Part 2, IS 269. Cement (Quality Control) Order, 2003.",
        grounded: true
      },
      {
        document_title: language === 'hi' ? "बीआईएस अधिनियम 2016 की धारा 16 के अंतर्गत गुणवत्ता नियंत्रण आदेश (QCO) मार्गदर्शन दस्तावेज" : "Guidance Document on Quality Control Orders (QCOs) under Section 16 of BIS Act, 2016",
        source_file: "qco-guidance.pdf",
        clause_ref: "Clause 7.1",
        page_number: 3,
        excerpt: "Any person who contravenes the provisions of the Order shall be punishable under sub-section (3) of section 29 of the BIS Act, 2016.",
        grounded: true
      }
    ]
  };

  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    let index = 0;
    const fullText = sampleDemoAnswer.text;
    setTypedText('');
    setTypingDone(false);

    const interval = setInterval(() => {
      index += 3;
      if (index >= fullText.length) {
        setTypedText(fullText);
        setTypingDone(true);
        clearInterval(interval);
      } else {
        setTypedText(fullText.slice(0, index));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [language]);

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setQueryPrefill(quickInput.trim());
    setActiveTab('chat');
  };

  const renderTypedContent = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return (
      <div className="text-xs leading-relaxed text-bis-ink dark:text-text-primary space-y-2 font-sans">
        {parts.map((part, idx) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const srcIdx = parseInt(match[1], 10) - 1;
            const src = sampleDemoAnswer.sources[srcIdx];
            if (src) {
              return (
                <button
                  key={idx}
                  onClick={() => openSource(src)}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 mx-0.5 bg-bis-navy/10 hover:bg-bis-navy text-bis-navy hover:text-white rounded text-[11px] font-mono font-bold transition-colors border border-bis-navy/30"
                  title={`View Source Excerpt: ${src.document_title}`}
                >
                  <span>[{srcIdx + 1}]</span>
                </button>
              );
            }
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  const popularTags = language === 'hi' 
    ? [
        { label: 'IS 269 सीमेंट', query: 'IS 269 सीमेंट के लिए परीक्षण आवश्यकताएं और अनिवार्य नियम समझाएं' },
        { label: 'IS 1786 स्टील टीएमटी', query: 'IS 1786 स्टील टीएमटी सरिया हेतु अनिवार्य यांत्रिक परीक्षण समझाएं' },
        { label: 'IS 13252 इलेक्ट्रॉनिक्स', query: 'IS 13252 के तहत MeitY CRS इलेक्ट्रॉनिक सुरक्षा प्रमाणन समझाएं' },
        { label: 'स्वर्ण हॉलमार्किंग HUID', query: 'सोने के आभूषणों पर 6-अंकीय अक्षरांकीय HUID सत्यापन प्रक्रिया बताएं' },
        { label: 'खिलौने QCO', query: 'खिलौनों के लिए अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) और ISI मार्क नियम बताएं' }
      ]
    : [
        { label: 'IS 269 Cement', query: 'Explain testing specifications and mandatory requirements for IS 269 Cement' },
        { label: 'IS 1786 Steel TMT', query: 'Explain testing specifications and mandatory requirements for IS 1786 Steel TMT' },
        { label: 'IS 13252 Electronics', query: 'Explain testing specifications and mandatory requirements for IS 13252 Electronics' },
        { label: 'Gold Hallmarking HUID', query: 'Explain testing specifications and mandatory requirements for Gold Hallmarking HUID' },
        { label: 'Toys QCO', query: 'Explain testing specifications and mandatory requirements for Toys QCO' }
      ];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* SECTION 3: Hero Carousel */}
      <HeroCarousel />

      {/* SECTION 4: Alert / Ticker Strip */}
      <AlertTicker />

      {/* SECTION 3 (PUBLIC TRUST): Trust & Accuracy Telemetry Strip */}
      <TrustAccuracyStrip />

      {/* Direct Search Bar Strip */}
      <div className="bg-surface-alt border-b border-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleDirectSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-11 pr-4 py-3 bg-surface rounded-xl border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-xs font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-primary hover:brightness-110 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{t('search.search_button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center gap-2 mt-2.5 text-xs text-text-secondary overflow-x-auto pb-1">
            <span className="font-semibold text-text-primary shrink-0">{t('search.popular_label')}</span>
            {popularTags.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setQueryPrefill(item.query);
                  setActiveTab('chat');
                }}
                className="bg-surface hover:bg-surface-alt text-text-primary px-2.5 py-0.5 rounded-full border border-border shrink-0 transition-colors text-[11px]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: Quick-Access Card Grid (Pastel Tokens) */}
      <QuickAccessGrid />

      {/* SECTION 2 / SECTION 6: Media & Resources Gallery (Placed directly after Quick-Access Cards) */}
      <MediaGallery />

      {/* Interactive Live Query Simulation Demonstration */}
      <section className="bg-background py-10 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-status-success bg-surface-alt border border-status-success/30 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
              <span>{t('interactive_demo.badge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
              {t('interactive_demo.heading')}
            </h2>
            <p className="text-xs text-text-secondary max-w-xl mx-auto">
              {t('interactive_demo.subheading')}
            </p>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="bg-brand-primary dark:bg-surface-alt px-5 py-3 text-white flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="font-bold text-xs">{t('interactive_demo.live_header')}</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                {t('interactive_demo.benchmark_badge')}
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Question */}
              <div className="bg-surface-alt p-3.5 rounded-lg border border-border">
                <div className="text-[11px] font-mono uppercase text-text-muted font-bold mb-1">
                  {t('interactive_demo.inquiry_label')}
                </div>
                <div className="font-bold text-sm text-text-primary">
                  "{sampleDemoAnswer.query}"
                </div>
              </div>

              {/* Answer */}
              <div className="p-4 bg-surface-alt rounded-lg border border-border">
                <div className="text-[11px] font-mono uppercase text-brand-primary font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                  <span>{t('interactive_demo.response_label')}</span>
                </div>
                {renderTypedContent(typedText)}
                {!typingDone && (
                  <span className="inline-block w-2 h-4 bg-brand-accent animate-pulse ml-1 align-middle" />
                )}
              </div>

              {/* Citations Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono">
                  {t('interactive_demo.citations_heading')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleDemoAnswer.sources.map((src, idx) => (
                    <div
                      key={idx}
                      onClick={() => openSource(src)}
                      className="p-3 bg-surface-alt hover:bg-surface rounded-lg border border-border cursor-pointer transition-colors space-y-1"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary">
                        <span className="font-bold text-brand-primary">{t('interactive_demo.source_prefix')} [{idx + 1}]</span>
                        <span className="bg-surface px-1.5 py-0.5 rounded border border-border text-brand-accent font-semibold">{src.clause_ref}</span>
                      </div>
                      <div className="text-xs font-semibold text-text-primary truncate">{src.document_title}</div>
                      <p className="text-[11px] text-text-secondary italic line-clamp-2">
                        "{src.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setQueryPrefill(sampleDemoAnswer.query);
                    setActiveTab('chat');
                  }}
                  className="bg-brand-accent hover:brightness-110 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{t('interactive_demo.ask_chat_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
