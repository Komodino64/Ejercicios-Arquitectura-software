# 🧪 PRUEBAS DE API - Imperial Luxury Cars

## 📋 Guía Completa de Testing de API REST

---

## 🔧 CONFIGURACIÓN INICIAL

### Variables de Entorno
```bash
# URL base del backend
API_URL=http://localhost:5000/api

# Token JWT (obtener después del login)
TOKEN=tu_token_jwt_aqui
```

---

## 🔐 1. AUTENTICACIÓN (Auth Endpoints)

### 1.1 Registrar Usuario
```bash
# PowerShell
$body = @{
    email = "usuario@test.com"
    password = "Test123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

```bash
# Curl (Git Bash / Linux)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "Test123456"
  }'
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "65d1234567890abcdef12345",
    "email": "usuario@test.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores Posibles**:
- 400: Email inválido o password débil
- 409: Email ya registrado
- 429: Demasiados intentos (rate limit)

---

### 1.2 Login (Obtener Token JWT)
```bash
# PowerShell
$body = @{
    email = "admin@imperialluxury.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Guardar token en variable
$token = $response.token
Write-Host "Token: $token"
```

```bash
# Curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@imperialluxury.com",
    "password": "admin123"
  }'
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "65d1234567890abcdef12345",
    "email": "admin@imperialluxury.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDEyMzQ1Njc4OTBhYmNkZWYxMjM0NSIsImVtYWlsIjoiYWRtaW5AaW1wZXJpYWxsdXh1cnkuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA3NjY2NjY2LCJleHAiOjE3MDgyNzE0NjZ9.xyz..."
}
```

---

### 1.3 Verificar Token
```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify" `
    -Method GET `
    -Headers $headers
```

```bash
# Curl
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (200)**:
```json
{
  "valid": true,
  "user": {
    "id": "65d1234567890abcdef12345",
    "email": "admin@imperialluxury.com",
    "role": "admin"
  }
}
```

---

## 🚗 2. VEHÍCULOS (Cars Endpoints)

### 2.1 Listar Todos los Vehículos (Público)
```bash
# PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/cars"
Write-Host "Total de vehículos:" $response.cars.Count
$response.cars | Select-Object brand, model, year, price, status | Format-Table
```

```bash
# Curl
curl http://localhost:5000/api/cars | jq .

# Ver solo cantidad
curl -s http://localhost:5000/api/cars | jq '.cars | length'

# Ver primeros 5
curl -s http://localhost:5000/api/cars | jq '.cars[:5]'
```

**Respuesta Exitosa (200)**:
```json
{
  "cars": [
    {
      "_id": "65d1a2b3c4d5e6f7g8h9i0j1",
      "brand": "Ferrari",
      "model": "F8 Tributo",
      "year": 2023,
      "price": 280000,
      "description": "Superdeportivo italiano con motor V8 biturbo...",
      "imageUrl": "https://res.cloudinary.com/...",
      "status": "Disponible",
      "ownerId": "65d1234567890abcdef12345",
      "ownerEmail": "admin@imperialluxury.com",
      "createdAt": "2026-02-10T12:00:00.000Z"
    },
    // ... más vehículos
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 31,
    "pages": 1
  }
}
```

**Query Parameters**:
```bash
# Paginación
curl "http://localhost:5000/api/cars?page=1&limit=10"

