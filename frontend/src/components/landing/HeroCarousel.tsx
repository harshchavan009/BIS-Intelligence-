import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
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
  videoWebm?: string;
  videoMp4?: string;
  fallbackImg: string;
}

export const HeroCarousel: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);

      const nav: any = navigator;
      if (nav.connection?.saveData || nav.connection?.effectiveType === '2g') {
        setIsSlowConnection(true);
      }

      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const slides: SlideItem[] = [
    {
      id: 'ask-assistant',
      badge: t('hero.slides.ask-assistant.badge'),
      badgeColor: 'bg-bis-red text-white',
      headline: t('hero.slides.ask-assistant.headline'),
      subtext: t('hero.slides.ask-assistant.subtext'),
      ctaText: t('hero.slides.ask-assistant.ctaText'),
      ctaAction: () => {
        setQueryPrefill(language === 'hi' 
          ? 'मेरे उत्पाद पर कौन सा भारतीय मानक लागू होता है और अनिवार्य परीक्षण आवश्यकताएं क्या हैं?'
          : 'Which Indian Standard applies to my product and what are the mandatory testing requirements?'
        );
        setActiveTab('chat');
      },
      accentBg: 'from-bis-navy via-bis-navy-800 to-indigo-950',
      icon: Sparkles,
      metricLabel: t('hero.slides.ask-assistant.metricLabel'),
      metricValue: t('hero.slides.ask-assistant.metricValue'),
      videoWebm: '/videos/hero-ai.webm',
      fallbackImg: '/images/hero/hero-ai-fallback.jpg'
    },
    {
      id: 'qco-lookup',
      badge: t('hero.slides.qco-lookup.badge'),
      badgeColor: 'bg-amber-500 text-stone-900 font-bold',
      headline: t('hero.slides.qco-lookup.headline'),
      subtext: t('hero.slides.qco-lookup.subtext'),
      ctaText: t('hero.slides.qco-lookup.ctaText'),
      ctaAction: () => {
        setQueryPrefill(language === 'hi'
          ? 'बीआईएस अधिनियम 2016 की धारा 16 के तहत प्रकाशित सभी अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO) की सूची बनाएं।'
          : 'List all mandatory Quality Control Orders (QCOs) published under Section 16 of the BIS Act, 2016.'
        );
        setActiveTab('chat');
      },
      accentBg: 'from-[#1a2d54] via-bis-navy to-[#18233f]',
      icon: ShieldCheck,
      metricLabel: t('hero.slides.qco-lookup.metricLabel'),
      metricValue: t('hero.slides.qco-lookup.metricValue'),
      videoWebm: '/videos/hero-manufacturing.webm',
      videoMp4: '/videos/hero-manufacturing.mp4',
      fallbackImg: '/images/hero/hero-manufacturing-fallback.jpg'
    },
    {
      id: 'hallmarking-huid',
      badge: t('hero.slides.hallmarking-huid.badge'),
      badgeColor: 'bg-amber-400 text-stone-950 font-bold',
      headline: t('hero.slides.hallmarking-huid.headline'),
      subtext: t('hero.slides.hallmarking-huid.subtext'),
      ctaText: t('hero.slides.hallmarking-huid.ctaText'),
      ctaAction: () => {
        setActiveTab('hallmarking');
      },
      accentBg: 'from-[#2b1f14] via-[#3d2c1c] to-bis-navy-800',
      icon: Gem,
      metricLabel: t('hero.slides.hallmarking-huid.metricLabel'),
      metricValue: t('hero.slides.hallmarking-huid.metricValue'),
      videoWebm: '/videos/hero-gold.webm',
      fallbackImg: '/images/hero/hero-gold-fallback.jpg'
    },
    {
      id: 'isi-mark-check',
      badge: t('hero.slides.isi-mark-check.badge'),
      badgeColor: 'bg-emerald-600 text-white',
      headline: t('hero.slides.isi-mark-check.headline'),
      subtext: t('hero.slides.isi-mark-check.subtext'),
      ctaText: t('hero.slides.isi-mark-check.ctaText'),
      ctaAction: () => {
        setActiveTab('finder');
      },
      accentBg: 'from-[#173024] via-[#1f4233] to-bis-navy',
      icon: Search,
      metricLabel: t('hero.slides.isi-mark-check.metricLabel'),
      metricValue: t('hero.slides.isi-mark-check.metricValue'),
      videoWebm: '/videos/hero-lab.webm',
      videoMp4: '/videos/hero-lab.mp4',
      fallbackImg: '/images/hero/hero-lab-fallback.jpg'
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
      {/* Background Video & Static Fallback Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {prefersReducedMotion || isSlowConnection ? (
          <img
            src={slide.fallbackImg}
            alt=""
            className="w-full h-full object-cover object-center animate-in fade-in duration-700"
            loading="eager"
          />
        ) : (
          <video
            key={slide.id}
            muted
            playsInline
            loop
            autoPlay
            poster={slide.fallbackImg}
            className="w-full h-full object-cover object-center transition-opacity duration-1000"
          >
            {slide.videoWebm && <source src={slide.videoWebm} type="video/webm" />}
            {slide.videoMp4 && <source src={slide.videoMp4} type="video/mp4" />}
            <img src={slide.fallbackImg} alt="" className="w-full h-full object-cover" />
          </video>
        )}
      </div>

      {/* High-Contrast Neutral Scrim for Text Legibility (Zero Color Bleed) */}
      <div className="absolute inset-0 bg-black/65 z-[1] pointer-events-none" />

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
                    setQueryPrefill(language === 'hi'
                      ? 'ISI मार्क योजना-I, CRS योजना-II, और CoC योजना-IV के बीच अंतर को संदर्भों सहित समझाएं।'
                      : 'Explain the difference between ISI Mark Scheme-I, CRS Scheme-II, and CoC Scheme-IV with citations.'
                    );
                    setActiveTab('chat');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {language === 'hi' ? 'उद्धरण कैसे कार्य करते हैं' : 'How Citations Work'}
                </button>
              </div>

            </div>

            {/* Slide Visual Card / Metric Badge */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="bg-[#161E29]/95 border border-white/20 rounded-xl p-6 w-80 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
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
                    <span>{language === 'hi' ? 'स्वतंत्र एवं स्रोत-प्रमाणित' : 'Independent & Source-Grounded'}</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {language === 'hi'
                      ? 'प्रत्येक उत्तर सार्वजनिक बीआईएस मानक दस्तावेजों से सटीक खंड उद्धरणों के साथ तैयार किया जाता है।'
                      : 'Every answer is generated from public BIS standards documents with verifiable clause citations.'}
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
            aria-label={t('hero.prev')}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center z-20">
          <button
            onClick={nextSlide}
            aria-label={t('hero.next')}
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
              aria-label={t('hero.slide_counter', { current: idx + 1, total: slides.length })}
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
            aria-label={isPaused ? t('hero.play') : t('hero.pause')}
            title={isPaused ? t('hero.play') : t('hero.pause')}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
    </section>
  );
};
