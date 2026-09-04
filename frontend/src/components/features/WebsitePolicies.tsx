import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, FileText, Eye, ExternalLink, Scale, Lock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';

type PolicySection = 'terms' | 'privacy' | 'accessibility' | 'hyperlinking' | 'copyright' | 'rti';

export const WebsitePolicies: React.FC = () => {
  const { language } = useAppStore();
  const [activeSection, setActiveSection] = useState<PolicySection>('terms');

  const sections: { id: PolicySection; labelEn: string; labelHi: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'terms', labelEn: 'Terms of Use', labelHi: 'उपयोग की शर्तें', icon: Scale },
    { id: 'privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', icon: Lock },
    { id: 'accessibility', labelEn: 'Accessibility Statement', labelHi: 'सुगमता विवरण (GIGW)', icon: Eye },
    { id: 'hyperlinking', labelEn: 'Hyperlinking Policy', labelHi: 'हाइपरलिंकिंग नीति', icon: ExternalLink },
    { id: 'copyright', labelEn: 'Copyright Policy', labelHi: 'कॉपीराइट नीति', icon: FileText },
    { id: 'rti', labelEn: 'Right to Information (RTI)', labelHi: 'सूचना का अधिकार (RTI)', icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper-sm space-y-3">
        <div className="flex items-center gap-2">
          <SealMotif size={22} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            Government of India Web Guidelines (GIGW 3.0) Disclosures
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-ink">
          {language === 'hi' ? 'वेबसाइट नीतियां एवं कानूनी प्रकटीकरण' : 'Website Policies & Statutory Disclosures'}
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'भारतीय मानक ब्यूरो (BIS) एआई सहायक प्रोटोटाइप हेतु संस्थागत दिशानिर्देश, उपयोग की शर्तें, डेटा गोपनीयता, सुगमता मानक एवं सूचना का अधिकार प्रकटीकरण।'
            : 'Consolidated statutory policies, terms of operation, data privacy guidelines, accessibility compliance, and Right to Information (RTI) disclosures for the BIS AI Assistant prototype.'}
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 bg-white border border-line rounded-lg p-3 shadow-paper-sm space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 border-b border-line/60">
            {language === 'hi' ? 'नीति अनुभाग' : 'Policy Sections'}
          </div>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isCur = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-all text-left ${
                  isCur
                    ? 'bg-indigo-deep text-white font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-paper hover:text-ink'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isCur ? 'text-brass' : 'text-gray-400'}`} />
                <span>{language === 'hi' ? sec.labelHi : sec.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Detail Content Card */}
        <div className="lg:col-span-8 bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper space-y-6">
          {/* TERMS OF USE */}
          {activeSection === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Scale className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'उपयोग की शर्तें एवं प्रोटोटाइप प्रकटीकरण' : 'Terms of Use & Prototype Disclosure'}
                </h2>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed">
                <strong>Smart India Hackathon 2026 Notice: </strong>
                This web platform is an engineering prototype developed for Smart India Hackathon (SIH) Problem Statement PS-1724. It is designed to demonstrate assistive regulatory exploration and is not the official statutory portal of the Bureau of Indian Standards.
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Nature of Guidance: </strong>
                  The responses, summaries, and recommendations generated by the assistant are intended to aid manufacturers, MSMEs, students, and citizens in understanding Indian Standards and BIS conformity assessment schemes. While all citations are extracted from authentic publications, formal regulatory licensing actions must be validated through official BIS Manakonline channels.
                </p>
                <p>
                  <strong>2. Simulated vs. Production Services: </strong>
                  Verification tools including CM/L License search and Gold Jewellery HUID validation operate in explicit demo simulation mode utilizing verified seed records. Arbitrary numbers are honestly reported as not found in the demonstration database.
                </p>
                <p>
                  <strong>3. Limitation of Liability: </strong>
                  Neither the SIH project team nor the Bureau of Indian Standards assumes statutory liability for manufacturing or commercial decisions taken solely on the basis of AI assistant outputs.
                </p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Lock className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'डेटा गोपनीयता एवं सूचना सुरक्षा नीति' : 'Privacy Policy & Information Safety'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Zero Personal Tracking: </strong>
                  This portal does not collect personally identifiable information (PII) such as personal phone numbers, Aadhaar numbers, PAN, or financial credentials.
                </p>
                <p>
                  <strong>2. Local Browser Storage: </strong>
                  Preferences such as language selection (English/Hindi), font sizing, and high-contrast display modes are stored exclusively in your browser's local storage and are never transmitted to third-party advertising brokers.
                </p>
                <p>
                  <strong>3. Query Logging & Telemetry: </strong>
                  To improve answer groundedness and compute institutional evaluation metrics, query turns and thumbs-up/down ratings are recorded anonymously in a local database. No IP-to-identity linkages are retained.
                </p>
                <p>
                  <strong>4. Evaluator Sessions: </strong>
                  Evaluator access to administrative telemetry is protected by short-lived, encrypted 30-minute session tokens stored in HttpOnly SameSite cookies.
                </p>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY STATEMENT */}
          {activeSection === 'accessibility' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Eye className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'सुगमता वक्तव्य (GIGW 3.0 / WCAG 2.1 AA)' : 'Accessibility Statement (GIGW 3.0 Compliance)'}
                </h2>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 leading-relaxed">
                <strong>Accessibility Commitment: </strong>
                We are committed to ensuring that the BIS AI Intelligent Assistant portal is accessible to all users, including persons with disabilities, in adherence to the Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 Level AA.
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>Features Implemented:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Accessibility Toolbar:</strong> Quick toggles for Screen Reader guidance, text resizing (A- / A / A+), and High Contrast dark mode.</li>
                  <li><strong>Skip to Main Content:</strong> Direct keyboard bypass navigation for screen reader and keyboard-only visitors.</li>
                  <li><strong>Semantic HTML Hierarchy:</strong> Strictly ordered `h1` through `h4` heading landmarks, ARIA live regions for streaming AI responses, and descriptive `aria-label` attributes on all icon buttons.</li>
                  <li><strong>Touch Target Standards:</strong> Interactive elements engineered with minimum 44×44px hit areas on touch devices.</li>
                </ul>
              </div>
            </div>
          )}

          {/* HYPERLINKING POLICY */}
          {activeSection === 'hyperlinking' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <ExternalLink className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Links to External Websites: </strong>
                  Throughout this portal, you will find authoritative links to external Government of India web properties, including:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bureau of Indian Standards Official Portal (<a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline">bis.gov.in</a>)</li>
                  <li>Manakonline Portal (<a href="https://www.manakonline.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline">manakonline.in</a>)</li>
                  <li>Right to Information Online Portal (<a href="https://rti.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline">rti.gov.in</a>)</li>
                  <li>Department of Consumer Affairs (<a href="https://consumeraffairs.nic.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline">consumeraffairs.nic.in</a>)</li>
                </ul>
                <p>
                  These links are provided for your convenience. We are not responsible for the contents or reliability of the linked websites and do not necessarily endorse the views expressed within them.
                </p>
                <p>
                  <strong>2. Links to This Site: </strong>
                  Prior permission is not required to link directly to the public pages of this prototype. However, pages must load into a full newly opened browser window rather than inside frames.
                </p>
              </div>
            </div>
          )}

          {/* COPYRIGHT POLICY */}
          {activeSection === 'copyright' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <FileText className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'कॉपीराइट नीति एवं सामग्री उपयोग' : 'Copyright Policy & Material Usage'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Regulatory & Gazette Materials: </strong>
                  The Indian Standards numbers, Quality Control Order titles, scheme regulations, and CBTF guidelines indexed in this knowledge base are public statutory notifications published in The Gazette of India by the Ministry of Consumer Affairs, Food & Public Distribution.
                </p>
                <p>
                  <strong>2. Software Codebase: </strong>
                  The front-end design system, retrieval pipeline, and evaluation harness are open and inspectable for SIH 2026 technical evaluation. Reproduction of the system for commercial re-sale without authorization is prohibited.
                </p>
                <p>
                  <strong>3. Emblem Protection: </strong>
                  In accordance with the State Emblem of India (Prohibition of Improper Use) Act, 2005, this prototype does not display the restricted national emblem (Lion Capital of Ashoka), using instead an original geometric standards seal.
                </p>
              </div>
            </div>
          )}

          {/* RIGHT TO INFORMATION (RTI) */}
          {activeSection === 'rti' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <BookOpen className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'सूचना का अधिकार (RTI) प्रकटीकरण' : 'Right to Information (RTI) Act, 2005'}
                </h2>
              </div>
              <div className="p-3 bg-paper border border-line rounded space-y-2 text-xs text-gray-700">
                <div className="font-semibold text-ink">
                  {language === 'hi' ? 'आरटीआई अधिनियम, 2005 के अंतर्गत प्रकटीकरण' : 'Statutory RTI Disclosure under Section 4(1)(b)'}
                </div>
                <p className="leading-relaxed">
                  The Bureau of Indian Standards is a statutory body established under the Bureau of Indian Standards Act, 2016 and is a Public Authority as defined under Section 2(h) of the Right to Information Act, 2005. Citizens of India can file online RTI applications to seek information regarding BIS activities, certification status, and testing standards.
                </p>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <h3 className="font-bold text-ink text-xs">How to File an RTI Application:</h3>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Visit the official Government of India RTI portal at <a href="https://rti.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline font-medium">rti.gov.in</a>.</li>
                  <li>Select "Ministry of Consumer Affairs, Food and Public Distribution" and choose "Bureau of Indian Standards" as the Public Authority.</li>
                  <li>Submit the online application along with the prescribed fee of ₹10 (exempted for BPL applicants).</li>
                </ol>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://rti.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Visit Official RTI Online Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.bis.gov.in/rti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-paper border border-line text-ink rounded text-xs font-semibold transition-colors"
                  >
                    <span>BIS Official RTI Directory</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
