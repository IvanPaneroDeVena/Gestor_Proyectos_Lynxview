from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

class ProjectRepository(BaseRepository[Project, ProjectCreate, ProjectUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)

    async def get_by_id_with_relations(self, id: int) -> Optional[Project]:
        """Obtener proyecto con sus relaciones cargadas"""
        result = await self.db.execute(
            select(Project)
            .options(
                selectinload(Project.members),
                selectinload(Project.technologies),
                selectinload(Project.tasks),
                selectinload(Project.invoices)
            )
            .where(Project.id == id)
        )
        return result.scalar_one_or_none()

    async def search_projects(
        self, 
        search: str, 
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> tuple[List[Project], int]:
        """Búsqueda avanzada de proyectos"""
        query = select(Project)
        count_query = select(func.count(Project.id))
        
        # Filtro de búsqueda
        if search:
            search_filter = f"%{search}%"
            search_condition = (
                (Project.name.ilike(search_filter)) |
                (Project.client_name.ilike(search_filter)) |
                (Project.description.ilike(search_filter))
            )
            query = query.where(search_condition)
            count_query = count_query.where(search_condition)
        
        # Filtro de estado
        if status:
            query = query.where(Project.status == status)
            count_query = count_query.where(Project.status == status)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación
        query = query.offset(skip).limit(limit).order_by(Project.created_at.desc())
        result = await self.db.execute(query)
        projects = result.scalars().all()
        
        return list(projects), total