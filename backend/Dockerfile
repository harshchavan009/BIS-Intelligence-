# ==============================================================================
# Multi-stage Dockerfile for Bureau of Indian Standards (BIS) AI Assistant
# Stage 1: Build React/Vite Frontend SPA
# Stage 2: Python Runtime, Document Ingestion & FastAPI Application
# ==============================================================================

# --- Stage 1: Build Frontend SPA ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python Application Runtime ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies (using CPU-only torch to eliminate 3.5GB CUDA bloat)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application, data, and ingestion scripts
COPY backend/ ./backend/
COPY data/ ./data/
COPY scripts/ ./scripts/

# Copy built frontend SPA assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Seed offline demo cache into SQLite (<0.2s, zero ML overhead).
# Precomputed ChromaDB vector index (5.4MB) and SQLite DB are shipped directly in data/.
RUN python scripts/seed_demo_cache.py

# Configure runtime environment
ENV PORT=8000 \
    PYTHONUNBUFFERED=1 \
    APP_MODE=demo \
    EMBEDDING_MODE=lightweight \
    LLM_PROVIDER=offline

EXPOSE 8000

# Render dynamically injects $PORT at runtime (e.g. 10000).
# Using single worker to preserve 512MB RAM budget.
CMD python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
