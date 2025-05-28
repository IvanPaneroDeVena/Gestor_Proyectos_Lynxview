from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime
from app.db.base import get_db
from app.models import TimeEntry, User, Project, Task
from app.schemas.timeEntry import (
    TimeEntry as TimeEntrySchema,
    TimeEntryCreate,
    TimeEntryUpdate,
    TimeEntryList
)

router = APIRouter()

@router.get("/", response_model=TimeEntryList)
async def get_time_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    user_id: Optional[int] = None,
    project_id: Optional[int] = None,
    task_id: Optional[int] = None,
    billable: Optional[str] = None,
    billed: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de entradas de tiempo con paginación y filtros
    """
    # Query base
    query = select(TimeEntry)
    count_query = select(func.count(TimeEntry.id))
    
    # Aplicar filtros
    if user_id:
        query = query.where(TimeEntry.user_id == user_id)
        count_query = count_query.where(TimeEntry.user_id == user_id)
    
    if project_id:
        query = query.where(TimeEntry.project_id == project_id)
        count_query = count_query.where(TimeEntry.project_id == project_id)
    
    if task_id:
        query = query.where(TimeEntry.task_id == task_id)
        count_query = count_query.where(TimeEntry.task_id == task_id)
    
    if billable:
        query = query.where(TimeEntry.billable == billable)
        count_query = count_query.where(TimeEntry.billable == billable)
    
    if billed:
        query = query.where(TimeEntry.billed == billed)
        count_query = count_query.where(TimeEntry.billed == billed)
    
    if start_date:
        query = query.where(TimeEntry.date >= start_date)
        count_query = count_query.where(TimeEntry.date >= start_date)
    
    if end_date:
        query = query.where(TimeEntry.date <= end_date)
        count_query = count_query.where(TimeEntry.date <= end_date)
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación
    query = query.offset(skip).limit(limit).order_by(TimeEntry.date.desc())
    
    # Ejecutar query
    result = await db.execute(query)
    time_entries = result.scalars().all()
    
    return TimeEntryList(
        total=total,
        time_entries=[
            TimeEntrySchema(
                **time_entry.__dict__,
                user=None,
                project=None,
                task=None
            ) for time_entry in time_entries
        ]
    )

@router.post("/", response_model=TimeEntrySchema)
async def create_time_entry(
    time_entry_in: TimeEntryCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear una nueva entrada de tiempo
    """
    # Verificar que el usuario existe
    user_result = await db.execute(
        select(User).where(User.id == time_entry_in.user_id)
    )
    if not user_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que el proyecto existe
    project_result = await db.execute(
        select(Project).where(Project.id == time_entry_in.project_id)
    )
    if not project_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar que la tarea existe (si se proporciona)
    if time_entry_in.task_id:
        task_result = await db.execute(
            select(Task).where(Task.id == time_entry_in.task_id)
        )
        if not task_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    # Crear instancia de la entrada de tiempo
    time_entry = TimeEntry(**time_entry_in.model_dump())
    
    db.add(time_entry)
    await db.commit()
    await db.refresh(time_entry)
    
    return TimeEntrySchema(
        **time_entry.__dict__,
        user=None,
        project=None,
        task=None
    )

@router.get("/{time_entry_id}", response_model=TimeEntrySchema)
async def get_time_entry(
    time_entry_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener una entrada de tiempo por ID
    """
    result = await db.execute(
        select(TimeEntry).where(TimeEntry.id == time_entry_id)
    )
    time_entry = result.scalar_one_or_none()
    
    if not time_entry:
        raise HTTPException(status_code=404, detail="Entrada de tiempo no encontrada")
    
    return TimeEntrySchema(
        **time_entry.__dict__,
        user=None,
        project=None,
        task=None
    )

@router.put("/{time_entry_id}", response_model=TimeEntrySchema)
async def update_time_entry(
    time_entry_id: int,
    time_entry_update: TimeEntryUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una entrada de tiempo
    """
    result = await db.execute(
        select(TimeEntry).where(TimeEntry.id == time_entry_id)
    )
    time_entry = result.scalar_one_or_none()
    
    if not time_entry:
        raise HTTPException(status_code=404, detail="Entrada de tiempo no encontrada")
    
    # Verificar que la tarea existe (si se proporciona)
    if time_entry_update.task_id:
        task_result = await db.execute(
            select(Task).where(Task.id == time_entry_update.task_id)
        )
        if not task_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    # Actualizar campos
    update_data = time_entry_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(time_entry, field, value)
    
    await db.commit()
    await db.refresh(time_entry)
    
    return TimeEntrySchema(
        **time_entry.__dict__,
        user=None,
        project=None,
        task=None
    )

@router.delete("/{time_entry_id}")
async def delete_time_entry(
    time_entry_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar una entrada de tiempo
    """
    result = await db.execute(
        select(TimeEntry).where(TimeEntry.id == time_entry_id)
    )
    time_entry = result.scalar_one_or_none()
    
    if not time_entry:
        raise HTTPException(status_code=404, detail="Entrada de tiempo no encontrada")
    
    await db.delete(time_entry)
    await db.commit()
    
    return {"message": "Entrada de tiempo eliminada exitosamente"}