# Project Report
## PortfoliaAI: Development Process & Technical Architecture
**IBM Internship Project Submission**  
*July 23, 2026*  

**Live AWS Deployment URL:** `http://patchops-env.eba-jmpkxdb5.ap-south-1.elasticbeanstalk.com/`

---

## 1. Application Overview and Tech Stack

**PortfoliaAI** is an AI-powered Developer Portfolio & Resume Generation Platform designed to streamline and automate the creation of high-impact, responsive developer portfolios and tailored resumes. It serves as an intelligent generation engine that ingests raw user data, resume uploads, and career profiles, transforming them into structured payloads rendered across dynamic modern UI themes with live customization and export capabilities.

### Technology Stack:

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS. Integrated with Framer Motion for smooth UI transitions, React Hook Form with Zod for client-side schema validation, Lucide React icons, and Sonner toast notifications.
* **Backend:** Python FastAPI. Selected for its native asynchronous performance, auto-generated OpenAPI documentation, modular `APIRouter` structure, and strict Pydantic data validation.
* **Database & Persistence:** SQLite / PostgreSQL managed via SQLAlchemy ORM for authentication, user session state, uploaded resume management, and portfolio theme configurations.
* **AI/LLM:** IBM Granite AI models (`ibm/granite-13b-chat-v2`) integrated via the IBM Watsonx.ai REST API using OAuth 2.0 IAM token authentication for structured JSON generation and content enhancement.
* **Infrastructure & DevOps:** Docker containerization, deployed on AWS Elastic Beanstalk / App Runner with environment variable configuration and build pipelines.

---

## 2. Prompting Strategy and Frameworks

The intelligence of PortfoliaAI relies on a constrained, persona-driven prompt engineering strategy. To ensure the LLM returns strictly valid, parsable data for frontend state management, the application utilizes **Role Prompting**, **Few-Shot Formatting Constraints**, and **Strict JSON Schema Enforcement**.

### Sample Prompt 1: AI Resume Parsing & Portfolio Payload Generation

```text
Role: You are an Expert Technical Recruiter and Portfolio Architect.
Task: Analyze the provided raw resume text {raw_resume_text} and convert it into a structured developer portfolio schema.

Constraint 1 (Data Extraction): Extract personal details, bio, technical skills grouped by domain, work experience, education, and projects.
Constraint 2 (Enhancement): Rewrite project descriptions using action verbs and quantified achievements.
Constraint 3 (JSON Output Only): You MUST return ONLY valid JSON matching the exact schema below inside ```json backticks. DO NOT include any introductory or trailing text.

Example Output format:
```json
{
  "personal_info": {
    "name": "Jane Doe",
    "title": "Full Stack Engineer",
    "bio": "Passionate developer specializing in distributed cloud systems..."
  },
  "skills": ["TypeScript", "Python", "FastAPI", "Next.js", "Docker"],
  "projects": [
    {
      "title": "Cloud Monitoring Dashboard",
      "description": "Architected a real-time monitoring engine using WebSockets and React.",
      "tech_stack": ["React", "FastAPI", "WebSockets"]
    }
  ]
}
```
```

---

### Sample Prompt 2: Product Architecture and Lifecycle Planning

To accelerate the development of PortfoliaAI, LLMs were utilized as architectural copilots, executing under strict phased constraints based on enterprise development standards:

```text
Role: You are an Expert Full-Stack Developer and AWS Cloud Architect.
Task: Act as my copilot to build an AI-Powered Portfolio Generator called "PortfoliaAI".

Constraint: You must guide me through this exact 6-phase lifecycle, ensuring production-grade quality at each step. Do not move to the next phase until I confirm the current phase is complete.

