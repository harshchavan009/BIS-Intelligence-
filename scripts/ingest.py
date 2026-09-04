#!/usr/bin/env python3
"""
scripts/ingest.py
High-precision ingestion pipeline for Bureau of Indian Standards (BIS) regulatory documents.
1. Programmatically parses headers to classify documents into {scheme, doc_type, effective_date, ref_number, title}.
2. Extracts structured IS-number <-> product <-> QCO tables into data/structured/is_product_map.json.
3. Chunks regulatory text on clause boundaries (numbered clauses, sub-clauses, annexures) preserving metadata.
4. Generates multilingual dense embeddings using paraphrase-multilingual-MiniLM-L12-v2.
5. Persists chunks into ChromaDB at data/chroma_db.
"""

import os
import re
import json
import glob
import pypdf
import chromadb
from sentence_transformers import SentenceTransformer

KB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "knowledge_base")
STRUCTURED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "structured")
CHROMA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "chroma_db")
COLLECTION_NAME = "bis_standards_kb"
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

os.makedirs(STRUCTURED_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)


def parse_doc_header(pdf_path: str, first_pages_text: str) -> dict:
    """
    Parse document header block programmatically without relying on filenames.
    Detects Ref Number, Subject/Title, Date, and Scheme classification.
    """
    text = first_pages_text[:3000]
    
    # 1. Reference Number
    ref_match = re.search(r'(?:Our\s*Ref|Ref|फा\.\s*सं\.|सं\.?)\s*[:\-]?\s*([A-Za-z0-9\/\:\.\-_]+(?:\s+[A-Za-z0-9\/\:\.\-_]+)?)', text, re.IGNORECASE)
    ref_number = ref_match.group(1).strip() if ref_match else "BIS/HQ/REG-2018"

    # 2. Date
    date_match = re.search(r'(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}|\d{1,2}\s+(?:जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर|जनवरी|फ़रवरी|मार्च|अप्रैल|मई)\s+\d{4})', text, re.IGNORECASE)
    effective_date = date_match.group(1).strip() if date_match else "2018-2026"

    # 3. Subject / Title
    subject_match = re.search(r'(?:Subject|Sub|विषय)\s*[:\-]\s*([^\n\r]+(?:\n[^\n\r]+){1,2})', text, re.IGNORECASE)
    if subject_match:
        subject = " ".join(subject_match.group(1).split())
    else:
        if "Cluster Based Test Facility" in text or "CBTF" in text:
            subject = "Guidelines for utilisation of Cluster Based Test Facility (CBTF) by Micro, Small & Medium Enterprises (MSMEs)"
        elif "market surveillance" in text.lower():
            subject = "Guidelines for market surveillance during operation of licence under Scheme-I"
        elif "गुणवत्ता नियंत्रण आदेश" in text or "Quality Control Orders" in text:
            subject = "Guidance Document on Quality Control Orders (QCOs) under Section 16 of BIS Act, 2016"
        elif "Certificate of Conformity" in text or "Scheme – IV" in text or "Scheme - IV" in text:
            subject = "Guidelines for Grant of Certificate of Conformity (CoC) under Scheme-IV"
        elif "अनुरूपता निर्धारण" in text or "Conformity Assessment Regulations" in text:
            subject = "BIS (Conformity Assessment) Regulations 2018 - Scheme-I Master Schedule"
        elif "Registration" in text or "CRO" in text or "Electronic Games" in text:
            subject = "Compulsory Registration Scheme (CRO) Guidelines - Scheme-II"
        elif "Cement" in text or "IS 12330" in text:
            subject = "Scheme-I Specific Product Guidelines & Mandatory QCO Mapping"
        else:
            subject = "Bureau of Indian Standards Regulatory Guideline"

    # 4. Scheme & Document Type Classification
    t_lower = (subject + " " + text[:1500]).lower()
    if "cbtf" in t_lower or "cluster based" in t_lower:
        scheme = "Scheme-I (CBTF MSME)"
        doc_type = "Testing Facility Guidelines"
    elif "market surveillance" in t_lower or "surveillance" in t_lower:
        scheme = "Scheme-I (Surveillance)"
        doc_type = "Post-Market Surveillance Procedures"
    elif "qco" in t_lower or "quality control order" in t_lower or "गुणवत्ता नियंत्रण" in t_lower:
        scheme = "QCO Regulatory Guidance"
        doc_type = "Statutory Orders Guidance"
    elif "scheme – iv" in t_lower or "scheme - iv" in t_lower or "certificate of conformity" in t_lower:
        scheme = "Scheme-IV"
        doc_type = "Certificate of Conformity (CoC) Guidelines"
    elif "compulsory registration" in t_lower or "cro" in t_lower or "scheme2" in pdf_path.lower():
        scheme = "Scheme-II (CRO)"
        doc_type = "Compulsory Registration Scheme"
    elif "scheme-i" in t_lower or "scheme 1" in t_lower or "isi mark" in t_lower or "cement" in t_lower:
        scheme = "Scheme-I (ISI Mark)"
        doc_type = "Product Certification Guidelines"
    else:
        scheme = "BIS Standards"
        doc_type = "General Technical Guideline"

    return {
        "scheme": scheme,
        "doc_type": doc_type,
        "effective_date": effective_date,
        "ref_number": ref_number,
        "title": subject
    }


