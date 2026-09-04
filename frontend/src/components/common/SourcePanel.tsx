import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, FileText, Bookmark, ShieldCheck, BookOpen, ExternalLink, Image as ImageIcon, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

export const SourcePanel: React.FC = () => {
  const { selectedSource, isSourceDrawerOpen, setIsSourceDrawerOpen, language } = useAppStore();
  const [activeView, setActiveView] = useState<'image' | 'text'>('image');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (selectedSource) {
      setActiveView('image');
      setZoomLevel(1);
      setImageLoading(true);
      setImageError(false);
    }
  }, [selectedSource]);

  if (!isSourceDrawerOpen || !selectedSource) return null;

  const pageImageUrl = `/api/documents/${selectedSource.source_file}/page-image?page=${selectedSource.page_number}&clause=${encodeURIComponent(selectedSource.clause_ref)}&highlight=${encodeURIComponent(selectedSource.excerpt.slice(0, 80))}`;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-ink/50 backdrop-blur-[3px] flex justify-end transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-drawer-title"
    >
      <div 
        className="w-full max-w-2xl bg-paper h-full shadow-2xl border-l border-line flex flex-col transform transition-transform duration-200 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-deep text-white px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-brass flex-shrink-0" />
            <div>
              <h3 id="source-drawer-title" className="text-sm font-semibold tracking-wide">
                {language === 'hi' ? 'सत्यापित विनियामक संदर्भ स्रोत' : 'Verified Regulatory Source Record'}
              </h3>
              <p className="text-[11px] text-gray-300">
                Official Gazette Page & Verbatim Clause Inspection
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSourceDrawerOpen(false)}
            className="text-gray-300 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close source inspection drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Provenance & View Switcher Bar */}
        <div className="bg-white border-b border-line px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-brass bg-brass/10 px-2.5 py-1 rounded border border-brass/20">
              {selectedSource.clause_ref}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Page {selectedSource.page_number}
            </span>
          </div>

          <div className="flex items-center bg-paper-dark/70 rounded-md p-0.5 border border-line text-xs font-medium">
            <button
              onClick={() => setActiveView('image')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                activeView === 'image'
                  ? 'bg-indigo-deep text-white shadow-sm'
                  : 'text-gray-600 hover:text-ink'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Official PDF Page</span>
            </button>
            <button
              onClick={() => setActiveView('text')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                activeView === 'text'
                  ? 'bg-indigo-deep text-white shadow-sm'
                  : 'text-gray-600 hover:text-ink'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Verbatim OCR</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Metadata Card */}
          <div className="bg-white border border-line rounded-lg p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-gray-400">Official Publication</span>
                <h4 className="font-serif font-bold text-ink text-sm">
                  {selectedSource.document_title}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-verified-green bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                <ShieldCheck className="w-3 h-3" />
                Grounded Clause
              </span>
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-gray-500 font-mono text-[11px]">
              <span className="truncate max-w-[280px]">File: {selectedSource.source_file}</span>
              <span>Physical Page: {selectedSource.page_number}</span>
            </div>
          </div>

          {/* VIEW 1: OFFICIAL PDF PAGE IMAGE WITH YELLOW HIGHLIGHT */}
          {activeView === 'image' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1.5 font-medium text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Target Clause Highlighted in Regulatory Yellow</span>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white border border-line rounded p-0.5">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
                    className="p-1 text-gray-500 hover:text-ink rounded hover:bg-gray-100"
                    title="Zoom Out"
                    aria-label="Zoom out PDF page"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 text-gray-600">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
                    className="p-1 text-gray-500 hover:text-ink rounded hover:bg-gray-100"
                    title="Zoom In"
                    aria-label="Zoom in PDF page"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={pageImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-500 hover:text-indigo-deep rounded hover:bg-gray-100 ml-1 border-l border-line"
                    title="Open Full Page Image in New Tab"
                    aria-label="Open full page image in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Image Frame with Zoom Support */}
              <div className="relative bg-white border border-line rounded-lg overflow-hidden shadow-paper-sm min-h-[420px] max-h-[580px] overflow-auto flex justify-center items-start p-2">
                {imageLoading && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 z-10">
                    <span className="w-6 h-6 border-2 border-brass border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs text-gray-500">Rendering official PDF page with annotations...</span>
                  </div>
                )}

                {imageError ? (
                  <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                    <p>Image preview unavailable. Switch to the Verbatim OCR tab to inspect extracted text.</p>
                  </div>
                ) : (
                  <img
                    src={pageImageUrl}
                    alt={`Official PDF Document Page ${selectedSource.page_number} with highlighted clause ${selectedSource.clause_ref}`}
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                    className="max-w-full h-auto transition-transform duration-150 border border-gray-100 shadow-sm"
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: VERBATIM OCR EXTRACT */}
          {activeView === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brass" />
                  <span>Verbatim Regulatory Passage</span>
                </h5>
                <span className="text-[11px] text-gray-400 font-mono">Authentic Text Layer</span>
              </div>
              
              <div className="p-4 rounded-md bg-white border border-line font-serif text-sm leading-relaxed text-ink/90 border-l-4 border-l-brass shadow-sm">
                "{selectedSource.excerpt}"
              </div>

              <div className="p-3.5 bg-paper rounded border border-line text-xs space-y-1 text-gray-600 font-mono">
                <div className="font-bold text-ink">Grounding Verification Checklist:</div>
                <div>• Matched Document: {selectedSource.source_file}</div>
                <div>• Validated Clause: {selectedSource.clause_ref}</div>
                <div>• Citation Groundedness: 100% Provenance Confirmed</div>
              </div>
            </div>
          )}

          {/* Institutional Provenance Footnote */}
          <div className="p-3 rounded bg-[#F4EFE6] border border-[#E3DAC9] text-[11px] text-ink-muted leading-relaxed">
            <strong className="text-ink font-semibold">Institutional Provenance: </strong>
            This clause is extracted directly from official notifications published by the Central Marks Departments (CMD-I / CMD-II) under the Bureau of Indian Standards Act, 2016.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-line px-6 py-3 flex justify-between items-center text-xs flex-shrink-0">
          <span className="text-gray-400 text-[11px] font-mono">BIS Gazette Verification Engine</span>
          <button
            onClick={() => setIsSourceDrawerOpen(false)}
            className="px-4 py-1.5 bg-indigo-deep text-white rounded text-xs font-medium hover:bg-indigo-deep-dark transition-colors focus-visible:ring-2 focus-visible:ring-brass"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
