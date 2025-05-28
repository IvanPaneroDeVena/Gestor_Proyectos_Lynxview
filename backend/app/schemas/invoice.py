from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class InvoiceStatus(str, Enum):
    draft = "draft"
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"

class InvoiceBase(BaseModel):
    invoice_number: str = Field(..., min_length=1, max_length=50)
    status: InvoiceStatus = InvoiceStatus.draft
    project_id: int
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    subtotal: float = Field(..., ge=0)
    tax_rate: float = Field(21.0, ge=0, le=100)
    tax_amount: Optional[float] = Field(None, ge=0)
    total: float = Field(..., ge=0)
    notes: Optional[str] = None
    payment_terms: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = Field(None, min_length=1, max_length=50)
    status: Optional[InvoiceStatus] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    paid_date: Optional[datetime] = None
    subtotal: Optional[float] = Field(None, ge=0)
    tax_rate: Optional[float] = Field(None, ge=0, le=100)
    tax_amount: Optional[float] = Field(None, ge=0)
    total: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None
    payment_terms: Optional[str] = None

class InvoiceInDB(InvoiceBase):
    id: int
    paid_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class Invoice(InvoiceInDB):
    project: Optional[dict] = None

class InvoiceList(BaseModel):
    total: int
    invoices: List[Invoice]