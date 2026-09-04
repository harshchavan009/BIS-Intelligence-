# Production Roadmap: Bureau of Indian Standards (BIS) AI Intelligent Assistant
## Phase 2 — Path to Nationwide Institutional Production

This document outlines the institutional roadmap for transitioning the **BIS AI Intelligent Assistant (SIH 2026, PS-1724)** from a verified pilot prototype into a production-grade, sovereign AI service deployed across the Bureau of Indian Standards and the Ministry of Consumer Affairs, Food & Public Distribution.

---

### 1. Data Pipeline: Continuous Regulatory Ingestion & Gazette Feeds
*Moving from static pilot PDF snapshots to an automated, real-time national regulatory synchronization pipeline.*

- **Gazette RSS & Webhook Listeners:** Integrate automated ingest scrapers with the *egazette.gov.in* RSS feed and BIS Quality Control Orders (QCO) notification portal to ingest new statutory orders within 15 minutes of publication.
- **Automated Clause-Level Segmentation:** Implement an automated layout-aware parsing pipeline using PyMuPDF and OCR for scanned Hindi/English gazettes, extracting tables, schedules, and fee charts into structured metadata without human intervention.
- **Incremental ChromaDB Indexing:** Automate vector embeddings update without downtime, applying zero-downtime blue/green collection swaps in ChromaDB/Milvus.
- **Deprecation & Superseded Standards Tracker:** Establish standard lifecycle tracking that automatically flags superseded Indian Standards (e.g., transitioning from *IS 269: 1989* to *IS 269: 2015*), ensuring the assistant alerts users to withdrawal dates and transition grace periods.

---

### 2. Live Registry Integrations
*Replacing local illustrative demo seed sets with authenticated, real-time government registry integrations.*

- **Manakonline Portal License Verification (Scheme-I & Scheme-IV):**
  - Secure integration with the Central Marks Department database via authenticated REST/SOAP APIs.
  - Verification of CM/L license numbers returning real-time status: *Operative, Suspended, Expired, Under Renewal, or Cancelled*.
  - Live retrieval of manufacturer factory address, brand endorsements, valid variety scopes, and operative dates.
- **BIS-CARE Mobile / Hallmarking HUID Registry:**
  - Direct read-only connection to the National Hallmarking HUID central database.
  - Instant validation of 6-digit laser-engraved alphanumeric codes: assaying center details, purity karatage (22K916 / 18K750 / 14K585), article weight, and jeweller registration number.
- **National Laboratory Accreditation Registry (LIMS):**
  - Live lookup against the Central Laboratory Management Information System (CLIMS) to identify recognized testing facilities geographically closest to an MSME manufacturer.

---

### 3. Compliance, Security Certifications & Sovereign Infrastructure
*Ensuring full alignment with Government of India digital standards, CERT-In cybersecurity baseline, and sovereign hosting.*

- **Security Certification (Formal CERT-In Empanelled Audit):**
  - **Mandatory Pre-Launch Audit:** Engaging a CERT-In empanelled cybersecurity auditing agency to conduct a formal Vulnerability Assessment and Penetration Testing (VAPT) and source code security review prior to any authorized public launch.
  - **Compliance Certificate:** Securing the official STQC / CERT-In compliance certificate confirming zero High/Critical vulnerabilities across APIs, RAG pipelines, and web interfaces.
  - **Periodic Re-Audit Cadence:** Mandated bi-annual security reviews or immediate re-certification following major architectural/pipeline releases.
- **Sovereign Cloud & Network Infrastructure:**
  - **Empanelled Government Cloud Hosting:** Migration from prototype containers to MeitY-empanelled sovereign infrastructure (NIC National Data Centres / MeghRaj Government Cloud) ensuring strict 100% domestic data residency within Indian borders.
  - **Enterprise Web Application Firewall (WAF) & DDoS Protection:** Deployment of network-layer WAF and multi-tiered DDoS mitigation through NIC/CERT-In infrastructure to shield against distributed botnets and layer-7 application attacks.
  - **Official `.gov.in` Domain Governance:** Formal domain allocation and DNSSEC registration under `bis.gov.in` administered by ERNET India / National Informatics Centre (NIC), with strict CAA and DMARC enforcement.
