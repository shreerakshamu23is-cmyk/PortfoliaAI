"""
Core Security Module
Provides password hashing, verification, and JWT access token creation/decoding.
"""
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Any, Union, Optional, Dict
from jose import jwt, JWTError

from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against hashed password."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback SHA256 verification
        key = settings.SECRET_KEY.encode('utf-8')
        calc = hmac.new(key, plain_password.encode('utf-8'), hashlib.sha256).hexdigest()
        return hmac.compare_digest(calc, hashed_password)

def get_password_hash(password: str) -> str:
    """Generates secure hash for raw password string."""
    try:
        return pwd_context.hash(password)
    except Exception:
        # Fallback SHA256 hashing
        key = settings.SECRET_KEY.encode('utf-8')
        return hmac.new(key, password.encode('utf-8'), hashlib.sha256).hexdigest()

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates signed JWT access token for authentication."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates signed JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