# Segunda página
curl "http://localhost:5000/api/cars?page=2&limit=10"
```

---

### 2.2 Ver Detalle de un Vehículo
```bash
# PowerShell
$carId = "65d1a2b3c4d5e6f7g8h9i0j1"
Invoke-RestMethod -Uri "http://localhost:5000/api/cars/$carId"
```

```bash
# Curl
curl http://localhost:5000/api/cars/65d1a2b3c4d5e6f7g8h9i0j1
```

**Respuesta Exitosa (200)**:
```json
{
  "_id": "65d1a2b3c4d5e6f7g8h9i0j1",
  "brand": "Ferrari",
  "model": "F8 Tributo",
  "year": 2023,
  "price": 280000,
  "description": "Superdeportivo italiano con motor V8 biturbo de 720 CV...",
  "imageUrl": "https://res.cloudinary.com/dkdoh6z8u/image/upload/v123/imperial/ferrari.jpg",
  "status": "Disponible",
  "ownerId": "65d1234567890abcdef12345",
  "ownerEmail": "admin@imperialluxury.com",
  "createdAt": "2026-02-10T12:00:00.000Z",
  "updatedAt": "2026-02-10T12:00:00.000Z"
}
```

**Errores**:
- 400: ID inválido
- 404: Vehículo no encontrado

---

### 2.3 Mis Vehículos (Requiere Auth)
```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/cars/my" `
    -Method GET `
    -Headers $headers
```

```bash
# Curl
curl http://localhost:5000/api/cars/my \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (200)**:
```json
[
  {
    "_id": "65d1a2b3c4d5e6f7g8h9i0j1",
    "brand": "BMW",
    "model": "M5 Competition",
    "year": 2024,
    "price": 125000,
    "status": "Disponible",
    "ownerId": "65d1234567890abcdef12345",
    "ownerEmail": "usuario@test.com"
  }
]
```

---

### 2.4 Crear Vehículo (Requiere Auth)
```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    brand = "Tesla"
    model = "Model S Plaid"
    year = 2024
    price = 135000
    description = "Sedán eléctrico de alto rendimiento con 1020 CV y 0-100 km/h en 2.1s"
    imageUrl = "https://res.cloudinary.com/demo/image/upload/tesla-model-s.jpg"
    status = "Disponible"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/cars" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"
```

```bash
# Curl
curl -X POST http://localhost:5000/api/cars \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Tesla",
    "model": "Model S Plaid",
    "year": 2024,
    "price": 135000,
    "description": "Sedán eléctrico de alto rendimiento",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/tesla.jpg",
    "status": "Disponible"
  }'
```

**Respuesta Exitosa (201)**:
```json
{
  "_id": "65d1x2x3x4x5x6x7x8x9x0x1",
  "brand": "Tesla",
  "model": "Model S Plaid",
  "year": 2024,
  "price": 135000,
  "description": "Sedán eléctrico de alto rendimiento...",
  "imageUrl": "https://res.cloudinary.com/...",
  "status": "Disponible",
  "ownerId": "65d1234567890abcdef12345",
  "ownerEmail": "usuario@test.com",
  "createdAt": "2026-02-11T16:30:00.000Z"
}
```

**Validaciones**:
- `brand`: Requerido, máx 50 caracteres
- `model`: Requerido, máx 50 caracteres
- `year`: Entero entre 1900 y 2027
- `price`: Número positivo
- `description`: Requerido, máx 2000 caracteres
- `imageUrl`: URL válida
- `status`: "Disponible", "Vendido" o "Reservado"

---

### 2.5 Actualizar Vehículo (Requiere Auth)
```bash
# PowerShell
$carId = "65d1x2x3x4x5x6x7x8x9x0x1"
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    price = 130000
    status = "Reservado"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/cars/$carId" `
    -Method PUT `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"
```

```bash
# Curl
curl -X PUT http://localhost:5000/api/cars/65d1x2x3x4x5x6x7x8x9x0x1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 130000,
    "status": "Reservado"
  }'
```

**Respuesta Exitosa (200)**:
```json
{
  "_id": "65d1x2x3x4x5x6x7x8x9x0x1",
  "brand": "Tesla",
  "model": "Model S Plaid",
  "year": 2024,
  "price": 130000,
  "status": "Reservado",
  "updatedAt": "2026-02-11T16:35:00.000Z"
}
```

**Permisos**:
- Solo el dueño puede editar su vehículo
- Admins pueden editar cualquier vehículo

---

