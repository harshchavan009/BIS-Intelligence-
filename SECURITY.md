# Security Policy & Vulnerability Disclosure Program

**Project:** AI-Powered Intelligent Assistant for Indian Standards & BIS Services  
**Classification:** Smart India Hackathon (SIH 2026) Submission Prototype (PS-1724)  
**Standard Alignment:** Guidelines for Indian Government Websites (GIGW 3.0) & CERT-In Responsible Disclosure Norms  
**Privacy Framework:** Digital Personal Data Protection (DPDP) Act, 2023  

---

## 1. Responsible Disclosure & Commitment
The Bureau of Indian Standards (BIS) AI Intelligent Assistant team values the contributions of independent security researchers and domain experts in identifying security weaknesses. We are committed to validating, triaging, and addressing reported vulnerabilities in a responsible, transparent, and timely manner.

> [!IMPORTANT]
> **Prototype Notice:** This application is an engineering submission prototype for SIH 2026 and is **not** an authorized production service of the Government of India or the Bureau of Indian Standards. Real public launch requires formal empannelled security audit and NIC hosting (see [ROADMAP.md](ROADMAP.md)).

---

## 2. Reporting a Vulnerability
If you discover a security vulnerability or potential exploit, please report it privately. **Do not disclose vulnerabilities publicly or discuss them on forums/social media until a remediation patch is released.**

### How to Report:
- **Email:** `security-disclosure@bis-ai-assistant.sih.gov.in` (Designated Prototype Security Desk)
- **Subject Line:** `[SECURITY DISCLOSURE] <Vulnerability Type> in BIS AI Assistant`
- **Encryption:** GPG/PGP encryption is recommended for sensitive vulnerability details.

### Required Information:
1. **Summary & Vulnerability Type** (e.g., OWASP Top 10, LLM Prompt Injection, CSRF, Access Control).
2. **Exact Steps to Reproduce** (including curl commands, HTTP requests, or sample payloads).
3. **Impact Assessment** (how an attacker could exploit this flaw and what assets are affected).
4. **Proposed Mitigation / Remediation** (optional but appreciated).

---

## 3. Scope & Out-of-Scope

### In-Scope Assets:
- **FastAPI Core Endpoints:** `/api/chat`, `/api/verify/cml`, `/api/verify/huid`, `/api/standards/*`, `/api/schemes/*`, `/api/labs/*`, `/api/auth/*`, `/api/analytics`.
- **RAG & LLM Engine:** Prompt injection defenses, retrieved chunk isolation boundary leaks, hallucination mitigations.
- **Frontend Web Application:** XSS vulnerabilities, state leakage, CSRF token handling, navigation and iframe containment.
- **Access Control & Telemetry:** Evaluator authentication bypasses, session cookie attributes (`HttpOnly`, `SameSite=Strict`, `Secure`).

### Out-of-Scope:
- Denial of Service (DoS/DDoS) stress testing against demo servers or third-party networks.
- Social engineering or phishing targeting SIH evaluators or team members.
- Issues in upstream dependencies that do not have demonstrable exploitability in this application.
- Physical attacks against server hardware or development workstations.

---

## 4. Expected Response Times (SLA)
We adhere to an accelerated responsible disclosure schedule:
- **Initial Acknowledgment:** Within **24 hours** of submission.
- **Triage & Severity Classification:** Within **48 hours**.
- **Remediation & Fix Release:** Within **7 business days** for Critical/High issues, **14 business days** for Medium/Low issues.
- **Mutual Public Disclosure:** Upon verification of the fix and release of the security advisory.

---

## 5. Security Baseline & Defenses Implemented

| Security Dimension | Implementation Mechanism | Standard / Policy |
| :--- | :--- | :--- |
| **HTTP Transport** | HTTPS enforced with HSTS (`max-age=31536000; includeSubDomains; preload`) | GIGW / OWASP |
| **HTTP Security Headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict CSP, `Permissions-Policy` | CERT-In Web Baseline |
| **CORS Policy** | Origin restricted to trusted frontend domain; wildcard (`*`) prohibited | Secure API Guidelines |
| **RAG Prompt Injection** | Retrieved chunks quarantined in `<retrieved_context_data>` XML tags; system prompt strictly forbids treating context as instructions; ingestion-time scanner flags adversarial phrases | OWASP LLM Top 10 (LLM01) |
| **Data Protection** | Full compliance with DPDP Act 2023: client IPs masked (`192.168.***.***`), no unnecessary PII stored, DB queries use ORM parameterized access | DPDP Act 2023 |
| **Abuse Mitigation** | Sliding window rate limiting (25 req/min) + anti-abuse CAPTCHA validation + anomaly detection logger | GIGW Availability |
| **Admin & Telemetry Gate** | Internal analytics and evaluator telemetry are auth-gated via HMAC session tokens | Access Control |

---

## 6. Safe Harbor Policy
If you conduct security research in good faith in accordance with this policy:
- We will not initiate or support legal action against you regarding your research.
- We will work collaboratively with you to understand and resolve the issue quickly.
- We will recognize your contribution in our Security Hall of Fame (with your consent).
