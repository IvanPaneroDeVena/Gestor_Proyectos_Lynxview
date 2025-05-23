from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class ProjectStatus(str, Enum):
    planning = "planning"
    active = "active"
    on_hold = "on_hold"
    completed = "completed"

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    client_name: Optional[str] = Field(None, max_length=200)
    status: ProjectStatus = ProjectStatus.planning
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = Field(None, ge=0)
    hourly_rate: Optional[float] = Field(None, ge=0)

class ProjectCreate(ProjectBase):
    member_ids: Optional[List[int]] = []
    technology_ids: Optional[List[int]] = []

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    client_name: Optional[str] = Field(None, max_length=200)
    status: Optional[ProjectStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = Field(None, ge=0)
    hourly_rate: Optional[float] = Field(None, ge=0)
    member_ids: Optional[List[int]] = None
    technology_ids: Optional[List[int]] = None

class ProjectInDB(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class Project(ProjectInDB):
    members: List[dict] = []  # Simplificado, podrías usar UserInDB
    technologies: List[dict] = []
    total_hours: Optional[float] = 0
    total_invoiced: Optional[float] = 0
    
class ProjectList(BaseModel):
    total: int
    projects: List[Project]