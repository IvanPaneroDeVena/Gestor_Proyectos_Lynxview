from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.technology_repository import TechnologyRepository
from app.models.technology import Technology
from app.schemas.technology import (
    TechnologyCreate, 
    TechnologyUpdate, 
    TechnologyList,
    Technology as TechnologySchema
)
from app.exceptions import NotFoundException, ValidationException

class TechnologyService:
    def __init__(self, db: AsyncSession):
        self.repository = TechnologyRepository(db)
        self.db = db

    async def search_technologies(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> TechnologyList:
        """Buscar tecnologías con filtros"""
        technologies, total = await self.repository.search_technologies(
            search=search or "",
            category=category,
            skip=skip,
            limit=limit
        )
        
        # Transformar a esquemas de respuesta
        tech_schemas = [
            TechnologySchema(**tech.__dict__) for tech in technologies
        ]
        
        return TechnologyList(total=total, technologies=tech_schemas)

    async def create_technology(self, tech_data: TechnologyCreate) -> TechnologySchema:
        """Crear nueva tecnología con validaciones"""
        print(f"🔍 Creando tecnología: {tech_data}")
        
        try:
            # Validaciones de negocio
            await self._validate_technology_creation(tech_data)
            
            # Crear tecnología
            technology = await self.repository.create(tech_data)
            print(f"✅ Tecnología creada: {technology}")
            
            return TechnologySchema(**technology.__dict__)
            
        except Exception as e:
            print(f"❌ Error en create_technology: {e}")
            raise

    async def get_technology_by_id(self, tech_id: int) -> Optional[TechnologySchema]:
        """Obtener tecnología por ID"""
        technology = await self.repository.get_by_id(tech_id)
        if not technology:
            return None
        
        return TechnologySchema(**technology.__dict__)

    async def update_technology(self, tech_id: int, tech_data: TechnologyUpdate) -> Optional[TechnologySchema]:
        """Actualizar tecnología con validaciones"""
        # Verificar que la tecnología existe
        existing_tech = await self.repository.get_by_id(tech_id)
        if not existing_tech:
            raise NotFoundException("Tecnología no encontrada")
        
        # Validaciones de negocio
        await self._validate_technology_update(tech_id, tech_data)
        
        # Actualizar
        updated_tech = await self.repository.update(tech_id, tech_data)
        
        return TechnologySchema(**updated_tech.__dict__)

    async def delete_technology(self, tech_id: int) -> bool:
        """Eliminar tecnología"""
        technology = await self.repository.get_by_id(tech_id)
        if not technology:
            raise NotFoundException("Tecnología no encontrada")
        
        return await self.repository.delete(tech_id)

    async def get_categories(self) -> List[str]:
        """Obtener lista de categorías de tecnologías"""
        return await self.repository.get_categories()

    async def get_technologies_by_category(self, category: str) -> List[TechnologySchema]:
        """Obtener tecnologías por categoría"""
        technologies = await self.repository.get_by_category(category)
        return [TechnologySchema(**tech.__dict__) for tech in technologies]

    # Métodos privados para validaciones
    async def _validate_technology_creation(self, tech_data: TechnologyCreate):
        """Validaciones para creación de tecnología"""
        # Verificar que el nombre sea único
        existing = await self.repository.get_by_name(tech_data.name)
        if existing:
            raise ValidationException("Tecnología ya existe")

    async def _validate_technology_update(self, tech_id: int, tech_data: TechnologyUpdate):
        """Validaciones para actualización de tecnología"""
        if tech_data.name:
            existing = await self.repository.get_by_name(tech_data.name)
            if existing and existing.id != tech_id:
                raise ValidationException("Ya existe una tecnología con ese nombre")