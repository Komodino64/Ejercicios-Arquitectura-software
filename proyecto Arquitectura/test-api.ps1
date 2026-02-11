# 🧪 SCRIPT RÁPIDO DE PRUEBAS API

Write-Host "`n=== 🧪 PRUEBAS API - IMPERIAL LUXURY CARS ===" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Función helper para tests
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Uri,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "[TEST] $Name..." -ForegroundColor Yellow
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ PASÓ" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "❌ FALLÓ: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Health Check
Write-Host "`n📡 1. HEALTH CHECK" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
$health = Test-Endpoint -Name "Backend Health" -Method GET -Uri "http://localhost:5000/"
if ($health) {
    Write-Host "   Respuesta: OK`n" -ForegroundColor Gray
}

# 2. Login
Write-Host "`n🔐 2. AUTENTICACIÓN" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
$loginBody = @{
    email = "admin@imperialluxury.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint -Name "Login Admin" -Method POST `
    -Uri "http://localhost:5000/api/auth/login" `
    -Body $loginBody

if ($loginResponse) {
    $token = $loginResponse.token
    Write-Host "   Usuario: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.user.role)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 30))...`n" -ForegroundColor Gray
}

# 3. Listar Vehículos
Write-Host "`n🚗 3. VEHÍCULOS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
$cars = Test-Endpoint -Name "Listar Vehículos" -Method GET -Uri "http://localhost:5000/api/cars"

if ($cars) {
    Write-Host "   Total: $($cars.cars.Count) vehículos" -ForegroundColor Gray
    Write-Host "`n   Top 5:" -ForegroundColor Gray
    $cars.cars | Select-Object -First 5 | ForEach-Object {
        Write-Host "   - $($_.brand) $($_.model) ($($_.year)) - `$$([int]$_.price)" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# 4. Ver Detalle
if ($cars -and $cars.cars.Count -gt 0) {
    $firstCarId = $cars.cars[0]._id
    $carDetail = Test-Endpoint -Name "Ver Detalle Vehículo" -Method GET `
        -Uri "http://localhost:5000/api/cars/$firstCarId"
    
    if ($carDetail) {
        Write-Host "   Detalles: $($carDetail.brand) $($carDetail.model)" -ForegroundColor Gray
        Write-Host "   Precio: `$$([int]$carDetail.price)" -ForegroundColor Gray
        Write-Host "   Estado: $($carDetail.status)`n" -ForegroundColor Gray
    }
}

# 5. Mis Vehículos (requiere auth)
if ($token) {
    Write-Host "`n👤 4. MIS VEHÍCULOS (Autenticado)" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $myCars = Test-Endpoint -Name "Mis Vehículos" -Method GET `
        -Uri "http://localhost:5000/api/cars/my" `
        -Headers $headers
    
    if ($myCars) {
        Write-Host "   Total: $($myCars.Count) vehículos propios`n" -ForegroundColor Gray
    }
}

# 6. Crear Vehículo (requiere auth)
if ($token) {
    Write-Host "`n➕ 5. CREAR VEHÍCULO" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $newCarBody = @{
        brand = "TEST_BMW"
        model = "M4 Competition"
        year = 2024
        price = 98000
        description = "Coupé deportivo de prueba API"
        imageUrl = "https://res.cloudinary.com/demo/test.jpg"
        status = "Disponible"
    } | ConvertTo-Json
    
    $newCar = Test-Endpoint -Name "Crear Vehículo de Prueba" -Method POST `
        -Uri "http://localhost:5000/api/cars" `
        -Headers $headers `
        -Body $newCarBody
    
    if ($newCar) {
        $testCarId = $newCar._id
        Write-Host "   ID: $testCarId" -ForegroundColor Gray
        Write-Host "   Creado: $($newCar.brand) $($newCar.model)`n" -ForegroundColor Gray
        
        # 7. Actualizar Vehículo
        Write-Host "`n✏️  6. ACTUALIZAR VEHÍCULO" -ForegroundColor Cyan
        Write-Host "================================" -ForegroundColor Cyan
        $updateBody = @{
            price = 95000
            status = "Reservado"
        } | ConvertTo-Json
        
        $updated = Test-Endpoint -Name "Actualizar Precio y Estado" -Method PUT `
            -Uri "http://localhost:5000/api/cars/$testCarId" `
            -Headers $headers `
            -Body $updateBody
        
        if ($updated) {
            Write-Host "   Nuevo precio: `$$([int]$updated.price)" -ForegroundColor Gray
            Write-Host "   Nuevo estado: $($updated.status)`n" -ForegroundColor Gray
        }
        
        # 8. Eliminar Vehículo
        Write-Host "`n🗑️  7. ELIMINAR VEHÍCULO" -ForegroundColor Cyan
        Write-Host "================================" -ForegroundColor Cyan
        $deleted = Test-Endpoint -Name "Eliminar Vehículo de Prueba" -Method DELETE `
            -Uri "http://localhost:5000/api/cars/$testCarId" `
            -Headers $headers
        
        if ($deleted) {
            Write-Host "   $($deleted.message)`n" -ForegroundColor Gray
        }
    }
}

# 9. Contacto
Write-Host "`n📧 8. CONTACTO" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
$contactBody = @{
    name = "Test Usuario"
    email = "test@example.com"
    phone = "+57 300 0000000"
    message = "Mensaje de prueba desde script de testing API"
} | ConvertTo-Json

$contact = Test-Endpoint -Name "Enviar Mensaje" -Method POST `
    -Uri "http://localhost:5000/api/contact" `
    -Body $contactBody

if ($contact) {
    Write-Host "   $($contact.message)`n" -ForegroundColor Gray
}

# 10. Stats (admin only)
if ($token) {
    Write-Host "`n📊 9. ESTADÍSTICAS (Admin)" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $stats = Test-Endpoint -Name "Obtener Stats" -Method GET `
        -Uri "http://localhost:5000/api/stats" `
        -Headers $headers
    
    if ($stats) {
        Write-Host "   Total Vehículos: $($stats.totalCars)" -ForegroundColor Gray
        Write-Host "   Disponibles: $($stats.availableCars)" -ForegroundColor Gray
        Write-Host "   Reservados: $($stats.reservedCars)" -ForegroundColor Gray
        Write-Host "   Vendidos: $($stats.soldCars)" -ForegroundColor Gray
        Write-Host "   Mensajes Pendientes: $($stats.pendingMessages)`n" -ForegroundColor Gray
    }
}

# Resumen
Write-Host "`n=== ✅ PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green
