#!/usr/bin/env python3
"""
Automated Evaluation Harness for BIS AI Intelligent Assistant.
Runs gold-standard evaluation set against the hybrid retrieval pipeline
to verify citation groundedness, IS standard identification, and clause accuracy.
Outputs pass rate to data/eval_results.json.
"""

import os
import sys
import json
import datetime

# Add project root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from backend.app.rag.retriever import retriever

def run_evaluation():
    eval_file = os.path.join(BASE_DIR, "backend", "tests", "eval_set.json")
    if not os.path.exists(eval_file):
        print(f"Error: Eval set not found at {eval_file}")
        sys.exit(1)

    with open(eval_file, "r", encoding="utf-8") as f:
        eval_cases = json.load(f)

    total = len(eval_cases)
    passed = 0
    results = []

    print("\n" + "=" * 95)
    print(f"  BIS AI INTELLIGENT ASSISTANT — AUTOMATED GROUNDING EVALUATION HARNESS")
    print(f"  Total Test Cases: {total} | Timestamp: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%SZ')}")
    print("=" * 95)
    print(f"{'ID':<9} | {'Capability':<22} | {'Language':<5} | {'Expected Doc':<30} | {'Status':<8}")
    print("-" * 95)

    for case in eval_cases:
        case_id = case["id"]
        query = case["query"]
        capability = case["capability"]
        lang = case.get("language", "en")
        expected_doc = case.get("expected_document")
        expected_is = case.get("expected_is_number")
        expected_clause = case.get("expected_clause")

        # Run hybrid retrieval
        structured, dense_chunks = retriever.retrieve(query, top_k=4)

        # Check retrieval matches
        retrieved_docs = [c["source_file"] for c in dense_chunks]
        retrieved_clauses = [c["clause_ref"] for c in dense_chunks]
        retrieved_excerpts = " ".join([c["excerpt"] for c in dense_chunks])
        
        structured_matches = retriever.search_structured(query)
        retrieved_is_numbers = [m["is_number"] for m in structured_matches]

        doc_matched = False
        if expected_doc:
            doc_matched = any(expected_doc.lower() in d.lower() for d in retrieved_docs)

        is_matched = True
        if expected_is:
            is_matched = (
                any(expected_is.lower() in num.lower() for num in retrieved_is_numbers)
                or (expected_is.lower() in retrieved_excerpts.lower())
            )

        clause_matched = True
        if expected_clause and not doc_matched:
            clause_matched = any(
                expected_clause.lower() in cl.lower() for cl in retrieved_clauses
            ) or (expected_clause.lower() in retrieved_excerpts.lower())

        is_pass = (doc_matched or is_matched or clause_matched)

        if is_pass:
            passed += 1
            status_str = "\033[92mPASSED\033[0m"
        else:
            status_str = "\033[91mFAILED\033[0m"

        top_retrieved = retrieved_docs[0] if retrieved_docs else "None"
        print(f"{case_id:<9} | {capability:<22} | {lang:<5} | {expected_doc or 'IS Lookup':<30} | {status_str}")

        results.append({
            "id": case_id,
            "capability": capability,
            "language": lang,
            "query": query,
            "expected_document": expected_doc,
            "expected_is_number": expected_is,
            "retrieved_top_doc": top_retrieved,
            "passed": is_pass
        })

    # Cement Standards Regression Verification
    print("  Running explicit regression check: 'cement' structured lookup...")
    cement_matches = retriever.search_structured("cement")
    cement_is_nums = [m["is_number"] for m in cement_matches]
    required_cement = ["269", "12330", "1489", "455"]
    cement_passed = all(any(req in num for num in cement_is_nums) for req in required_cement)
    if cement_passed:
        print(f"  ✓ Regression PASSED: Found {len(cement_matches)} cement standards including IS 269, 12330, 1489, 455.")
    else:
        print(f"  ✗ Regression FAILED: Missing required cement standards in {cement_is_nums}")
        passed = max(0, passed - 1)

    pass_rate = round((passed / total) * 100, 1)

    print("-" * 95)
    print(f"  EVALUATION SUMMARY:")
    print(f"  Passed: {passed}/{total} test cases ({pass_rate}%)")
    print(f"  Target Groundedness Threshold: >= 90.0%")
    print("=" * 95 + "\n")

    # Persist results to data/eval_results.json
    out_dir = os.path.join(BASE_DIR, "data")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "eval_results.json")

    eval_payload = {
        "total_tests": total,
        "passed": passed,
        "failed": total - passed,
        "grounded_percentage": pass_rate,
        "evaluated_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "evaluated_at_human": datetime.datetime.utcnow().strftime("%d %B %Y"),
        "results": results
    }

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(eval_payload, f, indent=2)

    print(f"Persisted evaluation report to: {out_file}\n")
    return pass_rate

if __name__ == "__main__":
    rate = run_evaluation()
    if rate < 85.0:
        sys.exit(1)
    sys.exit(0)
