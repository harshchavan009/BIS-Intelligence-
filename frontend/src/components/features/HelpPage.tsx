import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { 
  HelpCircle, 
  MessageSquare, 
  Search, 
  Layers, 
  FlaskConical, 
  ShieldCheck, 
  Gem, 
  Headphones, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Keyboard,
  ExternalLink
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { setActiveTab, setScreenReaderModalOpen, language } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'assistant' | 'standards' | 'schemes' | 'consumer' | 'a11y'>('assistant');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      <PageHeader
        eyebrow={language === 'hi' ? 'नागरिक एवं एमएसएमई सहायता केंद्र' : 'Citizen & MSME Help Center'}
        title={language === 'hi' ? 'पोर्टल सहायता एवं उपयोगकर्ता मार्गदर्शिका' : 'Platform Help & Non-Technical User Guide'}
        description={
          language === 'hi'
            ? 'भारतीय मानक ब्यूरो (BIS) एआई सहायक के सभी प्रमुख उपकरणों, प्रमाणन प्रक्रियाओं, उपभोक्ता अधिकारों और सुलभता सुविधाओं के उपयोग की सरल मार्गदर्शिका।'
            : 'Clear, step-by-step instructions designed for citizens, manufacturers, MSME entrepreneurs, and students to navigate Indian Standards, verify certifications, and consult the regulatory AI assistant.'
        }
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-line">
        {[
          { id: 'assistant', labelEn: '1. AI Assistant & Citations', labelHi: '1. एआई सहायक एवं उद्धरण', icon: MessageSquare },
          { id: 'standards', labelEn: '2. Standards & QCO Finder', labelHi: '2. मानक एवं QCO खोजक', icon: Search },
          { id: 'schemes', labelEn: '3. Schemes & MSME CBTF', labelHi: '3. प्रमाणन योजनाएं व CBTF', icon: Layers },
          { id: 'consumer', labelEn: '4. ISI & Gold Verification', labelHi: '4. ISI एवं स्वर्ण सत्यापन', icon: ShieldCheck },
          { id: 'a11y', labelEn: '5. Accessibility & Screen Readers', labelHi: '5. सुलभता व स्क्रीन रीडर', icon: Headphones },
        ].map((cat) => {
          const Icon = cat.icon;
          const isCur = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                isCur
                  ? 'bg-indigo-deep text-white shadow-sm ring-1 ring-brass'
                  : 'bg-paper-light text-stone-700 hover:bg-white border border-line'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isCur ? 'text-brass' : 'text-stone-500'}`} />
              <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Category Content Panels */}
      {activeCategory === 'assistant' && (
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-serif font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'एआई सहायक से प्रश्न कैसे पूछें और उत्तर कैसे समझें' : 'How to Ask Questions & Understand Sourced Answers'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg border border-line bg-paper-light space-y-2">
                <span className="w-6 h-6 rounded-full bg-brass text-white font-bold flex items-center justify-center text-xs">1</span>
                <div className="font-bold text-ink">{language === 'hi' ? 'स्वाभाविक भाषा में पूछें' : 'Ask in Plain English or Hindi'}</div>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'आप अपने उत्पाद, व्यवसाय या आवश्यकता के बारे में सीधे पूछ सकते हैं। जैसे: "निर्माण के लिए सीमेंट पर कौन सा मानक लागू होता है?"'
                    : 'Type your natural query or click one of the suggested consultation topics. For example: "Which Indian Standard and QCO applies to cement bag for construction?"'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-line bg-paper-light space-y-2">
                <span className="w-6 h-6 rounded-full bg-brass text-white font-bold flex items-center justify-center text-xs">2</span>
                <div className="font-bold text-ink">{language === 'hi' ? 'उद्धरण चिप्स [1], [2] पर क्लिक करें' : 'Click Inline Citations [1], [2]'}</div>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'प्रत्येक तथ्यात्मक वाक्य में एक उद्धरण चिप [1] होती है। इस पर क्लिक करने से आधिकारिक पीडीएफ का संबंधित पृष्ठ और खंड खुल जाता है।'
                    : 'Every factual assertion has a clickable citation chip [1]. Clicking it opens the official gazetted document panel with the exact clause highlighted.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-line bg-paper-light space-y-2">
                <span className="w-6 h-6 rounded-full bg-brass text-white font-bold flex items-center justify-center text-xs">3</span>
                <div className="font-bold text-ink">{language === 'hi' ? 'सत्यापित बैज एवं पीडीएफ प्रिंट' : 'Verified Badge & Print PDF'}</div>
                <p className="text-stone-600 leading-relaxed">
                  {language === 'hi'
                    ? 'हरा बैज 100% विनियामक प्रामाणिकता दर्शाता है। "प्रिंट / पीडीएफ" बटन से आप भौतिक रिकॉर्ड हेतु आधिकारिक प्रतिलिपि निकाल सकते हैं।'
                    : 'The green "Verified Standard" badge confirms 100% lexical and semantic grounding. Click "Print / Save PDF" to archive formal records.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{language === 'hi' ? 'एआई सहायक खोलें' : 'Open AI Assistant'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeCategory === 'standards' && (
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-serif font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'मानक एवं QCO खोजक का उपयोग कैसे करें' : 'How to Use the Standards & Mandatory QCO Finder'}</span>
            </h2>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                {language === 'hi'
                  ? 'मानक खोजक (Standards Finder) भारत सरकार के विभिन्न मंत्रालयों द्वारा जारी अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCOs) के तहत आने वाले उत्पादों की त्वरित खोज प्रदान करता है:'
                  : 'The Standards Finder maps everyday commercial products to their statutory Indian Standard (IS) number, applicable Quality Control Order, and licensing scheme:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-paper rounded border border-line space-y-1.5">
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'hi' ? 'उत्पाद नाम द्वारा खोज' : 'Keyword or Product Name Search'}</span>
                  </div>
                  <p className="text-stone-600">
                    {language === 'hi'
                      ? 'सीमेंट, टीएमटी स्टील, हेलमेट, खिलौने, गीजर, प्रेशर कुकर आदि लिखकर खोजें।'
                      : 'Search terms like "cement", "TMT steel", "helmet", "toys", "smart watch", or "LPG cylinder".'}
                  </p>
                </div>

                <div className="p-3 bg-paper rounded border border-line space-y-1.5">
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'hi' ? 'मानक संख्या द्वारा खोज' : 'IS Number Direct Lookup'}</span>
                  </div>
                  <p className="text-stone-600">
                    {language === 'hi'
                      ? 'सीधे मानक संख्या लिखें जैसे "IS 269", "IS 1786", या "IS 4151"।'
                      : 'Type canonical standard codes like "IS 269", "IS 1786", or "IS/IEC 62368" to pull gazette notifications.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setActiveTab('finder')}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{language === 'hi' ? 'मानक खोजक खोलें' : 'Open Standards Finder'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeCategory === 'schemes' && (
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-serif font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'प्रमाणन योजनाओं की तुलना एवं एमएसएमई क्लस्टर सुविधाएं' : 'Certification Schemes & MSME CBTF Provisions'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded border border-line bg-paper-light space-y-1">
                <div className="font-bold text-ink font-serif">Scheme – I (ISI Mark)</div>
                <div className="text-[11px] text-brass font-mono">Product Certification</div>
                <p className="text-stone-600 text-[11px]">
                  Requires factory inspection, in-house lab testing, and market surveillance. Mandatory for cement, steel, cylinders, and helmets.
                </p>
              </div>

              <div className="p-3 rounded border border-line bg-paper-light space-y-1">
                <div className="font-bold text-ink font-serif">Scheme – II (CRO)</div>
                <div className="text-[11px] text-brass font-mono">Compulsory Registration</div>
                <p className="text-stone-600 text-[11px]">
                  Self-declaration of conformity based on test reports from BIS-recognized laboratories. Mandatory for electronics and IT goods.
                </p>
              </div>

              <div className="p-3 rounded border border-line bg-paper-light space-y-1">
                <div className="font-bold text-ink font-serif">Scheme – IV (CoC)</div>
                <div className="text-[11px] text-brass font-mono">Certificate of Conformity</div>
                <p className="text-stone-600 text-[11px]">
                  Streamlined 6-step certification for batch or specialized goods with test reports valid up to 180 days.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveTab('labs')}
                className="px-4 py-2 bg-white hover:bg-paper border border-line text-ink rounded text-xs font-semibold transition-colors"
              >
                <span>{language === 'hi' ? 'CBTF लैब खोजक' : 'Explore CBTF Labs'}</span>
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{language === 'hi' ? 'योजनाएं तुलना देखें' : 'Compare Schemes'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeCategory === 'consumer' && (
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-serif font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'असली ISI मार्क और सोने की हॉलमार्किंग की जांच' : 'Verifying Genuine ISI Marks & Gold Jewellery'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-paper rounded border border-line space-y-2">
                <div className="font-bold text-ink flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-deep" />
                  <span>{language === 'hi' ? 'ISI मार्क की 3 अनिवार्य विशेषताएं' : '3 Features of Genuine ISI Mark'}</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-stone-600">
                  <li><strong>Standard Number (IS:XXXX):</strong> Must be printed above the ISI monogram.</li>
                  <li><strong>Monogram Geometry:</strong> High-definition proportional letters 'IS'.</li>
                  <li><strong>CM/L License Number:</strong> 7-digit unique alphanumeric identifier at the bottom.</li>
                </ol>
              </div>

              <div className="p-3.5 bg-paper rounded border border-line space-y-2">
                <div className="font-bold text-ink flex items-center gap-2">
                  <Gem className="w-4 h-4 text-brass" />
                  <span>{language === 'hi' ? 'सोने की हॉलमार्किंग (HUID)' : 'Gold Hallmarking (6-Digit HUID)'}</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-stone-600">
                  <li><strong>BIS Triangular Logo:</strong> Official mark of the Bureau of Indian Standards.</li>
                  <li><strong>Purity & Fineness:</strong> E.g., 22K916 (91.6% pure gold) or 18K750.</li>
                  <li><strong>6-Digit HUID Code:</strong> Unique laser-engraved alphanumeric identifier.</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveTab('hallmarking')}
                className="px-4 py-2 bg-white hover:bg-paper border border-line text-ink rounded text-xs font-semibold transition-colors"
              >
                <span>{language === 'hi' ? 'हॉलमार्किंग गाइड' : 'Hallmarking Guide'}</span>
              </button>
              <button
                onClick={() => setActiveTab('consumer')}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{language === 'hi' ? 'उपभोक्ता सत्यापन उपकरण' : 'Consumer Verification Tool'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeCategory === 'a11y' && (
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-serif font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? 'सुलभता नियंत्रण एवं कीबोर्ड नेविगेशन' : 'Accessibility Features & Keyboard Shortcuts'}</span>
            </h2>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="font-bold text-ink">Skip to Content (Tab)</div>
                  <p className="text-stone-600">
                    Press <kbd className="px-1 py-0.5 bg-white border border-line rounded font-mono text-[10px]">Tab</kbd> as soon as any page loads to immediately focus the skip link and jump straight over the header into the main content.
                  </p>
                </div>

                <div className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="font-bold text-ink">Text Resizing (A- / A / A+)</div>
                  <p className="text-stone-600">
                    Use the controls in the top bar to set base typography to 14px, 16px, or 18px. Settings persist across page reloads via local storage.
                  </p>
                </div>

                <div className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="font-bold text-ink">High Contrast Mode</div>
                  <p className="text-stone-600">
                    Enforces strict WCAG AAA 7:1 contrast with pure black text and deep borders without turning the page background into an unusable black void.
                  </p>
                </div>

                <div className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="font-bold text-ink">Screen Reader Documentation</div>
                  <p className="text-stone-600">
                    Click "Screen Reader Access" in the top bar to view verified setup guidance and direct download links for NVDA and JAWS.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setScreenReaderModalOpen(true)}
                className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'स्क्रीन रीडर सहायता देखें' : 'View Screen Reader Setup'}</span>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
