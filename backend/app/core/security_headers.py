from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects enterprise and GIGW-standard HTTP security headers:
    - HSTS (Strict-Transport-Security)
    - Clickjacking protection (X-Frame-Options: DENY)
    - MIME sniffing prevention (X-Content-Type-Options: nosniff)
    - Content Security Policy (strict CSP)
    - Referrer Policy
    - Permissions Policy (disabling unused hardware APIs)
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # 1. Transport Security (HSTS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # 2. Clickjacking Prevention
        response.headers["X-Frame-Options"] = "DENY"

        # 3. MIME-Type Sniffing Prevention
        response.headers["X-Content-Type-Options"] = "nosniff"

        # 4. Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # 5. Device Permissions Policy
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"

        # 6. Content Security Policy (CSP)
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: blob:; "
            "connect-src 'self' http://localhost:* http://127.0.0.1:* http://10.86.5.46:*; "
            "frame-ancestors 'none'; "
            "object-src 'none'; "
            "base-uri 'self';"
        )
        response.headers["Content-Security-Policy"] = csp

        return response
