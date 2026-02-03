"""
Enhanced AI Services for LanditAI
- Job URL Scraping
- LaTeX Resume Generation
- Cover Letter Generation
- Resume Analysis & ATS Scoring
- Interview Question Generation
- Skills Gap Analysis
"""

from groq import Groq
from typing import Dict, Any, Optional, List
from config import settings
import json
import re
import httpx
from bs4 import BeautifulSoup
import asyncio
from urllib.parse import urlparse


class JobScraperService:
    """Scrape job details from popular job boards"""
    
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    async def scrape_job_url(self, url: str) -> Dict[str, Any]:
        """
        Scrape job details from a URL
        Supports: LinkedIn, Indeed, Glassdoor, generic job pages
        """
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                response = await client.get(url, headers=self.HEADERS)
                response.raise_for_status()
                
            soup = BeautifulSoup(response.text, 'html.parser')
            domain = urlparse(url).netloc.lower()
            
            # Route to appropriate parser
            if 'linkedin' in domain:
                return self._parse_linkedin(soup, url)
            elif 'indeed' in domain:
                return self._parse_indeed(soup, url)
            elif 'glassdoor' in domain:
                return self._parse_glassdoor(soup, url)
            elif 'greenhouse' in domain:
                return self._parse_greenhouse(soup, url)
            elif 'lever' in domain:
                return self._parse_lever(soup, url)
            else:
                return self._parse_generic(soup, url)
                
        except Exception as e:
            raise Exception(f"Failed to scrape job URL: {str(e)}")
    
    def _parse_linkedin(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Parse LinkedIn job posting"""
        job_data = {
            "source": "LinkedIn",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
            "job_type": "",
            "experience_level": "",
            "posted_date": "",
        }
        
        # Job title
        title_elem = soup.find('h1', class_='top-card-layout__title') or soup.find('h1')
        if title_elem:
            job_data["job_title"] = title_elem.get_text(strip=True)
        
        # Company name
        company_elem = soup.find('a', class_='topcard__org-name-link') or soup.find('span', class_='topcard__flavor')
        if company_elem:
            job_data["company_name"] = company_elem.get_text(strip=True)
        
        # Location
        location_elem = soup.find('span', class_='topcard__flavor--bullet')
        if location_elem:
            job_data["location"] = location_elem.get_text(strip=True)
        
        # Job description
        desc_elem = soup.find('div', class_='show-more-less-html__markup') or soup.find('div', class_='description__text')
        if desc_elem:
            job_data["job_description"] = desc_elem.get_text(separator='\n', strip=True)
        
        return job_data
    
    def _parse_indeed(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Parse Indeed job posting"""
        job_data = {
            "source": "Indeed",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
            "salary": "",
            "job_type": "",
        }
        
        # Job title
        title_elem = soup.find('h1', {'data-testid': 'jobsearch-JobInfoHeader-title'}) or soup.find('h1', class_='jobsearch-JobInfoHeader-title')
        if title_elem:
            job_data["job_title"] = title_elem.get_text(strip=True)
        
        # Company name
        company_elem = soup.find('div', {'data-testid': 'inlineHeader-companyName'}) or soup.find('div', class_='icl-u-lg-mr--sm')
        if company_elem:
            job_data["company_name"] = company_elem.get_text(strip=True)
        
        # Location
        location_elem = soup.find('div', {'data-testid': 'job-location'}) or soup.find('div', {'data-testid': 'inlineHeader-companyLocation'})
        if location_elem:
            job_data["location"] = location_elem.get_text(strip=True)
        
        # Job description
        desc_elem = soup.find('div', id='jobDescriptionText') or soup.find('div', class_='jobsearch-jobDescriptionText')
        if desc_elem:
            job_data["job_description"] = desc_elem.get_text(separator='\n', strip=True)
        
        return job_data
    
    def _parse_glassdoor(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Parse Glassdoor job posting"""
        job_data = {
            "source": "Glassdoor",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
            "rating": "",
        }
        
        # Job title
        title_elem = soup.find('div', {'data-test': 'jobTitle'}) or soup.find('h1')
        if title_elem:
            job_data["job_title"] = title_elem.get_text(strip=True)
        
        # Company
        company_elem = soup.find('div', {'data-test': 'employerName'})
        if company_elem:
            job_data["company_name"] = company_elem.get_text(strip=True)
        
        # Job description
        desc_elem = soup.find('div', class_='jobDescriptionContent') or soup.find('div', {'data-test': 'jobDescription'})
        if desc_elem:
            job_data["job_description"] = desc_elem.get_text(separator='\n', strip=True)
        
        return job_data
    
    def _parse_greenhouse(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Parse Greenhouse job posting"""
        job_data = {
            "source": "Greenhouse",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
        }
        
        # Job title
        title_elem = soup.find('h1', class_='app-title') or soup.find('h1')
        if title_elem:
            job_data["job_title"] = title_elem.get_text(strip=True)
        
        # Company
        company_elem = soup.find('span', class_='company-name')
        if company_elem:
            job_data["company_name"] = company_elem.get_text(strip=True)
        
        # Location
        location_elem = soup.find('div', class_='location')
        if location_elem:
            job_data["location"] = location_elem.get_text(strip=True)
        
        # Job description
        desc_elem = soup.find('div', id='content')
        if desc_elem:
            job_data["job_description"] = desc_elem.get_text(separator='\n', strip=True)
        
        return job_data
    
    def _parse_lever(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Parse Lever job posting"""
        job_data = {
            "source": "Lever",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
        }
        
        # Job title
        title_elem = soup.find('h2', class_='posting-headline') or soup.find('h2')
        if title_elem:
            job_data["job_title"] = title_elem.get_text(strip=True)
        
        # Location
        location_elem = soup.find('div', class_='location')
        if location_elem:
            job_data["location"] = location_elem.get_text(strip=True)
        
        # Job description
        desc_elem = soup.find('div', class_='section-wrapper')
        if desc_elem:
            job_data["job_description"] = desc_elem.get_text(separator='\n', strip=True)
        
        return job_data
    
    def _parse_generic(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Generic job page parser using common patterns"""
        job_data: Dict[str, Any] = {
            "source": "Other",
            "url": url,
            "company_name": "",
            "job_title": "",
            "location": "",
            "job_description": "",
        }
        
        # Try common title selectors
        for selector in ['h1', '.job-title', '.position-title', '[class*="title"]']:
            elem = soup.select_one(selector)
            if elem and elem.get_text(strip=True):
                job_data["job_title"] = elem.get_text(strip=True)
                break
        
        # Try to extract main content
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile(r'job|description|content', re.I))
        if main_content and hasattr(main_content, 'find_all'):
            # Remove scripts and styles
            for tag in main_content.find_all(['script', 'style', 'nav', 'footer', 'header']):
                tag.decompose()
            job_data["job_description"] = main_content.get_text(separator='\n', strip=True)[:5000]
        
        # Try meta tags for company
        meta_company = soup.find('meta', property='og:site_name')
        if meta_company and hasattr(meta_company, 'get'):
            job_data["company_name"] = str(meta_company.get('content', ''))
        
        return job_data


class LatexResumeService:
    """Generate and tune LaTeX resumes"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
    
    def generate_latex_resume(
        self,
        resume_content: str,
        job_description: Optional[str] = None,
        template_style: str = "modern",
        emphasis_skills: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate a LaTeX resume tuned for the job description
        """
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        template_instructions = {
            "modern": "Use a clean, modern design with subtle colors and good whitespace",
            "classic": "Use a traditional, professional layout suitable for conservative industries",
            "minimal": "Use a minimalist design with maximum content density",
            "creative": "Use a creative design with visual elements (suitable for design/creative roles)",
            "academic": "Use an academic CV style with detailed sections for publications and research"
        }
        
        skills_emphasis = ""
        if emphasis_skills:
            skills_emphasis = f"\n- Emphasize these skills prominently: {', '.join(emphasis_skills)}"
        
        job_tuning = ""
        if job_description:
            job_tuning = f"""
**Target Job Description:**
{job_description[:2000]}

**Job-Specific Tuning:**
- Reorder sections to highlight most relevant experience first
- Use keywords from the job description naturally
- Quantify achievements that align with job requirements
- Adjust skill emphasis to match job needs"""
        
        prompt = f"""Generate a complete, compilable LaTeX resume based on the following content.

**Resume Content:**
{resume_content[:3000]}
{job_tuning}

**Style Requirements:**
- Template Style: {template_style} - {template_instructions.get(template_style, template_instructions['modern'])}
{skills_emphasis}

**Technical Requirements:**
1. Use standard LaTeX packages (geometry, hyperref, fontspec if needed, titlesec, enumitem)
2. Ensure the code compiles without errors
3. Include proper sections: Contact Info, Summary/Objective, Experience, Education, Skills
4. Use professional formatting with consistent spacing
5. Make it ATS-friendly (no graphics, simple structure)
6. Add comments for easy customization

**Output Format:**
Return ONLY the complete LaTeX code, starting with \\documentclass and ending with \\end{{document}}.
Do not include any explanations or markdown code blocks."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert LaTeX resume designer. Generate clean, professional, ATS-friendly LaTeX resumes that compile without errors."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.3,
                max_tokens=4000
            )
            
            latex_code = response.choices[0].message.content or ""
            
            # Clean up the response
            latex_code = self._clean_latex_response(latex_code)
            
            return {
                "latex_code": latex_code,
                "template_style": template_style,
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            raise Exception(f"Error generating LaTeX resume: {str(e)}")
    
    def _clean_latex_response(self, content: str) -> str:
        """Clean up AI response to get pure LaTeX code"""
        # Remove markdown code blocks if present
        content = re.sub(r'^```(?:latex|tex)?\s*\n?', '', content)
        content = re.sub(r'\n?```\s*$', '', content)
        
        # Ensure it starts with documentclass
        if '\\documentclass' in content:
            start = content.find('\\documentclass')
            content = content[start:]
        
        # Ensure it ends with end document
        if '\\end{document}' in content:
            end = content.find('\\end{document}') + len('\\end{document}')
            content = content[:end]
        
        return content.strip()


class CoverLetterService:
    """Generate tailored cover letters"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
    
    def generate_cover_letter(
        self,
        resume_content: str,
        job_description: str,
        company_name: str,
        job_title: str,
        tone: str = "professional",
        include_salary_expectation: bool = False,
        custom_points: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate a tailored cover letter"""
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        tone_instructions = {
            "professional": "Formal and professional, suitable for corporate environments",
            "enthusiastic": "Energetic and passionate while remaining professional",
            "confident": "Self-assured and accomplished, highlighting key achievements",
            "storytelling": "Narrative style that tells a compelling career story"
        }
        
        custom_section = ""
        if custom_points:
            custom_section = f"\n**Points to Include:**\n" + "\n".join(f"- {point}" for point in custom_points)
        
        salary_section = ""
        if include_salary_expectation:
            salary_section = "\n- Include a professional statement about being open to discussing compensation"
        
        prompt = f"""Generate a professional cover letter for the following job application:

**Job Details:**
- Company: {company_name}
- Position: {job_title}
- Job Description: {job_description[:2000]}

**Candidate Resume:**
{resume_content[:2000]}

**Writing Requirements:**
- Tone: {tone_instructions.get(tone, tone_instructions['professional'])}
- Length: 3-4 paragraphs (300-400 words)
- Structure: Opening hook → Relevant experience/skills → Why this company → Call to action
{custom_section}
{salary_section}

**Guidelines:**
1. Start with an engaging opening that shows genuine interest
2. Connect specific resume achievements to job requirements
3. Demonstrate knowledge of the company
4. End with a confident call to action
5. Avoid generic phrases like "I am writing to apply..."
6. Use specific, quantified achievements where possible

**Output Format:**
Return only the cover letter text, ready to copy-paste. Do not include any headers or signatures (the candidate will add those)."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career coach and cover letter writer. Generate compelling, personalized cover letters that get interviews."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content or ""
            return {
                "cover_letter": content.strip(),
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            raise Exception(f"Error generating cover letter: {str(e)}")


class ResumeAnalyzerService:
    """Analyze resumes against job descriptions"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
    
    def analyze_resume(
        self,
        resume_content: str,
        job_description: str,
        job_title: str = "",
        company_name: str = ""
    ) -> Dict[str, Any]:
        """
        Comprehensive resume analysis including:
        - ATS compatibility score
        - Skills match percentage
        - Missing keywords
        - Improvement suggestions
        """
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        prompt = f"""Analyze this resume against the job description and provide a detailed assessment.

**Job Details:**
- Company: {company_name}
- Position: {job_title}
- Job Description: {job_description[:2000]}

**Resume Content:**
{resume_content[:3000]}

**Provide analysis in the following JSON format (return ONLY valid JSON):**
{{
    "ats_score": <number 0-100>,
    "match_score": <number 0-100>,
    "keyword_match": {{
        "matched_keywords": ["keyword1", "keyword2"],
        "missing_keywords": ["keyword1", "keyword2"],
        "match_percentage": <number>
    }},
    "skills_analysis": {{
        "matched_skills": ["skill1", "skill2"],
        "missing_skills": ["skill1", "skill2"],
        "transferable_skills": ["skill1", "skill2"]
    }},
    "experience_relevance": {{
        "score": <number 0-100>,
        "relevant_experiences": ["experience1", "experience2"],
        "gaps": ["gap1", "gap2"]
    }},
    "ats_issues": [
        {{"issue": "description", "severity": "high|medium|low", "fix": "suggestion"}}
    ],
    "improvement_suggestions": [
        {{"priority": "high|medium|low", "category": "category", "suggestion": "detailed suggestion"}}
    ],
    "summary": "2-3 sentence overall assessment",
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"]
}}"""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert ATS system and resume analyst. Provide detailed, actionable analysis in valid JSON format only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.3,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content or ""
            
            # Parse JSON response
            try:
                # Clean up markdown if present
                content = re.sub(r'^```(?:json)?\s*\n?', '', content)
                content = re.sub(r'\n?```\s*$', '', content)
                analysis = json.loads(content)
            except json.JSONDecodeError:
                # Return a basic structure if parsing fails
                analysis = {
                    "ats_score": 70,
                    "match_score": 65,
                    "summary": content[:500] if content else "Analysis unavailable",
                    "error": "Could not parse detailed analysis"
                }
            
            analysis["tokens_used"] = response.usage.total_tokens if response.usage else 0
            return analysis
            
        except Exception as e:
            raise Exception(f"Error analyzing resume: {str(e)}")


class InterviewPrepService:
    """Generate interview preparation materials"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
    
    def generate_interview_questions(
        self,
        resume_content: str,
        job_description: str,
        job_title: str,
        company_name: str,
        question_types: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate likely interview questions with suggested answers"""
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        if not question_types:
            question_types = ["behavioral", "technical", "situational", "company-specific"]
        
        prompt = f"""Generate interview preparation materials for this job application.

**Job Details:**
- Company: {company_name}
- Position: {job_title}
- Job Description: {job_description[:2000]}

**Candidate Resume:**
{resume_content[:2000]}

**Generate questions for these categories:** {', '.join(question_types)}

**Return as JSON with this structure:**
{{
    "questions": [
        {{
            "category": "category_name",
            "question": "interview question",
            "why_asked": "why interviewer might ask this",
            "suggested_answer": "framework or key points for answer",
            "resume_connection": "relevant resume experience to mention"
        }}
    ],
    "company_research_tips": ["tip1", "tip2"],
    "questions_to_ask_interviewer": ["question1", "question2"],
    "red_flags_to_avoid": ["flag1", "flag2"],
    "salary_negotiation_tips": ["tip1", "tip2"]
}}

Generate 3-4 questions per category."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert interview coach with experience at top companies. Generate realistic, helpful interview preparation materials."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.6,
                max_tokens=3000
            )
            
            content = response.choices[0].message.content or ""
            
            try:
                content = re.sub(r'^```(?:json)?\s*\n?', '', content)
                content = re.sub(r'\n?```\s*$', '', content)
                prep_materials = json.loads(content)
            except json.JSONDecodeError:
                prep_materials = {"raw_content": content}
            
            prep_materials["tokens_used"] = response.usage.total_tokens if response.usage else 0
            return prep_materials
            
        except Exception as e:
            raise Exception(f"Error generating interview prep: {str(e)}")


class QuickGeneratorService:
    """Quick generation service - no database storage required"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        self.email_service = None
        self.cover_letter_service = CoverLetterService()
        self.latex_service = LatexResumeService()
        self.analyzer_service = ResumeAnalyzerService()
        self.interview_service = InterviewPrepService()
    
    async def quick_generate_all(
        self,
        resume_content: str,
        job_description: str,
        company_name: str,
        job_title: str,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate all materials at once without saving to database.
        Returns email, cover letter, analysis, and interview prep.
        """
        if not options:
            options = {}
        
        results = {
            "job_info": {
                "company_name": company_name,
                "job_title": job_title
            }
        }
        
        # Generate based on requested options
        generate_email = options.get("generate_email", True)
        generate_cover_letter = options.get("generate_cover_letter", True)
        analyze_resume = options.get("analyze_resume", True)
        generate_interview_prep = options.get("generate_interview_prep", False)
        generate_latex = options.get("generate_latex", False)
        
        try:
            if generate_email:
                email_result = self._generate_quick_email(
                    resume_content, job_description, company_name, job_title,
                    options.get("email_tone", "professional"),
                    options.get("email_length", "medium")
                )
                results["email"] = email_result
            
            if generate_cover_letter:
                cl_result = self.cover_letter_service.generate_cover_letter(
                    resume_content, job_description, company_name, job_title,
                    options.get("cover_letter_tone", "professional")
                )
                results["cover_letter"] = cl_result
            
            if analyze_resume:
                analysis_result = self.analyzer_service.analyze_resume(
                    resume_content, job_description, job_title, company_name
                )
                results["analysis"] = analysis_result
            
            if generate_interview_prep:
                interview_result = self.interview_service.generate_interview_questions(
                    resume_content, job_description, job_title, company_name
                )
                results["interview_prep"] = interview_result
            
            if generate_latex:
                latex_result = self.latex_service.generate_latex_resume(
                    resume_content, job_description,
                    options.get("latex_template", "modern")
                )
                results["latex_resume"] = latex_result
            
            return results
            
        except Exception as e:
            raise Exception(f"Error in quick generation: {str(e)}")
    
    def _generate_quick_email(
        self,
        resume_content: str,
        job_description: str,
        company_name: str,
        job_title: str,
        tone: str,
        length: str
    ) -> Dict[str, Any]:
        """Generate email without database"""
        if not self.client:
            raise ValueError("GROQ_API_KEY not configured")
        
        length_instructions = {
            "short": "Keep it brief (150-200 words)",
            "medium": "Write a moderate length email (250-350 words)",
            "long": "Write a comprehensive email (400-500 words)"
        }
        
        tone_instructions = {
            "professional": "Use a formal, professional tone",
            "friendly": "Use a warm, friendly yet professional tone",
            "enthusiastic": "Use an enthusiastic and energetic tone",
            "confident": "Use a confident, accomplished tone"
        }
        
        prompt = f"""Generate a personalized cold email for a job application.

**Job Information:**
- Company: {company_name}
- Position: {job_title}
- Job Description: {job_description[:1500]}

**Candidate Resume:**
{resume_content[:2000]}

**Requirements:**
1. {tone_instructions.get(tone, tone_instructions['professional'])}
2. {length_instructions.get(length, length_instructions['medium'])}
3. Highlight 2-3 relevant skills/experiences
4. Show genuine interest in the company
5. Include a clear call-to-action
6. Avoid generic phrases

**Format:**
Subject: [Write engaging subject line]

Body:
[Write the email body]"""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert email writer specializing in cold emails for job applications."
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
            
            content = response.choices[0].message.content or ""
            
            # Parse subject and body
            lines = content.strip().split('\n')
            subject = ""
            body_lines = []
            found_subject = False
            
            for line in lines:
                if line.strip().startswith("Subject:"):
                    subject = line.replace("Subject:", "").strip()
                    found_subject = True
                elif found_subject and line.strip():
                    body_lines.append(line)
            
            if not subject:
                subject = f"Application for {job_title} at {company_name}"
            
            body = '\n'.join(body_lines).strip()
            if not body:
                body = content.strip()
            
            return {
                "subject": subject,
                "body": body,
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            raise Exception(f"Error generating email: {str(e)}")


# Service instances
job_scraper = JobScraperService()
latex_resume_service = LatexResumeService()
cover_letter_service = CoverLetterService()
resume_analyzer = ResumeAnalyzerService()
interview_prep_service = InterviewPrepService()
quick_generator = QuickGeneratorService()
