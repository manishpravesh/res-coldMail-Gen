from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import json
from database import get_db
from models import User, Resume
from schemas import Resume as ResumeSchema, ResumeCreate
from auth import get_current_active_user
from services import resume_parser
from cache import cache
import PyPDF2
import io

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeSchema)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload and parse a resume file"""
    # Validate file type
    allowed_extensions = [".pdf", ".txt", ".doc", ".docx"]
    file_extension = file.filename.lower().split(".")[-1]
    
    if f".{file_extension}" not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Read file content
        content_bytes = await file.read()
        
        # Extract text based on file type
        if file_extension == "pdf":
            content = extract_text_from_pdf(content_bytes)
        else:
            # For txt and other text files
            content = content_bytes.decode('utf-8', errors='ignore')
        
        if not content or len(content.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume content is too short or empty"
            )
        
        # Parse resume
        parsed_data = resume_parser.parse_resume_text(content)
        
        # Create resume record
        db_resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            content=content,
            parsed_data=json.dumps(parsed_data)
        )
        
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        # Clear user cache
        cache.clear_user_cache(current_user.id)
        
        return db_resume
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing resume: {str(e)}"
        )


@router.get("/", response_model=List[ResumeSchema])
def get_resumes(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all resumes for current user"""
    # Try cache first
    cache_key = f"user:{current_user.id}:resumes:{skip}:{limit}"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return cached_data
    
    # Query database
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Cache results
    cache.set(cache_key, [ResumeSchema.from_orm(r).dict() for r in resumes], expire=1800)
    
    return resumes


@router.get("/{resume_id}", response_model=ResumeSchema)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    db.delete(resume)
    db.commit()
    
    # Clear cache
    cache.clear_user_cache(current_user.id)
    
    return {"message": "Resume deleted successfully"}


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        return text
    except Exception as e:
        raise Exception(f"Error extracting PDF text: {str(e)}")
