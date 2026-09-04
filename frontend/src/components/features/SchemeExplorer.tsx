import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Layers, CheckCircle2, Clock, FileText, ChevronRight, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';

interface Step {
  step_number: number;
  title: string;
  description: string;
  clause_ref?: string;
  timeline_estimate?: string;
}

export const SchemeExplorer: React.FC = () => {
  const { openSource, setQueryPrefill, setActiveTab, language } = useAppStore();
  const [selectedScheme, setSelectedScheme] = useState('Scheme-IV');
  const [timelineSteps, setTimelineSteps] = useState<Step[]>([]);
  const [timelineSources, setTimelineSources] = useState<any[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  const schemesOverview = [
    {
      id: 'Scheme-I',
      name: 'Scheme – I (ISI Mark / Product Certification)',
      tagline: 'Third-party factory certification & license to use the iconic ISI Mark',
      eligibility: 'Domestic & Foreign Manufacturers (FMCS). MSME Cluster Test Facility (CBTF) eligible.',
      timeline: '30–60 working days (Fast-track for MSMEs: 30 days)',
      badge: 'Iconic Standard Mark',
      governing: 'Schedule II, Scheme I of BIS Regulations, 2018'
    },
    {
      id: 'Scheme-II',
      name: 'Scheme – II (Compulsory Registration / CRO)',
      tagline: 'Self-declaration of conformity based on test reports from BIS recognized labs',
      eligibility: 'Manufacturers of Electronics, IT Goods, Solar PV, and Smart Wearables',
      timeline: '15–20 working days',
      badge: 'R-XXXXXXXX Mark',
      governing: 'MeitY & DPIIT Compulsory Registration Orders'
    },
    {
      id: 'Scheme-IV',
      name: 'Scheme – IV (Certificate of Conformity / CoC)',
      tagline: 'Batch or consignment-wise certification with 180-day test report validity',
      eligibility: 'Manufacturers needing conformity certificates without full plant licensing',
      timeline: '20–45 working days',
      badge: 'CoC Certificate',
      governing: 'CMD-I/2:16:1 Guidelines (02 May 2019)'
    },
    {
      id: 'CBTF',
      name: 'CBTF (Cluster Based Test Facility for MSMEs)',
      tagline: 'Shared testing facilities in industrial clusters to slash MSME capital costs',
      eligibility: 'Micro, Small & Medium Enterprises holding valid Udyam registration in a cluster',
      timeline: 'Facility Verification: 3–4 weeks',
      badge: 'MSME Concession',
      governing: 'Ref: CMD-I/2:12:8 (30 April 2021)'
    }
  ];

  const fetchTimeline = async (schemeId: string) => {
    setLoadingSteps(true);
    try {
      const res = await fetch('/api/schemes/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme: schemeId })
      });
      const data = await res.json();
      setTimelineSteps(data.steps || []);
      setTimelineSources(data.sources || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSteps(false);
    }
  };

  useEffect(() => {
    fetchTimeline(selectedScheme);
  }, [selectedScheme]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm">
        <div className="flex items-center gap-2 mb-1">
          <SealMotif size={20} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            Conformity Assessment Framework
          </span>
        </div>
        <h1 className="text-2xl font-serif text-ink">
          {language === 'hi' ? 'बीआईएस प्रमाणन योजनाएं एवं चरण-दर-चरण प्रक्रिया' : 'BIS Certification Schemes & Process Timeline'}
        </h1>
        <p className="text-xs text-ink-muted mt-1 max-w-3xl">
          {language === 'hi'
            ? 'अपनी विनिर्माण श्रेणी के लिए उपयुक्त योजना चुनें। पात्रता, परीक्षण आवश्यकताएं और आधिकारिक विनियामक अनुक्रम देखें।'
            : 'Compare the governing conformity assessment frameworks under Schedule II of the BIS Regulations 2018. Inspect real procedural timelines derived directly from official guidelines.'}
        </p>
      </div>

      {/* Scheme Comparison Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {schemesOverview.map((scheme) => {
          const isSelected = selectedScheme === scheme.id;
          return (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-white border-brass ring-2 ring-brass/20 shadow-paper'
                  : 'bg-white border-line hover:border-brass/40 shadow-paper-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-brass bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                    {scheme.badge}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-brass animate-pulse"></span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-ink font-serif leading-snug">
                  {scheme.name}
                </h3>
                <p className="text-[11.5px] text-gray-600 leading-relaxed">
                  {scheme.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-line/50 space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Eligibility:</span>
                  <span className="text-ink font-medium text-[11px]">{scheme.eligibility}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Duration:</span>
                  <span className="text-indigo-deep font-semibold text-[11px]">{scheme.timeline}</span>
                </div>
              </div>

              <button
                className={`w-full py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-brass text-white'
                    : 'bg-paper text-ink hover:bg-paper-dark'
                }`}
              >
                <span>{isSelected ? 'Viewing Timeline' : 'Explore Timeline'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step Interactive Timeline */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-line gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brass font-semibold">
              Step-by-Step Regulatory Flow
            </span>
            <h2 className="text-xl font-serif text-ink">
              Official Procedural Sequence for {selectedScheme}
            </h2>
          </div>
          {timelineSources.length > 0 && (
            <button
              onClick={() => openSource(timelineSources[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-paper-dark border border-line rounded text-xs font-medium text-ink transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-brass" />
              <span>Inspect Source ({timelineSources[0].clause_ref})</span>
            </button>
          )}
        </div>

        {loadingSteps ? (
          <div className="py-12 text-center text-xs text-gray-400 font-mono">
            Loading regulatory timeline from official clauses...
          </div>
        ) : (
          <div className="mt-8 space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-line">
            {timelineSteps.map((step) => (
              <div key={step.step_number} className="relative pl-10 group">
                {/* Step Circle Indicator */}
                <div className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-paper border-2 border-brass text-brass flex items-center justify-center text-xs font-bold font-mono group-hover:bg-brass group-hover:text-white transition-colors">
                  {step.step_number}
                </div>

                <div className="bg-paper p-4 rounded-lg border border-line space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink font-serif">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {step.timeline_estimate && (
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {step.timeline_estimate}
                        </span>
                      )}
                      {step.clause_ref && (
                        <span className="text-[10.5px] font-mono text-brass bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                          {step.clause_ref}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer call to action */}
        <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Need licensing assistance for a specific product under this scheme?
          </span>
          <button
            onClick={() => {
              setQueryPrefill(`Guide me through the licensing process for a product under ${selectedScheme}.`);
              setActiveTab('chat');
            }}
            className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Ask Assistant in Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
