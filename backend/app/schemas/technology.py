# backend/app/schemas/technology.py
from pydantic import BaseModel, Field
from typing import Optional, List

class TechnologyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: Optional[str] = Field(None, max_length=50)  # frontend, backend, database, etc.
    description: Optional[str] = None

class TechnologyCreate(TechnologyBase):
    pass

class TechnologyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None

class TechnologyInDB(TechnologyBase):
    id: int
    
    class Config:
        from_attributes = True

class Technology(TechnologyInDB):
    pass
    
class TechnologyList(BaseModel):
    total: int
    technologies: List[Technology]