### Crear el entorno virtual

```bash
python -m venv venv
```
```cmd
venv\Scripts\activate
```

```cmd
deactivate
```

---

```cmd
pip install fastapi uvicorn mysql-connector-python python-dotenv
```

```cmd
pip freeze > requirements.txt
```

```cmd
pip install -r requirements.txt
```

---

```cmd
uvicorn main:app --reload
```