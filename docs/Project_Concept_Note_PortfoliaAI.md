# Project Concept Note
## PortfoliaAI: Developer Portfolio & Resume Generator
**IBM Internship Project Submission**  
*July 23, 2026*  

---

## 1. Project Title and Application Name

* **Application Name:** PortfoliaAI
* **Project Category:** Enterprise Document Analyzer & Custom AI Agent
* **Live AWS URL:** `http://patchops-env.eba-jmpkxdb5.ap-south-1.elasticbeanstalk.com/`

---

## 2. Problem Statement & Objective

* **Problem Statement:** In today's competitive tech job market, developers, software engineers, and students spend countless hours manually formatting resumes and building web portfolios from scratch. Standard static templates lack personalization, while existing website builders are time-consuming and lack AI capabilities to automatically highlight technical achievements, structure project impact, or adapt layouts to developer skill sets.
* **Objective:** PortfoliaAI aims to drastically accelerate developer portfolio creation by providing an intelligent, automated generation platform. By securely ingesting raw resume documents (PDF/DOCX) and user input, the application leverages IBM Granite AI models to synthesize structured portfolio payloads, generate dynamic modern UI themes, support real-time interactive previews, and produce deployment-ready portfolios.

---

## 3. Target User and Use Case

* **Target Users:** Software Engineers, Full-Stack Developers, DevOps Engineers, Cloud Architects, Data Scientists, and Tech Students.
* **Primary Use Case:** A developer needs a high-impact portfolio for job applications. Instead of building a website manually for days, the user uploads their resume PDF to PortfoliaAI. The tool automatically parses their work history, enhances project descriptions with quantified achievements, categorizes technical skills, renders a modern responsive UI layout with customizable themes, and enables 1-click preview and export.

---

## 4. LLM Model and API Used

* **Model:** IBM Granite AI Model (`ibm/granite-13b-chat-v2`) on the IBM Watsonx.ai platform.
* **Integration:** Accessed via IBM Watsonx REST endpoints using IBM Cloud IAM OAuth 2.0 bearer tokens (`https://iam.cloud.ibm.com/identity/token`). The FastAPI backend manages token lifecycle and sends structured prompt payloads to Watsonx, parsing the returned text into validated Pydantic JSON objects for consumption by the Next.js frontend.

---

## 5. Key Features of the Application

* **AI Resume & PDF Ingestion:** Parses text from uploaded resume documents (PDF/DOCX) and converts unstructured text into clean portfolio schema objects.
* **Structured AI Content Enhancement:** Uses IBM Granite LLMs to rewrite and polish project summaries, bio statements, and skill descriptions with action-oriented metrics.
* **Multi-Theme Dynamic Rendering:** Real-time side-by-side preview engine supporting multiple customizable themes (Sleek Dark, Modern Glassmorphism, Minimalist, Tech Accent).
* **Interactive Editor & Customizer:** Multi-step creation wizard built with Next.js 14, React Hook Form, and Zod validation, giving users full control over skills, projects, and personal details.
* **State Persistence & Export Engine:** Syncs state with local storage, supports JSON import/export, and generates exportable portfolio data.
* **Secure Auth & User Management:** JWT-based user authentication, protected routes, and user profile management powered by FastAPI and SQLAlchemy.

---

## 6. Expected User Experience and Outcomes

* **User Experience:** Users navigate a step-by-step creation wizard and a live side-by-side preview dashboard featuring fluid Framer Motion transitions, real-time theme switching, and instant visual feedback.
* **Outcomes:** Developers using PortfoliaAI can launch a recruiter-ready portfolio site and polished resume content in under 5 minutes, eliminating manual web design toil and dramatically increasing job application conversion rates.
