from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

class InvoiceRepository(BaseRepository[Invoice, InvoiceCreate, InvoiceUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Invoice, db)

    async def get_by_invoice_number(self, invoice_number: str) -> Optional[Invoice]:
        """Obtener factura por número de factura"""
        result = await self.db.execute(
            select(Invoice).where(Invoice.invoice_number == invoice_number)
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_relations(self, id: int) -> Optional[Invoice]:
        """Obtener factura con sus relaciones cargadas"""
        result = await self.db.execute(
            select(Invoice)
            .options(selectinload(Invoice.project))
            .where(Invoice.id == id)
        )
        return result.scalar_one_or_none()

    async def search_invoices(
        self, 
        search: str, 
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[Invoice], int]:
        """Búsqueda avanzada de facturas"""
        query = select(Invoice).options(selectinload(Invoice.project))
        count_query = select(func.count(Invoice.id))
        
        # Filtro de búsqueda
        if search:
            search_filter = f"%{search}%"
            search_condition = (
                (Invoice.invoice_number.ilike(search_filter)) |
                (Invoice.notes.ilike(search_filter))
            )
            query = query.where(search_condition)
            count_query = count_query.where(search_condition)
        
        # Filtro de estado
        if status:
            query = query.where(Invoice.status == status)
            count_query = count_query.where(Invoice.status == status)
        
        # Filtro de proyecto
        if project_id:
            query = query.where(Invoice.project_id == project_id)
            count_query = count_query.where(Invoice.project_id == project_id)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación
        query = query.offset(skip).limit(limit).order_by(Invoice.created_at.desc())
        result = await self.db.execute(query)
        invoices = result.scalars().all()
        
        return list(invoices), total

    async def get_by_project_id(self, project_id: int) -> List[Invoice]:
        """Obtener facturas por proyecto"""
        result = await self.db.execute(
            select(Invoice)
            .where(Invoice.project_id == project_id)
            .order_by(Invoice.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_overdue_invoices(self) -> List[Invoice]:
        """Obtener facturas vencidas"""
        from datetime import datetime
        result = await self.db.execute(
            select(Invoice)
            .where(
                Invoice.due_date < datetime.now(),
                Invoice.status.in_(['sent', 'overdue'])
            )
            .options(selectinload(Invoice.project))
        )
        return list(result.scalars().all())