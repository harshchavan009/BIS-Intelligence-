from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.models.schemas import FeedbackRequest
from backend.app.models.database import get_db, Feedback

router = APIRouter()

@router.post("/feedback")
async def record_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    """
    Records user feedback (thumbs up / down) into the database for the analytics screen.
    """
    entry = Feedback(
        query=request.query,
        answer=request.answer,
        rating=request.rating,
        comment=request.comment
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"status": "success", "id": entry.id, "message": "Feedback recorded."}
