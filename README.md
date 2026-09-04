# Bureau of Indian Standards (BIS) — AI-Powered Intelligent Assistant
### Smart India Hackathon (SIH) Prototype • Problem Statement PS-1724

An authoritative, source-grounded, production-grade intelligence layer for Indian Standards, certification schemes, MSME cluster testing facilities (CBTF), and consumer vigilance. Designed for the Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.

---

## 1. System Architecture

```
                                  ┌──────────────────────────────────────────────┐
                                  │           User / Web Browser Interface       │
                                  │   React 18 + TS + Tailwind ("Verified Standard")│
                                  └──────────────────────┬───────────────────────┘
                                                         │ SSE Streaming / REST
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │               FastAPI Gateway                │
                                  │   CORS · Rate Limiting · Health Readiness   │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │          LangGraph Orchestration Graph       │
                                  │  Intent Router -> Specialized Capability Nodes│
                                  └──┬─────────────┬─────────────┬─────────────┬─┘
                                     │             │             │             │
                ┌────────────────────┘             │             │             └─────────────────────┐
                ▼                                  ▼             ▼                                   ▼
       ┌──────────────────┐               ┌─────────────────┐ ┌────────────────┐            ┌──────────────────┐
       │ Standards Node   │               │ Scheme Node     │ │ Lab (CBTF) Node│            │ Consumer Node    │
       │ Exact / Fuzzy IS │               │ Step Timelines  │ │ MSME Facilities│            │ ISI Authenticity │
       └────────┬─────────┘               └────────┬────────┘ └────────┬───────┘            └────────┬─────────┘
                │                                  │                   │                             │
                └──────────────────────────────────┼───────────────────┴─────────────────────────────┘
                                                   ▼
                                  ┌──────────────────────────────────────────────┐
                                  │             Hybrid Retrieval Engine          │
                                  │ 1. Deterministic IS Table (O(1) Exact/Fuzzy) │
                                  │ 2. Dense Semantic Vector Search (ChromaDB)   │
                                  │ 3. Multilingual Embedding (EN & HI 384-D)    │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │          Dual-Engine LLM Provider Layer      │
                                  │ • Online: Gemini 2.0 Flash / OpenAI / Groq   │
                                  │ • Offline: Deterministic Grounded Engine     │
                                  │ • 100% Offline Demo Cache (15+ Q&A Pairs)    │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │      Groundedness Verification Engine        │
                                  │ Lexical + Semantic Overlap -> Verified Badge │
                                  └──────────────────────────────────────────────┘
```

---

## 2. Feature Spec & Problem Statement Traceability

This table maps every capability mandated by the SIH problem statement directly to the built feature and verification acceptance criteria:

| SIH requirement | Feature you build | Acceptance criteria |
| :--- | :--- | :--- |
| **Answer questions on Indian Standards** | Grounded chat with inline citations | Every factual sentence has a clickable source; unanswerable questions get an honest "not found" |
| **Recommend standards from product description** | Standards Finder (structured lookup + semantic fallback) | Typing "cement bag for construction" returns the correct IS number(s) and QCO name from the actual product table |
| **Guidance on certification schemes** | Scheme Explorer (Scheme I / CBTF / Scheme IV comparison cards) | Shows eligibility, MSME-specific CBTF option, fees/timelines pulled from source docs |
| **Explain certification process** | Step-by-step Process Timeline (uses `/api/schemes/explain`) | Visual, ordered, sourced from the actual clause sequence in `scheme4-conformity.pdf` |
| **Consumer queries** | Consumer mode: "Is this ISI mark genuine?" / "How do I give feedback on a product?" | Surfaces the actual feedback-letter format from the market-surveillance document |
| **Hallmarking guidance** | Hallmarking module, clearly labelled "general guidance" if no hallmarking source doc is indexed yet | Pluggable — adding a hallmarking PDF to `data/knowledge_base/` should light this module up with real citations, no code change |
| **Suggest testing labs** | Lab Finder using the CBTF cluster-facility guidance | Explains CBTF eligibility for MSMEs and how to request BIS verification of a lab |
| **Multilingual** | Language switcher (EN/HI minimum) | Same question in Hindi and English returns consistent, correctly cited answers |

---

## 3. Quickstart & One-Command Run

### Option A: Single Command Local Launcher (Recommended for Live Demo)
Make sure Python 3.10+ and Node.js 18+ are installed, then run:

```bash
./start.sh
```
This automatically verifies the local ChromaDB store, starts the FastAPI backend on `http://127.0.0.1:8000`, and opens the Vite frontend on `http://localhost:3000`.

### Option B: Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend Swagger API: `http://localhost:8000/docs`
- Health Readiness Check: `http://localhost:8000/api/health`

---

## 4. Offline Demo Mode (Judge-Proof Guarantee)

Hackathon Wi-Fi networks are notoriously unpredictable. The prototype is engineered with a **zero-failure offline architecture**:
1. **Local Persistent Vector Store**: ChromaDB runs embedded in `data/chroma_db/` with 325 chunks from 7 official BIS PDFs.
2. **Local Multilingual Embedding**: Embedded via `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` locally cached on disk.
3. **Seeded Offline Q&A Cache**: 15+ comprehensive, verified Q&A pairs covering all 8 capabilities in English and Hindi stored in `data/structured/demo_cache.json` and SQLite.
4. **Deterministic Grounded Fallback**: If external LLM API keys are absent, expired, or network is killed, the assistant automatically falls back to deterministic clause synthesis with full citations and streaming SSE without crashing.

