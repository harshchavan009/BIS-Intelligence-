import os
import shutil
import hashlib
from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from backend.app.core.config import settings
from backend.app.api.auth import get_current_evaluator

def compute_sha256(filepath: str) -> str:
    """Calculates SHA-256 checksum without importing heavy ML pipeline."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/status")
async def get_admin_pipeline_status() -> Dict[str, Any]:
    """
    Returns pipeline health, knowledge base file inventory, and ChromaDB status.
    """
    kb_files = []
    if os.path.exists(settings.KB_DIR):
        for fname in sorted(os.listdir(settings.KB_DIR)):
            if fname.endswith(".pdf"):
                fpath = os.path.join(settings.KB_DIR, fname)
                kb_files.append({
                    "filename": fname,
                    "size_bytes": os.path.getsize(fpath),
                    "sha256": compute_sha256(fpath)[:16] + "..."
                })

    return {
        "pipeline_ready": True,
        "total_publications": len(kb_files),
        "publications": kb_files,
        "chroma_dir": settings.CHROMA_DIR,
        "model_name": settings.EMBEDDING_MODEL
    }

@router.post("/reingest")
async def trigger_reingest(evaluator: str = Depends(get_current_evaluator)) -> Dict[str, Any]:
    """
    Triggers complete rebuild of canonical datasets and vector embeddings.
    Restricted to authenticated admin / evaluator.
    """
    try:
        from scripts.generate_canonical_data import build_standards_csv, build_knowledge_base_seed
        from scripts.ingest_pdf import run_pdf_ingestion_pipeline
        build_standards_csv()
        build_knowledge_base_seed()
        run_pdf_ingestion_pipeline()
        return {
            "status": "success",
            "message": "Knowledge base and vector index successfully re-indexed.",
            "triggered_by": evaluator
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.post("/upload")
async def upload_guideline_pdf(
    file: UploadFile = File(...),
    evaluator: str = Depends(get_current_evaluator)
) -> Dict[str, Any]:
    """
    Uploads a new regulatory PDF document into data/knowledge_base and triggers indexing.
    Restricted to authenticated admin / evaluator.
    """
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF regulatory publications are accepted.")

    dest_path = os.path.join(settings.KB_DIR, file.filename)
    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        sha = compute_sha256(dest_path)
        return {
            "status": "success",
            "filename": file.filename,
            "sha256": sha,
            "message": f"Successfully uploaded {file.filename}. Ready for indexing.",
            "uploaded_by": evaluator
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")
