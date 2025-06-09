from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.services.project_service import ProjectService
from app.dependencies import get_project_service
from app.schemas.project import (
    Project as ProjectSchema,
    ProjectCreate,
    ProjectUpdate,
    ProjectList
)
from app.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=ProjectList)
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    project_service: ProjectService = Depends(get_project_service)
):
    """Obtener lista de proyectos con filtros"""
    try:
        return await project_service.search_projects(
            search=search,
            status=status,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ProjectSchema)
async def create_project(
    project_in: ProjectCreate,
    project_service: ProjectService = Depends(get_project_service)
):
    """Crear un nuevo proyecto"""
    try:
        return await project_service.create_project(project_in)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: int,
    project_service: ProjectService = Depends(get_project_service)
):
    """Obtener un proyecto por ID"""
    try:
        project = await project_service.get_project_with_details(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        return project
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    project_service: ProjectService = Depends(get_project_service)
):
    """Actualizar un proyecto"""
    try:
        updated_project = await project_service.update_project(project_id, project_update)
        return updated_project
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    project_service: ProjectService = Depends(get_project_service)
):
    """Eliminar un proyecto"""
    try:
        success = await project_service.delete_project(project_id)
        return {"message": "Proyecto eliminado exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))