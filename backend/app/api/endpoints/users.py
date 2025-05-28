# backend/app/api/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.db.base import get_db
from app.models import User
from app.schemas.user import (
    User as UserSchema,
    UserCreate,
    UserUpdate,
    UserList
)

router = APIRouter()

@router.get("/", response_model=UserList)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener lista de usuarios con paginación y filtros
    """
    # Query base
    query = select(User)
    count_query = select(func.count(User.id))
    
    # Aplicar filtros
    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (User.full_name.ilike(search_filter)) |
            (User.email.ilike(search_filter)) |
            (User.username.ilike(search_filter))
        )
        count_query = count_query.where(
            (User.full_name.ilike(search_filter)) |
            (User.email.ilike(search_filter)) |
            (User.username.ilike(search_filter))
        )
    
    # Obtener total
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Aplicar paginación
    query = query.offset(skip).limit(limit).order_by(User.created_at.desc())
    
    # Ejecutar query
    result = await db.execute(query)
    users = result.scalars().all()
    
    return UserList(
        total=total,
        users=[
            UserSchema(
                **user.__dict__,
                current_projects=[]  # TODO: agregar proyectos actuales
            ) for user in users
        ]
    )

@router.post("/", response_model=UserSchema)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Crear un nuevo usuario
    """
    # Verificar que email y username sean únicos
    existing_email = await db.execute(
        select(User).where(User.email == user_in.email)
    )
    if existing_email.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email ya existe")
    
    existing_username = await db.execute(
        select(User).where(User.username == user_in.username)
    )
    if existing_username.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username ya existe")
    
    # Crear usuario procesando el password correctamente
    user_data = user_in.model_dump(exclude={'password'})  # Excluir password del dump
    
    # TODO: En producción, hashear el password con bcrypt
    # from passlib.context import CryptContext
    # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # hashed_password = pwd_context.hash(user_in.password)
    
    # Por ahora, usar password simple (NO HACER EN PRODUCCIÓN)
    user_data['hashed_password'] = f"hashed_{user_in.password}"
    
    user = User(**user_data)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return UserSchema(
        **user.__dict__,
        current_projects=[]
    )

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener un usuario por ID
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return UserSchema(
        **user.__dict__,
        current_projects=[]
    )

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar un usuario
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar campos (excluyendo password por ahora)
    update_data = user_update.model_dump(exclude_unset=True, exclude={'password'})
    for field, value in update_data.items():
        setattr(user, field, value)
    
    # Manejar password por separado si se proporciona
    if user_update.password:
        user.hashed_password = f"hashed_{user_update.password}"
    
    await db.commit()
    await db.refresh(user)
    
    return UserSchema(
        **user.__dict__,
        current_projects=[]
    )

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Eliminar un usuario
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    await db.delete(user)
    await db.commit()
    
    return {"message": "Usuario eliminado exitosamente"}