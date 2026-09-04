import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Layers, CheckCircle2, Clock, FileText, ChevronRight, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';

interface Step {
  step_number: number;
  title: string;
  description: string;
  clause_ref?: string;
  timeline_estimate?: string;
}

export const SchemeExplorer: React.FC = () => {
  const { openSource, setQueryPrefill, setActiveTab, language } = useAppStore();
  const [selectedScheme, setSelectedScheme] = useState('Scheme-IV');
  const [timelineSteps, setTimelineSteps] = useState<Step[]>([]);
  const [timelineSources, setTimelineSources] = useState<any[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  // Client-side bilingual fallback dataset ensures the procedural timeline never renders blank
  const fallbackSteps: Record<string, { en: Step[]; hi: Step[]; source: any }> = {
    'Scheme-IV': {
      en: [
        {
          step_number: 1,
          title: 'Product Testing & Valid Report Generation',
          description: 'Obtain test report(s) of the product from a BIS-recognized laboratory. As mandated by Clause 6.a, test reports shall not be more than 180 days old from the date of issue to receipt of application.',
          clause_ref: 'Clause 6.a',
          timeline_estimate: 'Day 1 - 15'
        },
        {
          step_number: 2,
          title: 'Online Application Submission (Form-I)',
          description: 'Submit Form-I application through Manakonline portal with required technical drawings, test reports, manufacturing process flow, and prescribed application fee.',
          clause_ref: 'Clause 1 & 2',
          timeline_estimate: 'Day 16 - 20'
        },
        {
          step_number: 3,
          title: 'Application Scrutiny by BIS CMD',
          description: 'BIS Central Marks Department scrutinizes document completeness, scope of product test parameters, and compliance with the applicable Indian Standard.',
          clause_ref: 'Clause 3',
          timeline_estimate: 'Day 21 - 27'
        },
        {
          step_number: 4,
          title: 'Factory Assessment & Sample Verification',
          description: 'BIS assessment officer visits manufacturing premises if required under specific product guidelines to verify quality controls and draw independent verification samples.',
          clause_ref: 'Clause 4 & 5',
          timeline_estimate: 'Day 28 - 38'
        },
        {
          step_number: 5,
          title: 'Execution of Declarations & Undertakings',
          description: 'Applicant executes statutory undertaking forms (Annexure-II & III) regarding conformity, traceability, and marking.',
          clause_ref: 'Annexure-II & III',
          timeline_estimate: 'Day 39 - 41'
        },
        {
          step_number: 6,
          title: 'Grant of Certificate of Conformity (CoC)',
          description: 'Upon satisfactory verification of all reports, BIS issues the Certificate of Conformity for the specified validity period or batch lot.',
          clause_ref: 'Clause 6',
          timeline_estimate: 'Day 42 - 45'
        }
      ],
      hi: [
        {
          step_number: 1,
          title: 'उत्पाद परीक्षण एवं वैध रिपोर्ट प्राप्ति',
          description: 'बीआईएस-मान्यता प्राप्त प्रयोगशाला से उत्पाद की परीक्षण रिपोर्ट प्राप्त करें। खंड 6.ए के अनुसार, आवेदन प्राप्ति तक परीक्षण रिपोर्ट 180 दिनों से अधिक पुरानी नहीं होनी चाहिए।',
          clause_ref: 'खंड 6.ए (Clause 6.a)',
          timeline_estimate: 'दिवस 1 - 15'
        },
        {
          step_number: 2,
          title: 'मानकऑनलाइन पोर्टल पर ऑनलाइन आवेदन (फॉर्म-I)',
          description: 'तकनीकी रेखाचित्र, परीक्षण रिपोर्ट, विनिर्माण प्रक्रिया प्रवाह और निर्धारित शुल्क के साथ मानकऑनलाइन पोर्टल पर फॉर्म-I आवेदन प्रस्तुत करें।',
          clause_ref: 'खंड 1 एवं 2',
          timeline_estimate: 'दिवस 16 - 20'
        },
        {
          step_number: 3,
          title: 'बीआईएस सीएमडी द्वारा आवेदन की संवीक्षा',
          description: 'बीआईएस केंद्रीय चिह्न विभाग (CMD) दस्तावेजों की पूर्णता, परीक्षण मापदंडों के दायरे और लागू भारतीय मानक के अनुपालन की जांच करता है।',
          clause_ref: 'खंड 3',
          timeline_estimate: 'दिवस 21 - 27'
        },
        {
          step_number: 4,
          title: 'कारखाना मूल्यांकन एवं सत्यापन नमूना चयन',
          description: 'विशिष्ट दिशानिर्देशों के तहत गुणवत्ता नियंत्रण का सत्यापन करने और स्वतंत्र नमूना लेने हेतु बीआईएस अधिकारी द्वारा विनिर्माण परिसर का निरीक्षण किया जाता है।',
          clause_ref: 'खंड 4 एवं 5',
          timeline_estimate: 'दिवस 28 - 38'
        },
        {
          step_number: 5,
          title: 'संवैधानिक घोषणाएं एवं वचनपत्र निष्पादन',
          description: 'अनुरूपता, ट्रेसबिलिटी और अंकन के संबंध में आवेदक द्वारा वैधानिक वचनपत्र प्रपत्र (परिशिष्ट-II एवं III) निष्पादित किए जाते हैं।',
          clause_ref: 'परिशिष्ट-II एवं III',
          timeline_estimate: 'दिवस 39 - 41'
        },
        {
          step_number: 6,
          title: 'अनुरूपता प्रमाणपत्र (CoC) जारी किया जाना',
          description: 'सभी रिपोर्टों के संतोषजनक सत्यापन के उपरांत, बीआईएस निर्धारित वैधता अवधि या बैच लॉट के लिए अनुरूपता प्रमाणपत्र (CoC) जारी करता है।',
          clause_ref: 'खंड 6',
          timeline_estimate: 'दिवस 42 - 45'
        }
      ],
      source: {
        document_title: 'Guidelines for Grant of Certificate of Conformity (CoC) under Scheme-IV',
        source_file: 'scheme4-conformity.pdf',
        clause_ref: 'CMD-I/2:16:1 (Clauses 1 to 6.a)',
        page_number: 2,
        excerpt: 'The test report(s) of the product shall not be more than 180 days old. The period for counting 180 days shall be from the date of issue of the test report(s) to the date of receipt of application.'
      }
    },
    'Scheme-I': {
      en: [
        {
          step_number: 1,
          title: 'Identify Indian Standard & QCO Applicability',
          description: 'Confirm the applicable IS standard and verify if the product is subject to a mandatory Quality Control Order (QCO).',
          clause_ref: 'Schedule II, Regulation 3',
          timeline_estimate: 'Day 1'
        },
        {
          step_number: 2,
          title: 'Establish Quality Control & Testing Facilities',
          description: 'Install in-house testing equipment as prescribed by the Scheme of Inspection and Testing (SIT) or register with a verified CBTF cluster (for MSMEs).',
          clause_ref: 'Scheme-I Regulation 4',
          timeline_estimate: 'Day 2 - 14'
        },
        {
          step_number: 3,
          title: 'Submit Application via Manakonline',
          description: 'Submit online application with factory layout, manufacturing machinery list, testing apparatus details, and application fees.',
          clause_ref: 'Regulation 5',
          timeline_estimate: 'Day 15 - 18'
        },
        {
          step_number: 4,
          title: 'Preliminary Factory Audit by BIS Officer',
          description: 'BIS inspecting officer audits factory quality management system, verifies in-house testing competency, and draws official verification samples.',
          clause_ref: 'Regulation 6',
          timeline_estimate: 'Day 19 - 30'
        },
        {
          step_number: 5,
          title: 'Independent Sample Testing & Grant of License',
          description: 'Sample tested in BIS laboratory. Upon passing, Certificate of Marks License (CM/L) is granted authorizing the iconic ISI Mark.',
          clause_ref: 'Regulation 8',
          timeline_estimate: 'Day 31 - 45'
        }
      ],
      hi: [
        {
          step_number: 1,
          title: 'भारतीय मानक एवं QCO प्रयोज्यता की पहचान',
          description: 'लागू भारतीय मानक (IS) की पुष्टि करें और जांचें कि क्या उत्पाद अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) के अधीन है।',
          clause_ref: 'अनुसूची II, विनियमन 3',
          timeline_estimate: 'दिवस 1'
        },
        {
          step_number: 2,
          title: 'गुणवत्ता नियंत्रण एवं परीक्षण सुविधाओं की स्थापना',
          description: 'निरीक्षण एवं परीक्षण योजना (SIT) के अनुसार इन-हाउस परीक्षण उपकरण स्थापित करें अथवा एमएसएमई हेतु सीबीटीएफ क्लस्टर से जुड़ें।',
          clause_ref: 'योजना-I विनियमन 4',
          timeline_estimate: 'दिवस 2 - 14'
        },
        {
          step_number: 3,
          title: 'मानकऑनलाइन के माध्यम से आवेदन जमा करना',
          description: 'कारखाना लेआउट, विनिर्माण मशीनरी सूची, परीक्षण उपकरण विवरण और आवेदन शुल्क के साथ ऑनलाइन आवेदन प्रस्तुत करें।',
          clause_ref: 'विनियमन 5',
          timeline_estimate: 'दिवस 15 - 18'
        },
        {
          step_number: 4,
          title: 'बीआईएस अधिकारी द्वारा प्रारंभिक कारखाना लेखापरीक्षा',
          description: 'बीआईएस निरीक्षण अधिकारी गुणवत्ता प्रबंधन प्रणाली का ऑडिट करता है, परीक्षण क्षमता सत्यापित करता है और आधिकारिक सत्यापन नमूना लेता है।',
          clause_ref: 'विनियमन 6',
          timeline_estimate: 'दिवस 19 - 30'
        },
        {
          step_number: 5,
          title: 'स्वतंत्र प्रयोगशाला परीक्षण एवं लाइसेंस जारी होना',
          description: 'नमूने का बीआईएस लैब में परीक्षण। उत्तीर्ण होने पर प्रतिष्ठित आईएसआई मार्क उपयोग हेतु सीएम/एल (CM/L) लाइसेंस प्रदान किया जाता है।',
          clause_ref: 'विनियमन 8',
          timeline_estimate: 'दिवस 31 - 45'
        }
      ],
      source: {
        document_title: 'BIS (Conformity Assessment) Regulations 2018 - Scheme-I Master Schedule',
        source_file: 'scheme1-ISI-mark.pdf',
        clause_ref: 'Regulation 3 & Schedule II',
        page_number: 2,
        excerpt: 'Conformity assessment schemes specified in Schedule-II shall comprise scope, selection, determination, review, decision, attestation and surveillance.'
      }
    },
    'Scheme-II': {
      en: [
        {
          step_number: 1,
          title: 'Product Testing in BIS Recognized Lab',
          description: 'Submit sample to BIS-recognized lab for testing against applicable IS/IEC standard (e.g. IS/IEC 62368-1). Test report is issued.',
          clause_ref: 'CRO Section 1',
          timeline_estimate: 'Day 1 - 10'
        },
        {
          step_number: 2,
          title: 'Online Profile Creation on CRS Portal',
          description: 'Register manufacturer account on crsbis.in portal and upload authorized Indian representative (AIR) documents for foreign makers.',
          clause_ref: 'CRO Section 2',
          timeline_estimate: 'Day 11 - 12'
        },
        {
          step_number: 3,
          title: 'Self-Declaration of Conformity Submission',
          description: 'Submit Form-I self-declaration along with valid test reports (not older than 90 days) and test fee acknowledgment.',
          clause_ref: 'CRO Section 3',
          timeline_estimate: 'Day 13 - 15'
        },
        {
          step_number: 4,
          title: 'Grant of Registration & R-Number Issuance',
          description: 'BIS scrutinizes test report parameters and grants unique Registration Number (R-XXXXXXXX) with permission to affix CRO standard mark.',
          clause_ref: 'CRO Section 4',
          timeline_estimate: 'Day 16 - 20'
        }
      ],
      hi: [
        {
          step_number: 1,
          title: 'बीआईएस मान्यता प्राप्त प्रयोगशाला में उत्पाद परीक्षण',
          description: 'लागू आईएस/आईईसी मानक (उदा. IS/IEC 62368-1) के तहत बीआईएस-मान्यता प्राप्त प्रयोगशाला में परीक्षण हेतु नमूना प्रस्तुत करें और रिपोर्ट प्राप्त करें।',
          clause_ref: 'सीआरओ अनुभाग 1',
          timeline_estimate: 'दिवस 1 - 10'
        },
        {
          step_number: 2,
          title: 'सीआरएस पोर्टल पर ऑनलाइन प्रोफाइल पंजीकरण',
          description: 'crsbis.in पोर्टल पर निर्माता खाता पंजीकृत करें और विदेशी निर्माताओं हेतु अधिकृत भारतीय प्रतिनिधि (AIR) दस्तावेज अपलोड करें।',
          clause_ref: 'सीआरओ अनुभाग 2',
          timeline_estimate: 'दिवस 11 - 12'
        },
        {
          step_number: 3,
          title: 'अनुरूपता का स्व-घोषणा पत्र प्रस्तुत करना',
          description: 'वैध परीक्षण रिपोर्ट (90 दिनों से अधिक पुरानी नहीं) और निर्धारित परीक्षण शुल्क पावती के साथ फॉर्म-I स्व-घोषणा जमा करें।',
          clause_ref: 'सीआरओ अनुभाग 3',
          timeline_estimate: 'दिवस 13 - 15'
        },
        {
          step_number: 4,
          title: 'पंजीकरण अनुदान एवं R-नंबर आवंटन',
          description: 'बीआईएस परीक्षण रिपोर्ट मापदंडों की संवीक्षा करता है और सीआरएस मानक चिह्न उपयोग की अनुमति के साथ विशिष्ट पंजीकरण संख्या (R-XXXXXXXX) जारी करता है।',
          clause_ref: 'सीआरओ अनुभाग 4',
          timeline_estimate: 'दिवस 16 - 20'
        }
      ],
      source: {
        document_title: 'Compulsory Registration Scheme (CRO) Guidelines - Scheme-II',
        source_file: 'scheme2-registration-guidelines.pdf',
        clause_ref: 'CRO Regulations 2021',
        page_number: 1,
        excerpt: 'Registration scheme based on self-declaration of conformity with test reports from BIS recognized labs.'
      }
    },
    'CBTF': {
      en: [
        {
          step_number: 1,
          title: 'MSME Cluster Identification & Registration',
          description: 'MSME units within the cluster verify valid Udyam registration and establish or associate with an approved Cluster Based Test Facility (CBTF).',
          clause_ref: 'Clause 1 & 2.(i)',
          timeline_estimate: 'Week 1'
        },
        {
          step_number: 2,
          title: 'Setup of Retained In-House Testing Equipment',
          description: 'Ensure mandatory retained testing apparatus is installed in-house: dimensional gauges, visual inspection up to 10x magnification, and packaging tests.',
          clause_ref: 'Clause 2.(i)',
          timeline_estimate: 'Week 2'
        },
        {
          step_number: 3,
          title: 'Execution of Tripartite Agreement with CBTF',
          description: 'Execute legal agreement between MSME unit, CBTF management, and testing operator specifying testing scope, priority slots, and records maintenance.',
          clause_ref: 'Clause 3 & Annexure-A',
          timeline_estimate: 'Week 3'
        },
        {
          step_number: 4,
          title: 'Joint BIS Verification Audit of CBTF',
          description: 'BIS technical officers inspect the CBTF against the Annexure-B evaluation checklist (calibration, chemist competency, ambient controls).',
          clause_ref: 'Clause 4 & Annexure-B',
          timeline_estimate: 'Week 4 - 5'
        },
        {
          step_number: 5,
          title: 'Facility Approval & Scheme-I License Linkage',
          description: 'BIS assigns cluster facility code. MSME license granted under Scheme-I utilizing CBTF reports for routine Scheme of Inspection and Testing (SIT).',
          clause_ref: 'Clause 5',
          timeline_estimate: 'Week 6'
        }
      ],
      hi: [
        {
          step_number: 1,
          title: 'एमएसएमई क्लस्टर पहचान एवं पंजीकरण',
          description: 'क्लस्टर के भीतर एमएसएमई इकाइयां वैध उद्यम पंजीकरण की पुष्टि करती हैं और अनुमोदित क्लस्टर आधारित परीक्षण सुविधा (CBTF) से संबद्ध होती हैं।',
          clause_ref: 'खंड 1 एवं 2.(i)',
          timeline_estimate: 'सप्ताह 1'
        },
        {
          step_number: 2,
          title: 'अनिवार्य इन-हाउस परीक्षण उपकरण स्थापना',
          description: 'अनिवार्य इन-हाउस परीक्षण उपकरण स्थापित रखें: आयामी गेज, 10x आवर्धन तक दृश्य निरीक्षण, और बुनियादी पैकेजिंग परीक्षण।',
          clause_ref: 'खंड 2.(i)',
          timeline_estimate: 'सप्ताह 2'
        },
        {
          step_number: 3,
          title: 'सीबीटीएफ के साथ त्रिपक्षीय अनुबंध निष्पादन',
          description: 'एमएसएमई इकाई, सीबीटीएफ प्रबंधन और परीक्षण ऑपरेटर के बीच परीक्षण के दायरे, प्राथमिकता स्लॉट और रिकॉर्ड रखरखाव को निर्दिष्ट करते हुए कानूनी अनुबंध करें।',
          clause_ref: 'खंड 3 एवं अनुबंध-ए',
          timeline_estimate: 'सप्ताह 3'
        },
        {
          step_number: 4,
          title: 'सीबीटीएफ का बीआईएस संयुक्त सत्यापन ऑडिट',
          description: 'बीआईएस तकनीकी अधिकारी मूल्यांकन चेकलिस्ट (अंशांकन, रसायनज्ञ योग्यता, परिवेश नियंत्रण) के आधार पर सीबीटीएफ का निरीक्षण करते हैं।',
          clause_ref: 'खंड 4 एवं अनुबंध-बी',
          timeline_estimate: 'सप्ताह 4 - 5'
        },
        {
          step_number: 5,
          title: 'सुविधा स्वीकृति एवं योजना-I लाइसेंस संबद्धता',
          description: 'बीआईएस क्लस्टर सुविधा कोड प्रदान करता है। नियमित परीक्षण के लिए सीबीटीएफ रिपोर्ट का उपयोग करते हुए योजना-I के तहत लाइसेंस मिलता है।',
          clause_ref: 'खंड 5',
          timeline_estimate: 'सप्ताह 6'
        }
      ],
      source: {
        document_title: 'Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs',
        source_file: 'cbtf-msme-guidelines.pdf',
        clause_ref: 'CMD-I/2:12:8 (Clause 2 & 4)',
        page_number: 2,
        excerpt: 'For the purpose of operation of SIT by MSMEs, the CBTFs may be treated as in-house test facility except for dimensional checks and visual examination.'
      }
    }
  };

  const schemesOverview = [
    {
      id: 'Scheme-I',
      name: language === 'hi' ? 'योजना – I (ISI मार्क / उत्पाद प्रमाणन)' : 'Scheme – I (ISI Mark / Product Certification)',
      tagline: language === 'hi' ? 'तृतीय-पक्ष कारखाना प्रमाणन एवं प्रतिष्ठित ISI मार्क उपयोग का लाइसेंस' : 'Third-party factory certification & license to use the iconic ISI Mark',
      eligibility: language === 'hi' ? 'घरेलू एवं विदेशी विनिर्माता (FMCS)। एमएसएमई क्लस्टर (CBTF) पात्र।' : 'Domestic & Foreign Manufacturers (FMCS). MSME Cluster Test Facility (CBTF) eligible.',
      timeline: language === 'hi' ? '30–60 कार्य दिवस (एमएसएमई हेतु 30 दिवस)' : '30–60 working days (Fast-track for MSMEs: 30 days)',
      badge: language === 'hi' ? 'मानक चिह्न' : 'Iconic Standard Mark',
      governing: 'Schedule II, Scheme I of BIS Regulations, 2018'
    },
    {
      id: 'Scheme-II',
      name: language === 'hi' ? 'योजना – II (अनिवार्य पंजीकरण / CRO)' : 'Scheme – II (Compulsory Registration / CRO)',
      tagline: language === 'hi' ? 'मान्यता प्राप्त प्रयोगशालाओं की परीक्षण रिपोर्ट पर आधारित स्व-घोषणा' : 'Self-declaration of conformity based on test reports from BIS recognized labs',
      eligibility: language === 'hi' ? 'इलेक्ट्रॉनिक्स, आईटी सामान, सोलर पीवी एवं स्मार्ट वियरेबल्स' : 'Manufacturers of Electronics, IT Goods, Solar PV, and Smart Wearables',
      timeline: language === 'hi' ? '15–20 कार्य दिवस' : '15–20 working days',
      badge: 'R-XXXXXXXX Mark',
      governing: 'MeitY & DPIIT Compulsory Registration Orders'
    },
    {
      id: 'Scheme-IV',
      name: language === 'hi' ? 'योजना – IV (अनुरूपता प्रमाणपत्र / CoC)' : 'Scheme – IV (Certificate of Conformity / CoC)',
      tagline: language === 'hi' ? '180-दिवसीय परीक्षण रिपोर्ट वैधता के साथ बैच अथवा परेषण-वार प्रमाणन' : 'Batch or consignment-wise certification with 180-day test report validity',
      eligibility: language === 'hi' ? 'पूर्ण संयंत्र लाइसेंस के बिना अनुरूपता प्रमाणपत्र चाहने वाले विनिर्माता' : 'Manufacturers needing conformity certificates without full plant licensing',
      timeline: language === 'hi' ? '20–45 कार्य दिवस' : '20–45 working days',
      badge: language === 'hi' ? 'CoC प्रमाणपत्र' : 'CoC Certificate',
      governing: 'CMD-I/2:16:1 Guidelines (02 May 2019)'
    },
    {
      id: 'CBTF',
      name: language === 'hi' ? 'CBTF (एमएसएमई हेतु क्लस्टर आधारित परीक्षण)' : 'CBTF (Cluster Based Test Facility for MSMEs)',
      tagline: language === 'hi' ? 'एमएसएमई पूंजीगत व्यय कम करने हेतु औद्योगिक क्लस्टरों में साझा परीक्षण' : 'Shared testing facilities in industrial clusters to slash MSME capital costs',
      eligibility: language === 'hi' ? 'क्लस्टर में वैध उद्यम पंजीकरण धारक सूक्ष्म, लघु एवं मध्यम उद्यम' : 'Micro, Small & Medium Enterprises holding valid Udyam registration in a cluster',
      timeline: language === 'hi' ? 'सुविधा सत्यापन: 3–4 सप्ताह' : 'Facility Verification: 3–4 weeks',
      badge: language === 'hi' ? 'MSME रियायत' : 'MSME Concession',
      governing: 'Ref: CMD-I/2:12:8 (30 April 2021)'
    }
  ];

  const fetchTimeline = async (schemeId: string) => {
    // Immediately display verified fallback to prevent any blank step rows
    const curLang = language === 'hi' ? 'hi' : 'en';
    const fallback = fallbackSteps[schemeId] || fallbackSteps['Scheme-IV'];
    setTimelineSteps(fallback[curLang]);
    if (fallback.source) {
      setTimelineSources([fallback.source]);
    }

    setLoadingSteps(true);
    try {
      const res = await fetch('/api/schemes/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme: schemeId, language: language })
      });
      const data = await res.json();
      if (data.steps && data.steps.length > 0) {
        setTimelineSteps(data.steps);
      }
      if (data.sources && data.sources.length > 0) {
        setTimelineSources(data.sources);
      }
    } catch (e) {
      console.error('Error fetching scheme timeline:', e);
      // Fallback remains active seamlessly
    } finally {
      setLoadingSteps(false);
    }
  };

  useEffect(() => {
    fetchTimeline(selectedScheme);
  }, [selectedScheme, language]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm">
        <div className="flex items-center gap-2 mb-1">
          <SealMotif size={20} />
          <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
            Conformity Assessment Framework
          </span>
        </div>
        <h1 className="text-2xl font-serif text-ink">
          {language === 'hi' ? 'बीआईएस प्रमाणन योजनाएं एवं चरण-दर-चरण प्रक्रिया' : 'BIS Certification Schemes & Process Timeline'}
        </h1>
        <p className="text-xs text-ink-muted mt-1 max-w-3xl">
          {language === 'hi'
            ? 'अपनी विनिर्माण श्रेणी के लिए उपयुक्त योजना चुनें। पात्रता, परीक्षण आवश्यकताएं और आधिकारिक विनियामक अनुक्रम देखें।'
            : 'Compare the governing conformity assessment frameworks under Schedule II of the BIS Regulations 2018. Inspect real procedural timelines derived directly from official guidelines.'}
        </p>
      </div>

      {/* Scheme Comparison Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {schemesOverview.map((scheme) => {
          const isSelected = selectedScheme === scheme.id;
          return (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-white border-brass ring-2 ring-brass/20 shadow-paper'
                  : 'bg-white border-line hover:border-brass/40 shadow-paper-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-brass bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                    {scheme.badge}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-brass animate-pulse"></span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-ink font-serif leading-snug">
                  {scheme.name}
                </h3>
                <p className="text-[11.5px] text-gray-600 leading-relaxed">
                  {scheme.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-line/50 space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Eligibility:</span>
                  <span className="text-ink font-medium text-[11px]">{scheme.eligibility}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Duration:</span>
                  <span className="text-indigo-deep font-semibold text-[11px]">{scheme.timeline}</span>
                </div>
              </div>

              <button
                className={`w-full py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-brass text-white'
                    : 'bg-paper text-ink hover:bg-paper-dark'
                }`}
              >
                <span>{isSelected ? 'Viewing Timeline' : 'Explore Timeline'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step Interactive Timeline */}
      <div className="bg-white border border-line rounded-lg p-6 sm:p-8 shadow-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-line gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brass font-semibold">
              {language === 'hi' ? 'चरण-दर-चरण विनियामक प्रवाह' : 'Step-by-Step Regulatory Flow'}
            </span>
            <h2 className="text-xl font-serif text-ink">
              {language === 'hi' ? `${selectedScheme} हेतु आधिकारिक विनियामक अनुक्रम` : `Official Procedural Sequence for ${selectedScheme}`}
            </h2>
          </div>
          {timelineSources.length > 0 && (
            <button
              onClick={() => openSource(timelineSources[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-paper-dark border border-line rounded text-xs font-medium text-ink transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-brass" />
              <span>{language === 'hi' ? 'स्रोत खंड देखें' : 'Inspect Source'} ({timelineSources[0].clause_ref})</span>
            </button>
          )}
        </div>

        {loadingSteps ? (
          <div className="py-12 text-center text-xs text-gray-400 font-mono">
            {language === 'hi' ? 'आधिकारिक विनियमों से प्रक्रिया अनुक्रम लोड हो रहा है...' : 'Loading regulatory timeline from official clauses...'}
          </div>
        ) : (
          <div className="mt-8 space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-line">
            {timelineSteps.map((step) => (
              <div key={step.step_number} className="relative pl-10 group">
                {/* Step Circle Indicator */}
                <div className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-paper border-2 border-brass text-brass flex items-center justify-center text-xs font-bold font-mono group-hover:bg-brass group-hover:text-white transition-colors">
                  {step.step_number}
                </div>

                <div className="bg-paper p-4 rounded-lg border border-line space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink font-serif">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {step.timeline_estimate && (
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {step.timeline_estimate}
                        </span>
                      )}
                      {step.clause_ref && (
                        <span className="text-[10.5px] font-mono text-brass bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                          {step.clause_ref}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer call to action */}
        <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {language === 'hi' ? 'क्या आपको इस योजना के तहत किसी उत्पाद हेतु लाइसेंसिंग मार्गदर्शन चाहिए?' : 'Need licensing assistance for a specific product under this scheme?'}
          </span>
          <button
            onClick={() => {
              setQueryPrefill(`Guide me through the licensing process for a product under ${selectedScheme}.`);
              setActiveTab('chat');
            }}
            className="px-4 py-2 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>{language === 'hi' ? 'सहायक से चैट में पूछें' : 'Ask Assistant in Chat'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
