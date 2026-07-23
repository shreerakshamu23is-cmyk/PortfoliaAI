"""
AI Enhancement Router
Exposes dedicated REST APIs for AI summary enhancement, project description polishing, and theme recommendations.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status
from app.services.ai_enhancer import ResumeAIEnhancer
from app.services.theme_generator import ThemeGeneratorService

router = APIRouter(prefix="/ai", tags=["AI Services"])

class SummaryEnhanceRequest(BaseModel):
    summary: str
    role_title: Optional[str] = "Software Engineer"

class ProjectEnhanceRequest(BaseModel):
    title: str
    description: str
    technologies: List[str] = Field(default_factory=list)

class ThemeRecommendRequest(BaseModel):
    role_title: str
    skills: List[str] = Field(default_factory=list)

@router.post("/enhance-summary")
async def enhance_summary(payload: SummaryEnhanceRequest):
    """Enhance executive summary using IBM Granite AI or fallback NLP."""
    if not payload.summary or not payload.summary.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Summary text is required.")
    
    enhanced = ResumeAIEnhancer.enhance_summary(payload.summary, payload.role_title or "Software Engineer")
    return {"original": payload.summary, "enhanced": enhanced}

@router.post("/enhance-project")
async def enhance_project(payload: ProjectEnhanceRequest):
    """Polishes project description for recruiters and ATS scanners."""
    if not payload.title:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project title is required.")
    
    enhanced = ResumeAIEnhancer.optimize_project(
        payload.title,
        payload.description,
        payload.technologies
    )
    return {"title": payload.title, "enhanced_description": enhanced}

@router.post("/recommend-theme")
def recommend_theme(payload: ThemeRecommendRequest):
    """Recommends modern theme based on candidate role and skill set."""
    selected_theme = ThemeGeneratorService.select_theme_for_portfolio(
        payload.role_title,
        payload.skills
    )
    return {"role_title": payload.role_title, "recommended_theme": selected_theme}
