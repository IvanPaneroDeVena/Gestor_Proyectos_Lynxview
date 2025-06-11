from typing import List, Optional, Tuple
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.time_entry import TimeEntry
from app.schemas.timeEntry import TimeEntryCreate, TimeEntryUpdate

class TimeEntryRepository(BaseRepository[TimeEntry, TimeEntryCreate, TimeEntryUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(TimeEntry, db)

    async def get_by_id_with_relations(self, id: int) -> Optional[TimeEntry]:
        """Obtener entrada de tiempo con sus relaciones cargadas"""
        result = await self.db.execute(
            select(TimeEntry)
            .options(
                selectinload(TimeEntry.user),
                selectinload(TimeEntry.project)
            )
            .where(TimeEntry.id == id)
        )
        return result.scalar_one_or_none()

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
    ) -> Tuple[List[TimeEntry], int]:
        """Búsqueda avanzada de entradas de tiempo"""
        query = select(TimeEntry).options(
            selectinload(TimeEntry.user),
            selectinload(TimeEntry.project)
        )
        count_query = select(func.count(TimeEntry.id))
        
        # Aplicar filtros
        conditions = []
        if user_id:
            conditions.append(TimeEntry.user_id == user_id)
        if project_id:
            conditions.append(TimeEntry.project_id == project_id)
        if task_id:
            conditions.append(TimeEntry.task_id == task_id)
        if billable:
            conditions.append(TimeEntry.billable == billable)
        if billed:
            conditions.append(TimeEntry.billed == billed)
        if start_date:
            conditions.append(TimeEntry.date >= start_date)
        if end_date:
            conditions.append(TimeEntry.date <= end_date)
        
        if conditions:
            for condition in conditions:
                query = query.where(condition)
                count_query = count_query.where(condition)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación
        query = query.offset(skip).limit(limit).order_by(TimeEntry.date.desc())
        result = await self.db.execute(query)
        time_entries = result.scalars().all()
        
        return list(time_entries), total

    async def get_by_user_id(self, user_id: int) -> List[TimeEntry]:
        """Obtener entradas de tiempo por usuario"""
        result = await self.db.execute(
            select(TimeEntry)
            .where(TimeEntry.user_id == user_id)
            .order_by(TimeEntry.date.desc())
        )
        return list(result.scalars().all())

    async def get_by_project_id(self, project_id: int) -> List[TimeEntry]:
        """Obtener entradas de tiempo por proyecto"""
        result = await self.db.execute(
            select(TimeEntry)
            .where(TimeEntry.project_id == project_id)
            .order_by(TimeEntry.date.desc())
        )
        return list(result.scalars().all())

    async def get_unbilled_entries(self, user_id: Optional[int] = None) -> List[TimeEntry]:
        """Obtener entradas de tiempo no facturadas"""
        query = select(TimeEntry).where(
            TimeEntry.billable == "true",
            TimeEntry.billed == "false"
        )
        
        if user_id:
            query = query.where(TimeEntry.user_id == user_id)
        
        result = await self.db.execute(query.order_by(TimeEntry.date.desc()))
        return list(result.scalars().all())

    async def get_total_hours_by_project(self, project_id: int) -> float:
        """Obtener total de horas trabajadas en un proyecto"""
        result = await self.db.execute(
            select(func.sum(TimeEntry.hours))
            .where(TimeEntry.project_id == project_id)
        )
        total = result.scalar()
        return float(total) if total else 0.0

    async def get_billable_hours_by_project(self, project_id: int) -> float:
        """Obtener total de horas facturables en un proyecto"""
        result = await self.db.execute(
            select(func.sum(TimeEntry.hours))
            .where(
                TimeEntry.project_id == project_id,
                TimeEntry.billable == "true"
            )
        )
        total = result.scalar()
        return float(total) if total else 0.0