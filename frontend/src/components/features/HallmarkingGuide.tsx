import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Gem, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Smartphone, Info } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';
import { SimulatedBadge } from '../common/SimulatedBadge';

export const HallmarkingGuide: React.FC = () => {
  const { setQueryPrefill, setActiveTab, language } = useAppStore();
  const [huidInput, setHuidInput] = useState('AB7842');
  const [huidResult, setHuidResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const demoChips = [
    { label: "22K Gold Ring (Valid)", code: "AB7842" },
    { label: "18K Gold Chain (Valid)", code: "KJ9012" },
    { label: "14K Gold Bangle (Valid)", code: "DL3456" },
    { label: "Unknown HUID (Rejection Demo)", code: "XX0000" }
  ];

  const handleVerifyHUID = async (codeToVerify?: string) => {
    const code = (codeToVerify || huidInput).trim();
    if (!code) return;
    setLoading(true);

    try {
      const res = await fetch('/api/verify/huid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ huid: code })
      });
      const data = await res.json();
      setHuidResult(data);
    } catch (e) {
      setHuidResult({
        found: false,
        simulated: true,
        message: "Failed to connect to verification service."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm">
        <div className="flex items-center gap-2 mb-1">
          <SealMotif size={20} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            Precious Metals Conformity Framework
          </span>
        </div>
        <h1 className="text-2xl font-serif text-ink">
          {language === 'hi' ? 'सोने की हॉलमार्किंग एवं HUID सत्यापन' : 'Gold Hallmarking & HUID Verification'}
        </h1>
        <p className="text-xs text-ink-muted mt-1 max-w-3xl">
          {language === 'hi'
            ? 'सोने के आभूषणों पर अनिवार्य बीआईएस हॉलमार्क के 3 प्रतीक पहचानें और 6-अंकों के HUID कोड का सत्यापन करें।'
            : 'Official guidance on mandatory hallmarking of gold jewellery and artefacts under the Bureau of Indian Standards Hallmarking Scheme.'}
        </p>

        {/* Pluggable General Guidance Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>General Regulatory Guidance: </strong>
            This module provides general statutory guidance. Adding a dedicated hallmarking PDF to <code className="bg-white px-1 rounded font-mono text-[10.5px]">data/knowledge_base/</code> automatically indexes and lights up deep clause citations without code changes.
          </span>
        </div>
      </div>

      {/* The 3 Essential Hallmark Symbols */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-4">
        <h3 className="text-sm font-bold text-ink font-serif">
          The 3 Mandatory Marks on Genuine BIS Hallmarked Gold Jewellery
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mark 1: BIS Logo */}
          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-brass text-white flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                BIS Triangular Standard Logo
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              The official triangular Bureau of Indian Standards mark certifying compliance with national hallmarking regulations.
            </p>
          </div>

          {/* Mark 2: Purity Grade */}
          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-brass text-white flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Purity / Fineness Grade
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Specifies the exact gold karatage and fineness in parts per thousand: <strong>22K916</strong> (22 Karat), <strong>18K750</strong> (18 Karat), or <strong>14K585</strong> (14 Karat).
            </p>
          </div>

          {/* Mark 3: 6-Digit HUID */}
          <div className="p-4 bg-paper rounded border border-line space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-brass text-white flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                6-Digit Alphanumeric HUID
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hallmark Unique Identification (e.g. <code>AB7842</code>) laser engraved on each individual article ensuring complete traceability.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive HUID Verifier */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-4">
        <h3 className="text-sm font-bold text-ink font-serif flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-brass" />
          <span>Interactive HUID Verifier</span>
        </h3>

        {/* Simulated Badge Requirement 1.2 */}
        <SimulatedBadge defaultExpanded={false} />

        <p className="text-xs text-gray-600">
          Enter the 6-digit alphanumeric HUID stamped on any gold article to simulate hallmarking registry inspection:
        </p>

        {/* Interactive Demo Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
            Try Verified Demo HUIDs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {demoChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setHuidInput(chip.code);
                  handleVerifyHUID(chip.code);
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                  chip.code.includes('XX')
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-paper text-ink border-line hover:border-brass hover:bg-white'
                }`}
              >
                {chip.code} ({chip.label})
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 max-w-md pt-1">
          <input
            type="text"
            maxLength={6}
            value={huidInput}
            onChange={(e) => setHuidInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleVerifyHUID()}
            placeholder="e.g. AB7842"
            className="flex-1 px-3 py-2 bg-paper border border-line rounded text-xs font-mono uppercase focus:outline-none focus:border-brass focus-visible:ring-1 focus-visible:ring-brass"
            aria-label="Enter 6-digit alphanumeric HUID code"
          />
          <button
            onClick={() => handleVerifyHUID()}
            disabled={loading || !huidInput.trim()}
            className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brass"
          >
            {loading ? 'Checking...' : 'Verify HUID'}
          </button>
        </div>

        {/* Result State: VALID SEED FOUND */}
        {huidResult && huidResult.found && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-900 text-[11px]">
                HUID: {huidResult.data.huid}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-verified-green bg-white px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                {huidResult.data.status}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 pt-1 font-sans">
              <div><strong>Article Type:</strong> {huidResult.data.article_type}</div>
              <div><strong>Purity:</strong> {huidResult.data.purity}</div>
              <div><strong>Jeweller:</strong> {huidResult.data.jeweller_name}</div>
              <div><strong>Assaying Centre:</strong> {huidResult.data.hallmarking_center}</div>
              <div><strong>Date Hallmarked:</strong> {huidResult.data.hallmarked_date}</div>
            </div>
            <div className="pt-1 text-[10.5px] text-emerald-800/80 italic font-mono border-t border-emerald-200/60">
              Simulated from demo dataset. In production, connects to live BIS-CARE API.
            </div>
          </div>
        )}

        {/* Result State: HONEST NOT-FOUND REJECTION */}
        {huidResult && !huidResult.found && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-2 text-xs text-red-900">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Not Found in Demo Dataset</span>
            </div>
            <p className="text-[11.5px] leading-relaxed">
              {huidResult.message || `HUID "${huidInput}" was not found in the local demo seed set.`}
            </p>
            <p className="text-[10.5px] text-red-700 bg-white/70 p-2 rounded border border-red-200">
              <strong>Verification Guardrail: </strong>
              The assistant deliberately does not generate fake authentic statuses for arbitrary input. Live registry lookup requires integration with the official BIS-CARE HUID database.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-line flex justify-end">
          <button
            onClick={() => {
              setQueryPrefill("Explain the legal requirements and consumer recourse if hallmarked jewellery is found to be of lower purity.");
              setActiveTab('chat');
            }}
            className="px-4 py-2 bg-paper hover:bg-paper-dark border border-line text-ink rounded text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-brass"
          >
            <span>Ask Recourse in Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
