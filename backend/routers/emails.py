from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from database import get_db
from models import User, GeneratedEmail, Resume, Job, UsageTracking
from schemas import (
    EmailGenerateRequest,
    GeneratedEmailResponse,
    UsageTrackingResponse,
    UsageStatsResponse
)
from auth import get_current_active_user
from services import email_generator
from cache import cache

router = APIRouter(prefix="/api/emails", tags=["Emails"])


@router.post("/generate", response_model=GeneratedEmailResponse)
def generate_email(
    request: EmailGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generate a personalized cold email"""
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get job
    job = db.query(Job).filter(
        Job.id == request.job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check cache
    cache_key = f"email:{resume.id}:{job.id}:{request.tone}:{request.length}"
    cached_email = cache.get(cache_key)
    
    if cached_email:
        # Return cached email
        return GeneratedEmailResponse(**cached_email)
    
    try:
        # Generate email using AI
        result = email_generator.generate_cold_email(
            resume_content=resume.content,
            job_description=job.job_description,
            company_name=job.company_name,
            job_title=job.job_title,
            tone=request.tone,
            length=request.length
        )
        
        # Save to database
        metadata = {
            "tone": request.tone,
            "length": request.length,
            "tokens_used": result.get("tokens_used", 0)
        }
        
        db_email = GeneratedEmail(
            user_id=current_user.id,
            resume_id=request.resume_id,
            job_id=request.job_id,
            subject=result["subject"],
            body=result["body"],
            metadata=json.dumps(metadata)
        )
        
        db.add(db_email)
        
        # Track usage
        usage = UsageTracking(
            user_id=current_user.id,
            endpoint="/api/emails/generate",
            action="email_generation",
            tokens_used=result.get("tokens_used", 0),
            cost=result.get("tokens_used", 0) * 0.0001  # Example cost calculation
        )
        
        db.add(usage)
        db.commit()
        db.refresh(db_email)
        
        # Cache the result
        email_data = GeneratedEmailResponse.from_orm(db_email).dict()
        cache.set(cache_key, email_data, expire=3600)
        
        return db_email
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating email: {str(e)}"
        )


@router.get("/", response_model=List[GeneratedEmailResponse])
def get_emails(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all generated emails for current user"""
    emails = db.query(GeneratedEmail).filter(
        GeneratedEmail.user_id == current_user.id
    ).order_by(GeneratedEmail.created_at.desc()).offset(skip).limit(limit).all()
    
    return emails


@router.get("/{email_id}", response_model=GeneratedEmailResponse)
def get_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific generated email"""
    email = db.query(GeneratedEmail).filter(
        GeneratedEmail.id == email_id,
        GeneratedEmail.user_id == current_user.id
    ).first()
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found"
        )
    
    return email


@router.delete("/{email_id}")
def delete_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a generated email"""
    email = db.query(GeneratedEmail).filter(
        GeneratedEmail.id == email_id,
        GeneratedEmail.user_id == current_user.id
    ).first()
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found"
        )
    
    db.delete(email)
    db.commit()
    
    return {"message": "Email deleted successfully"}


@router.get("/usage/stats", response_model=UsageStatsResponse)
def get_usage_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get usage statistics for current user"""
    # Count emails
    total_emails = db.query(GeneratedEmail).filter(
        GeneratedEmail.user_id == current_user.id
    ).count()
    
    # Count resumes
    total_resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).count()
    
    # Count jobs
    total_jobs = db.query(Job).filter(
        Job.user_id == current_user.id
    ).count()
    
    # Sum usage
    usage_records = db.query(UsageTracking).filter(
        UsageTracking.user_id == current_user.id
    ).all()
    
    total_tokens = sum(u.tokens_used for u in usage_records)
    total_cost = sum(u.cost for u in usage_records)
    
    return UsageStatsResponse(
        total_emails_generated=total_emails,
        total_resumes_uploaded=total_resumes,
        total_jobs_added=total_jobs,
        total_tokens_used=total_tokens,
        total_cost=round(total_cost, 4)
    )
