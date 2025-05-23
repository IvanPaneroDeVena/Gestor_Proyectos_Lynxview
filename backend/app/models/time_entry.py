from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class TimeEntry(Base):
    __tablename__ = "time_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    hours = Column(Float, nullable=False)
    description = Column(Text)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    
    # Facturación
    billable = Column(String(10), default="true")  # true/false
    billed = Column(String(10), default="false")   # true/false
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="time_entries")
    project = relationship("Project", back_populates="time_entries")