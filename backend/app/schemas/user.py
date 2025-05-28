# backend/app/schemas/user.py
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=200)
    role: Optional[str] = Field(None, max_length=100)  # Developer, Designer, etc.
    seniority: Optional[str] = Field(None, max_length=50)  # Junior, Mid, Senior
    department: Optional[str] = Field(None, max_length=100)
    hourly_rate: Optional[float] = Field(None, ge=0)
    skills: Optional[str] = None  # JSON string con habilidades
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=200)
    role: Optional[str] = Field(None, max_length=100)
    seniority: Optional[str] = Field(None, max_length=50)
    department: Optional[str] = Field(None, max_length=100)
    hourly_rate: Optional[float] = Field(None, ge=0)
    skills: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=6)

class UserInDB(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True

class User(UserInDB):
    current_projects: List[dict] = []  # Simplificado
    
class UserList(BaseModel):
    total: int
    users: List[User]