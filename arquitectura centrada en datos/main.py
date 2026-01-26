from fastapi import FastAPI
import students   # importa directamente el archivo students.py

app = FastAPI()

# Registrar rutas
app.include_router(students.router)