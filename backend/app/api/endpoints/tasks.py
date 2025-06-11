# backend/app/api/endpoints/tasks.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.services.task_service import TaskService
from app.dependencies import get_task_service
from app.schemas.task import (
    Task as TaskSchema,
    TaskCreate,
    TaskUpdate,
    TaskList,
    TaskStatus,
    TaskPriority
)
from app.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=TaskList)
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    project_id: Optional[int] = None,
    assignee_id: Optional[int] = None,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    search: Optional[str] = None,
    task_service: TaskService = Depends(get_task_service)
):
    """Obtener lista de tareas con filtros y relaciones"""
    try:
        return await task_service.search_tasks(
            project_id=project_id,
            assignee_id=assignee_id,
            status=status,
            priority=priority,
            search=search,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TaskSchema)
async def create_task(
    task_in: TaskCreate,
    task_service: TaskService = Depends(get_task_service)
):
    """Crear una nueva tarea"""
    try:
        return await task_service.create_task(task_in)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{task_id}", response_model=TaskSchema)
async def get_task(
    task_id: int,
    task_service: TaskService = Depends(get_task_service)
):
    """Obtener una tarea por ID con relaciones"""
    try:
        task = await task_service.get_task_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{task_id}", response_model=TaskSchema)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    task_service: TaskService = Depends(get_task_service)
):
    """Actualizar una tarea"""
    try:
        updated_task = await task_service.update_task(task_id, task_update)
        return updated_task
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    task_service: TaskService = Depends(get_task_service)
):
    """Eliminar una tarea"""
    try:
        success = await task_service.delete_task(task_id)
        return {"message": "Tarea eliminada exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints adicionales útiles
@router.get("/project/{project_id}/tasks", response_model=TaskList)
async def get_project_tasks(
    project_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    task_service: TaskService = Depends(get_task_service)
):
    """Obtener todas las tareas de un proyecto específico"""
    try:
        return await task_service.get_project_tasks(project_id, skip, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/tasks", response_model=TaskList)
async def get_user_tasks(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    task_service: TaskService = Depends(get_task_service)
):
    """Obtener todas las tareas asignadas a un usuario"""
    try:
        return await task_service.get_user_tasks(user_id, skip, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))