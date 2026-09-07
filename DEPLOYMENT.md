# Production Deployment Guide: BIS AI Intelligent Assistant
**Smart India Hackathon 2026 — PS-1724 (Problem Statement SIH1391)**

This guide provides turnkey instructions for deploying the BIS AI Intelligent Assistant to public HTTPS platforms (Render, Railway, or Vercel) without reliance on `localhost`.

---

## Architecture Overview in Production

1. **Monolithic / Single-Port Deployment (Recommended - Render / Railway / Docker):**
   - FastAPI (`backend/app/main.py`) serves both the REST/Streaming API under `/api/*` and the static production React SPA from `frontend/dist/` on a single port (`$PORT`).
   - Zero CORS complications, 100% offline-compatible RAG synthesis (`LLM_PROVIDER=offline`).
   - Local ChromaDB vector database (`data/vector_store`) and SQLite DB (`data/bis_assistant.db`) are packaged within the container.

2. **Split Deployment (Vercel Frontend + Render/Railway Backend):**
   - Frontend deployed on Vercel with environment variable `VITE_API_BASE_URL=https://your-backend.onrender.com`.
   - Backend deployed on Render/Railway with `ALLOWED_ORIGINS=https://your-app.vercel.app`.

---

## Option 1: One-Click / Git Deploy on Render (Single Web Service)

1. Push this repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint** (or **Web Service**).
3. Select your repository. Render will automatically detect `render.yaml`:
   - **Environment:** Python 3.11
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && cd frontend && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
     ```
4. Set Environment Variables:
   - `LLM_PROVIDER`: `offline` (for zero-latency offline demo) or `gemini` / `openai` / `groq`
   - `GEMINI_API_KEY`: *(Optional, required only if `LLM_PROVIDER=gemini`)*
   - `OPENAI_API_KEY`: *(Optional, required only if `LLM_PROVIDER=openai`)*
5. Click **Deploy**. Your app will be live at `https://bis-ai-assistant.onrender.com`.

---

## Option 2: Deploy on Railway

1. Install Railway CLI or link GitHub repo in [Railway.app](https://railway.app).
2. Add a new service using the root `Dockerfile` or Nixpacks.
3. Configure start command:
   ```bash
   sh -c "cd frontend && npm install && npm run build && cd .. && python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT"
   ```
4. Generate a public domain under **Settings -> Networking -> Generate Domain**.

---

## Option 3: Docker Compose (Local / Cloud VPS)

To run the complete production stack on any VPS (AWS EC2, GCP Compute, DigitalOcean):

```bash
# Clone repository
git clone https://github.com/harshchavan009/BIS-Intelligence-.git
cd BIS-Intelligence-

# Build and start services
docker compose up -d --build

# Verify health
curl http://localhost:8000/api/health
```

---

## Production Security Checklist (GIGW / CERT-In)
- [x] Security headers middleware enabled (CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff).
- [x] Password autocomplete disabled on Evaluator Access Gate (`autoComplete="off"`, `demo` credentials).
- [x] Live simulated lookup disclosures visible on CM/L and HUID checkers.
- [x] Fully offline deterministic fallback active if cloud API quota expires.
