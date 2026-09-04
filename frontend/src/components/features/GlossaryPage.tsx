import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { BookOpen, Search, HelpCircle, ArrowRight, ShieldCheck, Tag, FileText, CheckCircle2 } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  acronym: string;
  fullName: string;
  fullNameHi: string;
  category: 'Scheme' | 'Identifier' | 'Facility' | 'Regulation';
  summaryEn: string;
  summaryHi: string;
  practicalMeaningEn: string;
  practicalMeaningHi: string;
  relatedScheme: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "ISI Mark",
    acronym: "ISI",
    fullName: "Indian Standards Institute Certification Mark",
    fullNameHi: "भारतीय मानक संस्थान (आईएसआई) प्रमाणन चिह्न",
    category: "Regulation",
    summaryEn: "The premier quality and safety certification mark issued by BIS for manufactured goods under Scheme-I.",
    summaryHi: "बीआईएस द्वारा विनिर्मित उत्पादों हेतु योजना-I के अंतर्गत जारी किया जाने वाला प्रमुख गुणवत्ता एवं सुरक्षा प्रमाणन चिह्न।",
    practicalMeaningEn: "If your product falls under a mandatory Quality Control Order (QCO), you cannot sell, import, or stock it in India without the ISI mark stamped on the product packaging along with your unique CM/L license number.",
    practicalMeaningHi: "यदि आपका उत्पाद अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) के अंतर्गत आता है, तो आप अपने उत्पाद पैकेजिंग पर अद्वितीय CM/L लाइसेंस नंबर के साथ ISI मार्क के बिना इसे भारत में नहीं बेच सकते।",
    relatedScheme: "Scheme-I"
  },
  {
    term: "QCO",
    acronym: "QCO",
    fullName: "Quality Control Order",
    fullNameHi: "गुणवत्ता नियंत्रण आदेश",
    category: "Regulation",
    summaryEn: "A statutory gazette notification issued by Central Government ministries under Section 16 of the BIS Act, 2016.",
    summaryHi: "बीआईएस अधिनियम, 2016 की धारा 16 के तहत केंद्र सरकार के मंत्रालयों द्वारा जारी एक वैधानिक राजपत्र अधिसूचना।",
    practicalMeaningEn: "Makes BIS certification legally mandatory for specific goods in the interest of public health, consumer safety, national security, or environmental protection. Violating a QCO is a criminal offense.",
    practicalMeaningHi: "सार्वजनिक स्वास्थ्य, सुरक्षा या पर्यावरण के हित में विशिष्ट वस्तुओं के लिए बीआईएस प्रमाणन को कानूनी रूप से अनिवार्य बनाता है। इसका उल्लंघन कानूनन अपराध है।",
    relatedScheme: "Section 16, BIS Act 2016"
  },
  {
    term: "CM/L",
    acronym: "CM/L",
    fullName: "Certification Marks Licence Number",
    fullNameHi: "प्रमाणन चिह्न लाइसेंस संख्या",
    category: "Identifier",
    summaryEn: "A unique 7 or 8-digit operational license number assigned to a specific manufacturer's factory premises.",
    summaryHi: "किसी विशिष्ट निर्माता के कारखाने को आवंटित एक अद्वितीय 7 या 8 अंकों की परिचालन लाइसेंस संख्या।",
    practicalMeaningEn: "Printed directly beneath the ISI monogram on product labels (e.g., 'CM/L-8400123'). It proves which exact factory manufactured the item and allows buyers to verify validity on the BIS-CARE portal.",
    practicalMeaningHi: "उत्पाद लेबल पर ISI मोनोग्राम के ठीक नीचे मुद्रित होता है। यह साबित करता है कि किस कारखाने ने उत्पाद बनाया है और इसकी प्रामाणिकता जांची जा सकती है।",
    relatedScheme: "Scheme-I"
  },
  {
    term: "CBTF",
    acronym: "CBTF",
    fullName: "Cluster Based Test Facility",
    fullNameHi: "क्लस्टर आधारित परीक्षण सुविधा",
    category: "Facility",
    summaryEn: "A shared testing laboratory established within an industrial cluster to serve MSMEs.",
    summaryHi: "सूक्ष्म, लघु एवं मध्यम उद्यमों (MSMEs) की सहायता हेतु औद्योगिक क्लस्टर के भीतर स्थापित एक साझा परीक्षण प्रयोगशाला।",
    practicalMeaningEn: "Normally, getting a BIS license requires costly in-house laboratory machines. CBTF allows small enterprises located within a 25-50km radius to share testing equipment, slashing capital costs by up to 70%.",
    practicalMeaningHi: "आम तौर पर बीआईएस लाइसेंस हेतु कारखाने में महंगी परीक्षण मशीनें लगाना अनिवार्य होता है। CBTF छोटे उद्योगों को 25-50 किमी के दायरे में उपकरण साझा करने की छूट देकर पूंजीगत खर्च को 70% तक घटाता है।",
    relatedScheme: "Scheme-I (CBTF Guidelines CMD-I)"
  },
  {
    term: "CoC",
    acronym: "CoC",
    fullName: "Certificate of Conformity",
    fullNameHi: "अनुरूपता प्रमाण पत्र (सीओसी)",
    category: "Scheme",
    summaryEn: "A batch-wise or consignment-specific conformity authorization granted under Scheme-IV.",
    summaryHi: "योजना-IV के अंतर्गत बैच या विशिष्ट खेप हेतु प्रदान किया जाने वाला अनुरूपता प्राधिकरण।",
    practicalMeaningEn: "Unlike a full ongoing ISI license that requires years of factory surveillance, CoC is ideal for project-specific supplies, imported lots, or single production runs meeting standard specifications.",
    practicalMeaningHi: "पूर्ण ISI लाइसेंस की तुलना में (जिसमें निरंतर कारखाने की निगरानी होती है), CoC परियोजना-आधारित आपूर्ति या एकल उत्पादन खेप के लिए आदर्श प्रमाण पत्र है।",
    relatedScheme: "Scheme-IV"
  },
  {
    term: "HUID",
    acronym: "HUID",
    fullName: "Hallmark Unique Identification",
    fullNameHi: "हॉलमार्क विशिष्ट पहचान संख्या",
    category: "Identifier",
    summaryEn: "A 6-digit alphanumeric code laser-engraved onto every piece of precious gold and silver jewellery.",
    summaryHi: "सोने और चांदी के प्रत्येक आभूषण पर लेजर द्वारा उकेरा गया 6 अंकों का अल्फ़ान्यूमेरिक कोड।",
    practicalMeaningEn: "Guarantees purity (e.g. 22K916). Consumers can type this code into the BIS-CARE app or our Consumer Rights tab to verify the exact jeweller, purity karatage, and assaying hallmarking center.",
    practicalMeaningHi: "शुद्धता की गारंटी देता है। उपभोक्ता इस कोड को दर्ज करके जौहरी का नाम, शुद्धता (जैसे 22K916) और हॉलमार्किंग केंद्र का विवरण तुरंत सत्यापित कर सकते हैं।",
    relatedScheme: "BIS Hallmarking Regulations"
  },
  {
    term: "Scheme-I",
    acronym: "Scheme-I",
    fullName: "Product Certification Scheme (ISI Mark)",
    fullNameHi: "उत्पाद प्रमाणन योजना (आईएसआई मार्क)",
    category: "Scheme",
    summaryEn: "The primary factory-licensing conformity assessment scheme established under Schedule-II of 2018 Regulations.",
    summaryHi: "2018 विनियमों की अनुसूची-II के तहत स्थापित प्राथमिक कारखाना-लाइसेंसिंग अनुरूपता मूल्यांकन योजना।",
    practicalMeaningEn: "Requires in-house quality control testing equipment, factory audit, independent sample testing, and ongoing market surveillance sampling.",
    practicalMeaningHi: "इसके तहत कारखाने में गुणवत्ता नियंत्रण उपकरण, फैक्ट्री ऑडिट, स्वतंत्र नमूना परीक्षण और बाजार निगरानी के नमूने आवश्यक होते हैं।",
    relatedScheme: "Scheme-I"
  },
  {
    term: "Scheme-II",
    acronym: "Scheme-II / CRO",
    fullName: "Compulsory Registration Scheme",
    fullNameHi: "अनिवार्य पंजीकरण योजना (सीआरओ)",
    category: "Scheme",
    summaryEn: "Self-declaration of conformity based on safety testing in recognized labs, primarily for electronics & IT products.",
    summaryHi: "मान्यता प्राप्त प्रयोगशालाओं में सुरक्षा परीक्षण पर आधारित अनुरूपता की स्व-घोषणा, मुख्य रूप से इलेक्ट्रॉनिक्स एवं आईटी उत्पादों हेतु।",
    practicalMeaningEn: "Covers items like mobile phones, laptops, LED bulbs, power adapters. Manufacturers submit test reports from BIS labs and receive an R-number (e.g. R-41001234) rather than the ISI mark.",
    practicalMeaningHi: "मोबाइल, लैपटॉप, एलईडी बल्ब जैसे उत्पादों को कवर करता है। निर्माता बीआईएस लैब रिपोर्ट जमा करते हैं और उन्हें ISI मार्क की जगह एक अद्वितीय R-नंबर मिलता है।",
    relatedScheme: "Scheme-II (CRO)"
  },
  {
    term: "SIT",
    acronym: "SIT",
    fullName: "Scheme of Inspection and Testing",
    fullNameHi: "निरीक्षण एवं परीक्षण योजना",
    category: "Regulation",
    summaryEn: "The contractual testing schedule and frequency agreement between the licensed manufacturer and BIS.",
    summaryHi: "लाइसेंस प्राप्त निर्माता और बीआईएस के बीच संविदात्मक परीक्षण कार्यक्रम और आवृत्ति का समझौता।",
    practicalMeaningEn: "Specifies how often every production batch must undergo tensile, chemical, or dimensional checks, and how quality logbooks must be maintained.",
    practicalMeaningHi: "यह निर्धारित करता है कि प्रत्येक बैच का कितनी बार परीक्षण किया जाना चाहिए और गुणवत्ता रिकॉर्ड पुस्तिकाएं कैसे रखी जानी चाहिए।",
    relatedScheme: "Scheme-I Operations"
  }
];

