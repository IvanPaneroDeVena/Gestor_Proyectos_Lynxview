from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserList, User as UserSchema
from app.exceptions import NotFoundException, ValidationException

class UserService:
    def __init__(self, db: AsyncSession):
        self.repository = UserRepository(db)
        self.db = db

    async def search_users(
        self,
        search: Optional[str] = None,
        role: Optional[str] = None,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> UserList:
        """Buscar usuarios con filtros"""
        users, total = await self.repository.search_users(
            search=search or "",
            role=role,
            is_active=is_active,
            skip=skip,
            limit=limit
        )
        
        # Transformar a esquemas de respuesta
        user_schemas = [
            UserSchema(
                **user.__dict__,
                current_projects=[]  # TODO: Obtener proyectos actuales
            ) for user in users
        ]
        
        return UserList(total=total, users=user_schemas)

    async def create_user(self, user_data: UserCreate) -> UserSchema:
        """Crear nuevo usuario con validaciones"""
        print(f"🔍 Creando usuario: {user_data}")
        
        try:
            # Validaciones de negocio
            await self._validate_user_creation(user_data)
            
            # Preparar datos para BD (excluir password y agregar hashed_password)
            user_dict = user_data.model_dump(exclude={'password'})
            user_dict['hashed_password'] = f"hashed_{user_data.password}"  # TODO: Usar bcrypt en producción
            
            print(f"🔍 Datos para BD: {user_dict}")
            
            # Crear usuario
            user = await self.repository.create(user_dict)
            print(f"✅ Usuario creado: {user}")
            
            return UserSchema(
                **user.__dict__,
                current_projects=[]
            )
            
        except Exception as e:
            print(f"❌ Error en create_user: {e}")
            raise

    async def get_user_by_id(self, user_id: int) -> Optional[UserSchema]:
        """Obtener usuario por ID"""
        user = await self.repository.get_by_id(user_id)
        if not user:
            return None
        
        return UserSchema(
            **user.__dict__,
            current_projects=[]
        )

    async def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[UserSchema]:
        """Actualizar usuario con validaciones"""
        # Verificar que el usuario existe
        existing_user = await self.repository.get_by_id(user_id)
        if not existing_user:
            raise NotFoundException("Usuario no encontrado")
        
        # Validaciones de negocio
        await self._validate_user_update(user_id, user_data)
        
        # Preparar datos de actualización
        update_dict = user_data.model_dump(exclude_unset=True, exclude={'password'})
        if user_data.password:
            update_dict['hashed_password'] = f"hashed_{user_data.password}"
        
        # Actualizar
        updated_user = await self.repository.update(user_id, update_dict)
        
        return UserSchema(
            **updated_user.__dict__,
            current_projects=[]
        )

    async def delete_user(self, user_id: int) -> bool:
        """Eliminar usuario"""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuario no encontrado")
        
        return await self.repository.delete(user_id)

    async def get_users_by_role(self, role: str) -> List[UserSchema]:
        """Obtener usuarios activos por rol"""
        users = await self.repository.get_active_users_by_role(role)
        return [
            UserSchema(
                **user.__dict__,
                current_projects=[]
            ) for user in users
        ]

    # Métodos privados para validaciones
    async def _validate_user_creation(self, user_data: UserCreate):
        """Validaciones para creación de usuario"""
        # Verificar email único
        existing_email = await self.repository.get_by_email(user_data.email)
        if existing_email:
            raise ValidationException("El email ya está en uso")
        
        # Verificar username único
        existing_username = await self.repository.get_by_username(user_data.username)
        if existing_username:
            raise ValidationException("El username ya está en uso")

    async def _validate_user_update(self, user_id: int, user_data: UserUpdate):
        """Validaciones para actualización de usuario"""
        if user_data.email:
            existing = await self.repository.get_by_email(user_data.email)
            if existing and existing.id != user_id:
                raise ValidationException("El email ya está en uso")
        
        if user_data.username:
            existing = await self.repository.get_by_username(user_data.username)
            if existing and existing.id != user_id:
                raise ValidationException("El username ya está en uso")