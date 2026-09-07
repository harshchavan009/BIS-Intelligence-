import React from 'react';
import { useAppStore, ActiveTab } from '../../store/useAppStore';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { 
  Network, 
  MessageSquare, 
  Search, 
  Layers, 
  FlaskConical, 
  ShieldCheck, 
  Gem, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Building2, 
  BarChart3, 
  Scale, 
  Info, 
  Home, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface SitemapSection {
  titleEn: string;
  titleHi: string;
  items: {
    tab: ActiveTab;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    path: string;
    icon: React.FC<{ className?: string }>;
  }[];
}

export const SitemapPage: React.FC = () => {
  const { setActiveTab, language } = useAppStore();

  const sitemapSections: SitemapSection[] = [
    {
      titleEn: '1. AI & Institutional Regulatory Search',
      titleHi: '1. एआई एवं संस्थागत विनियामक खोज',
      items: [
        {
          tab: 'landing',
          titleEn: 'Home / Regulatory Consultation Hero',
          titleHi: 'होम / विनियामक परामर्श मुख्य पृष्ठ',
          descEn: 'Platform introduction, real-time live RAG demo, quick MSME search, and key standard highlights.',
          descHi: 'प्लेटफ़ॉर्म परिचय, वास्तविक समय लाइव RAG डेमो, त्वरित एमएसएमई खोज और प्रमुख मानक।',
          path: '/',
          icon: Home
        },
        {
          tab: 'chat',
          titleEn: 'AI Intelligent Assistant (Streaming Q&A)',
          titleHi: 'एआई बुद्धिमान सहायक (स्ट्रीमिंग प्रश्नोत्तर)',
          descEn: 'Source-grounded conversational answers on IS specifications, QCOs, and certification clauses with inline citations.',
          descHi: 'भारतीय मानकों, QCOs और प्रमाणन खंडों पर इनलाइन उद्धरणों सहित आधिकारिक स्रोत-प्रमाणित उत्तर।',
          path: '/chat',
          icon: MessageSquare
        },
        {
          tab: 'finder',
          titleEn: 'Indian Standards & Mandatory QCO Finder',
          titleHi: 'भारतीय मानक एवं अनिवार्य QCO खोजक',
          descEn: 'Structured product-to-standard mapping across 55+ canonical Indian Standards, gazette notifications, and categories.',
          descHi: '55+ आधिकारिक भारतीय मानकों, राजपत्र अधिसूचनाओं और श्रेणियों में उत्पाद-से-मानक खोज।',
          path: '/finder',
          icon: Search
        },
        {
          tab: 'schemes',
          titleEn: 'Certification Schemes Comparison & Step Timeline',
          titleHi: 'प्रमाणन योजनाएं तुलना एवं चरणबद्ध समयरेखा',
          descEn: 'Side-by-side comparison of Scheme-I (ISI Mark), Scheme-II (CRO), Scheme-IV (CoC), and 6-stage process timelines.',
          descHi: 'योजना-I (ISI), योजना-II (CRO), योजना-IV (CoC) और 6-चरणीय प्रक्रिया समयरेखा की तुलना।',
          path: '/schemes',
          icon: Layers
        },
        {
          tab: 'labs',
          titleEn: 'MSME Cluster Based Test Facility (CBTF) Finder',
          titleHi: 'एमएसएमई क्लस्टर आधारित परीक्षण सुविधा (CBTF) खोजक',
          descEn: 'Eligibility criteria, testing concessions, cluster clusters, and essential testing apparatus for small enterprises.',
          descHi: 'लघु उद्यमों हेतु पात्रता मानदंड, परीक्षण रियायतें, क्लस्टर सुविधाएं और आवश्यक परीक्षण उपकरण।',
          path: '/labs',
          icon: FlaskConical
        }
      ]
    },
    {
      titleEn: '2. Consumer Rights, Traceability & Publications',
      titleHi: '2. उपभोक्ता अधिकार, सत्यता जांच एवं प्रकाशन',
      items: [
        {
          tab: 'consumer',
          titleEn: 'Consumer Rights & ISI Mark Authenticity',
          titleHi: 'उपभोक्ता अधिकार एवं ISI मार्क प्रामाणिकता',
          descEn: 'Inspection guide for genuine ISI marks, simulated CM/L license lookup, and BIS Care grievance redressal.',
          descHi: 'असली ISI मार्क निरीक्षण गाइड, सिम्युलेटेड CM/L लाइसेंस खोज और बीआईएस केयर शिकायत निवारण।',
          path: '/consumer',
          icon: ShieldCheck
        },
        {
          tab: 'hallmarking',
          titleEn: 'Gold Hallmarking & 6-Digit HUID Verification',
          titleHi: 'स्वर्ण हॉलमार्किंग एवं 6-अंकीय HUID सत्यापन',
          descEn: 'Alphanumeric HUID code structure, 3 mandatory hallmark signs, and simulated purity verification.',
          descHi: 'अल्फ़ान्यूमेरिक HUID कोड संरचना, 3 अनिवार्य हॉलमार्क प्रतीक और शुद्धता सत्यापन।',
          path: '/hallmarking',
          icon: Gem
        },
        {
          tab: 'registry',
          titleEn: 'Regulatory Document Registry & SHA-256 Hashes',
          titleHi: 'विनियामक दस्तावेज रजिस्ट्री एवं SHA-256 हस्ताक्षर',
          descEn: 'Cryptographically signed register of all 7 indexed official gazette notifications, versions, and authority metadata.',
          descHi: 'सभी 7 अनुक्रमित आधिकारिक राजपत्र अधिसूचनाओं, संस्करणों और मेटाडेटा की डिजिटल हस्ताक्षरित सूची।',
          path: '/registry',
          icon: FileText
        }
      ]
    },
    {
      titleEn: '3. Guidance, Help & Citizen Support',
      titleHi: '3. मार्गदर्शन, सहायता एवं नागरिक समर्थन',
      items: [
        {
          tab: 'help',
          titleEn: 'Platform Help Center & Non-Technical Guide',
          titleHi: 'सहायता केंद्र एवं सामान्य उपयोगकर्ता गाइड',
          descEn: 'Visual step-by-step instructions on navigating features, reading citations, and using accessibility tools.',
          descHi: 'सुविधाओं के उपयोग, उद्धरणों को समझने और सुलभता उपकरणों के उपयोग हेतु सचित्र गाइड।',
          path: '/help',
          icon: HelpCircle
        },
        {
          tab: 'faq',
          titleEn: 'Frequently Asked Questions (Bilingual FAQ)',
          titleHi: 'अक्सर पूछे जाने वाले प्रश्न (द्विभाषी FAQ)',
          descEn: 'Authoritative answers to 15 recurring citizen and manufacturer queries on compliance and testing.',
          descHi: 'नागरिकों और निर्माताओं के अनुपालन व परीक्षण से जुड़े 15 सामान्य प्रश्नों के आधिकारिक उत्तर।',
          path: '/faq',
          icon: BookOpen
        },
        {
          tab: 'glossary',
          titleEn: 'Plain Language Regulatory Glossary',
          titleHi: 'सरल भाषा विनियामक शब्दावली',
          descEn: '21 institutional terms (QCO, CBTF, CoC, HUID, Surveillance) explained in accessible plain language.',
          descHi: '21 संस्थागत शब्दों (QCO, CBTF, CoC, HUID, निगरानी) की सरल और स्पष्ट व्याख्या।',
          path: '/glossary',
          icon: BookOpen
        },
        {
          tab: 'contact',
          titleEn: 'BIS Branch Offices & Helpdesks Directory',
          titleHi: 'बीआईएस शाखा कार्यालय एवं हेल्पलाइन संपर्क',
          descEn: 'Contact directory of HQ, 5 Regional Offices, and 8 key Branch Offices with official emails and phone numbers.',
          descHi: 'मुख्यालय, 5 क्षेत्रीय कार्यालयों और 8 प्रमुख शाखा कार्यालयों के पते, ईमेल और हेल्पलाइन नंबर।',
          path: '/contact',
          icon: Building2
        }
      ]
    },
    {
      titleEn: '4. Governance, Policies & Public Telemetry',
      titleHi: '4. शासन, नीतियां एवं सार्वजनिक टेलीमेट्री',
      items: [
        {
          tab: 'analytics',
          titleEn: 'Public Evaluation Benchmark (65/65 Cases)',
          titleHi: 'सार्वजनिक मूल्यांकन बेंचमार्क (65/65 परीक्षण)',
          descEn: 'Real-time inspectable test harness displaying 100% groundedness accuracy across all product categories.',
          descHi: 'सभी उत्पाद श्रेणियों में 100% प्रामाणिकता स्कोर प्रदर्शित करने वाला सार्वजनिक परीक्षण डैशबोर्ड।',
          path: '/analytics',
          icon: BarChart3
        },
        {
          tab: 'policies',
          titleEn: 'Website Policies & Statutory Disclosures',
          titleHi: 'वेबसाइट नीतियां एवं कानूनी प्रकटीकरण',
          descEn: 'Consolidated Terms of Use, Privacy, Security Policy, Content Archival Lifecycle, Cookies, and RTI disclosures.',
          descHi: 'उपयोग की शर्तें, गोपनीयता, सुरक्षा नीति, सामग्री अभिलेखागार, कुकीज़ और आरटीआई प्रकटीकरण।',
          path: '/policies',
          icon: Scale
        },
        {
          tab: 'about',
          titleEn: 'About System Architecture & Grounding Pipeline',
          titleHi: 'सिस्टम आर्किटेक्चर एवं RAG पाइपलाइन के बारे में',
          descEn: 'Technical disclosure of the hybrid retrieval (BM25 + Dense RRF), ChromaDB persistence, and hallucination defense.',
          descHi: 'हाइब्रिड रिट्रीवल (BM25 + Dense RRF), क्रोमाडीबी और मतिभ्रम रोकथाम का तकनीकी विवरण।',
          path: '/about',
          icon: Info
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      <PageHeader
        eyebrow={language === 'hi' ? 'जीआईजीडब्ल्यू 3.0 सुगमता प्रकटीकरण' : 'GIGW 3.0 Mandatory Sitemap'}
        title={language === 'hi' ? 'पोर्टल साइटमैप एवं संपूर्ण मार्गदर्शिका' : 'Website Sitemap & Complete Directory'}
        description={
          language === 'hi'
            ? 'भारतीय मानक ब्यूरो (BIS) एआई सहायक पोर्टल के सभी 15 पृष्ठों, विनियामक उपकरणों और संस्थागत प्रकटीकरणों की संपूर्ण सूची।'
            : 'Structured, crawlable directory listing every active route, regulatory tool, verification service, and statutory disclosure available across the Bureau of Indian Standards AI consultation portal.'
        }
      />

      <div className="space-y-8">
        {sitemapSections.map((sec, idx) => (
          <Card key={idx} padding="md" className="space-y-4">
            <h2 className="text-sm sm:text-base font-serif font-bold text-ink border-b border-line pb-2.5 flex items-center gap-2">
              <Network className="w-4 h-4 text-brass" />
              <span>{language === 'hi' ? sec.titleHi : sec.titleEn}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sec.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveTab(item.tab)}
                    className="p-3.5 rounded-lg border border-line bg-paper-light hover:bg-amber-50/40 hover:border-brass/60 transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-2xs"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveTab(item.tab)}
                    aria-label={`Navigate to ${item.titleEn}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-serif font-bold text-xs text-ink group-hover:text-indigo-deep">
                          <Icon className="w-4 h-4 text-brass group-hover:scale-105 transition-transform" />
                          <span>{language === 'hi' ? item.titleHi : item.titleEn}</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-line">
                          {item.path}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-stone-600 leading-relaxed pl-6">
                        {language === 'hi' ? item.descHi : item.descEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-end text-[11px] font-semibold text-brass group-hover:text-indigo-deep pt-1">
                      <span className="group-hover:underline">{language === 'hi' ? 'पेज खोलें' : 'Open Page'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