export const GlossaryPage: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullNameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summaryEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.practicalMeaningEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-indigo-deep text-white rounded-lg p-6 sm:p-8 border border-brass/30 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brass/20 text-brass border border-brass/40 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सरल भाषा विनियामक शब्दावली' : 'Plain Language Regulatory Glossary'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-standard font-bold tracking-tight">
            {language === 'hi' ? 'बीआईएस शब्दावली: इसका क्या अर्थ है?' : 'BIS Glossary: What Does This Mean?'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            {language === 'hi' 
              ? 'एमएसएमई, छोटे निर्माताओं और उपभोक्ताओं के लिए जटिल तकनीकी और कानूनी शब्दों की सरल व्याख्या।'
              : 'Demystifying complex Indian Standards jargon, acronyms, and compliance abbreviations for MSME entrepreneurs, small workshop owners, and consumers.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'शब्दावली में खोजें (उदा. QCO, CBTF)...' : 'Search terms (e.g. QCO, CBTF, HUID)...'}
            className="w-full pl-9 pr-3 py-2 text-sm border border-line rounded bg-white focus:outline-none focus:border-brass text-ink"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Regulation', 'Scheme', 'Identifier', 'Facility'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brass text-white shadow-sm'
                  : 'bg-white border border-line text-stone-600 hover:border-brass/50'
              }`}
            >
              {cat === 'all' ? (language === 'hi' ? 'सभी श्रेणियां' : 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map((item) => (
          <div 
            key={item.term}
            className="bg-white border border-line rounded-lg p-6 shadow-sm hover:border-brass/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xl font-bold font-serif-standard text-ink flex items-center gap-2">
                    {item.term}
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-brass border border-brass/30 font-sans font-semibold">
                      {item.category}
                    </span>
                  </span>
                  <div className="text-xs font-medium text-stone-500 pt-0.5">
                    {language === 'hi' ? item.fullNameHi : item.fullName}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {language === 'hi' ? item.summaryHi : item.summaryEn}
              </p>

              {/* Practical Meaning Box for MSMEs */}
              <div className="p-3 bg-paper-light border-l-2 border-brass rounded-r text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-ink uppercase tracking-wider text-[10px] block">
                  {language === 'hi' ? 'व्यावहारिक अर्थ (आपके व्यवसाय के लिए):' : 'What this means in practice for your business:'}
                </span>
                <p className="leading-normal">
                  {language === 'hi' ? item.practicalMeaningHi : item.practicalMeaningEn}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono text-[11px]">
                {item.relatedScheme}
              </span>
              <button
                onClick={() => {
                  setQueryPrefill(`Explain ${item.term} (${item.fullName}) compliance requirements`);
                  setActiveTab('chat');
                }}
                className="text-brass hover:text-indigo-deep font-semibold flex items-center gap-1 hover:underline"
              >
                <span>{language === 'hi' ? 'एआई से पूछें' : 'Ask AI'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center bg-white border border-line rounded-lg text-stone-500">
          <HelpCircle className="w-8 h-8 mx-auto text-stone-400 mb-2" />
          <p>{language === 'hi' ? 'कोई संबंधित शब्दावली नहीं मिली।' : 'No glossary terms match your search filter.'}</p>
        </div>
      )}
    </div>
  );
};
