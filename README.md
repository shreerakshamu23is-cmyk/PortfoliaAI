# PortfolioAI 🚀
> **AI-Powered Resume to Premium Recruiter Portfolio Platform**  
> Powered by IBM Granite 3.0 8B Instruct & watsonx.ai

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![IBM Granite](https://img.shields.io/badge/AI%20Engine-IBM%20Granite-blue)](https://www.ibm.com/granite)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and `npm`
- Python 3.10+ and `pip`

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/PortfoliaAI.git
cd PortfoliaAI
```

---

### 2. Backend Setup
```bash
cd backend

# Create Python virtual environment
python -m venv venv
# Activate on Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Activate on macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python run_backend.py
```
> Backend API will start running at: `http://localhost:8000`  
> Interactive OpenAPI Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> Frontend Application will start running at: `http://localhost:3000`

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

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Create new user account.
- `POST /api/auth/login` — Sign in and issue JWT access token.
- `GET /api/auth/me` — Fetch currently authenticated user profile.

### Resume Parsing & AI
- `POST /api/resume/upload` — Upload PDF/DOCX resume file or raw text to parse and generate portfolio structure.
- `POST /api/ai/enhance-summary` — Enhance professional summary using IBM Granite AI.
- `POST /api/ai/enhance-project` — Polish project bullet points for ATS optimization.

### Portfolio Management
- `GET /api/portfolio` — List portfolios owned by the authenticated user.
- `POST /api/portfolio` — Create and save portfolio object.
- `GET /api/portfolio/{id}` — Fetch portfolio by ID (Public preview).
- `PUT /api/portfolio/{id}` — Update portfolio data or theme.
- `DELETE /api/portfolio/{id}` — Delete user portfolio.
- `POST /api/portfolio/{id}/export` — Download standalone HTML export.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
