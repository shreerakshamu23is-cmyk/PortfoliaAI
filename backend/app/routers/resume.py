"""
Resume Router
Handles upload endpoints for PDF, DOCX, and TXT resumes.
Triggers parsing, AI enhancement, theme selection, and portfolio structure generation.
"""
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.services.parser import ResumeParserService
from app.services.portfolio_generator import PortfolioGeneratorService
from app.schemas.portfolio import ResumeUploadResponse

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    """
    Upload resume file (PDF/DOCX/TXT) or raw text.
    Extracts text, runs AI enhancement, selects theme, and returns a structured Portfolio object.
    """
    extracted_text = ""

    if file:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )
        filename = file.filename or "resume.pdf"
        try:
            extracted_text = ResumeParserService.parse_file(filename, file_bytes)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error parsing resume file '{filename}': {str(e)}"
            )
    elif raw_text and raw_text.strip():
        extracted_text = raw_text.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid PDF/DOCX file or paste raw resume text."
        )

    if not extracted_text or len(extracted_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text content from the uploaded file."
        )

    try:
        portfolio_data, selected_theme = await PortfolioGeneratorService.generate_from_raw_text(extracted_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Portfolio AI generation failed: {str(e)}"
        )

    return ResumeUploadResponse(
        raw_text=extracted_text,
        portfolio_data=portfolio_data,
        ai_enhanced=True
    )
