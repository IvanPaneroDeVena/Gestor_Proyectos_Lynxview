from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.time_entry_repository import TimeEntryRepository
from app.models.time_entry import TimeEntry
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.schemas.timeEntry import (
    TimeEntryCreate, 
    TimeEntryUpdate, 
    TimeEntryList,
    TimeEntry as TimeEntrySchema
)
from app.exceptions import NotFoundException, ValidationException

class TimeEntryService:
    def __init__(self, db: AsyncSession):
        self.repository = TimeEntryRepository(db)
        self.db = db

    async def search_time_entries(
        self,
        user_id: Optional[int] = None,
        project_id: Optional[int] = None,
        task_id: Optional[int] = None,
        billable: Optional[str] = None,
        billed: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 100
    ) -> TimeEntryList:
        """Buscar entradas de tiempo con filtros"""
        time_entries, total = await self.repository.search_time_entries(
            user_id=user_id,
            project_id=project_id,
            task_id=task_id,
            billable=billable,
            billed=billed,
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=limit
        )
        
        # Transformar a esquemas de respuesta
        entry_schemas = [
            TimeEntrySchema(
                **entry.__dict__,
                user=None,
                project=None,
                task=None
            ) for entry in time_entries
        ]
        
        return TimeEntryList(total=total, time_entries=entry_schemas)

    async def create_time_entry(self, entry_data: TimeEntryCreate) -> TimeEntrySchema:
        """Crear nueva entrada de tiempo con validaciones"""
        print(f"🔍 Creando entrada de tiempo: {entry_data}")
        
        try:
            # Validaciones de negocio
            await self._validate_time_entry_creation(entry_data)
            
            # Crear entrada de tiempo
            time_entry = await self.repository.create(entry_data)
            print(f"✅ Entrada de tiempo creada: {time_entry}")
            
            return TimeEntrySchema(
                **time_entry.__dict__,
                user=None,
                project=None,
                task=None
            )
            
        except Exception as e:
            print(f"❌ Error en create_time_entry: {e}")
            raise

    async def get_time_entry_by_id(self, entry_id: int) -> Optional[TimeEntrySchema]:
        """Obtener entrada de tiempo por ID"""
        time_entry = await self.repository.get_by_id_with_relations(entry_id)
        if not time_entry:
            return None
        
        return TimeEntrySchema(
            **time_entry.__dict__,
            user=None,
            project=None,
            task=None
        )

    async def update_time_entry(self, entry_id: int, entry_data: TimeEntryUpdate) -> Optional[TimeEntrySchema]:
        """Actualizar entrada de tiempo con validaciones"""
        # Verificar que la entrada existe
        existing_entry = await self.repository.get_by_id(entry_id)
        if not existing_entry:
            raise NotFoundException("Entrada de tiempo no encontrada")
        
        # Validaciones de negocio
        await self._validate_time_entry_update(entry_id, entry_data)
        
        # Actualizar
        updated_entry = await self.repository.update(entry_id, entry_data)
        
        return TimeEntrySchema(
            **updated_entry.__dict__,
            user=None,
            project=None,
            task=None
        )

    async def delete_time_entry(self, entry_id: int) -> bool:
        """Eliminar entrada de tiempo"""
        time_entry = await self.repository.get_by_id(entry_id)
        if not time_entry:
            raise NotFoundException("Entrada de tiempo no encontrada")
        
        return await self.repository.delete(entry_id)

    async def get_user_time_entries(self, user_id: int) -> List[TimeEntrySchema]:
        """Obtener entradas de tiempo de un usuario"""
        entries = await self.repository.get_by_user_id(user_id)
        return [
            TimeEntrySchema(
                **entry.__dict__,
                user=None,
                project=None,
                task=None
            ) for entry in entries
        ]

    async def get_project_time_entries(self, project_id: int) -> List[TimeEntrySchema]:
        """Obtener entradas de tiempo de un proyecto"""
        entries = await self.repository.get_by_project_id(project_id)
        return [
            TimeEntrySchema(
                **entry.__dict__,
                user=None,
                project=None,
                task=None
            ) for entry in entries
        ]

    async def get_unbilled_entries(self, user_id: Optional[int] = None) -> List[TimeEntrySchema]:
        """Obtener entradas de tiempo no facturadas"""
        entries = await self.repository.get_unbilled_entries(user_id)
        return [
            TimeEntrySchema(
                **entry.__dict__,
                user=None,
                project=None,
                task=None
            ) for entry in entries
        ]

    async def get_project_hours_summary(self, project_id: int) -> dict:
        """Obtener resumen de horas de un proyecto"""
        total_hours = await self.repository.get_total_hours_by_project(project_id)
        billable_hours = await self.repository.get_billable_hours_by_project(project_id)
        
        return {
            "project_id": project_id,
            "total_hours": total_hours,
            "billable_hours": billable_hours,
            "non_billable_hours": total_hours - billable_hours
        }

    # Métodos privados para validaciones
    async def _validate_time_entry_creation(self, entry_data: TimeEntryCreate):
        """Validaciones para creación de entrada de tiempo"""
        # Verificar que el usuario existe
        user_result = await self.db.execute(
            select(User).where(User.id == entry_data.user_id)
        )
        if not user_result.scalar_one_or_none():
            raise NotFoundException("Usuario no encontrado")
        
        # Verificar que el proyecto existe
        project_result = await self.db.execute(
            select(Project).where(Project.id == entry_data.project_id)
        )
        if not project_result.scalar_one_or_none():
            raise NotFoundException("Proyecto no encontrado")
        
        # Verificar que la tarea existe (si se proporciona)
        if entry_data.task_id:
            task_result = await self.db.execute(
                select(Task).where(Task.id == entry_data.task_id)
            )
            if not task_result.scalar_one_or_none():
                raise NotFoundException("Tarea no encontrada")

    async def _validate_time_entry_update(self, entry_id: int, entry_data: TimeEntryUpdate):
        """Validaciones para actualización de entrada de tiempo"""
        # Verificar que la tarea existe (si se proporciona)
        if entry_data.task_id:
            task_result = await self.db.execute(
                select(Task).where(Task.id == entry_data.task_id)
            )
            if not task_result.scalar_one_or_none():
                raise NotFoundException("Tarea no encontrada")