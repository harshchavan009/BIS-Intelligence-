import os
import re
import io
import pymupdf
from fastapi import APIRouter, HTTPException, Query, Response
from backend.app.core.config import settings

router = APIRouter()

CACHE_DIR = os.path.join(settings.BASE_DIR, "data", "page_images_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

@router.get("/documents/{file_name}/excerpt")
async def get_document_excerpt(
    file_name: str,
    page: int = Query(1, ge=1),
    clause: str = Query("General")
):
    """
    Returns exact excerpt and page context from the physical source PDF for verifiable inspection.
    """
    pdf_path = os.path.join(settings.KB_DIR, file_name)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail=f"Source document '{file_name}' not found in knowledge base.")

    try:
        doc = pymupdf.open(pdf_path)
        total_pages = len(doc)
        if page > total_pages:
            page = total_pages

        page_obj = doc[page - 1]
        page_text = page_obj.get_text() or "No extractable text on page."
        
        return {
            "source_file": file_name,
            "page_number": page,
            "total_pages": total_pages,
            "clause_ref": clause,
            "page_content": page_text[:4000],
            "verified": True,
            "page_image_url": f"/api/documents/{file_name}/page-image?page={page}&clause={clause}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

@router.get("/documents/{file_name}/page-image")
async def get_document_page_image(
    file_name: str,
    page: int = Query(1, ge=1),
    highlight: str = Query(None),
    clause: str = Query(None)
):
    """
    Renders and serves a high-resolution PNG image of the actual physical source PDF page.
    Automatically identifies and highlights cited clauses or passages in regulatory yellow.
    """
    pdf_path = os.path.join(settings.KB_DIR, file_name)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail=f"Source document '{file_name}' not found in knowledge base.")

    try:
        doc = pymupdf.open(pdf_path)
        total_pages = len(doc)
        if page < 1 or page > total_pages:
            page = max(1, min(page, total_pages))

        page_obj = doc[page - 1]

        # Extract search terms to highlight
        terms_to_search = []
        if clause and len(clause.strip()) > 2:
            # Clean clause reference
            clean_clause = clause.replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            terms_to_search.append(clean_clause.strip())
            # Split parts like "CMD-I/2:12:8 (Clause 2)"
            parts = re.split(r'[\s:;]+', clean_clause)
            for p in parts:
                if len(p) >= 4:
                    terms_to_search.append(p)

        if highlight and len(highlight.strip()) > 3:
            # Clean markdown and quote marks
            clean_hl = re.sub(r'[*_"\']', '', highlight).strip()
            # Try full phrase or significant sub-phrases
            if len(clean_hl) < 60:
                terms_to_search.append(clean_hl)
            else:
                sentences = re.split(r'[.\n]+', clean_hl)
                for s in sentences[:2]:
                    if len(s.strip()) > 10:
                        terms_to_search.append(s.strip()[:50])

        # Apply highlight annotations
        highlighted_count = 0
        for term in terms_to_search:
            if not term:
                continue
            rects = page_obj.search_for(term)
            if rects:
                for r in rects[:6]:
                    annot = page_obj.add_highlight_annot(r)
                    annot.set_colors(stroke=(1.0, 0.88, 0.2)) # Standard warm yellow highlighter
                    annot.update()
                    highlighted_count += 1
                if highlighted_count >= 6:
                    break

        # Render page to PNG pixmap (140 DPI gives great readability and fast delivery)
        pix = page_obj.get_pixmap(dpi=140)
        img_bytes = pix.tobytes("png")

        return Response(
            content=img_bytes,
            media_type="image/png",
            headers={
                "Cache-Control": "public, max-age=3600",
                "X-Highlights-Applied": str(highlighted_count)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rendering PDF page image: {str(e)}")
