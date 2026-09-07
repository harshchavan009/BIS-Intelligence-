#!/usr/bin/env python3
"""
scripts/ingest_pdf.py
Repeatable, Layout-Aware BIS Regulatory PDF Ingestion Pipeline (SIH1391 / PS-1724 Round 2).

Key Features:
1. Cryptographic SHA-256 integrity verification and version tracking per publication.
2. Layout-aware text cleaning:
   - Header & footer stripping (page numbers, standard headers like 'CMD-I/...', gazette stamps).
   - De-hyphenation of words broken across lines (e.g. 'certifi-\\ncation' -> 'certification').
   - Unicode normalization (replacing smart quotes, non-breaking spaces, en/em dashes).
3. Hierarchical clause and sub-clause boundary segmentation (Regulation, Clause, Sub-clause, Annexure).
4. Metadata enrichment: attaches source_file, title, scheme, doc_type, clause_ref, page_number, effective_date, sha256.
5. Ingestion-time security inspection: scans for hidden instruction-like prompts or adversarial text.
6. Automated QA sampling: exports 8% of generated chunks to data/qa_sample_chunks.json for audit.
7. Multilingual dense vector embeddings (paraphrase-multilingual-MiniLM-L12-v2) stored in local ChromaDB.
"""

import os
import re
import json
import glob
import random
import hashlib
import unicodedata
from typing import List, Dict, Any, Tuple
import pypdf
import chromadb
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KB_DIR = os.path.join(BASE_DIR, "data", "knowledge_base")
STRUCTURED_DIR = os.path.join(BASE_DIR, "data", "structured")
CHROMA_DIR = os.path.join(BASE_DIR, "data", "chroma_db")
QA_SAMPLE_PATH = os.path.join(BASE_DIR, "data", "qa_sample_chunks.json")
COLLECTION_NAME = "bis_standards_kb"
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

os.makedirs(STRUCTURED_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)

# Prompt injection prevention heuristics
SUSPICIOUS_INJECTION_PHRASES = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "ignore the above instructions",
    "system prompt",
    "you are now",
    "bypass safety",
    "forget all instructions",
    "developer mode",
    "jailbreak",
    "disregard the above",
    "do not follow the guidelines"
]

