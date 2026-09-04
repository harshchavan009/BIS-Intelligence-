import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Info, Database, Cpu, AlertTriangle, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';

export const AboutPage: React.FC = () => {
  const { setActiveTab, language } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper-sm space-y-3">
        <div className="flex items-center gap-2">
          <SealMotif size={22} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            System Architecture & Regulatory Governance
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-ink">
          {language === 'hi' ? 'प्रणाली के बारे में एवं कार्यप्रणाली' : 'About / How This Assistant Works'}
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          The BIS AI Intelligent Assistant is an AI-powered regulatory exploration system designed to make thousands of pages of Indian Standards, Quality Control Orders (QCOs), MSME testing guidelines, and conformity schemes instantly searchable and provably grounded for Indian manufacturers, startups, students, and citizens.
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-gray-500">
          <span className="font-semibold text-ink">Last Updated:</span>
          <span className="bg-paper px-2 py-0.5 rounded border border-line">04 September 2026</span>
          <span className="text-gray-400">|</span>
          <span className="text-emerald-700 font-semibold">Evaluation Status: 100% Grounded</span>
        </div>
      </div>

      {/* 1. What This Assistant Is and Is Not */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What It Is */}
        <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-serif font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-verified-green" />
            <span>What This Assistant IS</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-600 leading-relaxed list-disc pl-4">
            <li>An <strong>assistive regulatory navigator</strong> that synthesizes answers across complex technical schemes and gazette orders.</li>
            <li>A <strong>clause-level grounding engine</strong> that pins every factual claim to an exact physical PDF page and regulatory clause.</li>
            <li>A <strong>bilingual exploration tool</strong> operating natively in English and Hindi for nationwide accessibility.</li>
            <li>An <strong>offline-resilient platform</strong> capable of running locally on government air-gapped infrastructure without third-party API dependencies.</li>
          </ul>
        </div>

        {/* What It Is Not */}
        <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>What This Assistant IS NOT</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-600 leading-relaxed list-disc pl-4">
            <li><strong>Not an official BIS legal determination:</strong> Answers do not replace official gazetted notifications or statutory rulings.</li>
            <li><strong>Not an automated license granter:</strong> Official application submissions and license grants must occur via Manakonline.</li>
            <li><strong>Not connected to live production databases:</strong> Verification tools (CM/L, HUID) operate in simulation demo mode.</li>
            <li><strong>Not an exhaustive index of all 20,000+ IS standards:</strong> The current pilot indexes an intentional 7-document core regulatory subset.</li>
          </ul>
        </div>
      </div>

      {/* 2. Pilot Corpus Scope: The 7 Indexed Documents */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brass" />
              <span>Pilot Corpus Scope (The 7 Indexed Official PDFs)</span>
            </h3>
            <p className="text-xs text-gray-500">
              The assistant operates on a scoped, high-impact pilot corpus representing major regulatory touchpoints:
            </p>
          </div>
          <button
            onClick={() => setActiveTab('registry')}
            className="text-xs text-indigo-deep hover:text-brass font-medium flex items-center gap-1"
          >
            <span>View Full Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">Scheme-I (ISI Mark)</span>
            <div className="font-semibold text-ink mt-1">Product Certification Guidelines & Specific Grant Rules</div>
            <div className="text-gray-500 text-[11px] mt-1">423 total pages across two guidelines covering factory inspection and SIT.</div>
          </div>
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">Scheme-II (CRO)</span>
            <div className="font-semibold text-ink mt-1">Compulsory Registration Scheme for Electronics & IT Goods</div>
            <div className="text-gray-500 text-[11px] mt-1">MeitY and DPIIT mandate covering self-declaration based on recognized lab test reports.</div>
          </div>
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">Scheme-IV (CoC)</span>
            <div className="font-semibold text-ink mt-1">Certificate of Conformity Guidelines (CMD-I/2:16:1)</div>
            <div className="text-gray-500 text-[11px] mt-1">Batch and consignment-wise conformity with 180-day test report validity.</div>
          </div>
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">MSME Testing (CBTF)</span>
            <div className="font-semibold text-ink mt-1">Cluster Based Test Facility Guidelines (CMD-I/2:12:8)</div>
            <div className="text-gray-500 text-[11px] mt-1">Framework enabling MSMEs to share costly test equipment and retain minimal in-house checks.</div>
          </div>
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">Market Surveillance</span>
            <div className="font-semibold text-ink mt-1">Post-Market Surveillance & Feedback Guidelines</div>
            <div className="text-gray-500 text-[11px] mt-1">Enforcement protocols and standardized Annexure-I complaint reporting format.</div>
          </div>
          <div className="p-3 bg-paper rounded border border-line">
            <span className="font-mono text-[10px] text-brass uppercase block font-bold">Quality Control Orders</span>
            <div className="font-semibold text-ink mt-1">Mandatory QCO Statutory Guidance</div>
            <div className="text-gray-500 text-[11px] mt-1">Section 16 enforcement across cement, steel, electronics, and medical devices.</div>
          </div>
        </div>
      </div>

      {/* 3. Technical RAG Architecture & Embeddings */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-deep" />
          <span>Technical Architecture & Retrieval Approach</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="font-bold text-ink flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-brass" />
              <span>1. Dual-Track Hybrid Retrieval</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Combines an ultra-fast deterministic lookup table for 40+ standardized products (<code className="text-[10.5px]">is_product_map.json</code>) with dense semantic vector search in ChromaDB across 325 clause chunks.
            </p>
          </div>

          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="font-bold text-ink flex items-center gap-1.5 font-mono text-[11px]">
              <Globe className="w-3.5 h-3.5 text-indigo-deep" />
              <span>2. Multilingual Dense Embeddings</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Uses <code className="text-[10.5px]">paraphrase-multilingual-MiniLM-L12-v2</code> (384-dimensional dense vectors). Hindi queries match English regulatory chunks natively without translation bottleneck.
            </p>
          </div>

          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="font-bold text-ink flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-verified-green" />
              <span>3. Groundedness Verifier & Offline Engine</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Every synthesized claim is verified against retrieved chunks. If external LLM APIs fail or lose connectivity, the system seamlessly uses an offline deterministic grounded synthesis engine.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Known Limitations */}
      <div className="bg-paper border border-line rounded-lg p-6 space-y-3 text-xs text-gray-700">
        <h4 className="font-serif font-bold text-ink text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-brass" />
          <span>Known Limitations & Boundary Conditions</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white rounded border border-line space-y-1">
            <strong className="text-ink block">Language Parity:</strong>
            <span>Currently supports English and Hindi. Regional official languages (Tamil, Telugu, Bengali, Marathi) are prioritized for Phase 2 via Bhashini API.</span>
          </div>
          <div className="p-3 bg-white rounded border border-line space-y-1">
            <strong className="text-ink block">Static Document Snapshot:</strong>
            <span>Based on official guidelines effective as of September 2026. Continuous ingestion pipeline for weekly gazette notifications is documented in ROADMAP.md.</span>
          </div>
          <div className="p-3 bg-white rounded border border-line space-y-1">
            <strong className="text-ink block">Simulated Registries:</strong>
            <span>CM/L and HUID verifiers use verified demo seed sets for illustration. Real live verification requires institutional access to Manakonline / BIS-CARE APIs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function Globe(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  );
}
