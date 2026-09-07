#!/usr/bin/env python3
"""
scripts/ingest.py
Unified master entry point for the BIS AI Assistant ingestion pipeline.
1. Generates/refreshes canonical dataset (standards_master.csv & knowledge_base_seed.json).
2. Executes layout-aware PDF extraction, de-hyphenation, Unicode normalization, and clause segmentation.
3. Generates QA sample chunks audit log (data/qa_sample_chunks.json).
4. Persists multilingual vector embeddings into ChromaDB.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.generate_canonical_data import build_standards_csv, build_knowledge_base_seed
from scripts.ingest_pdf import run_pdf_ingestion_pipeline
from scripts.ingest_hallmarking import run_hallmarking_ingestion

def main():
    print(">>> Step 1: Generating Canonical Datasets...")
    build_standards_csv()
    build_knowledge_base_seed()

    print("\n>>> Step 2: Running Layout-Aware Ingestion Pipeline...")
    run_pdf_ingestion_pipeline()

    print("\n>>> Step 3: Running Hallmarking Reference Corpus Ingestion Pipeline...")
    run_hallmarking_ingestion()
    print("\n>>> All ingestion tasks completed successfully!")

if __name__ == "__main__":
    main()
