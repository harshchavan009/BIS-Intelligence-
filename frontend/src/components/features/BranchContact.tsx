import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n/useTranslation';
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

interface BranchInfo {
  region: string;
  regionHi: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  jurisdiction: string;
  jurisdictionHi: string;
}

const REGIONAL_BRANCHES: BranchInfo[] = [
  {
    region: "Headquarters (Central Marks Department)",
    regionHi: "मुख्यालय (केंद्रीय चिह्न विभाग)",
    location: "New Delhi",
    address: "Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002",
    phone: "011-23230131, 011-23233375",
    email: "cmd1@bis.gov.in, info@bis.gov.in",
    jurisdiction: "All-India policy, statutory notifications, gazette orders",
    jurisdictionHi: "अखिल भारतीय नीति, वैधानिक अधिसूचनाएं, राजपत्र आदेश"
  },
  {
    region: "Northern Regional Office (NRO)",
    regionHi: "उत्तरी क्षेत्रीय कार्यालय (NRO)",
    location: "Chandigarh & Delhi NCR",
    address: "Plot No. 4-A, Sector 27-B, Madhya Marg, Chandigarh - 160019",
    phone: "0172-2650206, 0172-2650290",
    email: "nro@bis.gov.in",
    jurisdiction: "Punjab, Haryana, Himachal Pradesh, Jammu & Kashmir, Ladakh, Chandigarh, Delhi NCR",
    jurisdictionHi: "पंजाब, हरियाणा, हिमाचल प्रदेश, जम्मू और कश्मीर, लद्दाख, चंडीगढ़, दिल्ली एनसीआर"
  },
  {
    region: "Western Regional Office (WRO)",
    regionHi: "पश्चिमी क्षेत्रीय कार्यालय (WRO)",
    location: "Mumbai",
    address: "Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai - 400093",
    phone: "022-28329295, 022-28327858",
    email: "wro@bis.gov.in",
    jurisdiction: "Maharashtra, Gujarat, Goa, Madhya Pradesh (West), Daman & Diu",
    jurisdictionHi: "महाराष्ट्र, गुजरात, गोवा, मध्य प्रदेश (पश्चिम), दमन और दीव"
  },
  {
    region: "Eastern Regional Office (ERO)",
    regionHi: "पूर्वी क्षेत्रीय कार्यालय (ERO)",
    location: "Kolkata",
    address: "1/14 C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054",
    phone: "033-23207080, 033-23207085",
    email: "ero@bis.gov.in",
    jurisdiction: "West Bengal, Bihar, Jharkhand, Odisha, Assam, North-Eastern States",
    jurisdictionHi: "पश्चिम बंगाल, बिहार, झारखंड, ओडिशा, असम, पूर्वोत्तर राज्य"
  },
  {
    region: "Southern Regional Office (SRO)",
    regionHi: "दक्षिणी क्षेत्रीय कार्यालय (SRO)",
    location: "Chennai",
    address: "CIT Campus, IV Cross Road, Taramani, Chennai - 600113",
    phone: "044-22541216, 044-22541442",
    email: "sro@bis.gov.in",
    jurisdiction: "Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana, Puducherry",
    jurisdictionHi: "तमिलनाडु, कर्नाटक, केरल, आंध्र प्रदेश, तेलंगाना, पुडुचेरी"
  },
  {
    region: "Central Regional Office (CRO)",
    regionHi: "मध्य क्षेत्रीय कार्यालय (CRO)",
    location: "Bhopal / Lucknow",
    address: "Manak Bhavan, Arera Hills, Jail Road, Bhopal, Madhya Pradesh - 462011",
    phone: "0755-2553051, 0755-2553055",
    email: "cro@bis.gov.in",
    jurisdiction: "Madhya Pradesh (East), Uttar Pradesh, Chhattisgarh, Uttarakhand",
    jurisdictionHi: "मध्य प्रदेश (पूर्व), उत्तर प्रदेश, छत्तीसगढ़, उत्तराखंड"
  }
];

