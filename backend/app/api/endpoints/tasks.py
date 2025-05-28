# backend/app/api/endpoints/tasks.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.db.base import get_db
from app.models import Task, Project, User
from app.schemas.task import (
    Task as TaskSchema,
    TaskCreate,
    TaskUpdate,
    TaskList,
    TaskStatus,
    TaskPriority,
    ProjectInfo,
    UserInfo
)

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
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de tareas con filtros y relaciones
    """
    # Query con relaciones cargadas
    query = select(Task).options(
        selectinload(Task.project),
        selectinload(Task.assignee),
        selectinload(Task.created_by)
    )
    count_query = select(func.count(Task.id))
    
    # Aplicar filtros
    if project_id:
        query = query.where(Task.project_id == project_id)
        count_query = count_query.where(Task.project_id == project_id)
    
    if assignee_id:
        query = query.where(Task.assignee_id == assignee_id)
        count_query = count_query.where(Task.assignee_id == assignee_id)
    
    if status:
        query = query.where(Task.status == status)
        count_query = count_query.where(Task.status == status)
    
    if priority:
        query = query.where(Task.priority == priority)
        count_query = count_query.where(Task.priority == priority)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (Task.title.ilike(search_filter)) |
            (Task.description.ilike(search_filter))
        )
        count_query = count_query.where(
            (Task.title.ilike(search_filter)) |
            (Task.description.ilike(search_filter))
        )
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación
    query = query.offset(skip).limit(limit).order_by(Task.created_at.desc())
    
    # Ejecutar query
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    # Preparar respuesta con relaciones
    tasks_with_relations = []
    for task in tasks:
        task_dict = task.__dict__.copy()
        
        # Agregar información del proyecto
        if task.project:
            task_dict['project'] = ProjectInfo(
                id=task.project.id,
                name=task.project.name,
                client_name=task.project.client_name
            )
        
        # Agregar información del asignado
        if task.assignee:
            task_dict['assignee'] = UserInfo(
                id=task.assignee.id,
                username=task.assignee.username,
                full_name=task.assignee.full_name,
                role=task.assignee.role
            )
        
        # Agregar información del creador
        if task.created_by:
            task_dict['created_by'] = UserInfo(
                id=task.created_by.id,
                username=task.created_by.username,
                full_name=task.created_by.full_name,
                role=task.created_by.role
            )
        
        tasks_with_relations.append(TaskSchema(**task_dict))
    
    return TaskList(total=total, tasks=tasks_with_relations)

@router.post("/", response_model=TaskSchema)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear una nueva tarea
    """
    # Verificar que el proyecto existe
    project_result = await db.execute(
        select(Project).where(Project.id == task_in.project_id)
    )
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar que el usuario existe (si se asigna)
    if task_in.assignee_id:
        user_result = await db.execute(
            select(User).where(User.id == task_in.assignee_id)
        )
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario asignado no encontrado")
    
    # Crear tarea
    task_data = task_in.model_dump()
    # Por ahora, usar el primer usuario como creador (mejorar con autenticación)
    first_user = await db.execute(select(User).limit(1))
    creator = first_user.scalar_one_or_none()
    if creator:
        task_data['created_by_id'] = creator.id
    
    task = Task(**task_data)
    
    db.add(task)
    await db.commit()
    await db.refresh(task)
    
    # Cargar relaciones para la respuesta
    result = await db.execute(
        select(Task)
        .options(
            selectinload(Task.project), 
            selectinload(Task.assignee),
            selectinload(Task.created_by)
        )
        .where(Task.id == task.id)
    )
    task_with_relations = result.scalar_one()
    
    # Preparar respuesta
    task_dict = task_with_relations.__dict__.copy()
    if task_with_relations.project:
        task_dict['project'] = ProjectInfo(**task_with_relations.project.__dict__)
    if task_with_relations.assignee:
        task_dict['assignee'] = UserInfo(**task_with_relations.assignee.__dict__)
    if task_with_relations.created_by:
        task_dict['created_by'] = UserInfo(**task_with_relations.created_by.__dict__)
    
    return TaskSchema(**task_dict)

@router.get("/{task_id}", response_model=TaskSchema)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener una tarea por ID con relaciones
    """
    result = await db.execute(
        select(Task)
        .options(
            selectinload(Task.project), 
            selectinload(Task.assignee),
            selectinload(Task.created_by)
        )
        .where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    # Preparar respuesta con relaciones
    task_dict = task.__dict__.copy()
    if task.project:
        task_dict['project'] = ProjectInfo(**task.project.__dict__)
    if task.assignee:
        task_dict['assignee'] = UserInfo(**task.assignee.__dict__)
    if task.created_by:
        task_dict['created_by'] = UserInfo(**task.created_by.__dict__)
    
    return TaskSchema(**task_dict)

@router.put("/{task_id}", response_model=TaskSchema)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar una tarea
    """
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    # Verificar proyecto si se cambia
    update_data = task_update.model_dump(exclude_unset=True)
    if 'project_id' in update_data:
        project_result = await db.execute(
            select(Project).where(Project.id == update_data['project_id'])
        )
        if not project_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Verificar usuario si se cambia
    if 'assignee_id' in update_data and update_data['assignee_id']:
        user_result = await db.execute(
            select(User).where(User.id == update_data['assignee_id'])
        )
        if not user_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Usuario asignado no encontrado")
    
    # Actualizar campos
    for field, value in update_data.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task)
    
    # Cargar relaciones para respuesta
    result = await db.execute(
        select(Task)
        .options(
            selectinload(Task.project), 
            selectinload(Task.assignee),
            selectinload(Task.created_by)
        )
        .where(Task.id == task.id)
    )
    task_with_relations = result.scalar_one()
    
    # Preparar respuesta
    task_dict = task_with_relations.__dict__.copy()
    if task_with_relations.project:
        task_dict['project'] = ProjectInfo(**task_with_relations.project.__dict__)
    if task_with_relations.assignee:
        task_dict['assignee'] = UserInfo(**task_with_relations.assignee.__dict__)
    if task_with_relations.created_by:
        task_dict['created_by'] = UserInfo(**task_with_relations.created_by.__dict__)
    
    return TaskSchema(**task_dict)

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar una tarea
    """
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    await db.delete(task)
    await db.commit()
    
    return {"message": "Tarea eliminada exitosamente"}

# Endpoints adicionales útiles
@router.get("/project/{project_id}/tasks", response_model=TaskList)
async def get_project_tasks(
    project_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener todas las tareas de un proyecto específico
    """
    return await get_tasks(project_id=project_id, skip=skip, limit=limit, db=db)

@router.get("/user/{user_id}/tasks", response_model=TaskList)
async def get_user_tasks(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener todas las tareas asignadas a un usuario
    """
    return await get_tasks(assignee_id=user_id, skip=skip, limit=limit, db=db)