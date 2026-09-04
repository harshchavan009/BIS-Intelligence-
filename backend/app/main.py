import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.security_headers import SecurityHeadersMiddleware
from backend.app.models.database import init_db
from backend.app.api.chat import router as chat_router
from backend.app.api.standards import router as standards_router
from backend.app.api.schemes import router as schemes_router
from backend.app.api.labs import router as labs_router
from backend.app.api.documents import router as docs_router
from backend.app.api.feedback import router as feedback_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.health import router as health_router
from backend.app.api.verify import router as verify_router
from backend.app.api.auth import router as auth_router

# Initialize Database tables
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official AI-Powered Intelligent Assistant for Indian Standards and BIS Services (SIH Prototype)"
)

# 1. Enterprise Security Headers Middleware (HSTS, CSP, X-Frame-Options, nosniff)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Hardened CORS Configuration (Locked to trusted frontend origins, no wildcard *)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.86.5.46:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "X-CSRF-Token"],
)

# 3. Register Routers
app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Authentication & Access Control"])
app.include_router(chat_router, prefix=settings.API_V1_STR, tags=["Chat & Q&A"])
app.include_router(standards_router, prefix=settings.API_V1_STR, tags=["Standards Finder"])
app.include_router(schemes_router, prefix=settings.API_V1_STR, tags=["Certification Schemes"])
app.include_router(labs_router, prefix=settings.API_V1_STR, tags=["Testing Laboratories"])
app.include_router(docs_router, prefix=settings.API_V1_STR, tags=["Document Excerpt Viewer"])
app.include_router(feedback_router, prefix=settings.API_V1_STR, tags=["User Feedback"])
app.include_router(analytics_router, prefix=settings.API_V1_STR, tags=["Live Analytics (Auth-Gated)"])
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["Health Check"])
app.include_router(verify_router, prefix=settings.API_V1_STR, tags=["Simulated Verification"])

@app.get("/")
def root():
    return {
        "message": "Welcome to BIS AI Intelligent Assistant API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "security_compliance": "GIGW & CERT-In baseline aligned"
    }
