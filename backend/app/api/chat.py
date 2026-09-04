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
    
    # 2. Hybrid retrieval
    structured, dense_chunks = retriever.retrieve(query, top_k=4)
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(lang)

    async def event_generator():
        accumulated_tokens = []
        try:
            # Stream tokens
            async for token in provider.generate_stream(query, sys_prompt, dense_chunks, language=lang):
                accumulated_tokens.append(token)
                yield f"data: {json.dumps({'type': 'token', 'data': token}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.01)

            full_answer = "".join(accumulated_tokens)
            
            # Groundedness verification
            updated_sources, grounded_overall, grounded_pct = checker.verify_groundedness(full_answer, dense_chunks)

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
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
