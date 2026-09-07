#!/usr/bin/env python3
"""
scripts/ingest_hallmarking.py
High-fidelity Ingestion, Chunking, and Indexing Pipeline for the BIS Hallmarking Reference Corpus.

Documents Covered:
1. "ahc-centres-list.pdf" — 104 Assaying & Hallmarking (A&H) Centres (Central Assistance Scheme at deficient locations)
2. "BIS-recognized-laboratories01.pdf" — 436 GROUP-1 BIS-recognised testing laboratories (as on 24-08-2026)
3. "BIS-recognized-laboratories02.pdf" — 350 GROUP-2 National eminence laboratories utilized by BIS (as on 07-08-2026)
4. "hallmarking-jeweller-guidelines-2024.pdf" — BIS Guidelines (Jan 2024) for Jeweller Registration (clauses 1–9, Annexures A, B, C)

Strict Chunking Rules:
- Tabular documents (1–3): atomic row per chunk, column headers + title prepended, verbatim OSL & names.
- Multi-line Remarks (suspensions/revocations) fully preserved across page breaks.
- Document 4: chunked by clause number (e.g. 4.11, 5.3, 6.2) with clause number and section heading retained.
  Annex A/B/C forms as separate chunks labeled by Annex letter and form Doc ID.
- Attached Metadata: source_doc, doc_type, state, osl_code, clause_number, as_of_date.
"""

import os
import re
import json
import hashlib
import pymupdf
import chromadb
from typing import List, Dict, Any, Tuple
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KB_DIR = os.path.join(BASE_DIR, "data", "knowledge_base")
STRUCTURED_DIR = os.path.join(BASE_DIR, "data", "structured")
CHROMA_DIR = os.path.join(BASE_DIR, "data", "chroma_db")
COLLECTION_NAME = "bis_standards_kb"
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

os.makedirs(STRUCTURED_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)

STATE_MAPPINGS = [
    (r'\b(A[\.,\s]*P|Andhra\s*Pradesh)\b', 'Andhra Pradesh'),
    (r'\b(Rajasthan)\b', 'Rajasthan'),
    (r'\b(U[\.,\s]*P|Uttar\s*Pradesh)\b', 'Uttar Pradesh'),
    (r'\b(Punjab|Pubjab)\b', 'Punjab'),
    (r'\b(Kerala|Kerla)\b', 'Kerala'),
    (r'\b(M[\.,\s]*P|Madhya\s*Pradesh)\b', 'Madhya Pradesh'),
    (r'\b(Karnataka|Karnatka)\b', 'Karnataka'),
    (r'\b(Tamil\s*Nadu|Tamilnadu)\b', 'Tamil Nadu'),
    (r'\b(Maharashtra|Maharastra|Maharashta)\b', 'Maharashtra'),
    (r'\b(Chandigarh)\b', 'Chandigarh'),
    (r'\b(Orissa|Odisha)\b', 'Odisha'),
    (r'\b(Haryana|Harayana)\b', 'Haryana'),
    (r'\b(Gujarat)\b', 'Gujarat'),
    (r'\b(Jharkhand)\b', 'Jharkhand'),
    (r'\b(Goa)\b', 'Goa'),
    (r'\b(Bihar)\b', 'Bihar'),
    (r'\b(J\s*&\s*K|Jammu|Kashmir)\b', 'Jammu & Kashmir'),
    (r'\b(West\s*Bengal|W[\.,\s]*B|Ranaghat|Nadia|Burdwan|Midnapur|Purulia|Tamluk)\b', 'West Bengal'),
    (r'\b(Assam)\b', 'Assam'),
    (r'\b(H[\.,\s]*P|Himachal\s*Pradesh)\b', 'Himachal Pradesh'),
    (r'\b(Telangana|Telengana)\b', 'Telangana'),
    (r'\b(Uttarakhand|Uttrakhand|Dehradun|Haridwar|Roorkee)\b', 'Uttarakhand'),
    (r'\b(Tripura)\b', 'Tripura'),
    (r'\b(Chhattisgarh)\b', 'Chhattisgarh'),
    (r'\b(Delhi|New\s*Delhi)\b', 'Delhi'),
    (r'\b(Andaman\s*(?:and|&)\s*Nicobar)\b', 'Andaman & Nicobar'),
    (r'\b(Meghalaya)\b', 'Meghalaya'),
    (r'\b(Nagaland)\b', 'Nagaland'),
    (r'\b(Sikkim)\b', 'Sikkim'),
    (r'\b(Arunachal\s*Pradesh)\b', 'Arunachal Pradesh'),
    (r'\b(Puducherry)\b', 'Puducherry'),
    (r'\b(Daman)\b', 'Daman')
]

