from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    document_title: str = Field(..., description="Official title or subject of the BIS document")
    source_file: str = Field(..., description="Source file name (e.g. cbtf-msme-guidelines.pdf)")
    clause_ref: str = Field(..., description="Numbered clause reference, section or annexure")
    page_number: int = Field(..., description="Exact page number in the source PDF")
    excerpt: str = Field(..., description="Verbatim cited text excerpt")
    grounded: bool = Field(True, description="Whether claim is verified grounded against retrieved text")
    score: Optional[float] = Field(1.0, description="Similarity score or retrieval confidence")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User query in English or Hindi")
    language: str = Field("en", description="Preferred response language: 'en' or 'hi'")
    capability: Optional[str] = Field("auto", description="Explicit capability or 'auto'")
    conversation_id: Optional[str] = Field(None, description="Client session ID")

class ChatResponse(BaseModel):
    answer: str
    language: str
    sources: List[SourceCitation]
    grounded_overall: bool
    grounded_percentage: float
    disclaimer: str = "This assistant provides informational guidance based on official BIS regulatory documents and is not a substitute for an official BIS legal determination."

class StandardItem(BaseModel):
    is_number: str
    product_name: str
    category: str
    qco_name: str
    scheme: str
    mandatory: bool
    notification_ref: Optional[str] = None
    match_type: str = "exact" # 'exact', 'fuzzy', 'semantic'
    relevance_score: Optional[float] = 1.0

class StandardsRecommendRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Product description, keyword, or IS number")
    category: Optional[str] = None

class StandardsRecommendResponse(BaseModel):
    query: str
    total_found: int
    results: List[StandardItem]
    sources: List[SourceCitation] = []

class SchemeInfo(BaseModel):
    id: str
    name: str
    governing_law: str
    scope: str
    eligibility: str
    concessions_msme: Optional[str] = None
    timelines: str
    key_steps: List[str]

class SchemeExplainRequest(BaseModel):
    scheme: str = Field(..., description="Scheme name, e.g. 'Scheme-I', 'Scheme-II', 'Scheme-IV', or 'CBTF'")
    product: Optional[str] = None

class TimelineStep(BaseModel):
    step_number: int
    title: str
    description: str
    clause_ref: Optional[str] = None
    timeline_estimate: Optional[str] = None

class SchemeExplainResponse(BaseModel):
    scheme: str
    product: Optional[str] = None
    steps: List[TimelineStep]
    sources: List[SourceCitation]

class LabSuggestRequest(BaseModel):
    product: Optional[str] = None
    is_number: Optional[str] = None
    location: Optional[str] = None

class LabSuggestResponse(BaseModel):
    cbtf_guidance: str
    eligible_msme_provisions: List[str]
    retained_inhouse_tests: List[str]
    application_steps: List[str]
    sources: List[SourceCitation]

class FeedbackRequest(BaseModel):
    query: str
    answer: str
    rating: int = Field(..., ge=-1, le=1) # 1 for thumbs up, -1 for thumbs down
    comment: Optional[str] = None
    sources_count: Optional[int] = 0

class AnalyticsResponse(BaseModel):
    documents_indexed: int
    chunks_stored: int
    total_queries: int
    positive_feedback: int
    negative_feedback: int
    grounded_percentage: float
    top_categories: List[Dict[str, Any]]
    eval_last_run: Optional[str] = None
    eval_total_tests: Optional[int] = 20
    eval_passed: Optional[int] = 20
    is_live_telemetry: Optional[bool] = True
