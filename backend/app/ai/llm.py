"""
LLM Service Module
Interfaces with IBM Granite on watsonx.ai for text enhancement and ATS optimization.
"""
from typing import Optional, Dict, Any
from app.ai.granite_client import granite_client

class LLMService:
    @staticmethod
    async def enhance_summary(summary: str, role_title: str = "Software Engineer") -> str:
        """
        Enhances executive summary using IBM Granite AI or returns cleaned summary.
        """
        if not summary or len(summary.strip()) < 10:
            return f"Results-driven {role_title} passionate about scalable architecture and high-impact digital solutions."

        prompt = f"Rewrite and enhance the following resume summary to sound compelling, executive, and recruiter-ready:\n\n{summary}"
        system_prompt = "You are an expert technical resume writer. Respond ONLY with the enhanced professional summary paragraph."

        enhanced = await granite_client.generate_text(prompt, system_prompt)
        if enhanced and len(enhanced.strip()) > 15:
            return enhanced.strip()

        return summary.strip()

    @staticmethod
    async def optimize_project_description(title: str, description: str, technologies: list) -> str:
        """
        Optimizes project description bullet points for recruiters & ATS scanners.
        """
        if not description:
            return f"Developed {title} utilizing {', '.join(technologies) if technologies else 'modern software engineering practices'}."

        prompt = f"Optimize this project description for title '{title}' with tech stack [{', '.join(technologies)}]:\n{description}"
        system_prompt = "You are a senior hiring manager. Enhance the project description into 2 concise, impact-focused sentences."

        enhanced = await granite_client.generate_text(prompt, system_prompt)
        if enhanced and len(enhanced.strip()) > 15:
            return enhanced.strip()

        return description.strip()

llm_service = LLMService()