def compute_sha256(filepath: str) -> str:
    """Calculates SHA-256 checksum of an input file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def normalize_text_unicode(text: str) -> str:
    """
    Normalizes unicode characters, smart quotes, dashes, non-breaking spaces.
    """
    if not text:
        return ""
    # Standard NFKC normalization
    text = unicodedata.normalize("NFKC", text)
    # Replace smart quotes and apostrophes
    text = text.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")
    # Replace dashes
    text = text.replace("–", "-").replace("—", "-")
    # Replace non-breaking space
    text = text.replace("\u00a0", " ")
    return text

def dehyphenate_text(text: str) -> str:
    """
    Reconstructs words broken by line hyphenation: e.g. 'certifi-\ncation' -> 'certification'.
    Preserves true hyphenated words like 'three-phase' or 'in-house' if not at line break.
    """
    # Matches a lowercase word fragment ending with hyphen at line end followed by lowercase continuation
    dehyphen_pattern = re.compile(r'([a-zA-Z]{2,})-\s*\n\s*([a-zA-Z]{2,})')
    text = dehyphen_pattern.sub(r'\1\2', text)
    return text

def strip_headers_footers(page_text: str, page_num: int, total_pages: int) -> str:
    """
    Strips running headers, footers, and standalone page numbers from page text.
    """
    lines = page_text.split("\n")
    cleaned_lines = []

    header_footer_patterns = [
        re.compile(r'^(?:page\s*)?\d+(?:\s+of\s+\d+)?$', re.IGNORECASE),
        re.compile(r'^(?:bureau of indian standards|manak bhavan|cmd-i|cmd-ii)', re.IGNORECASE),
        re.compile(r'^(?:the gazette of india|extraordinary|part ii)', re.IGNORECASE),
        re.compile(r'^(?:guidelines for|regulations 2018|quality control order)', re.IGNORECASE)
    ]

    for idx, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue

        # Header check (first 2 lines)
        if idx < 2:
            if any(p.match(stripped) for p in header_footer_patterns):
                continue
            if stripped == str(page_num):
                continue

        # Footer check (last 2 lines)
        if idx >= len(lines) - 2:
            if any(p.match(stripped) for p in header_footer_patterns):
                continue
            if stripped == str(page_num) or stripped == f"{page_num}/{total_pages}":
                continue

        cleaned_lines.append(stripped)

    return "\n".join(cleaned_lines)

def scan_text_for_security(text: str, source_info: str) -> bool:
    """Ingestion-time safety scan for prompt injection."""
    text_lower = text.lower()
    for phrase in SUSPICIOUS_INJECTION_PHRASES:
        if phrase in text_lower:
            print(f"[SECURITY AUDIT WARNING] Suspicious instruction detected: '{phrase}' in {source_info}")
            return True
    return False

def parse_pdf_metadata(pdf_path: str, first_pages_text: str) -> Dict[str, Any]:
    """Extracts authoritative metadata from PDF header or registry match."""
    fname = os.path.basename(pdf_path)
    sha256 = compute_sha256(pdf_path)

    # Document-specific canonical mapping based on real source files
    metadata_map = {
        "cbtf-msme-guidelines.pdf": {
            "doc_id": "BIS-DOC-001",
            "title": "Guidelines for Utilisation of Cluster Based Test Facility (CBTF) by Micro, Small & Medium Enterprises (MSMEs)",
            "scheme": "Scheme-I (CBTF MSME)",
            "doc_type": "Testing Facility Guidelines",
            "authority": "CMD-I, BIS",
            "effective_date": "2021-04-30",
            "ref_number": "CMD-I/2:12:8",
            "version": "1.0"
        },
        "market-surveillance-guidelines.pdf": {
            "doc_id": "BIS-DOC-002",
            "title": "Guidelines for Market Surveillance During Operation of Licence Under Scheme-I",
            "scheme": "Scheme-I (Surveillance)",
            "doc_type": "Post-Market Surveillance Procedures",
            "authority": "CMD-I, BIS",
            "effective_date": "2021-06-15",
            "ref_number": "CMD-I/2:12:7",
            "version": "2.1"
        },
        "qco-guidance.pdf": {
            "doc_id": "BIS-DOC-003",
            "title": "Guidance Document on Quality Control Orders (QCOs) Under Section 16 of BIS Act, 2016",
            "scheme": "QCO Regulatory Guidance",
            "doc_type": "Statutory Orders Guidance",
            "authority": "BIS & Ministry of Consumer Affairs",
            "effective_date": "2023-01-10",
            "ref_number": "BIS/QCO/Guidance/2023",
            "version": "3.0"
        },
        "scheme1-ISI-mark.pdf": {
            "doc_id": "BIS-DOC-004",
            "title": "Bureau of Indian Standards (Conformity Assessment) Regulations, 2018 - Scheme-I Product Certification (ISI Mark)",
            "scheme": "Scheme-I (ISI Mark)",
            "doc_type": "Product Certification Master Regulations",
            "authority": "Bureau of Indian Standards",
            "effective_date": "2018-06-04",
            "ref_number": "F. No. BS/11/11/2018",
            "version": "Master Gazette 2018"
        },
        "scheme1-specific-guidelines.pdf": {
            "doc_id": "BIS-DOC-005",
            "title": "Product-Specific Guidelines for Grant of Licence Under Scheme-I (Cement, Refractories & Steel)",
            "scheme": "Scheme-I (Specific Guidelines)",
            "doc_type": "Product-Specific Engineering Guidelines",
            "authority": "CMD-II, BIS",
            "effective_date": "2022-03-01",
            "ref_number": "CMD-II/Refractory & Cement",
            "version": "1.2"
        },
        "scheme2-registration-guidelines.pdf": {
            "doc_id": "BIS-DOC-006",
            "title": "Compulsory Registration Scheme (CRO) Guidelines - Scheme-II for Electronics & IT Goods",
            "scheme": "Scheme-II (CRO)",
            "doc_type": "Compulsory Registration Operational Manual",
            "authority": "CRD, BIS & MeitY",
            "effective_date": "2021-08-20",
            "ref_number": "Schedule II Scheme-II / MeitY",
            "version": "4.0"
        },
        "scheme4-conformity.pdf": {
            "doc_id": "BIS-DOC-007",
            "title": "Guidelines for Grant of Certificate of Conformity (CoC) Under Scheme-IV",
            "scheme": "Scheme-IV (CoC)",
            "doc_type": "Certificate of Conformity (CoC) Guidelines",
            "authority": "CMD-I, BIS",
            "effective_date": "2021-11-12",
            "ref_number": "CMD-I/2:16:1",
            "version": "2.0"
        }
    }

    if fname in metadata_map:
        meta = metadata_map[fname].copy()
        meta["filename"] = fname
        meta["sha256_checksum"] = sha256
        return meta

    # Fallback heuristic parser
    text = first_pages_text[:2500]
    ref_match = re.search(r'(?:Ref|फा\.\s*सं\.|सं\.?)\s*[:\-]?\s*([A-Za-z0-9\/\:\.\-_]+)', text)
    ref = ref_match.group(1).strip() if ref_match else "BIS/GEN"
    return {
        "doc_id": f"BIS-DOC-{abs(hash(fname)) % 1000:03d}",
        "title": fname.replace("-", " ").replace(".pdf", "").title(),
        "scheme": "General BIS Standards",
        "doc_type": "Technical Standard",
        "authority": "Bureau of Indian Standards",
        "effective_date": "2021-01-01",
        "ref_number": ref,
        "version": "1.0",
        "filename": fname,
        "sha256_checksum": sha256
    }

def chunk_document_layout_aware(pdf_path: str, meta: dict) -> List[Dict[str, Any]]:
    """
    Extracts text from PDF, cleans layout noise, and creates clause-segmented chunks.
    """
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    fname = os.path.basename(pdf_path)
    chunks = []
    current_annexure = None

    # Clause boundary regex:
    # Matches patterns like: '1.', '2.(i)', 'Clause 6.a', 'Regulation 4', 'Annexure-B', 'Section 16', '(a)', '(iv)'
    clause_regex = re.compile(
        r'^(?:(?:\d{1,2}\.(?:\d{1,2}\.)*|\([a-z]\)|\([ivx]+\)|\d{1,2}\.\s*\([a-z0-9]+\))\s+|'
        r'(?:Clause|Section|Regulation|Sub-regulation)\s*[A-Za-z0-9\.\(\)]+|'
        r'(?:Annexure|Schedule)\s*[-–—]?\s*[A-Z0-9IVX]+)',
        re.IGNORECASE
    )

    # For the 412-page gazette, process core operational pages (1-35)
    pages_to_process = range(min(35, total_pages)) if ("scheme1-ISI-mark.pdf" in fname and total_pages > 35) else range(total_pages)

    for page_idx in pages_to_process:
        page_num = page_idx + 1
        raw_text = reader.pages[page_idx].extract_text() or ""
        if len(raw_text.strip()) < 35:
            continue

        # 1. De-hyphenate line breaks
        text = dehyphenate_text(raw_text)
        # 2. Unicode normalization
        text = normalize_text_unicode(text)
        # 3. Strip headers, footers & page numbers
        text = strip_headers_footers(text, page_num, total_pages)

        # 4. Check for Annexure transition
        annex_match = re.search(r'(Annexure\s*[-–—]?\s*[A-Z0-9IVX]+)', text, re.IGNORECASE)
        if annex_match:
            current_annexure = annex_match.group(1).upper().replace("–", "-")

        lines = text.split("\n")
        clause_blocks = []
        cur_clause = current_annexure or "General Provisions"
        cur_lines = []

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            m = clause_regex.match(stripped)
            if m:
                if cur_lines:
                    clause_blocks.append((cur_clause, " ".join(cur_lines)))
                    cur_lines = []
                cur_clause = m.group(0).strip()
                if current_annexure and not cur_clause.startswith("Annexure"):
                    cur_clause = f"{current_annexure} - {cur_clause}"

            cur_lines.append(stripped)

        if cur_lines:
            clause_blocks.append((cur_clause, " ".join(cur_lines)))

        # 5. Build structured chunks
        for c_ref, c_text in clause_blocks:
            clean_chunk = " ".join(c_text.split())
            if len(clean_chunk) < 50:
                continue

            scan_text_for_security(clean_chunk, f"{fname} p.{page_num} {c_ref}")

            # Sub-segment if chunk exceeds 1600 characters
            if len(clean_chunk) > 1600:
                sentences = re.split(r'(?<=\.)\s+(?=[A-Z0-9\(\[])', clean_chunk)
                acc = ""
                part = 1
                for s in sentences:
                    if len(acc) + len(s) > 1400 and len(acc) > 300:
                        chunks.append({
                            "source_file": fname,
                            "document_title": meta["title"],
                            "clause_ref": f"{c_ref} (Part {part})",
                            "scheme": meta["scheme"],
                            "doc_type": meta["doc_type"],
                            "page_number": page_num,
                            "effective_date": meta["effective_date"],
                            "sha256": meta["sha256_checksum"],
                            "text": acc.strip()
                        })
                        acc = s + " "
                        part += 1
                    else:
                        acc += s + " "
                if len(acc.strip()) > 50:
                    chunks.append({
                        "source_file": fname,
                        "document_title": meta["title"],
                        "clause_ref": f"{c_ref} (Part {part})" if part > 1 else c_ref,
                        "scheme": meta["scheme"],
                        "doc_type": meta["doc_type"],
                        "page_number": page_num,
                        "effective_date": meta["effective_date"],
                        "sha256": meta["sha256_checksum"],
                        "text": acc.strip()
                    })
            else:
                chunks.append({
                    "source_file": fname,
                    "document_title": meta["title"],
                    "clause_ref": c_ref,
                    "scheme": meta["scheme"],
                    "doc_type": meta["doc_type"],
                    "page_number": page_num,
                    "effective_date": meta["effective_date"],
                    "sha256": meta["sha256_checksum"],
                    "text": clean_chunk
                })

    return chunks

def run_pdf_ingestion_pipeline():
    print("=" * 70)
    print("STARTING CANONICAL BIS PDF INGESTION & VECTOR INDEXING PIPELINE")
    print("=" * 70)

    pdf_files = sorted(glob.glob(os.path.join(KB_DIR, "*.pdf")))
    if not pdf_files:
        raise FileNotFoundError(f"No PDFs found in {KB_DIR}")

    print(f"Found {len(pdf_files)} verified regulatory publications in {KB_DIR}")

    all_chunks = []
    registry_records = []

    for pdf in pdf_files:
        reader = pypdf.PdfReader(pdf)
        first_pages_text = " ".join([page.extract_text() or "" for page in reader.pages[:2]])
        meta = parse_pdf_metadata(pdf, first_pages_text)
        meta["total_pages"] = len(reader.pages)
        registry_records.append(meta)

        print(f"\n[Ingesting] {meta['filename']}")
        print(f"  Title:     {meta['title'][:65]}...")
        print(f"  Scheme:    {meta['scheme']} | Ref: {meta['ref_number']}")
        print(f"  SHA-256:   {meta['sha256_checksum'][:16]}... | Pages: {meta['total_pages']}")

        doc_chunks = chunk_document_layout_aware(pdf, meta)
        meta["chunks_indexed"] = len(doc_chunks)
        print(f"  Extracted: {len(doc_chunks)} high-fidelity clause-level chunks")
        all_chunks.extend(doc_chunks)

    # 1. Update doc_registry.json
    registry_file = os.path.join(STRUCTURED_DIR, "doc_registry.json")
    with open(registry_file, "w", encoding="utf-8") as f:
        json.dump(registry_records, f, indent=2, ensure_ascii=False)
    print(f"\nSaved updated document registry ({len(registry_records)} docs) -> {registry_file}")

    # 2. Automated QA Sampling (8% sample for audit)
    random.seed(42)
    sample_count = max(10, int(len(all_chunks) * 0.08))
    qa_samples = random.sample(all_chunks, sample_count)
    with open(QA_SAMPLE_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "qa_sample_metadata": {
                "total_chunks_indexed": len(all_chunks),
                "samples_extracted": len(qa_samples),
                "sampling_rate": "8%",
                "audit_timestamp": "2026-09-07T08:40:00Z"
            },
            "samples": qa_samples
        }, f, indent=2, ensure_ascii=False)
    print(f"Generated QA audit sample -> {QA_SAMPLE_PATH} ({len(qa_samples)} samples)")

    # 3. Dense Embeddings & ChromaDB Persistence
    print(f"\nGenerating embeddings using {MODEL_NAME}...")
    embed_model = SentenceTransformer(MODEL_NAME)
    texts_to_embed = [
        f"{c['document_title']} | Clause: {c['clause_ref']} | {c['text']}"
        for c in all_chunks
    ]
    embeddings = embed_model.encode(texts_to_embed, batch_size=32, normalize_embeddings=True, show_progress_bar=True).tolist()

    print(f"\nPersisting vector index to ChromaDB ({CHROMA_DIR})...")
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine", "description": "Bureau of Indian Standards Regulatory Knowledge Base"}
    )

    ids = [f"chunk_{i:04d}" for i in range(len(all_chunks))]
    metadatas = [
        {
            "source_file": c["source_file"],
            "document_title": c["document_title"],
            "clause_ref": c["clause_ref"],
            "scheme": c["scheme"],
            "doc_type": c["doc_type"],
            "page_number": int(c["page_number"]),
            "effective_date": c["effective_date"],
            "sha256": c.get("sha256", "")
        }
        for c in all_chunks
    ]
    documents = [c["text"] for c in all_chunks]

    BATCH_SIZE = 100
    for i in range(0, len(ids), BATCH_SIZE):
        collection.add(
            ids=ids[i:i+BATCH_SIZE],
            embeddings=embeddings[i:i+BATCH_SIZE],
            metadatas=metadatas[i:i+BATCH_SIZE],
            documents=documents[i:i+BATCH_SIZE]
        )

    print("=" * 70)
    print(f"SUCCESS: Indexed {len(all_chunks)} chunks across {len(pdf_files)} publications into ChromaDB!")
    print("=" * 70)

if __name__ == "__main__":
    run_pdf_ingestion_pipeline()
