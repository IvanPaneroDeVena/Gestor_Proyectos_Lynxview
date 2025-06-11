from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.invoice_repository import InvoiceRepository
from app.models.invoice import Invoice
from app.models.project import Project
from app.schemas.invoice import (
    InvoiceCreate, 
    InvoiceUpdate, 
    InvoiceList,
    Invoice as InvoiceSchema
)
from app.exceptions import NotFoundException, ValidationException

class InvoiceService:
    def __init__(self, db: AsyncSession):
        self.repository = InvoiceRepository(db)
        self.db = db

    async def search_invoices(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> InvoiceList:
        """Buscar facturas con filtros"""
        invoices, total = await self.repository.search_invoices(
            search=search or "",
            status=status,
            project_id=project_id,
            skip=skip,
            limit=limit
        )
        
        # Transformar a esquemas de respuesta
        invoice_schemas = [
            InvoiceSchema(
                **invoice.__dict__,
                project=None  # Simplificado por ahora
            ) for invoice in invoices
        ]
        
        return InvoiceList(total=total, invoices=invoice_schemas)

    async def create_invoice(self, invoice_data: InvoiceCreate) -> InvoiceSchema:
        """Crear nueva factura con validaciones"""
        print(f"🔍 Creando factura: {invoice_data}")
        
        try:
            # Validaciones de negocio
            await self._validate_invoice_creation(invoice_data)
            
            # Preparar datos para BD
            invoice_dict = invoice_data.model_dump()
            
            # Calcular tax_amount si no se proporciona
            if not invoice_dict.get('tax_amount'):
                invoice_dict['tax_amount'] = (invoice_dict['subtotal'] * invoice_dict['tax_rate']) / 100
            
            print(f"🔍 Datos para BD: {invoice_dict}")
            
            # Crear factura
            invoice = await self.repository.create(invoice_dict)
            print(f"✅ Factura creada: {invoice}")
            
            return InvoiceSchema(
                **invoice.__dict__,
                project=None
            )
            
        except Exception as e:
            print(f"❌ Error en create_invoice: {e}")
            raise

    async def get_invoice_by_id(self, invoice_id: int) -> Optional[InvoiceSchema]:
        """Obtener factura por ID"""
        invoice = await self.repository.get_by_id_with_relations(invoice_id)
        if not invoice:
            return None
        
        return InvoiceSchema(
            **invoice.__dict__,
            project=None
        )

    async def update_invoice(self, invoice_id: int, invoice_data: InvoiceUpdate) -> Optional[InvoiceSchema]:
        """Actualizar factura con validaciones"""
        # Verificar que la factura existe
        existing_invoice = await self.repository.get_by_id(invoice_id)
        if not existing_invoice:
            raise NotFoundException("Factura no encontrada")
        
        # Validaciones de negocio
        await self._validate_invoice_update(invoice_id, invoice_data)
        
        # Preparar datos de actualización
        update_dict = invoice_data.model_dump(exclude_unset=True)
        
        # Recalcular tax_amount si se actualizan subtotal o tax_rate
        if 'subtotal' in update_dict or 'tax_rate' in update_dict:
            subtotal = update_dict.get('subtotal', existing_invoice.subtotal)
            tax_rate = update_dict.get('tax_rate', existing_invoice.tax_rate)
            update_dict['tax_amount'] = (subtotal * tax_rate) / 100
        
        # Actualizar
        updated_invoice = await self.repository.update(invoice_id, update_dict)
        
        return InvoiceSchema(
            **updated_invoice.__dict__,
            project=None
        )

    async def delete_invoice(self, invoice_id: int) -> bool:
        """Eliminar factura"""
        invoice = await self.repository.get_by_id(invoice_id)
        if not invoice:
            raise NotFoundException("Factura no encontrada")
        
        return await self.repository.delete(invoice_id)

    async def get_project_invoices(self, project_id: int) -> List[InvoiceSchema]:
        """Obtener facturas de un proyecto"""
        invoices = await self.repository.get_by_project_id(project_id)
        return [
            InvoiceSchema(
                **invoice.__dict__,
                project=None
            ) for invoice in invoices
        ]

    async def get_overdue_invoices(self) -> List[InvoiceSchema]:
        """Obtener facturas vencidas"""
        invoices = await self.repository.get_overdue_invoices()
        return [
            InvoiceSchema(
                **invoice.__dict__,
                project=None
            ) for invoice in invoices
        ]

    # Métodos privados para validaciones
    async def _validate_invoice_creation(self, invoice_data: InvoiceCreate):
        """Validaciones para creación de factura"""
        # Verificar que el proyecto existe
        project_result = await self.db.execute(
            select(Project).where(Project.id == invoice_data.project_id)
        )
        if not project_result.scalar_one_or_none():
            raise NotFoundException("Proyecto no encontrado")
        
        # Verificar que el número de factura no existe
        existing = await self.repository.get_by_invoice_number(invoice_data.invoice_number)
        if existing:
            raise ValidationException("Ya existe una factura con ese número")

    async def _validate_invoice_update(self, invoice_id: int, invoice_data: InvoiceUpdate):
        """Validaciones para actualización de factura"""
        # Verificar que el nuevo número de factura no existe (si se está cambiando)
        if invoice_data.invoice_number:
            existing_invoice = await self.repository.get_by_id(invoice_id)
            if invoice_data.invoice_number != existing_invoice.invoice_number:
                existing = await self.repository.get_by_invoice_number(invoice_data.invoice_number)
                if existing:
                    raise ValidationException("Ya existe una factura con ese número")