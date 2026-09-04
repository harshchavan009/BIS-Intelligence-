import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, Smartphone, ArrowRight, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';
import { SimulatedBadge } from '../common/SimulatedBadge';

export const ConsumerMode: React.FC = () => {
  const { setQueryPrefill, setActiveTab, openSource, language } = useAppStore();
  const [cmlInput, setCmlInput] = useState('CM/L-8400123');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const demoChips = [
    { label: "Cement License (Valid)", code: "CM/L-8400123" },
    { label: "Steel Re-bar (Valid)", code: "CM/L-7200456" },
    { label: "Electric Appliance (Valid)", code: "CM/L-6300112" },
    { label: "Unknown Code (Rejection Demo)", code: "CM/L-9999999" }
  ];

  const handleVerify = async (codeToVerify?: string) => {
    const code = (codeToVerify || cmlInput).trim();
    if (!code) return;
    setLoading(true);

    try {
      const res = await fetch('/api/verify/cml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cml_number: code })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (e) {
      setVerificationResult({
        found: false,
        simulated: true,
        message: "Failed to connect to verification service."
      });
    } finally {
      setLoading(false);
    }
  };

  const surveillanceDocSource = {
    document_title: "Guidelines for market surveillance during operation of licence under Scheme-I",
    source_file: "market-surveillance-guidelines.pdf",
    clause_ref: "CMD-I/2:12:7 (Annexure-I)",
    page_number: 3,
    excerpt: "Format for reporting market surveillance and feedback under Scheme-I of Schedule-II of BIS Regulations, 2018. Any instances of violations of the BIS Act, 2016 observed shall be reported.",
    grounded: true
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm">
        <div className="flex items-center gap-2 mb-1">
          <SealMotif size={20} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            Consumer Vigilance & Post-Market Surveillance
          </span>
        </div>
        <h1 className="text-2xl font-serif text-ink">
          {language === 'hi' ? 'उपभोक्ता अधिकार एवं ISI मार्क प्रामाणिकता' : 'Consumer Rights & ISI Mark Verification'}
        </h1>
        <p className="text-xs text-ink-muted mt-1 max-w-3xl">
          {language === 'hi'
            ? 'जांचें कि किसी उत्पाद पर लगा ISI मार्क असली है या नकली। घटिया उत्पाद पाए जाने पर बाजार निगरानी दिशानिर्देशों के तहत शिकायत पत्र का प्रारूप डाउनलोड करें।'
            : 'Verify whether an ISI mark on a consumer product is genuine. Understand enforcement under Section 17 & 29 of the BIS Act, 2016 and generate formal feedback letters.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ISI Mark Verification Tool */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-ink font-serif flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-brass" />
                <span>Verify CM/L License Number</span>
              </h3>
            </div>

            {/* Simulated Badge Requirement 1.2 */}
            <SimulatedBadge defaultExpanded={false} />

            <p className="text-xs text-gray-600 leading-relaxed">
              Every genuine ISI mark contains the <strong>IS Number</strong> on top and a unique <strong>7-digit CM/L number</strong> at the bottom.
            </p>

            {/* Interactive Demo Test Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                Try Verified Demo Codes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {demoChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCmlInput(chip.code);
                      handleVerify(chip.code);
                    }}
                    className={`text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
                      chip.code.includes('9999')
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        : 'bg-paper text-ink border-line hover:border-brass hover:bg-white'
                    }`}
                  >
                    {chip.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Action */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={cmlInput}
                onChange={(e) => setCmlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="e.g. CM/L-8400123"
                className="flex-1 px-3.5 py-2 bg-paper border border-line rounded text-xs font-mono uppercase focus:outline-none focus:border-brass focus-visible:ring-1 focus-visible:ring-brass"
                aria-label="Enter CM/L License Number to simulate verification"
              />
              <button
                onClick={() => handleVerify()}
                disabled={loading || !cmlInput.trim()}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brass"
              >
                {loading ? 'Checking...' : 'Verify Mark'}
              </button>
            </div>

            {/* Result State: VALID SEED FOUND */}
            {verificationResult && verificationResult.found && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-900 text-[11px]">
                    {verificationResult.data.cml_number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-verified-green bg-white px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {verificationResult.data.status}
                  </span>
                </div>
                <div className="space-y-1 text-gray-700 font-sans">
                  <div><strong>Standard:</strong> {verificationResult.data.standard}</div>
                  <div><strong>Licensee:</strong> {verificationResult.data.company}</div>
                  <div><strong>Factory:</strong> {verificationResult.data.factory_address}</div>
                  <div><strong>Validity:</strong> {verificationResult.data.valid_till}</div>
                  <div><strong>Scheme:</strong> {verificationResult.data.scheme}</div>
                </div>
                <div className="pt-1 text-[10.5px] text-emerald-800/80 italic font-mono border-t border-emerald-200/60">
                  Simulated from demo dataset. In production, connects to Manakonline live registry.
                </div>
              </div>
            )}

            {/* Result State: HONEST NOT-FOUND REJECTION */}
            {verificationResult && !verificationResult.found && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-2 text-xs text-red-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Not Found in Demo Dataset</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  {verificationResult.message || `License number "${cmlInput}" was not found in the local demo seed set.`}
                </p>
                <p className="text-[10.5px] text-red-700 bg-white/70 p-2 rounded border border-red-200">
                  <strong>Verification Guardrail: </strong>
                  The assistant deliberately does not generate fake authentic statuses for arbitrary input. Live registry lookup requires connection to the official BIS-CARE API.
                </p>
              </div>
            )}

            {/* Checklist: How to spot fake ISI marks */}
            <div className="pt-4 border-t border-line space-y-2">
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
                How to Spot a Fake or Counterfeit Mark:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Missing CM/L number below the ISI rectangle mark.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Expired license or manufacturer name mismatch in BIS CARE app.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Missing grade designation (e.g. 53 Grade for cement, Fe 500D for steel).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Annexure-I Feedback Letter Format */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink font-serif flex items-center gap-2">
                <FileText className="w-4 h-4 text-brass" />
                <span>Formal Feedback Letter (Annexure-I)</span>
              </h3>
              <button
                onClick={() => openSource(surveillanceDocSource)}
                className="text-xs text-indigo-deep hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brass rounded"
              >
                <BookOpen className="w-3.5 h-3.5 text-brass" />
                <span>Inspect Clause</span>
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Extracted directly from <strong>CMD-I/2:12:7 (Market Surveillance Guidelines)</strong>. Use this standardized template to submit physical complaints to the nearest BIS Branch Office:
            </p>

            {/* Letter Format Mockup Card */}
            <div className="p-4 bg-paper rounded border border-line font-mono text-[11px] text-gray-800 space-y-2 leading-relaxed">
              <div className="text-center font-bold text-ink">
                FORM OF COMPLAINT / FEEDBACK ON SURVEILLANCE
              </div>
              <div className="text-center text-[10px] text-gray-500">
                [Under Annexure-I of BIS Market Surveillance Guidelines CMD-I/2:12:7]
              </div>
              <hr className="border-line" />
              <div>1. Name & Address of Purchaser: _______________________</div>
              <div>2. Product Name & IS Number: _________________________</div>
              <div>3. Brand Name & Variety: ____________________________</div>
              <div>4. CM/L Number Marked on Sample: ___________________</div>
              <div>5. Batch / Lot No. & Date of Mfg: ____________________</div>
              <div>6. Defect Observed: Substandard quality / Fake ISI mark</div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-gray-500 text-[11px]">
                Grounding Source: CMD-I/2:12:7 Page 3
              </span>
              <button
                onClick={() => {
                  setQueryPrefill("Draft a complete legal complaint letter for substandard cement purchased with an unverified ISI mark under Section 17 of BIS Act 2016.");
                  setActiveTab('chat');
                }}
                className="px-3.5 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-brass"
              >
                <span>Draft Complaint in Assistant</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
