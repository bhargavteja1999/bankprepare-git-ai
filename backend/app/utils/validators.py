import re
from pydantic import EmailStr

def validate_password_strength(pw: str) -> bool:
    if len(pw) < 8:
        return False
    has_upper = any(c.isupper() for c in pw)
    has_lower = any(c.islower() for c in pw)
    has_digit = any(c.isdigit() for c in pw)
    # require 8+ chars with at least 2 of 3 categories; keep simple for UX
    return sum([has_upper, has_lower, has_digit]) >= 2

def sanitize_text(s: str, max_len: int = 1000) -> str:
    if not s:
        return ""
    return s.strip()[:max_len]
