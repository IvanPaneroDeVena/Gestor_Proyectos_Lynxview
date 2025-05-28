# backend/app/schemas/task.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"
    cancelled = "cancelled"

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.pending
    priority: TaskPriority = TaskPriority.medium
    estimated_hours: Optional[float] = Field(None, ge=0)
    project_id: int = Field(..., gt=0)
    assignee_id: Optional[int] = Field(None, gt=0)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    estimated_hours: Optional[float] = Field(None, ge=0)
    actual_hours: Optional[float] = Field(None, ge=0)
    project_id: Optional[int] = Field(None, gt=0)
    assignee_id: Optional[int] = Field(None, gt=0)

class TaskInDB(TaskBase):
    id: int
    actual_hours: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime]
    created_by_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Información básica de entidades relacionadas
class ProjectInfo(BaseModel):
    id: int
    name: str
    client_name: Optional[str] = None

class UserInfo(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    role: Optional[str] = None

class Task(TaskInDB):
    project: Optional[ProjectInfo] = None
    assignee: Optional[UserInfo] = None
    created_by: Optional[UserInfo] = None
    
class TaskList(BaseModel):
    total: int
    tasks: List[Task]