def resolve_state(text: str) -> str:
    """Extracts and normalizes state name from text string."""
    for pattern, canonical_name in STATE_MAPPINGS:
        if re.search(pattern, text, re.IGNORECASE):
            return canonical_name
    return text.strip()

def extract_ahc_centres(pdf_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Parses 'ahc-centres-list.pdf' into atomic row-chunks (104 rows).
    Columns: Sl.No, Location, Centre Name & Address, Central Assistance Amount (Rs).
    """
    doc = pymupdf.open(pdf_path)
    records = []
    chunks = []
    current_record = None

    for page_idx, page in enumerate(doc):
        tables = page.find_tables().tables
        if not tables:
            continue
        for row in tables[0].extract():
            if not row or not any(row):
                continue
            col0 = str(row[0]).strip() if row[0] else ""
            if "sl" in col0.lower() or "location" in str(row[1] or "").lower():
                continue

            sl = col0
            loc = str(row[1]).strip() if len(row) > 1 and row[1] else ""
            name_addr = str(row[2]).strip() if len(row) > 2 and row[2] else ""
            amt = str(row[3]).strip() if len(row) > 3 and row[3] else ""

            if re.match(r'^\d+\.?', sl):
                if current_record:
                    records.append(current_record)
                clean_sl = re.sub(r'[^\d]', '', sl)
                current_record = {
                    "sl_no": clean_sl,
                    "location": " ".join(loc.split()),
                    "name_address": " ".join(name_addr.split()),
                    "amount_rs": " ".join(amt.split()),
                    "page_number": page_idx + 1
                }
            elif current_record:
                if loc:
                    current_record["location"] += " " + " ".join(loc.split())
                if name_addr:
                    current_record["name_address"] += " " + " ".join(name_addr.split())
                if amt:
                    current_record["amount_rs"] += " " + " ".join(amt.split())

    if current_record:
        records.append(current_record)

    doc_title = "Assaying & Hallmarking (A&H) Centres provided assistance Under Central Assistance Scheme of Hallmarking for setting up of A&H centres at deficient location"

    for r in records:
        state = resolve_state(r["location"] + " " + r["name_address"])
        r["state"] = state

        # Atomic Row Chunk Text format
        chunk_text = (
            f"Assaying & Hallmarking (A&H) Centre (Central Assistance at Deficient Locations) — "
            f"Sl.No: {r['sl_no']}, Location: {r['location']}, State: {state}, "
            f"Centre Name & Address: {r['name_address']}, Central Assistance Amount (Rs): {r['amount_rs']}"
        )

        chunk = {
            "id": f"ahc_{int(r['sl_no']):04d}",
            "text": chunk_text,
            "source_doc": "ahc-centres-list.pdf",
            "document_title": doc_title,
            "doc_type": "ahc_centre",
            "state": state,
            "osl_code": "",
            "clause_number": "",
            "as_of_date": "",
            "sl_no": r["sl_no"],
            "page_number": r["page_number"]
        }
        chunks.append(chunk)

    return records, chunks

def extract_lab_group1(pdf_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Parses 'BIS-recognized-laboratories01.pdf' into atomic row-chunks (436 rows).
    Columns: Sl.No, Name of Lab, State, Status (Private/Govt), OSL Code, Recognition Valid Up To, Remarks.
    Preserves multi-line remarks across page continuations.
    """
    doc = pymupdf.open(pdf_path)
    records = []
    chunks = []
    current_record = None

    for page_idx, page in enumerate(doc):
        tables = page.find_tables().tables
        if not tables:
            continue
        for row in tables[0].extract():
            if not row or not any(row):
                continue
            col0 = str(row[0]).strip() if row[0] else ""
            if "sl" in col0.lower() or "name" in str(row[1] or "").lower():
                continue

            sl = col0
            name = str(row[1]).strip() if len(row) > 1 and row[1] else ""
            st = str(row[2]).strip() if len(row) > 2 and row[2] else ""
            status = str(row[3]).strip() if len(row) > 3 and row[3] else ""
            osl = str(row[4]).strip() if len(row) > 4 and row[4] else ""
            valid = str(row[5]).strip() if len(row) > 5 and row[5] else ""
            remarks = str(row[6]).strip() if len(row) > 6 and row[6] else ""

            if re.match(r'^\d+\.?', sl):
                if current_record:
                    records.append(current_record)
                clean_sl = re.sub(r'[^\d]', '', sl)
                current_record = {
                    "sl_no": clean_sl,
                    "name": " ".join(name.split()),
                    "state_raw": " ".join(st.split()),
                    "status": " ".join(status.split()),
                    "osl_code": " ".join(osl.split()),
                    "valid_up_to": " ".join(valid.split()),
                    "remarks": " ".join(remarks.split()),
                    "page_number": page_idx + 1
                }
            elif current_record:
                if remarks:
                    current_record["remarks"] = (current_record["remarks"] + " " + " ".join(remarks.split())).strip()
                if name and not current_record["name"]:
                    current_record["name"] = (current_record["name"] + " " + " ".join(name.split())).strip()
                if st and not current_record["state_raw"]:
                    current_record["state_raw"] = " ".join(st.split())

    if current_record:
        records.append(current_record)

    doc_title = "GROUP-1 LIST OF BIS RECOGNISED LABORATORIES (24-08-2026)"

    for r in records:
        canonical_state = resolve_state(r["state_raw"])
        r["state"] = canonical_state

        rem_display = r["remarks"] if r["remarks"] else "None (Active operative status)"
        chunk_text = (
            f"GROUP-1 BIS Recognised Laboratory — Sl.No: {r['sl_no']}, Name: {r['name']}, "
            f"State: {canonical_state}, Status: {r['status']}, OSL Code: {r['osl_code']}, "
            f"Recognition Valid Up To: {r['valid_up_to']}, Remarks (Suspension/Revocation History): {rem_display}"
        )

        chunk = {
            "id": f"lab_g1_{int(r['sl_no']):04d}",
            "text": chunk_text,
            "source_doc": "BIS-recognized-laboratories01.pdf",
            "document_title": doc_title,
            "doc_type": "lab_group1",
            "state": canonical_state,
            "osl_code": r["osl_code"],
            "clause_number": "",
            "as_of_date": "24-08-2026",
            "sl_no": r["sl_no"],
            "status": r["status"],
            "valid_up_to": r["valid_up_to"],
            "remarks": r["remarks"],
            "page_number": r["page_number"]
        }
        chunks.append(chunk)

    return records, chunks

def extract_lab_group2(pdf_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Parses 'BIS-recognized-laboratories02.pdf' into atomic row-chunks (350 rows).
    Columns: Sl.No, Name of Lab, State, Status (Govt/Pvt), OSL Code.
    """
    doc = pymupdf.open(pdf_path)
    records = []
    chunks = []
    current_record = None

    for page_idx, page in enumerate(doc):
        tables = page.find_tables().tables
        if not tables:
            continue
        for row in tables[0].extract():
            if not row or not any(row):
                continue
            col0 = str(row[0]).strip() if row[0] else ""
            if "sl" in col0.lower() or "name" in str(row[1] or "").lower():
                continue

            sl = col0
            name = str(row[1]).strip() if len(row) > 1 and row[1] else ""
            st = str(row[2]).strip() if len(row) > 2 and row[2] else ""
            status = str(row[3]).strip() if len(row) > 3 and row[3] else ""
            osl = str(row[4]).strip() if len(row) > 4 and row[4] else ""

            if re.match(r'^\d+\.?', sl):
                if current_record:
                    records.append(current_record)
                clean_sl = re.sub(r'[^\d]', '', sl)
                current_record = {
                    "sl_no": clean_sl,
                    "name": " ".join(name.split()),
                    "state_raw": " ".join(st.split()),
                    "status": " ".join(status.split()),
                    "osl_code": " ".join(osl.split()),
                    "page_number": page_idx + 1
                }
            elif current_record:
                if name:
                    current_record["name"] = (current_record["name"] + " " + " ".join(name.split())).strip()
                if st and not current_record["state_raw"]:
                    current_record["state_raw"] = " ".join(st.split())

    if current_record:
        records.append(current_record)

    doc_title = "GROUP-2 LAB OF NATIONAL REPUTE AND EMINENCE, FACILITIES OF WHICH ARE BEING UTILIZED BY BIS (as on 07-08-2026)"

    for r in records:
        canonical_state = resolve_state(r["state_raw"])
        r["state"] = canonical_state

        chunk_text = (
            f"GROUP-2 BIS Utilized Laboratory of National Repute and Eminence — Sl.No: {r['sl_no']}, "
            f"Name: {r['name']}, State: {canonical_state}, Status: {r['status']}, OSL Code: {r['osl_code']}"
        )

        chunk = {
            "id": f"lab_g2_{int(r['sl_no']):04d}",
            "text": chunk_text,
            "source_doc": "BIS-recognized-laboratories02.pdf",
            "document_title": doc_title,
            "doc_type": "lab_group2",
            "state": canonical_state,
            "osl_code": r["osl_code"],
            "clause_number": "",
            "as_of_date": "07-08-2026",
            "sl_no": r["sl_no"],
            "status": r["status"],
            "page_number": r["page_number"]
        }
        chunks.append(chunk)

    return records, chunks

def extract_jeweller_guidelines(pdf_path: str) -> List[Dict[str, Any]]:
    """
    Parses 'hallmarking-jeweller-guidelines-2024.pdf' by numbered clause and Annexure forms.
    """
    doc = pymupdf.open(pdf_path)
    chunks = []

    sections = [
        ("1", "SCOPE AND APPLICABILITY"),
        ("2", "GRANT OF CERTIFICATE"),
        ("3", "DISPLAY REQUIREMENTS IN SALES OUTLET"),
        ("4", "MARKET SURVEILLANCE"),
        ("5", "ACTION ON FAILURE OF MARKET SURVEILLANCE SAMPLES"),
        ("6", "ACTION ON UNFAIR PRACTICES"),
        ("7", "OTHER OBLIGATION TO REGISTERED JEWELLER"),
        ("8", "COMPENSATION FROM JEWELLER IN CASE OF FAILURE OF SAMPLE"),
        ("9", "PROVISION OF APPEAL")
    ]

    doc_title = "Guidelines for Grant, Operation, Surveillance & Cancellation of Certificate of Registration of Jewellers (January 2024)"

    # Process pages 2 through 9 (Clauses)
    pages_text = []
    for p in range(1, 9):
        txt = doc[p].get_text()
        txt = re.sub(r'Page\s+\d+\s+of\s+15', '', txt, flags=re.IGNORECASE)
        pages_text.append((p + 1, txt))

    clause_regex = re.compile(r'^([1-9](?:\.\d+)*)\.?\s+(.*)')
    clause_items = []
    cur_sec = "1 SCOPE AND APPLICABILITY"
    cur_clause = "1"
    cur_lines = []
    cur_page = 2

    def flush_clause(c_num, c_lines, s_heading, page_no):
        txt = " ".join(" ".join(c_lines).split())
        if txt:
            clause_items.append({
                "clause_number": c_num,
                "section_heading": s_heading,
                "text": txt,
                "page_number": page_no
            })

    for p_no, page_str in pages_text:
        lines = page_str.split("\n")
        for line in lines:
            sline = line.strip()
            if not sline:
                continue

            # Section matching
            matched_sec = False
            for s_num, s_title in sections:
                if sline == f"{s_num} {s_title}":
                    if cur_lines:
                        flush_clause(cur_clause, cur_lines, cur_sec, cur_page)
                        cur_lines = []
                    cur_sec = f"{s_num} {s_title}"
                    cur_clause = s_num
                    cur_page = p_no
                    matched_sec = True
                    break
            if matched_sec:
                continue

            m = clause_regex.match(sline)
            if m:
                cand_num = m.group(1)
                if cand_num not in ['2016', '2018', '2021', '2024']:
                    if cur_lines:
                        flush_clause(cur_clause, cur_lines, cur_sec, cur_page)
                        cur_lines = []
                    cur_clause = cand_num
                    cur_page = p_no
                    if m.group(2).strip():
                        cur_lines.append(m.group(2).strip())
                    continue

            cur_lines.append(sline)

    if cur_lines:
        flush_clause(cur_clause, cur_lines, cur_sec, cur_page)

    # Build clause chunks
    for idx, c in enumerate(clause_items):
        chunk_text = (
            f"BIS Guidelines for Jeweller Registration (Jan 2024) — "
            f"Section: {c['section_heading']} — Clause {c['clause_number']}: {c['text']}"
        )
        chunks.append({
            "id": f"jeweller_guide_clause_{idx+1:03d}",
            "text": chunk_text,
            "source_doc": "hallmarking-jeweller-guidelines-2024.pdf",
            "document_title": doc_title,
            "doc_type": "jeweller_guidelines",
            "state": "",
            "osl_code": "",
            "clause_number": c["clause_number"],
            "section_heading": c["section_heading"],
            "as_of_date": "Jan 2024",
            "page_number": c["page_number"]
        })

    # Annexure Form Chunks
    # Annex A (p. 10-11): Doc ID HM/JWLR/F 1.1
    annex_a_raw = " ".join((doc[9].get_text() + "\n" + doc[10].get_text()).split())
    annex_a_clean = re.sub(r'Page\s+\d+\s+of\s+15', '', annex_a_raw)
    chunks.append({
        "id": "jeweller_guide_annex_a",
        "text": (
            "BIS Guidelines for Jeweller Registration (Jan 2024) — ANNEX A (Doc ID: HM/JWLR/F 1.1) — "
            f"CREDIT/DEBIT NOTE FOR PURCHASE OF HALLMARKED SAMPLE: {annex_a_clean}"
        ),
        "source_doc": "hallmarking-jeweller-guidelines-2024.pdf",
        "document_title": doc_title,
        "doc_type": "jeweller_guidelines",
        "state": "",
        "osl_code": "",
        "clause_number": "Annex A (HM/JWLR/F 1.1)",
        "section_heading": "ANNEX A (HM/JWLR/F 1.1) CREDIT/DEBIT NOTE",
        "as_of_date": "Jan 2024",
        "page_number": 10
    })

    # Annex B (p. 12-14): Doc ID HM/JWLR/F 1.2
    annex_b_raw = " ".join((doc[11].get_text() + "\n" + doc[12].get_text() + "\n" + doc[13].get_text()).split())
    annex_b_clean = re.sub(r'Page\s+\d+\s+of\s+15', '', annex_b_raw)
    chunks.append({
        "id": "jeweller_guide_annex_b",
        "text": (
            "BIS Guidelines for Jeweller Registration (Jan 2024) — ANNEX B (Doc ID: HM/JWLR/F 1.2) — "
            f"REPORT OF SURVEILLANCE ON CERTIFIED JEWELLER: {annex_b_clean}"
        ),
        "source_doc": "hallmarking-jeweller-guidelines-2024.pdf",
        "document_title": doc_title,
        "doc_type": "jeweller_guidelines",
        "state": "",
        "osl_code": "",
        "clause_number": "Annex B (HM/JWLR/F 1.2)",
        "section_heading": "ANNEX B (HM/JWLR/F 1.2) SURVEILLANCE REPORT",
        "as_of_date": "Jan 2024",
        "page_number": 12
    })

    # Annex C (p. 15): Doc ID HM/JWLR/F 1.3
    annex_c_raw = " ".join(doc[14].get_text().split())
    annex_c_clean = re.sub(r'Page\s+\d+\s+of\s+15', '', annex_c_raw)
    chunks.append({
        "id": "jeweller_guide_annex_c",
        "text": (
            "BIS Guidelines for Jeweller Registration (Jan 2024) — ANNEX C (Doc ID: HM/JWLR/F 1.3) — "
            f"REQUEST FOR HALLMARKING: {annex_c_clean}"
        ),
        "source_doc": "hallmarking-jeweller-guidelines-2024.pdf",
        "document_title": doc_title,
        "doc_type": "jeweller_guidelines",
        "state": "",
        "osl_code": "",
        "clause_number": "Annex C (HM/JWLR/F 1.3)",
        "section_heading": "ANNEX C (HM/JWLR/F 1.3) REQUEST FOR HALLMARKING",
        "as_of_date": "Jan 2024",
        "page_number": 15
    })

    return chunks

def run_hallmarking_ingestion():
    print("=" * 70)
    print("STARTING BIS HALLMARKING REFERENCE CORPUS INGESTION")
    print("=" * 70)

    # 1. Ingest AHC Centres
    ahc_pdf = os.path.join(KB_DIR, "ahc-centres-list.pdf")
    if not os.path.exists(ahc_pdf):
        raise FileNotFoundError(f"Missing {ahc_pdf}")
    ahc_records, ahc_chunks = extract_ahc_centres(ahc_pdf)
    print(f"-> Extracted {len(ahc_records)} A&H Centres ({len(ahc_chunks)} row chunks)")

    # 2. Ingest Lab Group 1
    lab1_pdf = os.path.join(KB_DIR, "BIS-recognized-laboratories01.pdf")
    if not os.path.exists(lab1_pdf):
        raise FileNotFoundError(f"Missing {lab1_pdf}")
    lab1_records, lab1_chunks = extract_lab_group1(lab1_pdf)
    print(f"-> Extracted {len(lab1_records)} Group-1 BIS Recognised Labs ({len(lab1_chunks)} row chunks)")

    # 3. Ingest Lab Group 2
    lab2_pdf = os.path.join(KB_DIR, "BIS-recognized-laboratories02.pdf")
    if not os.path.exists(lab2_pdf):
        raise FileNotFoundError(f"Missing {lab2_pdf}")
    lab2_records, lab2_chunks = extract_lab_group2(lab2_pdf)
    print(f"-> Extracted {len(lab2_records)} Group-2 National Eminence Labs ({len(lab2_chunks)} row chunks)")

    # 4. Ingest Jeweller Guidelines
    guide_pdf = os.path.join(KB_DIR, "hallmarking-jeweller-guidelines-2024.pdf")
    if not os.path.exists(guide_pdf):
        raise FileNotFoundError(f"Missing {guide_pdf}")
    guide_chunks = extract_jeweller_guidelines(guide_pdf)
    print(f"-> Extracted {len(guide_chunks)} Jeweller Guidelines Chunks (clauses + Annexures A, B, C)")

    all_hallmarking_chunks = ahc_chunks + lab1_chunks + lab2_chunks + guide_chunks
    print(f"\nTotal Hallmarking Chunks Extracted: {len(all_hallmarking_chunks)}")

    # 5. Persist Structured Directories
    # Save AHC Master
    ahc_master_path = os.path.join(STRUCTURED_DIR, "ahc_centres_master.json")
    with open(ahc_master_path, "w", encoding="utf-8") as f:
        json.dump(ahc_records, f, indent=2, ensure_ascii=False)
    print(f"Saved AHC Centres Master -> {ahc_master_path}")

    # Save Labs Master
    combined_labs = []
    for r in lab1_records:
        r_copy = dict(r)
        r_copy["group"] = "GROUP-1"
        r_copy["as_of_date"] = "24-08-2026"
        combined_labs.append(r_copy)
    for r in lab2_records:
        r_copy = dict(r)
        r_copy["group"] = "GROUP-2"
        r_copy["as_of_date"] = "07-08-2026"
        r_copy["valid_up_to"] = "National Eminence / Standing Utilisation"
        r_copy["remarks"] = ""
        combined_labs.append(r_copy)

    labs_master_path = os.path.join(STRUCTURED_DIR, "hallmarking_labs_master.json")
    with open(labs_master_path, "w", encoding="utf-8") as f:
        json.dump(combined_labs, f, indent=2, ensure_ascii=False)
    print(f"Saved Hallmarking Labs Master ({len(combined_labs)} labs) -> {labs_master_path}")

    # Save all hallmarking chunks
    hm_chunks_path = os.path.join(STRUCTURED_DIR, "hallmarking_chunks.json")
    with open(hm_chunks_path, "w", encoding="utf-8") as f:
        json.dump(all_hallmarking_chunks, f, indent=2, ensure_ascii=False)
    print(f"Saved Hallmarking Chunks -> {hm_chunks_path}")

    # 6. Index into ChromaDB
    print(f"\nInitializing ChromaDB Persistent Client at {CHROMA_DIR}...")
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine", "description": "Bureau of Indian Standards Regulatory & Hallmarking Knowledge Base"}
    )

    print(f"Generating embeddings using {MODEL_NAME}...")
    embed_model = SentenceTransformer(MODEL_NAME)
    texts_to_embed = [c["text"] for c in all_hallmarking_chunks]
    embeddings = embed_model.encode(texts_to_embed, batch_size=64, normalize_embeddings=True, show_progress_bar=True).tolist()

    ids = [c["id"] for c in all_hallmarking_chunks]
    metadatas = [
        {
            "source_doc": c["source_doc"],
            "doc_type": c["doc_type"],
            "state": c.get("state", ""),
            "osl_code": c.get("osl_code", ""),
            "clause_number": c.get("clause_number", ""),
            "as_of_date": c.get("as_of_date", ""),
            "document_title": c.get("document_title", ""),
            "page_number": int(c.get("page_number", 1))
        }
        for c in all_hallmarking_chunks
    ]
    documents = [c["text"] for c in all_hallmarking_chunks]

    print("Adding / upserting chunks into ChromaDB collection...")
    BATCH_SIZE = 100
    for i in range(0, len(ids), BATCH_SIZE):
        collection.upsert(
            ids=ids[i:i+BATCH_SIZE],
            embeddings=embeddings[i:i+BATCH_SIZE],
            metadatas=metadatas[i:i+BATCH_SIZE],
            documents=documents[i:i+BATCH_SIZE]
        )

    print("=" * 70)
    print(f"SUCCESS: Indexed {len(all_hallmarking_chunks)} Hallmarking chunks into ChromaDB!")
    print(f"ChromaDB collection total documents now: {collection.count()}")
    print("=" * 70)

if __name__ == "__main__":
    run_hallmarking_ingestion()
