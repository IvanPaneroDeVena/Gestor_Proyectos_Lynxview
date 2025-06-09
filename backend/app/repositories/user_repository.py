from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.repositories.base import BaseRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Obtener usuario por email"""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> Optional[User]:
        """Obtener usuario por username"""
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def search_users(
        self, 
        search: str, 
        role: Optional[str] = None,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> tuple[List[User], int]:
        """Búsqueda avanzada de usuarios"""
        query = select(User)
        count_query = select(func.count(User.id))
        
        # Filtro de búsqueda
        if search:
            search_filter = f"%{search}%"
            search_condition = (
                (User.full_name.ilike(search_filter)) |
                (User.email.ilike(search_filter)) |
                (User.username.ilike(search_filter))
            )
            query = query.where(search_condition)
            count_query = count_query.where(search_condition)
        
        # Filtros adicionales
        if role:
            query = query.where(User.role == role)
            count_query = count_query.where(User.role == role)
            
        if is_active is not None:
            query = query.where(User.is_active == is_active)
            count_query = count_query.where(User.is_active == is_active)
        
        # Total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Paginación
        query = query.offset(skip).limit(limit).order_by(User.created_at.desc())
        result = await self.db.execute(query)
        users = result.scalars().all()
        
        return list(users), total

    async def get_active_users_by_role(self, role: str) -> List[User]:
        """Obtener usuarios activos por rol"""
        result = await self.db.execute(
            select(User).where(User.role == role, User.is_active == True)
        )
        return list(result.scalars().all())