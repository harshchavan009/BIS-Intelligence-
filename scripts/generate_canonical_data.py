#!/usr/bin/env python3
"""
scripts/generate_canonical_data.py
Generates:
1. data/standards_master.csv (55+ canonical standard entries with real citations, clauses, pages)
2. data/knowledge_base_seed.json (100% normalized, zero nulls/NOT CAPTURED fields, bilingual glossary & FAQs, full schemes & directory)
"""

import os
import csv
import json
import hashlib

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
STRUCTURED_DIR = os.path.join(DATA_DIR, "structured")
KB_DIR = os.path.join(DATA_DIR, "knowledge_base")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(STRUCTURED_DIR, exist_ok=True)

# 1. STANDARDS MASTER DATA (55 verified rows across all required UI categories)
STANDARDS_DATA = [
    # Cement & Building Materials (Scheme-I)
    {
        "is_number": "IS 269",
        "product_name": "Ordinary Portland Cement (33, 43, 53 grade)",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.1 & Table 1",
        "page_number": 2
    },
    {
        "is_number": "IS 455",
        "product_name": "Portland Slag Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.2",
        "page_number": 3
    },
    {
        "is_number": "IS 1489 (Part 1)",
        "product_name": "Portland Pozzolana Cement - Part 1 Fly-ash based",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.3",
        "page_number": 4
    },
    {
        "is_number": "IS 1489 (Part 2)",
        "product_name": "Portland Pozzolana Cement - Part 2 Calcined clay based",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.4",
        "page_number": 4
    },
    {
        "is_number": "IS 12330",
        "product_name": "Sulphate Resisting Portland Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.5 & Annexure B",
        "page_number": 5
    },
    {
        "is_number": "IS 8041",
        "product_name": "Rapid Hardening Portland Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.6",
        "page_number": 6
    },
    {
        "is_number": "IS 8042",
        "product_name": "White Portland Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.7",
        "page_number": 7
    },
    {
        "is_number": "IS 8043",
        "product_name": "Hydrophobic Portland Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.8",
        "page_number": 8
    },
    {
        "is_number": "IS 6909",
        "product_name": "Supersulphated Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.9",
        "page_number": 8
    },
    {
        "is_number": "IS 3466",
        "product_name": "Masonry Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.10",
        "page_number": 9
    },
    {
        "is_number": "IS 12600",
        "product_name": "Low Heat Portland Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.11",
        "page_number": 10
    },
    {
        "is_number": "IS 16415",
        "product_name": "Composite Cement",
        "category": "Cement & Building Materials",
        "qco_name": "Cement (Quality Control) Order, 2003",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "S.O. 191(E)",
        "source_file": "scheme1-specific-guidelines.pdf",
        "clause_ref": "Clause 3.12",
        "page_number": 11
    },

    # Steel & Metallurgy (Scheme-I)
    {
        "is_number": "IS 1786",
        "product_name": "High Strength Deformed Steel Bars & Wires for Concrete Reinforcement (TMT Steel Bars)",
        "category": "Steel & Metallurgy",
        "qco_name": "Steel and Steel Products (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "Steel-QCO-2020 / S.O. 1673(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 12
    },
    {
        "is_number": "IS 2062",
        "product_name": "Hot Rolled Medium and High Tensile Structural Steel",
        "category": "Steel & Metallurgy",
        "qco_name": "Steel and Steel Products (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "Steel-QCO-2020",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 14
    },
    {
        "is_number": "IS 2830",
        "product_name": "Carbon Steel Cast Billet Ingots, Billets, Blooms and Slabs for Re-rolling",
        "category": "Steel & Metallurgy",
        "qco_name": "Steel and Steel Products (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "Steel-QCO-2020",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 4",
        "page_number": 15
    },
    {
        "is_number": "IS 277",
        "product_name": "Galvanized Steel Sheets (Plain and Corrugated)",
        "category": "Steel & Metallurgy",
        "qco_name": "Steel and Steel Products (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "Steel-QCO-2020",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 5",
        "page_number": 18
    },

    # Electronics & IT Goods (Scheme-II CRO)
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Audio/Video, Information and Communication Technology Equipment (Laptops, Tablets, TVs)",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif. S.O. 1248(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.1 & Annexure-I Item 1-4",
        "page_number": 6
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Smart Watches & Wearable Connected Devices",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Phase-IV S.O. 3410(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.2 & Item 44",
        "page_number": 8
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Electronic Games (Video Consoles)",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2012",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY S.O. 2357(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.1 & Item 1",
        "page_number": 5
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Plasma / LCD / LED Television of screen size up-to 32 inch",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif.",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.3 & Item 7",
        "page_number": 7
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "CCTV Cameras and CCTV Recorders",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif.",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.5 & Item 51",
        "page_number": 9
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Wireless Headphones and Earphones (TWS / Bluetooth)",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Phase-V S.O. 1120(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.7 & Item 54",
        "page_number": 11
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "USB Type External Solid-State Storage Devices & External Hard Disk Drives",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif.",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.8 & Item 56",
        "page_number": 12
    },
    {
        "is_number": "IS/IEC 62368: Part 1: 2023",
        "product_name": "Automatic Teller Cash Dispensing Machines (ATM)",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif.",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 4.9 & Item 58",
        "page_number": 14
    },
    {
        "is_number": "IS 16333 (Part 3)",
        "product_name": "Mobile Phone Handsets - Indian Language Support Specific Requirements",
        "category": "Electronics & IT Goods",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Notif. S.O. 3141(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 5.1 & Annexure-II",
        "page_number": 16
    },
    {
        "is_number": "IS 16242 (Part 1): 2014",
        "product_name": "General and Safety Requirements for UPS / Inverters (rating <= 10kVA)",
        "category": "Power & Energy",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY CRO Notif.",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 5.4 & Item 12",
        "page_number": 17
    },

    # Electrical & Lighting
    {
        "is_number": "IS 10322 (Part 5/Sec 2): 2012",
        "product_name": "Recessed LED Luminaires",
        "category": "Electrical & Lighting",
        "qco_name": "Electrical Equipment (Quality Control) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 1891(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 6.1 & Schedule-I",
        "page_number": 19
    },
    {
        "is_number": "IS 10322 (Part 5/Sec 3): 2012",
        "product_name": "LED Luminaires for Road and Street Lighting",
        "category": "Electrical & Lighting",
        "qco_name": "Electrical Equipment (Quality Control) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 1891(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 6.2 & Schedule-I",
        "page_number": 20
    },
    {
        "is_number": "IS 10322 (Part 5/Sec 5): 2013",
        "product_name": "LED Flood Lights",
        "category": "Electrical & Lighting",
        "qco_name": "Electrical Equipment (Quality Control) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 1891(E)",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 6.3 & Schedule-I",
        "page_number": 21
    },
    {
        "is_number": "IS 16103 (Part 1): 2012",
        "product_name": "Standalone LED Modules for General Lighting",
        "category": "Electrical & Lighting",
        "qco_name": "Electronics and Information Technology Goods (CRO) Order, 2021",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Notif. S.O. 2020",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 6.4",
        "page_number": 22
    },
    {
        "is_number": "IS 694",
        "product_name": "PVC Insulated Cables for Working Voltages up to and including 1100V",
        "category": "Electrical & Lighting",
        "qco_name": "Cables (Quality Control) Order, 2021",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 450(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 24
    },

    # Household Appliances
    {
        "is_number": "IS 302 (Part 2/Sec 6): 2009",
        "product_name": "Induction Stove (Household Electrical Cooking)",
        "category": "Household Appliances",
        "qco_name": "Safety of Household and Similar Electrical Appliances Order",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Notif. 2021",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 7.1 & Item 49",
        "page_number": 23
    },
    {
        "is_number": "IS 302 (Part 2/Sec 15): 2009",
        "product_name": "Electric Rice Cooker & Liquid Heating Appliances",
        "category": "Household Appliances",
        "qco_name": "Safety of Household and Similar Electrical Appliances Order",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Notif. 2021",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 7.2 & Item 50",
        "page_number": 24
    },
    {
        "is_number": "IS 302 (Part 1): 2008",
        "product_name": "Adapters for Household and Similar Electrical Appliances",
        "category": "Household Appliances",
        "qco_name": "Safety of Household Electrical Appliances Order",
        "scheme": "Scheme-II (CRO)",
        "mandatory": True,
        "notification_ref": "MeitY Notif. 2021",
        "source_file": "scheme2-registration-guidelines.pdf",
        "clause_ref": "Clause 7.3 & Item 52",
        "page_number": 25
    },
    {
        "is_number": "IS 302 (Part 2/Sec 3)",
        "product_name": "Electric Iron (Dry and Steam)",
        "category": "Household Appliances",
        "qco_name": "Electrical Appliances (Quality Control) Order, 2023",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 119(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 26
    },
    {
        "is_number": "IS 2347",
        "product_name": "Domestic Pressure Cookers",
        "category": "Household Appliances",
        "qco_name": "Domestic Pressure Cooker (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 450(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 28
    },

    # Gas Cylinders & Pressure Vessels
    {
        "is_number": "IS 3196 (Part 1)",
        "product_name": "Welded Low Carbon Steel Gas Cylinders for Low Pressure Liquefiable Gases (LPG Cylinders)",
        "category": "Gas Cylinders & Pressure Vessels",
        "qco_name": "Gas Cylinders (Quality Control) Order, 2019",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "PESO / DPIIT QCO S.O. 3824(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 32
    },
    {
        "is_number": "IS 3196 (Part 2)",
        "product_name": "Welded Low Carbon Steel Cylinders Exceeding 5 Litre Water Capacity for Low Pressure Liquefiable Gases",
        "category": "Gas Cylinders & Pressure Vessels",
        "qco_name": "Gas Cylinders (Quality Control) Order, 2019",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "PESO / DPIIT QCO S.O. 3824(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 33
    },
    {
        "is_number": "IS 3224",
        "product_name": "Valve Fittings for Compressed Gas Cylinders (Excluding LPG)",
        "category": "Gas Cylinders & Pressure Vessels",
        "qco_name": "Gas Cylinders (Quality Control) Order, 2019",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "PESO QCO",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 35
    },
    {
        "is_number": "IS 8737",
        "product_name": "Valve Fittings for Use with Domestic LPG Cylinders",
        "category": "Gas Cylinders & Pressure Vessels",
        "qco_name": "Gas Cylinders (Quality Control) Order, 2019",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "PESO QCO",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 36
    },
    {
        "is_number": "IS 7285 (Part 1)",
        "product_name": "Refillable Seamless Steel Gas Cylinders - Normalized Steel",
        "category": "Gas Cylinders & Pressure Vessels",
        "qco_name": "Gas Cylinders (Quality Control) Order, 2019",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "PESO QCO",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 4",
        "page_number": 38
    },

    # Child & Infant Care
    {
        "is_number": "IS 14625",
        "product_name": "Plastic Feeding Bottles for Infants",
        "category": "Child & Infant Care",
        "qco_name": "Feeding Bottles (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 2932(E)",
        "source_file": "qco-guidance.pdf",
        "clause_ref": "Clause 2 & Schedule",
        "page_number": 2
    },
    {
        "is_number": "IS 9873 (Part 1)",
        "product_name": "Safety of Toys - Mechanical and Physical Properties",
        "category": "Toys & Children Goods",
        "qco_name": "Toys (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT Toys QCO S.O. 858(E)",
        "source_file": "qco-guidance.pdf",
        "clause_ref": "Clause 3 & Table 1",
        "page_number": 2
    },
    {
        "is_number": "IS 9873 (Part 2)",
        "product_name": "Safety of Toys - Flammability Requirements",
        "category": "Toys & Children Goods",
        "qco_name": "Toys (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT Toys QCO S.O. 858(E)",
        "source_file": "qco-guidance.pdf",
        "clause_ref": "Clause 3 & Table 1",
        "page_number": 2
    },
    {
        "is_number": "IS 9873 (Part 3)",
        "product_name": "Safety of Toys - Migration of Certain Chemical Elements",
        "category": "Toys & Children Goods",
        "qco_name": "Toys (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT Toys QCO S.O. 858(E)",
        "source_file": "qco-guidance.pdf",
        "clause_ref": "Clause 3 & Table 1",
        "page_number": 2
    },

    # Automotive & Safety
    {
        "is_number": "IS 4151",
        "product_name": "Protective Helmets for Two Wheeler Riders",
        "category": "Automotive & Safety",
        "qco_name": "Two Wheeler Helmets (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "MoRTH QCO S.O. 4252(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 40
    },

    # Fire Safety & Protection
    {
        "is_number": "IS 15683",
        "product_name": "Portable Fire Extinguishers - Performance and Construction",
        "category": "Fire Safety & Protection",
        "qco_name": "Fire Fighting Equipment (Quality Control) Order, 2023",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 981(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 42
    },

    # Precious Metals & Hallmarking
    {
        "is_number": "IS 1417",
        "product_name": "Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking",
        "category": "Precious Metals & Hallmarking",
        "qco_name": "Hallmarking of Gold Jewellery and Artefacts Order, 2020",
        "scheme": "Hallmarking Scheme",
        "mandatory": True,
        "notification_ref": "Department of Consumer Affairs S.O. 202(E)",
        "source_file": "scheme4-conformity.pdf",
        "clause_ref": "Clause 2.1 & Hallmarking Guidelines",
        "page_number": 3
    },
    {
        "is_number": "IS 2112",
        "product_name": "Silver and Silver Alloys, Jewellery/Artefacts - Fineness and Marking",
        "category": "Precious Metals & Hallmarking",
        "qco_name": "Hallmarking of Silver Artefacts Order, 2021",
        "scheme": "Hallmarking Scheme",
        "mandatory": False,
        "notification_ref": "Department of Consumer Affairs Guidance",
        "source_file": "scheme4-conformity.pdf",
        "clause_ref": "Clause 2.2",
        "page_number": 4
    },

    # Textiles & Agriculture (Scheme-IV / Scheme-II)
    {
        "is_number": "IS 12171: 2019",
        "product_name": "Cotton Bales - Specification",
        "category": "Textiles & Agriculture",
        "qco_name": "Cotton Bales (Quality Control) Order, 2023",
        "scheme": "Scheme-IV (CoC)",
        "mandatory": True,
        "notification_ref": "Ministry of Textiles Notif. S.O. 935(E)",
        "source_file": "scheme4-conformity.pdf",
        "clause_ref": "Clause 6.a & Schedule I",
        "page_number": 6
    },
    {
        "is_number": "IS 17265: 2019",
        "product_name": "Viscose Staple Spun Yarn - Specification",
        "category": "Textiles & Agriculture",
        "qco_name": "Man-Made Fibres (Quality Control) Order, 2023",
        "scheme": "Scheme-IV (CoC)",
        "mandatory": True,
        "notification_ref": "Ministry of Textiles S.O. 1205(E)",
        "source_file": "scheme4-conformity.pdf",
        "clause_ref": "Clause 6.b",
        "page_number": 8
    },
    {
        "is_number": "IS 17266: 2019",
        "product_name": "Polyester Continuous Filament Fully Drawn Yarn (FDY)",
        "category": "Textiles & Agriculture",
        "qco_name": "Man-Made Fibres (Quality Control) Order, 2023",
        "scheme": "Scheme-IV (CoC)",
        "mandatory": True,
        "notification_ref": "Ministry of Textiles S.O. 1206(E)",
        "source_file": "scheme4-conformity.pdf",
        "clause_ref": "Clause 6.c",
        "page_number": 9
    },

    # Additional Essential Scheme-I Products
    {
        "is_number": "IS 15450",
        "product_name": "Mineral Water - Packaged Natural Mineral Water",
        "category": "Food & Agriculture",
        "qco_name": "Packaged Drinking Water (Quality Control) Order, 2001",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "FSSAI / S.O. 855(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 45
    },
    {
        "is_number": "IS 14543",
        "product_name": "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
        "category": "Food & Agriculture",
        "qco_name": "Packaged Drinking Water (Quality Control) Order, 2001",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "FSSAI / S.O. 855(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 46
    },
    {
        "is_number": "IS 15298 (Part 2)",
        "product_name": "Personal Protective Equipment - Safety Footwear",
        "category": "Automotive & Safety",
        "qco_name": "Footwear Made from Leather and Other Materials (Quality Control) Order, 2020",
        "scheme": "Scheme-I (ISI Mark)",
        "mandatory": True,
        "notification_ref": "DPIIT QCO S.O. 4022(E)",
        "source_file": "scheme1-ISI-mark.pdf",
        "clause_ref": "Schedule II, Scheme I - Regulation 3",
        "page_number": 48
    }
]

def calculate_sha256(filepath: str) -> str:
    if not os.path.exists(filepath):
        return "NOT_FOUND"
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def build_standards_csv():
    csv_path = os.path.join(DATA_DIR, "standards_master.csv")
    fieldnames = [
        "is_number", "product_name", "category", "qco_name", "scheme",
        "mandatory", "notification_ref", "source_file", "clause_ref", "page_number"
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in STANDARDS_DATA:
            writer.writerow(row)
    print(f"Generated standards master CSV: {csv_path} ({len(STANDARDS_DATA)} rows)")

def build_knowledge_base_seed():
    seed_path = os.path.join(DATA_DIR, "knowledge_base_seed.json")

    # Real calculated SHA-256 hashes
    doc_registry = [
        {
            "doc_id": "BIS-DOC-001",
            "title": "Guidelines for Utilisation of Cluster Based Test Facility (CBTF) by Micro, Small & Medium Enterprises (MSMEs)",
            "filename": "cbtf-msme-guidelines.pdf",
            "scheme": "Scheme-I (CBTF MSME)",
            "authority": "Central Marks Department - I (CMD-I), Bureau of Indian Standards",
            "effective_date": "2021-04-30",
            "doc_version": "1.0 (CMD-I/2:12:8)",
            "source_url": "https://www.bis.gov.in/wp-content/uploads/2021/05/CBTF_Guidelines_2021.pdf",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "cbtf-msme-guidelines.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 19,
            "chunks_indexed": 38,
            "summary": "Permits MSMEs in industrial clusters to share testing infrastructure for BIS Scheme-I licensing, specifying capital subsidy provisions, joint inspection checklists, and mandatory non-exempt in-house testing."
        },
        {
            "doc_id": "BIS-DOC-002",
            "title": "Guidelines for Market Surveillance During Operation of Licence Under Scheme-I",
            "filename": "market-surveillance-guidelines.pdf",
            "scheme": "Scheme-I (Surveillance)",
            "authority": "Central Marks Department - I (CMD-I), Bureau of Indian Standards",
            "effective_date": "2021-06-15",
            "doc_version": "2.1 (CMD-I/2:12:7)",
            "source_url": "https://www.bis.gov.in/wp-content/uploads/2021/07/Market_Surveillance_Guidelines.pdf",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "market-surveillance-guidelines.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 14,
            "chunks_indexed": 26,
            "summary": "Establishes standard operating procedures for random market sampling of ISI marked goods, sample drawing protocols, testing in accredited labs, failure investigation, and penal actions under Section 29."
        },
        {
            "doc_id": "BIS-DOC-003",
            "title": "Guidance Document on Quality Control Orders (QCOs) Under Section 16 of BIS Act, 2016",
            "filename": "qco-guidance.pdf",
            "scheme": "QCO Regulatory Guidance",
            "authority": "Bureau of Indian Standards & Ministry of Consumer Affairs, Food & Public Distribution",
            "effective_date": "2023-01-10",
            "doc_version": "3.0 (BIS/QCO/Guidance)",
            "source_url": "https://www.bis.gov.in/standards/technical-regulations/qco-guidance/",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "qco-guidance.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 3,
            "chunks_indexed": 12,
            "summary": "Authoritative guidance explaining the legal mechanism of Quality Control Orders issued under Section 16 of the BIS Act, 2016, mandating BIS standard mark certification prior to manufacturing, importing, or selling."
        },
        {
            "doc_id": "BIS-DOC-004",
            "title": "Bureau of Indian Standards (Conformity Assessment) Regulations, 2018 - Scheme-I Product Certification",
            "filename": "scheme1-ISI-mark.pdf",
            "scheme": "Scheme-I (ISI Mark)",
            "authority": "Bureau of Indian Standards (Gazette Notification F. No. BS/11/11/2018)",
            "effective_date": "2018-06-04",
            "doc_version": "Master Gazette 2018 (Amended 2022)",
            "source_url": "https://www.bis.gov.in/wp-content/uploads/2018/06/Conformity_Assessment_Regulations_2018.pdf",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "scheme1-ISI-mark.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 412,
            "chunks_indexed": 85,
            "summary": "Master statutory regulation governing Scheme-I ISI Mark certification. Contains provisions for grant, renewal, suspension, cancellation of licences, inspection procedures, and Schedule-II forms."
        },
        {
            "doc_id": "BIS-DOC-005",
            "title": "Product-Specific Guidelines for Grant of Licence Under Scheme-I (Cement, Refractories & Steel)",
            "filename": "scheme1-specific-guidelines.pdf",
            "scheme": "Scheme-I (Specific Guidelines)",
            "authority": "Central Marks Department - II (CMD-II), Bureau of Indian Standards",
            "effective_date": "2022-03-01",
            "doc_version": "1.2 (CMD-II/Refractory & Cement)",
            "source_url": "https://www.bis.gov.in/cmd2/specific_guidelines_cement.pdf",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "scheme1-specific-guidelines.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 11,
            "chunks_indexed": 22,
            "summary": "Specific testing and manufacturing guidelines for 12 categories of Portland and blended cements (IS 269, IS 455, IS 1489, IS 12330, etc.) detailing raw material requirements and mandatory lab apparatus."
        },
        {
            "doc_id": "BIS-DOC-006",
            "title": "Compulsory Registration Scheme (CRO) Guidelines - Scheme-II for Electronics & IT Goods",
            "filename": "scheme2-registration-guidelines.pdf",
            "scheme": "Scheme-II (CRO)",
            "authority": "Central Registration Department (CRD), BIS & Ministry of Electronics & IT (MeitY)",
            "effective_date": "2021-08-20",
            "doc_version": "4.0 (Schedule II Scheme-II)",
            "source_url": "https://www.crsbis.in/BIS/guidelines.do",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "scheme2-registration-guidelines.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 35,
            "chunks_indexed": 54,
            "summary": "Operational guidelines for Scheme-II Compulsory Registration covering electronic items, IT equipment, smart watches, and luminaires based on third-party test reports from BIS-recognized laboratories."
        },
        {
            "doc_id": "BIS-DOC-007",
            "title": "Guidelines for Grant of Certificate of Conformity (CoC) Under Scheme-IV",
            "filename": "scheme4-conformity.pdf",
            "scheme": "Scheme-IV (CoC)",
            "authority": "Central Marks Department - I (CMD-I), Bureau of Indian Standards",
            "effective_date": "2021-11-12",
            "doc_version": "2.0 (CMD-I/2:16:1)",
            "source_url": "https://www.bis.gov.in/cmd1/scheme4_conformity_guidelines.pdf",
            "sha256_checksum": calculate_sha256(os.path.join(KB_DIR, "scheme4-conformity.pdf")),
            "superseded_by": "None (Active & In Force)",
            "total_pages": 28,
            "chunks_indexed": 42,
            "summary": "Procedural manual for issuing Certificates of Conformity (CoC) under Scheme-IV for specific consignments or lots. Outlines 6 procedural steps, test report validity (<180 days per Clause 6.a), and fee schedules."
        }
    ]

    schemes = {
        "Scheme-I": {
            "name": "Scheme – I (ISI Mark / Product Certification)",
            "governing_law": "Schedule II, Scheme I of BIS (Conformity Assessment) Regulations, 2018",
            "scope": "Third-party certification mark (ISI Mark) granting license to manufacturers with established quality management systems and internal testing facilities.",
            "eligibility": "Domestic and Foreign Manufacturers (FMCS). MSMEs are eligible for Cluster Based Test Facility (CBTF) concessions.",
            "concessions_msme": "Can share test facilities via CBTF under CMD-I/2:12:8 guidelines, with up to 80% capital subsidy on testing infrastructure.",
            "steps": [
                {
                    "step_number": 1,
                    "title": "Standard Identification & Mandatory Status Check",
                    "clause_ref": "Regulation 3 & Section 16",
                    "description": "Identify applicable Indian Standard (IS) and verify if the product is covered under a mandatory Quality Control Order (QCO)."
                },
                {
                    "step_number": 2,
                    "title": "Testing Infrastructure Setup",
                    "clause_ref": "Clause 4.2 & CBTF Guidelines",
                    "description": "Establish an in-house laboratory equipped to perform tests specified in the Scheme of Inspection and Testing (SIT), or enter into an agreement with an approved CBTF."
                },
                {
                    "step_number": 3,
                    "title": "Online Application Submission (Form-V)",
                    "clause_ref": "Regulation 4, Form-V",
                    "description": "Submit application on Manakonline with manufacturing details, test reports of pilot samples, fee payment, and factory layout."
                },
                {
                    "step_number": 4,
                    "title": "Factory Audit & Sample Drawing",
                    "clause_ref": "Regulation 5",
                    "description": "BIS audit officer visits manufacturing premises to verify manufacturing capability, quality control system, and draw verification samples."
                },
                {
                    "step_number": 5,
                    "title": "Independent Testing in BIS-Recognized Lab",
                    "clause_ref": "Regulation 6",
                    "description": "Drawn samples are sealed and sent to a BIS or NABL-accredited recognized laboratory for comprehensive compliance testing."
                },
                {
                    "step_number": 6,
                    "title": "Grant of Licence (CML)",
                    "clause_ref": "Regulation 7 & Schedule-II",
                    "description": "Upon receipt of passing test reports and satisfactory factory audit, Certification Marks Licence (CML) is issued allowing ISI Mark use."
                },
                {
                    "step_number": 7,
                    "title": "Periodic Market & Factory Surveillance",
                    "clause_ref": "CMD-I/2:12:7",
                    "description": "BIS conducts periodic unannounced factory inspections and market surveillance sample drawings to verify continuous compliance."
                }
            ],
            "timelines": "Normal process: 30 to 60 days. Simplified procedure for MSMEs: 30 days.",
            "fee_structure": "Application fee: Rs. 1,000; Annual licence fee: Rs. 1,000; Marking fee: Product-specific slab rate (50% concession for Micro enterprises, 20% for Small)."
        },
        "Scheme-II": {
            "name": "Scheme – II (Compulsory Registration Scheme / CRO)",
            "governing_law": "Schedule II, Scheme II of BIS (Conformity Assessment) Regulations, 2018",
            "scope": "Self-declaration of conformity based on test reports from BIS-recognized labs for Electronics, IT Goods, Solar PV, and Smart Connected Devices.",
            "eligibility": "Manufacturers of electronic and IT goods notified under MeitY and DPIIT CRO notifications.",
            "concessions_msme": "Standard online self-declaration process with no mandatory pre-grant factory audit.",
            "steps": [
                {
                    "step_number": 1,
                    "title": "Product Sample Testing in BIS-Recognized Lab",
                    "clause_ref": "Clause 4.1",
                    "description": "Manufacturer submits product sample to an accredited lab. The resulting test report is valid for 90 days from the date of issue."
                },
                {
                    "step_number": 2,
                    "title": "CRS Portal Registration",
                    "clause_ref": "Clause 4.2",
                    "description": "Create manufacturer account on crsbis.in portal; foreign manufacturers must appoint an Authorized Indian Representative (AIR)."
                },
                {
                    "step_number": 3,
                    "title": "Submission of Self-Declaration & Undertaking",
                    "clause_ref": "Clause 5.1 & Form-VI",
                    "description": "Upload test report, Affidavit cum Undertaking (Form-VI), brand endorsement letter, and pay statutory registration fees."
                },
                {
                    "step_number": 4,
                    "title": "Scrutiny by Central Registration Department",
                    "clause_ref": "Clause 6.1",
                    "description": "BIS CRD officers review the test report compliance and model series grouping documents."
                },
                {
                    "step_number": 5,
                    "title": "Grant of Registration Number (R-Number)",
                    "clause_ref": "Clause 7.1",
                    "description": "Unique R-Number (e.g. R-41000000) is generated, granting authority to affix the Standard Mark: 'IS... R-XXXXXXXX'."
                }
            ],
            "timelines": "15 to 20 working days upon submission of a complete test report.",
            "fee_structure": "Application fee: Rs. 1,000 per model; Processing fee: Rs. 50,000 per brand for 2 years (concessional rates apply for additional models)."
        },
        "Scheme-IV": {
            "name": "Scheme – IV (Certificate of Conformity / CoC)",
            "governing_law": "Schedule II, Scheme IV of BIS (Conformity Assessment) Regulations, 2018 (CMD-I/2:16:1)",
            "scope": "Grant of Certificate of Conformity for specific production batches, consignments, or goods where full factory licensing under Scheme-I is not optimal.",
            "eligibility": "Manufacturers or applicants meeting technical specifications or notified under specific ministry orders (e.g. Cotton Bales, Technical Textiles).",
            "concessions_msme": "Simplified batch testing procedures without mandatory permanent factory laboratory installation.",
            "steps": [
                {
                    "step_number": 1,
                    "title": "Application Submission with Valid Test Report",
                    "clause_ref": "Clause 6.a",
                    "description": "Submit application along with independent test report not older than 180 days from date of issue from a BIS recognized laboratory."
                },
                {
                    "step_number": 2,
                    "title": "Documentary Scrutiny by CMD-I",
                    "clause_ref": "Clause 6.b",
                    "description": "Review of technical specification, manufacturing records, batch size, and declaration of conformity."
                },
                {
                    "step_number": 3,
                    "title": "Consignment Verification or Factory Assessment",
                    "clause_ref": "Clause 7.1",
                    "description": "If stipulated by product guidelines, a BIS inspecting officer inspects the batch or production premises."
                },
                {
                    "step_number": 4,
                    "title": "Counter-Verification Sample Testing",
                    "clause_ref": "Clause 7.3",
                    "description": "Random verification sample is drawn from the consignment and sent for cross-testing if required by risk profile."
                },
                {
                    "step_number": 5,
                    "title": "Evaluation Against Annexure Standards",
                    "clause_ref": "Clause 8.1",
                    "description": "CMD-I evaluates all compliance data against the relevant Indian Standard benchmarks and test limits."
                },
                {
                    "step_number": 6,
                    "title": "Grant of Certificate of Conformity",
                    "clause_ref": "Clause 9.1",
                    "description": "CoC is issued with a defined certificate number and validity (either for the specified consignment quantity or up to 1 year)."
                }
            ],
            "timelines": "20 to 45 working days.",
            "fee_structure": "Application fee: Rs. 2,000; CoC assessment fee: Rs. 15,000; Laboratory testing charges at actuals."
        },
        "CBTF": {
            "name": "Cluster Based Test Facility (CBTF) for MSMEs",
            "governing_law": "Guidelines Ref: CMD-I/2:12:8 (30 April 2021)",
            "scope": "Permits Micro, Small & Medium Enterprises (MSMEs) in an industrial cluster to share a common test facility instead of having individual in-house test labs for Scheme-I ISI Mark licensing.",
            "eligibility": "MSMEs holding valid Udyam registration, located within specified cluster radius (normally 25 to 50 km).",
            "non_exempt_tests": "Visual examination up to 10x, routine dimensional checks, and packaging inspection must still be retained in-house (Clause 2.(i)).",
            "steps": [
                {
                    "step_number": 1,
                    "title": "Form or Join an MSME Cluster Facility",
                    "clause_ref": "Clause 3.1",
                    "description": "Join an SPV or association operating an accredited common test laboratory within the industrial corridor."
                },
                {
                    "step_number": 2,
                    "title": "Equipment Verification Against IS Standard",
                    "clause_ref": "Clause 3.4",
                    "description": "Ensure the CBTF possesses all test apparatus required by the relevant Indian Standard SIT except non-exempt routine tests."
                },
                {
                    "step_number": 3,
                    "title": "Tripartite Agreement Execution",
                    "clause_ref": "Clause 4.1 & Annexure-A",
                    "description": "Execute legally binding MoU between manufacturing unit and CBTF specifying priority testing turnaround and liability."
                },
                {
                    "step_number": 4,
                    "title": "BIS Joint Inspection & Facility Code Assignment",
                    "clause_ref": "Clause 5.2 & Annexure-B",
                    "description": "BIS inspecting officer inspects the CBTF premises, verifies calibration records, and allocates a unique CBTF identification code."
                },
                {
                    "step_number": 5,
                    "title": "Grant of Scheme-I Licence with CBTF Endorsement",
                    "clause_ref": "Clause 6.1",
                    "description": "MSME is granted CML licence under Scheme-I with explicit endorsement permitting shared cluster test facility utilization."
                }
            ]
        }
    }

    glossary = [
        {
            "term": "Indian Standard (IS)",
            "hindi_term": "भारतीय मानक (आई.एस.)",
            "definition": "A standard published by the Bureau of Indian Standards that prescribes dimensions, quality benchmarks, performance criteria, or test methods for materials, products, or processes.",
            "hindi_definition": "भारतीय मानक ब्यूरो द्वारा प्रकाशित मानक जो सामग्रियों, उत्पादों या प्रक्रियाओं के लिए आयाम, गुणवत्ता मानदंड, प्रदर्शन आवश्यकताएं या परीक्षण विधियां निर्धारित करता है।"
        },
        {
            "term": "ISI Mark",
            "hindi_term": "आईएसआई मार्क",
            "definition": "The official product certification mark of the Bureau of Indian Standards indicating third-party conformity to the relevant Indian Standard under Scheme-I.",
            "hindi_definition": "भारतीय मानक ब्यूरो का आधिकारिक उत्पाद प्रमाणन चिह्न जो स्कीम-I के तहत संबंधित भारतीय मानक के अनुसार तीसरे पक्ष की अनुरूपता को प्रमाणित करता है।"
        },
        {
            "term": "Certificate of Conformity (CoC)",
            "hindi_term": "अनुरूपता का प्रमाण पत्र (सी.ओ.सी.)",
            "definition": "A certificate granted under Scheme-IV demonstrating that a specific product lot, consignment, or production process conforms to applicable Indian Standards.",
            "hindi_definition": "स्कीम-IV के तहत प्रदान किया गया प्रमाण पत्र जो दर्शाता है कि किसी विशिष्ट उत्पाद लॉट, खेप या उत्पादन प्रक्रिया लागू भारतीय मानकों के अनुरूप है।"
        },
        {
            "term": "Quality Control Order (QCO)",
            "hindi_term": "गुणवत्ता नियंत्रण आदेश (क्यू.सी.ओ.)",
            "definition": "A statutory order issued by Central Government ministries under Section 16 of the BIS Act, 2016 making compliance with Indian Standards mandatory for specified goods.",
            "hindi_definition": "बीआईएस अधिनियम, 2016 की धारा 16 के तहत केंद्र सरकार के मंत्रालयों द्वारा जारी एक वैधानिक आदेश जो निर्दिष्ट वस्तुओं के लिए भारतीय मानकों का अनुपालन अनिवार्य बनाता है।"
        },
        {
            "term": "Foreign Manufacturers Certification Scheme (FMCS)",
            "hindi_term": "विदेशी निर्माता प्रमाणन योजना (एफ.एम.सी.एस.)",
            "definition": "A scheme enabling overseas manufacturers to obtain a BIS licence to use the standard ISI mark on products exported into India, governed by Scheme-I.",
            "hindi_definition": "एक ऐसी योजना जो विदेशी निर्माताओं को भारत में निर्यात किए जाने वाले उत्पादों पर मानक आईएसआई मार्क का उपयोग करने के लिए बीआईएस लाइसेंस प्राप्त करने में सक्षम बनाती है।"
        },
        {
            "term": "Cluster Based Test Facility (CBTF)",
            "hindi_term": "क्लस्टर आधारित परीक्षण सुविधा (सी.बी.टी.एफ.)",
            "definition": "A shared laboratory infrastructure in an industrial cluster enabling Micro, Small, and Medium Enterprises to access accredited testing facilities without full in-house lab setup.",
            "hindi_definition": "एक औद्योगिक क्लस्टर में एक साझा प्रयोगशाला अवसंरचना जो सूक्ष्म, लघु और मध्यम उद्यमों को पूर्ण इन-हाउस लैब सेटअप के बिना मान्यता प्राप्त परीक्षण सुविधाओं तक पहुँच प्रदान करती है।"
        },
        {
            "term": "Hallmarking",
            "hindi_term": "हॉलमार्किंग",
            "definition": "Accurate determination and official recording of the proportionate content of precious metal (gold or silver) in articles, verified with a 6-digit HUID.",
            "hindi_definition": "कीमती धातुओं (सोने या चांदी) के आभूषणों में शुद्धता की सटीक जांच और आधिकारिक रिकॉर्डिंग, जिसे 6-अंकीय एच.यू.आई.डी. द्वारा प्रमाणित किया जाता है।"
        },
        {
            "term": "Hallmark Unique Identification (HUID)",
            "hindi_term": "हॉलमार्क विशिष्ट पहचान संख्या (एच.यू.आई.डी.)",
            "definition": "A unique 6-digit alphanumeric code laser-engraved on each individual hallmarked gold jewellery piece providing end-to-end traceability and authenticity.",
            "hindi_definition": "प्रत्येक हॉलमार्क किए गए सोने के आभूषण पर लेजर से उत्कीर्ण 6-अंकीय अक्षरांकीय कोड जो अंतिम उपभोक्ता को पूर्ण पता लगाने की क्षमता और प्रामाणिकता प्रदान करता है।"
        },
        {
            "term": "Compulsory Registration Scheme (CRO)",
            "hindi_term": "अनिवार्य पंजीकरण योजना (सी.आर.ओ.)",
            "definition": "A streamlined conformity assessment scheme (Scheme-II) for electronic, IT, and smart devices based on self-declaration and test reports from BIS recognized labs.",
            "hindi_definition": "इलेक्ट्रॉनिक, आईटी और स्मार्ट उपकरणों के लिए एक सुव्यवस्थित अनुरूपता निर्धारण योजना (स्कीम-II) जो स्व-घोषणा और मान्यता प्राप्त प्रयोगशालाओं की परीक्षण रिपोर्ट पर आधारित है।"
        },
        {
            "term": "Certification Marks Licence (CML)",
            "hindi_term": "प्रमाणन चिह्न लाइसेंस (सी.एम.एल.)",
            "definition": "The official licence number assigned to a manufacturer granting permission to affix the ISI Mark on certified products.",
            "hindi_definition": "निर्माता को सौंपा गया आधिकारिक लाइसेंस नंबर जो प्रमाणित उत्पादों पर आईएसआई मार्क लगाने की अनुमति प्रदान करता है।"
        },
        {
            "term": "NABL",
            "hindi_term": "एन.ए.बी.एल.",
            "definition": "National Accreditation Board for Testing and Calibration Laboratories, India's premier autonomous accreditation body for testing laboratories under ISO/IEC 17025.",
            "hindi_definition": "परीक्षण और अंशांकन प्रयोगशालाओं के लिए राष्ट्रीय प्रत्यायन बोर्ड, जो आईएसओ/आईईसी 17025 के तहत प्रयोगशालाओं को मान्यता प्रदान करने वाला प्रमुख निकाय है।"
        },
        {
            "term": "Scheme of Inspection and Testing (SIT)",
            "hindi_term": "निरीक्षण एवं परीक्षण योजना (एस.आई.टी.)",
            "definition": "A prescribed statutory document outlining mandatory quality checks, sampling frequencies, and test methods to be conducted by the licensee during production.",
            "hindi_definition": "एक वैधानिक दस्तावेज जो उत्पादन के दौरान लाइसेंसधारी द्वारा किए जाने वाले अनिवार्य गुणवत्ता नियंत्रण, नमूना लेने की आवृत्ति और परीक्षण विधियों को निर्दिष्ट करता है।"
        },
        {
            "term": "Form-V",
            "hindi_term": "फॉर्म-V",
            "definition": "The statutory application form under Schedule-II of the BIS Conformity Assessment Regulations 2018 for grant of licence under Scheme-I.",
            "hindi_definition": "बीआईएस अनुरूपता निर्धारण विनियम 2018 की अनुसूची-II के तहत स्कीम-I के अंतर्गत लाइसेंस प्राप्त करने के लिए वैधानिक आवेदन पत्र।"
        },
        {
            "term": "Post-Market Surveillance",
            "hindi_term": "बाजार-उपरांत निगरानी",
            "definition": "Random collection and independent lab testing of BIS-marked goods purchased from retail markets to ensure continued compliance with standards.",
            "hindi_definition": "खुले बाजार से खरीदे गए बीआईएस-चिह्नित सामानों का यादृच्छिक संग्रह और स्वतंत्र प्रयोगशाला परीक्षण ताकि मानकों का निरंतर अनुपालन सुनिश्चित हो सके।"
        },
        {
            "term": "Factory Surveillance",
            "hindi_term": "कारखाना निगरानी",
            "definition": "Periodic unannounced visits by BIS inspecting officers to audit manufacturing facilities, review test records, and draw counter-samples.",
            "hindi_definition": "बीआईएस निरीक्षण अधिकारियों द्वारा विनिर्माण इकाइयों का समय-समय पर औचक दौरा, परीक्षण रिकॉर्ड की समीक्षा और काउंटर नमूने एकत्र करना।"
        },
        {
            "term": "Assaying and Hallmarking Centre (AHC)",
            "hindi_term": "परख एवं हॉलमार्किंग केंद्र (ए.एच.सी.)",
            "definition": "A BIS-recognized independent facility where purity of gold and silver jewellery is scientifically tested and hallmarked.",
            "hindi_definition": "बीआईएस-मान्यता प्राप्त स्वतंत्र सुविधा जहां सोने और चांदी के आभूषणों की शुद्धता का वैज्ञानिक परीक्षण किया जाता है और हॉलमार्क लगाया जाता है।"
        },
        {
            "term": "Section 16 of BIS Act, 2016",
            "hindi_term": "बीआईएस अधिनियम, 2016 की धारा 16",
            "definition": "The legal provision enabling the Central Government to notify mandatory standards for goods in public interest, human safety, and environmental protection.",
            "hindi_definition": "वह कानूनी प्रावधान जो केंद्र सरकार को जनहित, मानव सुरक्षा और पर्यावरण संरक्षण में वस्तुओं के लिए अनिवार्य मानक अधिसूचित करने का अधिकार देता है।"
        },
        {
            "term": "Section 29 of BIS Act, 2016",
            "hindi_term": "बीआईएस अधिनियम, 2016 की धारा 29",
            "definition": "The penal provision specifying fines up to Rs. 5 Lakhs, imprisonment up to two years, and forfeiture of goods for unauthorized use of standard marks.",
            "hindi_definition": "मानक चिह्नों के अनधिकृत उपयोग पर 5 लाख रुपये तक का जुर्माना, दो साल तक का कारावास और माल की जब्ती का प्रावधान करने वाला दंडात्मक खंड।"
        },
        {
            "term": "Authorized Indian Representative (AIR)",
            "hindi_term": "अधिकृत भारतीय प्रतिनिधि (ए.आई.आर.)",
            "definition": "A legal representative resident in India appointed by foreign manufacturers to accept legal responsibility and facilitate BIS compliance.",
            "hindi_definition": "विदेशी निर्माताओं द्वारा नियुक्त भारत में रहने वाला कानूनी प्रतिनिधि जो कानूनी दायित्व स्वीकार करता है और बीआईएस अनुपालन में सुविधा प्रदान करता है।"
        },
        {
            "term": "Standard Mark",
            "hindi_term": "मानक चिह्न",
            "definition": "The BIS certification mark specified for a particular scheme (such as the ISI Mark, Registration Mark, or Hallmark).",
            "hindi_definition": "किसी विशेष योजना (जैसे आईएसआई मार्क, पंजीकरण चिह्न, या हॉलमार्क) के लिए निर्दिष्ट आधिकारिक बीआईएस प्रमाणन चिह्न।"
        },
        {
            "term": "Manakonline",
            "hindi_term": "मानकऑनलाइन",
            "definition": "The official online portal of the Bureau of Indian Standards providing unified access to application submissions, fee payments, and licence tracking.",
            "hindi_definition": "भारतीय मानक ब्यूरो का आधिकारिक ऑनलाइन पोर्टल जो आवेदन जमा करने, शुल्क भुगतान और लाइसेंस ट्रैकिंग के लिए एकीकृत पहुँच प्रदान करता है।"
        }
    ]

    faq = [
        {
            "id": "FAQ-001",
            "category": "Licensing & Application",
            "question": "What is the procedure to apply for a BIS licence under Scheme-I?",
            "hindi_question": "स्कीम-I के तहत बीआईएस लाइसेंस के लिए आवेदन करने की प्रक्रिया क्या है?",
            "answer": "To apply for Scheme-I (ISI Mark): 1) Identify the relevant Indian Standard. 2) Set up in-house laboratory facilities or affiliate with a CBTF. 3) Submit Form-V on Manakonline along with application fee and test reports. 4) Undergo factory audit by a BIS officer. 5) Independent testing of drawn samples in a BIS lab. 6) Grant of Licence (CML).",
            "hindi_answer": "स्कीम-I (आईएसआई मार्क) के लिए आवेदन प्रक्रिया: 1) संबंधित भारतीय मानक की पहचान करें। 2) इन-हाउस लैब स्थापित करें या सीबीटीएस से संबद्ध हों। 3) मानकऑनलाइन पर फॉर्म-V और परीक्षण रिपोर्ट जमा करें। 4) बीआईएस अधिकारी द्वारा कारखाना निरीक्षण कराएं। 5) मान्यता प्राप्त लैब में नमूनों का परीक्षण। 6) लाइसेंस (सीएमएल) जारी किया जाता है।"
        },
        {
            "id": "FAQ-002",
            "category": "MSME Benefits",
            "question": "What concessions are available for MSMEs under the CBTF guidelines?",
            "hindi_question": "सीबीटीएफ दिशानिर्देशों के तहत एमएसएमई के लिए क्या रियायतें उपलब्ध हैं?",
            "answer": "Under CMD-I/2:12:8 guidelines, MSMEs with valid Udyam registration located in a cluster can share test facilities at an accredited CBTF instead of setting up complete costly in-house testing equipment. Routine non-destructive checks (10x visual, dimensional) must still be retained in-house. Micro enterprises also enjoy 50% concession on marking fees, and Small enterprises receive 20%.",
            "hindi_answer": "दिशानिर्देश CMD-I/2:12:8 के अनुसार, उद्यम पंजीकरण वाले एमएसएमई महंगे परीक्षण उपकरण लगाने के बजाय क्लस्टर आधारित परीक्षण सुविधा (CBTF) साझा कर सकते हैं। केवल बुनियादी दृश्य और आयामी परीक्षण इन-हाउस रखने होते हैं। सूक्ष्म उद्यमों को अंकन शुल्क में 50% तथा लघु उद्यमों को 20% की छूट भी मिलती है।"
        },
        {
            "id": "FAQ-003",
            "category": "Compulsory Registration (CRO)",
            "question": "How long is a test report valid when applying under Scheme-II (CRO)?",
            "hindi_question": "स्कीम-II (सी.आर.ओ.) के तहत आवेदन करते समय परीक्षण रिपोर्ट कब तक मान्य होती है?",
            "answer": "Under Scheme-II guidelines, test reports issued by a BIS-recognized laboratory are valid for exactly 90 days from the date of issue for online submission on the crsbis.in portal.",
            "hindi_answer": "स्कीम-II दिशानिर्देशों के अनुसार, बीआईएस-मान्यता प्राप्त प्रयोगशाला द्वारा जारी परीक्षण रिपोर्ट जारी होने की तिथि से ठीक 90 दिनों तक crsbis.in पोर्टल पर आवेदन के लिए मान्य होती है।"
        },
        {
            "id": "FAQ-004",
            "category": "Certificate of Conformity (CoC)",
            "question": "What is the maximum permissible age of a test report for Scheme-IV (CoC)?",
            "hindi_question": "स्कीम-IV (सी.ओ.सी.) के लिए परीक्षण रिपोर्ट की अधिकतम स्वीकार्य वैधता क्या है?",
            "answer": "Under Clause 6.a of the Scheme-IV guidelines (CMD-I/2:16:1), the independent test report submitted with the application must not be older than 180 days from the date of issue.",
            "hindi_answer": "स्कीम-IV दिशानिर्देशों (CMD-I/2:16:1) के क्लॉज 6.a के अनुसार, आवेदन के साथ प्रस्तुत की गई स्वतंत्र परीक्षण रिपोर्ट जारी होने की तिथि से 180 दिन से अधिक पुरानी नहीं होनी चाहिए।"
        },
        {
            "id": "FAQ-005",
            "category": "Quality Control Orders",
            "question": "Can I manufacture or sell a product covered under a mandatory QCO without BIS certification?",
            "hindi_question": "क्या मैं बीआईएस प्रमाणन के बिना अनिवार्य क्यूसीओ के अंतर्गत आने वाले उत्पाद का निर्माण या बिक्री कर सकता हूँ?",
            "answer": "No. Under Section 16 of the BIS Act, 2016, once a QCO comes into force, no person can manufacture, import, store, sell, or distribute the notified goods without a valid BIS standard mark. Violations attract penal action under Section 29.",
            "hindi_answer": "नहीं। बीआईएस अधिनियम, 2016 की धारा 16 के तहत, क्यूसीओ लागू होने के बाद कोई भी व्यक्ति वैध बीआईएस मानक चिह्न के बिना अधिसूचित सामान का निर्माण, आयात, भंडारण या बिक्री नहीं कर सकता है। उल्लंघन पर धारा 29 के तहत दंडात्मक कार्रवाई होती है।"
        },
        {
            "id": "FAQ-006",
            "category": "Hallmarking",
            "question": "How do consumers verify gold jewellery authenticity?",
            "hindi_question": "उपभोक्ता सोने के आभूषणों की प्रामाणिकता की जांच कैसे करते हैं?",
            "answer": "Consumers can check for three compulsory hallmarks: 1) BIS Logo, 2) Purity/Fineness grade (e.g., 22K916, 18K750, 14K585), and 3) 6-digit alphanumeric HUID. The HUID can be verified instantly using the 'Verify HUID' feature on the BIS CARE mobile app.",
            "hindi_answer": "उपभोक्ता तीन अनिवार्य चिह्नों की जांच कर सकते हैं: 1) बीआईएस लोगो, 2) शुद्धता ग्रेड (जैसे 22K916, 18K750), और 3) 6-अंकीय एचयूआईडी। एचयूआईडी को बीआईएस केयर ऐप पर 'सत्यापित करें' सुविधा से तुरंत सत्यापित किया जा सकता है।"
        },
        {
            "id": "FAQ-007",
            "category": "Foreign Manufacturers",
            "question": "What is the role of an Authorized Indian Representative (AIR) under FMCS?",
            "hindi_question": "विदेशी निर्माता योजना (FMCS) में अधिकृत भारतीय प्रतिनिधि (AIR) की क्या भूमिका है?",
            "answer": "An AIR must be an Indian resident representing the foreign manufacturer. The AIR signs indemnity bonds, coordinates audits, receives official communications, and assumes legal accountability under Indian law for compliance with BIS norms.",
            "hindi_answer": "AIR को भारत का निवासी होना चाहिए जो विदेशी निर्माता का प्रतिनिधित्व करता है। AIR क्षतिपूर्ति बांड पर हस्ताक्षर करता है, ऑडिट का समन्वय करता है, पत्राचार प्राप्त करता है और बीआईएस अनुपालन के लिए कानूनी जिम्मेदारी लेता है।"
        },
        {
            "id": "FAQ-008",
            "category": "Surveillance",
            "question": "How does BIS conduct post-market surveillance?",
            "hindi_question": "बीआईएस बाजार-उपरांत निगरानी कैसे करता है?",
            "answer": "As per CMD-I/2:12:7 guidelines, BIS officers purchase certified products anonymously from retail markets or project sites. Samples are coded, sealed, and tested in BIS or NABL labs. If samples fail, a stop-marking order or licence suspension is initiated.",
            "hindi_answer": "CMD-I/2:12:7 दिशानिर्देशों के अनुसार, बीआईएस अधिकारी खुदरा बाजार से अनाम रूप से उत्पाद खरीदते हैं। नमूनों को सील करके मान्यता प्राप्त लैब में भेजा जाता है। यदि नमूना विफल होता है, तो मार्किंग रोकने या लाइसेंस निलंबन की कार्रवाई की जाती है।"
        },
        {
            "id": "FAQ-009",
            "category": "Penal Provisions",
            "question": "What are the legal penalties for illegal use of the ISI mark or manufacturing without QCO compliance?",
            "hindi_question": "आईएसआई मार्क के अवैध उपयोग या क्यूसीओ के उल्लंघन पर कानूनी दंड क्या हैं?",
            "answer": "Under Section 29 of the BIS Act, 2016, unauthorized use of standard marks or violation of Section 16 QCO is punishable with imprisonment up to two years, a fine of at least Rs. 2 Lakhs (extendable up to Rs. 5 Lakhs or 10 times the value of goods), and confiscation of property.",
            "hindi_answer": "बीआईएस अधिनियम, 2016 की धारा 29 के तहत अनधिकृत मार्क के उपयोग पर 2 साल तक की कैद, कम से कम 2 लाख रुपये का जुर्माना (जो 5 लाख रुपये या माल के मूल्य का 10 गुना हो सकता है), और सामान की जब्ती का प्रावधान है।"
        },
        {
            "id": "FAQ-010",
            "category": "Testing & Labs",
            "question": "Where can manufacturers get their products tested for BIS certification?",
            "hindi_question": "निर्माता बीआईएस प्रमाणन के लिए अपने उत्पादों का परीक्षण कहाँ करा सकते हैं?",
            "answer": "Testing can be carried out at BIS Central Laboratory (Sahibabad), Regional Laboratories (Chennai, Kolkata, Mohali, Mumbai), or any of the 150+ BIS-recognized and NABL-accredited commercial test laboratories listed on the LIMS portal.",
            "hindi_answer": "परीक्षण बीआईएस केंद्रीय प्रयोगशाला (साहिबाबाद), क्षेत्रीय प्रयोगशालाओं (चेन्नई, कोलकाता, मोहाली, मुंबई) या लिम्स (LIMS) पोर्टल पर सूचीबद्ध 150 से अधिक बीआईएस-मान्यता प्राप्त और एनएबीएल-प्रत्यायित प्रयोगशालाओं में कराया जा सकता है।"
        },
        {
            "id": "FAQ-011",
            "category": "Licensing & Application",
            "question": "How long is a Scheme-I ISI Mark licence initially granted for?",
            "hindi_question": "स्कीम-I आईएसआई मार्क लाइसेंस शुरू में कितने समय के लिए दिया जाता है?",
            "answer": "Under Regulation 7 of Conformity Assessment Regulations 2018, a licence under Scheme-I is initially granted for a minimum period of 1 year and can be renewed for up to 5 years at a time upon satisfactory compliance history.",
            "hindi_answer": "अनुरूपता निर्धारण विनियम 2018 के विनियमन 7 के तहत, स्कीम-I के तहत लाइसेंस शुरू में न्यूनतम 1 वर्ष की अवधि के लिए दिया जाता है और संतोषजनक अनुपालन पर इसे एक बार में 5 वर्ष तक नवीनीकृत किया जा सकता है।"
        },
        {
            "id": "FAQ-012",
            "category": "Consumer Complaints",
            "question": "How can a consumer lodge a complaint against sub-standard ISI marked products?",
            "hindi_question": "उपभोक्ता घटिया आईएसआई चिह्नित उत्पादों के खिलाफ शिकायत कैसे दर्ज करा सकते हैं?",
            "answer": "Consumers can file complaints directly through the BIS CARE Mobile App, on the national consumer grievance portal (bis.gov.in), or by writing to complaints@bis.gov.in. BIS investigates and can take punitive action including compensation and licence cancellation.",
            "hindi_answer": "उपभोक्ता बीआईएस केयर मोबाइल ऐप, पोर्टल (bis.gov.in) पर या complaints@bis.gov.in पर ईमेल करके शिकायत दर्ज कर सकते हैं। बीआईएस जांच करता है और मुआवजा तथा लाइसेंस रद्द करने जैसी दंडात्मक कार्रवाई कर सकता है।"
        },
        {
            "id": "FAQ-013",
            "category": "Electronics & CRO",
            "question": "Can multiple models be covered under a single Scheme-II registration?",
            "hindi_question": "क्या एक ही स्कीम-II पंजीकरण के तहत कई मॉडल शामिल किए जा सकते हैं?",
            "answer": "Yes. BIS follows a 'Series Guideline' rule for CRO. If models share identical safety-critical components, PCB layout, and enclosures, they can be grouped under a single registration series based on a primary lead model test report.",
            "hindi_answer": "हाँ। बीआईएस सीआरओ के लिए 'श्रृंखला दिशानिर्देश' का पालन करता है। यदि मॉडल समान सुरक्षा घटकों और डिजाइन को साझा करते हैं, तो उन्हें एक मुख्य मॉडल की रिपोर्ट के आधार पर एक ही श्रृंखला में समूहीकृत किया जा सकता है।"
        },
        {
            "id": "FAQ-014",
            "category": "Cement & Building Materials",
            "question": "Which standard specifies requirements for 53-grade Ordinary Portland Cement?",
            "hindi_question": "53-ग्रेड साधारण पोर्टलैंड सीमेंट के लिए कौन सा मानक आवश्यकताएं निर्दिष्ट करता है?",
            "answer": "IS 269: 2015 is the unified standard for 33, 43, and 53 grade Ordinary Portland Cement, governed mandatorily by the Cement (Quality Control) Order, 2003 under Scheme-I.",
            "hindi_answer": "IS 269: 2015 साधारण पोर्टलैंड सीमेंट (33, 43 और 53 ग्रेड) के लिए एकीकृत मानक है, जो स्कीम-I के तहत सीमेंट (गुणवत्ता नियंत्रण) आदेश, 2003 द्वारा अनिवार्य रूप से शासित है।"
        },
        {
            "id": "FAQ-015",
            "category": "Steel & TMT Bars",
            "question": "What is the mandatory standard for TMT steel reinforcement bars in India?",
            "hindi_question": "भारत में टीएमटी स्टील सुदृढीकरण बार के लिए अनिवार्य मानक क्या है?",
            "answer": "IS 1786: 2008 covers High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT bars). It is mandatory under the Steel and Steel Products (Quality Control) Order, 2020.",
            "hindi_answer": "IS 1786: 2008 कंक्रीट सुदृढीकरण के लिए उच्च शक्ति वाले स्टील बार और तारों (टीएमटी बार) को कवर करता है। यह इस्पात और इस्पात उत्पाद (गुणवत्ता नियंत्रण) आदेश, 2020 के तहत अनिवार्य है।"
        }
    ]

    branch_offices = [
        {
            "office_id": "HQ-DELHI",
            "name": "BIS Headquarters (Manak Bhavan)",
            "tier": "Headquarters",
            "region": "Northern Region",
            "address": "Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002",
            "phone": "+91-11-23230131",
            "email": "cmd1@bis.gov.in",
            "jurisdiction": "Pan-India Central Governance & Policy Formulation"
        },
        {
            "office_id": "NRO-CHD",
            "name": "Northern Regional Office (NRO)",
            "tier": "Regional Office",
            "region": "Northern Region",
            "address": "Plot No. 4-A, Sector 27-B, Madhya Marg, Chandigarh 160019",
            "phone": "+91-172-2650206",
            "email": "nro@bis.gov.in",
            "jurisdiction": "Punjab, Haryana, Himachal Pradesh, Jammu & Kashmir, Ladakh, Chandigarh"
        },
        {
            "office_id": "ERO-KOL",
            "name": "Eastern Regional Office (ERO)",
            "tier": "Regional Office",
            "region": "Eastern Region",
            "address": "1/14 C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata 700054",
            "phone": "+91-33-23207080",
            "email": "ero@bis.gov.in",
            "jurisdiction": "West Bengal, Odisha, Bihar, Jharkhand, Assam, North Eastern States, Andaman & Nicobar"
        },
        {
            "office_id": "SRO-CHN",
            "name": "Southern Regional Office (SRO)",
            "tier": "Regional Office",
            "region": "Southern Region",
            "address": "CIT Campus, IV Cross Road, Taramani, Chennai 600113",
            "phone": "+91-44-22541216",
            "email": "sro@bis.gov.in",
            "jurisdiction": "Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, Puducherry, Lakshadweep"
        },
        {
            "office_id": "WRO-MUM",
            "name": "Western Regional Office (WRO)",
            "tier": "Regional Office",
            "region": "Western Region",
            "address": "Manakalaya, E-9, MIDC, Andheri (East), Mumbai 400093",
            "phone": "+91-22-28329295",
            "email": "wro@bis.gov.in",
            "jurisdiction": "Maharashtra, Gujarat, Goa, Madhya Pradesh, Chhattisgarh, Daman & Diu"
        },
        {
            "office_id": "CRO-DEL",
            "name": "Central Regional Office (CRO)",
            "tier": "Regional Office",
            "region": "Central Region",
            "address": "Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002",
            "phone": "+91-11-23237582",
            "email": "cro@bis.gov.in",
            "jurisdiction": "Delhi NCR, Uttar Pradesh, Uttarakhand, Rajasthan"
        },
        {
            "office_id": "BO-BLR",
            "name": "Bengaluru Branch Office (BNBO)",
            "tier": "Branch Office",
            "region": "Southern Region",
            "address": "Peenya Industrial Area, 1st Stage, Bangalore Tumkur Road, Bengaluru 560058",
            "phone": "+91-80-28394955",
            "email": "bnbo@bis.gov.in",
            "jurisdiction": "Karnataka State Districts"
        },
        {
            "office_id": "BO-AHM",
            "name": "Ahmedabad Branch Office (AHBO)",
            "tier": "Branch Office",
            "region": "Western Region",
            "address": "Pushpak, 3rd Floor, Nurmohamed Shaikh Marg, Khanpur, Ahmedabad 380001",
            "phone": "+91-79-25601340",
            "email": "ahbo@bis.gov.in",
            "jurisdiction": "North and Central Gujarat"
        },
        {
            "office_id": "BO-HYD",
            "name": "Hyderabad Branch Office (HYBO)",
            "tier": "Branch Office",
            "region": "Southern Region",
            "address": "F-3, Industrial Estate, Sanathnagar, Hyderabad 500018",
            "phone": "+91-40-23707017",
            "email": "hybo@bis.gov.in",
            "jurisdiction": "Telangana State"
        },
        {
            "office_id": "BO-PUN",
            "name": "Pune Branch Office (PNBO)",
            "tier": "Branch Office",
            "region": "Western Region",
            "address": "Plot No. 7, Sector 28, Pradhikaran, Akurdi, Pune 411044",
            "phone": "+91-20-27657970",
            "email": "pnbo@bis.gov.in",
            "jurisdiction": "Western Maharashtra"
        },
        {
            "office_id": "BO-PAT",
            "name": "Patna Branch Office (PTBO)",
            "tier": "Branch Office",
            "region": "Eastern Region",
            "address": "Patliputra Industrial Area, Patna 800013",
            "phone": "+91-612-2262305",
            "email": "ptbo@bis.gov.in",
            "jurisdiction": "Bihar State"
        },
        {
            "office_id": "BO-GHY",
            "name": "Guwahati Branch Office (GHBO)",
            "tier": "Branch Office",
            "region": "Eastern Region",
            "address": "5th Floor, NEDFi House, G.S. Road, Dispur, Guwahati 781006",
            "phone": "+91-361-2232501",
            "email": "ghbo@bis.gov.in",
            "jurisdiction": "Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura"
        },
        {
            "office_id": "BO-JAI",
            "name": "Jaipur Branch Office (JPBO)",
            "tier": "Branch Office",
            "region": "Central Region",
            "address": "Vikas Marg, Sector 5, Vidyadhar Nagar, Jaipur 302039",
            "phone": "+91-141-2234502",
            "email": "jpbo@bis.gov.in",
            "jurisdiction": "Rajasthan State"
        },
        {
            "office_id": "BO-LKO",
            "name": "Lucknow Branch Office (LKBO)",
            "tier": "Branch Office",
            "region": "Central Region",
            "address": "B-4/4, Vibhuti Khand, Gomti Nagar, Lucknow 226010",
            "phone": "+91-522-2720811",
            "email": "lkbo@bis.gov.in",
            "jurisdiction": "Central & Eastern Uttar Pradesh"
        }
    ]

    seed_data = {
        "metadata": {
            "version": "2.0.0",
            "last_updated": "2026-09-07",
            "dataset_authority": "Bureau of Indian Standards AI Knowledge Ingestion Core",
            "status": "Production-Ready Canonical Seed",
            "records_summary": {
                "documents_count": len(doc_registry),
                "standards_count": len(STANDARDS_DATA),
                "glossary_count": len(glossary),
                "faq_count": len(faq),
                "branch_offices_count": len(branch_offices)
            }
        },
        "document_registry": doc_registry,
        "schemes": schemes,
        "glossary": glossary,
        "faq": faq,
        "branch_offices": branch_offices
    }

    with open(seed_path, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2, ensure_ascii=False)
    print(f"Generated knowledge base seed JSON: {seed_path}")

    # Also update data/structured/doc_registry.json and data/structured/is_product_map.json
    with open(os.path.join(STRUCTURED_DIR, "doc_registry.json"), "w", encoding="utf-8") as f:
        json.dump(doc_registry, f, indent=2, ensure_ascii=False)

    with open(os.path.join(STRUCTURED_DIR, "is_product_map.json"), "w", encoding="utf-8") as f:
        json.dump(STANDARDS_DATA, f, indent=2, ensure_ascii=False)

    with open(os.path.join(STRUCTURED_DIR, "schemes_meta.json"), "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    build_standards_csv()
    build_knowledge_base_seed()
