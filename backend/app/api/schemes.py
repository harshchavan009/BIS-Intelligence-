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
    is_hi = (request.language or "").lower() == "hi"

    if "IV" in scheme_id or "4" in scheme_id:
        if is_hi:
            steps = [
                TimelineStep(
                    step_number=1,
                    title="उत्पाद परीक्षण एवं वैध रिपोर्ट प्राप्ति",
                    description="बीआईएस-मान्यता प्राप्त प्रयोगशाला से उत्पाद की परीक्षण रिपोर्ट प्राप्त करें। खंड 6.ए के अनुसार, आवेदन प्राप्ति तक परीक्षण रिपोर्ट 180 दिनों से अधिक पुरानी नहीं होनी चाहिए।",
                    clause_ref="खंड 6.ए (Clause 6.a)",
                    timeline_estimate="दिवस 1 - 15"
                ),
                TimelineStep(
                    step_number=2,
                    title="मानकऑनलाइन पोर्टल पर ऑनलाइन आवेदन (फॉर्म-I)",
                    description="तकनीकी रेखाचित्र, परीक्षण रिपोर्ट, विनिर्माण प्रक्रिया प्रवाह और निर्धारित शुल्क के साथ मानकऑनलाइन पोर्टल पर फॉर्म-I आवेदन प्रस्तुत करें।",
                    clause_ref="खंड 1 एवं 2",
                    timeline_estimate="दिवस 16 - 20"
                ),
                TimelineStep(
                    step_number=3,
                    title="बीआईएस सीएमडी द्वारा आवेदन की संवीक्षा",
                    description="बीआईएस केंद्रीय चिह्न विभाग (CMD) दस्तावेजों की पूर्णता, परीक्षण मापदंडों के दायरे और लागू भारतीय मानक के अनुपालन की जांच करता है।",
                    clause_ref="खंड 3",
                    timeline_estimate="दिवस 21 - 27"
                ),
                TimelineStep(
                    step_number=4,
                    title="कारखाना मूल्यांकन एवं सत्यापन नमूना चयन",
                    description="विशिष्ट दिशानिर्देशों के तहत गुणवत्ता नियंत्रण का सत्यापन करने और स्वतंत्र नमूना लेने हेतु बीआईएस अधिकारी द्वारा विनिर्माण परिसर का निरीक्षण किया जाता है।",
                    clause_ref="खंड 4 एवं 5",
                    timeline_estimate="दिवस 28 - 38"
                ),
                TimelineStep(
                    step_number=5,
                    title="संवैधानिक घोषणाएं एवं वचनपत्र निष्पादन",
                    description="अनुरूपता, ट्रेसबिलिटी और अंकन के संबंध में आवेदक द्वारा वैधानिक वचनपत्र प्रपत्र (परिशिष्ट-II एवं III) निष्पादित किए जाते हैं।",
                    clause_ref="परिशिष्ट-II एवं III",
                    timeline_estimate="दिवस 39 - 41"
                ),
                TimelineStep(
                    step_number=6,
                    title="अनुरूपता प्रमाणपत्र (CoC) जारी किया जाना",
                    description="सभी रिपोर्टों के संतोषजनक सत्यापन के उपरांत, बीआईएस निर्धारित वैधता अवधि या बैच लॉट के लिए अनुरूपता प्रमाणपत्र (CoC) जारी करता है।",
                    clause_ref="खंड 6",
                    timeline_estimate="दिवस 42 - 45"
                )
            ]
        else:
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
        doc_title = "Guidelines for Grant of Certificate of Conformity (CoC) under Scheme-IV" if not is_hi else "योजना-IV के अंतर्गत अनुरूपता प्रमाणपत्र (CoC) दिशानिर्देश"
        source_file = "scheme4-conformity.pdf"
        clause_ref = "CMD-I/2:16:1 (Clauses 1 to 6.a)"
        page_no = 2
        excerpt = "The test report(s) of the product shall not be more than 180 days old. The period for counting 180 days shall be from the date of issue of the test report(s) to the date of receipt of application."
    
    elif "CBTF" in scheme_id or "LAB" in scheme_id or "MSME" in scheme_id:
        if is_hi:
            steps = [
                TimelineStep(
                    step_number=1,
                    title="एमएसएमई क्लस्टर पहचान एवं पंजीकरण",
                    description="क्लस्टर के भीतर एमएसएमई इकाइयां वैध उद्यम पंजीकरण की पुष्टि करती हैं और अनुमोदित क्लस्टर आधारित परीक्षण सुविधा (CBTF) से संबद्ध होती हैं।",
                    clause_ref="खंड 1 एवं 2.(i)",
                    timeline_estimate="सप्ताह 1"
                ),
                TimelineStep(
                    step_number=2,
                    title="अनिवार्य इन-हाउस परीक्षण उपकरण स्थापना",
                    description="अनिवार्य इन-हाउस परीक्षण उपकरण स्थापित रखें: आयामी गेज, 10x आवर्धन तक दृश्य निरीक्षण, और बुनियादी पैकेजिंग परीक्षण।",
                    clause_ref="खंड 2.(i)",
                    timeline_estimate="सप्ताह 2"
                ),
                TimelineStep(
                    step_number=3,
                    title="सीबीटीएफ के साथ त्रिपक्षीय अनुबंध निष्पादन",
                    description="एमएसएमई इकाई, सीबीटीएफ प्रबंधन और परीक्षण ऑपरेटर के बीच परीक्षण के दायरे, प्राथमिकता स्लॉट और रिकॉर्ड रखरखाव को निर्दिष्ट करते हुए कानूनी अनुबंध करें।",
                    clause_ref="खंड 3 एवं अनुबंध-ए",
                    timeline_estimate="सप्ताह 3"
                ),
                TimelineStep(
                    step_number=4,
                    title="सीबीटीएफ का बीआईएस संयुक्त सत्यापन ऑडिट",
                    description="बीआईएस तकनीकी अधिकारी मूल्यांकन चेकलिस्ट (अंशांकन, रसायनज्ञ योग्यता, परिवेश नियंत्रण) के आधार पर सीबीटीएफ का निरीक्षण करते हैं।",
                    clause_ref="खंड 4 एवं अनुबंध-बी",
                    timeline_estimate="सप्ताह 4 - 5"
                ),
                TimelineStep(
                    step_number=5,
                    title="सुविधा स्वीकृति एवं योजना-I लाइसेंस संबद्धता",
                    description="बीआईएस क्लस्टर सुविधा कोड प्रदान करता है। नियमित परीक्षण के लिए सीबीटीएफ रिपोर्ट का उपयोग करते हुए योजना-I के तहत लाइसेंस मिलता है।",
                    clause_ref="खंड 5",
                    timeline_estimate="सप्ताह 6"
                )
            ]
        else:
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
        doc_title = "Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs" if not is_hi else "एमएसएमई द्वारा क्लस्टर आधारित परीक्षण सुविधा (CBTF) दिशानिर्देश"
        source_file = "cbtf-msme-guidelines.pdf"
        clause_ref = "CMD-I/2:12:8 (Clause 2 & 4)"
        page_no = 2
        excerpt = "For the purpose of operation of SIT by MSMEs, the CBTFs may be treated as in-house test facility except for dimensional checks and visual examination."

    elif "II" in scheme_id or "2" in scheme_id or "CRO" in scheme_id:
        if is_hi:
            steps = [
                TimelineStep(
                    step_number=1,
                    title="बीआईएस मान्यता प्राप्त प्रयोगशाला में उत्पाद परीक्षण",
                    description="लागू आईएस/आईईसी मानक (उदा. IS/IEC 62368-1) के तहत बीआईएस-मान्यता प्राप्त प्रयोगशाला में परीक्षण हेतु नमूना प्रस्तुत करें और रिपोर्ट प्राप्त करें।",
                    clause_ref="सीआरओ अनुभाग 1",
                    timeline_estimate="दिवस 1 - 10"
                ),
                TimelineStep(
                    step_number=2,
                    title="सीआरएस पोर्टल पर ऑनलाइन प्रोफाइल पंजीकरण",
                    description="crsbis.in पोर्टल पर निर्माता खाता पंजीकृत करें और विदेशी निर्माताओं हेतु अधिकृत भारतीय प्रतिनिधि (AIR) दस्तावेज अपलोड करें।",
                    clause_ref="सीआरओ अनुभाग 2",
                    timeline_estimate="दिवस 11 - 12"
                ),
                TimelineStep(
                    step_number=3,
                    title="अनुरूपता का स्व-घोषणा पत्र प्रस्तुत करना",
                    description="वैध परीक्षण रिपोर्ट (90 दिनों से अधिक पुरानी नहीं) और निर्धारित परीक्षण शुल्क पावती के साथ फॉर्म-I स्व-घोषणा जमा करें।",
                    clause_ref="सीआरओ अनुभाग 3",
                    timeline_estimate="दिवस 13 - 15"
                ),
                TimelineStep(
                    step_number=4,
                    title="पंजीकरण अनुदान एवं R-नंबर आवंटन",
                    description="बीआईएस परीक्षण रिपोर्ट मापदंडों की संवीक्षा करता है और सीआरएस मानक चिह्न उपयोग की अनुमति के साथ विशिष्ट पंजीकरण संख्या (R-XXXXXXXX) जारी करता है।",
                    clause_ref="सीआरओ अनुभाग 4",
                    timeline_estimate="दिवस 16 - 20"
                )
            ]
        else:
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
        doc_title = "Compulsory Registration Scheme (CRO) Guidelines - Scheme-II" if not is_hi else "अनिवार्य पंजीकरण योजना (CRO) दिशानिर्देश - योजना-II"
        source_file = "scheme2-registration-guidelines.pdf"
        clause_ref = "CRO Regulations 2021"
        page_no = 1
        excerpt = "Registration scheme based on self-declaration of conformity with test reports from BIS recognized labs."

    else: # Default Scheme-I (ISI Mark)
        if is_hi:
            steps = [
                TimelineStep(
                    step_number=1,
                    title="भारतीय मानक एवं QCO प्रयोज्यता की पहचान",
                    description="लागू भारतीय मानक (IS) की पुष्टि करें और जांचें कि क्या उत्पाद अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) के अधीन है।",
                    clause_ref="अनुसूची II, विनियमन 3",
                    timeline_estimate="दिवस 1"
                ),
                TimelineStep(
                    step_number=2,
                    title="गुणवत्ता नियंत्रण एवं परीक्षण सुविधाओं की स्थापना",
                    description="निरीक्षण एवं परीक्षण योजना (SIT) के अनुसार इन-हाउस परीक्षण उपकरण स्थापित करें अथवा एमएसएमई हेतु सीबीटीएफ क्लस्टर से जुड़ें।",
                    clause_ref="योजना-I विनियमन 4",
                    timeline_estimate="दिवस 2 - 14"
                ),
                TimelineStep(
                    step_number=3,
                    title="मानकऑनलाइन के माध्यम से आवेदन जमा करना",
                    description="कारखाना लेआउट, विनिर्माण मशीनरी सूची, परीक्षण उपकरण विवरण और आवेदन शुल्क के साथ ऑनलाइन आवेदन प्रस्तुत करें।",
                    clause_ref="विनियमन 5",
                    timeline_estimate="दिवस 15 - 18"
                ),
                TimelineStep(
                    step_number=4,
                    title="बीआईएस अधिकारी द्वारा प्रारंभिक कारखाना लेखापरीक्षा",
                    description="बीआईएस निरीक्षण अधिकारी गुणवत्ता प्रबंधन प्रणाली का ऑडिट करता है, परीक्षण क्षमता सत्यापित करता है और आधिकारिक सत्यापन नमूना लेता है।",
                    clause_ref="विनियमन 6",
                    timeline_estimate="दिवस 19 - 30"
                ),
                TimelineStep(
                    step_number=5,
                    title="स्वतंत्र प्रयोगशाला परीक्षण एवं लाइसेंस जारी होना",
                    description="नमूने का बीआईएस लैब में परीक्षण। उत्तीर्ण होने पर प्रतिष्ठित आईएसआई मार्क उपयोग हेतु सीएम/एल (CM/L) लाइसेंस प्रदान किया जाता है।",
                    clause_ref="विनियमन 8",
                    timeline_estimate="दिवस 31 - 45"
                )
            ]
        else:
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
        doc_title = "BIS (Conformity Assessment) Regulations 2018 - Scheme-I Master Schedule" if not is_hi else "बीआईएस (अनुरूपता मूल्यांकन) विनियम 2018 - योजना-I मास्टर अनुसूची"
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
