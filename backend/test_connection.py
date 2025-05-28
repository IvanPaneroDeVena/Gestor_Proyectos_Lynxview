import asyncio
import asyncpg

async def test_connection():
    try:
        # Intenta conectar directamente con asyncpg
        conn = await asyncpg.connect(
            user='postgres',
            password='1234',  # CAMBIA ESTO
            database='lynxview_db',
            host='localhost',
            port=5432
        )
        print("✅ Conexión exitosa!")
        await conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

asyncio.run(test_connection())