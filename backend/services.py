from groq import Groq
from typing import Dict, Any, Optional
from config import settings
import json


class EmailGeneratorService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
    
    def generate_cold_email(
        self,
        resume_content: str,
        job_description: str,
        company_name: str,
        job_title: str,
        tone: str = "professional",
        length: str = "medium"
    ) -> Dict[str, str]:
        """
        Generate a personalized cold email using AI
        """
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        # Create the prompt
        prompt = self._create_email_prompt(
            resume_content,
            job_description,
            company_name,
            job_title,
            tone,
            length
        )
        
        try:
            # Call Groq API
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert email writer specializing in cold emails for job applications. Generate professional, personalized emails that highlight relevant skills and experience."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse response
            email_content = response.choices[0].message.content
            subject, body = self._parse_email_response(email_content, job_title, company_name)
            
            return {
                "subject": subject,
                "body": body,
                "tokens_used": response.usage.total_tokens if hasattr(response, 'usage') else 0
            }
        except Exception as e:
            raise Exception(f"Error generating email: {str(e)}")
    
    def _create_email_prompt(
        self,
        resume_content: str,
        job_description: str,
        company_name: str,
        job_title: str,
        tone: str,
        length: str
    ) -> str:
        """Create the prompt for email generation"""
        
        length_instructions = {
            "short": "Keep it brief (150-200 words)",
            "medium": "Write a moderate length email (250-350 words)",
            "long": "Write a comprehensive email (400-500 words)"
        }
        
        tone_instructions = {
            "professional": "Use a formal, professional tone",
            "friendly": "Use a warm, friendly yet professional tone",
            "enthusiastic": "Use an enthusiastic and energetic tone"
        }
        
        prompt = f"""
Generate a personalized cold email for a job application with the following details:

**Job Information:**
- Company: {company_name}
- Position: {job_title}
- Job Description: {job_description[:1000]}

**Candidate Resume Summary:**
{resume_content[:1500]}

**Requirements:**
1. {tone_instructions.get(tone, tone_instructions['professional'])}
2. {length_instructions.get(length, length_instructions['medium'])}
3. Highlight 2-3 relevant skills/experiences from the resume that match the job description
4. Show genuine interest in the company and role
5. Include a clear call-to-action
6. Make it personalized and avoid generic phrases

**Format:**
Subject: [Write an engaging subject line]

Body:
[Write the email body]

Make sure to start with "Subject:" on its own line.
"""
        return prompt
    
    def _parse_email_response(self, response: str, job_title: str, company_name: str) -> tuple:
        """Parse the AI response to extract subject and body"""
        lines = response.strip().split('\n')
        subject = ""
        body_lines = []
        
        found_subject = False
        for line in lines:
            if line.strip().startswith("Subject:"):
                subject = line.replace("Subject:", "").strip()
                found_subject = True
            elif found_subject and line.strip():
                body_lines.append(line)
        
        # Fallback subject if not found
        if not subject:
            subject = f"Application for {job_title} position at {company_name}"
        
        body = '\n'.join(body_lines).strip()
        
        # Fallback body if empty
        if not body:
            body = response.strip()
        
        return subject, body


class ResumeParserService:
    @staticmethod
    def parse_resume_text(content: str) -> Dict[str, Any]:
        """
        Parse resume text to extract key information
        This is a simple parser - can be enhanced with NLP libraries
        """
        parsed_data = {
            "skills": [],
            "experience": [],
            "education": [],
            "summary": ""
        }
        
        # Simple keyword-based extraction
        content_lower = content.lower()
        
        # Extract skills (basic keyword matching)
        skill_keywords = [
            "python", "javascript", "react", "node", "sql", "aws", "docker",
            "kubernetes", "java", "c++", "machine learning", "data science",
            "api", "rest", "graphql", "mongodb", "postgresql"
        ]
        
        for skill in skill_keywords:
            if skill in content_lower:
                parsed_data["skills"].append(skill.title())
        
        # Store first 500 chars as summary
        parsed_data["summary"] = content[:500]
        
        return parsed_data


class JobParserService:
    @staticmethod
    def parse_job_description(description: str, company_name: str, job_title: str) -> Dict[str, Any]:
        """
        Parse job description to extract key requirements
        """
        parsed_data = {
            "company": company_name,
            "title": job_title,
            "required_skills": [],
            "responsibilities": [],
            "summary": ""
        }
        
        # Extract key information
        parsed_data["summary"] = description[:500]
        
        # Basic skill extraction
        skill_keywords = [
            "python", "javascript", "react", "node", "sql", "aws", "docker",
            "kubernetes", "java", "c++", "machine learning", "data science"
        ]
        
        description_lower = description.lower()
        for skill in skill_keywords:
            if skill in description_lower:
                parsed_data["required_skills"].append(skill.title())
        
        return parsed_data


# Service instances
email_generator = EmailGeneratorService()
resume_parser = ResumeParserService()
job_parser = JobParserService()
