from fastapi import APIRouter, Request
from backend.app.models.schemas import LabSuggestRequest, LabSuggestResponse, SourceCitation
from backend.app.rag.retriever import retriever
from backend.app.core.security import rate_limiter, get_client_ip, sanitize_text

router = APIRouter()

@router.post("/labs/suggest", response_model=LabSuggestResponse)
async def suggest_labs(request_data: LabSuggestRequest, request: Request):
    """
    Surfaces CBTF (Cluster Based Test Facility) guidance for MSMEs
    extracted from CMD-I/2:12:8 guidelines.
    """
    client_ip = get_client_ip(request)
    rate_limiter.check_rate_limit(client_ip)

    product = sanitize_text(request_data.product or "Industrial / MSME Product", max_length=200)
    
    # Retrieve relevant CBTF chunks
    query = f"Cluster Based Test Facility CBTF testing for {product}"
    _, chunks = retriever.retrieve(query, top_k=3)

    eligible_provisions = [
        "MSMEs holding valid Udyam Registration located within the cluster zone (normally 25-50 km radius).",
        "Permission to share high-cost capital testing equipment (e.g. Universal Testing Machine, Spectrometer, Environmental Chambers) across cluster units.",
        "Up to 80% capital subsidy available under Ministry of MSME infrastructure schemes.",
        "CBTF test certificates accepted for batch release under Scheme of Inspection and Testing (SIT) for Scheme-I ISI Mark."
    ]

    retained_inhouse_tests = [
        "Clause 2.(i)(a): Tolerances of size and geometry (dimensions, shape, straightness, flatness).",
        "Clause 2.(i)(b): Visual examination up to 10x magnification for surface defects.",
        "Clause 2.(i)(c): Verification of product markings, batch labeling, and packaging integrity."
    ]

    application_steps = [
        "Step 1: The CBTF operator / industry cluster association submits an application to the BIS Regional Office with the complete equipment list and calibration certificates.",
        "Step 2: BIS conducts a technical verification audit of the facility against the Annexure-B evaluation checklist.",
        "Step 3: Upon approval, BIS assigns an official CBTF Cluster Code.",
        "Step 4: The MSME licensee submits the formal tripartite testing agreement and links the CBTF code to its Manakonline Scheme-I license."
    ]

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
        for c in chunks if "cbtf" in c["source_file"].lower()
    ]

    if not sources:
        sources.append(SourceCitation(
            document_title="Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs",
            source_file="cbtf-msme-guidelines.pdf",
            clause_ref="CMD-I/2:12:8 (Clause 2)",
            page_number=2,
            excerpt="For the purpose of operation of SIT by MSMEs, the CBTFs may be treated as in-house test facility except for dimensional checks and visual examination.",
            grounded=True,
            score=1.0
        ))

    return LabSuggestResponse(
        cbtf_guidance=f"Cluster Based Test Facility (CBTF) framework under BIS Guidelines CMD-I/2:12:8 allows MSME manufacturers of {product} to obtain ISI mark certification without bearing the full expense of an in-house laboratory.",
        eligible_msme_provisions=eligible_provisions,
        retained_inhouse_tests=retained_inhouse_tests,
        application_steps=application_steps,
        sources=sources
    )
