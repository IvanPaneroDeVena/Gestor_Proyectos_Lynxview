from sqlalchemy import create_engine
from app.db.base import Base
# Importar todos los modelos desde __init__.py
from app.models import *

# Usa psycopg2 normal en lugar de asyncpg
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/lynxview_db"

def init_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")

if __name__ == "__main__":
    init_db()