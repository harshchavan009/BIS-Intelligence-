import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FlaskConical, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, BookOpen, Building2 } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';

export const LabFinder: React.FC = () => {
  const { openSource, setQueryPrefill, setActiveTab, language } = useAppStore();
  const [product, setProduct] = useState('Submersible Pumps');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchLabGuidance = async (prodName: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/labs/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: prodName })
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabGuidance(product);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <PageHeader
        eyebrow="MSME Testing Facility Framework (CMD-I/2:12:8)"
        title={language === 'hi' ? 'क्लस्टर आधारित परीक्षण सुविधा (CBTF) खोजक' : 'MSME Cluster Based Test Facility (CBTF) Finder'}
        description={
          language === 'hi'
            ? 'सूक्ष्म, लघु और मध्यम उद्यमों (MSMEs) के लिए साझा परीक्षण प्रयोगशाला दिशानिर्देश। जानें कि बिना भारी पूंजी निवेश के ISI मार्क हेतु परीक्षण कैसे साझा करें।'
            : 'Operational guidelines for Micro, Small & Medium Enterprises (MSMEs) to utilize shared Cluster Based Test Facilities (CBTFs) as an alternative to setting up costly in-house testing labs for Scheme-I licensing.'
        }
      >
        {/* Honesty Banner: General Regulatory Scope */}
        <div className="p-2.5 bg-status-warning/15 border border-status-warning/30 rounded-md flex items-center gap-2 text-xs text-status-warning">
          <BookOpen className="w-4 h-4 text-status-warning flex-shrink-0" />
          <span>
            <strong>CBTF Guideline Scope: </strong>
            Shared cluster test provisions are grounded in official guidelines <em>CMD-I/2:12:8</em>. For sectors without an active cluster facility, the assistant identifies mandatory in-house tests that cannot be outsourced.
          </span>
        </div>
      </PageHeader>

      {/* Product Input Card */}
      <Card padding="md" className="flex flex-col sm:flex-row items-center gap-3 bg-surface border-border">
        <div className="flex-1 w-full">
          <label className="text-[11px] font-semibold text-text-secondary uppercase block mb-1">
            Specify Manufacturing Product / Sector:
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLabGuidance(product)}
            placeholder="e.g. Submersible Pumps, Cement, Electrical Cables, LPG Cylinders, Steel..."
            className="w-full px-3.5 py-2 bg-surface border border-border rounded text-sm text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
        <button
          onClick={() => fetchLabGuidance(product)}
          disabled={loading}
          className="w-full sm:w-auto mt-4 sm:mt-0 px-5 py-2.5 bg-brand-primary hover:brightness-110 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors self-end"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{loading ? 'Evaluating...' : 'Get CBTF Guidance'}</span>
        </button>
      </Card>

      {data && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <Card padding="md" className="border-l-4 border-l-brand-accent bg-surface border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-brand-accent font-bold uppercase">
                Regulatory Provision
              </span>
              {data.sources && data.sources.length > 0 && (
                <button
                  onClick={() => openSource(data.sources[0])}
                  className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Inspect Source ({data.sources[0].source_file})</span>
                </button>
              )}
            </div>
            <p className="text-sm font-sans text-text-primary leading-relaxed">
              {data.cbtf_guidance}
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligible Concessions */}
            <Card padding="md" className="space-y-3 bg-surface border-border">
              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                <Building2 className="w-4 h-4 text-brand-primary" />
                <span>Eligible CBTF Provisions for MSMEs</span>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                {data.eligible_msme_provisions?.map((prov: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-success flex-shrink-0 mt-0.5" />
                    <span>{prov}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Mandatory Retained Tests */}
            <Card padding="md" className="space-y-3 bg-surface border-border">
              <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <span>Mandatory Retained In-House Tests</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Under Clause 2.(i), the following tests cannot be outsourced to a CBTF and must be conducted in-house:
              </p>
              <ul className="space-y-2 text-xs text-text-secondary">
                {data.retained_inhouse_tests?.map((test: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-warning flex-shrink-0 mt-1.5"></span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Verification Process */}
          <Card padding="lg" className="space-y-4 bg-surface border-border">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>How to Request BIS Joint Verification of a CBTF Lab</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.application_steps?.map((step: string, idx: number) => (
                <div key={idx} className="p-3 bg-surface-alt rounded border border-border text-xs text-text-primary space-y-1">
                  <span className="font-mono font-bold text-brand-accent text-[11px]">Step {idx + 1}</span>
                  <p className="leading-relaxed">{step.replace(/^Step \d+:\s*/, '')}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => {
                  setQueryPrefill(`How can an MSME apply for CBTF recognition under CMD-I/2:12:8 for ${product}?`);
                  setActiveTab('chat');
                }}
                className="px-4 py-2 bg-brand-primary hover:brightness-110 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Consult with Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
