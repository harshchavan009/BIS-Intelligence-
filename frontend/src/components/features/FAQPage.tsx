import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, DollarSign, Clock, FileCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'Mandatory' | 'Process & Cost' | 'MSME Support' | 'Hallmarking';
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "Mandatory",
    qEn: "How do I know if my product legally needs mandatory BIS certification?",
    qHi: "मुझे कैसे पता चलेगा कि मेरे उत्पाद को कानूनी रूप से अनिवार्य बीआईएस प्रमाणन की आवश्यकता है?",
    aEn: "Check whether the Central Government has published a Quality Control Order (QCO) covering your product category under Section 16 of the BIS Act, 2016. If a QCO is in force, manufacturing, importing, or selling without the ISI mark is illegal. You can check our 'Standards Finder' tab by typing your product name, or ask the AI Assistant.",
    aHi: "जांचें कि क्या केंद्र सरकार ने बीआईएस अधिनियम, 2016 की धारा 16 के तहत आपके उत्पाद को कवर करने वाला गुणवत्ता नियंत्रण आदेश (QCO) अधिसूचित किया है। यदि QCO लागू है, तो ISI मार्क के बिना उत्पादन या बिक्री गैरकानूनी है। आप 'मानक खोज' टैब में जांच सकते हैं।",
    highlight: "Section 16 QCO Gazette Orders"
  },
  {
    id: "faq-2",
    category: "Process & Cost",
    qEn: "What does it cost to get a BIS ISI Mark license (Scheme-I)?",
    qHi: "बीआईएस आईएसआई मार्क लाइसेंस (योजना-I) प्राप्त करने में कितना खर्च आता है?",
    aEn: "The fee structure includes: 1) Application fee (~₹1,000), 2) Factory audit charges (~₹7,000/man-day), 3) Independent sample testing charges (varies by product from ₹5,000 to ₹40,000+ depending on IS specifications), and 4) Annual marking fee (minimum ₹1,000/year plus volume-based dues). Micro enterprises enjoy special concessions under government MSME policies.",
    aHi: "शुल्क में शामिल हैं: 1) आवेदन शुल्क (~₹1,000), 2) कारखाना ऑडिट शुल्क (~₹7,000/व्यक्ति-दिन), 3) स्वतंत्र नमूना परीक्षण शुल्क (मानक के अनुसार ₹5,000 से ₹40,000+), और 4) वार्षिक अंकन शुल्क। सूक्ष्म उद्योगों को विशेष सरकारी रियायतें प्राप्त हैं।",
    highlight: "Typical total: ₹35,000 – ₹90,000 initial outlay"
  },
  {
    id: "faq-3",
    category: "Process & Cost",
    qEn: "How long does the certification process take from application to license grant?",
    qHi: "आवेदन से लेकर लाइसेंस मिलने तक प्रमाणन प्रक्रिया में कितना समय लगता है?",
    aEn: "Under the Normal Procedure, it typically takes 30 to 60 days, including factory inspection, sample collection, and laboratory test reporting. Under the Simplified Procedure (where the applicant submits a pre-tested report from a recognized laboratory), a license can be granted in 15 to 30 days upon satisfactory factory verification.",
    aHi: "सामान्य प्रक्रिया के तहत इसमें 30 से 60 दिन लगते हैं (कारखाना निरीक्षण, नमूना संग्रह और परीक्षण रिपोर्ट सहित)। सरलीकृत प्रक्रिया के तहत (मान्यता प्राप्त लैब की वैध रिपोर्ट के साथ), 15 से 30 दिनों में लाइसेंस मिल सकता है।",
    highlight: "Normal: 30–60 days | Simplified: 15–30 days"
  },
  {
    id: "faq-4",
    category: "MSME Support",
    qEn: "I am a small micro-enterprise and cannot afford costly laboratory machines. Can I still get licensed?",
    qHi: "मैं एक छोटा सूक्ष्म उद्यम हूँ और महंगी परीक्षण मशीनें नहीं खरीद सकता। क्या मुझे फिर भी लाइसेंस मिल सकता है?",
    aEn: "Yes! Under the Cluster Based Test Facility (CBTF) guidelines (CMD-I/2:12:8), MSMEs located in an industrial cluster (normally within 25–50 km radius) can share capital-intensive testing equipment operated by a common facility or industry association. You only need to maintain basic visual/dimensional inspection tools in-house.",
    aHi: "हाँ! क्लस्टर आधारित परीक्षण सुविधा (CBTF) दिशानिर्देशों के तहत, औद्योगिक क्लस्टर (25-50 किमी दायरा) में स्थित MSMEs साझा परीक्षण प्रयोगशाला का उपयोग कर सकते हैं। कारखाने में केवल बुनियादी दृश्य/आयामी उपकरण रखने होंगे।",
    highlight: "Saves up to 70% in capital testing expenditure"
  },
  {
    id: "faq-5",
    category: "Process & Cost",
    qEn: "What is the difference between Scheme-I (ISI Mark) and Scheme-II (CRO)?",
    qHi: "योजना-I (आईएसआई मार्क) और योजना-II (सीआरओ) में क्या अंतर है?",
    aEn: "Scheme-I involves complete factory inspection, ongoing surveillance, and grants permission to use the ISI monogram on the product. Scheme-II (Compulsory Registration Scheme / CRO) is primarily for electronic & IT goods (e.g. mobile phones, adapters); it relies on test reports from BIS recognized labs and grants a unique R-number (e.g. R-XXXXXXXX) without factory audits.",
    aHi: "योजना-I में कारखाना निरीक्षण और निरंतर निगरानी होती है और ISI मार्क मिलता है। योजना-II (सीआरओ) इलेक्ट्रॉनिक्स एवं आईटी उत्पादों हेतु है; यह मान्यता प्राप्त प्रयोगशाला की रिपोर्ट पर आधारित है और इसमें बिना फैक्ट्री ऑडिट के R-नंबर मिलता है।",
    highlight: "Scheme-I: ISI mark | Scheme-II: R-Number (IT/Electronics)"
  },
  {
    id: "faq-6",
    category: "Process & Cost",
    qEn: "What is Scheme-IV (Certificate of Conformity / CoC)?",
    qHi: "योजना-IV (अनुरूपता प्रमाण पत्र / सीओसी) क्या है?",
    aEn: "Scheme-IV is intended for batch-wise supplies or consignment lots where full factory licensing is not required. A Certificate of Conformity (CoC) is granted for a specific quantity or duration after testing samples from that specific batch in an accredited laboratory.",
    aHi: "योजना-IV विशिष्ट बैच या खेप आपूर्ति हेतु है जहाँ पूर्ण कारखाना लाइसेंस की आवश्यकता नहीं होती। मान्यता प्राप्त लैब में उस विशिष्ट बैच के नमूने का परीक्षण करने के बाद CoC जारी किया जाता है।",
    highlight: "Consignment & batch-specific conformity"
  },
  {
    id: "faq-7",
    category: "Hallmarking",
    qEn: "What is HUID and why is it mandatory on gold jewellery?",
    qHi: "एचयूआईडी (HUID) क्या है और यह सोने के आभूषणों पर क्यों अनिवार्य है?",
    aEn: "HUID stands for Hallmark Unique Identification. It is a 6-digit laser-engraved alphanumeric code that guarantees pure gold content (e.g., 22K916, 18K750, 14K585). It protects consumers against under-caratage fraud and allows tracking back to the licensed jeweller and assaying hallmarking center.",
    aHi: "HUID का अर्थ 'हॉलमार्क विशिष्ट पहचान संख्या' है। यह 6 अंकों का लेजर कोड है जो सोने की शुद्धता की गारंटी देता है। यह उपभोक्ताओं को कम शुद्धता की धोखाधड़ी से बचाता है और BIS-CARE ऐप पर सत्यापन योग्य है।",
    highlight: "Mandatory in 343+ districts across India"
  },
  {
    id: "faq-8",
    category: "Mandatory",
    qEn: "Can foreign manufacturers sell products in India that are covered under mandatory QCOs?",
    qHi: "क्या विदेशी निर्माता अनिवार्य QCO के तहत आने वाले उत्पादों को भारत में बेच सकते हैं?",
    aEn: "Foreign manufacturers can sell in India only after obtaining a valid license under the Foreign Manufacturers Certification Scheme (FMCS). BIS officers conduct on-site factory audits abroad, verify testing facilities, and issue a CM/L license before customs clearance.",
    aHi: "विदेशी निर्माता केवल विदेशी निर्माता प्रमाणन योजना (FMCS) के तहत वैध लाइसेंस प्राप्त करने के बाद ही बेच सकते हैं। बीआईएस अधिकारी विदेश में फैक्ट्री ऑडिट करते हैं।",
    highlight: "FMCS required for all foreign imports under QCO"
  },
  {
    id: "faq-9",
    category: "MSME Support",
    qEn: "How do I find a BIS-recognized laboratory near my factory?",
    qHi: "मैं अपने कारखाने के पास बीआईएस मान्यता प्राप्त प्रयोगशाला कैसे ढूंढूं?",
    aEn: "You can use our 'Lab Finder (CBTF)' tab to search for recognized government and private laboratories by industrial cluster, state, or product standard (e.g., cement, steel, electronics). You can also view recognized labs on the official Manakonline CLIMS portal.",
    aHi: "आप हमारे 'लैब खोज (CBTF)' टैब का उपयोग करके औद्योगिक क्लस्टर, राज्य या उत्पाद मानक के आधार पर मान्यता प्राप्त प्रयोगशालाएं खोज सकते हैं।",
    highlight: "Searchable in Lab Finder tab"
  },
  {
    id: "faq-10",
    category: "Process & Cost",
    qEn: "What happens if a manufacturer misuses the ISI mark or counterfeits a CM/L number?",
    qHi: "यदि कोई निर्माता ISI मार्क का दुरुपयोग करता है या नकली CM/L नंबर बनाता है तो क्या होता है?",
    aEn: "Section 29 of the BIS Act, 2016 prescribes stringent criminal penalties for unauthorized use of standard marks, including imprisonment up to two years, a fine of not less than ₹2,00,000 (which may extend to ten times the value of goods), and confiscation of entire inventory.",
    aHi: "बीआईएस अधिनियम 2016 की धारा 29 के तहत दो साल तक का कारावास, न्यूनतम ₹2,00,000 जुर्माना (या माल के मूल्य का 10 गुना) और पूरा स्टॉक जब्त करने का कड़ा कानूनी प्रावधान है।",
    highlight: "Section 29: Up to 2 years imprisonment + 10x fine"
  }
];

