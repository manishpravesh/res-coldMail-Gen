from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from database import get_db
from models import User, Job
from schemas import Job as JobSchema, JobCreate
from auth import get_current_active_user
from services import job_parser
from cache import cache

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("/", response_model=JobSchema)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new job entry"""
    try:
        # Parse job description
        parsed_data = job_parser.parse_job_description(
            job.job_description,
            job.company_name,
            job.job_title
        )
        
        # Create job record
        db_job = Job(
            user_id=current_user.id,
            company_name=job.company_name,
            job_title=job.job_title,
            job_description=job.job_description,
            job_url=job.job_url,
            parsed_data=json.dumps(parsed_data)
        )
        
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        
        # Clear user cache
        cache.clear_user_cache(current_user.id)
        
        return db_job
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating job: {str(e)}"
        )


@router.get("/", response_model=List[JobSchema])
def get_jobs(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all jobs for current user"""
    # Try cache first
    cache_key = f"user:{current_user.id}:jobs:{skip}:{limit}"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return cached_data
    
    # Query database
    jobs = db.query(Job).filter(
        Job.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Cache results
    cache.set(cache_key, [JobSchema.from_orm(j).dict() for j in jobs], expire=1800)
    
    return jobs


@router.get("/{job_id}", response_model=JobSchema)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific job"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


@router.put("/{job_id}", response_model=JobSchema)
def update_job(
    job_id: int,
    job_update: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a job"""
    db_job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Update fields
    db_job.company_name = job_update.company_name
    db_job.job_title = job_update.job_title
    db_job.job_description = job_update.job_description
    db_job.job_url = job_update.job_url
    
    # Re-parse
    parsed_data = job_parser.parse_job_description(
        job_update.job_description,
        job_update.company_name,
        job_update.job_title
    )
    db_job.parsed_data = json.dumps(parsed_data)
    
    db.commit()
    db.refresh(db_job)
    
    # Clear cache
    cache.clear_user_cache(current_user.id)
    
    return db_job


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a job"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    db.delete(job)
    db.commit()
    
    # Clear cache
    cache.clear_user_cache(current_user.id)
    
    return {"message": "Job deleted successfully"}
