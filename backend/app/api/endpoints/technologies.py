# backend/app/api/endpoints/technologies.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.services.technology_service import TechnologyService
from app.dependencies import get_technology_service
from app.schemas.technology import (
    Technology as TechnologySchema,
    TechnologyCreate,
    TechnologyUpdate,
    TechnologyList
)
from app.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=TechnologyList)
async def get_technologies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),  # Límite más alto porque hay pocas tecnologías
    category: Optional[str] = None,
    search: Optional[str] = None,
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Obtener lista de tecnologías con filtros"""
    try:
        return await technology_service.search_technologies(
            search=search,
            category=category,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TechnologySchema)
async def create_technology(
    technology_in: TechnologyCreate,
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Crear una nueva tecnología"""
    try:
        return await technology_service.create_technology(technology_in)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{technology_id}", response_model=TechnologySchema)
async def get_technology(
    technology_id: int,
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Obtener una tecnología por ID"""
    try:
        technology = await technology_service.get_technology_by_id(technology_id)
        if not technology:
            raise HTTPException(status_code=404, detail="Tecnología no encontrada")
        return technology
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{technology_id}", response_model=TechnologySchema)
async def update_technology(
    technology_id: int,
    technology_update: TechnologyUpdate,
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Actualizar una tecnología"""
    try:
        updated_tech = await technology_service.update_technology(technology_id, technology_update)
        return updated_tech
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{technology_id}")
async def delete_technology(
    technology_id: int,
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Eliminar una tecnología"""
    try:
        success = await technology_service.delete_technology(technology_id)
        return {"message": "Tecnología eliminada exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories/list")
async def get_technology_categories(
    technology_service: TechnologyService = Depends(get_technology_service)
):
    """Obtener lista de categorías únicas"""
    try:
        categories = await technology_service.get_categories()
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))