- **GIGW 3.0 Conformance (Guidelines for Indian Government Websites):**
  - Full adherence to GIGW 3.0 standards for public service portals, including bilingual parity, keyboard-only accessibility, screen reader optimization (NVDA, JAWS), and mobile responsive design.
- **Digital Personal Data Protection (DPDP) Act 2023 Review:**
  - Strict adherence to data minimization principles; no citizen PII stored.
  - End-to-end encrypted audit logging for grievance tracking and transparency reporting.

---

### 4. Trust Layer & Human-in-the-Loop Governance
*Eliminating AI hallucinations and establishing institutional accountability for critical regulatory answers.*

- **"BIS-Verified" vs. "AI-Synthesized" Answer Tiers:**
  - Two distinct visual badge tiers on every answer:
    - 🛡️ **BIS-Verified Sovereign Answer:** Deterministic, legally binding text pre-approved by the Central Marks Department legal cell for frequent regulatory inquiries.
    - 🤖 **AI-Synthesized Assistive Guidance:** Dynamic answers synthesized from indexed clauses with inline clickable document links and clear non-binding legal disclaimers.
- **Domain Expert Review Queue (Central Marks Dept. Portal):**
  - Internal dashboard for BIS technical officers to review queries flagged with negative feedback or low retrieval confidence scores.
  - Ability for authorized BIS domain experts to approve corrected responses that instantly seed the high-confidence cache.
- **Automated Anti-Hallucination Guardrails:**
  - Secondary verification pass on all synthesized text ensuring 100% of numeric thresholds, test fees, and penalty references match indexed source chunks word-for-word before rendering.

---

### 5. Multilingual Expansion: 22 Official Scheduled Languages
*Empowering MSMEs, rural artisans, and consumers across every state in their mother tongue.*

- **Integration with Digital India Bhashini Mission:**
  - Connect with Government of India's *Bhashini AI* speech-to-text, machine translation, and text-to-speech APIs.
- **Phase-2 Language Rollout Schedule:**
  - **Wave 1 (High Manufacturing Density):** Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali.
  - **Wave 2 (Pan-India Coverage):** Odia, Punjabi, Malayalam, Assamese, Urdu.
  - **Wave 3:** Remaining 8 Eighth-Schedule Indian languages.
- **Human-Reviewed Technical Glossaries:**
  - Standardized bilingual lexicons for legal and engineering terminology (e.g., *Conformity Assessment, Tensile Strength, Quenching, Assaying*) to avoid confusing colloquial translations.
- **Voice-First Mobile Interface:**
  - Speech query and audio readout for small workshop owners and consumers verifying marks at retail counters.

---

### 6. Operations, Scale & Continuous Regression Assurance
*Enterprise reliability, disaster recovery, and automated continuous quality verification.*

- **Automated CI/CD Regression on `eval_set.json`:**
  - Every pipeline update, chunking modification, or prompt change automatically triggers `scripts/run_eval.py` in GitHub Actions.
  - Hard failure threshold: Any build dropping below 95.0% Groundedness Score on the gold-standard test set is blocked from deployment.
- **High-Concurrency Load Testing:**
  - Stress testing up to 10,000 concurrent citizen queries/second utilizing FastAPI async workers, Redis vector caching, and load-balanced vector replicas.
- **Business Continuity & Disaster Recovery (BCP / DR):**
  - Active-passive geo-redundancy across two Indian data centers (e.g., Delhi NIC and Hyderabad Cloud Zone) with automated failover under 60 seconds.
- **Comprehensive Prometheus / Grafana Observability:**
  - Live dashboards tracking retrieval latency, cache hit ratios, token consumption, feedback sentiment, and query volume by standard category.
