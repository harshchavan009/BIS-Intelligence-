import React from 'react';
import { useAppStore, LegalModalType } from '../../store/useAppStore';
import { X, ShieldCheck, Scale, FileText, AlertCircle, Phone, Globe, ExternalLink, CheckCircle } from 'lucide-react';
import { SealMotif } from './SealMotif';

export const LegalModal: React.FC = () => {
  const { activeLegalModal, setActiveLegalModal, language } = useAppStore();

  if (!activeLegalModal) return null;

  const closeModal = () => setActiveLegalModal(null);

  const renderContent = () => {
    switch (activeLegalModal) {
      case 'terms':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 font-medium">
              <span className="font-bold">Prototype Demonstration Disclaimer: </span>
              This application is a software prototype developed for the Smart India Hackathon (SIH 2026, Problem Statement 1724). It provides assistive search and AI summarization of public Bureau of Indian Standards documents.
            </div>
            <p>
              <strong>1. Not an Official Legal Determination: </strong>
              The information, clause references, and synthesis produced by this AI assistant are generated for research, exploration, and pilot evaluation purposes only. No output from this assistant constitutes an official grant of license, statutory certification, or legal ruling by the Bureau of Indian Standards (BIS) or the Government of India.
            </p>
            <p>
              <strong>2. Statutory Precedence: </strong>
              In all legal and commercial matters, the gazetted texts published in the Official Gazette of India, the Bureau of Indian Standards Act, 2016, and official directives published on the Manakonline portal take absolute precedence over any AI output.
            </p>
            <p>
              <strong>3. License and Use: </strong>
              Users may query the system for educational, compliance preparation, and MSME planning purposes. Automated scraping or denial-of-service attempts are strictly prohibited under system rate-limiting policies.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              <strong>1. Zero Personal Data Harvesting: </strong>
              The BIS AI Intelligent Assistant prototype does not collect, sell, or profile personal identities, Aadhaar numbers, PAN, or financial credentials.
            </p>
            <p>
              <strong>2. Consultation Telemetry: </strong>
              Queries submitted through the workspace and associated feedback votes (thumbs-up / thumbs-down) are logged anonymously to evaluate grounded retrieval accuracy, hallucination resistance, and category distribution.
            </p>
            <p>
              <strong>3. Alignment with DPDP Act 2023: </strong>
              The production roadmap outlines full alignment with the Digital Personal Data Protection (DPDP) Act, 2023, including data minimization, consent manager integration, and secure localized hosting on empaneled government cloud infrastructure.
            </p>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              <strong>WCAG 2.1 Level AA Conformance Commitment: </strong>
              This portal is built to ensure equal digital access for MSME owners, students, and citizens with diverse abilities:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Color Contrast:</strong> High-contrast navy (`#1E2A5E`), deep ink (`#10182B`), and warm brass accents pass WCAG AA contrast criteria on light paper backgrounds.</li>
              <li><strong>Keyboard Navigation:</strong> All interactive buttons, search fields, and citation badges feature visible keyboard focus rings.</li>
              <li><strong>Screen Reader Labels:</strong> All icons and assistive buttons contain descriptive <code>aria-label</code> tags.</li>
              <li><strong>Reduced Motion:</strong> Respects the system <code>prefers-reduced-motion</code> accessibility preference.</li>
            </ul>
          </div>
        );

      case 'hyperlinking':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              <strong>1. External Links: </strong>
              Links from this application to official portals (such as <em>bis.gov.in</em> or <em>manakonline.in</em>) are provided solely for user convenience. BIS AI Assistant is not responsible for the contents or availability of external destinations.
            </p>
            <p>
              <strong>2. Inbound Linking Policy: </strong>
              Academic institutions, industry associations, and government portals may link to this assistant provided no misrepresentation of official endorsement or legal certification is implied.
            </p>
          </div>
        );

      case 'copyright':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              <strong>Public Regulatory Documents & Gazette Materials: </strong>
              The Indian Standards, Quality Control Orders (QCOs), and Scheme Guidelines referenced in this system are published under the authority of the Bureau of Indian Standards and the Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
            </p>
            <p>
              The code, UI components, and hybrid retrieval architecture created for this prototype submission are open for SIH technical evaluation under the hackathon submission guidelines.
            </p>
          </div>
        );

      case 'sitemap':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 font-sans">
            <div className="space-y-1.5 p-3 bg-paper rounded border border-line">
              <strong className="text-ink block font-serif">Core Modules:</strong>
              <div>• Home / Live RAG Hero (Landing)</div>
              <div>• Assistant Workspace (Streaming Chat)</div>
              <div>• Standards Finder (Product-to-Standard)</div>
              <div>• Certification Schemes (I, II, IV Timeline)</div>
              <div>• Lab Finder (MSME CBTF Provisions)</div>
            </div>
            <div className="space-y-1.5 p-3 bg-paper rounded border border-line">
              <strong className="text-ink block font-serif">Transparency & Verification:</strong>
              <div>• Consumer Rights & ISI Verification</div>
              <div>• Gold Hallmarking & HUID Guide</div>
              <div>• Live Analytics & Eval Dashboard</div>
              <div>• Document Registry (7 Indexed PDFs)</div>
              <div>• About / How This Works</div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              <strong>Continuous Quality Improvement: </strong>
              Technical judges and domain evaluators can provide feedback directly on each assistant answer using the thumbs-up / thumbs-down buttons in the chat workspace.
            </p>
            <div className="p-3 bg-paper rounded border border-line space-y-1 font-mono text-[11px]">
              <div>• Repository: github.com/harshchavan009/AI-Chatbot</div>
              <div>• Evaluation Set: backend/tests/eval_set.json (20 Cases)</div>
              <div>• Regression Test: python3 scripts/run_eval.py</div>
            </div>
          </div>
        );

      case 'grievance':
        return (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-950">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-800" />
                <span>Nodal Officer & Prototype Technical Contact</span>
              </div>
              <p className="mt-1 text-[11.5px]">
                For technical inquiries, audit submissions, or domain evaluation of this SIH submission:
              </p>
            </div>
            <div className="space-y-1 text-xs text-gray-700 font-mono">
              <div><strong>Nodal Lead:</strong> Harsh Chavan (SIH Team Lead)</div>
              <div><strong>Designation:</strong> Full-Stack AI Engineer & System Architect</div>
              <div><strong>Project:</strong> PS-1724 BIS Intelligent Assistant</div>
              <div><strong>Official Address:</strong> Bureau of Indian Standards, Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002</div>
              <div><strong>Response SLA:</strong> Under 24 hours during evaluation window</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      terms: 'Terms of Use & Prototype Disclaimer',
      privacy: 'Privacy Policy & Data Handling',
      accessibility: 'Accessibility Statement (WCAG AA)',
      hyperlinking: 'Hyperlinking & Citation Policy',
      copyright: 'Copyright & Regulatory Provenance',
      sitemap: 'Interactive Prototype Sitemap',
      feedback: 'Feedback & Evaluation Submission',
      grievance: 'Grievance Officer & Institutional Contact'
    };
    return titles[activeLegalModal] || 'Regulatory Policy';
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="bg-white rounded-lg border border-line max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-indigo-deep text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-brass flex-shrink-0" />
            <h3 id="legal-modal-title" className="text-sm font-semibold tracking-wide font-serif">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {renderContent()}
        </div>

        {/* Modal Footer */}
        <div className="bg-paper border-t border-line px-6 py-3 flex justify-between items-center text-xs">
          <span className="text-gray-500 text-[11px] font-mono">SIH 2026 Institutional Trust Layer</span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brass"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
