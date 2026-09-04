import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Search, Layers, FlaskConical, ShieldCheck, ArrowRight, ExternalLink, Sparkles, CheckCircle2, Bell } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';
import { GroundedBadge } from '../common/GroundedBadge';

export const LandingHero: React.FC = () => {
  const { setActiveTab, setQueryPrefill, openSource, language, evalBenchmark, fetchEvalBenchmark } = useAppStore();

  useEffect(() => {
    fetchEvalBenchmark();
  }, []);

  const whatsNewItems = [
    {
      date: '25 Feb 2026',
      title: 'CMD-I/2:12:7 Market Surveillance & BIS Care Mobile App Verification Guidelines',
      titleHi: 'सीएमडी-I/2:12:7 बाजार निगरानी एवं बीआईएस केयर मोबाइल ऐप सत्यापन दिशानिर्देश',
      ref: 'CMD-I/2:12:7'
    },
    {
      date: '30 Apr 2021',
      title: 'Cluster Based Test Facility (CBTF) Concessions for MSME In-House Testing',
      titleHi: 'एमएसएमई इन-हाउस परीक्षण हेतु क्लस्टर आधारित परीक्षण सुविधा (CBTF) रियायतें',
      ref: 'Ref: CMD-I/2:12:8'
    },
    {
      date: '02 May 2019',
      title: 'Scheme-IV Certificate of Conformity (CoC) 180-Day Test Report Validity Mandate',
      titleHi: 'योजना-IV अनुरूपता प्रमाणपत्र (CoC) 180-दिवसीय परीक्षण रिपोर्ट वैधता अनिवार्यता',
      ref: 'CMD-I/2:16:1'
    },
    {
      date: '04 Jun 2018',
      title: 'Gazette S.O. 191(E): BIS (Conformity Assessment) Regulations 2018 Master Schedule',
      titleHi: 'राजपत्र S.O. 191(E): बीआईएस (अनुरूपता मूल्यांकन) विनियम 2018 मास्टर अनुसूची',
      ref: 'S.O. 191(E)'
    }
  ];

  // Hero interactive live typing simulation for the first answer
  const sampleDemoAnswer = {
    query: "Which Indian Standard and Quality Control Order (QCO) governs cement used in construction?",
    queryHi: "निर्माण में उपयोग होने वाले सीमेंट पर कौन सा भारतीय मानक और QCO लागू होता है?",
    text: "Under the Cement (Quality Control) Order, 2003, mandatory certification is enforced for construction cement [1]. Key applicable standards include:\n• IS 269: 2015 — Ordinary Portland Cement (OPC 33, 43, 53 grade) [1]\n• IS 1489 (Part 1): Portland Pozzolana Cement (Fly-ash based) [1]\n• IS 12330: Sulphate Resisting Portland Cement [1]\n\nScheme: Scheme-I (ISI Mark). Manufacturing or selling without the BIS standard mark is prohibited under Section 17 & 29 of the BIS Act [2].",
    sources: [
      {
        document_title: "Scheme-I Specific Product Guidelines & Mandatory QCO Mapping",
        source_file: "scheme1-specific-guidelines.pdf",
        clause_ref: "Sr No. 1 - Cement",
        page_number: 1,
        excerpt: "Cement (any variety of cement manufactured or sold in India) such as IS 12330 Sulphate Resisting Portland Cement, IS 12600 Low Heat Portland Cement, IS 1489 Part 1 & Part 2, IS 269. Cement (Quality Control) Order, 2003.",
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
  const [plainSearchInput, setPlainSearchInput] = useState('');

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

  const renderTypedContent = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return (
      <div className="text-xs leading-relaxed text-ink space-y-1.5 font-sans">
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
                  className="citation-chip inline-block hover:scale-105"
                  title="Click to inspect source"
                >
                  [{srcIdx + 1}]
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
    <div className="space-y-12 pb-16">
      {/* What's New / Gazette Updates Ticker */}
      <div className="bg-paper-light border-b border-line py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-800 text-white rounded text-[10.5px] font-bold font-mono uppercase tracking-wider flex-shrink-0 animate-pulse">
            <Bell className="w-3 h-3" />
            <span>{language === 'hi' ? 'नवीनतम विनियामक अपडेट' : "What's New"}</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none text-ink text-[12px] font-medium py-0.5">
            {whatsNewItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-mono text-[11px] text-brass font-semibold">[{item.date}]</span>
                <span className="text-gray-800">{language === 'hi' ? item.titleHi : item.title}</span>
                <span className="text-[10px] text-gray-500 font-mono bg-paper px-1.5 py-0.5 rounded border border-line">{item.ref}</span>
                {idx < whatsNewItems.length - 1 && <span className="text-gray-300 ml-2">•</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-paper pt-8 pb-12 sm:pb-16 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Authoritative Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-line shadow-paper-sm">
                <SealMotif size={18} />
                <span className="text-[11px] font-semibold tracking-wider text-ink uppercase font-mono">
                  SIH Problem Statement PS-1724
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink tracking-tight leading-[1.15]">
                {language === 'hi' ? (
                  <>भारतीय मानकों और बीआईएस सेवाओं के लिए <span className="text-brass italic">सत्यापित एआई सहायक</span></>
                ) : (
                  <>The source-grounded intelligence layer for <span className="text-brass italic">Indian Standards</span></>
                )}
              </h1>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans max-w-xl">
                {language === 'hi'
                  ? "हजारों भारतीय मानकों, अनिवार्य क्यूसीओ (QCO), एमएसएमई हेतु क्लस्टर आधारित परीक्षण (CBTF) और प्रमाणन योजनाओं को सेकंडों में खोजें। प्रत्येक उत्तर आधिकारिक राजपत्र और विनियामक धाराओं से प्रमाणित।"
                  : "Instant, citation-backed discovery across thousands of Indian Standards, mandatory Quality Control Orders (QCOs), MSME Cluster Based Test Facilities (CBTF), and certification schemes. Built for regulatory certainty."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-5 py-2.5 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-paper transition-all"
                >
                  <span>{language === 'hi' ? 'एआई सहायक से पूछें' : 'Open AI Assistant'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('finder')}
                  className="px-5 py-2.5 bg-white hover:bg-paper-dark text-ink border border-line rounded-md text-xs font-semibold flex items-center gap-2 shadow-paper-sm transition-all"
                >
                  <Search className="w-3.5 h-3.5 text-brass" />
                  <span>{language === 'hi' ? 'मानक खोजें (Product Finder)' : 'Find My Standard'}</span>
                </button>
              </div>

              {/* Plain Keyword Search Bar Alternative for MSMEs (Section 4 Requirement) */}
              <div className="bg-white border border-line rounded-lg p-3.5 shadow-paper-sm max-w-xl space-y-2">
                <div className="flex items-center justify-between text-[11.5px] font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brass" />
                    <span>{language === 'hi' ? 'एमएसएमई हेतु सरल कीवर्ड खोज (बिना चैट के):' : 'Plain Keyword Search for MSMEs (No AI Chat Required):'}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">Direct IS Registry</span>
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (plainSearchInput.trim()) {
                      setQueryPrefill(plainSearchInput);
                      setActiveTab('finder');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={plainSearchInput}
                    onChange={(e) => setPlainSearchInput(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. सीमेंट, स्टील टीएमटी, बिजली की प्रेस, IS 269...' : 'e.g. Cement, Steel TMT, Electric Iron, IS 269...'}
                    className="flex-1 px-3 py-2 text-xs border border-line rounded bg-paper-light focus:outline-none focus:border-brass text-ink"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brass text-white text-xs font-semibold rounded hover:bg-brass-dark transition-colors whitespace-nowrap shadow-sm"
                  >
                    {language === 'hi' ? 'खोजें' : 'Search Standards'}
                  </button>
                </form>
              </div>

              {/* Regulatory Assurance Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-line/60 max-w-lg">
                <div>
                  <div className="text-base font-bold text-ink font-serif">{evalBenchmark.display_score}</div>
                  <div className="text-[11px] text-gray-500">{language === 'hi' ? 'परीक्षित स्रोत संबद्ध' : 'Source Grounded'}</div>
                </div>
                <div>
                  <div className="text-base font-bold text-ink font-serif">7 PDFs</div>
                  <div className="text-[11px] text-gray-500">Real Gazette Docs</div>
                </div>
                <div>
                  <div className="text-base font-bold text-ink font-serif">Zero Setup</div>
                  <div className="text-[11px] text-gray-500">Works Fully Offline</div>
                </div>
              </div>
            </div>

            {/* Right Column: LIVE Working Demo Box */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-line rounded-xl shadow-paper-lg overflow-hidden">
                {/* Live Demo Header */}
                <div className="bg-indigo-deep px-4 py-2.5 text-white flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold font-mono tracking-wide">
                      LIVE DEMO • STREAMING RAG SYNTHESIS
                    </span>
                  </div>
                  <GroundedBadge score={100} minimal />
                </div>

                {/* Question Area */}
                <div className="p-4 bg-paper-dark/30 border-b border-line flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-indigo-deep text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    Q
                  </div>
                  <div className="text-xs font-semibold text-ink leading-relaxed">
                    {language === 'hi' ? sampleDemoAnswer.queryHi : sampleDemoAnswer.query}
                  </div>
                </div>

                {/* Answer Area */}
                <div className="p-4 space-y-3 min-h-[220px]">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono border-b border-line/40 pb-1">
                    <span>BIS AI INFERENCE ENGINE</span>
                    <span>{typingDone ? 'SYNTHESIS COMPLETE' : 'STREAMING TOKENS...'}</span>
                  </div>

                  <div className="whitespace-pre-wrap">
                    {renderTypedContent(typedText)}
                  </div>

                  {typingDone && (
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brass" />
                        Click citation chips to inspect original clause
                      </span>
                      <button
                        onClick={() => {
                          setQueryPrefill(sampleDemoAnswer.query);
                          setActiveTab('chat');
                        }}
                        className="text-xs text-brass hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Continue in Chat</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Source Preview */}
                <div className="bg-paper p-3 border-t border-line flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-600 truncate">
                    <span className="font-semibold text-ink">Active Sources:</span>
                    <span className="truncate">scheme1-specific-guidelines.pdf (Sr. 1)</span>
                  </div>
                  <button
                    onClick={() => openSource(sampleDemoAnswer.sources[0])}
                    className="text-indigo-deep hover:text-brass font-medium flex-shrink-0 ml-2"
                  >
                    View Excerpt →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Quiet Feature Strips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <h2 className="text-2xl font-serif text-ink">
            {language === 'hi' ? 'मुख्य विनियामक प्रणालियाँ' : 'Core National Standards Capabilities'}
          </h2>
          <p className="text-xs text-gray-500">
            {language === 'hi'
              ? 'उद्योगों, स्टार्टअप्स और उपभोक्ताओं के लिए संपूर्ण समाधान'
              : 'Engineered for manufacturers, MSMEs, testing laboratories, and consumer vigilance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strip 1: Standards Finder */}
          <div 
            onClick={() => setActiveTab('finder')}
            className="bg-white border border-line rounded-lg p-6 shadow-paper-sm hover:shadow-paper hover:border-brass/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-md bg-paper-dark border border-line flex items-center justify-center text-brass group-hover:bg-brass group-hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink font-serif">
                {language === 'hi' ? 'मानक खोजक (Standards Finder)' : 'Standards Finder'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Deterministic product-to-standard mapping. Type any product description or IS number to retrieve ranked mandatory QCOs and schemes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between text-xs text-indigo-deep font-semibold group-hover:text-brass">
              <span>Search 40+ Indexed Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Strip 2: Scheme Explorer */}
          <div 
            onClick={() => setActiveTab('schemes')}
            className="bg-white border border-line rounded-lg p-6 shadow-paper-sm hover:shadow-paper hover:border-brass/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-md bg-paper-dark border border-line flex items-center justify-center text-brass group-hover:bg-brass group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink font-serif">
                {language === 'hi' ? 'प्रमाणन योजनाएं एवं प्रक्रिया' : 'Certification Schemes Explorer'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Deep-dive into Scheme I (ISI Mark), Scheme II (CRO), and Scheme IV (CoC). Features interactive step-by-step regulatory timelines.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between text-xs text-indigo-deep font-semibold group-hover:text-brass">
              <span>Compare Schemes & Timelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Strip 3: Lab Finder (CBTF) */}
          <div 
            onClick={() => setActiveTab('labs')}
            className="bg-white border border-line rounded-lg p-6 shadow-paper-sm hover:shadow-paper hover:border-brass/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-md bg-paper-dark border border-line flex items-center justify-center text-brass group-hover:bg-brass group-hover:text-white transition-colors">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink font-serif">
                {language === 'hi' ? 'एमएसएमई क्लस्टर लैब (CBTF)' : 'MSME Cluster Testing (CBTF)'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guidance under CMD-I/2:12:8 for MSMEs to utilize common cluster test facilities, equipment sharing, and BIS joint verification.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between text-xs text-indigo-deep font-semibold group-hover:text-brass">
              <span>Explore CBTF Concessions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-line text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <SealMotif size={20} />
          <span>Bureau of Indian Standards AI Assistant • SIH Prototype</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>FastAPI + LangGraph</span>
          <span>•</span>
          <span>ChromaDB Local Persisted</span>
          <span>•</span>
          <span>React + Vite</span>
        </div>
      </footer>
    </div>
  );
};
