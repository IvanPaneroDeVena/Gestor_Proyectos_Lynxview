from pydantic_settings import BaseSettings
from typing import List
import secrets

class Settings(BaseSettings):
    # Nombre del proyecto
    PROJECT_NAME: str = "LynxView"
    API_V1_STR: str = "/api/v1"
    
    # Entorno
    ENVIRONMENT: str = "development"
    
    # Seguridad
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días
    
    # Base de datos
    DATABASE_URL: str = "postgresql+asyncpg://postgres:WakamoleMerequetengue@localhost:5432/lynxview_db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Email (para futuro uso)
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = ""
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""
    EMAILS_FROM_NAME: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()