### 2.6 Eliminar Vehículo (Requiere Auth)
```bash
# PowerShell
$carId = "65d1x2x3x4x5x6x7x8x9x0x1"
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/cars/$carId" `
    -Method DELETE `
    -Headers $headers
```

```bash
# Curl
curl -X DELETE http://localhost:5000/api/cars/65d1x2x3x4x5x6x7x8x9x0x1 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Vehículo eliminado exitosamente"
}
```

---

## 📧 3. CONTACTO (Contact Endpoint)

### 3.1 Enviar Mensaje de Contacto
```bash
# PowerShell
$body = @{
    name = "Juan Pérez"
    email = "juan@example.com"
    phone = "+57 300 1234567"
    message = "Me interesa el Ferrari F8 Tributo. ¿Está disponible para una prueba de manejo?"
    carId = "65d1a2b3c4d5e6f7g8h9i0j1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/contact" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

```bash
# Curl
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+57 300 1234567",
    "message": "Me interesa el Ferrari F8 Tributo",
    "carId": "65d1a2b3c4d5e6f7g8h9i0j1"
  }'
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Mensaje enviado exitosamente. Nos pondremos en contacto pronto.",
  "contactId": "65d2345678901bcdef234567"
}
```

**Validaciones**:
- `name`: Requerido, máx 100 caracteres
- `email`: Email válido
- `phone`: Máx 20 caracteres
- `message`: Requerido, máx 1000 caracteres
- `carId`: ObjectId válido (opcional)

---

## 📊 4. ESTADÍSTICAS (Admin Only)

### 4.1 Obtener Stats del Sistema
```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer $token"  # Token de admin
}

Invoke-RestMethod -Uri "http://localhost:5000/api/stats" `
    -Method GET `
    -Headers $headers
```

```bash
# Curl (requiere token de admin)
curl http://localhost:5000/api/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Respuesta Exitosa (200)**:
```json
{
  "totalCars": 31,
  "availableCars": 20,
  "reservedCars": 8,
  "soldCars": 3,
  "totalUsers": 15,
  "adminUsers": 1,
  "pendingMessages": 5
}
```

**Errores**:
- 401: No autenticado
- 403: No es administrador

---

## 🧪 5. PRUEBAS AUTOMATIZADAS

### Script PowerShell Completo
```powershell
# test-api.ps1
Write-Host "`n=== PRUEBAS API - IMPERIAL LUXURY CARS ===" -ForegroundColor Cyan

# 1. Test Health Check
Write-Host "`n[1/6] Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/"
    Write-Host "✅ Backend activo" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    exit 1
}

# 2. Test Login
Write-Host "`n[2/6] Login Admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@imperialluxury.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Error en login: $_" -ForegroundColor Red
    exit 1
}

