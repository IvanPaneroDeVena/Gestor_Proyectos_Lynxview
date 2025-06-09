from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType], ABC):
    def __init__(self, model: type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: int) -> Optional[ModelType]:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[List[ModelType], int]:
        query = select(self.model)
        count_query = select(func.count(self.model.id))
        
        # Aplicar filtros si existen
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field) and value is not None:
                    query = query.where(getattr(self.model, field) == value)
                    count_query = count_query.where(getattr(self.model, field) == value)
        
        # Obtener total
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Aplicar paginación
        query = query.offset(skip).limit(limit).order_by(self.model.id.desc())
        
        # Ejecutar query
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return list(items), total

    async def create(self, obj_in) -> ModelType:
        # Manejar tanto diccionarios como objetos Pydantic
        if hasattr(obj_in, 'model_dump'):
            obj_data = obj_in.model_dump()
        elif isinstance(obj_in, dict):
            obj_data = obj_in
        else:
            obj_data = obj_in
        
        print(f"🔍 Creando con datos: {obj_data}")
        
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, id: int, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return None
            
        if hasattr(obj_in, 'model_dump'):
            update_data = obj_in.model_dump(exclude_unset=True)
        else:
            update_data = obj_in
            
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
                
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, id: int) -> bool:
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return False
            
        await self.db.delete(db_obj)
        await self.db.commit()
        return True