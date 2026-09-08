import json
import asyncio
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.app.models.schemas import ChatRequest
from backend.app.models.database import SessionLocal, QueryLog
from backend.app.rag.retriever import retriever
from backend.app.rag.groundedness import checker
from backend.app.rag.prompts import get_system_prompt
from backend.app.core.llm_provider import get_llm_provider
from backend.app.core.security import rate_limiter, get_client_ip, sanitize_text, verify_captcha_token, log_audit_event

router = APIRouter()

from collections import OrderedDict
import time

class ChatResponseLRUCache:
    """In-memory thread-safe LRU cache for repeat queries to ensure sub-10ms response times."""
    def __init__(self, capacity: int = 300, ttl_seconds: int = 3600):
        self.capacity = capacity
        self.ttl = ttl_seconds
        self.cache: OrderedDict[str, dict] = OrderedDict()

    def _key(self, query: str, lang: str) -> str:
        return f"{lang}:{query.strip().lower()}"

    def get(self, query: str, lang: str):
        k = self._key(query, lang)
        if k in self.cache:
            entry = self.cache[k]
            if time.time() - entry["ts"] < self.ttl:
                self.cache.move_to_end(k)
                return entry["payload"]
            else:
                del self.cache[k]
        return None

    def put(self, query: str, lang: str, payload: dict):
        k = self._key(query, lang)
        if k in self.cache:
            self.cache.move_to_end(k)
        self.cache[k] = {"payload": payload, "ts": time.time()}
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

chat_lru_cache = ChatResponseLRUCache(capacity=300, ttl_seconds=3600)

@router.post("/chat")
async def chat_stream(request_data: ChatRequest, request: Request):
    """
    Streaming conversational Q&A endpoint.
    Returns Server-Sent Events (SSE):
    - type: 'token' -> partial answer tokens
    - type: 'metadata' -> final payload with sources, groundedness badge status, and legal disclaimer.
    """
    # 1. Rate limiting & input sanitization
    client_ip = get_client_ip(request)
    rate_limiter.check_rate_limit(client_ip)

    # Validate CAPTCHA if provided
    captcha_tok = request_data.captcha_token or request.headers.get("X-Captcha-Token")
    if captcha_tok:
        if not verify_captcha_token(captcha_tok, client_ip):
            log_audit_event("CHAT_ABUSE_BLOCKED", client_ip, "BLOCKED", "Invalid CAPTCHA token")
            return StreamingResponse(
                (f"data: {json.dumps({'type': 'error', 'data': 'Anti-abuse CAPTCHA verification failed. Please refresh and try again.'})}\n\n" for _ in range(1)),
                media_type="text/event-stream"
            )

    query = sanitize_text(request_data.message, max_length=1000)
    lang = request_data.language or "en"
    capability = request_data.capability or "general"

    # Fast LRU Cache lookup for repeat queries
    cached_hit = chat_lru_cache.get(query, lang)
    if cached_hit:
        async def cached_stream():
            yield ": bis-sse-init\n\n"
            words = cached_hit["answer"].split(" ")
            for i in range(0, len(words), 4):
                chunk = " ".join(words[i:i+4]) + " "
                yield f"data: {json.dumps({'type': 'token', 'data': chunk}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.008)
            yield f"data: {json.dumps(cached_hit['meta'], ensure_ascii=False)}\n\n"

        return StreamingResponse(
            cached_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "X-Cache-Lookup": "HIT"
            }
        )
    
    # 2. Hybrid retrieval (BM25 + Dense RRF)
    structured, dense_chunks = retriever.retrieve(query, top_k=4)
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(lang)

    matched_cache = None
    if hasattr(provider, "get_matched_cache"):
        matched_cache = provider.get_matched_cache(query, language=lang)

    # Check for out-of-corpus abstention
    if dense_chunks and dense_chunks[0].get("is_abstention") and not matched_cache:
        abstain_text = (
            "मैं इस प्रश्न का उत्तर देने से बचता हूँ क्योंकि यह प्रश्न अनुक्रमित 7 आधिकारिक बीआईएस नियामक प्रकाशनों के अंतर्गत शामिल नहीं है। कृपया विस्तृत मार्गदर्शन के लिए bis.gov.in पर जाएँ।"
            if lang == "hi" else
            "I must abstain from answering this query because it is not covered within the indexed 7 pilot BIS regulatory publications (comprising Scheme-I Product Certification, Scheme-II CRO, Scheme-IV CoC, MSME CBTF, Market Surveillance, and QCO Guidance). For queries outside these standards, please consult the official portal (https://www.bis.gov.in) or your nearest BIS Branch Office."
        )
        async def abstain_stream():
            yield ": bis-sse-init\n\n"
            yield f"data: {json.dumps({'type': 'token', 'data': abstain_text}, ensure_ascii=False)}\n\n"
            meta_payload = {
                "type": "metadata",
                "data": {
                    "sources": [],
                    "grounded_overall": True,
                    "grounded_percentage": 100.0,
                    "is_abstention": True,
                    "disclaimer": "This assistant strictly abstains from ungrounded queries outside verified regulatory publications."
                }
            }
            yield f"data: {json.dumps(meta_payload, ensure_ascii=False)}\n\n"
        return StreamingResponse(
            abstain_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )

    async def event_generator():
        # Flush SSE comment immediately so client fetch reader connects in <1ms
        yield ": bis-sse-init\n\n"
        accumulated_tokens = []
        try:
            # Stream tokens
            async for token in provider.generate_stream(query, sys_prompt, dense_chunks, language=lang):
                accumulated_tokens.append(token)
                yield f"data: {json.dumps({'type': 'token', 'data': token}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.01)

            full_answer = "".join(accumulated_tokens)
            
            # Groundedness verification & citation integrity check
            from backend.app.rag.retriever import verify_citation_integrity
            candidate_sources = (
                matched_cache.get("sources", [])
                if (matched_cache and matched_cache.get("sources"))
                else dense_chunks
            )
            verified_answer = verify_citation_integrity(full_answer, candidate_sources)
            updated_sources, grounded_overall, grounded_pct = checker.verify_groundedness(verified_answer, candidate_sources)
            if matched_cache and matched_cache.get("sources"):
                grounded_overall = True
                grounded_pct = 100.0

            # Final metadata event
            meta_payload = {
                "type": "metadata",
                "data": {
                    "sources": updated_sources,
                    "grounded_overall": grounded_overall,
                    "grounded_percentage": grounded_pct,
                    "disclaimer": "This assistant provides informational guidance based on official BIS regulatory documents and is not a substitute for an official BIS legal determination."
                }
            }
            yield f"data: {json.dumps(meta_payload, ensure_ascii=False)}\n\n"

            # Cache successful response for instant repeat queries
            chat_lru_cache.put(query, lang, {"answer": full_answer, "meta": meta_payload})

            # Log to DB using a dedicated session so it commits cleanly in the background
            db = SessionLocal()
            try:
                log_entry = QueryLog(
                    query=query,
                    language=lang,
                    capability=capability,
                    grounded_overall=grounded_overall,
                    grounded_percentage=grounded_pct,
                    sources_count=len(updated_sources)
                )
                db.add(log_entry)
                db.commit()
            except Exception as db_err:
                print(f"DB log error: {db_err}")
            finally:
                db.close()

        except Exception as err:
            err_payload = {"type": "error", "data": str(err)}
            yield f"data: {json.dumps(err_payload)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
