from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.models.schemas import FeedbackRequest
from backend.app.models.database import get_db, Feedback
from backend.app.core.security import sanitize_text, get_client_ip, log_audit_event

router = APIRouter()

@router.post("/feedback")
async def record_feedback(feedback_req: FeedbackRequest, request: Request, db: Session = Depends(get_db)):
    """
    Records user feedback (thumbs up / down) into the database with input sanitization.
    Protected against XSS and excessive payload injection.
    """
    client_ip = get_client_ip(request)
    
    clean_query = sanitize_text(feedback_req.query, max_length=500)
    clean_answer = sanitize_text(feedback_req.answer, max_length=2000)
    clean_comment = sanitize_text(feedback_req.comment or "", max_length=500)

    entry = Feedback(
        query=clean_query,
        answer=clean_answer,
        rating=feedback_req.rating,
        comment=clean_comment if clean_comment else None
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    log_audit_event(
        action="FEEDBACK_SUBMISSION",
        client_ip=client_ip,
        status="SUCCESS",
        details=f"Rating: {feedback_req.rating}, Feedback ID: {entry.id}"
    )

    return {"status": "success", "id": entry.id, "message": "Feedback recorded."}
