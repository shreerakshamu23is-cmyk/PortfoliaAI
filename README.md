# PortfolioAI 🚀
> **AI-Powered Resume to Premium Recruiter Portfolio Platform**  
> Powered by IBM Granite 3.0 8B Instruct & watsonx.ai



---

## 🌟 Overview

**PortfolioAI** is a full-stack AI platform that converts raw PDF, DOCX, or text resumes into animated, recruiter-optimized portfolio websites in under 2 minutes.

Built for engineers, data scientists, designers, and tech leaders, PortfolioAI uses **IBM Granite 3.0 8B Instruct** to structure resume content into ATS-compliant tech categories, enhance career summaries, and render responsive, interactive web portfolios.

---

## ✨ Key Features

- 📄 **Multi-Format Resume Parser**: Supports high-fidelity text extraction from PDF, DOCX, and raw text resumes.
- 🤖 **IBM Granite AI Enhancement**: Formats skills into standard technical taxonomy groups (Frontend, Backend, DevOps, AI) and polishes bullet points for recruiter impact.
- 🎨 **7 Profession-Aware Themes**:
  - `Neo Minimal` — Translucent glass cards with neon accents (Software Engineers)
  - `Executive Slate` — Classic serif typography with authoritative gold accents (Architects & Leads)
  - `Cyber Tech` — Terminal aesthetic with cyan/emerald code (DevOps & Systems)
  - `Apple Style` — Crisp whitespace with ultra-clean typography (UI/Product Managers)
  - `Aurora ML` — Prismatic gradient backdrop with metric cards (AI & ML Engineers)
  - `Cybersecurity` — Dark security matrix layout with audit badges (Security Analysts)
  - `Data Scientist` — Analytics grid with metric visualization styling
- 🔒 **User Authentication & Portfolio Isolation**:
  - Secure JWT registration & login (`/login` & `/register`).
  - Private user dashboard (`/dashboard`) guaranteeing each user sees only their own portfolios.
- ⚡ **Studio Live Editor**: Split-screen editor allowing real-time edits to bio, experience, projects, skills, and instant theme switching.
- 🔗 **Shareable Links & Standalone HTML Export**:
  - Instant share links for job applications (`/preview/[id]`).
  - Downloadable zero-dependency single-file HTML exports for offline use or GitHub Pages.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS / Tailwind CSS (Dark Mode & Glassmorphism design system)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ORM & DB**: SQLAlchemy with SQLite (development) & PostgreSQL support
- **Authentication**: JWT (JSON Web Tokens) with Passlib & PyJWT
- **Document Parsers**: `pypdf`, `python-docx`, `pdfplumber`
- **AI Engine**: IBM Granite 3.0 8B Instruct via watsonx.ai SDK / HTTP REST fallback

---


## 🔑 Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PROJECT_NAME="PortfolioAI API"
VERSION="1.0.0"
SECRET_KEY="your_super_secret_jwt_key"

# Database Configuration (Defaults to SQLite if omitted)
DATABASE_URL="sqlite:///./portfolioai.db"

# IBM Granite / Watsonx.ai Configuration (Optional - Smart Fallback included)
WATSONX_APIKEY="your_ibm_watsonx_api_key"
WATSONX_PROJECT_ID="your_ibm_watsonx_project_id"
WATSONX_URL="https://us-south.ml.cloud.ibm.com"
GRANITE_MODEL_ID="ibm/granite-3-8b-instruct"
```
 AWS DeploymentURL:https://52-201-247-205.sslip.io/
---


## 📄 License

This project is licensed under the [MIT License](LICENSE).
