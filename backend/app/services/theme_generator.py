"""
Theme Generator Service
Automatically selects profession-aware portfolio themes based on resume title & skill signals.
Provides theme metadata for the portfolio frontend.
"""
from typing import Dict, List, Any, Optional
from app.schemas.portfolio import PortfolioData

class ThemeGeneratorService:
    THEMES: List[Dict[str, Any]] = [
        {
            "id": "modern-glass",
            "name": "Neo Minimal",
            "description": "Luminous translucent glass cards, neon accents",
            "tag": "Software Engineer",
            "target_keywords": ["software engineer", "full stack", "developer", "web developer", "python", "java", "react", "c#", "c++", "full-stack"]
        },
        {
            "id": "executive-slate",
            "name": "Executive Slate",
            "description": "Classic serif typography, authoritative gold accents",
            "tag": "Architect / Lead",
            "target_keywords": ["architect", "lead", "manager", "director", "head", "executive", "vp", "chief", "principal", "consultant"]
        },
        {
            "id": "cyberpunk-tech",
            "name": "Cyber Tech",
            "description": "Pure black terminal aesthetic, cyan/emerald code",
            "tag": "DevOps / Backend",
            "target_keywords": ["devops", "backend", "cloud", "aws", "kubernetes", "docker", "sysadmin", "infrastructure", "linux", "database"]
        },
        {
            "id": "minimal-elegance",
            "name": "Apple Style",
            "description": "Crisp minimal whitespace, refined typography",
            "tag": "UI / Product",
            "target_keywords": ["ui", "ux", "designer", "product", "frontend", "mobile", "ios", "flutter", "figma", "graphic"]
        },
        {
            "id": "dark-prism",
            "name": "Aurora ML",
            "description": "Prismatic gradient backdrop, stat cards for AI/ML",
            "tag": "ML / Data Science",
            "target_keywords": ["machine learning", "ai", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "opencv", "llm", "genai"]
        },
        {
            "id": "cyber-security",
            "name": "Cybersecurity",
            "description": "Dark security matrix layout, red audit metrics",
            "tag": "Security / Audit",
            "target_keywords": ["security", "cybersecurity", "auditor", "penetration", "SOC", "infosec", "forensics", "compliance"]
        },
        {
            "id": "data-scientist",
            "name": "Data Scientist",
            "description": "Analytics dashboard grid, metric charts",
            "tag": "Data Science",
            "target_keywords": ["data scientist", "data analyst", "analytics", "bi", "pandas", "sql", "big data", "powerbi", "tableau"]
        }
    ]

    @classmethod
    def select_theme_for_portfolio(cls, portfolio_data_or_role: Any, skills: Optional[List[str]] = None) -> str:
        """Dynamically selects the best matching theme based on title, skills, and summary."""
        if isinstance(portfolio_data_or_role, PortfolioData):
            title_lower = (portfolio_data_or_role.title or "").lower()
            about_lower = (portfolio_data_or_role.about or "").lower()
            skills_text = ""
            for cat in portfolio_data_or_role.skills:
                skills_text += " " + cat.category.lower() + " " + " ".join(s.lower() for s in cat.skills)
            combined_text = f"{title_lower} {about_lower} {skills_text}"
        else:
            title_lower = str(portfolio_data_or_role or "").lower()
            skills_text = " ".join((s or "").lower() for s in (skills or []))
            combined_text = f"{title_lower} {skills_text}"

        # 1. Direct Title & Keyword Match Scoring
        best_theme = "modern-glass"
        max_score = 0

        for theme in cls.THEMES:
            score = 0
            for kw in theme["target_keywords"]:
                if kw in title_lower:
                    score += 5
                elif kw in combined_text:
                    score += 1
            if score > max_score:
                max_score = score
                best_theme = theme["id"]

        return best_theme

    @classmethod
    def get_all_themes(cls) -> List[Dict[str, Any]]:
        """Returns list of all supported portfolio themes."""
        return cls.THEMES

    @classmethod
    def get_theme_by_id(cls, theme_id: str) -> Dict[str, Any]:
        """Returns theme details by ID or default modern-glass theme."""
        for t in cls.THEMES:
            if t["id"] == theme_id:
                return t
        return cls.THEMES[0]
