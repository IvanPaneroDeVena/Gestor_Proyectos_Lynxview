from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from app.models.project import project_members

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200))
    
    # Información profesional
    role = Column(String(100))  # Developer, Designer, Project Manager, etc.
    seniority = Column(String(50))  # Junior, Mid, Senior, Lead
    department = Column(String(100))
    hourly_rate = Column(Float)
    skills = Column(Text)  # JSON string con habilidades
    
    # Estado
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relaciones
    projects = relationship("Project", secondary=project_members, back_populates="members")
    tasks_assigned = relationship("Task", foreign_keys="Task.assignee_id", back_populates="assignee")
    tasks_created = relationship("Task", foreign_keys="Task.created_by_id", back_populates="created_by")
    time_entries = relationship("TimeEntry", back_populates="user", cascade="all, delete-orphan")