# 3. Test Listar Vehículos
Write-Host "`n[3/6] Listar Vehículos..." -ForegroundColor Yellow
try {
    $cars = Invoke-RestMethod -Uri "http://localhost:5000/api/cars"
    Write-Host "✅ Total: $($cars.cars.Count) vehículos" -ForegroundColor Green
    
    # Mostrar primeros 3
    $cars.cars | Select-Object -First 3 | ForEach-Object {
        Write-Host "   - $($_.brand) $($_.model) ($($_.year)) - `$$($_.price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error listando vehículos: $_" -ForegroundColor Red
}

# 4. Test Crear Vehículo
Write-Host "`n[4/6] Crear Vehículo..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

$newCar = @{
    brand = "Aston Martin"
    model = "DB12"
    year = 2024
    price = 245000
    description = "Gran turismo británico con motor V8 biturbo de 680 CV"
    imageUrl = "https://res.cloudinary.com/demo/astonmartin-db12.jpg"
    status = "Disponible"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "http://localhost:5000/api/cars" `
        -Method POST `
        -Headers $headers `
        -Body $newCar `
        -ContentType "application/json"
    
    $createdId = $created._id
    Write-Host "✅ Vehículo creado: $($created.brand) $($created.model)" -ForegroundColor Green
    Write-Host "   ID: $createdId" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error creando vehículo: $_" -ForegroundColor Red
}

# 5. Test Actualizar Vehículo
Write-Host "`n[5/6] Actualizar Vehículo..." -ForegroundColor Yellow
$updateBody = @{
    price = 240000
    status = "Reservado"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/cars/$createdId" `
        -Method PUT `
        -Headers $headers `
        -Body $updateBody `
        -ContentType "application/json"
    
    Write-Host "✅ Vehículo actualizado: Precio `$$($updated.price), Estado: $($updated.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error actualizando: $_" -ForegroundColor Red
}

# 6. Test Eliminar Vehículo
Write-Host "`n[6/6] Eliminar Vehículo..." -ForegroundColor Yellow
try {
    $deleted = Invoke-RestMethod -Uri "http://localhost:5000/api/cars/$createdId" `
        -Method DELETE `
        -Headers $headers
    
    Write-Host "✅ $($deleted.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error eliminando: $_" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS COMPLETADAS ===" -ForegroundColor Cyan
```

**Ejecutar**:
```powershell
.\test-api.ps1
```

---

## 📦 6. COLECCIÓN POSTMAN

### Importar en Postman
Crea un archivo `Imperial-Luxury-Cars.postman_collection.json`:

```json
{
  "info": {
    "name": "Imperial Luxury Cars API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login Admin",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.collectionVariables.set('token', pm.response.json().token);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@imperialluxury.com\",\n  \"password\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{base_url}}/auth/login"
          }
        }
      ]
    },
    {
      "name": "Cars",
      "item": [
        {
          "name": "Get All Cars",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/cars"
          }
        },
        {
          "name": "Create Car",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"brand\": \"BMW\",\n  \"model\": \"M8 Competition\",\n  \"year\": 2024,\n  \"price\": 145000,\n  \"description\": \"Coupé de lujo con motor V8\",\n  \"imageUrl\": \"https://example.com/bmw-m8.jpg\",\n  \"status\": \"Disponible\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{base_url}}/cars"
          }
        }
      ]
    }
  ]
}
```

---

## 🔒 7. PRUEBAS DE SEGURIDAD

### 7.1 Rate Limiting
```bash
# Ejecutar 60 requests en 10 segundos
for ($i=1; $i -le 60; $i++) {
    Write-Host "Request $i"
    try {
        Invoke-RestMethod -Uri "http://localhost:5000/api/cars"
    } catch {
        Write-Host "❌ Bloqueado por rate limit en request $i" -ForegroundColor Red
        break
    }
}
```

**Resultado esperado**: Bloqueado después del request 50

---

### 7.2 NoSQL Injection (Intento bloqueado)
```bash
# Intento de bypass login con NoSQL injection
$maliciousBody = @{
    email = @{ '$gt' = "" }
    password = @{ '$gt' = "" }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $maliciousBody `
    -ContentType "application/json"
```

**Resultado esperado**: 400 Bad Request (bloqueado por sanitización)

---

### 7.3 JWT Expirado
```bash
# Usar token viejo (expirado)
$oldToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired_token"
$headers = @{
    "Authorization" = "Bearer $oldToken"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/cars/my" `
    -Method GET `
    -Headers $headers
```

**Resultado esperado**: 401 Unauthorized

---

## ✅ CHECKLIST DE PRUEBAS

Antes de presentar, ejecutar cada endpoint:

- [ ] GET  / (Health check)
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET  /api/auth/verify
- [ ] GET  /api/cars (listar)
- [ ] GET  /api/cars/:id (detalle)
- [ ] GET  /api/cars/my (mis vehículos)
- [ ] POST /api/cars (crear)
- [ ] PUT  /api/cars/:id (actualizar)
- [ ] DELETE /api/cars/:id (eliminar)
- [ ] POST /api/contact (mensaje)
- [ ] GET  /api/stats (admin)

---

**Guardar este archivo**: `docs\PRUEBAS_API.md`
