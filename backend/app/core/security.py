import time
import re
import html
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status

class InMemoryRateLimiter:
    """
    Sliding window in-memory rate limiter per IP address.
    Configured for 20 requests/minute by default.
    """
    def __init__(self, requests_per_minute: int = 20):
        self.rate_limit = requests_per_minute
        self.window_seconds = 60
        self.request_history: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, client_ip: str):
        now = time.time()
        window_start = now - self.window_seconds

        # Clean history older than window
        self.request_history[client_ip] = [
            ts for ts in self.request_history[client_ip] if ts > window_start
        ]

        if len(self.request_history[client_ip]) >= self.rate_limit:
            retry_after = int(self.window_seconds - (now - self.request_history[client_ip][0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded: Maximum {self.rate_limit} requests per minute. Try again in {max(1, retry_after)} seconds.",
                headers={"Retry-After": str(max(1, retry_after))}
            )

        self.request_history[client_ip].append(now)

rate_limiter = InMemoryRateLimiter(requests_per_minute=20)

def get_client_ip(request: Request) -> str:
    """Extract client IP handling x-forwarded-for headers if present."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def sanitize_text(text: str, max_length: int = 1000) -> str:
    """
    Sanitizes free-text user input:
    - Strips leading/trailing whitespace
    - Enforces length limits
    - Removes HTML and script tags to prevent XSS
    - Normalizes excessive whitespace
    """
    if not text:
        return ""
    
    # Strip HTML tags
    cleaned = re.sub(r'<[^>]*>', '', text)
    # Unescape HTML entities
    cleaned = html.unescape(cleaned)
    # Remove control characters except newline and tab
    cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', cleaned)
    # Normalize whitespace
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    # Truncate to maximum length
    cleaned = cleaned.strip()[:max_length]
    
    return cleaned
