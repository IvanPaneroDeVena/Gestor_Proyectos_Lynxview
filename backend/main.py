from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Importar routers
from app.api.endpoints import projects, users, technologies, tasks, invoices, timeEntries

# Configuración de la app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código de inicio (conectar a BD, etc.)
    print("Starting up...")
    yield
    # Código de cierre
    print("Shutting down...")

# Crear instancia de FastAPI
app = FastAPI(
    title="LynxView Backend API",
    description="API para el sistema de gestión de proyectos",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS para permitir requests desde Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de tu frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta de prueba
@app.get("/")
async def root():
    return {"message": "Welcome to LynxView API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Incluir routers
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(technologies.router, prefix="/api/technologies", tags=["technologies"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])
app.include_router(timeEntries.router, prefix="/api/time-entries", tags=["time_entries"])
