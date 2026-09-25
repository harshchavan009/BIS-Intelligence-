# 🇮🇳 BIS Intelligence — Manak Mitra

<p align="center">
  <img src="https://img.shields.io/badge/AI-Generative%20AI-2563EB?style=for-the-badge" alt="Generative AI">
  <img src="https://img.shields.io/badge/RAG-Retrieval%20Augmented%20Generation-7C3AED?style=for-the-badge" alt="RAG">
  <img src="https://img.shields.io/badge/NLP-Multilingual-059669?style=for-the-badge" alt="NLP">
  <img src="https://img.shields.io/badge/LangGraph-Orchestration-F59E0B?style=for-the-badge" alt="LangGraph">
  <img src="https://img.shields.io/badge/ChromaDB-Vector%20Search-EAB308?style=for-the-badge" alt="ChromaDB">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge" alt="TypeScript">
</p>

<p align="center">
  <strong>An AI-powered, multilingual and evidence-grounded assistant for Indian Standards and BIS services.</strong>
</p>

<p align="center">
  Helping MSMEs, startups, consumers, students and researchers discover,
  understand and navigate BIS-related information through one intelligent interface.
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why BIS Intelligence?](#-why-bis-intelligence)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Core Innovation](#-core-innovation)
- [System Architecture](#-system-architecture)
- [End-to-End AI Pipeline](#-end-to-end-ai-pipeline)
- [Detailed Architecture](#-detailed-architecture)
- [Application Modules](#-application-modules)
- [RAG Architecture](#-rag-architecture)
- [Evidence Verification](#-evidence-verification)
- [Multilingual Processing](#-multilingual-processing)
- [Query Orchestration](#-query-orchestration)
- [Technology Stack](#-technology-stack)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Data & Knowledge Architecture](#-data--knowledge-architecture)
- [Security & Reliability](#-security--reliability)
- [Use Cases](#-use-cases)
- [Target Users](#-target-users)
- [Project Workflow](#-project-workflow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Deployment](#-deployment)
- [Evaluation Strategy](#-evaluation-strategy)
- [Challenges & Mitigation](#-challenges--mitigation)
- [Limitations](#-limitations)
- [Future Roadmap](#-future-roadmap)
- [Smart India Hackathon](#-smart-india-hackathon)
- [Research Foundation](#-research-foundation)
- [Screenshots](#-screenshots)
- [Demo](#-demo)
- [Project Structure](#-project-structure)
- [Author](#-author)
- [License](#-license)

---

# 🌟 Overview

**BIS Intelligence — Manak Mitra** is an AI-powered intelligent assistant created to simplify access to information related to the **Bureau of Indian Standards (BIS)**.

The platform provides a conversational and structured way to discover information about:

- 🇮🇳 Indian Standards
- 📋 Certification schemes
- 🏭 Product certification
- 💍 Hallmarking and HUID
- 🧪 BIS-recognized laboratories
- 👥 Consumer-related BIS services
- 📚 Compliance and process guidance
- 🌐 Multilingual BIS information

Instead of forcing users to manually navigate through multiple portals, PDFs and technical documents, Manak Mitra provides an intelligent interface where users can ask questions naturally.

The system combines:

**Generative AI + Retrieval-Augmented Generation + Semantic Search + Structured Retrieval + Multilingual NLP + Evidence Verification**

to produce responses that are designed to remain grounded in retrieved BIS information.

The project is based on the idea that a useful standards assistant should not simply generate an answer — it should also be able to **find supporting information, verify it and communicate when evidence is insufficient**.

---

# 🎯 Why BIS Intelligence?

Finding relevant BIS information can be challenging because information related to standards, certification, hallmarking and services may exist across different documents, service pages and portals.

A user may need to determine:

- Which Indian Standard applies to a product?
- Which certification scheme is relevant?
- What is the certification procedure?
- What documents or requirements are involved?
- What does a BIS-related term mean?
- What is the significance of hallmarking or HUID?
- Where can relevant laboratory information be found?

This becomes especially difficult for:

- MSMEs
- Startups
- First-time applicants
- Consumers
- Students
- Researchers
- Users who are more comfortable using Indian languages

BIS Intelligence addresses this information-discovery problem through an AI-driven retrieval and verification pipeline.

---

# ❗ Problem Statement

### The problem

BIS information can be difficult to discover, interpret and connect to a user's exact question.

Traditional document search has several limitations:

1. Users need to know what keywords to search.
2. Important information may be distributed across multiple resources.
3. Technical terminology can be difficult for non-expert users.
4. Search results may provide too much information without explaining relevance.
5. Generative AI without retrieval can provide unsupported responses.
6. English-only interfaces can reduce accessibility.

### The core challenge

The goal is not simply:

> **"Build a chatbot for BIS."**

The real challenge is:

> **Build an intelligent information system that can understand the user's intent, retrieve relevant BIS evidence, generate a useful response and verify that the response is supported by the available evidence.**

---

# 💡 Solution

**Manak Mitra** introduces a complete AI-powered information pipeline:

```text
User Query
     ↓
Language Detection
     ↓
Translation / Normalization
     ↓
Intent + Entity Detection
     ↓
LangGraph Query Routing
     ↓
Relevant BIS Knowledge Retrieval
     ↓
Structured + Semantic Search
     ↓
Context Construction
     ↓
LLM Response Generation
     ↓
Evidence Verification
     ↓
Confidence Evaluation
     ↓
Verified Response / Safe Response
