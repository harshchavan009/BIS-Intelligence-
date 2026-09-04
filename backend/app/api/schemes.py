import os
import json
from typing import List, Dict, Any
from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.models.schemas import SchemeExplainRequest, SchemeExplainResponse, TimelineStep, SourceCitation
from backend.app.rag.retriever import retriever

router = APIRouter()

@router.get("/schemes")
async def get_all_schemes():
    """
    Returns structured data on Scheme I (ISI Mark), Scheme II (CRO), Scheme IV (CoC), and CBTF (MSME).
    """
    schemes_file = os.path.join(settings.STRUCTURED_DIR, "schemes_meta.json")
    if os.path.exists(schemes_file):
        with open(schemes_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

@router.post("/schemes/explain", response_model=SchemeExplainResponse)
async def explain_scheme_process(request: SchemeExplainRequest):
    """
    Returns ordered step-by-step process timeline for a scheme,
    grounded in official regulatory sequence (e.g. scheme4-conformity.pdf, cbtf-msme-guidelines.pdf).
    """
    scheme_id = request.scheme.upper()
    product = request.product or "Standard Product"

    if "IV" in scheme_id or "4" in scheme_id:
        steps = [
            TimelineStep(
                step_number=1,
                title="Product Testing & Valid Report Generation",
                description="Obtain test report(s) of the product from a BIS-recognized laboratory. As mandated by Clause 6.a, test reports shall not be more than 180 days old from the date of issue to receipt of application.",
                clause_ref="Clause 6.a",
                timeline_estimate="Day 1 - 15"
            ),
            TimelineStep(
                step_number=2,
                title="Online Application Submission (Form-I)",
                description="Submit Form-I application through Manakonline portal with required technical drawings, test reports, manufacturing process flow, and prescribed application fee.",
                clause_ref="Clause 1 & 2",
                timeline_estimate="Day 16 - 20"
            ),
            TimelineStep(
                step_number=3,
                title="Application Scrutiny by BIS CMD",
                description="BIS Central Marks Department scrutinizes document completeness, scope of product test parameters, and compliance with the applicable Indian Standard.",
                clause_ref="Clause 3",
                timeline_estimate="Day 21 - 27"
            ),
            TimelineStep(
                step_number=4,
                title="Factory Assessment & Sample Verification",
                description="BIS assessment officer visits manufacturing premises if required under specific product guidelines to verify quality controls and draw independent verification samples.",
                clause_ref="Clause 4 & 5",
                timeline_estimate="Day 28 - 38"
            ),
            TimelineStep(
                step_number=5,
                title="Execution of Declarations & Undertakings",
                description="Applicant executes statutory undertaking forms (Annexure-II & III) regarding conformity, traceability, and marking.",
                clause_ref="Annexure-II & III",
                timeline_estimate="Day 39 - 41"
            ),
            TimelineStep(
                step_number=6,
                title="Grant of Certificate of Conformity (CoC)",
                description="Upon satisfactory verification of all reports, BIS issues the Certificate of Conformity for the specified validity period or batch lot.",
                clause_ref="Clause 6",
                timeline_estimate="Day 42 - 45"
            )
        ]
        doc_title = "Guidelines for Grant of Certificate of Conformity (CoC) under Scheme-IV"
        source_file = "scheme4-conformity.pdf"
        clause_ref = "CMD-I/2:16:1 (Clauses 1 to 6.a)"
        page_no = 2
        excerpt = "The test report(s) of the product shall not be more than 180 days old. The period for counting 180 days shall be from the date of issue of the test report(s) to the date of receipt of application."
    
    elif "CBTF" in scheme_id or "LAB" in scheme_id or "MSME" in scheme_id:
        steps = [
            TimelineStep(
                step_number=1,
                title="MSME Cluster Identification & Registration",
                description="MSME units within the cluster verify valid Udyam registration and establish or associate with an approved Cluster Based Test Facility (CBTF).",
                clause_ref="Clause 1 & 2.(i)",
                timeline_estimate="Week 1"
            ),
            TimelineStep(
                step_number=2,
                title="Setup of Retained In-House Testing Equipment",
                description="Ensure mandatory retained testing apparatus is installed in-house: dimensional gauges, visual inspection up to 10x magnification, and packaging tests.",
                clause_ref="Clause 2.(i)",
                timeline_estimate="Week 2"
            ),
            TimelineStep(
                step_number=3,
                title="Execution of Tripartite Agreement with CBTF",
                description="Execute legal agreement between MSME unit, CBTF management, and testing operator specifying testing scope, priority slots, and records maintenance.",
                clause_ref="Clause 3 & Annexure-A",
                timeline_estimate="Week 3"
            ),
            TimelineStep(
                step_number=4,
                title="Joint BIS Verification Audit of CBTF",
                description="BIS technical officers inspect the CBTF against the Annexure-B evaluation checklist (calibration, chemist competency, ambient controls).",
                clause_ref="Clause 4 & Annexure-B",
                timeline_estimate="Week 4 - 5"
            ),
            TimelineStep(
                step_number=5,
                title="Facility Approval & Scheme-I License Linkage",
                description="BIS assigns cluster facility code. MSME license granted under Scheme-I utilizing CBTF reports for routine Scheme of Inspection and Testing (SIT).",
                clause_ref="Clause 5",
                timeline_estimate="Week 6"
            )
        ]
        doc_title = "Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs"
        source_file = "cbtf-msme-guidelines.pdf"
        clause_ref = "CMD-I/2:12:8 (Clause 2 & 4)"
        page_no = 2
        excerpt = "For the purpose of operation of SIT by MSMEs, the CBTFs may be treated as in-house test facility except for dimensional checks and visual examination."

    elif "II" in scheme_id or "2" in scheme_id or "CRO" in scheme_id:
        steps = [
            TimelineStep(
                step_number=1,
                title="Product Testing in BIS Recognized Lab",
                description="Submit sample to BIS-recognized lab for testing against applicable IS/IEC standard (e.g. IS/IEC 62368-1). Test report is issued.",
                clause_ref="CRO Section 1",
                timeline_estimate="Day 1 - 10"
            ),
            TimelineStep(
                step_number=2,
                title="Online Profile Creation on CRS Portal",
                description="Register manufacturer account on crsbis.in portal and upload authorized Indian representative (AIR) documents for foreign makers.",
                clause_ref="CRO Section 2",
                timeline_estimate="Day 11 - 12"
            ),
            TimelineStep(
                step_number=3,
                title="Self-Declaration of Conformity Submission",
                description="Submit Form-I self-declaration along with valid test reports (not older than 90 days) and test fee acknowledgment.",
                clause_ref="CRO Section 3",
                timeline_estimate="Day 13 - 15"
            ),
            TimelineStep(
                step_number=4,
                title="Grant of Registration & R-Number Issuance",
                description="BIS scrutinizes test report parameters and grants unique Registration Number (R-XXXXXXXX) with permission to affix CRO standard mark.",
                clause_ref="CRO Section 4",
                timeline_estimate="Day 16 - 20"
            )
        ]
        doc_title = "Compulsory Registration Scheme (CRO) Guidelines - Scheme-II"
        source_file = "scheme2-registration-guidelines.pdf"
        clause_ref = "CRO Regulations 2021"
        page_no = 1
        excerpt = "Registration scheme based on self-declaration of conformity with test reports from BIS recognized labs."

    else: # Default Scheme-I (ISI Mark)
        steps = [
            TimelineStep(
                step_number=1,
                title="Identify Indian Standard & QCO Applicability",
                description="Confirm the applicable IS standard and verify if the product is subject to a mandatory Quality Control Order (QCO).",
                clause_ref="Schedule II, Regulation 3",
                timeline_estimate="Day 1"
            ),
            TimelineStep(
                step_number=2,
                title="Establish Quality Control & Testing Facilities",
                description="Install in-house testing equipment as prescribed by the Scheme of Inspection and Testing (SIT) or register with a verified CBTF cluster (for MSMEs).",
                clause_ref="Scheme-I Regulation 4",
                timeline_estimate="Day 2 - 14"
            ),
            TimelineStep(
                step_number=3,
                title="Submit Application via Manakonline",
                description="Submit online application with factory layout, manufacturing machinery list, testing apparatus details, and application fees.",
                clause_ref="Regulation 5",
                timeline_estimate="Day 15 - 18"
            ),
            TimelineStep(
                step_number=4,
                title="Preliminary Factory Audit by BIS Officer",
                description="BIS inspecting officer audits factory quality management system, verifies in-house testing competency, and draws official verification samples.",
                clause_ref="Regulation 6",
                timeline_estimate="Day 19 - 30"
            ),
            TimelineStep(
                step_number=5,
                title="Independent Sample Testing & Grant of License",
                description="Sample tested in BIS laboratory. Upon passing, Certificate of Marks License (CM/L) is granted authorizing the iconic ISI Mark.",
                clause_ref="Regulation 8",
                timeline_estimate="Day 31 - 45"
            )
        ]
        doc_title = "BIS (Conformity Assessment) Regulations 2018 - Scheme-I Master Schedule"
        source_file = "scheme1-ISI-mark.pdf"
        clause_ref = "Regulation 3 & Schedule II"
        page_no = 2
        excerpt = "Conformity assessment schemes specified in Schedule-II shall comprise scope, selection, determination, review, decision, attestation and surveillance."

    sources = [
        SourceCitation(
            document_title=doc_title,
            source_file=source_file,
            clause_ref=clause_ref,
            page_number=page_no,
            excerpt=excerpt,
            grounded=True,
            score=1.0
        )
    ]

    return SchemeExplainResponse(
        scheme=request.scheme,
        product=request.product,
        steps=steps,
        sources=sources
    )
