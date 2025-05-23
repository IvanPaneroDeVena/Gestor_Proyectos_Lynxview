from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.project import project_technologies

class Technology(Base):
    __tablename__ = "technologies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50))  # "frontend", "backend", "database", "devops", etc.
    description = Column(Text)
    
    # Relaciones
    projects = relationship("Project", secondary=project_technologies, back_populates="technologies")