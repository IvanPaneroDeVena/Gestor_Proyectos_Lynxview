# backend/app/api/endpoints/technologies.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.db.base import get_db
from app.models import Technology
from app.schemas.technology import (
    Technology as TechnologySchema,
    TechnologyCreate,
    TechnologyUpdate,
    TechnologyList
)

router = APIRouter()

@router.get("/", response_model=TechnologyList)
async def get_technologies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),  # Límite más alto porque hay pocas tecnologías
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de tecnologías con filtros
    """
    # Query base
    query = select(Technology)
    count_query = select(func.count(Technology.id))
    
    # Aplicar filtros
    if category:
        query = query.where(Technology.category == category)
        count_query = count_query.where(Technology.category == category)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (Technology.name.ilike(search_filter)) |
            (Technology.description.ilike(search_filter))
        )
        count_query = count_query.where(
            (Technology.name.ilike(search_filter)) |
            (Technology.description.ilike(search_filter))
        )
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación y ordenar por nombre
    query = query.offset(skip).limit(limit).order_by(Technology.category, Technology.name)
    
    # Ejecutar query
    result = await db.execute(query)
    technologies = result.scalars().all()
    
    return TechnologyList(
        total=total,
        technologies=[
            TechnologySchema(**tech.__dict__) for tech in technologies
        ]
    )

@router.post("/", response_model=TechnologySchema)
async def create_technology(
    technology_in: TechnologyCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear una nueva tecnología
    """
    # Verificar que el nombre sea único
    existing = await db.execute(
        select(Technology).where(Technology.name == technology_in.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Tecnología ya existe")
    
    # Crear tecnología
    technology = Technology(**technology_in.model_dump())
    
    db.add(technology)
    await db.commit()
    await db.refresh(technology)
    
    return TechnologySchema(**technology.__dict__)

@router.get("/{technology_id}", response_model=TechnologySchema)
async def get_technology(
    technology_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener una tecnología por ID
    """
    result = await db.execute(
        select(Technology).where(Technology.id == technology_id)
    )
    technology = result.scalar_one_or_none()
    
    if not technology:
        raise HTTPException(status_code=404, detail="Tecnología no encontrada")
    
    return TechnologySchema(**technology.__dict__)

@router.put("/{technology_id}", response_model=TechnologySchema)
async def update_technology(
    technology_id: int,
    technology_update: TechnologyUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una tecnología
    """
    result = await db.execute(
        select(Technology).where(Technology.id == technology_id)
    )
    technology = result.scalar_one_or_none()
    
    if not technology:
        raise HTTPException(status_code=404, detail="Tecnología no encontrada")
    
    # Actualizar campos
    update_data = technology_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(technology, field, value)
    
    await db.commit()
    await db.refresh(technology)
    
    return TechnologySchema(**technology.__dict__)

@router.delete("/{technology_id}")
async def delete_technology(
    technology_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar una tecnología
    """
    result = await db.execute(
        select(Technology).where(Technology.id == technology_id)
    )
    technology = result.scalar_one_or_none()
    
    if not technology:
        raise HTTPException(status_code=404, detail="Tecnología no encontrada")
    
    await db.delete(technology)
    await db.commit()
    
    return {"message": "Tecnología eliminada exitosamente"}

@router.get("/categories/list")
async def get_technology_categories(db: AsyncSession = Depends(get_db)):
    """
    Obtener lista de categorías únicas
    """
    result = await db.execute(
        select(Technology.category).distinct().where(Technology.category.isnot(None))
    )
    categories = [row[0] for row in result.fetchall()]
    
    return {"categories": categories}