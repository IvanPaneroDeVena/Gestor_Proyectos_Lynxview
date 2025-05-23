from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    status = Column(String(50), default="draft")  # draft, sent, paid, overdue, cancelled
    
    # Fechas
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    paid_date = Column(DateTime(timezone=True))
    
    # Montos
    subtotal = Column(Float, nullable=False)
    tax_rate = Column(Float, default=21.0)  # IVA en España
    tax_amount = Column(Float)
    total = Column(Float, nullable=False)
    
    # Información adicional
    notes = Column(Text)
    payment_terms = Column(Text)
    
    # Relaciones
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    project = relationship("Project", back_populates="invoices")