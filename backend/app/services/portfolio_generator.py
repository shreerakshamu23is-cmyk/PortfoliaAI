"""
Portfolio Generator Service
Converts raw or parsed resume text into a structured, production-ready Portfolio object.
Handles theme assignment, hero headline generation, and frontend schema alignment.
"""
from typing import Dict, Any, Tuple
from app.schemas.portfolio import PortfolioData, PortfolioCreate
from app.services.ai_enhancer import AIEnhancerService
from app.services.theme_generator import ThemeGeneratorService

class PortfolioGeneratorService:
    @staticmethod
    async def generate_from_raw_text(raw_text: str, custom_theme: str = None) -> Tuple[PortfolioData, str]:
        """
        Parses and enhances raw text into a complete PortfolioData object and selected theme ID.
        """
        if not raw_text or not raw_text.strip():
            raise ValueError("Raw text content is required to generate a portfolio.")

        # 1. Process & enhance resume using AI / NLP parsing pipeline
        portfolio_data = await AIEnhancerService.process_resume(raw_text)

        # 2. Select theme automatically if not specified
        selected_theme = custom_theme
        if not selected_theme:
            selected_theme = ThemeGeneratorService.select_theme_for_portfolio(portfolio_data)

        # 3. Ensure hero headlines and bio are well-formed
        if not portfolio_data.hero_headline:
            portfolio_data.hero_headline = f"Hi, I'm {portfolio_data.name}"

        if not portfolio_data.hero_subheadline:
            portfolio_data.hero_subheadline = portfolio_data.title or "Software Engineer & Technology Specialist"

        return portfolio_data, selected_theme

    @staticmethod
    def generate_html_export(portfolio_data: PortfolioData, theme_id: str = "modern-glass") -> str:
        """
        Generates a standalone, self-contained HTML file for offline portfolio deployment.
        """
        name = portfolio_data.name or "Portfolio"
        title = portfolio_data.title or "Software Engineer"
        about = portfolio_data.about or ""
        email = portfolio_data.contact.email or ""
        phone = portfolio_data.contact.phone or ""
        github = portfolio_data.contact.github or ""
        linkedin = portfolio_data.contact.linkedin or ""

        # Build Skills HTML
        skills_html = ""
        for cat in portfolio_data.skills:
            badges = "".join([f'<span class="badge">{s}</span>' for s in cat.skills])
            skills_html += f'''
            <div class="skill-category">
                <h3>{cat.category}</h3>
                <div class="badges">{badges}</div>
            </div>'''

        # Build Experience HTML
        exp_html = ""
        for exp in portfolio_data.experience:
            bullets = "".join([f'<li>{d}</li>' for d in exp.description])
            tech_badges = "".join([f'<span class="tech-tag">{t}</span>' for t in exp.technologies])
            exp_html += f'''
            <div class="card">
                <div class="card-header">
                    <h3>{exp.title}</h3>
                    <span class="period">{exp.period}</span>
                </div>
                <p class="company">{exp.company} {f"• {exp.location}" if exp.location else ""}</p>
                <ul>{bullets}</ul>
                <div class="tech-tags">{tech_badges}</div>
            </div>'''

        # Build Projects HTML
        proj_html = ""
        for proj in portfolio_data.projects:
            tech_badges = "".join([f'<span class="tech-tag">{t}</span>' for t in proj.technologies])
            proj_html += f'''
            <div class="card">
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <div class="tech-tags">{tech_badges}</div>
            </div>'''

        # Build Education HTML
        edu_html = ""
        for edu in portfolio_data.education:
            edu_html += f'''
            <div class="card">
                <div class="card-header">
                    <h3>{edu.degree}</h3>
                    <span class="period">{edu.year}</span>
                </div>
                <p class="company">{edu.institution} {f"• {edu.location}" if edu.location else ""}</p>
                {f"<p>{edu.details}</p>" if edu.details else ""}
            </div>'''

        # Build Certifications HTML
        cert_html = ""
        for cert in portfolio_data.certifications:
            cert_html += f'''
            <div class="card inline-card">
                <h4>{cert.name}</h4>
                <p class="company">{cert.issuer} {f"({cert.year})" if cert.year else ""}</p>
            </div>'''

        html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - {title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }}
        body {{ background: #030712; color: #f3f4f6; padding: 2rem 1rem; line-height: 1.6; }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        header {{ text-align: center; padding: 3rem 1rem; background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; margin-bottom: 3rem; }}
        h1 {{ font-size: 2.8rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }}
        .subtitle {{ font-size: 1.25rem; color: #818cf8; font-weight: 600; margin-bottom: 1rem; }}
        .about {{ max-width: 700px; margin: 0 auto 1.5rem; color: #d1d5db; font-size: 0.95rem; }}
        .links {{ display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }}
        .btn {{ display: inline-block; padding: 0.6rem 1.2rem; border-radius: 0.5rem; background: rgba(255,255,255,0.08); color: #fff; text-decoration: none; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.15); transition: all 0.2s; }}
        .btn:hover {{ background: #4f46e5; border-color: #6366f1; }}
        section {{ margin-bottom: 3rem; }}
        h2 {{ font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(99,102,241,0.3); padding-bottom: 0.5rem; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }}
        .card {{ background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem; }}
        .card-header {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }}
        .company {{ color: #818cf8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem; }}
        .period {{ font-size: 0.75rem; color: #9ca3af; background: rgba(99,102,241,0.1); padding: 0.2rem 0.5rem; border-radius: 0.25rem; }}
        ul {{ padding-left: 1.2rem; color: #d1d5db; font-size: 0.85rem; margin-bottom: 1rem; }}
        li {{ margin-bottom: 0.4rem; }}
        .badges, .tech-tags {{ display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }}
        .badge {{ background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e5e7eb; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-size: 0.75rem; }}
        .tech-tag {{ background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-family: monospace; }}
        .skill-category {{ background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1.2rem; border-radius: 0.75rem; margin-bottom: 1rem; }}
        .skill-category h3 {{ font-size: 0.9rem; color: #818cf8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{name}</h1>
            <div class="subtitle">{title}</div>
            {f'<p class="about">{about}</p>' if about else ''}
            <div class="links">
                {f'<a href="mailto:{email}" class="btn">📧 {email}</a>' if email else ''}
                {f'<a href="tel:{phone}" class="btn">📞 {phone}</a>' if phone else ''}
                {f'<a href="{github}" target="_blank" class="btn">💻 GitHub</a>' if github else ''}
                {f'<a href="{linkedin}" target="_blank" class="btn">💼 LinkedIn</a>' if linkedin else ''}
            </div>
        </header>

        {f'<section><h2>Technical Expertise</h2><div class="grid">{skills_html}</div></section>' if skills_html else ''}
        {f'<section><h2>Work Experience & Leadership</h2>{exp_html}</section>' if exp_html else ''}
        {f'<section><h2>Featured Projects</h2><div class="grid">{proj_html}</div></section>' if proj_html else ''}
        {f'<section><h2>Education</h2>{edu_html}</section>' if edu_html else ''}
        {f'<section><h2>Certifications</h2><div class="grid">{cert_html}</div></section>' if cert_html else ''}
    </div>
</body>
</html>'''

        return html_template