**How to verify offline resilience during judging**:
1. Disconnect your machine from Wi-Fi.
2. Submit queries in English or Hindi (e.g. *"What is the penalty for violating a mandatory QCO?"* or *"सीमेंट के लिए क्या मानक लागू होता है?"*).
3. The assistant will stream the full answer, render the green `Verified Standard` badge, and allow clicking the `[1]` citation chip into the exact clause on the source page.

---

## 5. Knowledge Base Corpus

The RAG index is populated directly from 7 official regulatory documents in `data/knowledge_base/`:
1. `cbtf-msme-guidelines.pdf`: Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs (Ref: `CMD-I/2:12:8`).
2. `market-surveillance-guidelines.pdf`: Post-market surveillance procedures & BIS Care Mobile App reporting (Ref: `CMD-I/2:12:7`).
3. `qco-guidance.pdf`: Guidance Document on Quality Control Orders under Section 16 of the BIS Act, 2016 (Bilingual Hindi/English).
4. `scheme1-ISI-mark.pdf`: BIS (Conformity Assessment) Regulations 2018 Master Gazette Notification.
5. `scheme1-specific-guidelines.pdf`: Product-to-IS mappings and mandatory QCO notifications (Cement, Steel, Cylinders, Electronics, Textiles).
6. `scheme2-registration-guidelines.pdf`: Compulsory Registration Scheme (CRO) product list (IT Goods, Smart Watches, Laptops).
7. `scheme4-conformity.pdf`: Procedural guidelines for grant of Certificate of Conformity (CoC) under Scheme-IV (Ref: `CMD-I/2:16:1`).

---

## 6. Design Identity: "Verified Standard"

This interface rejects generic purple/glassmorphic SaaS templates and adopts an authoritative, calm government standards aesthetic:
- `--ink` (`#10182B`): Primary text and dark surfaces
- `--indigo-deep` (`#1E2A5E`): Header and navigation brand surface
- `--brass` (`#B9862F`): Accent used exclusively for seal motifs, citation chips, and active states
- `--paper` (`#F7F5EF`): Document-textured content surfaces
- `--line` (`#DCD6C6`): Hairline rule dividers
- `--verified-green` (`#2F6B4F`): Reserved exclusively for the grounded verification badge
- **Typography**: Paired serif (`Source Serif 4`) for authoritative headlines with clean grotesk (`Inter`) for crisp data tables and UI.

---

## 7. Automated Evaluation Harness & Groundedness Score

The system includes a reproducible evaluation regression harness (`backend/tests/eval_set.json` & `scripts/run_eval.py`) testing 20 gold-standard queries across all 8 capabilities in English and Hindi:

```bash
python3 scripts/run_eval.py
```

- **Accuracy on internal eval set: 100.0% (20/20 test cases passing)**
- **Target Groundedness Threshold**: >= 90.0%
- **Automated Output**: Persisted to `data/eval_results.json` and fed directly into the live Analytics Dashboard Groundedness Score card with last-run timestamp.

---

## 8. High-Credibility Hardening & Transparency Features

- **Visual PDF Page Highlighting**: Clicking any inline citation badge (`[1]`, `[2]`) in the Assistant or feature cards opens the actual source PDF page rendered in high-resolution with the cited clause/text highlighted in official regulatory yellow.
- **Dynamic Assistant Empty State**: The workspace features a flexible container height that eliminates dead void on first load, rendering an interactive grid of categorized consultation suggestions that collapses into a slim follow-up bar when conversation begins.
- **Explicit Simulated Lookup Badging**: The CM/L License and HUID Verifiers feature persistent `Demo Mode — Simulated Lookup` badges and are constrained to strict demo seed sets. Arbitrary or unknown codes return an honest *"Not found in demo dataset"* rejection notice rather than false verifications.
- **Live Telemetry & Evaluation Dashboard**: Total Consultations and User Ratings are wired directly to SQLite tables (`query_logs` and `feedback`) and increment live.
- **Document Registry**: Dedicated `/registry` route transparently cataloging all 7 indexed publications, chunk counts, governing schemes, and dates.
- **About / How This Works**: Dedicated `/about` view detailing what the assistant is and is not, model specifications, pilot boundaries, and limitations.
- **Institutional Legal Footer**: Persistent navy/brass footer on every page with active modal dialogs for Terms of Use (prototype disclaimer), Privacy Policy, Accessibility Statement (WCAG AA), Hyperlinking Policy, Copyright, Sitemap, Feedback, and Grievance Officer.
- **Security & Per-IP Rate Limiting**: All public endpoints enforce a 20 req/min sliding-window rate limit and input sanitization against XSS and prompt injection.
- **Phase-2 Production Roadmap**: Complete institutional transition plan documented in [`ROADMAP.md`](./ROADMAP.md) covering automated gazette pipelines, live registry APIs, GIGW 3.0, Bhashini multilingual expansion, and STQC security certifications.
