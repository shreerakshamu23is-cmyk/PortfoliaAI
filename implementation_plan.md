# Implementation Plan - PortfolioAI

Build a full-stack, AI-powered web application that converts uploaded resumes (PDF/DOCX) into high-converting, recruiter-ready, animated portfolio websites in under 2 minutes.

## User Review Required

> [!IMPORTANT]
> **IBM Granite / Watsonx AI Setup & Standalone Runnability**: The backend is configured to use IBM Granite via `ibm-watsonx-ai` SDK or HTTP requests when `WATSONX_APIKEY` and `WATSONX_PROJECT_ID` are configured in `.env`. A robust fallback smart parsing & AI enrichment engine is included so the application is immediately testable and functional out of the box even before API keys are added.

> [!NOTE]
> **Database Flexibility**: SQLAlchemy configured with PostgreSQL database URL support, falling back to SQLite (`sqlite:///./portfolioai.db`) for instant zero-config local development.

## Proposed Architecture & Workflow

```
[Resume Upload (PDF/DOCX/Text)]
            │
            ▼
[Backend FastAPI Parsing (pypdf/pdfplumber/python-docx)]
            │
            ▼
[IBM Granite AI Enrichment (watsonx.ai)]
 ├─ Extract & Normalize (Name, Contact, About, Skills, Experience, Projects, Education, Certifications, Socials)
 └─ Enrich & Polish (Recruiter-friendly summary, action-word bullet points, skills categorization, theme matching)
            │
            ▼
[SQLAlchemy & Database Persistence]
            │
            ▼
[Next.js Interactive Studio]
 ├─ Real-time 4-step wizard (Upload → AI Processing → Customizer & Live Preview → Export/Share)
 ├─ Premium Themes (Modern Glassmorphism, Sleek Cyberpunk, Neo-Minimalist, Executive Slate, Dark Prism)
 ├─ Live Drag/Toggle/Edit Section Panels & Content Tweaker
 └─ Export Engine (Single-file HTML download, PDF export, Shareable public route `/preview/[id]`)
```

---

## Proposed Changes

### Backend (`/backend`)

#### [NEW] [config.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/config.py)
- Settings management using Pydantic Settings for Database URL, Secret Key, IBM WatsonX API Key, Project ID, WatsonX URL, and CORS origins.

#### [NEW] [database.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/database.py)
- SQLAlchemy engine initialization, `SessionLocal`, base declarative class, and `get_db` dependency helper.

#### [NEW] [models/user.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/models/user.py) & [models/portfolio.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/models/portfolio.py)
- User authentication model (email, password hash, name).
- Portfolio data model storing resume raw text, extracted structured JSON data, theme settings, custom sections, and public slug ID.

#### [NEW] [schemas/portfolio.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/schemas/portfolio.py) & [schemas/user.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/schemas/user.py)
- Pydantic models for request/response payloads: Resume Data (Name, About, Skills, Experience, Projects, Education, Certifications, Contact Info, Socials), Portfolio generation options, JWT tokens, and user credentials.

#### [NEW] [services/parser.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/services/parser.py)
- File extraction module supporting PDF (`pdfplumber` / `pypdf`) and Word (`python-docx`).
- Text normalization and cleaning.

#### [NEW] [ai/granite_client.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/ai/granite_client.py) & [services/ai_enhancer.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/services/ai_enhancer.py)
- IBM Granite AI client connecting to WatsonX (`granite-3-8b-instruct` / `granite-13b-chat-v2`).
- Prompts to extract structured JSON (Name, About, Skills, Experience, Projects, Education, Certifications, Contact, Links).
- AI enhancement: polish bullet points, boost action verbs, highlight achievements, match optimal color palette.

