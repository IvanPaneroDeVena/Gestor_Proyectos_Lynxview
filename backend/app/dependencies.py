from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.services.project_service import ProjectService
from app.services.user_service import UserService
from app.services.task_service import TaskService
from app.services.technology_service import TechnologyService
from app.services.invoice_service import InvoiceService
from app.services.time_entry_service import TimeEntryService

async def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(db)

async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)

async def get_task_service(db: AsyncSession = Depends(get_db)) -> TaskService:
    return TaskService(db)

async def get_technology_service(db: AsyncSession = Depends(get_db)) -> TechnologyService:
    return TechnologyService(db)

async def get_invoice_service(db: AsyncSession = Depends(get_db)) -> InvoiceService:
    return InvoiceService(db)

async def get_time_entry_service(db: AsyncSession = Depends(get_db)) -> TimeEntryService:
    return TimeEntryService(db)