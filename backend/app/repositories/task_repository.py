from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

class TaskRepository(BaseRepository[Task, TaskCreate, TaskUpdate]):
    def init(self, db: AsyncSession):
        super().init(Task, db)
        
        
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
) -> tuple[List[Task], int]:
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