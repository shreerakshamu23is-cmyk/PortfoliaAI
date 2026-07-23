import asyncio
import unittest
from app.services.ai_enhancer import AIEnhancerService

class TestResumeParser(unittest.TestCase):
    def test_sample_resume_parsing(self):
        sample = """
Alex Devlin | Senior Full-Stack Engineer
San Francisco, CA | alex@example.com | (555) 019-2831 | github.com/alexdevlin | linkedin.com/in/alexdevlin

SUMMARY
Senior Full-Stack Engineer with 4+ years of experience building scalable microservices and responsive web platforms.

SKILLS
Frontend & Web: TypeScript, React, Next.js, HTML, CSS
Backend & Databases: Python, FastAPI, PostgreSQL, Node.js
DevOps & Cloud: Docker, Kubernetes, AWS

WORK EXPERIENCE
Senior Software Engineer - Apex Cloud Systems (2023-Present)
- Architected micro-frontend architecture using Next.js and Module Federation.
- Designed RESTful microservices with Python and FastAPI.

Full-Stack Engineer - Horizon Solutions (2021-2023)
- Developed responsive web interfaces using React and Tailwind CSS.

PROJECTS
AI Content Generator
- Built an AI-powered text generator using OpenAI API and Python.
- Implemented interactive UI components in React and TypeScript.

EDUCATION
B.S. in Computer Science, UC Berkeley (2017-2021)

CERTIFICATIONS
AWS Certified Solutions Architect - Amazon Web Services (2023)
"""
        result = asyncio.run(AIEnhancerService.process_resume(sample))

        self.assertEqual(result.name, "Alex Devlin")
        self.assertIn("Engineer", result.title)
        self.assertEqual(result.contact.email, "alex@example.com")
        self.assertEqual(result.contact.github, "github.com/alexdevlin")
        self.assertEqual(result.contact.linkedin, "linkedin.com/in/alexdevlin")
        self.assertIn("San Francisco, CA", result.contact.location)

        # Verify experience parsing: company should NOT contain (2023-Present)
        self.assertTrue(len(result.experience) >= 2)
        self.assertEqual(result.experience[0].company, "Apex Cloud Systems")
        self.assertEqual(result.experience[0].period, "2023-Present")

        # Verify projects
        self.assertTrue(len(result.projects) >= 1)
        self.assertEqual(result.projects[0].title, "AI Content Generator")

        # Verify education
        self.assertTrue(len(result.education) >= 1)
        self.assertEqual(result.education[0].degree, "B.S. in Computer Science")
        self.assertEqual(result.education[0].institution, "UC Berkeley")
        self.assertEqual(result.education[0].year, "2017-2021")

        # Verify certifications
        self.assertTrue(len(result.certifications) >= 1)
        self.assertEqual(result.certifications[0].name, "AWS Certified Solutions Architect")
        self.assertEqual(result.certifications[0].issuer, "Amazon Web Services")
        self.assertEqual(result.certifications[0].year, "2023")

    def test_raw_pdf_stream_parsing(self):
        raw_pdf_text = """Hi, I'm %PDF-1.5
Software Engineer & Technology Specialist

Experienced Software Engineer & Technology Specialist proficient in HTML, CSS, Git, Java. Passionate about clean design, scalability, and robust implementation.

Technical Expertise
Primary Stack & Tools
HTML
CSS
Git
Java

Work Experience
Software Engineer & Technology Specialist
Technology Solutions
2022 - Present
- Delivered end-to-end software features, optimized system stability.

Featured Projects
/Dest [5 0 R /XYZ 15 265 0]
/Title <FEFFF0D8002000420075007300200042006F006F006B0069006E006700200061006E00640020004D0061006E006100670065006D0065006E0074002000530079007300740065006D00280057006500620020006200610073006500640020004100700070006C00690063006100740069006F006E0029>
/Title (Technologies: Java, JSP, Servlets, JDBC, Oracle Database, HTML, CSS, Tomcat)
/Title (\( Developed a full-stack web application for online bus registration and ticket booking.)
/Title (\( Implemented features like user login/registration, bus registration \(admin only\), ticket booking, and user rating system.)
endobj
"""
        result = asyncio.run(AIEnhancerService.process_resume(raw_pdf_text))

        # Verify that %PDF-1.5 is NOT used as name
        self.assertNotEqual(result.name, "%PDF-1.5")
        self.assertNotEqual(result.name, "Hi, I'm %PDF-1.5")
        self.assertNotIn("%PDF-", result.name)

        # Verify projects extracted from titles
        self.assertTrue(len(result.projects) >= 1)
        self.assertNotIn("/Dest", result.projects[0].title)

if __name__ == "__main__":
    unittest.main()

