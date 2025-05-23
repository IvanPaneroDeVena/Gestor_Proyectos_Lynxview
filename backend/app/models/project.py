from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

# Tabla de asociación para proyectos y miembros del equipo
project_members = Table(
    'project_members',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE')),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE')),
    Column('role', String(50)),  # "developer", "leader", "designer", etc.
    Column('assigned_at', DateTime(timezone=True), server_default=func.now())
)

# Tabla de asociación para proyectos y tecnologías
project_technologies = Table(
    'project_technologies',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE')),
    Column('technology_id', Integer, ForeignKey('technologies.id', ondelete='CASCADE'))
)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    client_name = Column(String(200))
    status = Column(String(50), default="planning")  # planning, active, on_hold, completed
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    budget = Column(Float)
    hourly_rate = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones (usando strings para evitar importaciones circulares)
    members = relationship("User", secondary=project_members, back_populates="projects")
    technologies = relationship("Technology", secondary=project_technologies, back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")
    time_entries = relationship("TimeEntry", back_populates="project", cascade="all, delete-orphan")