import pytest
from backend.app.rag.retriever import HybridRetriever

@pytest.fixture(scope="module")
def retriever():
    return HybridRetriever()

def test_lab_recognition_query(retriever):
    """Query 1: 'Is [lab name] BIS recognized?'"""
    query = "Is AES Laboratories (P) Ltd, Noida BIS recognized?"
    structured, chunks = retriever.retrieve(query, top_k=3)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    top_chunk = chunks[0]
    assert "8117716" in top_chunk["excerpt"] or top_chunk.get("osl_code") == "8117716"
    assert top_chunk["source_doc"] == "BIS-recognized-laboratories01.pdf"
    assert top_chunk["doc_type"] == "lab_group1"

def test_osl_code_query(retriever):
    """Query 2: 'What is the OSL code for X?'"""
    query = "What is the OSL code for Bhabha Atomic Research Centre (BARC), Bullandshar?"
    structured, chunks = retriever.retrieve(query, top_k=3)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    top_chunk = chunks[0]
    assert "8117101" in top_chunk["excerpt"] or top_chunk.get("osl_code") == "8117101"
    assert top_chunk["source_doc"] == "BIS-recognized-laboratories02.pdf"
    assert top_chunk["doc_type"] == "lab_group2"

def test_list_labs_in_state(retriever):
    """Query 3: 'List labs in [state]'"""
    query = "List labs in Delhi"
    structured, chunks = retriever.retrieve(query, top_k=5)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    # Verify at least one retrieved chunk has state 'Delhi'
    delhi_chunks = [c for c in chunks if "delhi" in c.get("state", "").lower() or "delhi" in c["excerpt"].lower()]
    assert len(delhi_chunks) > 0, "Expected at least one Delhi lab"

def test_hallmark_failure_40_ppt(retriever):
    """Query 4: 'What happens if a hallmark sample fails by more than 40 ppt?'"""
    query = "What happens if a hallmark sample fails by more than 40 ppt?"
    structured, chunks = retriever.retrieve(query, top_k=3)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    clause_5_3_found = any(c.get("clause_number") == "5.3" or "5.3" in c.get("clause_ref", "") or "40 ppt" in c["excerpt"] for c in chunks)
    assert clause_5_3_found, "Expected Clause 5.3 in retrieved chunks"
    top_chunk = chunks[0]
    assert top_chunk["source_doc"] == "hallmarking-jeweller-guidelines-2024.pdf"
    assert top_chunk["doc_type"] == "jeweller_guidelines"

def test_display_requirements_jeweller(retriever):
    """Query 5: 'What are display requirements for a registered jeweller's sales outlet?'"""
    query = "What are display requirements for a registered jeweller's sales outlet?"
    structured, chunks = retriever.retrieve(query, top_k=3)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    display_clause_found = any("3." in c.get("clause_number", "") or "3." in c.get("clause_ref", "") or "display" in c["excerpt"].lower() for c in chunks)
    assert display_clause_found, "Expected Section 3 Display Requirements in retrieved chunks"
    assert chunks[0]["source_doc"] == "hallmarking-jeweller-guidelines-2024.pdf"

def test_ahc_central_assistance_state(retriever):
    """Query 6: 'Which A&H centres got central assistance in [state]?'"""
    query = "Which A&H centres got central assistance in Rajasthan?"
    structured, chunks = retriever.retrieve(query, top_k=5)
    
    assert len(chunks) > 0, "Expected non-empty chunks"
    rajasthan_ahc = [c for c in chunks if c.get("doc_type") == "ahc_centre" and ("rajasthan" in c.get("state", "").lower() or "rajasthan" in c["excerpt"].lower())]
    assert len(rajasthan_ahc) > 0, "Expected AHC centres in Rajasthan"
    assert rajasthan_ahc[0]["source_doc"] == "ahc-centres-list.pdf"
