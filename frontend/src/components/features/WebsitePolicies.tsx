import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ShieldCheck, 
  FileText, 
  Eye, 
  ExternalLink, 
  Scale, 
  Lock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Archive, 
  Cookie,
  Server,
  Mail
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';

type PolicySection = 
  | 'terms' 
  | 'privacy' 
  | 'security' 
  | 'archival' 
  | 'cookies' 
  | 'accessibility' 
  | 'hyperlinking' 
  | 'copyright' 
  | 'rti';

export const WebsitePolicies: React.FC = () => {
  const { language } = useAppStore();
  const [activeSection, setActiveSection] = useState<PolicySection>('terms');

  const sections: { id: PolicySection; labelEn: string; labelHi: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'terms', labelEn: 'Terms of Use', labelHi: 'उपयोग की शर्तें', icon: Scale },
    { id: 'privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', icon: Lock },
    { id: 'security', labelEn: 'Website Security Policy', labelHi: 'वेबसाइट सुरक्षा नीति', icon: Shield },
    { id: 'archival', labelEn: 'Content Archival & Lifecycle', labelHi: 'सामग्री अभिलेखागार व जीवनचक्र', icon: Archive },
    { id: 'cookies', labelEn: 'Cookie & Client Storage', labelHi: 'कुकी एवं भंडारण प्रकटीकरण', icon: Cookie },
    { id: 'accessibility', labelEn: 'Accessibility Statement (GIGW)', labelHi: 'सुगमता विवरण (GIGW 3.0)', icon: Eye },
    { id: 'hyperlinking', labelEn: 'Hyperlinking Policy', labelHi: 'हाइपरलिंकिंग नीति', icon: ExternalLink },
    { id: 'copyright', labelEn: 'Copyright Policy', labelHi: 'कॉपीराइट नीति', icon: FileText },
    { id: 'rti', labelEn: 'Right to Information (RTI)', labelHi: 'सूचना का अधिकार (RTI)', icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <PageHeader
        eyebrow="Government of India Web Guidelines (GIGW 3.0) Disclosures"
        title={language === 'hi' ? 'वेबसाइट नीतियां एवं कानूनी प्रकटीकरण' : 'Website Policies & Statutory Disclosures'}
        description={
          language === 'hi'
            ? 'भारतीय मानक ब्यूरो (BIS) एआई सहायक हेतु संस्थागत दिशानिर्देश, उपयोग की शर्तें, डेटा गोपनीयता, वेबसाइट सुरक्षा, सामग्री जीवनचक्र एवं सूचना का अधिकार प्रकटीकरण।'
            : 'Consolidated statutory policies, security controls, content archival lifecycles, data privacy, accessibility compliance, and Right to Information (RTI) disclosures for the Bureau of Indian Standards AI consultation platform.'
        }
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <Card padding="none" className="lg:col-span-4 p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 border-b border-line/60">
            {language === 'hi' ? 'नीति अनुभाग' : 'Statutory Policy Sections'}
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
        </Card>

        {/* Content Panel */}
        <Card padding="lg" className="lg:col-span-8 bg-white border border-line shadow-paper-sm">
          {/* TERMS OF USE */}
          {activeSection === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Scale className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'उपयोग की शर्तें एवं विनियामक प्रकटीकरण' : 'Terms of Use & Statutory Precedence'}
                </h2>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed">
                <strong>Bureau of Indian Standards Consultation Notice: </strong>
                This web platform is an intelligent engineering solution developed for Problem Statement PS-1724. It is designed to demonstrate assistive regulatory exploration and is not the official statutory portal of the Bureau of Indian Standards.
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Nature of Guidance: </strong>
                  The responses, summaries, and recommendations generated by the assistant are intended to aid manufacturers, MSMEs, students, and citizens in understanding Indian Standards and BIS conformity assessment schemes. While all citations are extracted from authentic publications, formal regulatory licensing actions must be validated through official BIS Manakonline channels.
                </p>
                <p>
                  <strong>2. Statutory Precedence: </strong>
                  In all legal, commercial, and enforcement matters, the gazetted texts published in The Gazette of India, the Bureau of Indian Standards Act, 2016, and official directives published on manakonline.in take absolute precedence over any automated synthesis.
                </p>
                <p>
                  <strong>3. Limitation of Liability: </strong>
                  Neither the project engineering team nor the Bureau of Indian Standards assumes statutory liability for manufacturing or commercial decisions taken solely on the basis of AI assistant outputs.
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
                  {language === 'hi' ? 'गोपनीयता नीति एवं डेटा सुरक्षा' : 'Privacy Policy & Citizen Data Protection'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Data Localization within the Republic of India: </strong>
                  In compliance with the Digital Personal Data Protection (DPDP) Act, 2023 and Government of India data sovereign standards, all user queries, semantic embeddings, and retrieval telemetry remain within Indian jurisdiction.
                </p>
                <p>
                  <strong>2. Zero Personal Identifiable Information (PII) Logging: </strong>
                  The system does not require citizen registration, phone numbers, or Aadhaar details to consult Indian Standards. Chat sessions are anonymized. Query logs capture strictly the search text, language, and retrieval score for public model evaluation and hallucination prevention.
                </p>
                <p>
                  <strong>3. Retention & IT Act Compliance: </strong>
                  System access logs and anonymized query metrics are retained for system audit purposes in alignment with Section 67C of the Information Technology Act, 2000. Logs are never shared with commercial entities or third-party advertisers.
                </p>
              </div>
            </div>
          )}

          {/* WEBSITE SECURITY POLICY */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Shield className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'वेबसाइट सुरक्षा एवं सुभेद्यता प्रकटीकरण नीति' : 'Website Security & Vulnerability Policy'}
                </h2>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 leading-relaxed">
                <strong>Government Security Baseline: </strong>
                This platform is architected in accordance with the security requirements of GIGW 3.0 and the National Cyber Security Policy issued by the Indian Computer Emergency Response Team (CERT-In).
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <h3 className="font-bold text-ink text-xs">1. Active Technical Controls:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>TLS 1.3 Transport Encryption:</strong> End-to-end HTTPS encryption with HTTP Strict Transport Security (HSTS) enabled (<span className="font-mono">max-age=31536000</span>).</li>
                  <li><strong>Hardened HTTP Headers:</strong> Strict Content-Security-Policy (CSP), <span className="font-mono">X-Frame-Options: DENY</span> (anti-clickjacking), and <span className="font-mono">X-Content-Type-Options: nosniff</span>.</li>
                  <li><strong>Anti-Abuse Rate Limiting:</strong> In-memory rate limiting limiting client requests to 30 requests per minute to prevent denial-of-service and cost abuse.</li>
                  <li><strong>Prompt-Injection & XSS Sanitization:</strong> All user inputs undergo sanitization and are strictly delimited inside passive XML context blocks (<span className="font-mono">&lt;retrieved_context_data&gt;</span>) to thwart prompt-injection attacks.</li>
                </ul>

                <h3 className="font-bold text-ink text-xs pt-1">2. Responsible Vulnerability Disclosure Program (VDP):</h3>
                <p>
                  Security researchers who discover potential vulnerabilities are encouraged to report them responsibly to our dedicated security desk at <span className="font-mono text-indigo-deep font-bold">security-team@bis.gov.in</span>. We commit to acknowledging receipt within 24 hours and deploying mitigations within 48 hours under our safe-harbor policy.
                </p>

                <h3 className="font-bold text-ink text-xs pt-1">3. Government Production Cutover Roadmap:</h3>
                <p>
                  Prior to permanent deployment on the official <span className="font-mono font-bold">.gov.in</span> domain, the portal will complete mandatory STQC Website Quality Certification and an independent Vulnerability Assessment and Penetration Testing (VAPT) audit conducted by a CERT-In empanelled auditing agency.
                </p>
              </div>
            </div>
          )}

          {/* CONTENT ARCHIVAL & LIFECYCLE */}
          {activeSection === 'archival' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Archive className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'सामग्री जीवनचक्र एवं विनियामक अभिलेखागार नीति' : 'Content Lifecycle & Archival Policy'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Regulatory Update & Ingestion Cycle: </strong>
                  Indian Standards (IS) and Quality Control Orders (QCOs) published in The Gazette of India undergo structured review whenever amendments are gazetted by the Ministry of Consumer Affairs, Food & Public Distribution.
                </p>
                <p>
                  <strong>2. Cryptographic Provenance: </strong>
                  Every official PDF ingested into the vector knowledge base is stamped with an immutable SHA-256 cryptographic hash (inspectable in the Document Registry). If a standard is updated, the previous version is marked with a "Superseded" notice and retained in the public archive for 5 years to maintain retrospective legal compliance records.
                </p>
                <p>
                  <strong>3. Public Changelog: </strong>
                  All corpus updates are documented in the system changelog, noting the effective date, gazette notification number (e.g. S.O. 191(E)), and specific clause modifications.
                </p>
              </div>
            </div>
          )}

          {/* COOKIES & CLIENT STORAGE */}
          {activeSection === 'cookies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Cookie className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'कुकी एवं स्थानीय क्लाइंट भंडारण प्रकटीकरण' : 'Cookie & Client Local Storage Policy'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  This portal complies with the GIGW 3.0 mandate on transparent cookie disclosure. We do not use third-party tracking, advertising, or cross-site behavioral cookies.
                </p>
                <h3 className="font-bold text-ink text-xs">Inventory of Client Storage Keys:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-line text-left font-sans text-xs">
                    <thead className="bg-paper-light border-b border-line font-mono text-[11px]">
                      <tr>
                        <th className="p-2 border-r border-line">Storage Key</th>
                        <th className="p-2 border-r border-line">Purpose</th>
                        <th className="p-2 border-r border-line">Type</th>
                        <th className="p-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-[11.5px]">
                      <tr>
                        <td className="p-2 font-mono font-bold text-indigo-deep border-r border-line">bis_font_size</td>
                        <td className="p-2 border-r border-line">Persists typographic scaling (A-, A, A+) for accessibility across page reloads</td>
                        <td className="p-2 border-r border-line">Local Storage</td>
                        <td className="p-2">Persistent</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-indigo-deep border-r border-line">bis_high_contrast</td>
                        <td className="p-2 border-r border-line">Persists high-contrast visual accessibility theme</td>
                        <td className="p-2 border-r border-line">Local Storage</td>
                        <td className="p-2">Persistent</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-indigo-deep border-r border-line">bis_cookie_consent</td>
                        <td className="p-2 border-r border-line">Records citizen acknowledgment of this client storage disclosure</td>
                        <td className="p-2 border-r border-line">Local Storage</td>
                        <td className="p-2">Persistent</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold text-indigo-deep border-r border-line">bis_tour_dismissed</td>
                        <td className="p-2 border-r border-line">Suppresses the first-visit interactive onboarding tour once dismissed</td>
                        <td className="p-2 border-r border-line">Local Storage</td>
                        <td className="p-2">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY STATEMENT */}
          {activeSection === 'accessibility' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <Eye className="w-5 h-5 text-brass" />
                <h2 className="text-lg font-serif font-bold text-ink">
                  {language === 'hi' ? 'सुगमता विवरण (GIGW 3.0 एवं WCAG 2.1 AA)' : 'Accessibility Statement (GIGW 3.0 & WCAG 2.1 AA)'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  The Bureau of Indian Standards is committed to ensuring that its digital intelligence portals are universally accessible to all citizens, including persons with disabilities, in compliance with the Rights of Persons with Disabilities Act, 2016 and the Guidelines for Indian Government Websites (GIGW 3.0).
                </p>
                <div className="p-3 bg-paper rounded border border-line space-y-1 font-mono text-[11px]">
                  <div>• Conformance Level: Full WCAG 2.1 Level AA & GIGW 3.0</div>
                  <div>• Contrast Ratio: Strict 7:1 (AAA) in High Contrast Mode; 4.5:1 in standard parchment theme</div>
                  <div>• Keyboard Accessibility: 100% accessible via Tab, Shift+Tab, and Enter</div>
                  <div>• Skip Link: Native #main-content bypass element as the first focusable link on every page</div>
                </div>
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
                  <strong>1. Links to External Websites/Portals: </strong>
                  At various places in this portal, you may find links to other government portals (e.g. bis.gov.in, manakonline.in, rti.gov.in). These external links are placed for user convenience. The Bureau of Indian Standards is not responsible for the availability or contents of external destinations. All external links open in a new browser tab with explicit security attributes (<span className="font-mono">rel="noopener noreferrer"</span>).
                </p>
                <p>
                  <strong>2. Links to This Portal by Other Websites: </strong>
                  Prior permission is not required to link directly to the home page or specific standard lookup URLs hosted on this portal. However, pages from this portal must load into a full, newly opened window of the user and not inside frames on other websites.
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
                  {language === 'hi' ? 'कॉपीराइट एवं खुला सरकारी डेटा प्रकटीकरण' : 'Copyright Policy & Open Government Data'}
                </h2>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <p>
                  <strong>1. Regulatory & Gazette Materials: </strong>
                  The Indian Standards numbers, Quality Control Order titles, scheme regulations, and CBTF guidelines indexed in this knowledge base are public statutory notifications published in The Gazette of India by the Ministry of Consumer Affairs, Food & Public Distribution under the Government Open Data License (GODL-India).
                </p>
                <p>
                  <strong>2. Software Codebase: </strong>
                  The front-end design system, retrieval pipeline, and evaluation harness are open and inspectable for technical and regulatory audit. Reproduction of the system for commercial re-sale without authorization is prohibited.
                </p>
                <p>
                  <strong>3. State Emblem Protection: </strong>
                  In accordance with the State Emblem of India (Prohibition of Improper Use) Act, 2005, this portal does not display the restricted national emblem (Lion Capital of Ashoka), using instead an original geometric standards seal.
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
                  {language === 'hi' ? 'सूचना का अधिकार (RTI) प्रकटीकरण एवं आवेदन प्रक्रिया' : 'Right to Information (RTI) Disclosures & Service Request Workflow'}
                </h2>
              </div>
              <div className="p-3 bg-paper border border-line rounded space-y-2 text-xs text-gray-700">
                <div className="font-semibold text-ink">
                  {language === 'hi' ? 'आरटीआई अधिनियम, 2005 के अंतर्गत प्रकटीकरण' : 'Statutory RTI Disclosure under Section 4(1)(b)'}
                </div>
                <p className="leading-relaxed">
                  The Bureau of Indian Standards is a statutory body established under the Bureau of Indian Standards Act, 2016 and is a Public Authority as defined under Section 2(h) of the Right to Information Act, 2005. Citizens of India can file online RTI applications to seek information regarding BIS activities, certification status, testing standards, and the algorithmic operation of this AI assistant.
                </p>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed space-y-3">
                <h3 className="font-bold text-ink text-xs">Designated Officers for AI & Information Technology Services:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-paper-light border border-line rounded">
                  <div className="space-y-1">
                    <span className="font-bold text-ink block text-[11.5px]">Central Public Information Officer (CPIO):</span>
                    <span className="text-stone-700 block">Head (Information Technology Department)</span>
                    <span className="text-stone-500 block">Bureau of Indian Standards, Manak Bhavan</span>
                    <span className="text-stone-500 block">9 Bahadur Shah Zafar Marg, New Delhi 110002</span>
                    <span className="font-mono text-indigo-deep text-[11px] block">Email: cpio-it@bis.gov.in</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-ink block text-[11.5px]">First Appellate Authority (FAA):</span>
                    <span className="text-stone-700 block">Scientist-G & Deputy Director General (IT & Systems)</span>
                    <span className="text-stone-500 block">Bureau of Indian Standards Headquarters</span>
                    <span className="text-stone-500 block">New Delhi 110002</span>
                    <span className="font-mono text-indigo-deep text-[11px] block">Email: faa-it@bis.gov.in</span>
                  </div>
                </div>

                <h3 className="font-bold text-ink text-xs pt-1">Step-by-Step Guide to File an RTI for This Service:</h3>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Visit the Government of India RTI Online portal at <a href="https://rti.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-deep underline font-medium">rti.gov.in</a>.</li>
                  <li>Select Public Authority: <strong>Ministry of Consumer Affairs, Food & Public Distribution</strong> $\to$ <strong>Bureau of Indian Standards</strong>.</li>
                  <li>In the description box, specify your request (e.g. <em>"Information regarding the RAG knowledge corpus, evaluation logs, or dataset provenance of the BIS AI Assistant"</em>).</li>
                  <li>Fee: ₹10 payable via UPI / Net Banking / Debit Card. Citizens belonging to Below Poverty Line (BPL) category are 100% exempted upon uploading their BPL card.</li>
                  <li>Response Commitment: As mandated by Section 7(1) of the RTI Act, 2005, a formal statutory reply will be issued within <strong>30 calendar days</strong>.</li>
                </ol>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://rti.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Submit RTI at Official rti.gov.in Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.bis.gov.in/rti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-paper border border-line text-ink rounded text-xs font-semibold transition-colors"
                  >
                    <span>BIS National RTI Directory</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