#### [NEW] [routers/auth.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/routers/auth.py), [routers/resume.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/routers/resume.py), [routers/portfolio.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/routers/portfolio.py)
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/resume/upload` -> Parses file and runs IBM Granite AI extraction & enhancement.
- `POST /api/portfolio/generate` -> Generates portfolio schema.
- `GET /api/portfolio/{id}` -> Fetches public/editable portfolio.
- `PUT /api/portfolio/{id}` -> Updates portfolio details & customization.
- `POST /api/portfolio/{id}/export` -> Generates single-file standalone portfolio bundle or HTML export.

#### [NEW] [main.py](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/backend/app/main.py)
- FastAPI application initialization, CORS middleware, API route inclusions, exception handling.

---

### Frontend (`/frontend`)

#### [NEW] [tsconfig.json](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/tsconfig.json) & [tailwind.config.ts](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/tailwind.config.ts) & [styles/globals.css](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/styles/globals.css)
- TypeScript configuration with `@/` path alias.
- Tailwind CSS configuration with modern color variables, animations, glassmorphism utilities, custom scrollbars, and card styling.

#### [NEW] [types/portfolio.ts](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/types/portfolio.ts)
- Comprehensive TypeScript interfaces for `PortfolioData`, `SkillCategory`, `Experience`, `Project`, `Education`, `Certification`, `SocialLinks`, and `ThemeConfig`.

#### [NEW] [lib/api.ts](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/lib/api.ts) & [lib/storage.ts](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/lib/storage.ts)
- Axios API client with bearer authentication headers.
- LocalStorage state manager for guest sessions and draft portfolios.

#### [NEW] [components/Navbar.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/Navbar.tsx) & [components/Footer.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/Footer.tsx)
- Modern glassmorphism header navigation with live status, mode toggle, and CTA.
- Elegant footer with credits and technology badges.

#### [NEW] [components/ResumeUpload.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/ResumeUpload.tsx)
- Drag-and-drop file uploader supporting PDF/DOCX, sample resume loader for 1-click testing, and parsing animation status.

#### [NEW] [components/portfolio/Themes.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/portfolio/Themes.tsx)
- 5 Premium Recruiter-Ready Templates:
  1. **Modern Glassmorphism**: Translucent cards, neon accent gradients, smooth scroll, glow effects.
  2. **Executive Slate**: Ultra-clean, authoritative serif/sans typography, subtle borders, high contrast.
  3. **Cyberpunk Tech**: Dark obsidian background, vibrant cyan/emerald accents, terminal-inspired badges.
  4. **Minimal Elegance**: Clean whitespace, subtle drop shadows, smooth hover transitions.
  5. **Creative Dark Prism**: Dynamic background mesh gradient, floating cards, interactive project filter tabs.

#### [NEW] [components/PortfolioPreview.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/PortfolioPreview.tsx)
- Full interactive live preview component rendered inside frame or full screen mode, with theme selector, section toggling, responsive device previews (Desktop, Tablet, Mobile).

#### [NEW] [components/editor/PortfolioEditor.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/components/editor/PortfolioEditor.tsx)
- Intuitive tabbed drawer/sidebar editor to edit Name, Bio, Skills (with tag manager), Work Experience, Projects, Education, Certifications, Social links, colors, and layout.

#### [NEW] [app/page.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/app/page.tsx)
- Landing page with heroic title, interactive demo upload zone, feature breakdown, live sample preview tabs, and testimonials.

#### [NEW] [app/generate/page.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/app/generate/page.tsx)
- The core 4-step Portfolio Creation Studio (Upload -> AI Enhance -> Customizer & Live Editor -> Download/Share).

#### [NEW] [app/preview/[id]/page.tsx](file:///c:/Users/dream/OneDrive/Desktop/PortfoliaAI/frontend/app/preview/[id]/page.tsx)
- Standalone shareable portfolio viewer for any generated portfolio ID or public link.

---

## Verification Plan

### Automated Tests
- Validate backend python scripts with fast unit check (parsing sample resumes, AI structured payload verification).
- Validate Next.js build compilation (`npm run build`).

### Manual Verification
- Test resume upload with sample PDF & Word documents.
- Test IBM Granite AI enrichment flow.
- Verify live editor updates reflect instantly in the preview.
- Test exporting single-file standalone HTML and sharing public link.
