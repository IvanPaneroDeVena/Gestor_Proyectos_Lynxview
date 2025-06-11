from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.project_repository import ProjectRepository
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectList, Project as ProjectSchema
from app.exceptions import NotFoundException, ValidationException

class ProjectService:
    def __init__(self, db: AsyncSession):
        self.repository = ProjectRepository(db)
        self.db = db

    def _build_project_schema(self, project: Project) -> ProjectSchema:
        """Construir schema de proyecto evitando conflictos con relaciones"""
        project_dict = {
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'client_name': project.client_name,
            'status': project.status,
            'start_date': project.start_date,
            'end_date': project.end_date,
            'budget': project.budget,
            'hourly_rate': project.hourly_rate,
            'created_at': project.created_at,
            'updated_at': project.updated_at,
            'members': [],
            'technologies': [],
            'total_hours': 0,
            'total_invoiced': 0
        }
        return ProjectSchema(**project_dict)

    async def create_project(self, project_data: ProjectCreate) -> ProjectSchema:
        """Crear nuevo proyecto"""
        print(f"🔍 Datos recibidos: {project_data}")
        
        try:
            # Validaciones
            await self._validate_project_data(project_data)
            
            # IMPORTANTE: Excluir los campos de relaciones que no están en el modelo BD
            project_dict = project_data.model_dump(exclude={'member_ids', 'technology_ids'})
            print(f"🔍 Datos para BD: {project_dict}")
            
            # Crear proyecto usando el diccionario sin las relaciones
            project = await self.repository.create(project_dict)
            
            # TODO: Aquí después puedes manejar member_ids y technology_ids
            # if project_data.member_ids:
            #     # Asignar miembros al proyecto
            # if project_data.technology_ids:
            #     # Asignar tecnologías al proyecto
            
            print(f"✅ Proyecto creado: {project}")
            
            return self._build_project_schema(project)
            
        except Exception as e:
            print(f"❌ Error en create_project: {e}")
            print(f"❌ Tipo de error: {type(e)}")
            raise

    async def search_projects(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> ProjectList:
        """Buscar proyectos con filtros"""
        projects, total = await self.repository.search_projects(
            search=search or "",
            status=status,
            skip=skip,
            limit=limit
        )
        
        project_schemas = []
        for project in projects:
            project_schemas.append(self._build_project_schema(project))
        
        return ProjectList(total=total, projects=project_schemas)

    async def get_project_with_details(self, project_id: int) -> Optional[ProjectSchema]:
        """Obtener proyecto con detalles"""
        project = await self.repository.get_by_id_with_relations(project_id)
        if not project:
            return None
        
        return self._build_project_schema(project)

    async def update_project(self, project_id: int, project_data: ProjectUpdate) -> Optional[ProjectSchema]:
        """Actualizar proyecto"""
        existing_project = await self.repository.get_by_id(project_id)
        if not existing_project:
            raise NotFoundException("Proyecto no encontrado")
        
        # Excluir campos de relaciones también en el update
        update_dict = project_data.model_dump(exclude_unset=True, exclude={'member_ids', 'technology_ids'})
        updated_project = await self.repository.update(project_id, update_dict)
        
        return self._build_project_schema(updated_project)

    async def delete_project(self, project_id: int) -> bool:
        """Eliminar proyecto"""
        project = await self.repository.get_by_id(project_id)
        if not project:
            raise NotFoundException("Proyecto no encontrado")
        
        return await self.repository.delete(project_id)

    async def _validate_project_data(self, project_data: ProjectCreate):
        """Validaciones del dominio"""
        if project_data.start_date and project_data.end_date:
            if project_data.start_date >= project_data.end_date:
                raise ValidationException("La fecha de inicio debe ser anterior a la fecha de fin")
        
        if project_data.budget and project_data.budget < 0:
            raise ValidationException("El presupuesto no puede ser negativo")