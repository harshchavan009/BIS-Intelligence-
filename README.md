# 🇮🇳 BIS Intelligence — Manak Mitra

<p align="center">
  <img src="https://img.shields.io/badge/Generative%20AI-Enabled-2563EB?style=for-the-badge" alt="Generative AI">
  <img src="https://img.shields.io/badge/RAG-Enabled-7C3AED?style=for-the-badge" alt="RAG">
  <img src="https://img.shields.io/badge/Multilingual-AI-059669?style=for-the-badge" alt="Multilingual AI">
  <img src="https://img.shields.io/badge/LangGraph-Orchestration-F59E0B?style=for-the-badge" alt="LangGraph">
  <img src="https://img.shields.io/badge/ChromaDB-Semantic%20Search-EAB308?style=for-the-badge" alt="ChromaDB">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Type%20Safe-3178C6?style=for-the-badge" alt="TypeScript">
</p>

<p align="center">
  <strong>AI-powered intelligence for Indian Standards, BIS certification, hallmarking and consumer services.</strong>
</p>

<p align="center">
  Ask. Discover. Understand. Verify.
</p>

<p align="center">
  <a href="https://bis-intelligence.vercel.app">Live Demo</a> •
  <a href="https://github.com/harshchavan009/BIS-Intelligence-.git">GitHub</a>
</p>

---

## 🚀 About the Project

**BIS Intelligence — Manak Mitra** is a domain-focused AI platform designed to simplify the discovery and understanding of information related to the **Bureau of Indian Standards (BIS)**.

The platform provides a single intelligent interface for information related to:

- Indian Standards
- BIS certification schemes
- Product certification
- Licensing and compliance guidance
- Hallmarking
- HUID-related information
- BIS-recognized laboratories
- Consumer services
- Standards-related queries
- Multilingual BIS information

Instead of making users navigate through multiple portals, documents and technical pages, Manak Mitra allows them to ask questions naturally and receive responses based on retrieved BIS information.

The system is built around a **retrieval-first and evidence-aware AI architecture** rather than a simple chatbot.

---

## 💡 The Problem

BIS provides a large amount of standards, certification, testing and consumer-related information.

However, users often face practical difficulties such as:

- Information being distributed across multiple pages and documents
- Difficulty identifying the relevant Indian Standard
- Complex certification and licensing terminology
- Difficulty understanding technical documents
- Time-consuming manual search
- Language barriers for non-English users
- Risk of unsupported answers when using generic AI assistants

For an MSME, startup, student or consumer, finding an answer is often only part of the problem.

The bigger challenge is:

> **How do we find the right information, determine whether it applies, verify the evidence, and present it in a simple and useful way?**

---

# 🎯 Our Solution

Manak Mitra approaches BIS information discovery as an **AI-powered retrieval and verification problem**.

The platform combines:

**Multilingual NLP + Intent Detection + LangGraph Orchestration + Hybrid Retrieval + RAG + LLM Generation + Evidence Verification**

The overall workflow is:

```text
                    USER
                     │
                     ▼
              User Query
                     │
                     ▼
        Language Detection / Translation
                     │
                     ▼
          Intent + Entity Detection
                     │
                     ▼
            LangGraph Orchestrator
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Standards    Certification   Hallmarking
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
             Labs & Consumer
                     │
                     ▼
            Hybrid Retrieval
             ┌───────┴───────┐
             ▼               ▼
       Structured DB      ChromaDB
       Retrieval          Semantic Search
             │               │
             └───────┬───────┘
                     ▼
               Retrieved Evidence
                     │
                     ▼
              LLM Generation
                     │
                     ▼
           Evidence Verification
                     │
              ┌──────┴──────┐
              ▼             ▼
          VERIFIED       NOT VERIFIED
              │             │
              ▼             ▼
      Answer + Sources   Safe Response
                         + BIS Guidance
