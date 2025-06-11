from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime
from app.services.time_entry_service import TimeEntryService
from app.dependencies import get_time_entry_service
from app.schemas.timeEntry import (
    TimeEntry as TimeEntrySchema,
    TimeEntryCreate,
    TimeEntryUpdate,
    TimeEntryList
)
from app.exceptions import NotFoundException, ValidationException

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
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Obtener lista de entradas de tiempo con paginación y filtros"""
    try:
        return await time_entry_service.search_time_entries(
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TimeEntrySchema)
async def create_time_entry(
    time_entry_in: TimeEntryCreate,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Crear una nueva entrada de tiempo"""
    try:
        return await time_entry_service.create_time_entry(time_entry_in)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{time_entry_id}", response_model=TimeEntrySchema)
async def get_time_entry(
    time_entry_id: int,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Obtener una entrada de tiempo por ID"""
    try:
        time_entry = await time_entry_service.get_time_entry_by_id(time_entry_id)
        if not time_entry:
            raise HTTPException(status_code=404, detail="Entrada de tiempo no encontrada")
        return time_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{time_entry_id}", response_model=TimeEntrySchema)
async def update_time_entry(
    time_entry_id: int,
    time_entry_update: TimeEntryUpdate,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Actualizar una entrada de tiempo"""
    try:
        updated_entry = await time_entry_service.update_time_entry(time_entry_id, time_entry_update)
        return updated_entry
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{time_entry_id}")
async def delete_time_entry(
    time_entry_id: int,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Eliminar una entrada de tiempo"""
    try:
        success = await time_entry_service.delete_time_entry(time_entry_id)
        return {"message": "Entrada de tiempo eliminada exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints adicionales útiles
@router.get("/user/{user_id}/entries")
async def get_user_time_entries(
    user_id: int,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Obtener entradas de tiempo de un usuario específico"""
    try:
        entries = await time_entry_service.get_user_time_entries(user_id)
        return {"entries": entries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/project/{project_id}/entries")
async def get_project_time_entries(
    project_id: int,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Obtener entradas de tiempo de un proyecto específico"""
    try:
        entries = await time_entry_service.get_project_time_entries(project_id)
        return {"entries": entries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/project/{project_id}/hours-summary")
async def get_project_hours_summary(
    project_id: int,
    time_entry_service: TimeEntryService = Depends(get_time_entry_service)
):
    """Obtener resumen de horas de un proyecto"""
    try:
        summary = await time_entry_service.get_project_hours_summary(project_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))