export const BranchContact: React.FC = () => {
  const { setActiveLegalModal } = useAppStore();
  const { language } = useTranslation();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredBranches = REGIONAL_BRANCHES.filter(b => 
    b.region.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.jurisdiction.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-indigo-deep text-white rounded-lg p-6 sm:p-8 border border-brass/30 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brass/20 text-brass border border-brass/40 text-xs font-mono mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'मानव सहायता एवं शाखा संपर्क' : 'Human Escalation & Branch Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-standard font-bold tracking-tight mb-2">
          {language === 'hi' ? 'बीआईएस शाखा कार्यालय एवं नागरिक सहायता केंद्र' : 'BIS Branch Offices & Citizen Helpdesk'}
        </h1>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {language === 'hi'
            ? 'क्या आपको एआई सहायक से उत्तर नहीं मिला? व्यक्तिगत मार्गदर्शन, लाइसेंस आवेदन या शिकायत हेतु अपने निकटतम बीआईएस क्षेत्रीय कार्यालय से संपर्क करें।'
            : 'Can\'t find your answer through the AI Assistant? Connect directly with your nearest Bureau of Indian Standards Regional or Branch Office for physical verification, licensing assistance, or officer guidance.'}
        </p>
      </div>

      {/* Emergency & National Toll-Free Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-line rounded-lg shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold tracking-wider text-stone-500">
              {language === 'hi' ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन' : 'National Toll-Free Helpline'}
            </div>
            <div className="text-base font-bold text-ink font-mono">
              1800-11-0420
            </div>
            <div className="text-[10.5px] text-stone-500">
              Mon–Fri, 9:00 AM – 5:30 PM
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-line rounded-lg shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-brass border border-brass/30 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold tracking-wider text-stone-500">
              {language === 'hi' ? 'आधिकारिक सहायता ईमेल' : 'Central Helpdesk Email'}
            </div>
            <div className="text-sm font-bold text-ink font-mono">
              helpdesk@bis.gov.in
            </div>
            <div className="text-[10.5px] text-stone-500">
              Response within 2 business days
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-line rounded-lg shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold tracking-wider text-stone-500">
              {language === 'hi' ? 'नागरिक शिकायत निवारण' : 'Citizen Grievance Redressal'}
            </div>
            <button
              onClick={() => setActiveLegalModal('grievance')}
              className="text-xs font-bold text-brass hover:underline flex items-center gap-1"
            >
              <span>{language === 'hi' ? 'शिकायत अधिकारी से संपर्क करें' : 'Contact Grievance Cell'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <div className="text-[10.5px] text-stone-500">
              Under Section 34 of BIS Act
            </div>
          </div>
        </div>
      </div>

      {/* Regional Branch Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif-standard text-ink">
            {language === 'hi' ? 'क्षेत्रीय एवं शाखा कार्यालय निर्देशिका' : 'Regional & Branch Office Directory'}
          </h2>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={language === 'hi' ? 'राज्य या शहर से खोजें...' : 'Filter by state or city...'}
            className="px-3 py-1.5 text-xs border border-line rounded bg-white w-64 focus:outline-none focus:border-brass"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBranches.map((branch) => (
            <div 
              key={branch.location}
              className="bg-white border border-line rounded-lg p-5 shadow-sm space-y-3 hover:border-brass/40 transition-colors"
            >
              <div className="border-b border-line/60 pb-2.5">
                <span className="text-xs font-semibold text-brass font-mono uppercase tracking-wider block">
                  {branch.location}
                </span>
                <h3 className="text-base font-bold font-serif-standard text-ink">
                  {language === 'hi' ? branch.regionHi : branch.region}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{branch.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                  <span className="font-mono text-ink">{branch.phone}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                  <span className="font-mono text-brass">{branch.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-line/50 text-[11px] text-stone-500">
                <span className="font-semibold text-stone-600 block mb-0.5">
                  {language === 'hi' ? 'अधिकार क्षेत्र:' : 'Territorial Jurisdiction:'}
                </span>
                <span>{language === 'hi' ? branch.jurisdictionHi : branch.jurisdiction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
