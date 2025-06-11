from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.repositories.base import BaseRepository
from app.models.technology import Technology
from app.schemas.technology import TechnologyCreate, TechnologyUpdate

class TechnologyRepository(BaseRepository[Technology, TechnologyCreate, TechnologyUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Technology, db)

    async def get_by_name(self, name: str) -> Optional[Technology]:
        """Obtener tecnología por nombre"""
        result = await self.db.execute(
            select(Technology).where(Technology.name == name)
        )
        return result.scalar_one_or_none()

    async def search_technologies(
        self, 
        search: str, 
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[Technology], int]:
        """Búsqueda avanzada de tecnologías"""
        query = select(Technology)
        count_query = select(func.count(Technology.id))
        
        # Filtro de búsqueda
        if search:
            search_filter = f"%{search}%"
            search_condition = (
                (Technology.name.ilike(search_filter)) |
                (Technology.description.ilike(search_filter))
            )
            query = query.where(search_condition)
            count_query = count_query.where(search_condition)
        
        # Filtro de categoría
        if category:
            query = query.where(Technology.category == category)
            count_query = count_query.where(Technology.category == category)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación y ordenamiento
        query = query.offset(skip).limit(limit).order_by(Technology.category, Technology.name)
        result = await self.db.execute(query)
        technologies = result.scalars().all()
        
        return list(technologies), total

    async def get_categories(self) -> List[str]:
        """Obtener lista de categorías únicas"""
        result = await self.db.execute(
            select(Technology.category).distinct().where(Technology.category.isnot(None))
        )
        categories = [row[0] for row in result.fetchall()]
        return categories

    async def get_by_category(self, category: str) -> List[Technology]:
        """Obtener tecnologías por categoría"""
        result = await self.db.execute(
            select(Technology)
            .where(Technology.category == category)
            .order_by(Technology.name)
        )
        return list(result.scalars().all())