export const FAQPage: React.FC = () => {
  const { setActiveTab, setQueryPrefill } = useAppStore();
  const { language } = useTranslation();
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs = FAQ_DATA.filter(item => 
    activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-indigo-deep text-white rounded-lg p-6 sm:p-8 border border-brass/30 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brass/20 text-brass border border-brass/40 text-xs font-mono mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'सामान्य प्रश्नोत्तरी' : 'Citizen & MSME Help Center'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-standard font-bold tracking-tight mb-2">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h1>
        <p className="text-stone-300 text-sm leading-relaxed">
          {language === 'hi'
            ? 'भारतीय मानकों, प्रमाणन शुल्क, समय-सीमा और एमएसएमई सुविधाओं से संबंधित महत्वपूर्ण व्यावहारिक प्रश्न।'
            : 'Authoritative answers to the most common real-world questions on Indian Standards, licensing costs, timelines, and compliance.'}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Mandatory', 'Process & Cost', 'MSME Support', 'Hallmarking'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brass text-white shadow-sm'
                : 'bg-white border border-line text-stone-600 hover:border-brass/50'
            }`}
          >
            {cat === 'all' ? (language === 'hi' ? 'सभी प्रश्न' : 'All Topics') : cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div 
              key={faq.id}
              className="bg-white border border-line rounded-lg overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-paper-light transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm sm:text-base text-ink flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-50 text-brass border border-brass/30 flex items-center justify-center text-xs shrink-0 font-mono">
                    ?
                  </span>
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brass shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-700 space-y-3 border-t border-line/60 bg-[#FAF9F5]">
                  <p className="leading-relaxed">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </p>

                  {faq.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100/70 border border-amber-300 text-amber-900 font-mono text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>{faq.highlight}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setQueryPrefill(faq.qEn);
                        setActiveTab('chat');
                      }}
                      className="text-brass hover:text-indigo-deep font-semibold text-xs flex items-center gap-1 hover:underline"
                    >
                      <span>{language === 'hi' ? 'इस पर एआई से विस्तृत जानकारी लें' : 'Ask AI for clause citations'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Human Escalation Notice */}
      <div className="p-4 bg-paper-light border border-line rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-600">
          <span className="font-semibold text-ink block">
            {language === 'hi' ? 'क्या आपका प्रश्न यहाँ नहीं मिला?' : 'Still have unanswered questions?'}
          </span>
          <span>
            {language === 'hi' 
              ? 'हमारे एआई सहायक से पूछें या निकटतम बीआईएस क्षेत्रीय कार्यालय से संपर्क करें।'
              : 'Consult our conversational AI or reach out to your designated BIS regional officer.'}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('contact')}
          className="px-4 py-2 bg-indigo-deep text-white text-xs font-medium rounded hover:bg-ink transition-colors whitespace-nowrap"
        >
          {language === 'hi' ? 'शाखा संपर्क देखें' : 'Contact Branch Office'}
        </button>
      </div>
    </div>
  );
};
