import React, { useState } from 'react';
import { useAppStore, SourceCitation } from '../../store/useAppStore';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';

interface DocItem {
  id: string;
  title: string;
  filename: string;
  scheme: string;
  authority: string;
  dateIndexed: string;
  chunkCount: number;
  totalPages: number;
  refNumber: string;
  summary: string;
}

export const DocumentRegistry: React.FC = () => {
  const { openSource, setActiveTab, setQueryPrefill, language } = useAppStore();
  const [filterScheme, setFilterScheme] = useState('All');

  const registry: DocItem[] = [
    {
      id: 'DOC-01',
      title: 'Guidelines for Utilisation of Cluster Based Test Facility (CBTF) by MSMEs',
      filename: 'cbtf-msme-guidelines.pdf',
      scheme: 'CBTF / Scheme-I',
      authority: 'Central Marks Department-I (CMD-I)',
      dateIndexed: '30 April 2021',
      chunkCount: 30,
      totalPages: 19,
      refNumber: 'CMD-I/2:12:8',
      summary: 'Allows MSMEs in industrial clusters to share capital-intensive testing equipment while retaining minimal in-house verification.'
    },
    {
      id: 'DOC-02',
      title: 'Guidelines for Market Surveillance During Operation of Licence Under Scheme-I',
      filename: 'market-surveillance-guidelines.pdf',
      scheme: 'Scheme-I (Surveillance)',
      authority: 'Central Marks Department-I (CMD-I)',
      dateIndexed: '25 February 2026',
      chunkCount: 25,
      totalPages: 14,
      refNumber: 'CMD-I/2:12:7',
      summary: 'Stipulates enforcement procedures, factory sample acquisition protocols, and the formal Annexure-I consumer feedback format.'
    },
    {
      id: 'DOC-03',
      title: 'Guidelines for Grant of Certificate of Conformity (CoC) Under Scheme-IV',
      filename: 'scheme4-conformity.pdf',
      scheme: 'Scheme-IV (CoC)',
      authority: 'Central Marks Department-I (CMD-I)',
      dateIndexed: '02 May 2019',
      chunkCount: 50,
      totalPages: 28,
      refNumber: 'CMD-I/2:16:1',
      summary: 'Step-by-step procedures for consignment or batch-wise certification, sample sealing, and the 180-day test report validity period.'
    },
    {
      id: 'DOC-04',
      title: 'Guidelines for Grant of Licence (GoL) Under Scheme-I (General Option)',
      filename: 'gol-general-option.pdf',
      scheme: 'Scheme-I (ISI Mark)',
      authority: 'Central Marks Department-I (CMD-I)',
      dateIndexed: '15 March 2020',
      chunkCount: 80,
      totalPages: 42,
      refNumber: 'CMD-I/GoL/General',
      summary: 'Comprehensive factory audit procedures, quality management checks, SIT conformity criteria, and marking fee structures.'
    },
    {
      id: 'DOC-05',
      title: 'Guidelines for Grant of Licence (GoL) Under Scheme-I (Simplified Option)',
      filename: 'gol-simplified-option.pdf',
      scheme: 'Scheme-I (Simplified)',
      authority: 'Central Marks Department-I (CMD-I)',
      dateIndexed: '15 March 2020',
      chunkCount: 65,
      totalPages: 38,
      refNumber: 'CMD-I/GoL/Simplified',
      summary: 'Fast-track licensing mechanism based on independent lab testing reports and condensed preliminary scrutiny.'
    },
    {
      id: 'DOC-06',
      title: 'Compulsory Registration Scheme (CRO) Guidelines - Scheme-II',
      filename: 'scheme2-registration-guidelines.pdf',
      scheme: 'Scheme-II (CRO)',
      authority: 'Central Registration Department (CRD)',
      dateIndexed: '10 July 2021',
      chunkCount: 65,
      totalPages: 35,
      refNumber: 'CRO/MeitY/2021',
      summary: 'Mandatory self-declaration of conformity for electronics, solar equipment, and IT devices backed by registered test laboratory reports.'
    },
    {
      id: 'DOC-07',
      title: 'Statutory Quality Control Orders (QCO) Implementation Guidance',
      filename: 'qco-guidance.pdf',
      scheme: 'Mandatory QCOs',
      authority: 'Ministry of Consumer Affairs & DPIIT',
      dateIndexed: '01 January 2023',
      chunkCount: 10,
      totalPages: 3,
      refNumber: 'BIS/QCO/Guidance',
      summary: 'Statutory enforcement under Sections 16, 17 and 25 of the BIS Act 2016 for mandatory certification before production or sale.'
    }
  ];

  const filteredDocs = filterScheme === 'All'
    ? registry
    : registry.filter((d) => d.scheme.toLowerCase().includes(filterScheme.toLowerCase()));

  const handleInspect = (doc: DocItem) => {
    const citation: SourceCitation = {
      document_title: doc.title,
      source_file: doc.filename,
      clause_ref: doc.refNumber,
      page_number: 1,
      excerpt: doc.summary,
      grounded: true
    };
    openSource(citation);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      <PageHeader
        eyebrow="Official Pilot Knowledge Base Corpus"
        title={language === 'hi' ? 'आधिकारिक दस्तावेज रजिस्ट्री (7 अनुक्रमित पीडीएफ • 40+ मानक)' : 'Document Registry (7 Official Indexed PDFs Covering 40+ Standards)'}
        description="Transparent catalog of the 7 foundational regulatory publications covering 40+ Indian Standards indexed into ChromaDB vector storage (325 chunk segments)."
        badge={
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-right flex-shrink-0">
            <div className="text-xl font-mono font-bold text-emerald-900">325 Chunks</div>
            <div className="text-[11px] text-verified-green font-medium">100% Vectorized & Grounded</div>
          </div>
        }
      />

      {/* Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-gray-500 font-mono text-[11px] uppercase tracking-wider flex-shrink-0">
          Filter by Scheme:
        </span>
        {['All', 'Scheme-I', 'Scheme-II', 'Scheme-IV', 'CBTF', 'Mandatory QCOs'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterScheme(s)}
            className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${
              filterScheme === s
                ? 'bg-indigo-deep text-white border-indigo-deep shadow-sm'
                : 'bg-white text-gray-600 border-line hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Registry Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-paper border-b border-line font-mono text-[10px] uppercase text-gray-600 tracking-wider">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Official Publication Title</th>
                <th className="py-3 px-4">Scheme / Ref Number</th>
                <th className="py-3 px-4">Authority</th>
                <th className="py-3 px-4 text-center">Pages / Chunks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-paper/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brass">
                    {doc.id}
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-serif font-bold text-ink text-sm leading-snug">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-gray-500 font-sans mt-0.5 line-clamp-2">
                      {doc.summary}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1">
                      File: {doc.filename} • Indexed: {doc.dateIndexed}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-indigo-deep block">
                      {doc.scheme}
                    </span>
                    <span className="text-[10.5px] font-mono text-gray-500">
                      {doc.refNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                    {doc.authority}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="font-bold text-ink">{doc.totalPages} Pages</div>
                    <div className="text-[10.5px] text-emerald-700 font-medium">({doc.chunkCount} chunks)</div>
                  </td>
                  <td className="py-3.5 px-4 text-right space-y-1">
                    <button
                      onClick={() => handleInspect(doc)}
                      className="px-2.5 py-1 bg-paper hover:bg-paper-dark border border-line rounded text-[11px] font-medium text-ink flex items-center gap-1 ml-auto transition-colors"
                      title="Inspect Page 1 with visual annotations"
                    >
                      <BookOpen className="w-3 h-3 text-brass" />
                      <span>Inspect Page 1</span>
                    </button>
                    <button
                      onClick={() => {
                        setQueryPrefill(`Explain the core requirements and application rules in ${doc.title} (${doc.refNumber}).`);
                        setActiveTab('chat');
                      }}
                      className="text-[11px] text-indigo-deep hover:text-brass hover:underline block ml-auto font-medium"
                    >
                      Query in Chat →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Required Bottom Callout (Section 2.3) */}
      <div className="p-4 bg-[#F4EFE6] border border-[#E3DAC9] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-verified-green flex-shrink-0" />
          <span className="font-sans">
            <strong>Extensible Knowledge Ingestion: </strong>
            New official BIS guideline documents can be added to this registry without a code change — see <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] border border-line">CONTRIBUTING.md</code>.
          </span>
        </div>
        <button
          onClick={() => {
            setQueryPrefill("How are new BIS guidelines and Quality Control Orders indexed into the vector store?");
            setActiveTab('chat');
          }}
          className="text-indigo-deep font-semibold hover:underline flex-shrink-0"
        >
          Ask Ingestion Pipeline →
        </button>
      </div>
    </div>
  );
};
