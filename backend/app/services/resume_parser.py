"""
Resume Parser Service Module
Delegates file text extraction & sanitization to ResumeParserService in parser.py
"""
from app.services.parser import ResumeParserService

__all__ = ["ResumeParserService"]
