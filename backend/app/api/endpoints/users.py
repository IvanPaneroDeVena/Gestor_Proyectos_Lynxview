from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.services.user_service import UserService
from app.dependencies import get_user_service
from app.schemas.user import (
    User as UserSchema,
    UserCreate,
    UserUpdate,
    UserList
)
from app.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=UserList)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    user_service: UserService = Depends(get_user_service)
):
    """Obtener lista de usuarios con filtros"""
    try:
        return await user_service.search_users(
            search=search,
            role=role,
            is_active=is_active,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=UserSchema)
async def create_user(
    user_in: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    """Crear un nuevo usuario"""
    try:
        return await user_service.create_user(user_in)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """Obtener un usuario por ID"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """Actualizar un usuario"""
    try:
        updated_user = await user_service.update_user(user_id, user_update)
        return updated_user
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """Eliminar un usuario"""
    try:
        success = await user_service.delete_user(user_id)
        return {"message": "Usuario eliminado exitosamente"}
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))