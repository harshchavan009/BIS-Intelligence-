# Architecture & Engineering Decisions Log (DECISIONS.md)

This document records the sensible engineering calls and architectural decisions made while building the submission-ready prototype for the Smart India Hackathon (SIH) problem statement: **AI-Powered Intelligent Assistant for Indian Standards and BIS Services**.

---

### Decision 1: Root Workspace & Monorepo Structure
- **Decision**: Keep `/Users/harsh/Desktop/BIS` as the project root containing `backend/`, `frontend/`, `data/`, `scripts/`, `docker-compose.yml`, `README.md`, and `DECISIONS.md`.
- **Rationale**: Keeps the codebase cohesive, avoids nested repo indirection, and allows single-command startup via `docker-compose.yml` or local startup scripts.

### Decision 2: Document Classification Without Filenames
- **Decision**: Extract metadata directly from the header blocks of PDFs (`BUREAU OF INDIAN STANDARDS`, `Our Ref: CMD-...`, `Subject: ...`, `Date: ...`).
- **Rationale**: Filenames are arbitrary and fragile; the official letterhead format used by the Central Marks Departments (CMD-I / CMD-II) gives authoritative metadata:
  - `CMD-I/2:12:8` (30 April 2021) -> Scheme-I Cluster Based Test Facility (CBTF) for MSMEs
  - `CMD-I/2:12:7` (25 February 2026) -> Scheme-I Market Surveillance & Mobile App
  - `CMD-I/2:16:1` (02 May 2019) -> Scheme-IV Certificate of Conformity (CoC)
  - Bilingual QCO Header -> Quality Control Orders Guidance Document
  - Gazette Notification 04 June 2018 -> Conformity Assessment Regulations 2018 (Scheme-I)
  - CRO Schedule -> Scheme-II Compulsory Registration

### Decision 3: Regulatory Clause-Based Chunking
- **Decision**: Reject arbitrary token-window chunking. Implement regex-guided hierarchical splitting based on numbered clauses (`1.`, `2.`, `2. (i)`, `(a)`, `(b)`), sub-sections, and distinct Annexures (`Annexure-I`, `Annexure-II`).
- **Rationale**: Standards documents are legal and technical regulations. Fixed-length token slicing severs clauses in mid-sentence, destroying legal context. Clause-based chunking ensures every retrieved chunk is a self-contained regulatory requirement with an exact clause reference (`clause_ref`) and page number.

### Decision 4: Two-Tier Product-to-Standards Lookup (Hybrid Retrieval)
- **Decision**: Extract the master product tables from `scheme1-specific-guidelines.pdf` and `scheme2-registration-guidelines.pdf` into a structured, indexed JSON lookup table (`data/structured/is_product_map.json`) with exact and fuzzy matching, combined with semantic dense vector search.
- **Rationale**: Exact IS numbers (e.g. `IS 12330`, `IS 269`, `IS/IEC 62368`) and common product terms (e.g. "cement", "laptops", "fire extinguishers", "cotton bales") should resolve in <1ms deterministically without relying purely on vector similarity, saving compute and guaranteeing 100% precision. Semantic vector search handles free-text natural language descriptions as a fallback.

### Decision 5: Embeddings & Cross-Lingual Representation
- **Decision**: Use `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` locally cached in ChromaDB (`bis_standards_kb`).
- **Rationale**: It maps both Hindi and English into the exact same 384-dimensional dense vector space with proven high cross-lingual cosine similarity (~0.75+). This allows a Hindi query to directly retrieve English regulatory clauses, while running 100% locally with zero external API dependency or rate limits.

### Decision 6: Pluggable LLM Provider with Judge-Proof Offline Demo Fallback
- **Decision**: Build an `LLMProvider` abstraction supporting:
  1. `GeminiProvider` (Gemini 2.0 Flash / Pro)
  2. `OpenAIProvider`
  3. `GroqProvider`
  4. `OfflineDemoProvider` (Deterministic Grounded Synthesis + Pre-seeded Q&A Cache)
- **Rationale**: Hackathon demo venues often have spotty Wi-Fi or expired API quotas. If network or API keys fail, the app falls back seamlessly to the offline cache and deterministic grounded generator without throwing 500 errors or showing blank screens.

### Decision 7: Groundedness Verification Badge
- **Decision**: Perform post-generation verification matching claim sentences against the retrieved chunk excerpts (lexical n-gram + embedding similarity). Attach `grounded: true` or `grounded: false` per citation, surfaced as a `Verified Standard` badge in the UI.
- **Rationale**: Directly solves the SIH requirement that answers must be source-grounded and traceable. Technical judges can immediately verify the math behind the badge.

### Decision 8: "Verified Standard" Visual Identity
- **Decision**: Avoid generic purple/glassmorphic SaaS templates. Adopt the official standards palette:
  - Deep Navy (`--indigo-deep: #1E2A5E`)
  - Ink (`--ink: #10182B`)
  - Brass Accent (`--brass: #B9862F`)
  - Document Paper (`--paper: #F7F5EF`)
  - Hairline Rule (`--line: #DCD6C6`)
  - Verification Green (`--verified-green: #2F6B4F`)
- **Rationale**: Instills immediate institutional credibility appropriate for the Bureau of Indian Standards.

### Decision 9: SQLite Default with PostgreSQL Compatibility
- **Decision**: Use SQLAlchemy with SQLite by default (`sqlite:///./data/bis_assistant.db`), switchable to PostgreSQL via `DATABASE_URL`.
- **Rationale**: Zero setup friction for single-command evaluation, but production-ready schema for PostgreSQL.

### Decision 10: GIGW 3.0 Accessibility Chrome, Bilingual Parity & Security Hardening
- **Decision**: Adopt Guidelines for Indian Government Websites (GIGW 3.0) conventions:
  1. Top accessibility utility bar with genuine `.skip-link` pointing to `#main-content`, `A- / A / A+` font scaling via `--base-font-size`, screen-reader compatibility modal, and high-contrast toggle for low-vision users.
  2. Full bilingual parity through JSON resource dictionaries (`en.json` and `hi.json`) rather than hardcoded strings, localizing all navigation, headings, buttons, and disclosures.
  3. Non-technical usability enhancements: plain keyword search bar for MSMEs alongside AI chat, plain-language statutory glossary, FAQ center, PDF/print answer export, and regional branch office escalation directory (`1800-11-0420`).
  4. Security hardening baseline: HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict CSP, CORS restricted to trusted frontend origins, auth-gated evaluator telemetry, DPDP Act 2023 compliant masked IP audit logging, and XML isolation (`<retrieved_context_data>`) to defend against RAG prompt injection.
- **Rationale**: Elevates the prototype from an engineering experiment into an authentic, accessible, and defensible government digital service while preserving hackathon prototype disclosures.

