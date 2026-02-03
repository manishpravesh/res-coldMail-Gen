from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Resume Schemas
class ResumeBase(BaseModel):
    filename: str
    content: str
    parsed_data: Optional[str] = None


class ResumeCreate(ResumeBase):
    pass


class Resume(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Job Schemas
class JobBase(BaseModel):
    company_name: str
    job_title: str
    job_description: str
    job_url: Optional[str] = None
    parsed_data: Optional[str] = None


class JobCreate(JobBase):
    pass


class Job(JobBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Email Schemas
class EmailGenerateRequest(BaseModel):
    resume_id: int
    job_id: int
    tone: Optional[str] = "professional"
    length: Optional[str] = "medium"


class GeneratedEmailResponse(BaseModel):
    id: int
    subject: str
    body: str
    metadata: Optional[str] = Field(None, alias="email_metadata")
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True


# Usage Tracking Schemas
class UsageTrackingResponse(BaseModel):
    id: int
    endpoint: str
    action: str
    tokens_used: int
    cost: float
    timestamp: datetime
    
    class Config:
        from_attributes = True


class UsageStatsResponse(BaseModel):
    total_emails_generated: int
    total_resumes_uploaded: int
    total_jobs_added: int
    total_tokens_used: int
    total_cost: float
