"""
Enhanced API Router for LanditAI
Provides endpoints for:
- Job URL scraping
- Quick generation (no save)
- Cover letter generation
- Resume analysis & ATS scoring
- LaTeX resume generation
- Interview preparation
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field
from database import get_db
from models import User
from auth import get_current_active_user
from services_enhanced import (
    job_scraper,
    latex_resume_service,
    cover_letter_service,
    resume_analyzer,
    interview_prep_service,
    quick_generator
)
import PyPDF2
import io

router = APIRouter(prefix="/api/enhanced", tags=["Enhanced Features"])


# ============== Schemas ==============

class JobUrlRequest(BaseModel):
    url: str = Field(..., description="URL of the job posting to scrape")


class JobUrlResponse(BaseModel):
    source: str
    url: str
    company_name: str
    job_title: str
    location: Optional[str] = ""
    job_description: str
    job_type: Optional[str] = ""
    salary: Optional[str] = ""
    experience_level: Optional[str] = ""


class QuickGenerateRequest(BaseModel):
    resume_content: str = Field(..., description="Resume text content")
    job_description: str = Field(..., description="Job description text")
    company_name: str
    job_title: str
    options: Optional[dict] = Field(default_factory=dict, description="Generation options")


class CoverLetterRequest(BaseModel):
    resume_content: str
    job_description: str
    company_name: str
    job_title: str
    tone: Optional[str] = "professional"
    include_salary_expectation: Optional[bool] = False
    custom_points: Optional[List[str]] = None


class CoverLetterResponse(BaseModel):
    cover_letter: str
    tokens_used: int


class ResumeAnalysisRequest(BaseModel):
    resume_content: str
    job_description: str
    job_title: Optional[str] = ""
    company_name: Optional[str] = ""


class LatexResumeRequest(BaseModel):
    resume_content: str
    job_description: Optional[str] = None
    template_style: Optional[str] = "modern"
    emphasis_skills: Optional[List[str]] = None


class LatexResumeResponse(BaseModel):
    latex_code: str
    template_style: str
    tokens_used: int


class InterviewPrepRequest(BaseModel):
    resume_content: str
    job_description: str
    job_title: str
    company_name: str
    question_types: Optional[List[str]] = None


# ============== Job Scraping Endpoints ==============

@router.post("/scrape-job", response_model=JobUrlResponse)
async def scrape_job_url(
    request: JobUrlRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Scrape job details from a URL.
    Supports: LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, and generic job pages.
    """
    try:
        result = await job_scraper.scrape_job_url(request.url)
        return JobUrlResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to scrape job URL: {str(e)}"
        )


# ============== Quick Generation Endpoints ==============

