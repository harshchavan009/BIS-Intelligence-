import os
import secrets
import hmac
import hashlib
import time
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Request, Response, status, Header
from pydantic import BaseModel, Field
from backend.app.core.config import settings

router = APIRouter()

# Authentication credentials (configurable via environment variables)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "evaluator")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "bis_sih_2026")
SECRET_KEY = os.getenv("SESSION_SECRET", "bis-sovereign-intelligence-secret-key-2026")

# In-memory session store (token -> expiry)
ACTIVE_SESSIONS = {}
CSRF_TOKENS = {}

class LoginRequest(BaseModel):
    username: str = Field(..., description="Evaluator / Officer Username")
    password: str = Field(..., description="Access Password")

SESSION_TIMEOUT_SECONDS = 1800  # 30-minute evaluator session timeout

def generate_session_token(username: str) -> str:
    raw = f"{username}:{time.time()}:{secrets.token_hex(16)}"
    sig = hmac.new(SECRET_KEY.encode(), raw.encode(), hashlib.sha256).hexdigest()
    token = f"{raw}:{sig}"
    ACTIVE_SESSIONS[token] = time.time() + SESSION_TIMEOUT_SECONDS
    return token

def validate_session_token(token: Optional[str]) -> bool:
    if not token or token not in ACTIVE_SESSIONS:
        return False
    expiry = ACTIVE_SESSIONS[token]
    if time.time() > expiry:
        del ACTIVE_SESSIONS[token]
        return False
    return True

def get_current_evaluator(
    request: Request,
    authorization: Optional[str] = Header(None)
) -> str:
    """Dependency to enforce authentication on protected views."""
    token = None
    # 1. Check Bearer Authorization Header
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
    # 2. Check Cookie
    elif "bis_evaluator_session" in request.cookies:
        token = request.cookies.get("bis_evaluator_session")

    if not validate_session_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in with authorized BIS Evaluator credentials to view internal telemetry.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return "BIS Domain Evaluator"

@router.post("/auth/login")
async def login(credentials: LoginRequest, response: Response):
    """
    Authenticate an evaluator to access protected telemetry and administrative analytics.
    Evaluator credentials are documented exclusively in README.md / Evaluator private guide.
    """
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        token = generate_session_token(credentials.username)
        # Set HttpOnly, SameSite cookie with 30-minute session lifetime
        response.set_cookie(
            key="bis_evaluator_session",
            value=token,
            max_age=SESSION_TIMEOUT_SECONDS,
            httponly=True,
            samesite="lax",
            secure=False # Set to True in HTTPS production
        )
        return {
            "status": "success",
            "authenticated": True,
            "user": "BIS Domain Evaluator",
            "token": token,
            "expires_in": SESSION_TIMEOUT_SECONDS
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Access denied."
        )

@router.get("/auth/verify")
async def verify_auth(user: str = Depends(get_current_evaluator)):
    """Check current authentication status."""
    return {"authenticated": True, "user": user}

@router.post("/auth/logout")
async def logout(response: Response, request: Request):
    """Clears evaluator session."""
    token = request.cookies.get("bis_evaluator_session")
    if token and token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
    response.delete_cookie("bis_evaluator_session")
    return {"status": "logged_out"}

@router.get("/auth/csrf")
async def get_csrf_token():
    """Generates an anti-CSRF token for state-changing operations."""
    token = secrets.token_hex(24)
    CSRF_TOKENS[token] = time.time() + 3600
    return {"csrf_token": token}
