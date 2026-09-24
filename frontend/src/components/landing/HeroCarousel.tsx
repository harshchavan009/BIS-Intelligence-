import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Gem, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Pause,
  Play
} from 'lucide-react';

interface SlideItem {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaAction: () => void;
  accentBg: string;
  icon: React.FC<{ className?: string }>;
  metricLabel: string;
  metricValue: string;
}

export const HeroCarousel: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  const slides: SlideItem[] = [
    {
      id: 'ask-assistant',
      badge: 'Independent AI Regulatory Engine',
      badgeColor: 'bg-bis-red text-white',
      headline: 'Ask BIS Intelligence anything about Indian Standards',
      subtext: 'Instant, source-grounded answers on certification schemes, testing rules, and compliance requirements.',
      ctaText: 'Ask the Assistant',
      ctaAction: () => {
        setQueryPrefill('Which Indian Standard applies to my product and what are the mandatory testing requirements?');
        setActiveTab('chat');
      },
      accentBg: 'from-bis-navy via-bis-navy-800 to-indigo-950',
      icon: Sparkles,
      metricLabel: 'Evaluation Groundedness',
      metricValue: '100% Grounded'
    },
    {
      id: 'qco-lookup',
      badge: 'Mandatory Compliance Tracking',
      badgeColor: 'bg-amber-500 text-stone-900 font-bold',
      headline: 'Latest QCOs & Mandatory Certifications',
      subtext: 'Track gazette notifications, implementation schedules, and MSME provisions across industrial sectors.',
      ctaText: 'Lookup QCO Orders',
      ctaAction: () => {
        setQueryPrefill('List all mandatory Quality Control Orders (QCOs) published under Section 16 of the BIS Act, 2016.');
        setActiveTab('chat');
      },
      accentBg: 'from-[#1a2d54] via-bis-navy to-[#18233f]',
      icon: ShieldCheck,
      metricLabel: 'Indexed Gazettes',
      metricValue: '1,343+ Chunks'
    },
    {
      id: 'hallmarking-huid',
      badge: 'Consumer & Trade Authenticity',
      badgeColor: 'bg-amber-400 text-stone-950 font-bold',
      headline: 'How Gold Hallmarking & 6-Digit HUID Work',
      subtext: 'Understand BIS purity marks, assaying centers, and the HUID verification process.',
      ctaText: 'Explore Hallmarking Guide',
      ctaAction: () => {
        setActiveTab('hallmarking');
      },
      accentBg: 'from-[#2b1f14] via-[#3d2c1c] to-bis-navy-800',
      icon: Gem,
      metricLabel: 'Mandatory Districts',
      metricValue: '343+ Districts'
    },
    {
      id: 'isi-mark-check',
      badge: 'MSME & Manufacturer Support',
      badgeColor: 'bg-emerald-600 text-white',
      headline: 'Check if Your Product Needs ISI Certification',
      subtext: 'Deterministic mapping for Scheme-I vs CRS Scheme-II and required testing facilities.',
      ctaText: 'Search Standards Catalog',
      ctaAction: () => {
        setActiveTab('finder');
      },
      accentBg: 'from-[#173024] via-[#1f4233] to-bis-navy',
      icon: Search,
      metricLabel: 'Standard Directory',
      metricValue: 'IS Product Map'
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-rotation every 6 seconds, paused when hovered/focused
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, isPaused]);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <section 
      aria-label="Featured Regulatory Intelligence Highlights"
      className="relative w-full overflow-hidden bg-bis-navy-800 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Gradient & Vector Ambient Canvas */}
      <div className={`w-full min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] bg-gradient-to-r ${slide.accentBg} transition-all duration-700 flex items-center relative`}>
        {/* Subtle geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient Decorative Shapes */}
        <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-[20%] bottom-[-30%] w-[400px] h-[400px] rounded-full bg-bis-red/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Slide Text Content */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <span className={`text-[11px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${slide.badgeColor}`}>
                  {slide.badge}
                </span>
                <span className="text-white/60 text-xs font-mono hidden sm:inline">
                  Slide {currentSlide + 1} of {totalSlides}
                </span>
              </div>

              {/* Large Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans leading-tight sm:leading-[1.15] text-white max-w-3xl">
                {slide.headline}
              </h1>

              {/* One-Line Subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 font-sans leading-relaxed max-w-2xl">
                {slide.subtext}
              </p>

              {/* Single Clear CTA Button */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={slide.ctaAction}
                  className="bg-bis-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-red-900/30 flex items-center gap-2 group text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    setQueryPrefill('Explain the difference between ISI Mark Scheme-I, CRS Scheme-II, and CoC Scheme-IV with citations.');
                    setActiveTab('chat');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  How Citations Work
                </button>
              </div>

            </div>

            {/* Slide Visual Card / Metric Badge */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-80 space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20">
                  <IconComponent className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs uppercase font-mono tracking-wider text-gray-300">
                    {slide.metricLabel}
                  </div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">
                    {slide.metricValue}
                  </div>
                </div>
                <div className="pt-3 border-t border-white/15 text-xs text-gray-300 space-y-1.5 leading-snug">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Independent & Source-Grounded</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    Every answer is generated from public BIS standards documents with verifiable clause citations.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center z-20">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center z-20">
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Indicators & Play/Pause Control */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.headline}`}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentSlide 
                  ? 'w-8 bg-bis-red shadow-sm' 
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="ml-3 p-1 rounded text-white/60 hover:text-white transition-colors"
            aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </section>
  );
};
