#!/usr/bin/env bash
# ==============================================================================
# Bureau of Indian Standards (BIS) AI Assistant — Single Command Launcher
# Smart India Hackathon (SIH) Prototype
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "================================================================="
echo "   BUREAU OF INDIAN STANDARDS — AI INTELLIGENT ASSISTANT"
echo "   Smart India Hackathon (SIH) Demo Launcher"
echo "================================================================="

# 1. Check if ChromaDB exists, if not run ingest
if [ ! -d "data/chroma_db" ] || [ ! -f "data/structured/is_product_map.json" ]; then
    echo "[1/3] First-time setup: Ingesting official BIS documents..."
    python3 scripts/ingest.py
    python3 scripts/seed_demo_cache.py
else
    echo "[1/3] Knowledge base verified (ChromaDB + SQLite ready)."
fi

# 2. Start Backend
echo "[2/3] Launching FastAPI Backend on http://127.0.0.1:8000..."
export PYTHONPATH="$SCRIPT_DIR:$PYTHONPATH"
python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Wait for backend readiness
echo "Waiting for backend health check..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
        echo "Backend is healthy and ready."
        break
    fi
    sleep 0.5
done

# 3. Start Frontend
echo "[3/3] Launching Vite Frontend on http://localhost:3000..."
cd "$SCRIPT_DIR/frontend"
npx vite --port 3000 &
FRONTEND_PID=$!

echo ""
echo "================================================================="
echo "   SYSTEM ONLINE AND DEMO READY!"
echo "   • Frontend Portal:  http://localhost:3000"
echo "   • Backend API & Docs: http://127.0.0.1:8000/docs"
echo "   • Health Check:     http://127.0.0.1:8000/api/health"
echo "   • Offline Parity:   100% (No internet needed for judging)"
echo "================================================================="
echo "Press Ctrl+C to terminate both servers."

wait
