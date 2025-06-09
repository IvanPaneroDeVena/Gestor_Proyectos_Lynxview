from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.services.project_service import ProjectService
from app.services.user_service import UserService

async def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(db)


async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)