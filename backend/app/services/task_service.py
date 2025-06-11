from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.task_repository import TaskRepository
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task import (
    TaskCreate, 
    TaskUpdate, 
    TaskList, 
    Task as TaskSchema,
    ProjectInfo,
    UserInfo
)
from app.exceptions import NotFoundException, ValidationException

class TaskService:
    def __init__(self, db: AsyncSession):
        self.repository = TaskRepository(db)
        self.db = db

    async def search_tasks(
        self,
        project_id: Optional[int] = None,
        assignee_id: Optional[int] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> TaskList:
        """Buscar tareas con filtros y relaciones"""
        tasks, total = await self.repository.get_tasks_with_relations(
            project_id=project_id,
            assignee_id=assignee_id,
            status=status,
            priority=priority,
            search=search or "",
            skip=skip,
            limit=limit
        )
        
        # Transformar a esquemas con relaciones
        task_schemas = []
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
            
            task_schemas.append(TaskSchema(**task_dict))
        
        return TaskList(total=total, tasks=task_schemas)

    async def create_task(self, task_data: TaskCreate) -> TaskSchema:
        """Crear nueva tarea con validaciones"""
        print(f"🔍 Creando tarea: {task_data}")
        
        try:
            # Validaciones de negocio
            await self._validate_task_creation(task_data)
            
            # Preparar datos para BD
            task_dict = task_data.model_dump()
            
            # Obtener el primer usuario como creador temporal
            # TODO: En producción usar el usuario autenticado
            first_user = await self.db.execute(select(User).limit(1))
            creator = first_user.scalar_one_or_none()
            if creator:
                task_dict['created_by_id'] = creator.id
            
            print(f"🔍 Datos para BD: {task_dict}")
            
            # Crear tarea
            task = await self.repository.create(task_dict)
            print(f"✅ Tarea creada: {task}")
            
            # Cargar relaciones para la respuesta
            task_with_relations = await self.repository.get_by_id_with_relations(task.id)
            
            return self._build_task_schema(task_with_relations)
            
        except Exception as e:
            print(f"❌ Error en create_task: {e}")
            raise

    async def get_task_by_id(self, task_id: int) -> Optional[TaskSchema]:
        """Obtener tarea por ID con relaciones"""
        task = await self.repository.get_by_id_with_relations(task_id)
        if not task:
            return None
        
        return self._build_task_schema(task)

    async def update_task(self, task_id: int, task_data: TaskUpdate) -> Optional[TaskSchema]:
        """Actualizar tarea con validaciones"""
        # Verificar que la tarea existe
        existing_task = await self.repository.get_by_id(task_id)
        if not existing_task:
            raise NotFoundException("Tarea no encontrada")
        
        # Validaciones de negocio
        await self._validate_task_update(task_id, task_data)
        
        # Actualizar
        update_dict = task_data.model_dump(exclude_unset=True)
        updated_task = await self.repository.update(task_id, update_dict)
        
        # Cargar relaciones para respuesta
        task_with_relations = await self.repository.get_by_id_with_relations(task_id)
        
        return self._build_task_schema(task_with_relations)

    async def delete_task(self, task_id: int) -> bool:
        """Eliminar tarea"""
        task = await self.repository.get_by_id(task_id)
        if not task:
            raise NotFoundException("Tarea no encontrada")
        
        return await self.repository.delete(task_id)

    async def get_project_tasks(self, project_id: int, skip: int = 0, limit: int = 100) -> TaskList:
        """Obtener todas las tareas de un proyecto específico"""
        return await self.search_tasks(project_id=project_id, skip=skip, limit=limit)

    async def get_user_tasks(self, user_id: int, skip: int = 0, limit: int = 100) -> TaskList:
        """Obtener todas las tareas asignadas a un usuario"""
        return await self.search_tasks(assignee_id=user_id, skip=skip, limit=limit)

    async def get_overdue_tasks(self) -> List[TaskSchema]:
        """Obtener tareas vencidas"""
        tasks = await self.repository.get_overdue_tasks()
        return [self._build_task_schema(task) for task in tasks]

    # Métodos privados para validaciones y construcción
    async def _validate_task_creation(self, task_data: TaskCreate):
        """Validaciones para creación de tarea"""
        # Verificar que el proyecto existe
        project_result = await self.db.execute(
            select(Project).where(Project.id == task_data.project_id)
        )
        if not project_result.scalar_one_or_none():
            raise NotFoundException("Proyecto no encontrado")
        
        # Verificar que el usuario existe (si se asigna)
        if task_data.assignee_id:
            user_result = await self.db.execute(
                select(User).where(User.id == task_data.assignee_id)
            )
            if not user_result.scalar_one_or_none():
                raise NotFoundException("Usuario asignado no encontrado")

    async def _validate_task_update(self, task_id: int, task_data: TaskUpdate):
        """Validaciones para actualización de tarea"""
        update_data = task_data.model_dump(exclude_unset=True)
        
        # Verificar proyecto si se cambia
        if 'project_id' in update_data:
            project_result = await self.db.execute(
                select(Project).where(Project.id == update_data['project_id'])
            )
            if not project_result.scalar_one_or_none():
                raise NotFoundException("Proyecto no encontrado")
        
        # Verificar usuario si se cambia
        if 'assignee_id' in update_data and update_data['assignee_id']:
            user_result = await self.db.execute(
                select(User).where(User.id == update_data['assignee_id'])
            )
            if not user_result.scalar_one_or_none():
                raise NotFoundException("Usuario asignado no encontrado")

    def _build_task_schema(self, task: Task) -> TaskSchema:
        """Construir schema de tarea con relaciones"""
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
        
        return TaskSchema(**task_dict)