@router.post("/quick-generate")
async def quick_generate_all(
    request: QuickGenerateRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate all materials at once without saving to database.
    Options:
    - generate_email (default: true)
    - generate_cover_letter (default: true)
    - analyze_resume (default: true)
    - generate_interview_prep (default: false)
    - generate_latex (default: false)
    - email_tone: professional|friendly|enthusiastic|confident
    - email_length: short|medium|long
    - cover_letter_tone: professional|enthusiastic|confident|storytelling
    - latex_template: modern|classic|minimal|creative|academic
    """
    try:
        result = await quick_generator.quick_generate_all(
            resume_content=request.resume_content,
            job_description=request.job_description,
            company_name=request.company_name,
            job_title=request.job_title,
            options=request.options or {}
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation failed: {str(e)}"
        )


@router.post("/quick-email")
async def quick_generate_email(
    request: QuickGenerateRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Generate a cold email without saving to database"""
    try:
        result = quick_generator._generate_quick_email(
            resume_content=request.resume_content,
            job_description=request.job_description,
            company_name=request.company_name,
            job_title=request.job_title,
            tone=request.options.get("tone", "professional") if request.options else "professional",
            length=request.options.get("length", "medium") if request.options else "medium"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email generation failed: {str(e)}"
        )


# ============== Cover Letter Endpoints ==============

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(
    request: CoverLetterRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Generate a tailored cover letter"""
    try:
        result = cover_letter_service.generate_cover_letter(
            resume_content=request.resume_content,
            job_description=request.job_description,
            company_name=request.company_name,
            job_title=request.job_title,
            tone=request.tone or "professional",
            include_salary_expectation=request.include_salary_expectation or False,
            custom_points=request.custom_points
        )
        return CoverLetterResponse(
            cover_letter=result.get("cover_letter", ""),
            tokens_used=int(result.get("tokens_used", 0))
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cover letter generation failed: {str(e)}"
        )


# ============== Resume Analysis Endpoints ==============

@router.post("/analyze-resume")
async def analyze_resume(
    request: ResumeAnalysisRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Comprehensive resume analysis including:
    - ATS compatibility score
    - Skills match percentage
    - Missing keywords
    - Improvement suggestions
    """
    try:
        result = resume_analyzer.analyze_resume(
            resume_content=request.resume_content,
            job_description=request.job_description,
            job_title=request.job_title or "",
            company_name=request.company_name or ""
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume analysis failed: {str(e)}"
        )


@router.post("/ats-score")
async def get_ats_score(
    request: ResumeAnalysisRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Get ATS compatibility score for a resume against a job description"""
    try:
        result = resume_analyzer.analyze_resume(
            resume_content=request.resume_content,
            job_description=request.job_description,
            job_title=request.job_title or "",
            company_name=request.company_name or ""
        )
        # Return simplified ATS-focused response
        return {
            "ats_score": result.get("ats_score", 0),
            "match_score": result.get("match_score", 0),
            "keyword_match": result.get("keyword_match", {}),
            "ats_issues": result.get("ats_issues", []),
            "summary": result.get("summary", "")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ATS scoring failed: {str(e)}"
        )


# ============== LaTeX Resume Endpoints ==============

@router.post("/latex-resume", response_model=LatexResumeResponse)
async def generate_latex_resume(
    request: LatexResumeRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a LaTeX resume tuned for the job description.
    Template styles: modern, classic, minimal, creative, academic
    """
    try:
        result = latex_resume_service.generate_latex_resume(
            resume_content=request.resume_content,
            job_description=request.job_description,
            template_style=request.template_style or "modern",
            emphasis_skills=request.emphasis_skills
        )
        return LatexResumeResponse(
            latex_code=result.get("latex_code", ""),
            template_style=result.get("template_style", "modern"),
            tokens_used=int(result.get("tokens_used", 0))
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LaTeX generation failed: {str(e)}"
        )


# ============== Interview Prep Endpoints ==============

@router.post("/interview-prep")
async def generate_interview_prep(
    request: InterviewPrepRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate interview preparation materials including:
    - Likely interview questions with suggested answers
    - Company research tips
    - Questions to ask the interviewer
    - Salary negotiation tips
    
    Question types: behavioral, technical, situational, company-specific
    """
    try:
        result = interview_prep_service.generate_interview_questions(
            resume_content=request.resume_content,
            job_description=request.job_description,
            job_title=request.job_title,
            company_name=request.company_name,
            question_types=request.question_types or ["behavioral", "technical", "situational"]
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Interview prep generation failed: {str(e)}"
        )


# ============== File Upload with Quick Analysis ==============

def extract_text_from_pdf(content_bytes: bytes) -> str:
    """Extract text from PDF bytes"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract PDF text: {str(e)}")


@router.post("/upload-and-analyze")
async def upload_and_analyze(
    file: UploadFile = File(...),
    job_description: str = "",
    job_title: str = "",
    company_name: str = "",
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a resume file and get instant analysis without saving.
    Returns extracted text and optional analysis if job description provided.
    """
    # Validate file type
    allowed_extensions = ["pdf", "txt", "doc", "docx"]
    file_extension = file.filename.lower().split(".")[-1]
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        content_bytes = await file.read()
        
        # Extract text
        if file_extension == "pdf":
            resume_content = extract_text_from_pdf(content_bytes)
        else:
            resume_content = content_bytes.decode('utf-8', errors='ignore')
        
        if not resume_content or len(resume_content.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume content is too short or empty"
            )
        
        result = {
            "filename": file.filename,
            "content": resume_content,
            "word_count": len(resume_content.split()),
            "character_count": len(resume_content)
        }
        
        # If job description provided, include analysis
        if job_description:
            analysis = resume_analyzer.analyze_resume(
                resume_content=resume_content,
                job_description=job_description,
                job_title=job_title,
                company_name=company_name
            )
            result["analysis"] = analysis
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )


# ============== Batch Generation ==============

class BatchGenerateRequest(BaseModel):
    resume_content: str
    jobs: List[dict] = Field(..., description="List of {company_name, job_title, job_description}")
    generate_type: str = Field(default="email", description="email|cover_letter|both")


@router.post("/batch-generate")
async def batch_generate(
    request: BatchGenerateRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate emails or cover letters for multiple jobs at once.
    Useful for mass applications.
    """
    results = []
    
    for job in request.jobs[:10]:  # Limit to 10 jobs per batch
        try:
            job_result = {
                "company_name": job.get("company_name", ""),
                "job_title": job.get("job_title", ""),
                "success": True
            }
            
            if request.generate_type in ["email", "both"]:
                email = quick_generator._generate_quick_email(
                    resume_content=request.resume_content,
                    job_description=job.get("job_description", ""),
                    company_name=job.get("company_name", ""),
                    job_title=job.get("job_title", ""),
                    tone="professional",
                    length="medium"
                )
                job_result["email"] = email
            
            if request.generate_type in ["cover_letter", "both"]:
                cover_letter = cover_letter_service.generate_cover_letter(
                    resume_content=request.resume_content,
                    job_description=job.get("job_description", ""),
                    company_name=job.get("company_name", ""),
                    job_title=job.get("job_title", "")
                )
                job_result["cover_letter"] = cover_letter
            
            results.append(job_result)
            
        except Exception as e:
            results.append({
                "company_name": job.get("company_name", ""),
                "job_title": job.get("job_title", ""),
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_jobs": len(request.jobs),
        "processed": len(results),
        "results": results
    }
