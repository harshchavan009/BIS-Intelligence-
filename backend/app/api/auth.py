import os
import secrets
import hmac
import hashlib
import time
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Request, Response, status, Header
from pydantic import BaseModel, Field
from backend.app.core.config import settings
from backend.app.core.security import (
    login_rate_limiter,
    get_client_ip,
    verify_password,
    hash_password,
    log_audit_event,
    sanitize_text
)

router = APIRouter()

# Authentication credentials - stored exclusively as bcrypt hashes (never plaintext)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "evaluator")
# Pre-computed bcrypt hash for 'bis_sih_2026'
DEFAULT_ADMIN_HASH = "$2b$12$ps0EY6PMVCajnST0A91Im.KCnYl4nsodKK070onF0CQp1btp9CLwG"
# Pre-computed bcrypt hash for 'demo'
DEFAULT_DEMO_HASH = "$2b$12$ZvMpEuVeffXM7VB4ogp.teH6kurmFY1bgEN7pUjz999w064Mlo2Ce"

ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
if not ADMIN_PASSWORD_HASH:
    env_plain = os.getenv("ADMIN_PASSWORD")
    ADMIN_PASSWORD_HASH = hash_password(env_plain) if env_plain else DEFAULT_ADMIN_HASH

DEMO_PASSWORD_HASH = os.getenv("DEMO_PASSWORD_HASH", DEFAULT_DEMO_HASH)
SECRET_KEY = os.getenv("SESSION_SECRET", "bis-sovereign-intelligence-secret-key-2026")

# In-memory session store (token -> expiry)
ACTIVE_SESSIONS = {}
CSRF_TOKENS = {}

class LoginRequest(BaseModel):
    username: str = Field(..., description="Evaluator / Officer Username")
    password: str = Field(..., description="Access Password")

SESSION_TIMEOUT_SECONDS = 28800  # 8-hour evaluator session lifetime (DPDP / GIGW standard)

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
    """Dependency to enforce server-side authentication on protected views and telemetry data."""
    token = None
    # 1. Check Bearer Authorization Header
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
    # 2. Check HttpOnly Cookie
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
async def login(credentials: LoginRequest, response: Response, request: Request):
    """
    Authenticate an evaluator to access protected telemetry and administrative analytics.
    Protected with bcrypt verification and per-IP brute force protection (max 5 attempts / 15 mins).
    """
    client_ip = get_client_ip(request)
    # Enforce brute-force rate limit BEFORE credential evaluation
    login_rate_limiter.check_rate_limit(client_ip)

    clean_user = sanitize_text(credentials.username, max_length=50).strip()
    pwd = credentials.password

    # Validate against hashed credentials
    is_demo = (clean_user == "demo" and verify_password(pwd, DEMO_PASSWORD_HASH))
    is_admin = (clean_user == ADMIN_USERNAME and verify_password(pwd, ADMIN_PASSWORD_HASH))

    if is_demo or is_admin:
        # Reset failed attempt counter on successful authentication
        login_rate_limiter.reset_attempts(client_ip)
        token = generate_session_token(clean_user)

        # Set HttpOnly, SameSite=Strict cookie with 8-hour session lifetime
        is_secure = request.url.scheme == "https" or os.getenv("ENV") == "production"
        response.set_cookie(
            key="bis_evaluator_session",
            value=token,
            max_age=SESSION_TIMEOUT_SECONDS,
            httponly=True,
            samesite="strict",
            secure=is_secure
        )
        user_label = "BIS Domain Evaluator (Demo Session)" if is_demo else "BIS Domain Evaluator"
        log_audit_event("LOGIN_SUCCESS", client_ip, "SUCCESS", f"User: {clean_user}")

        return {
            "status": "success",
            "authenticated": True,
            "user": user_label,
            "token": token,
            "expires_in": SESSION_TIMEOUT_SECONDS
        }
    else:
        # Record failed attempt towards lockout threshold
        login_rate_limiter.record_attempt(client_ip)
        log_audit_event("LOGIN_FAILED", client_ip, "FAILURE", f"Invalid credentials for user: {clean_user}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid evaluator credentials. Please enter authorized username and password."
        )

@router.get("/auth/verify")
async def verify_auth(user: str = Depends(get_current_evaluator)):
    """Check current server-side authentication status."""
    return {"authenticated": True, "user": user}

@router.post("/auth/logout")
async def logout(response: Response, request: Request):
    """Clears and invalidates evaluator session."""
    token = request.cookies.get("bis_evaluator_session")
    if token and token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
    # Delete cookie explicitly
    response.delete_cookie(
        key="bis_evaluator_session",
        httponly=True,
        samesite="strict"
    )
    client_ip = get_client_ip(request)
    log_audit_event("LOGOUT", client_ip, "SUCCESS", "Evaluator session terminated")
    return {"status": "logged_out", "authenticated": False}

@router.get("/auth/csrf")
async def get_csrf_token():
    """Generates an anti-CSRF token for state-changing operations."""
    token = secrets.token_hex(24)
    CSRF_TOKENS[token] = time.time() + 3600
    return {"csrf_token": token}

