from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.app.core.security import rate_limiter, get_client_ip, sanitize_text

router = APIRouter()

class CMLVerifyRequest(BaseModel):
    cml_number: str = Field(..., description="CM/L License number to verify")

class HUIDVerifyRequest(BaseModel):
    huid: str = Field(..., description="6-digit alphanumeric HUID code")

# Pre-defined authoritative demo seed set
CML_SEED_REGISTRY: Dict[str, Dict[str, Any]] = {
    "CM/L-8400123": {
        "cml_number": "CM/L-8400123",
        "status": "AUTHENTIC LICENSEE",
        "standard": "IS 269: 2015 (Ordinary Portland Cement)",
        "company": "National Cements & Infrastructure Ltd.",
        "factory_address": "Plot 42, Industrial Growth Center, RIICO, Rajasthan - 302013",
        "valid_till": "31 December 2026",
        "variety": "53 Grade OPC",
        "scheme": "Scheme-I (ISI Mark)"
    },
    "CM/L-7200456": {
        "cml_number": "CM/L-7200456",
        "status": "AUTHENTIC LICENSEE",
        "standard": "IS 1786: 2008 (High Strength Deformed Steel Bars Fe 500D)",
        "company": "Jindal Steels & Alloys Ltd.",
        "factory_address": "Survey 118, Heavy Industrial Area, Raigarh, Chhattisgarh - 496001",
        "valid_till": "15 November 2026",
        "variety": "Fe 500D TMT Re-bars",
        "scheme": "Scheme-I (ISI Mark)"
    },
    "CM/L-9100789": {
        "cml_number": "CM/L-9100789",
        "status": "AUTHENTIC LICENSEE",
        "standard": "IS 14534: 1998 (Recycled Plastics Guideline)",
        "company": "EcoPolymer Technologies LLP",
        "factory_address": "Plot 9B, Green Eco Zone, Vapi, Gujarat - 396195",
        "valid_till": "30 June 2026",
        "variety": "Grade-A Post Consumer Pellets",
        "scheme": "Scheme-I (ISI Mark)"
    },
    "CM/L-6300112": {
        "cml_number": "CM/L-6300112",
        "status": "AUTHENTIC LICENSEE",
        "standard": "IS 302-2-3: 2017 (Safety of Electric Iron Appliances)",
        "company": "Bajaj Consumer Care Ltd.",
        "factory_address": "Sector 5, Industrial Estate, Haridwar, Uttarakhand - 249403",
        "valid_till": "31 March 2027",
        "variety": "Steam & Dry Household Iron",
        "scheme": "Scheme-I (ISI Mark)"
    }
}

HUID_SEED_REGISTRY: Dict[str, Dict[str, Any]] = {
    "AB7842": {
        "huid": "AB7842",
        "status": "VERIFIED GENUINE HALLMARK",
        "article_type": "Gold Ring / Jewellery",
        "purity": "22K916 (91.6% Pure Gold)",
        "jeweller_name": "Kalyan Heritage Jewellers Pvt. Ltd.",
        "jeweller_reg": "REG-AHC-DEL-2023-991",
        "hallmarking_center": "Central Assaying & Hallmarking Centre, Delhi",
        "hallmarked_date": "14 January 2026"
    },
    "KJ9012": {
        "huid": "KJ9012",
        "status": "VERIFIED GENUINE HALLMARK",
        "article_type": "Gold Necklace / Chain",
        "purity": "18K750 (75.0% Pure Gold)",
        "jeweller_name": "Tanishq Fine Jewellery Ltd.",
        "jeweller_reg": "REG-AHC-MUM-2022-412",
        "hallmarking_center": "Western Regional Assaying Bureau, Mumbai",
        "hallmarked_date": "02 February 2026"
    },
    "DL3456": {
        "huid": "DL3456",
        "status": "VERIFIED GENUINE HALLMARK",
        "article_type": "Gold Bangle / Kada",
        "purity": "14K585 (58.5% Pure Gold)",
        "jeweller_name": "Malabar Gold & Diamonds Ltd.",
        "jeweller_reg": "REG-AHC-BLR-2024-105",
        "hallmarking_center": "South India Assaying & Refineries, Bangalore",
        "hallmarked_date": "20 November 2025"
    }
}

SIMULATED_NOTE = (
    "Demo Mode — Simulated Lookup. Not connected to the live BIS-CARE / Manakonline registry. "
    "Response is generated from a local demo dataset for illustration."
)

@router.post("/verify/cml")
async def verify_cml(request_data: CMLVerifyRequest, request: Request):
    """
    Simulated verification for CM/L license numbers.
    Constrained to explicit seed set for demonstration honesty.
    """
    client_ip = get_client_ip(request)
    rate_limiter.check_rate_limit(client_ip)

    clean_cml = sanitize_text(request_data.cml_number, max_length=30).upper().strip()
    # Normalize common variations (e.g. 8400123 -> CM/L-8400123)
    if not clean_cml.startswith("CM/L-") and clean_cml.isdigit():
        clean_cml = f"CM/L-{clean_cml}"

    if clean_cml in CML_SEED_REGISTRY:
        return {
            "found": True,
            "simulated": True,
            "disclaimer": SIMULATED_NOTE,
            "data": CML_SEED_REGISTRY[clean_cml]
        }
    else:
        return {
            "found": False,
            "simulated": True,
            "cml_number": clean_cml,
            "disclaimer": SIMULATED_NOTE,
            "message": f"License '{clean_cml}' not found in demo dataset. Connect the live Manakonline registry to verify real licenses."
        }

@router.post("/verify/huid")
async def verify_huid(request_data: HUIDVerifyRequest, request: Request):
    """
    Simulated verification for 6-digit HUID codes.
    Constrained to explicit seed set for demonstration honesty.
    """
    client_ip = get_client_ip(request)
    rate_limiter.check_rate_limit(client_ip)

    clean_huid = sanitize_text(request_data.huid, max_length=10).upper().strip()

    if clean_huid in HUID_SEED_REGISTRY:
        return {
            "found": True,
            "simulated": True,
            "disclaimer": SIMULATED_NOTE,
            "data": HUID_SEED_REGISTRY[clean_huid]
        }
    else:
        return {
            "found": False,
            "simulated": True,
            "huid": clean_huid,
            "disclaimer": SIMULATED_NOTE,
            "message": f"HUID '{clean_huid}' not found in demo dataset. Connect the live BIS-CARE registry to verify real hallmarks."
        }
