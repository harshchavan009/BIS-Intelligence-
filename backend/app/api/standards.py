from fastapi import APIRouter, Request
from backend.app.models.schemas import StandardsRecommendRequest, StandardsRecommendResponse, StandardItem, SourceCitation
from backend.app.rag.retriever import retriever
from backend.app.core.security import rate_limiter, get_client_ip, sanitize_text

router = APIRouter()

@router.post("/standards/recommend", response_model=StandardsRecommendResponse)
async def recommend_standards(request_data: StandardsRecommendRequest, request: Request):
    """
    Input: free-text product description or IS number.
    Output: ranked IS numbers with scheme, QCO status, mandatory/voluntary flag.
    Combines structured table lookup (deterministic) with semantic dense fallback.
    """
    client_ip = get_client_ip(request)
    rate_limiter.check_rate_limit(client_ip)

    query = sanitize_text(request_data.query, max_length=500)
    
    # 1. Structured exact & fuzzy matching
    structured_matches = retriever.search_structured(query)
    
    # 2. Dense semantic retrieval for source context
    dense_chunks = retriever.search_dense(query, top_k=3)
    
    results = []
    seen_is = set()

    for item in structured_matches:
        if item["is_number"] not in seen_is:
            seen_is.add(item["is_number"])
            results.append(StandardItem(
                is_number=item["is_number"],
                product_name=item["product_name"],
                category=item["category"],
                qco_name=item["qco_name"],
                scheme=item["scheme"],
                mandatory=item["mandatory"],
                notification_ref=item.get("notification_ref"),
                match_type=item.get("match_type", "exact"),
                relevance_score=item.get("relevance_score", 1.0)
            ))

    # Sources
    sources = [
        SourceCitation(
            document_title=c["document_title"],
            source_file=c["source_file"],
            clause_ref=c["clause_ref"],
            page_number=c["page_number"],
            excerpt=c["excerpt"],
            grounded=True,
            score=c["score"]
        )
        for c in dense_chunks
    ]

    return StandardsRecommendResponse(
        query=query,
        total_found=len(results),
        results=results,
        sources=sources
    )
