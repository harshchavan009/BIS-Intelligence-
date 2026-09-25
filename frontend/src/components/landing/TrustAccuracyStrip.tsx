import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Database, FileCheck2, ArrowRight, Sparkles } from 'lucide-react';

export const TrustAccuracyStrip: React.FC = () => {
  const { setActiveTab } = useAppStore();

  return (
    <section 
      aria-label="Public Trust and Accuracy Telemetry" 
      className="bg-gradient-to-r from-bis-navy via-bis-navy-800 to-indigo-950 text-white border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Context */}
        <div className="flex items-center gap-3 shrink-0 text-center lg:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                Trust &amp; Accuracy Telemetry
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Publicly Verified
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              Zero-Hallucination Architecture Tested on Real Gazette Cases
            </div>
          </div>
        </div>

        {/* 3 Clickable Stat Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto flex-1 max-w-4xl lg:mx-4">
          
          {/* Badge 1: 100% Groundedness */}
          <button
            onClick={() => setActiveTab('methodology')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-300/60 rounded-xl text-left transition-all duration-150 group cursor-pointer"
            title="Read Groundedness Evaluation Methodology"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">100.0% Grounded</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white mt-0.5 group-hover:text-amber-200 transition-colors">
              65 Verified Test Cases
            </div>
            <div className="text-[11px] text-gray-300 mt-1 line-clamp-1">
              Zero hallucinations across 11 sectors
            </div>
          </button>

          {/* Badge 2: 1,343 Chunks across 7 Publications */}
          <button
            onClick={() => setActiveTab('methodology')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-300/60 rounded-xl text-left transition-all duration-150 group cursor-pointer"
            title="Inspect Knowledge Base Publications"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">1,343+ Chunks</span>
              <Database className="w-3.5 h-3.5 text-amber-300 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white mt-0.5 group-hover:text-amber-200 transition-colors">
              7 Official Publications
            </div>
            <div className="text-[11px] text-gray-300 mt-1 line-clamp-1">
              Gazette S.O. 191(E), BIS Act &amp; QCOs
            </div>
          </button>

          {/* Badge 3: Clause-Level Citations */}
          <button
            onClick={() => setActiveTab('methodology')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-300/60 rounded-xl text-left transition-all duration-150 group cursor-pointer"
            title="Learn how exact clause citations are extracted"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-300">Clause-Level Citations</span>
              <FileCheck2 className="w-3.5 h-3.5 text-sky-300 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white mt-0.5 group-hover:text-amber-200 transition-colors">
              Every Answer Cites a Clause
            </div>
            <div className="text-[11px] text-gray-300 mt-1 line-clamp-1">
              Not a summary · Exact section anchors
            </div>
          </button>

        </div>

        {/* Action Link to Full Public Methodology */}
        <div className="shrink-0">
          <button
            onClick={() => setActiveTab('methodology')}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-bis-red hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer group"
          >
            <span>Public Methodology &amp; Proof</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
