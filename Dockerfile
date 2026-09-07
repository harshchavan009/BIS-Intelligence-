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

# Install backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application, data, and ingestion scripts
COPY backend/ ./backend/
COPY data/ ./data/
COPY scripts/ ./scripts/

# Copy built frontend SPA assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ingest official BIS documents and seed offline demo cache during container build
# This bakes ChromaDB vector store and precomputed cache into the image,
# ensuring zero boot latency and 100% self-healing deployment on ephemeral disks.
RUN python scripts/ingest.py && python scripts/seed_demo_cache.py

# Configure runtime environment
ENV PORT=8000 \
    PYTHONUNBUFFERED=1 \
    LLM_PROVIDER=offline

EXPOSE 8000

# Render dynamically injects $PORT at runtime (e.g. 10000).
# Using shell execution so $PORT expands dynamically.
CMD python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