Phase A (Foundation & Security): Secure .env secrets, tighten CORS, establish FastAPI authentication with JWT, and setup Next.js 14 App Router layout.
Phase B (Backend Reliability & Data Model): Implement SQLAlchemy models for users, resumes, and portfolio state with Pydantic schemas and database migrations.
Phase C (AI Quality & Uniqueness): Integrate IBM Watsonx API for IBM Granite models, implementing IAM OAuth token management, prompt template engines, and JSON validation fallbacks.
Phase D (Frontend Enterprise UX): Build a responsive multi-step portfolio generator wizard, live side-by-side preview canvas, theme customizer, and Framer Motion UI animations.
Phase E (State Persistence & Export Flows): Implement local storage sync, JSON import/export, client-side PDF export flows, and theme preset generators.
Phase F (Quality Gates & Deployment): Establish CI lint/test checks, configure multi-stage Docker profiles, and deploy to AWS Elastic Beanstalk.
```

By enforcing negative constraints ("DO NOT include explanatory text outside JSON blocks"), the backend Python parser can reliably parse AI payloads into strongly-typed Pydantic models.

---

## 3. Phase-by-Phase Development Summary

The project was executed across six structured phases:

* **Phase A — Foundation & Security:** Established baseline security by configuring `.env` secret management, configuring CORS policies, implementing JWT authentication in FastAPI, and setting up the Next.js 14 frontend project structure.
* **Phase B — Backend Reliability & Data Model:** Designed relational database schemas in SQLAlchemy (`users`, `resumes`, `portfolios`). Built RESTful API routes for authentication, resume uploads, and CRUD operations on portfolio state.
* **Phase C — AI Quality & Uniqueness:** Engineered the `IBMGraniteClient` to interact with IBM Watsonx.ai via REST and IAM OAuth token authentication. Implemented JSON schema enforcement and fallback heuristics for resilient AI responses.
* **Phase D — Frontend Enterprise UX:** Developed a modern, intuitive user interface featuring a multi-step portfolio creation wizard, live side-by-side theme preview, responsive layout templates, and Framer Motion micro-animations.
* **Phase E — State Persistence & Export Flows:** Built synchronization logic between client state and local storage, theme customization engines, and export utilities for user data.
* **Phase F — Quality Gates & Deployment:** Configured Docker container definitions for backend and frontend, performed integration testing, and finalized deployment on AWS Elastic Beanstalk.

---

## 6. Application Architecture

The architecture follows a modern, decoupled cloud-native pattern:

1. **Client Layer (Next.js 14 Frontend):** A responsive React application built with TypeScript and Tailwind CSS. Manages multi-step form state, live theme preview rendering, and asynchronous HTTP requests to the backend.
2. **Application Layer (FastAPI / AWS):** An asynchronous FastAPI backend deployed on AWS Elastic Beanstalk. Handles JWT authentication, file upload processing, database ORM interactions via SQLAlchemy, and business logic routing.
3. **Intelligence Layer (IBM Watsonx / Granite AI):** Manages secure communication with the IBM Watsonx.ai platform over HTTPS. Authenticates via IBM Cloud IAM OAuth tokens and invokes the IBM Granite LLM to generate structured portfolio JSON payloads.
4. **Data & Persistence Layer:** Relational database storing user accounts, uploaded resume metadata, and saved portfolio configurations.

---

## 5. Challenges Encountered and Resolutions

* **Challenge — Non-Deterministic LLM JSON Output:** LLMs occasionally included conversational preambles or markdown text alongside JSON, breaking the backend parsing pipeline.  
  * **Resolution:** Hardened system prompts with negative constraints (`"DO NOT output markdown outside code blocks"`) and implemented a regex-based JSON extractor in Python with Pydantic validation boundaries.
* **Challenge — Complex Resume Formatting Ingestion:** Raw uploaded resumes varied significantly in formatting, leading to missing attributes during AI extraction.  
  * **Resolution:** Implemented multi-stage text extraction using `pdfplumber` and `python-docx` combined with structured prompt chunking in `IBMGraniteClient`.
* **Challenge — Next.js Client-Side Hydration Mismatches:** Live preview state stored in local storage caused hydration errors when rendering server-side Next.js components.  
  * **Resolution:** Wrapped local storage access within `useEffect` client hooks and implemented hydration-safe state initialization boundaries.

---

## 6. Key Learnings and Reflection

Building **PortfoliaAI** provided deep insights into developing AI-integrated full-stack enterprise applications. Key learnings include wrapping LLM outputs in strict type validation schemas, maintaining robust state synchronization between client and server layers, and integrating enterprise cloud AI services like IBM Watsonx. Utilizing a phased copilot prompting strategy significantly accelerated development velocity, allowing for a primary focus on user experience, system architecture, and robust API integration.

---

# SCREENSHOTS

*(Insert your application screenshots here)*
