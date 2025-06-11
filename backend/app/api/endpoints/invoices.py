from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.services.invoice_service import InvoiceService
from app.dependencies import get_invoice_service
from app.schemas.invoice import (
    Invoice as InvoiceSchema,
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceList
)
from app.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=InvoiceList)
async def get_invoices(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    project_id: Optional[int] = None,
    search: Optional[str] = None,
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    """Obtener lista de facturas con paginación y filtros"""
    try:
        return await invoice_service.search_invoices(
            search=search,
            status=status,
            project_id=project_id,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=InvoiceSchema)
async def create_invoice(
    invoice_in: InvoiceCreate,
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    """Crear una nueva factura"""
    try:
        return await invoice_service.create_invoice(invoice_in)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{invoice_id}", response_model=InvoiceSchema)
async def get_invoice(
    invoice_id: int,
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    """Obtener una factura por ID"""
    try:
        invoice = await invoice_service.get_invoice_by_id(invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Factura no encontrada")
        return invoice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{invoice_id}", response_model=InvoiceSchema)
async def update_invoice(
    invoice_id: int,
    invoice_update: InvoiceUpdate,
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    """Actualizar una factura"""
    try:
        updated_invoice = await invoice_service.update_invoice(invoice_id, invoice_update)
        return updated_invoice
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: int,
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    """Eliminar una factura"""
    try:
        success = await invoice_service.delete_invoice(invoice_id)
        return {"message": "Factura eliminada exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))