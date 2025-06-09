from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
RepositoryType = TypeVar("RepositoryType")
EntityType = TypeVar("EntityType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class BaseService(Generic[RepositoryType, EntityType, CreateSchemaType, UpdateSchemaType], ABC):
    def init(self, repository: RepositoryType):
        self.repository = repository
        
        
async def get_by_id(self, id: int) -> Optional[EntityType]:
    """Obtener entidad por ID"""
    return await self.repository.get_by_id(id)

async def get_all(
    self, 
    skip: int = 0, 
    limit: int = 100,
    **filters
) -> tuple[List[EntityType], int]:
    """Obtener todas las entidades con filtros"""
    return await self.repository.get_all(skip, limit, filters)

async def create(self, obj_in: CreateSchemaType) -> EntityType:
    """Crear nueva entidad"""
    return await self.repository.create(obj_in)

async def update(self, id: int, obj_in: UpdateSchemaType) -> Optional[EntityType]:
    """Actualizar entidad"""
    return await self.repository.update(id, obj_in)

async def delete(self, id: int) -> bool:
    """Eliminar entidad"""
    return await self.repository.delete(id)