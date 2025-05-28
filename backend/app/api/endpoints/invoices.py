from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.db.base import get_db
from app.models import Invoice, Project
from app.schemas.invoice import (
    Invoice as InvoiceSchema,
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceList
)

router = APIRouter()

@router.get("/", response_model=InvoiceList)
async def get_invoices(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    project_id: Optional[int] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de facturas con paginación y filtros
    """
    # Query base
    query = select(Invoice)
    count_query = select(func.count(Invoice.id))
    
    # Aplicar filtros
    if status:
        query = query.where(Invoice.status == status)
        count_query = count_query.where(Invoice.status == status)
    
    if project_id:
        query = query.where(Invoice.project_id == project_id)
        count_query = count_query.where(Invoice.project_id == project_id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (Invoice.invoice_number.ilike(search_filter)) |
            (Invoice.notes.ilike(search_filter))
        )
        count_query = count_query.where(
            (Invoice.invoice_number.ilike(search_filter)) |
            (Invoice.notes.ilike(search_filter))
        )
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación
    query = query.offset(skip).limit(limit).order_by(Invoice.created_at.desc())
    
    # Ejecutar query
    result = await db.execute(query)
    invoices = result.scalars().all()
    
    return InvoiceList(
        total=total,
        invoices=[
            InvoiceSchema(
                **invoice.__dict__,
                project=None
            ) for invoice in invoices
        ]
    )

@router.post("/", response_model=InvoiceSchema)
async def create_invoice(
    invoice_in: InvoiceCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear una nueva factura
    """
    # Verificar que el proyecto existe
    project_result = await db.execute(
        select(Project).where(Project.id == invoice_in.project_id)
    )
    if not project_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar que el número de factura no existe
    existing_result = await db.execute(
        select(Invoice).where(Invoice.invoice_number == invoice_in.invoice_number)
    )
    if existing_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Ya existe una factura con ese número")
    
    # Calcular tax_amount si no se proporciona
    invoice_data = invoice_in.model_dump()
    if not invoice_data.get('tax_amount'):
        invoice_data['tax_amount'] = (invoice_data['subtotal'] * invoice_data['tax_rate']) / 100
    
    # Crear instancia de la factura
    invoice = Invoice(**invoice_data)
    
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    
    return InvoiceSchema(
        **invoice.__dict__,
        project=None
    )

@router.get("/{invoice_id}", response_model=InvoiceSchema)
async def get_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener una factura por ID
    """
    result = await db.execute(
        select(Invoice).where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    
    return InvoiceSchema(
        **invoice.__dict__,
        project=None
    )

@router.put("/{invoice_id}", response_model=InvoiceSchema)
async def update_invoice(
    invoice_id: int,
    invoice_update: InvoiceUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una factura
    """
    result = await db.execute(
        select(Invoice).where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    
    # Verificar que el nuevo número de factura no existe (si se está cambiando)
    if invoice_update.invoice_number and invoice_update.invoice_number != invoice.invoice_number:
        existing = await db.execute(
            select(Invoice).where(Invoice.invoice_number == invoice_update.invoice_number)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Ya existe una factura con ese número")
    
    # Actualizar campos
    update_data = invoice_update.model_dump(exclude_unset=True)
    
    # Recalcular tax_amount si se actualizan subtotal o tax_rate
    if 'subtotal' in update_data or 'tax_rate' in update_data:
        subtotal = update_data.get('subtotal', invoice.subtotal)
        tax_rate = update_data.get('tax_rate', invoice.tax_rate)
        update_data['tax_amount'] = (subtotal * tax_rate) / 100
    
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    await db.commit()
    await db.refresh(invoice)
    
    return InvoiceSchema(
        **invoice.__dict__,
        project=None
    )

@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar una factura
    """
    result = await db.execute(
        select(Invoice).where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    
    await db.delete(invoice)
    await db.commit()
    
    return {"message": "Factura eliminada exitosamente"}