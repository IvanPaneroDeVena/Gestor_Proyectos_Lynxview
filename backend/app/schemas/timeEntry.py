from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class TimeEntryBase(BaseModel):
    hours: float = Field(..., gt=0)
    description: Optional[str] = None
    date: datetime
    user_id: int
    project_id: int
    task_id: Optional[int] = None
    billable: str = Field("true", pattern="^(true|false)$")
    billed: str = Field("false", pattern="^(true|false)$")
    invoice_id: Optional[int] = None

class TimeEntryCreate(TimeEntryBase):
    pass

class TimeEntryUpdate(BaseModel):
    hours: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    date: Optional[datetime] = None
    task_id: Optional[int] = None
    billable: str = Field("true", pattern="^(true|false)$")
    billed: str = Field("false", pattern="^(true|false)$")
    invoice_id: Optional[int] = None

class TimeEntryInDB(TimeEntryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class TimeEntry(TimeEntryInDB):
    user: Optional[dict] = None
    project: Optional[dict] = None
    task: Optional[dict] = None

class TimeEntryList(BaseModel):
    total: int
    time_entries: List[TimeEntry]