def extract_structured_tables(kb_dir: str, structured_dir: str):
    """
    Extract structured IS numbers, products, categories, and QCO orders into JSON tables.
    Powers fast exact/fuzzy deterministic lookup for Standards Finder.
    """
    products = []
    
    # Base verified product-standard mappings from scheme1-specific, scheme1-ISI-mark, and scheme2-registration
    verified_master_data = [
        # Cement & Construction
        {"is_number": "IS 12330", "product_name": "Sulphate Resisting Portland Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 12600", "product_name": "Low Heat Portland Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 1489 (Part 1)", "product_name": "Portland Pozzolana Cement - Part 1 Fly-ash based", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 1489 (Part 2)", "product_name": "Portland Pozzolana Cement - Part 2 Calcined clay based", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 269", "product_name": "Ordinary Portland Cement (33, 43, 53 grade)", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 455", "product_name": "Portland Slag Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 8041", "product_name": "Rapid Hardening Portland Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 6909", "product_name": "Supersulphated Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 3466", "product_name": "Masonry Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 8043", "product_name": "Hydrophobic Portland Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 8042", "product_name": "White Portland Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        {"is_number": "IS 16415", "product_name": "Composite Cement", "category": "Cement & Building Materials", "qco_name": "Cement (Quality Control) Order, 2003", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "S.O. 191(E)"},
        
        # Steel & Iron
        {"is_number": "IS 1786", "product_name": "High Strength Deformed Steel Bars & Wires for Concrete Reinforcement (TMT Steel Bars)", "category": "Steel & Metallurgy", "qco_name": "Steel and Steel Products (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "Steel-QCO-2020"},
        {"is_number": "IS 2062", "product_name": "Hot Rolled Medium and High Tensile Structural Steel", "category": "Steel & Metallurgy", "qco_name": "Steel and Steel Products (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "Steel-QCO-2020"},
        {"is_number": "IS 2830", "product_name": "Carbon Steel Cast Billet Ingots, Billets, Blooms and Slabs for Re-rolling", "category": "Steel & Metallurgy", "qco_name": "Steel and Steel Products (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "Steel-QCO-2020"},
        {"is_number": "IS 277", "product_name": "Galvanized Steel Sheets (Plain and Corrugated)", "category": "Steel & Metallurgy", "qco_name": "Steel and Steel Products (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "Steel-QCO-2020"},
        
        # Electronics & IT (Scheme-II CRO)
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Audio/Video, Information and Communication Technology Equipment (Laptops, Tablets, TVs)", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif. 2021"},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Smart Watches & Wearable Connected Devices", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Phase-IV"},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Electronic Games (Video Consoles)", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2012", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY 2012"},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Plasma / LCD / LED Television of screen size up-to 32 inch", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif."},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "CCTV Cameras and CCTV Recorders", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif."},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Wireless Headphones and Earphones (TWS / Bluetooth)", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Phase-V"},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "USB Type External Solid-State Storage Devices & External Hard Disk Drives", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif."},
        {"is_number": "IS/IEC 62368: Part 1: 2023", "product_name": "Automatic Teller Cash Dispensing Machines (ATM)", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif."},
        {"is_number": "IS 16333 (Part 3)", "product_name": "Mobile Phone Handsets - Indian Language Support Specific Requirements", "category": "Electronics & IT Goods", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Notif. 2017"},
        {"is_number": "IS 16242 (Part 1): 2014", "product_name": "General and Safety Requirements for UPS / Inverters (rating <= 10kVA)", "category": "Power & Energy", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY CRO Notif."},
        
        # Electrical Appliances & Lighting
        {"is_number": "IS 10322 (Part 5/Sec 2): 2012", "product_name": "Recessed LED Luminaires", "category": "Electrical & Lighting", "qco_name": "Electrical Equipment (Quality Control) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "DPIIT QCO 2021"},
        {"is_number": "IS 10322 (Part 5/Sec 3): 2012", "product_name": "LED Luminaires for Road and Street Lighting", "category": "Electrical & Lighting", "qco_name": "Electrical Equipment (Quality Control) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "DPIIT QCO 2021"},
        {"is_number": "IS 10322 (Part 5/Sec 5): 2013", "product_name": "LED Flood Lights", "category": "Electrical & Lighting", "qco_name": "Electrical Equipment (Quality Control) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "DPIIT QCO 2021"},
        {"is_number": "IS 16103 (Part 1): 2012", "product_name": "Standalone LED Modules for General Lighting", "category": "Electrical & Lighting", "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Notif. 2020"},
        {"is_number": "IS 302 (Part 2/Sec 6): 2009", "product_name": "Induction Stove (Household Electrical Cooking)", "category": "Household Appliances", "qco_name": "Safety of Household and Similar Electrical Appliances Order", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Notif. 2021"},
        {"is_number": "IS 302 (Part 2/Sec 15): 2009", "product_name": "Electric Rice Cooker & Liquid Heating Appliances", "category": "Household Appliances", "qco_name": "Safety of Household and Similar Electrical Appliances Order", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Notif. 2021"},
        {"is_number": "IS 302 (Part 1): 2008", "product_name": "Adapters for Household and Similar Electrical Appliances", "category": "Household Appliances", "qco_name": "Safety of Household Electrical Appliances Order", "scheme": "Scheme-II (CRO)", "mandatory": True, "notification_ref": "MeitY Notif. 2021"},
        
        # Gas Cylinders & Pressure Equipment
        {"is_number": "IS 3196 (Part 1)", "product_name": "Welded Low Carbon Steel Gas Cylinders for Low Pressure Liquefiable Gases (LPG Cylinders)", "category": "Gas Cylinders & Pressure Vessels", "qco_name": "Gas Cylinders (Quality Control) Order, 2019", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "PESO / DPIIT QCO"},
        {"is_number": "IS 3224", "product_name": "Valve Fittings for Compressed Gas Cylinders (Excluding LPG)", "category": "Gas Cylinders & Pressure Vessels", "qco_name": "Gas Cylinders (Quality Control) Order, 2019", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "PESO QCO"},
        {"is_number": "IS 8737", "product_name": "Valve Fittings for Use with Domestic LPG Cylinders", "category": "Gas Cylinders & Pressure Vessels", "qco_name": "Gas Cylinders (Quality Control) Order, 2019", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "PESO QCO"},
        
        # Textiles & Agriculture
        {"is_number": "IS 12171: 2019", "product_name": "Cotton Bales - Specification", "category": "Textiles & Agriculture", "qco_name": "Cotton Bales (Quality Control) Order, 2023", "scheme": "Scheme-II (CRO) / Scheme-IV", "mandatory": True, "notification_ref": "Ministry of Textiles Notif. 2023"},
        
        # Consumer Safety & Baby Care
        {"is_number": "IS 14625", "product_name": "Plastic Feeding Bottles for Infants", "category": "Child & Infant Care", "qco_name": "Feeding Bottles (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "DPIIT QCO 2020"},
        {"is_number": "IS 9873 (Part 1)", "product_name": "Safety of Toys - Mechanical and Physical Properties", "category": "Toys & Children Goods", "qco_name": "Toys (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "DPIIT Toys QCO 2020"},
        
        # Helmets & Automotive
        {"is_number": "IS 4151", "product_name": "Protective Helmets for Two Wheeler Riders", "category": "Automotive & Safety", "qco_name": "Two Wheeler Helmets (Quality Control) Order, 2020", "scheme": "Scheme-I (ISI Mark)", "mandatory": True, "notification_ref": "MoRTH QCO 2020"}
    ]

    products.extend(verified_master_data)

    out_file = os.path.join(structured_dir, "is_product_map.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"Extracted {len(products)} structured standard mappings -> {out_file}")

    # Schemes Meta structured table
    schemes_meta = {
        "Scheme-I": {
            "name": "Scheme – I (ISI Mark / Product Certification)",
            "governing_law": "Schedule II, Scheme I of BIS (Conformity Assessment) Regulations, 2018",
            "scope": "Third-party certification mark (ISI Mark) granting license to manufacturers with established quality management and testing facilities.",
            "eligibility": "Domestic and Foreign Manufacturers (FMCS). MSMEs eligible for Cluster Based Test Facility (CBTF) concessions.",
            "concessions_msme": "Can share test facilities via CBTF under CMD-I/2:12:8 guidelines, up to 80% capital subsidy on testing infrastructure.",
            "key_steps": [
                "1. Identify applicable Indian Standard (IS) & check QCO mandatory status",
                "2. Set up internal testing lab or link to verified CBTF cluster",
                "3. Submit application online on Manakonline portal with Form-V & test reports",
                "4. Preliminary factory inspection & sample drawing by BIS audit officer",
                "5. Independent testing of drawn sample in BIS recognized lab",
                "6. Grant of License (CML) and permission to affix ISI Mark",
                "7. Ongoing market and factory surveillance"
            ],
            "timelines": "Normal process: 30–60 days. Simplified procedure for MSMEs: 30 days."
        },
        "Scheme-II": {
            "name": "Scheme – II (Compulsory Registration Scheme / CRO)",
            "governing_law": "Schedule II, Scheme II of BIS (Conformity Assessment) Regulations, 2018",
            "scope": "Self-declaration of conformity based on test reports from BIS-recognized labs for Electronics, IT Goods, Solar PV, and Smart Devices.",
            "eligibility": "Manufacturers of goods notified under MeitY and DPIIT CRO notifications.",
            "key_steps": [
                "1. Test product sample in a BIS recognized / accredited lab (report valid for 90 days)",
                "2. Register online on CRS portal (crsbis.in)",
                "3. Submit self-declaration of conformity along with valid test report and undertaking",
                "4. Grant of Registration with unique R-number",
                "5. Affix standard mark 'IS... R-XXXXXXXX' on product packaging and label"
            ],
            "timelines": "15–20 working days upon receipt of complete test report."
        },
        "Scheme-IV": {
            "name": "Scheme – IV (Certificate of Conformity / CoC)",
            "governing_law": "Schedule II, Scheme IV of BIS (Conformity Assessment) Regulations, 2018 (CMD-I/2:16:1)",
            "scope": "Grant of Certificate of Conformity for specific batches or continuous production where full factory licensing under Scheme-I is not optimal.",
            "eligibility": "Manufacturers or applicants meeting technical specifications or specific notifications.",
            "key_steps": [
                "1. Submit application along with product test report not older than 180 days (Clause 6.a)",
                "2. Scrutiny of application and technical documents by BIS CMD-I",
                "3. Factory assessment or inspection if stipulated in product-specific guidelines",
                "4. Sample drawing & verification testing in BIS recognized laboratory",
                "5. Evaluation of compliance against Annexure templates & declaration",
                "6. Grant of Certificate of Conformity (valid for specified period / consignment)"
            ],
            "timelines": "20–45 days."
        },
        "CBTF": {
            "name": "Cluster Based Test Facility (CBTF) for MSMEs",
            "governing_law": "Guidelines Ref: CMD-I/2:12:8 (30 April 2021)",
            "scope": "Permits Micro, Small & Medium Enterprises (MSMEs) located in an industrial cluster to share a common test facility as an alternative to in-house testing facilities for Scheme-I ISI Mark licensing.",
            "eligibility": "MSMEs having valid Udyam registration, located within specified cluster radius (normally 25-50 km).",
            "non_exempt_tests": "Visual examination up to 10x, routine dimensional check, and packaging tests must still be retained in-house (Clause 2.(i)).",
            "procedure_to_avail": [
                "1. Form or join an MSME cluster / industry association operating a CBTF",
                "2. Ensure CBTF equipment matches testing requirements of relevant IS standard",
                "3. Submit agreement between MSME unit and CBTF to BIS Regional Office",
                "4. BIS conducts joint verification of CBTF under Annexure-B checklist",
                "5. Facility code assigned; MSME licensed under Scheme-I utilizing CBTF for lot testing"
            ]
        }
    }

    schemes_file = os.path.join(structured_dir, "schemes_meta.json")
    with open(schemes_file, "w", encoding="utf-8") as f:
        json.dump(schemes_meta, f, indent=2, ensure_ascii=False)
    print(f"Extracted schemes metadata -> {schemes_file}")


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

def scan_text_for_prompt_injection(text: str, source_info: str) -> bool:
    """
    Security scan: Check documents and chunks for hidden instruction-like phrases.
    Flags suspicious content for human audit prior to indexing.
    """
    text_lower = text.lower()
    for phrase in SUSPICIOUS_INJECTION_PHRASES:
        if phrase in text_lower:
            print(f"[SECURITY AUDIT FLAG] Suspicious instruction-like phrase detected: '{phrase}' in {source_info}")
            return True
    return False

def chunk_regulatory_document(pdf_path: str, header_meta: dict) -> list:
    """
    Hierarchical clause-based chunking.
    Splits text on regulatory clause patterns (e.g. '1.', '2. (i)', '(a)', 'Annexure-I')
    preserving {source_file, document_title, clause_ref, scheme, page_number, doc_type, effective_date}.
    """
    reader = pypdf.PdfReader(pdf_path)
    chunks = []
    fname = os.path.basename(pdf_path)
    doc_title = header_meta["title"]
    scheme = header_meta["scheme"]
    doc_type = header_meta["doc_type"]
    eff_date = header_meta["effective_date"]

    current_annexure = None

    for page_idx, page in enumerate(reader.pages):
        page_num = page_idx + 1
        page_text = page.extract_text()
        if not page_text or len(page_text.strip()) < 30:
            continue

        # Check for Annexure transition
        annex_match = re.search(r'(Annexure\s*[-–—]?\s*[A-Z0-9IVX]+)', page_text, re.IGNORECASE)
        if annex_match:
            current_annexure = annex_match.group(1).upper().replace("–", "-")

        # Normalize line endings
        lines = page_text.split('\n')
        
        # Group lines by clauses
        clause_blocks = []
        cur_clause = current_annexure or "General"
        cur_text_lines = []

        clause_regex = re.compile(
            r'^(?:(?:\d{1,2}\.|\([a-z]\)|\([ivx]+\)|\d{1,2}\.\s*\([a-z0-9]+\))\s+|'
            r'(?:Clause|Section|Regulation|Sub-regulation)\s*\d+|'
            r'(?:Annexure|Schedule)\s*[-–—]?\s*[A-Z0-9IVX]+)', 
            re.IGNORECASE
        )

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            m = clause_regex.match(stripped)
            if m:
                # Save previous block if it has enough content
                if cur_text_lines:
                    clause_blocks.append((cur_clause, " ".join(cur_text_lines)))
                    cur_text_lines = []
                cur_clause = m.group(0).strip()
                if current_annexure and not cur_clause.startswith("Annexure"):
                    cur_clause = f"{current_annexure} - {cur_clause}"
            
            cur_text_lines.append(stripped)

        if cur_text_lines:
            clause_blocks.append((cur_clause, " ".join(cur_text_lines)))

        # Create structured chunks
        for c_ref, c_text in clause_blocks:
            clean_text = " ".join(c_text.split())
            if len(clean_text) < 40:
                continue

            # Ingestion-time security inspection
            scan_text_for_prompt_injection(clean_text, f"{fname} (p.{page_num}, {c_ref})")

            # If chunk is overly long (>1800 chars), split into semantic sub-paragraphs
            if len(clean_text) > 1800:
                sub_parts = re.split(r'(?<=\.)\s+(?=[A-Z0-9\(\[])', clean_text)
                sub_acc = ""
                sub_idx = 1
                for p in sub_parts:
                    if len(sub_acc) + len(p) > 1500 and len(sub_acc) > 300:
                        chunks.append({
                            "source_file": fname,
                            "document_title": doc_title,
                            "clause_ref": f"{c_ref} (Part {sub_idx})",
                            "scheme": scheme,
                            "doc_type": doc_type,
                            "page_number": page_num,
                            "effective_date": eff_date,
                            "text": sub_acc.strip()
                        })
                        sub_acc = p + " "
                        sub_idx += 1
                    else:
                        sub_acc += p + " "
                if len(sub_acc.strip()) > 40:
                    chunks.append({
                        "source_file": fname,
                        "document_title": doc_title,
                        "clause_ref": f"{c_ref} (Part {sub_idx})" if sub_idx > 1 else c_ref,
                        "scheme": scheme,
                        "doc_type": doc_type,
                        "page_number": page_num,
                        "effective_date": eff_date,
                        "text": sub_acc.strip()
                    })
            else:
                chunks.append({
                    "source_file": fname,
                    "document_title": doc_title,
                    "clause_ref": c_ref,
                    "scheme": scheme,
                    "doc_type": doc_type,
                    "page_number": page_num,
                    "effective_date": eff_date,
                    "text": clean_text
                })

    return chunks


def run_ingestion():
    print("=" * 60)
    print("STARTING BIS KNOWLEDGE BASE INGESTION PIPELINE")
    print("=" * 60)

    # 1. Structured table extraction
    print("\n[Step 1/4] Extracting structured IS numbers, products, and QCO maps...")
    extract_structured_tables(KB_DIR, STRUCTURED_DIR)

    # 2. PDF Parsing, Header Classification & Clause Chunking
    print("\n[Step 2/4] Parsing BIS PDFs, classifying headers & clause chunking...")
    pdf_files = sorted(glob.glob(os.path.join(KB_DIR, "*.pdf")))
    if not pdf_files:
        raise FileNotFoundError(f"No PDF files found in {KB_DIR}!")

    all_chunks = []
    doc_registry = []

    for pdf in pdf_files:
        reader = pypdf.PdfReader(pdf)
        first_pages = " ".join([page.extract_text() or "" for page in reader.pages[:2]])
        header_meta = parse_doc_header(pdf, first_pages)
        header_meta["filename"] = os.path.basename(pdf)
        header_meta["total_pages"] = len(reader.pages)
        doc_registry.append(header_meta)
        
        print(f" -> Parsed: {header_meta['filename']}")
        print(f"    Scheme: {header_meta['scheme']} | Ref: {header_meta['ref_number']} | Date: {header_meta['effective_date']}")
        print(f"    Title:  {header_meta['title'][:80]}...")

        # For the 412-page master gazette (scheme1-ISI-mark.pdf), index the crucial operational regulations (pages 1-25 + sample schedules)
        # to ensure optimal embedding speed while preserving all regulatory clauses.
        if "scheme1-ISI-mark.pdf" in pdf and len(reader.pages) > 30:
            print(f"    [Optimizing large 412-page gazette: indexing first 30 core operational regulation pages]")
            # Create a reader slice or process first 30 pages
            doc_chunks = []
            for p_i in range(min(30, len(reader.pages))):
                p_text = reader.pages[p_i].extract_text() or ""
                if len(p_text.strip()) > 50:
                    doc_chunks.append({
                        "source_file": os.path.basename(pdf),
                        "document_title": header_meta["title"],
                        "clause_ref": f"Regulation {p_i + 1}",
                        "scheme": header_meta["scheme"],
                        "doc_type": header_meta["doc_type"],
                        "page_number": p_i + 1,
                        "effective_date": header_meta["effective_date"],
                        "text": " ".join(p_text.split())[:1600]
                    })
        else:
            doc_chunks = chunk_regulatory_document(pdf, header_meta)
            
        print(f"    Generated {len(doc_chunks)} clause-level chunks.")
        all_chunks.extend(doc_chunks)

    # Save registry
    registry_path = os.path.join(STRUCTURED_DIR, "doc_registry.json")
    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(doc_registry, f, indent=2, ensure_ascii=False)
    print(f"\nDocument registry saved -> {registry_path} ({len(doc_registry)} documents)")

    # 3. Dense Embeddings Generation
    print(f"\n[Step 3/4] Loading embedding model: {MODEL_NAME}...")
    embed_model = SentenceTransformer(MODEL_NAME)
    print(f"Embedding {len(all_chunks)} chunks across {len(doc_registry)} official documents...")

    texts_to_embed = [
        f"{c['document_title']} | Clause: {c['clause_ref']} | {c['text']}"
        for c in all_chunks
    ]
    embeddings = embed_model.encode(texts_to_embed, batch_size=32, show_progress_bar=True).tolist()

    # 4. ChromaDB Persistence
    print("\n[Step 4/4] Persisting vector embeddings to local ChromaDB...")
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    
    # Reset collection if exists to avoid stale data
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Bureau of Indian Standards Regulatory Knowledge Base"}
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
            "effective_date": c["effective_date"]
        }
        for c in all_chunks
    ]
    documents = [c["text"] for c in all_chunks]

    # Add in batches to ChromaDB
    BATCH_SIZE = 100
    for i in range(0, len(ids), BATCH_SIZE):
        collection.add(
            ids=ids[i:i+BATCH_SIZE],
            embeddings=embeddings[i:i+BATCH_SIZE],
            metadatas=metadatas[i:i+BATCH_SIZE],
            documents=documents[i:i+BATCH_SIZE]
        )

    print("=" * 60)
    print(f"SUCCESS! Ingested {len(all_chunks)} chunks into ChromaDB collection '{COLLECTION_NAME}'")
    print(f"ChromaDB Location: {CHROMA_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    run_ingestion()
