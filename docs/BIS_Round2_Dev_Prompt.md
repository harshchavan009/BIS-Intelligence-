# ROUND 2 PROMPT — paste this to your dev / AI coding agent (Claude Code, Cursor, etc.)

```
You are working on "BIS AI Assistant" — a Smart India Hackathon 2026 prototype
(Problem Statement SIH1391 / PS-1724) for the Bureau of Indian Standards. It's
a RAG-based AI assistant over indexed BIS regulatory PDFs, built with a
Next.js/React-style frontend, a vector store (ChromaDB), and an LLM synthesis
layer. Round 1 (critical bugs, visual regressions, security issues) is
already fixed. This round is about retrieval quality, data pipeline
correctness, and platform maturity — the things a technical judge will
specifically try to break.

Two reference files are provided alongside this prompt:
- `standards_master.csv` — cleaned IS-standard-to-QCO mapping (8 example rows,
  cement category only)
- `knowledge_base_seed.json` — schemes, glossary, document registry, FAQ, and
  branch office data, normalized into JSON

Both have a documented `known_gaps` / gap list of rows that are incomplete
because they were reconstructed from screenshots, not source PDFs. Your first
job is to close those gaps against the REAL source PDFs, then use both files
as the canonical schema going forward — don't invent a different shape for
new data.

Work through the sections below in order. After each numbered item, report
what you changed/built and how you verified it (tests, screenshots, or
sample query/response pairs).

================================================================
SECTION 1 — DATA CLEANING & CANONICAL DATASET
================================================================

1.1 Re-extract and reconcile against real source PDFs
   - For every row marked "NOT CAPTURED" or with a null field in
     `knowledge_base_seed.json` (2 missing document_registry rows, 9 missing
     FAQ answers, Scheme-IV process step 4+, 2 missing branch offices), open
     the actual source PDF and fill in the correct value. Do not guess or
     paraphrase — copy the authoritative text/number exactly as published.
   - For `standards_master.csv`, extend from 8 rows (cement only) to cover
     every standard in every category your UI already advertises as a filter
     tab: Cement & Building Materials, Electronics & IT Goods, Steel &
     Metallurgy, Electrical & Lighting, Household Appliances. If the
     homepage/UI claims "40+ standards across 7 documents," the dataset must
     actually contain 40+ rows before that copy ships.

1.2 Build a repeatable cleaning script (not a one-off)
   Implement a pipeline script (Python, e.g. `scripts/ingest_pdf.py`) that
   takes a raw PDF and produces canonical rows in the standards_master.csv /
   knowledge_base_seed.json schema. It must:
   - Extract text with a layout-aware parser (pdfplumber or PyMuPDF), not a
     naive `pdftotext` dump.
   - Strip repeated headers/footers/page numbers.
   - De-hyphenate line-wrapped words and normalize Unicode (smart quotes,
     non-breaking spaces, multiple whitespace).
   - OCR fallback (Tesseract) for scanned/image-only pages, flagging any page
     below a confidence threshold for manual review instead of silently
     indexing garbled text.
   - Deduplicate near-identical clauses that appear across multiple guideline
     PDFs.
   - Segment text by clause/section number (e.g. "6.a", "2.(i)(a)") — never
     by arbitrary character count — and tag each segment with
     `is_number` / `scheme_ref` / `section_ref` / `notification_ref` /
     `category` metadata via regex + LLM-assisted extraction.
   - Emit a QA sample (5-10% of chunks) for manual review before the chunks
     are marked as indexed.

1.3 Versioning
   - Add `doc_version`, `source_url`, `sha256_checksum`, and `superseded_by`
     fields to the document_registry schema so regulation amendments over
     time are tracked, not silently overwritten.

================================================================
SECTION 2 — RETRIEVAL & SYNTHESIS QUALITY
================================================================

2.1 Hybrid retrieval
   - Add a BM25/keyword index alongside the existing ChromaDB vector index.
   - Merge results with reciprocal rank fusion, then rerank the top-k
     candidates with a cross-encoder before passing to the LLM.
   - Rationale: dense embeddings under-retrieve exact IS numbers, clause
     numbers, and Section references, which are the most legally load-bearing
     tokens in this corpus.

2.2 Category-aware pre-filtering
   - When a query implies a category (e.g. "cement", "gold jewellery"),
     pre-filter the vector search by the `category` metadata field before
     running similarity search, not just after.

2.3 Abstention on out-of-corpus queries
   - Apply a similarity-score floor on retrieval. If nothing clears the
     floor, the assistant must respond with an explicit "this isn't in my
     indexed corpus" message rather than generating a plausible but
     ungrounded answer.
   - Write and pass test cases for at least 5 deliberately out-of-corpus
     queries (e.g. a standard/category you know isn't indexed) confirming
     correct abstention.

2.4 Citation integrity guardrail
   - Post-process every LLM-generated answer: every `[n]` citation marker in
     the output text must map to an actually-retrieved chunk ID from that
     turn. If a citation doesn't match a retrieved chunk, reject and
     regenerate rather than displaying it.
   - Add an automated integrity test that walks every chunk in the vector
     store and confirms its stored `source_doc_id` + `clause_ref` exists in
     the source PDF at the claimed page (catches silent citation drift from
     the ingestion side).

================================================================
SECTION 3 — EVALUATION HARNESS
================================================================

3.1 Expand the gold evaluation set
   - Grow the current 20-case set to 60-100 cases covering every scheme
     (Scheme-I, II, IV, CBTF), every category in standards_master.csv, and
     the FAQ/glossary content.
   - For each case, store: question, expected citation(s), expected
     abstention (yes/no).

3.2 Public, inspectable eval report
   - Build a `/analytics` or `/eval` view (public, NOT auth-gated behind a
     fake login) showing per-case results: retrieved citation vs expected,
     pass/fail, and an aggregate score broken down by category. This
     replaces any hardcoded "20/20 (100%)" stat with something a judge can
     click into and verify live.

3.3 CI integration
   - Run the full eval suite + a citation-integrity check (2.4) on every
     push via CI (GitHub Actions or equivalent). Fail the build if grounding
     accuracy or citation integrity regresses below a set threshold.

================================================================
SECTION 4 — PLATFORM / OPS
================================================================

4.1 Admin ingestion panel
   - Build a simple protected route where a new PDF can be uploaded and its
     ingestion progress (extract → clean → chunk → embed → index) is visible
     in real time. This demonstrates the pipeline is live infrastructure,
     not a one-time offline script.

4.2 Real authentication for gated routes
   - Replace any password-manager-triggering login field with env-var based
     demo credentials (`EVAL_USER` / `EVAL_PASS`), clearly labeled on-screen
     as a demo login, `autocomplete="off"` set explicitly.

4.3 CI pipeline
   - Lint + type-check + citation-integrity test (2.4) + eval suite (3.3) +
     a Playwright smoke test (home loads, AI Assistant answers a seeded
     question, Standards Finder returns results for "cement") on every push.

4.4 Rate limiting & input sanitization
   - Add basic rate limiting and input sanitization on the chat/query
     endpoint before any public deployment.

4.5 Offline capability
   - Add a PWA manifest + service worker so the "works fully offline" claim
     holds after first load, not just "makes no external API calls."
     Test explicitly with network disabled.

================================================================
SECTION 5 — ACCESSIBILITY & i18n
================================================================

5.1 Automated accessibility scan
   - Run axe-core or Lighthouse against every page. Fix all flagged
     violations. The footer already claims GIGW 3.0 / WCAG 2.1 AA
     compliance — this must be provably true, not aspirational copy.

5.2 Hindi content parity
   - Audit every English string in Glossary, FAQ, and Standards Finder.
     Confirm each has a real Hindi translation, not just the nav/toggle UI.

================================================================
ACCEPTANCE CRITERIA
================================================================
- standards_master.csv contains 40+ rows across all advertised categories,
  each traceable to a real source PDF page/clause
- knowledge_base_seed.json has zero "NOT CAPTURED" / null placeholder fields
- Hybrid retrieval (BM25 + vector + rerank) is live and measurably improves
  exact IS-number/clause lookup vs the vector-only baseline
- At least 5 out-of-corpus test queries correctly trigger abstention instead
  of a fabricated answer
- Every generated citation marker maps to an actually-retrieved chunk (0
  failures on the citation-integrity test)
- /analytics or /eval is public and shows real per-case pass/fail data, not
  a hardcoded percentage
- CI runs lint + type-check + eval suite + citation-integrity + smoke test
  on every push and blocks merge on regression
- App functions correctly with network disabled (offline claim verified)
- axe-core/Lighthouse accessibility scan passes with zero critical/serious
  violations on every page
- Hindi translations are complete on Glossary, FAQ, and Standards Finder,
  not just nav labels

Report back with: (1) updated standards_master.csv / knowledge_base_seed.json
row counts and diffs, (2) eval suite pass rate before/after hybrid retrieval,
(3) screenshots of the new public /analytics view, (4) CI run link showing
all checks passing.
```
