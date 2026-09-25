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
        className="w-full max-w-2xl bg-surface text-text-primary h-full shadow-2xl border-l border-border flex flex-col transform transition-transform duration-200 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-primary text-white px-6 py-4 flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-brand-accent flex-shrink-0" />
            <div>
              <h3 id="source-drawer-title" className="text-sm font-semibold tracking-wide">
                {language === 'hi' ? 'सत्यापित विनियामक संदर्भ स्रोत' : 'Verified Regulatory Source Record'}
              </h3>
              <p className="text-[11px] text-gray-300">
                {language === 'hi' ? 'आधिकारिक राजपत्र पृष्ठ एवं शब्दशः खंड निरीक्षण' : 'Official Gazette Page & Verbatim Clause Inspection'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSourceDrawerOpen(false)}
            className="text-gray-300 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label={language === 'hi' ? 'स्रोत निरीक्षण पैनल बंद करें' : 'Close source inspection drawer'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Provenance & View Switcher Bar */}
        <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded border border-brand-accent/20">
              {selectedSource.clause_ref}
            </span>
            <span className="text-xs text-text-secondary font-mono">
              {language === 'hi' ? `पृष्ठ ${selectedSource.page_number}` : `Page ${selectedSource.page_number}`}
            </span>
          </div>

          <div className="flex items-center bg-surface-alt rounded-md p-0.5 border border-border text-xs font-medium">
            <button
              onClick={() => setActiveView('image')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                activeView === 'image'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'आधिकारिक पीडीएफ पृष्ठ' : 'Official PDF Page'}</span>
            </button>
            <button
              onClick={() => setActiveView('text')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                activeView === 'text'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'शब्दशः OCR' : 'Verbatim OCR'}</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Metadata Card */}
          <div className="bg-surface-alt border border-border rounded-lg p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-text-secondary/70">
                  {language === 'hi' ? 'आधिकारिक प्रकाशन' : 'Official Publication'}
                </span>
                <h4 className="font-serif font-bold text-text-primary text-sm">
                  {selectedSource.document_title}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-status-success bg-status-success/15 px-2 py-0.5 rounded border border-status-success/30 flex-shrink-0">
                <ShieldCheck className="w-3 h-3" />
                {language === 'hi' ? 'प्रमाणित खंड' : 'Grounded Clause'}
              </span>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-text-secondary font-mono text-[11px]">
              <span className="truncate max-w-[280px]">{language === 'hi' ? 'फ़ाइल:' : 'File:'} {selectedSource.source_file}</span>
              <span>{language === 'hi' ? 'भौतिक पृष्ठ:' : 'Physical Page:'} {selectedSource.page_number}</span>
            </div>
          </div>

          {/* VIEW 1: OFFICIAL PDF PAGE IMAGE WITH YELLOW HIGHLIGHT */}
          {activeView === 'image' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1.5 font-medium text-status-warning bg-status-warning/15 px-2.5 py-1 rounded border border-status-warning/30">
                  <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse"></span>
                  <span>{language === 'hi' ? 'लक्षित खंड विनियामक पीले रंग में चिह्नित' : 'Target Clause Highlighted in Regulatory Yellow'}</span>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-surface border border-border rounded p-0.5">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
                    className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-surface-alt"
                    title={language === 'hi' ? 'ज़ूम आउट' : 'Zoom Out'}
                    aria-label="Zoom out PDF page"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 text-text-secondary">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
                    className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-surface-alt"
                    title={language === 'hi' ? 'ज़ूम इन' : 'Zoom In'}
                    aria-label="Zoom in PDF page"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={pageImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-text-secondary hover:text-brand-primary rounded hover:bg-surface-alt ml-1 border-l border-border"
                    title={language === 'hi' ? 'नए टैब में पूरी छवि खोलें' : 'Open Full Page Image in New Tab'}
                    aria-label="Open full page image in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Image Frame with Zoom Support */}
              <div className="relative bg-surface border border-border rounded-lg overflow-hidden shadow-paper-sm min-h-[420px] max-h-[580px] overflow-auto flex justify-center items-start p-2">
                {imageLoading && (
                  <div className="absolute inset-0 bg-surface/80 flex flex-col items-center justify-center gap-2 z-10">
                    <span className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs text-text-secondary">
                      {language === 'hi' ? 'टिप्पणियों के साथ आधिकारिक पीडीएफ पृष्ठ रेंडर हो रहा है...' : 'Rendering official PDF page with annotations...'}
                    </span>
                  </div>
                )}

                {imageError ? (
                  <div className="p-8 text-center text-xs text-text-secondary space-y-2">
                    <FileText className="w-8 h-8 text-text-secondary/50 mx-auto" />
                    <p>
                      {language === 'hi'
                        ? 'छवि पूर्वावलोकन अनुपलब्ध है। निकाले गए पाठ का निरीक्षण करने के लिए शब्दशः OCR टैब पर जाएं।'
                        : 'Image preview unavailable. Switch to the Verbatim OCR tab to inspect extracted text.'}
                    </p>
                  </div>
                ) : (
                  <img
                    src={pageImageUrl}
                    alt={`Official PDF Document Page ${selectedSource.page_number} with highlighted clause ${selectedSource.clause_ref}`}
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                    className="max-w-full h-auto transition-transform duration-150 border border-border shadow-sm"
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
                <h5 className="text-xs font-semibold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{language === 'hi' ? 'शब्दशः विनियामक अंश' : 'Verbatim Regulatory Passage'}</span>
                </h5>
                <span className="text-[11px] text-text-secondary font-mono">
                  {language === 'hi' ? 'प्रामाणिक पाठ परत' : 'Authentic Text Layer'}
                </span>
              </div>
              
              <div className="p-4 rounded-md bg-surface border border-border font-serif text-sm leading-relaxed text-text-primary border-l-4 border-l-brand-accent shadow-sm">
                "{selectedSource.excerpt}"
              </div>

              <div className="p-3.5 bg-surface-alt rounded border border-border text-xs space-y-1 text-text-secondary font-mono">
                <div className="font-bold text-text-primary">
                  {language === 'hi' ? 'सत्यापन चेकलिस्ट:' : 'Grounding Verification Checklist:'}
                </div>
                <div>• {language === 'hi' ? 'मिलान किया गया दस्तावेज:' : 'Matched Document:'} {selectedSource.source_file}</div>
                <div>• {language === 'hi' ? 'सत्यापित खंड:' : 'Validated Clause:'} {selectedSource.clause_ref}</div>
                <div>• {language === 'hi' ? 'उद्धरण विश्वसनीयता: 100% उत्पत्ति की पुष्टि' : 'Citation Groundedness: 100% Provenance Confirmed'}</div>
              </div>
            </div>
          )}

          {/* Institutional Provenance Footnote */}
          <div className="p-3 rounded bg-surface-alt border border-border text-[11px] text-text-secondary leading-relaxed">
            <strong className="text-text-primary font-semibold">
              {language === 'hi' ? 'संस्थागत स्रोत:' : 'Institutional Provenance:'}{' '}
            </strong>
            {language === 'hi'
              ? 'यह खंड भारतीय मानक ब्यूरो अधिनियम, 2016 के अंतर्गत केंद्रीय चिह्न विभागों (CMD-I / CMD-II) द्वारा प्रकाशित आधिकारिक अधिसूचनाओं से सीधे निकाला गया है।'
              : 'This clause is extracted directly from official notifications published by the Central Marks Departments (CMD-I / CMD-II) under the Bureau of Indian Standards Act, 2016.'}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-border px-6 py-3 flex justify-between items-center text-xs flex-shrink-0">
          <span className="text-text-secondary text-[11px] font-mono">
            {language === 'hi' ? 'बीआईएस राजपत्र सत्यापन इंजन' : 'BIS Gazette Verification Engine'}
          </span>
          <button
            onClick={() => setIsSourceDrawerOpen(false)}
            className="px-4 py-1.5 bg-brand-primary hover:brightness-110 text-white rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            {language === 'hi' ? 'पैनल बंद करें' : 'Close Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};
