from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.db.base import get_db
from app.models import Project
from app.schemas.project import (
    Project as ProjectSchema,
    ProjectCreate,
    ProjectUpdate,
    ProjectList
)

router = APIRouter()

@router.get("/", response_model=ProjectList)
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de proyectos con paginación y filtros
    """
    # Query base
    query = select(Project)
    count_query = select(func.count(Project.id))
    
    # Aplicar filtros
    if status:
        query = query.where(Project.status == status)
        count_query = count_query.where(Project.status == status)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (Project.name.ilike(search_filter)) |
            (Project.client_name.ilike(search_filter))
        )
        count_query = count_query.where(
            (Project.name.ilike(search_filter)) |
            (Project.client_name.ilike(search_filter))
        )
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación
    query = query.offset(skip).limit(limit).order_by(Project.created_at.desc())
    
    # Ejecutar query
    result = await db.execute(query)
    projects = result.scalars().all()
    
    return ProjectList(
        total=total,
        projects=[
            ProjectSchema(
                **project.__dict__,
                members=[],
                technologies=[],
                total_hours=0,
                total_invoiced=0
            ) for project in projects
        ]
    )

@router.post("/", response_model=ProjectSchema)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear un nuevo proyecto
    """
    # Crear instancia del proyecto
    project = Project(**project_in.model_dump(exclude={'member_ids', 'technology_ids'}))
    
    # TODO: Agregar miembros y tecnologías si se proporcionan
    
    db.add(project)
    await db.commit()
    await db.refresh(project)
    
    return ProjectSchema(
        **project.__dict__,
        members=[],
        technologies=[],
        total_hours=0,
        total_invoiced=0
    )

@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener un proyecto por ID
    """
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    return ProjectSchema(
        **project.__dict__,
        members=[],
        technologies=[],
        total_hours=0,
        total_invoiced=0
    )

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar un proyecto
    """
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Actualizar campos
    update_data = project_update.model_dump(exclude_unset=True, exclude={'member_ids', 'technology_ids'})
    for field, value in update_data.items():
        setattr(project, field, value)
    
    await db.commit()
    await db.refresh(project)
    
    return ProjectSchema(
        **project.__dict__,
        members=[],
        technologies=[],
        total_hours=0,
        total_invoiced=0
    )

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar un proyecto
    """
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    await db.delete(project)
    await db.commit()
    
    return {"message": "Proyecto eliminado exitosamente"}