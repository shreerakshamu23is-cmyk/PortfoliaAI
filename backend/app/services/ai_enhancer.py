import re
import json
import uuid
import logging
from typing import Dict, Any, List
from app.ai.granite_client import granite_client
from app.schemas.portfolio import (
    PortfolioData, ContactInfo, ExperienceItem, ProjectItem,
    EducationItem, CertificationItem, SkillCategory
)

logger = logging.getLogger("ai_enhancer")

class AIEnhancerService:
    """Service to parse, enhance, and structure resume text into a premium Portfolio schema using IBM Granite AI."""

    @classmethod
    async def process_resume(cls, raw_text: str) -> PortfolioData:
        """Processes raw resume text using IBM Granite AI or fallback parser engine."""
        
        # Sanitize PDF stream markers if present in raw text
        if "%PDF-" in raw_text or "/Title" in raw_text or "endobj" in raw_text:
            from app.services.parser import ResumeParserService
            raw_text = ResumeParserService.sanitize_pdf_raw_text(raw_text)

        # Step 1: Try IBM Granite AI if configured
        if granite_client.is_configured():
            try:
                system_prompt = (
                    "You are IBM Granite AI, an expert recruiter and resume parser. "
                    "Extract structured resume data strictly from the provided text. "
                    "CRITICAL: Do NOT invent, hallucinate, or generate fictional work experience, projects, education, or certifications if they are missing from the resume. "
                    "If a section is not present in the resume text, return an empty array `[]` for that key in JSON. "
                    "Clean company names to omit parenthetical dates (e.g., 'Company' not 'Company (2023-Present)'). "
                    "Extract ALL projects and experiences present in the resume without omitting any. "
                    "Respond STRICTLY with valid JSON format adhering to the key names requested."
                )
                
                user_prompt = f"""
Extract and refine the following resume into JSON format:
{raw_text[:4000]}

Format JSON as follows (return empty lists [] for any missing sections):
{{
  "name": "Full Name",
  "title": "Professional Title",
  "about": "A concise summary emphasizing key strengths based on the resume.",
  "contact": {{
    "email": "email",
    "phone": "phone",
    "location": "city, country/state",
    "github": "github link or username",
    "linkedin": "linkedin link or username",
    "website": "portfolio link"
  }},
  "skills": [
    {{
      "category": "Category Name",
      "skills": ["Skill 1", "Skill 2"]
    }}
  ],
  "experience": [
    {{
      "title": "Role Title",
      "company": "Company Name",
      "location": "City, ST",
      "period": "Dates",
      "description": ["Bullet point 1", "Bullet point 2"],
      "technologies": ["Tech 1"]
    }}
  ],
  "projects": [
    {{
      "title": "Project Name",
      "description": "Project description.",
      "highlights": ["Key feature or achievement"],
      "technologies": ["Tech 1"],
      "github_url": "",
      "live_url": ""
    }}
  ],
  "education": [
    {{
      "degree": "Degree Name",
      "institution": "Institution",
      "location": "Location",
      "year": "Year range",
      "details": "Details"
    }}
  ],
  "certifications": [
    {{
      "name": "Certification Title",
      "issuer": "Issuer",
      "year": "Year"
    }}
  ],
  "hero_headline": "Crafting digital solutions and software",
  "hero_subheadline": "Developer passionate about web applications and technology."
}}
"""
                ai_response = await granite_client.generate_text(user_prompt, system_prompt)
                if ai_response:
                    json_str = cls._clean_json_str(ai_response)
                    parsed_dict = json.loads(json_str)
                    return cls._dict_to_portfolio_data(parsed_dict)
            except Exception as e:
                logger.warning(f"IBM Granite extraction error or invalid JSON output: {e}. Falling back to Smart Rule Parser.")

        # Step 2: Fallback to Smart Parser Engine
        return cls._smart_parse_resume(raw_text)

    @classmethod
    def _clean_json_str(cls, text: str) -> str:
        """Extracts JSON substring from LLM string."""
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            return text[start:end+1]
        return text

    @classmethod
    def _segment_resume(cls, lines: List[str]) -> Dict[str, List[str]]:
        sections = {
            "header": [],
            "profile": [],
            "experience": [],
            "projects": [],
            "additional_projects": [],
            "education": [],
            "certifications": [],
            "skills": [],
            "extracurricular": []
        }
        current_section = "header"

        profile_patterns = [r"^profile$", r"^about\s*me$", r"^summary$", r"^objective$", r"^personal\s+profile$", r"^executive\s+summary$"]
        exp_patterns = [r"work\s+experience", r"employment", r"work\s+history", r"professional\s+experience", r"career\s+history", r"internships"]
        proj_patterns = [r"technical\s+projects", r"personal\s+projects", r"academic\s+projects", r"key\s+projects", r"^projects$"]
        add_proj_patterns = [r"additional\s+projects", r"other\s+projects"]
        edu_patterns = [r"academic\s+background", r"academic\s+history", r"^education$"]
        cert_patterns = [r"certifications", r"certificates", r"licenses", r"credentials"]
        skills_patterns = [r"technical\s+skills", r"skills\s*&\s*tools", r"areas\s+of\s+expertise", r"^skills$"]
        extra_patterns = [r"extracurricular", r"co-curricular", r"leadership", r"achievements"]

        def matches_any(text, patterns):
            t = text.lower().strip()
            clean_t = re.sub(r'[^a-z0-9\s]', '', t)
            return any(re.search(p, clean_t) for p in patterns)

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            if len(stripped) < 45:
                if matches_any(stripped, profile_patterns):
                    current_section = "profile"
                    continue
                elif matches_any(stripped, exp_patterns):
                    current_section = "experience"
                    continue
                elif matches_any(stripped, add_proj_patterns):
                    current_section = "additional_projects"
                    continue
                elif matches_any(stripped, proj_patterns):
                    current_section = "projects"
                    continue
                elif matches_any(stripped, edu_patterns):
                    current_section = "education"
                    continue
                elif matches_any(stripped, cert_patterns):
                    current_section = "certifications"
                    continue
                elif matches_any(stripped, skills_patterns):
                    current_section = "skills"
                    continue
                elif matches_any(stripped, extra_patterns):
                    current_section = "extracurricular"
                    continue

            sections[current_section].append(stripped)

        return sections

    @classmethod
    def _smart_parse_resume(cls, text: str) -> PortfolioData:
        """High-precision regex/rule-based resume parser engine."""
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        sections = cls._segment_resume(lines)
        
        # 1. Extract Contact Info & URLs first (so they can be used for name fallback)
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        email = email_match.group(0) if email_match else ""

        # Strip font width arrays (e.g. 667 722 722 1000) before matching phone number
        cleaned_phone_text = re.sub(r'\b\d{3,4}(?:\s+\d{3,4}){2,}\b', '', text)
        phone_match = re.search(r"(\+?\d{1,3}[\s\.\-]?)?\(?\d{3}\)?[\s\.\-]?\d{3}[\s\.\-]?\d{4}", cleaned_phone_text)
        phone = phone_match.group(0) if phone_match else ""

        github_match = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+", text, re.IGNORECASE)
        github = github_match.group(0) if github_match else ""

        linkedin_match = re.search(r"(https?://)?(www\.)?linkedin\.com/in/([\w-]+)", text, re.IGNORECASE)
        linkedin = linkedin_match.group(0) if linkedin_match else ""
        linkedin_handle = linkedin_match.group(3) if linkedin_match else ""

        # 2. Extract Name (Ignore section header keywords, font specs, title fragments, and PDF tags)
        header_keywords = {"profile", "resume", "curriculum vitae", "cv", "contact", "summary", "education", "skills", "experience", "projects", "certifications", "internships", "objective", "software engineer & technology specialist", "arial,bold", "timesnewroman", "helvetica", "final"}
        name = ""

        # Check extracted /Title annotation first if present in text
        title_anno_match = re.search(r"/Title\s*\(([^)]+)\)", text)
        if title_anno_match:
            candidate_anno = title_anno_match.group(1).strip()
            if candidate_anno and candidate_anno.lower() not in header_keywords and not any(ext in candidate_anno.lower() for ext in [".pdf", ".docx", ".doc", "final", "%pdf"]):
                name = candidate_anno

        if not name:
            for line in lines[:10]:
                clean_line = line.strip()
                if clean_line.startswith("%") or "\ufffd" in clean_line or clean_line.startswith("/") or "http" in clean_line:
                    continue
                # Split line if it combines name with pipe/dash, e.g. "Alex Devlin | Senior Full-Stack Engineer"
                name_parts = re.split(r"\s+[|•·@–—]\s+|\s+-\s+", clean_line)
                candidate_part = name_parts[0].strip()
                candidate_lower = candidate_part.lower()

                if candidate_lower not in header_keywords and not re.search(r"[@\dhttp:]", candidate_part) and 2 <= len(candidate_part) <= 45:
                    clean_name = re.sub(r"^[-•*▸▪\d\.\s]+", "", candidate_part).strip()
                    if clean_name and not any(kw in clean_name.lower() for kw in ["resume", "curriculum vitae", "summary", "contact", "arial", "bold", "final"]):
                        name = clean_name
                        break

        # Fallback to LinkedIn handle or email username if name is invalid or missing
        if not name or name.startswith("%") or "\ufffd" in name or len(name) > 40 or name.lower() in header_keywords:
            if linkedin_handle:
                clean_parts = [w.capitalize() for w in re.split(r"[-_\.]", linkedin_handle) if w and not w.isdigit() and not (re.search(r"\d", w) and re.search(r"[a-zA-Z]", w) and len(w) >= 6)]
                if clean_parts:
                    name = " ".join(clean_parts)
            elif email:
                username = email.split("@")[0]
                clean_parts = [w.capitalize() for w in re.split(r"[-_\.]", username) if w and not w.isdigit()]
                if clean_parts:
                    name = " ".join(clean_parts)

        if not name or name.startswith("%") or name.lower() == "final":
            name = "Professional Candidate"

        # Extract Location (e.g. San Francisco, CA or London, UK)
        location_match = re.search(r"\b([A-Z][a-zA-Z ]{1,25},\s*(?:[A-Z]{2}|[A-Z][a-zA-Z ]{1,20}))\b", text[:1000])
        location = location_match.group(1).strip() if location_match and not any(kw in location_match.group(1).lower() for kw in ["github", "linkedin", "email", "resume", "engineer", "developer"]) else ""

        contact = ContactInfo(
            email=email,
            phone=phone,
            location=location,
            github=github,
            linkedin=linkedin,
            website=""
        )

        # 3. Extract Skills first so they can be matched across experience & projects
        skills = cls._extract_skills_from_section(sections.get("skills", []), text)
        all_skills_flat = [s for cat in skills for s in cat.skills]

        # 4. Extract Work Experience, Projects, Education & Certifications
        experience = cls._extract_experience(lines, sections["experience"], all_skills_flat)
        
        # Merge extracurricular into experience if experience is empty
        if not experience and sections.get("extracurricular"):
            extra_lines = sections["extracurricular"]
            curr_extra = None
            for eline in extra_lines:
                clean_e = re.sub(r"^[➤◦•\*\-\s]+", "", eline).strip()
                if not clean_e:
                    continue
                if eline.startswith("➤") or len(clean_e) < 50:
                    if curr_extra:
                        experience.append(curr_extra)
                    curr_extra = ExperienceItem(
                        id=str(uuid.uuid4())[:8],
                        title=clean_e,
                        company="Extracurricular Leadership",
                        location="",
                        period="Present",
                        description=[],
                        technologies=[]
                    )
                elif curr_extra:
                    curr_extra.description.append(clean_e)
            if curr_extra:
                experience.append(curr_extra)

        projects = cls._extract_projects_from_sections(sections["projects"], sections["additional_projects"], all_skills_flat)
        if not projects:
            projects = cls._extract_projects(lines, sections["projects"], all_skills_flat)

        education = cls._extract_education_enhanced(sections["education"])
        if not education:
            education = cls._extract_education(lines, sections["education"])

        certifications = cls._extract_certifications_enhanced(sections["certifications"])
        if not certifications:
            certifications = cls._extract_certifications(lines, sections["certifications"])

        # 5. Extract or Infer Professional Title dynamically
        title = ""
        
        # Check PROFILE section text first
        profile_text = " ".join(sections.get("profile", []))
        if profile_text:
            prof_match = re.search(r"(?:aspiring\s+)?([A-Za-z\-]+(?:\s+[A-Za-z\-]+)*\s+(?:Engineer|Developer|Architect|Analyst|Designer|Scientist|Specialist|Lead|Manager))(?:\s+with|\s+proficient|\s+passionate|\.|$)", profile_text, re.IGNORECASE)
            if prof_match:
                title = prof_match.group(1).strip()

        if not title:
            for line in lines[1:8]:
                clean_l = line.strip()
                if clean_l and clean_l != name and not re.search(r"[@\dhttp:]", clean_l) and len(clean_l) < 60:
                    if any(kw in clean_l.lower() for kw in ["engineer", "developer", "architect", "analyst", "designer", "scientist", "manager", "specialist", "consultant", "lead", "administrator", "founder", "associate"]):
                        t_parts = re.split(r"\s+[|•·@–—]\s+|\s+-\s+", clean_l)
                        for tp in t_parts:
                            if any(kw in tp.lower() for kw in ["engineer", "developer", "architect", "analyst", "designer", "scientist", "manager", "specialist", "consultant", "lead", "administrator", "founder"]):
                                title = tp.strip()
                                break
                        if title:
                            break

        if not title and experience:
            candidate_t = experience[0].title
            if not any(kw in candidate_t.lower() for kw in ["coordinator", "participant", "club", "member", "volunteer"]):
                title = candidate_t

        if not title:
            flat_skills = [s.lower() for s in all_skills_flat]
            if any(s in flat_skills for s in ["react", "vue", "angular", "next.js", "frontend", "html", "css", "jsp", "servlets"]):
                title = "Software Engineer & Full Stack Developer"
            elif any(s in flat_skills for s in ["python", "fastapi", "django", "node.js", "backend", "postgresql"]):
                title = "Senior Backend & Full-Stack Engineer"
            elif any(s in flat_skills for s in ["pytorch", "tensorflow", "machine learning", "data science", "pandas"]):
                title = "Data Scientist & AI Specialist"
            elif any(s in flat_skills for s in ["docker", "kubernetes", "aws", "devops", "ci/cd"]):
                title = "DevOps & Cloud Engineer"
            else:
                title = "Software Engineer & Technology Specialist"

        # 6. Extract About text from profile section or fallback
        about = " ".join(sections.get("profile", [])) if sections.get("profile") else ""
        if not about:
            about = cls._generate_about(name, title, lines, skills)

        hero_headline = f"Hi, I'm {name.split()[0] if name and name != 'Professional Candidate' else 'a Specialist'}"
        hero_subheadline = f"{title} - Building high-performance, recruiter-optimized software."

        return PortfolioData(
            name=name,
            title=title,
            about=about,
            contact=contact,
            skills=skills,
            experience=experience,
            projects=projects,
            education=education,
            certifications=certifications,
            hero_headline=hero_headline,
            hero_subheadline=hero_subheadline
        )

    @classmethod
    def _extract_skills_from_section(cls, skill_lines: List[str], full_text: str) -> List[SkillCategory]:
        categories = []
        for line in skill_lines:
            if ":" in line:
                parts = line.split(":", 1)
                cat_name = parts[0].strip()
                sk_list = [s.strip() for s in re.split(r"[,;]+", parts[1]) if s.strip()]
                if cat_name and sk_list:
                    categories.append(SkillCategory(category=cat_name, skills=sk_list))
        
        if not categories:
            return cls._extract_skills(full_text)
        return categories

    @classmethod
    def _extract_projects_from_sections(cls, proj_lines: List[str], add_proj_lines: List[str], all_skills: List[str]) -> List[ProjectItem]:
        items = []
        curr_proj = None

        action_verbs = {
            "built", "developed", "created", "designed", "implemented", "architected",
            "engineered", "spearheaded", "optimized", "constructed", "integrated",
            "applied", "automated", "formulated", "authored", "delivered", "managed", "led"
        }

        for line in proj_lines:
            clean_l = re.sub(r"^[-•*▸▪\d\.\s]+", "", line).strip()
            if not clean_l:
                continue

            first_word = clean_l.split()[0].lower() if clean_l.split() else ""

            if clean_l.lower().startswith("technologies:"):
                tech_str = clean_l.split(":", 1)[1]
                techs = [t.strip() for t in tech_str.split(",") if t.strip()]
                if curr_proj:
                    curr_proj.technologies.extend([t for t in techs if t not in curr_proj.technologies])
            elif curr_proj and (first_word in action_verbs or line.startswith(("-", "•", "*", "▸", "▪", "1.", "2.", "3.", "4.", "5.")) or len(clean_l) > 75):
                if not curr_proj.description:
                    curr_proj.description = clean_l
                else:
                    curr_proj.highlights.append(clean_l)

                # Match techs in text
                for s in all_skills:
                    if cls._matches_tech(clean_l, s) and s not in curr_proj.technologies:
                        curr_proj.technologies.append(s)
            else:
                if curr_proj:
                    items.append(curr_proj)
                
                github_m = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+/?[\w-]*", clean_l, re.IGNORECASE)
                github_url = github_m.group(0) if github_m else ""

                live_m = re.search(r"https?://[^\s]+", clean_l)
                live_url = live_m.group(0) if live_m and not (github_url and github_url in live_m.group(0)) else ""

                title = re.sub(r"^[\uf000-\uf8ff➤➢▸▪◦•\*\-\s]+", "", clean_l).strip()
                title = re.sub(r"\(.*?\)", "", title)
                title = re.split(r"\s+[|–—]\s+|\s+-\s+", title)[0].strip()
                title = re.sub(r"^[\uf000-\uf8ff➤➢▸▪◦•\*\-\s]+", "", title).strip()

                curr_proj = ProjectItem(
                    id=str(uuid.uuid4())[:8],
                    title=title if title else clean_l,
                    description="",
                    highlights=[],
                    technologies=[],
                    github_url=github_url,
                    live_url=live_url,
                    featured=True
                )
        if curr_proj:
            items.append(curr_proj)

        for line in add_proj_lines:
            clean_l = re.sub(r"^[•\*\-\s]+", "", line).strip()
            if not clean_l:
                continue
            if "–" in clean_l or "-" in clean_l:
                parts = re.split(r"[–-]", clean_l, 1)
                t = parts[0].strip()
                d = parts[1].strip()
                techs = [s for s in all_skills if cls._matches_tech(d, s)]
                items.append(ProjectItem(
                    id=str(uuid.uuid4())[:8],
                    title=t,
                    description=d,
                    highlights=[],
                    technologies=techs,
                    github_url="",
                    live_url="",
                    featured=False
                ))

        return items

    @classmethod
    def _extract_education_enhanced(cls, edu_raw: List[str]) -> List[EducationItem]:
        edu_list = []
        i = 0
        while i < len(edu_raw):
            line = edu_raw[i]
            clean_l = re.sub(r"^[•\*▸▪◦\-\s]+", "", line).strip()
            if not clean_l:
                i += 1
                continue

            year_match = re.search(r"\b(19|20)\d{2}\s*[-–—\s]+\s*(?:(19|20)\d{2}|present|current)\b|\b(19|20)\d{2}\b", clean_l, re.IGNORECASE)
            yr = year_match.group(0).strip() if year_match else ""
            clean_line = clean_l.replace(yr, "").strip(" ()\t-–—,").strip()

            if any(kw in clean_l for kw in ["Institute", "College", "School", "University"]):
                inst = clean_line
                deg = ""
                det = ""

                # Handle single line hyphenated format: "Govt PU College Sagara , Shivamogga- Pre University Education – Class XII"
                if "-" in clean_line or "–" in clean_line:
                    parts = re.split(r"\s*[-–]\s*", clean_line, 1)
                    if len(parts) >= 2 and any(kw in parts[0] for kw in ["Institute", "College", "School", "University"]):
                        inst = parts[0].strip()
                        deg = parts[1].strip()

                if not deg and i + 1 < len(edu_raw) and not any(kw in edu_raw[i+1] for kw in ["Institute", "College", "School", "University"]):
                    next_l = re.sub(r"^[•\*▸▪◦\-\s]+", "", edu_raw[i+1]).strip()
                    ym = re.search(r"\b(19|20)\d{2}\s*[-–—\s]+\s*(?:(19|20)\d{2}|present|current)\b|\b(19|20)\d{2}\b", next_l, re.IGNORECASE)
                    if ym and not yr:
                        yr = ym.group(0).strip()
                    deg = next_l.replace(yr, "").strip(" ()\t-–—,").strip()
                    i += 1

                # Check if next line is a detail bullet point (e.g. "Among the top 6% of the batch")
                if i + 1 < len(edu_raw):
                    peek_l = edu_raw[i+1].strip()
                    if peek_l.startswith(("•", "", "◦", "*", "-")) or "top" in peek_l.lower() or "percentage" in peek_l.lower() or "gpa" in peek_l.lower() or "cgpa" in peek_l.lower():
                        det = re.sub(r"^[•\*▸▪◦\-\s]+", "", peek_l).strip()
                        i += 1

                edu_list.append(EducationItem(
                    id=str(uuid.uuid4())[:8],
                    degree=deg if deg else "Education / Academic Background",
                    institution=inst,
                    location="",
                    year=yr,
                    details=det
                ))
            elif year_match or any(kw in clean_l.lower() for kw in ["class", "bachelor", "master", "phd", "b.s", "b.e", "m.s", "btech", "mtech", "diploma"]):
                deg = clean_line
                inst = ""
                if "-" in deg or "–" in deg:
                    parts = re.split(r"\s*[-–]\s*", deg, 1)
                    inst = parts[0].strip()
                    deg = parts[1].strip()
                elif "," in deg:
                    parts = deg.split(",", 1)
                    deg = parts[0].strip()
                    inst = parts[1].strip()

                edu_list.append(EducationItem(
                    id=str(uuid.uuid4())[:8],
                    degree=deg if deg else "Education / Academic Background",
                    institution=inst if inst else deg,
                    location="",
                    year=yr,
                    details=""
                ))
            i += 1
        return edu_list

    @classmethod
    def _extract_certifications_enhanced(cls, cert_lines: List[str]) -> List[CertificationItem]:
        certs = []
        for line in cert_lines:
            year_match = re.search(r"\b(19|20)\d{2}\b", line)
            yr = year_match.group(0) if year_match else ""
            clean_line = line.replace(yr, "").strip(" ()\t-–—,").strip()

            parts = [p.strip() for p in re.split(r"[-–—|]", clean_line) if p.strip()]
            if len(parts) >= 2:
                name = parts[0]
                issuer = parts[1]
                certs.append(CertificationItem(
                    id=str(uuid.uuid4())[:8],
                    name=name,
                    issuer=issuer,
                    year=yr
                ))
            else:
                certs.append(CertificationItem(
                    id=str(uuid.uuid4())[:8],
                    name=clean_line,
                    issuer="",
                    year=yr
                ))
        return certs

    @staticmethod
    def _matches_tech(text: str, tech: str) -> bool:
        if not text or not tech:
            return False
        lower_text = text.lower()
        lower_tech = tech.lower()
        if any(c in tech for c in ["+", "#", "."]):
            return lower_tech in lower_text
        try:
            pattern = r"\b" + re.escape(tech) + r"\b"
            return bool(re.search(pattern, text, re.IGNORECASE))
        except Exception:
            return lower_tech in lower_text

    @classmethod
    def _extract_skills(cls, text: str) -> List[SkillCategory]:
        known_techs = [
            "Python", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
            "Node.js", "FastAPI", "Django", "Flask", "Express", "HTML", "CSS", "Tailwind CSS",
            "PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL", "REST API",
            "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub Actions", "CI/CD",
            "Linux", "System Design", "Microservices", "Jest", "Pytest", "Tailwind", "Shadcn UI",
            "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "Flutter", "React Native",
            "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "OpenAI API", "LangChain"
        ]

        found_techs = []
        for tech in known_techs:
            if cls._matches_tech(text, tech):
                found_techs.append(tech)

        if not found_techs:
            return [SkillCategory(category="Technical Core", skills=["Software Development", "Problem Solving", "System Architecture", "Git"])]

        frontend = [t for t in found_techs if t in ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Vue.js", "Angular", "Tailwind", "Shadcn UI", "Flutter", "React Native"]]
        backend = [t for t in found_techs if t in ["Python", "FastAPI", "Django", "Flask", "Node.js", "Express", "PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL", "REST API", "Java", "C++", "C#", "PHP", "Ruby"]]
        tools = [t for t in found_techs if t in ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub Actions", "CI/CD", "Linux", "System Design", "Microservices", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "OpenAI API", "LangChain"]]

        categories = []
        if frontend:
            categories.append(SkillCategory(category="Frontend & Web", skills=frontend))
        if backend:
            categories.append(SkillCategory(category="Backend & Databases", skills=backend))
        if tools or not categories:
            categories.append(SkillCategory(category="DevOps & Tools", skills=tools if tools else found_techs[:4]))

        return categories

    @classmethod
    def _extract_experience(cls, lines: List[str], exp_lines: List[str], all_skills: List[str]) -> List[ExperienceItem]:
        target_lines = exp_lines if exp_lines else []
        if not target_lines:
            in_exp = False
            for line in lines:
                lower = line.lower()
                if any(kw in lower for kw in ["experience", "work history", "employment"]) and len(line) < 35:
                    in_exp = True
                    continue
                if in_exp and any(kw in lower for kw in ["education", "projects", "certifications", "skills"]):
                    break
                if in_exp:
                    target_lines.append(line)

        if not target_lines:
            return []

        items = []
        current_item = None
        role_keywords = ["engineer", "developer", "intern", "lead", "architect", "manager", "analyst", "specialist", "consultant", "programmer", "administrator", "scientist", "founder", "associate", "researcher"]
        date_pattern = re.compile(r"(\b(19|20)\d{2}\b|present|current|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b)", re.IGNORECASE)

        for line in target_lines:
            lower = line.lower()
            is_bullet = line.startswith(("-", "•", "*", "▸", "▪", "1.", "2.", "3.", "4.", "5."))
            clean_line = re.sub(r"^[-•*▸▪\d\.\s]+", "", line).strip()
            if not clean_line:
                continue

            has_role = any(role in lower for role in role_keywords)
            has_date = bool(date_pattern.search(lower))

            if (has_role or has_date) and not is_bullet and len(line) < 110:
                if current_item:
                    items.append(current_item)
                
                period = ""
                period_match = re.search(r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*[\d]{4}\s*[-–—\s]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current|[\d]{4}))", line, re.IGNORECASE)
                if period_match:
                    period = period_match.group(0).strip()

                # Clean line by removing period substring and parenthetical dates from line
                line_no_period = line
                if period:
                    line_no_period = line_no_period.replace(period, "")
                line_no_period = re.sub(r"\(\s*\)", "", line_no_period).strip(" -–—|@()")

                # Split title vs company
                parts = re.split(r"\s+[|•·@–—]\s+|\s+-\s+|@", line_no_period)
                part1 = parts[0].strip() if parts else line_no_period
                part2 = parts[1].strip() if len(parts) > 1 else ""

                # Check which part is the role title
                if any(r in part2.lower() for r in role_keywords) and not any(r in part1.lower() for r in role_keywords):
                    title = part2
                    company = part1
                else:
                    title = part1
                    company = part2

                # Ensure company name has parenthetical dates removed
                company = re.sub(r"\(\s*[\d]{4}.*?\)", "", company).strip()

                current_item = ExperienceItem(
                    id=str(uuid.uuid4())[:8],
                    title=title if title else "Software Engineer",
                    company=company,
                    location="",
                    period=period if period else "Present",
                    description=[],
                    technologies=[]
                )
            elif current_item:
                current_item.description.append(clean_line)
                for s in all_skills:
                    if cls._matches_tech(clean_line, s) and s not in current_item.technologies:
                        current_item.technologies.append(s)

        if current_item:
            items.append(current_item)

        return items

    @classmethod
    def _extract_projects(cls, lines: List[str], proj_lines: List[str], all_skills: List[str]) -> List[ProjectItem]:
        target_lines = proj_lines if proj_lines else []
        if not target_lines:
            in_proj = False
            for line in lines:
                lower = line.lower()
                if any(kw in lower for kw in ["projects", "personal projects"]) and len(line) < 35:
                    in_proj = True
                    continue
                if in_proj and any(kw in lower for kw in ["education", "experience", "certifications", "skills"]):
                    break
                if in_proj:
                    target_lines.append(line)

        if not target_lines:
            return []

        items = []
        current_proj = None

        action_verbs = {
            "built", "developed", "created", "designed", "implemented", "architected",
            "engineered", "spearheaded", "optimized", "constructed", "integrated",
            "applied", "automated", "formulated", "authored", "delivered", "managed", "led"
        }

        for line in target_lines:
            is_bullet = line.startswith(("-", "•", "*", "▸", "▪", "1.", "2.", "3.", "4.", "5."))
            clean_line = re.sub(r"^[-•*▸▪\d\.\s]+", "", line).strip()
            if not clean_line:
                continue

            first_word = clean_line.split()[0].lower() if clean_line.split() else ""
            is_title_candidate = not is_bullet and len(clean_line) < 80 and first_word not in action_verbs

            if is_title_candidate:
                if current_proj:
                    items.append(current_proj)
                
                techs = [s for s in all_skills if cls._matches_tech(clean_line, s)]

                github_m = re.search(r"(https?://)?(www\.)?github\.com/[\w-]+/?[\w-]*", clean_line, re.IGNORECASE)
                github_url = github_m.group(0) if github_m else ""

                live_m = re.search(r"https?://[^\s]+", clean_line)
                live_url = live_m.group(0) if live_m and not (github_url and github_url in live_m.group(0)) else ""

                title = re.sub(r"\(.*?\)", "", clean_line)
                title = re.split(r"\s+[|–—]\s+|\s+-\s+", title)[0].strip()

                current_proj = ProjectItem(
                    id=str(uuid.uuid4())[:8],
                    title=title if title else clean_line,
                    description="",
                    highlights=[],
                    technologies=techs,
                    github_url=github_url,
                    live_url=live_url
                )
            elif current_proj:
                for s in all_skills:
                    if s not in current_proj.technologies and cls._matches_tech(clean_line, s):
                        current_proj.technologies.append(s)

                if not current_proj.description:
                    current_proj.description = clean_line
                else:
                    current_proj.highlights.append(clean_line)

        if current_proj:
            items.append(current_proj)

        return items

    @classmethod
    def _extract_education(cls, lines: List[str], edu_lines: List[str]) -> List[EducationItem]:
        target_lines = edu_lines if edu_lines else []
        if not target_lines:
            in_edu = False
            for line in lines:
                lower = line.lower()
                if "education" in lower and len(line) < 35:
                    in_edu = True
                    continue
                if in_edu and any(kw in lower for kw in ["projects", "experience", "certifications", "skills"]):
                    break
                if in_edu:
                    target_lines.append(line)

        if not target_lines:
            return []

        items = []
        edu_keywords = ["bachelor", "master", "phd", "degree", "b.s", "b.e", "m.s", "btech", "mtech", "diploma", "associate", "university", "college", "school", "institute"]

        for line in target_lines:
            clean_line = re.sub(r"^[-•*▸▪\d\.\s]+", "", line).strip()
            if not clean_line:
                continue

            if any(kw in clean_line.lower() for kw in edu_keywords):
                year_match = re.search(r"\b(19|20)\d{2}\b(?:\s*[-–—\s]+\s*(?:\b(19|20)\d{2}\b|present))?", clean_line, re.IGNORECASE)
                year = year_match.group(0) if year_match else ""
                clean_degree = clean_line.replace(year, "").strip(" ()\t-–—,").strip()

                inst = ""
                deg = clean_degree
                if "," in clean_degree:
                    parts = clean_degree.split(",", 1)
                    deg = parts[0].strip()
                    inst = parts[1].strip()

                items.append(EducationItem(
                    id=str(uuid.uuid4())[:8],
                    degree=deg,
                    institution=inst,
                    location="",
                    year=year,
                    details=""
                ))

        return items

    @classmethod
    def _extract_certifications(cls, lines: List[str], cert_lines: List[str]) -> List[CertificationItem]:
        target_lines = cert_lines if cert_lines else []
        if not target_lines:
            in_cert = False
            for line in lines:
                lower = line.lower()
                if any(kw in lower for kw in ["certification", "certificate", "license"]) and len(line) < 35:
                    in_cert = True
                    continue
                if in_cert and any(kw in lower for kw in ["projects", "experience", "education", "skills"]):
                    break
                if in_cert:
                    target_lines.append(line)

        if not target_lines:
            return []

        items = []
        for line in target_lines:
            clean_line = re.sub(r"^[-•*▸▪\d\.\s]+", "", line).strip()
            if clean_line and len(clean_line) > 3:
                year_match = re.search(r"\b(19|20)\d{2}\b", clean_line)
                year = year_match.group(0) if year_match else ""
                clean_name = clean_line.replace(year, "").strip(" ()\t-–—,").strip()

                parts = [p.strip() for p in re.split(r"[-–—|]", clean_name) if p.strip()]
                items.append(CertificationItem(
                    id=str(uuid.uuid4())[:8],
                    name=parts[0] if parts else clean_name,
                    issuer=parts[1] if len(parts) > 1 else "",
                    year=year
                ))

        return items

    @classmethod
    def _generate_about(cls, name: str, title: str, lines: List[str], skills: List[SkillCategory]) -> str:
        all_skills = []
        for cat in skills:
            all_skills.extend(cat.skills)
        top_skills = ", ".join(all_skills[:5]) if all_skills else "modern technical tools"
        role_title = title if title else "Professional"
        
        return (
            f"Dedicated {role_title} proficient in {top_skills}. "
            f"Focused on delivering robust execution, clean architecture, and impactful results."
        )

    @classmethod
    def _dict_to_portfolio_data(cls, data: Dict[str, Any]) -> PortfolioData:
        contact_dict = data.get("contact", {})
        contact = ContactInfo(
            email=contact_dict.get("email", ""),
            phone=contact_dict.get("phone", ""),
            location=contact_dict.get("location", ""),
            github=contact_dict.get("github", ""),
            linkedin=contact_dict.get("linkedin", ""),
            website=contact_dict.get("website", "")
        )

        skills = []
        for cat in data.get("skills", []):
            if isinstance(cat, dict):
                skills.append(SkillCategory(
                    category=cat.get("category", "General Skills"),
                    skills=cat.get("skills", [])
                ))

        experience = []
        for idx, item in enumerate(data.get("experience", [])):
            if isinstance(item, dict):
                raw_company = item.get("company", "")
                clean_company = re.sub(r"\(\s*[\d]{4}.*?\)", "", raw_company).strip()
                experience.append(ExperienceItem(
                    id=f"exp-{idx+1}",
                    title=item.get("title", "Software Engineer"),
                    company=clean_company,
                    location=item.get("location", ""),
                    period=item.get("period", ""),
                    description=item.get("description", []) if isinstance(item.get("description"), list) else [str(item.get("description", ""))] if item.get("description") else [],
                    technologies=item.get("technologies", [])
                ))

        projects = []
        for idx, item in enumerate(data.get("projects", [])):
            if isinstance(item, dict):
                projects.append(ProjectItem(
                    id=f"proj-{idx+1}",
                    title=item.get("title", "Project"),
                    description=item.get("description", ""),
                    highlights=item.get("highlights", []) if isinstance(item.get("highlights"), list) else [],
                    technologies=item.get("technologies", []),
                    github_url=item.get("github_url", ""),
                    live_url=item.get("live_url", "")
                ))

        education = []
        for idx, item in enumerate(data.get("education", [])):
            if isinstance(item, dict):
                raw_deg = item.get("degree", "")
                clean_deg = re.sub(r"\(\s*\)", "", raw_deg).strip()
                education.append(EducationItem(
                    id=f"edu-{idx+1}",
                    degree=clean_deg,
                    institution=item.get("institution", ""),
                    location=item.get("location", ""),
                    year=item.get("year", ""),
                    details=item.get("details", "")
                ))

        certifications = []
        for idx, item in enumerate(data.get("certifications", [])):
            if isinstance(item, dict):
                certifications.append(CertificationItem(
                    id=f"cert-{idx+1}",
                    name=item.get("name", ""),
                    issuer=item.get("issuer", ""),
                    year=item.get("year", "")
                ))

        return PortfolioData(
            name=data.get("name", "Professional Candidate"),
            title=data.get("title", "Software Engineer"),
            about=data.get("about", ""),
            contact=contact,
            skills=skills,
            experience=experience,
            projects=projects,
            education=education,
            certifications=certifications,
            hero_headline=data.get("hero_headline", f"Hi, I'm {data.get('name', 'Developer').split()[0]}"),
            hero_subheadline=data.get("hero_subheadline", f"{data.get('title', 'Engineer')} - Building recruiter-optimized software solutions.")
        )

    @classmethod
    def enhance_summary(cls, summary: str, role_title: str = "Software Engineer") -> str:
        """Helper method to enhance summary string."""
        if not summary or len(summary.strip()) < 5:
            return f"Results-driven {role_title} passionate about scalable architecture and modern software design."
        return summary.strip()

    @classmethod
    def optimize_project(cls, title: str, description: str, technologies: List[str]) -> str:
        """Helper method to optimize project description."""
        if not description:
            tech_str = ", ".join(technologies) if technologies else "modern tech stack"
            return f"Designed and built {title} using {tech_str}."
        return description.strip()

ResumeAIEnhancer = AIEnhancerService

