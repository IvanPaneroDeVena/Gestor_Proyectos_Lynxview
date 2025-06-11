from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

class TaskRepository(BaseRepository[Task, TaskCreate, TaskUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Task, db)
        
    async def get_by_id_with_relations(self, id: int) -> Optional[Task]:
        """Obtener tarea con sus relaciones cargadas"""
        result = await self.db.execute(
            select(Task)
            .options(
                selectinload(Task.project),
                selectinload(Task.assignee),
                selectinload(Task.created_by)
            )
            .where(Task.id == id)
        )
        return result.scalar_one_or_none()

    async def get_tasks_with_relations(
        self,
        project_id: Optional[int] = None,
        assignee_id: Optional[int] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[Task], int]:
        """Obtener tareas con relaciones y filtros"""
        query = select(Task).options(
            selectinload(Task.project),
            selectinload(Task.assignee),
            selectinload(Task.created_by)
        )
        count_query = select(func.count(Task.id))
        
        # Aplicar filtros
        conditions = []
        if project_id:
            conditions.append(Task.project_id == project_id)
        if assignee_id:
            conditions.append(Task.assignee_id == assignee_id)
        if status:
            conditions.append(Task.status == status)
        if priority:
            conditions.append(Task.priority == priority)
        if search:
            search_filter = f"%{search}%"
            conditions.append(
                (Task.title.ilike(search_filter)) |
                (Task.description.ilike(search_filter))
            )
        
        if conditions:
            for condition in conditions:
                query = query.where(condition)
                count_query = count_query.where(condition)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación
        query = query.offset(skip).limit(limit).order_by(Task.created_at.desc())
        result = await self.db.execute(query)
        tasks = result.scalars().all()
        
        return list(tasks), total

    async def get_overdue_tasks(self) -> List[Task]:
        """Obtener tareas vencidas"""
        from datetime import datetime
        result = await self.db.execute(
            select(Task)
            .where(
                Task.due_date < datetime.now(),
                Task.status != 'completed'
            )
            .options(selectinload(Task.assignee))
        )
        return list(result.scalars().all())

    async def get_by_project_id(self, project_id: int) -> List[Task]:
        """Obtener tareas por proyecto"""
        result = await self.db.execute(
            select(Task)
            .where(Task.project_id == project_id)
            .options(
                selectinload(Task.assignee),
                selectinload(Task.created_by)
            )
            .order_by(Task.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_assignee_id(self, assignee_id: int) -> List[Task]:
        """Obtener tareas por usuario asignado"""
        result = await self.db.execute(
            select(Task)
            .where(Task.assignee_id == assignee_id)
            .options(
                selectinload(Task.project),
                selectinload(Task.created_by)
            )
            .order_by(Task.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_status(self, status: str) -> List[Task]:
        """Obtener tareas por estado"""
        result = await self.db.execute(
            select(Task)
            .where(Task.status == status)
            .options(
                selectinload(Task.project),
                selectinload(Task.assignee),
                selectinload(Task.created_by)
            )
            .order_by(Task.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_tasks_by_priority(self, priority: str) -> List[Task]:
        """Obtener tareas por prioridad"""
        result = await self.db.execute(
            select(Task)
            .where(Task.priority == priority)
            .options(
                selectinload(Task.project),
                selectinload(Task.assignee),
                selectinload(Task.created_by)
            )
            .order_by(Task.created_at.desc())
        )
        return list(result.scalars().all())

    async def search_tasks_by_text(self, search_term: str) -> List[Task]:
        """Buscar tareas por texto en título o descripción"""
        search_filter = f"%{search_term}%"
        result = await self.db.execute(
            select(Task)
            .where(
                (Task.title.ilike(search_filter)) |
                (Task.description.ilike(search_filter))
            )
            .options(
                selectinload(Task.project),
                selectinload(Task.assignee),
                selectinload(Task.created_by)
            )
            .order_by(Task.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_completed_tasks_by_project(self, project_id: int) -> List[Task]:
        """Obtener tareas completadas de un proyecto"""
        result = await self.db.execute(
            select(Task)
            .where(
                Task.project_id == project_id,
                Task.status == 'completed'
            )
            .options(selectinload(Task.assignee))
            .order_by(Task.completed_at.desc())
        )
        return list(result.scalars().all())

    async def get_task_statistics_by_project(self, project_id: int) -> dict:
        """Obtener estadísticas de tareas de un proyecto"""
        # Contar tareas por estado
        pending_count = await self.db.execute(
            select(func.count(Task.id))
            .where(Task.project_id == project_id, Task.status == 'pending')
        )
        
        in_progress_count = await self.db.execute(
            select(func.count(Task.id))
            .where(Task.project_id == project_id, Task.status == 'in_progress')
        )
        
        completed_count = await self.db.execute(
            select(func.count(Task.id))
            .where(Task.project_id == project_id, Task.status == 'completed')
        )
        
        cancelled_count = await self.db.execute(
            select(func.count(Task.id))
            .where(Task.project_id == project_id, Task.status == 'cancelled')
        )
        
        # Contar tareas vencidas
        from datetime import datetime
        overdue_count = await self.db.execute(
            select(func.count(Task.id))
            .where(
                Task.project_id == project_id,
                Task.due_date < datetime.now(),
                Task.status != 'completed'
            )
        )
        
        return {
            'pending': pending_count.scalar() or 0,
            'in_progress': in_progress_count.scalar() or 0,
            'completed': completed_count.scalar() or 0,
            'cancelled': cancelled_count.scalar() or 0,
            'overdue': overdue_count.scalar() or 0,
            'total': sum([
                pending_count.scalar() or 0,
                in_progress_count.scalar() or 0,
                completed_count.scalar() or 0,
                cancelled_count.scalar() or 0
            ])
        }