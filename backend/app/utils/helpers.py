"""
Utility Helper Functions
Provides general string formatting, sanitization, and URL normalization tools.
"""
import re
import uuid
from typing import List, Optional

def generate_short_id(length: int = 8) -> str:
    """Generates a clean unique identifier string."""
    return str(uuid.uuid4()).replace("-", "")[:length]

def sanitize_string(input_str: Optional[str]) -> str:
    """Sanitizes text by removing control characters and normalizing whitespace."""
    if not input_str:
        return ""
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', input_str)
    return re.sub(r'\s+', ' ', cleaned).strip()

def normalize_url(url: Optional[str]) -> str:
    """Normalizes social and website URLs with proper https:// scheme."""
    if not url:
        return ""
    cleaned = url.strip()
    if not cleaned:
        return ""
    if not cleaned.startswith(("http://", "https://", "mailto:", "tel:")):
        return f"https://{cleaned}"
    return cleaned

def clean_skill_list(skills: List[str]) -> List[str]:
    """Deduplicates and trims skills array."""
    seen = set()
    result = []
    for skill in skills:
        cleaned = sanitize_string(skill)
        if cleaned and cleaned.lower() not in seen:
            seen.add(cleaned.lower())
            result.append(cleaned)
    return result
