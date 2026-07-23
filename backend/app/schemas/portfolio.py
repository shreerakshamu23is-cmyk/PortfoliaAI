from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContactInfo(BaseModel):
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    website: Optional[str] = ""

class ExperienceItem(BaseModel):
    id: Optional[str] = ""
    title: str
    company: str
    location: Optional[str] = ""
    period: str
    description: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class ProjectItem(BaseModel):
    id: Optional[str] = ""
    title: str
    description: str
    highlights: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""
    featured: Optional[bool] = True

class EducationItem(BaseModel):
    id: Optional[str] = ""
    degree: str
    institution: str
    location: Optional[str] = ""
    year: str
    details: Optional[str] = ""

class CertificationItem(BaseModel):
    id: Optional[str] = ""
    name: str
    issuer: str
    year: Optional[str] = ""
    credential_url: Optional[str] = ""

class SkillCategory(BaseModel):
    category: str
    skills: List[str] = Field(default_factory=list)

class PortfolioData(BaseModel):
    name: str
    title: str = "Software Engineer & Innovator"
    about: str
    contact: ContactInfo = Field(default_factory=ContactInfo)
    skills: List[SkillCategory] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    hero_headline: Optional[str] = "Building scalable, elegant digital solutions"
    hero_subheadline: Optional[str] = ""

class Customizations(BaseModel):
    primaryColor: Optional[str] = "#3b82f6"
    fontFamily: Optional[str] = "Inter"
    showCertifications: Optional[bool] = True
    showEducation: Optional[bool] = True
    sectionOrder: List[str] = Field(
        default_factory=lambda: [
            "about",
            "skills",
            "experience",
            "projects",
            "education",
            "certifications",
            "contact"
        ]
    )

class PortfolioCreate(BaseModel):
    title: Optional[str] = "My Portfolio"
    theme: Optional[str] = "modern-glass"
    data: PortfolioData
    customizations: Optional[Customizations] = Field(default_factory=Customizations)

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    theme: Optional[str] = None
    data: Optional[PortfolioData] = None
    customizations: Optional[Customizations] = None

class PortfolioResponse(BaseModel):
    id: str
    user_id: Optional[int] = None
    title: str
    theme: str
    data: PortfolioData
    customizations: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    raw_text: str
    portfolio_data: PortfolioData
    ai_enhanced: bool = True
