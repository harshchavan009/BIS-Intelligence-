import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
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
  const { setActiveTab, setQueryPrefill, openSource, language, evalBenchmark, fetchEvalBenchmark } = useAppStore();

  useEffect(() => {
    fetchEvalBenchmark();
  }, [fetchEvalBenchmark]);

  // Live Typing Demo Simulation
  const sampleDemoAnswer = {
    query: "Which Indian Standard and Quality Control Order (QCO) governs cement used in construction?",
    text: "Under the Cement (Quality Control) Order, 2003, mandatory certification is enforced for construction cement [1]. Key applicable standards include:\n• IS 269: 2015 — Ordinary Portland Cement (OPC 33, 43, 53 grade) [1]\n• IS 1489 (Part 1): Portland Pozzolana Cement (Fly-ash based) [1]\n• IS 12330: Sulphate Resisting Portland Cement [1]\n\nScheme: Scheme-I (ISI Mark). Manufacturing or selling without the standard mark is prohibited under Section 17 & 29 of the BIS Act [2].",
    sources: [
      {
        document_title: "Scheme-I Specific Product Guidelines & Mandatory QCO Mapping",
        source_file: "scheme1-specific-guidelines.pdf",
        clause_ref: "Sr No. 1 - Cement",
        page_number: 1,
        excerpt: "Cement (any variety of cement manufactured or sold in India) such as IS 12330 Sulphate Resisting Portland Cement, IS 1489 Part 1 & Part 2, IS 269. Cement (Quality Control) Order, 2003.",
        grounded: true
      },
      {
        document_title: "Guidance Document on Quality Control Orders (QCOs) under Section 16 of BIS Act, 2016",
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
  }, []);

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setQueryPrefill(quickInput.trim());
    setActiveTab('chat');
  };

  const renderTypedContent = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return (
      <div className="text-xs leading-relaxed text-bis-ink space-y-2 font-sans">
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

  return (
    <div className="w-full flex flex-col font-sans">
      {/* SECTION 3: Hero Carousel */}
      <HeroCarousel />

      {/* SECTION 4: Alert / Ticker Strip */}
      <AlertTicker />

      {/* SECTION 3 (PUBLIC TRUST): Trust & Accuracy Telemetry Strip */}
      <TrustAccuracyStrip />

      {/* Direct Search Bar Strip */}
      <div className="bg-paper-dark border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleDirectSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Search standard by product name or IS code (e.g. Cement, Steel TMT, IS 269, Recycled Plastic)..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-300 text-sm text-bis-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bis-red shadow-xs font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-bis-navy hover:bg-bis-navy-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Search Standards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center gap-2 mt-2.5 text-xs text-gray-500 overflow-x-auto pb-1">
            <span className="font-semibold text-gray-700 shrink-0">Popular:</span>
            {['IS 269 Cement', 'IS 1786 Steel TMT', 'IS 13252 Electronics', 'Gold Hallmarking HUID', 'Toys QCO'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQueryPrefill(`Explain testing specifications and mandatory requirements for ${item}`);
                  setActiveTab('chat');
                }}
                className="bg-white hover:bg-gray-100 text-bis-ink px-2.5 py-0.5 rounded-full border border-gray-200 shrink-0 transition-colors text-[11px]"
              >
                {item}
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
      <section className="bg-paper py-10 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifiable Grounding &amp; Citation Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-bis-ink">
              Watch How the Assistant Answers Real Regulatory Inquiries
            </h2>
            <p className="text-xs text-gray-600 max-w-xl mx-auto">
              Every response is synthesized with exact clause citations from gazette notifications and official standards documents.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 shadow-md overflow-hidden">
            {/* Header bar */}
            <div className="bg-bis-navy px-5 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="font-bold text-xs">Simulated Query Execution</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                65/65 Tests Grounded (100%)
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Question */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                  User Inquiry
                </div>
                <div className="font-bold text-sm text-bis-ink">
                  "{sampleDemoAnswer.query}"
                </div>
              </div>

              {/* Answer */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <div className="text-[11px] font-mono uppercase text-bis-navy font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-bis-red" />
                  <span>Synthesized Assistant Response</span>
                </div>
                {renderTypedContent(typedText)}
                {!typingDone && (
                  <span className="inline-block w-2 h-4 bg-bis-red animate-pulse ml-1 align-middle" />
                )}
              </div>

              {/* Citations Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-bis-navy uppercase tracking-wider font-mono">
                  Grounding Citations Extracted from Knowledge Base
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleDemoAnswer.sources.map((src, idx) => (
                    <div
                      key={idx}
                      onClick={() => openSource(src)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer transition-colors space-y-1"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-600">
                        <span className="font-bold text-bis-navy">Source [{idx + 1}]</span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-bis-red font-semibold">{src.clause_ref}</span>
                      </div>
                      <div className="text-xs font-semibold text-bis-ink truncate">{src.document_title}</div>
                      <p className="text-[11px] text-gray-600 italic line-clamp-2">
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
                  className="bg-bis-red hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Ask this query in Chat Workspace</span>
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
