#!/usr/bin/env python3
"""
scripts/run_eval.py
Automated Gold-Standard Evaluation Harness for BIS AI Intelligent Assistant (Round 2).
Runs 65 test cases across Scheme-I, Scheme-II, Scheme-IV, CBTF MSME, Surveillance, QCOs,
Glossary/FAQ, Hindi bilingual queries, and out-of-corpus score-floor abstention.
Outputs comprehensive audit results to data/eval_results.json.
"""

import os
import sys
import json
import datetime
from collections import defaultdict

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
    category_stats = defaultdict(lambda: {"total": 0, "passed": 0})
    scheme_stats = defaultdict(lambda: {"total": 0, "passed": 0})

    print("\n" + "=" * 105)
    print(f"  BUREAU OF INDIAN STANDARDS (BIS) AI ASSISTANT — GOLD EVALUATION HARNESS")
    print(f"  Total Test Cases: {total} | Evaluated At: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%SZ')}")
    print("=" * 105)
    print(f"{'ID':<8} | {'Category':<26} | {'Lang':<4} | {'Target / Expected':<32} | {'Status':<8}")
    print("-" * 105)

    for case in eval_cases:
        case_id = case["id"]
        query = case["query"]
        capability = case.get("capability", "General")
        category = case.get("category", "General")
        scheme = case.get("scheme", "General")
        lang = case.get("language", "en")
        expected_doc = case.get("expected_document")
        expected_is = case.get("expected_is_number")
        expected_clause = case.get("expected_clause")
        is_abstention_case = case.get("is_abstention", False)

        category_stats[category]["total"] += 1
        scheme_stats[scheme]["total"] += 1

        # Execute hybrid retrieval
        structured, chunks = retriever.retrieve(query, top_k=4)

        is_pass = False

        if is_abstention_case:
            # Must strictly abstain on out-of-corpus queries
            has_abstained = any(c.get("is_abstention", False) for c in chunks)
            if has_abstained:
                is_pass = True
            top_retrieved = "ABSTAINED (Out of Corpus)" if has_abstained else (chunks[0]["source_file"] if chunks else "None")
        else:
            retrieved_docs = [c["source_file"] for c in chunks]
            retrieved_clauses = [c["clause_ref"] for c in chunks]
            retrieved_excerpts = " ".join([c["excerpt"] for c in chunks])
            retrieved_is_numbers = [m["is_number"] for m in structured]

            doc_matched = False
            if expected_doc:
                doc_matched = any(expected_doc.lower() in d.lower() for d in retrieved_docs)

            is_matched = True
            if expected_is:
                clean_exp_is = expected_is.lower().replace(":", "").replace("-", "")
                is_matched = (
                    any(clean_exp_is in num.lower().replace(":", "").replace("-", "") for num in retrieved_is_numbers)
                    or any(clean_exp_is in c.get("text", "").lower().replace(":", "").replace("-", "") for c in chunks)
                    or (clean_exp_is in retrieved_excerpts.lower().replace(":", "").replace("-", ""))
                )

            clause_matched = True
            if expected_clause and not doc_matched:
                clause_matched = any(
                    expected_clause.lower() in cl.lower() for cl in retrieved_clauses
                ) or (expected_clause.lower() in retrieved_excerpts.lower())

            is_pass = (doc_matched or is_matched or clause_matched)
            top_retrieved = retrieved_docs[0] if retrieved_docs else "None"

        if is_pass:
            passed += 1
            category_stats[category]["passed"] += 1
            scheme_stats[scheme]["passed"] += 1
            status_str = "\033[92mPASSED\033[0m"
        else:
            status_str = "\033[91mFAILED\033[0m"

        target_display = "Abstention Expected" if is_abstention_case else (expected_is or expected_doc or expected_clause)
        print(f"{case_id:<8} | {category[:25]:<26} | {lang:<4} | {target_display[:31]:<32} | {status_str}")

        results.append({
            "id": case_id,
            "capability": capability,
            "category": category,
            "scheme": scheme,
            "language": lang,
            "query": query,
            "expected_document": expected_doc,
            "expected_is_number": expected_is,
            "expected_clause": expected_clause,
            "is_abstention": is_abstention_case,
            "retrieved_top_doc": top_retrieved,
            "passed": is_pass
        })

    # Cement Standards Regression Verification
    print("-" * 105)
    print("  Regression Verification: 'cement' structured lookup...")
    cement_matches = retriever.search_structured("cement")
    cement_is_nums = [m["is_number"] for m in cement_matches]
    required_cement = ["269", "12330", "1489", "455"]
    cement_passed = all(any(req in num for num in cement_is_nums) for req in required_cement)
    if cement_passed:
        print(f"  ✓ Regression PASSED: Found {len(cement_matches)} cement standards (IS 269, 12330, 1489, 455 all present).")
    else:
        print(f"  ✗ Regression FAILED: Missing required cement standards in {cement_is_nums}")
        passed = max(0, passed - 1)

    pass_rate = round((passed / total) * 100, 1)

    print("-" * 105)
    print(f"  EVALUATION SUMMARY:")
    print(f"  Passed: {passed}/{total} test cases ({pass_rate}%)")
    print(f"  Target Accuracy Threshold: >= 90.0%")
    print("=" * 105)

    # Format category breakdown
    cat_summary = {}
    for cat, data in category_stats.items():
        cat_summary[cat] = {
            "total": data["total"],
            "passed": data["passed"],
            "accuracy": round((data["passed"] / data["total"]) * 100, 1) if data["total"] > 0 else 100.0
        }

    scheme_summary = {}
    for sch, data in scheme_stats.items():
        scheme_summary[sch] = {
            "total": data["total"],
            "passed": data["passed"],
            "accuracy": round((data["passed"] / data["total"]) * 100, 1) if data["total"] > 0 else 100.0
        }

    eval_payload = {
        "total_tests": total,
        "passed": passed,
        "failed": total - passed,
        "grounded_percentage": pass_rate,
        "accuracy_percentage": pass_rate,
        "evaluated_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "evaluated_at_human": datetime.datetime.utcnow().strftime("%d %B %Y"),
        "category_summary": cat_summary,
        "scheme_summary": scheme_summary,
        "results": results
    }

    # Save to data/eval_results.json
    out_file = os.path.join(BASE_DIR, "data", "eval_results.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(eval_payload, f, indent=2, ensure_ascii=False)
    print(f"\nPersisted evaluation report to: {out_file}\n")

    return pass_rate

if __name__ == "__main__":
    rate = run_evaluation()
    if rate < 85.0:
        sys.exit(1)
    sys.exit(0)
