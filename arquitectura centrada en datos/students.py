from fastapi import APIRouter
from database import get_connection

router = APIRouter()

# CREATE - POST /students?name={name}
@router.post("/students")
def create_student(name: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "INSERT INTO students (name) VALUES (%s)"
    cursor.execute(query, (name,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Estudiante creado correctamente"}

# READ - GET /students
@router.get("/students")
def read_students():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM students"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# UPDATE - PUT /students/{id}?name={name}
@router.put("/students/{id}")
def update_student(id: int, name: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "UPDATE students SET name = %s WHERE id = %s"
    cursor.execute(query, (name, id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Estudiante actualizado correctamente"}

# DELETE - DELETE /students/{id}
@router.delete("/students/{id}")
def delete_student_inseguro(id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "DELETE FROM students WHERE id = %s"
    cursor.execute(query, (id,))  
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Estudiante eliminado"}

