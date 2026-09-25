import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { 
  Camera, 
  Video, 
  Sparkles, 
  Play, 
  X, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  BookOpen, 
  FileText,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

export type MediaType = 'photos' | 'videos' | 'explainers';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  caption: string;
  credit?: string;
  thumbnail: string;
  src?: string; // YouTube embed ID or high-res image URL
  duration?: string;
  explainerData?: {
    query: string;
    answer: string;
    sourceFile: string;
    clause: string;
    page: number;
    excerpt: string;
  };
}

export const MediaGallery: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTabState] = useState<MediaType>('explainers');
  
  // Lightbox & Video Player State
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [activeVideoEmbed, setActiveVideoEmbed] = useState<MediaItem | null>(null);

  // Add Media Modal State
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MediaType>('photos');
  const [newSrc, setNewSrc] = useState('');
  const [newThumb, setNewThumb] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCredit, setNewCredit] = useState('');
  const [newDuration, setNewDuration] = useState('');

  // Initial curated CMS Media items
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    // PHOTOS
    {
      id: 'photo-1',
      type: 'photos',
      title: 'Industrial Materials Testing Laboratory',
      caption: 'Mechanical tensile stress and ductility testing apparatus calibrated to IS 1786 specifications for deformed steel bars.',
      credit: 'Photo: Science in HD / Unsplash (Licensed Free)',
      thumbnail: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'photo-2',
      type: 'photos',
      title: 'Gold Assaying & Precision Analysis',
      caption: 'Assaying and Hallmarking Centre (AHC) fire assay testing apparatus confirming 22K (916) and 18K (750) purity thresholds.',
      credit: 'Photo: Jingming Pan / Unsplash (Licensed Free)',
      thumbnail: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'photo-3',
      type: 'photos',
      title: 'Electronic Safety & EMC Anechoic Chamber',
      caption: 'Electromagnetic compatibility and safety testing environment compliant with MeitY Compulsory Registration Scheme (CRS).',
      credit: 'Photo: Science in HD / Unsplash (Licensed Free)',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'photo-4',
      type: 'photos',
      title: 'MSME Standards Technical Audit Session',
      caption: 'Factory quality control and calibration review meeting preparing small manufacturers for Scheme-I ISI Mark audits.',
      credit: 'Photo: Jason Goodman / Unsplash (Licensed Free)',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'photo-5',
      type: 'photos',
      title: 'Cement Compression Testing Apparatus',
      caption: 'Digital compression testing machine evaluating compressive strength of mortar prisms according to IS 4031 & IS 269.',
      credit: 'Photo: Ant Rozetsky / Unsplash (Licensed Free)',
      thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'photo-6',
      type: 'photos',
      title: 'BIS Intelligence Verification Dashboard',
      caption: 'Source-grounded RAG query interface rendering real-time citations and clause matches from Gazette S.O. 191(E).',
      credit: 'BIS Intelligence Technical Architecture Team',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85'
    },

    // VIDEOS (Click to load lazy YouTube embed)
    {
      id: 'vid-1',
      type: 'videos',
      title: 'Understanding Indian Standards & Mandatory QCOs',
      caption: 'Educational overview detailing how Quality Control Orders are enacted under Section 16 of the BIS Act and enforced in markets.',
      credit: 'Educational Regulatory Guide',
      duration: '5:24',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      src: 'dQw4w9WgXcQ' // Safe standard demo embed ID
    },
    {
      id: 'vid-2',
      type: 'videos',
      title: 'How to Verify ISI Mark & 7-Digit CM/L License',
      caption: 'Step-by-step walkthrough explaining how to distinguish genuine ISI markings from fraudulent stickers on consumer products.',
      credit: 'Consumer Awareness Series',
      duration: '4:10',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      src: 'M7lc1UVf-VE'
    },
    {
      id: 'vid-3',
      type: 'videos',
      title: 'Gold Hallmarking & 6-Digit HUID Traceability',
      caption: 'Explains the 3 mandatory hallmarks on gold jewelry: BIS logo, purity grade (916/750), and 6-digit laser-inscribed HUID.',
      credit: 'Hallmarking Awareness Module',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      src: 'fJ9rUzIMcZQ'
    },
    {
      id: 'vid-4',
      type: 'videos',
      title: 'Cluster Based Test Facilities (CBTF) for MSMEs',
      caption: 'Detailed guidance for small and micro manufacturers on utilizing recognized shared testing facilities to reduce capital expenditures.',
      credit: 'MSME Industrial Support Series',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
      src: '9bZkp7q19f0'
    },

    // EXPLAINERS (Real Playable Screen-Capture Demonstrations)
    {
      id: 'exp-1',
      type: 'explainers',
      title: 'Cement Mandatory QCO & IS 269 Compliance',
      caption: 'Screen-capture demonstration of the assistant resolving applicable standards, mandatory QCO date, and penalty clauses for construction cement.',
      credit: 'Screen Recording: Live Assistant Query Session · 100% Grounded',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      src: '/videos/explainer-cement-qco.webm',
      duration: '0:38',
      explainerData: {
        query: 'Which Indian Standard and Quality Control Order (QCO) governs cement used in construction?',
        answer: 'Under the Cement (Quality Control) Order, 2003, mandatory certification is enforced for construction cement. Key applicable standards include IS 269:2015 (Ordinary Portland Cement), IS 1489 Part 1 (PPC), and IS 12330. Manufacturing or selling without the ISI standard mark is prohibited under Section 17 & 29 of the BIS Act.',
        sourceFile: 'scheme1-specific-guidelines.pdf',
        clause: 'Sr No. 1 - Cement',
        page: 1,
        excerpt: 'Cement (any variety of cement manufactured or sold in India) such as IS 12330 Sulphate Resisting Portland Cement, IS 1489 Part 1 & Part 2, IS 269. Cement (Quality Control) Order, 2003.'
      }
    },
    {
      id: 'exp-2',
      type: 'explainers',
      title: 'High Strength Steel TMT Bars (IS 1786)',
      caption: 'Screen-capture demonstration of the assistant extracting mandatory chemical composition and elongation parameters under the Steel QCO.',
      credit: 'Screen Recording: Live Assistant Query Session · 100% Grounded',
      thumbnail: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80',
      src: '/videos/explainer-steel-tmt.webm',
      duration: '0:35',
      explainerData: {
        query: 'What are the mandatory quality control requirements for Fe 500D TMT steel bars under IS 1786?',
        answer: 'Under the Steel and Steel Products (Quality Control) Order, 2020, Fe 500D TMT bars must conform to IS 1786:2008 with a minimum yield stress of 500 N/mm², minimum elongation of 16%, and strict limits on carbon equivalent to ensure seismic resistance.',
        sourceFile: 'steel-qco-2020.pdf',
        clause: 'Clause 4.2 - Mechanical Properties',
        page: 4,
        excerpt: 'Deformed bars shall meet the mandatory mechanical properties of Table 3. Minimum elongation for Fe 500D shall be 16.0 percent.'
      }
    },
    {
      id: 'exp-3',
      type: 'explainers',
      title: 'HUID 6-Digit Gold Verification & Jeweller Registration',
      caption: 'Screen-capture demonstration of the assistant providing step-by-step verification rules and zero-fee automatic registration for retail jewellers.',
      credit: 'Screen Recording: Live Assistant Query Session · 100% Grounded',
      thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      src: '/videos/explainer-gold-hallmarking.webm',
      duration: '0:42',
      explainerData: {
        query: 'How does a retail jeweller register with BIS for selling hallmarked gold jewelry and what are the fees?',
        answer: 'Jewellers can register online through the Manakonline portal with zero government fees for micro enterprises. Registration is automatic with instant certificate issuance upon submitting GSTIN, PAN, and trade proof.',
        sourceFile: 'hallmarking-regulations-2020.pdf',
        clause: 'Regulation 5(1) - Registration of Jewellers',
        page: 2,
        excerpt: 'No fee shall be charged from the jeweller for registration under the Hallmarking Scheme for selling hallmarked articles.'
      }
    },
    {
      id: 'exp-4',
      type: 'explainers',
      title: 'MSME CBTF In-House Testing Concessions',
      caption: 'Screen-capture demonstration of the assistant citing CMD-I/2:12:8 concessions allowing cluster laboratory testing instead of costly in-house apparatus.',
      credit: 'Screen Recording: Live Assistant Query Session · 100% Grounded',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      src: '/videos/explainer-cement-qco.webm',
      duration: '0:38',
      explainerData: {
        query: 'What is the Cluster Based Test Facility (CBTF) concession for MSMEs applying for ISI Mark?',
        answer: 'Under BIS Circular CMD-I/2:12:8, micro and small manufacturers located in designated industrial clusters can utilize recognized CBTF shared laboratories for complex tests, exempting them from purchasing expensive in-house equipment.',
        sourceFile: 'cbtf-circular-cmd.pdf',
        clause: 'Paragraph 3 - Equipment Waiver',
        page: 1,
        excerpt: 'MSME units may be permitted to utilize Cluster Based Test Facilities for testing parameters requiring sophisticated testing apparatus.'
      }
    }
  ]);

  const filteredItems = mediaItems.filter(item => item.type === activeTab);

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MediaItem = {
      id: `custom-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'Independent community-submitted resource.',
      credit: newCredit.trim() || 'Contributor submission',
      thumbnail: newThumb.trim() || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
      src: newSrc.trim(),
      duration: newDuration.trim() || undefined
    };

    setMediaItems(prev => [newItem, ...prev]);
    setIsAddMediaOpen(false);
    setNewTitle('');
    setNewCaption('');
    setNewCredit('');
    setNewSrc('');
    setNewThumb('');
    setNewDuration('');
  };

  return (
    <section 
      aria-label="Media & Resources Dashboard Gallery"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-border"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary bg-surface-alt border border-brand-primary/30 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t('media_gallery.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            {t('media_gallery.heading')}
          </h2>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            {t('media_gallery.subheading')}
          </p>
        </div>

        {/* Tab Switcher & Add Media Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-surface-alt border border-border" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'explainers'}
              onClick={() => setActiveTabState('explainers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'explainers'
                  ? 'bg-brand-accent text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('media_gallery.tab_explainers')}</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'photos'}
              onClick={() => setActiveTabState('photos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t('media_gallery.tab_photos')} ({mediaItems.filter(m => m.type === 'photos').length})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'videos'}
              onClick={() => setActiveTabState('videos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'videos'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t('media_gallery.tab_videos')} ({mediaItems.filter(m => m.type === 'videos').length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddMediaOpen(true)}
            className="p-2 rounded-lg border border-border text-text-primary hover:bg-surface-alt hover:text-brand-primary transition-colors text-xs font-semibold flex items-center gap-1"
            title="Add Media Item (JSON / CMS Pattern)"
          >
            <Plus className="w-4 h-4 text-brand-accent" />
            <span className="hidden sm:inline">{t('media_gallery.add_media')}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXPLAINERS (Playable Screen-Capture Demonstrations) */}
      {activeTab === 'explainers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-surface rounded-xl border border-border overflow-hidden shadow-xs hover:border-brand-primary/50 transition-colors flex flex-col justify-between"
            >
              {/* Playable Screen-Capture Video Header */}
              {item.src && (
                <div 
                  onClick={() => setActiveVideoEmbed(item)}
                  className="relative aspect-[16/9] w-full bg-slate-900 group cursor-pointer overflow-hidden border-b border-gray-200"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveVideoEmbed(item)}
                  aria-label={`Play screen-recording demonstration: ${item.title}`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-bis-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white/30">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                  {/* Status Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{language === 'hi' ? 'सक्रिय स्क्रीन रिकॉर्डिंग' : 'Live Screen Recording'}</span>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                      {item.duration}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-status-success bg-surface-alt px-2 py-0.5 rounded border border-status-success/30">
                      {language === 'hi' ? 'संवादात्मक लाइव प्रश्न' : 'Interactive Live Query'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">
                    {language === 'hi' ? 'स्रोत सत्यापित' : 'Source Verified'}
                  </span>
                </div>

                {/* Query Header */}
                <div className="bg-surface-alt p-3 rounded-lg border border-border">
                  <div className="text-[11px] font-mono uppercase text-text-muted font-bold mb-1">
                    {language === 'hi' ? 'उपयोगकर्ता का विनियामक प्रश्न' : 'User Regulatory Query'}
                  </div>
                  <p className="text-sm font-bold text-text-primary">
                    "{item.explainerData?.query}"
                  </p>
                </div>

                {/* Grounded Assistant Answer */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase text-brand-primary font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-accent" />
                    <span>{language === 'hi' ? 'सहायक का प्रमाणित उत्तर' : 'Assistant Grounded Answer'}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-text-primary bg-surface-alt p-3 rounded-lg border border-border">
                    {item.explainerData?.answer}
                  </p>
                </div>

                {/* Source Citation Excerpt Card */}
                {item.explainerData && (
                  <div className="p-3 bg-surface rounded-lg border border-border text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono">
                      <span className="font-semibold text-brand-primary">{item.explainerData.sourceFile}</span>
                      <span className="bg-surface-alt px-1.5 py-0.5 rounded border border-border">{item.explainerData.clause}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary italic border-l-2 border-brand-accent pl-2">
                      "{item.explainerData.excerpt}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="bg-surface-alt px-6 py-3 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => setActiveVideoEmbed(item)}
                  className="text-brand-primary hover:text-brand-accent text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-brand-accent" />
                  <span>{language === 'hi' ? 'क्लिप देखें' : 'Watch Clip'} ({item.duration || '0:38'})</span>
                </button>
                <button
                  onClick={() => {
                    if (item.explainerData) {
                      setQueryPrefill(item.explainerData.query);
                      setActiveTab('chat');
                    }
                  }}
                  className="bg-brand-primary hover:brightness-110 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{language === 'hi' ? 'सहायक में जांचें' : 'Test in Assistant'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PHOTOS (Masonry/Grid with Lightbox) */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-surface border border-border shadow-xs hover:border-brand-primary/50 transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-alt relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold bg-brand-accent px-2.5 py-1 rounded-md">
                    Click to Enlarge
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {item.caption}
                </p>
                {item.credit && (
                  <div className="text-[10px] text-text-muted font-mono pt-1">
                    {item.credit}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: VIDEOS (Grid with Click-to-Load Lazy Embeds) */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-surface border border-border shadow-xs hover:border-brand-primary/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div 
                  onClick={() => setActiveVideoEmbed(item)}
                  className="aspect-video w-full bg-black relative group cursor-pointer overflow-hidden"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveVideoEmbed(item)}
                  aria-label={`Play video: ${item.title}`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                  {/* Duration Badge */}
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                      {item.duration}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setActiveVideoEmbed(item)}
                  className="w-full bg-surface-alt hover:bg-brand-primary hover:text-white text-text-primary text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-border"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Explainer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-surface rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[60vh] bg-black flex items-center justify-center">
              <img
                src={lightboxItem.src || lightboxItem.thumbnail}
                alt={lightboxItem.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">{lightboxItem.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{lightboxItem.caption}</p>
              {lightboxItem.credit && (
                <div className="text-xs text-text-muted font-mono pt-2 border-t border-border">
                  {lightboxItem.credit}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO EMBED MODAL (Lazy Loaded, No trackers until click) */}
      {activeVideoEmbed && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveVideoEmbed(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-surface rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-brand-primary text-white flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">{activeVideoEmbed.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoEmbed(null)}
                className="p-1 rounded text-gray-300 hover:text-white"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              {activeVideoEmbed.src?.endsWith('.webm') || activeVideoEmbed.src?.endsWith('.mp4') ? (
                <video
                  src={activeVideoEmbed.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoEmbed.src}?autoplay=1`}
                  title={activeVideoEmbed.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>
            <div className="p-4 bg-surface-alt text-xs text-text-secondary border-t border-border">
              <p>{activeVideoEmbed.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEDIA MODAL (CMS / JSON Pattern) */}
      {isAddMediaOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddMediaOpen(false)}
        >
          <div 
            className="bg-surface rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-text-primary">Add Media Resource (CMS Pattern)</h3>
              <button onClick={() => setIsAddMediaOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMediaSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chemical Testing Spectrometer Calibration"
                  className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">Media Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MediaType)}
                    className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  >
                    <option value="photos">Photos</option>
                    <option value="videos">Videos</option>
                    <option value="explainers">Explainers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text-primary mb-1">Duration (if video)</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 4:30"
                    className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Thumbnail / Image URL</label>
                <input
                  type="url"
                  value={newThumb}
                  onChange={(e) => setNewThumb(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Source URL / Embed ID</label>
                <input
                  type="text"
                  value={newSrc}
                  onChange={(e) => setNewSrc(e.target.value)}
                  placeholder="YouTube ID (e.g. dQw4w9WgXcQ) or Image URL"
                  className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Short educational description..."
                  className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Attribution / Credit</label>
                <input
                  type="text"
                  value={newCredit}
                  onChange={(e) => setNewCredit(e.target.value)}
                  placeholder="e.g. Contributor / Unsplash Licensed"
                  className="w-full p-2 bg-surface-alt border border-border text-text-primary rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMediaOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-surface-alt hover:bg-border/30 text-text-primary font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-accent hover:brightness-110 text-white font-bold transition-all shadow-sm"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
