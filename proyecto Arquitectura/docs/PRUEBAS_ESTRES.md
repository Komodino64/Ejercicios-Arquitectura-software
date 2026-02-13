# 🔥 PRUEBAS DE ESTRÉS - Imperial Luxury Cars

## Herramientas Recomendadas para Pruebas de Carga

Esta guía te muestra cómo hacer pruebas de estrés para validar el rendimiento del sistema.

---

## 🎯 ¿QUÉ SON LAS PRUEBAS DE ESTRÉS?

Las pruebas de estrés simulan **muchos usuarios simultáneos** usando tu aplicación para encontrar:
- ⚡ Límites de capacidad
- 🐛 Errores bajo carga alta
- 📊 Cuellos de botella de rendimiento
- 💾 Leaks de memoria
- ⏱️ Tiempos de respuesta

---

## 🛠️ HERRAMIENTAS RECOMENDADAS

### 1️⃣ **ARTILLERY** ⭐ RECOMENDADO (Más Fácil)

**Por qué Artillery:**
- ✅ Fácil de instalar (npm)
- ✅ Configuración con YAML simple
- ✅ Reportes visuales automáticos
- ✅ Pensado para APIs REST
- ✅ Gratis y open source

**Instalación:**
```powershell
npm install -g artillery
```

**Verificar:**
```powershell
artillery --version
```

---

### 2️⃣ **K6** (Grafana) - Profesional

**Por qué k6:**
- ✅ Scripts en JavaScript
- ✅ Métricas muy detalladas
- ✅ Integración con Grafana
- ✅ Cloud testing disponible

**Instalación:**
```powershell
# Con Chocolatey
choco install k6

# O descargar de: https://k6.io/docs/get-started/installation/
```

---

### 3️⃣ **APACHE BENCH (ab)** - Clásico

**Por qué ab:**
- ✅ Muy rápido
- ✅ Simple (1 comando)
- ✅ Viene con Apache

**Instalación:**
```powershell
# Descargar Apache para Windows
# https://www.apachelounge.com/download/
```

---

### 4️⃣ **LOCUST** - Python

**Por qué Locust:**
- ✅ Scripts en Python
- ✅ UI web interactiva
- ✅ Distribuido (múltiples máquinas)

**Instalación:**
```powershell
pip install locust
```

---

## 🚀 MÉTODO 1: ARTILLERY (RECOMENDADO)

### Instalación Completa

```powershell
# 1. Instalar Artillery globalmente
npm install -g artillery

# 2. Verificar instalación
artillery --version

# 3. Verificar que funcione
artillery quick --count 10 --num 20 http://localhost:5000/
```

### Script de Pruebas Básicas

He creado el archivo `stress-test.yml` para ti (ver abajo).

**Ejecutar pruebas:**
```powershell
# Ir a la carpeta del proyecto
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# Ejecutar prueba de estrés
artillery run stress-test.yml

# O generar reporte HTML
artillery run --output report.json stress-test.yml
artillery report report.json
```

---

## 📝 ARCHIVO: stress-test.yml

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Sustained load"
    - duration: 60
      arrivalRate: 20
      name: "High load"
  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "Test API Endpoints"
    flow:
      # 1. Health Check
      - get:
          url: "/"
          expect:
            - statusCode: 200
      
      # 2. Listar vehículos
      - get:
          url: "/api/cars"
          expect:
            - statusCode: 200
            - contentType: json
      
      # 3. Ver detalle de un vehículo
      - get:
          url: "/api/cars/{{ $randomString() }}"
          expect:
            - statusCode: [200, 404]
      
      # 4. Login
      - post:
          url: "/api/auth/login"
          json:
            email: "admin@imperialluxury.com"
            password: "Admin123!"
          capture:
            - json: "$.token"
              as: "authToken"
      
      # 5. Listar mis vehículos (autenticado)
      - get:
          url: "/api/cars/my"
          headers:
            Authorization: "Bearer {{ authToken }}"
          ifTrue: "authToken"
      
      # 6. Enviar contacto
      - post:
          url: "/api/contact"
          json:
            name: "Test User {{ $randomString() }}"
            email: "test{{ $randomNumber(1000,9999) }}@test.com"
            phone: "555-{{ $randomNumber(1000,9999) }}"
            message: "Mensaje de prueba de estrés"
      
      # Pensar 1-3 segundos (simular usuario real)
      - think: 1-3
```

---

## 🎮 MÉTODO 2: K6 (AVANZADO)

### Script de Pruebas con k6

He creado el archivo `stress-test-k6.js` (ver abajo).

**Ejecutar pruebas:**
```powershell
k6 run stress-test-k6.js

# O con más usuarios
k6 run --vus 50 --duration 2m stress-test-k6.js
```

---

## 📝 ARCHIVO: stress-test-k6.js

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up a 10 usuarios
    { duration: '1m', target: 20 },   // Mantener 20 usuarios
    { duration: '30s', target: 50 },  // Subir a 50 usuarios
    { duration: '1m', target: 50 },   // Mantener 50 usuarios
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests < 500ms
    http_req_failed: ['rate<0.1'],    // Menos del 10% de fallos
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // 1. Health Check
  let res = http.get(`${BASE_URL}/`);
  check(res, { 'health check OK': (r) => r.status === 200 });

  // 2. Listar vehículos
  res = http.get(`${BASE_URL}/api/cars`);
  check(res, { 
    'cars list OK': (r) => r.status === 200,
    'cars is array': (r) => Array.isArray(r.json())
  });

  sleep(1);

  // 3. Login
  const loginPayload = JSON.stringify({
    email: 'admin@imperialluxury.com',
    password: 'Admin123!'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);
  check(res, { 'login OK': (r) => r.status === 200 });

  const authToken = res.json('token');

  sleep(1);

  // 4. Mis vehículos (autenticado)
  if (authToken) {
    params.headers.Authorization = `Bearer ${authToken}`;
    res = http.get(`${BASE_URL}/api/cars/my`, params);
    check(res, { 'my cars OK': (r) => r.status === 200 });
  }

  sleep(2);

  // 5. Contacto
  const contactPayload = JSON.stringify({
    name: `Test User ${Date.now()}`,
    email: `test${Date.now()}@test.com`,
    phone: '555-1234',
    message: 'Prueba de estrés k6'
  });

  res = http.post(`${BASE_URL}/api/contact`, contactPayload, {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'contact OK': (r) => r.status === 201 });

  sleep(1);
}
```

---

## ⚡ MÉTODO 3: SCRIPT POWERSHELL RÁPIDO

He creado `stress-test-simple.ps1` (ver abajo).

**Ejecutar:**
```powershell
.\stress-test-simple.ps1
```

---

## 📝 ARCHIVO: stress-test-simple.ps1

```powershell
# =========================================
# PRUEBA DE ESTRES SIMPLE - PowerShell
# =========================================

param(
    [int]$Users = 10,
    [int]$RequestsPerUser = 20,
    [string]$Url = "http://localhost:5000"
)

Write-Host "`n=== PRUEBA DE ESTRÉS SIMPLE ===" -ForegroundColor Cyan
Write-Host "URL: $Url" -ForegroundColor White
Write-Host "Usuarios simulados: $Users" -ForegroundColor White
Write-Host "Requests por usuario: $RequestsPerUser" -ForegroundColor White
Write-Host "Total requests: $($Users * $RequestsPerUser)`n" -ForegroundColor Yellow

$results = @{
    Success = 0
    Failed = 0
    TotalTime = 0
    MinTime = [double]::MaxValue
    MaxTime = 0
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

# Simular usuarios concurrentes
1..$Users | ForEach-Object -Parallel {
    $userNum = $_
    $localResults = @{Success=0; Failed=0; Times=@()}
    
    1..$using:RequestsPerUser | ForEach-Object {
        try {
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-RestMethod -Uri "$using:Url/api/cars" -Method GET -TimeoutSec 10
            $sw.Stop()
            
            $localResults.Success++
            $localResults.Times += $sw.ElapsedMilliseconds
        } catch {
            $localResults.Failed++
        }
    }
    
    return $localResults
} -ThrottleLimit $Users | ForEach-Object {
    $results.Success += $_.Success
    $results.Failed += $_.Failed
    $_.Times | ForEach-Object {
        $results.TotalTime += $_
        if ($_ -lt $results.MinTime) { $results.MinTime = $_ }
        if ($_ -gt $results.MaxTime) { $results.MaxTime = $_ }
    }
}

$stopwatch.Stop()

# Calcular estadísticas
$totalRequests = $results.Success + $results.Failed
$avgTime = if ($results.Success -gt 0) { $results.TotalTime / $results.Success } else { 0 }
$requestsPerSecond = if ($stopwatch.Elapsed.TotalSeconds -gt 0) { 
    $totalRequests / $stopwatch.Elapsed.TotalSeconds 
} else { 0 }

# Mostrar resultados
Write-Host "`n=== RESULTADOS ===" -ForegroundColor Green
Write-Host "Tiempo total: $([math]::Round($stopwatch.Elapsed.TotalSeconds, 2))s" -ForegroundColor White
Write-Host "Requests exitosos: $($results.Success) ($([math]::Round($results.Success/$totalRequests*100, 2))%)" -ForegroundColor Green
Write-Host "Requests fallidos: $($results.Failed) ($([math]::Round($results.Failed/$totalRequests*100, 2))%)" -ForegroundColor $(if($results.Failed -gt 0){'Red'}else{'Green'})
Write-Host "`nTiempos de respuesta:" -ForegroundColor Cyan
Write-Host "  Mínimo: $([math]::Round($results.MinTime, 2))ms" -ForegroundColor White
Write-Host "  Máximo: $([math]::Round($results.MaxTime, 2))ms" -ForegroundColor White
Write-Host "  Promedio: $([math]::Round($avgTime, 2))ms" -ForegroundColor White
Write-Host "`nRendimiento:" -ForegroundColor Cyan
Write-Host "  Requests/segundo: $([math]::Round($requestsPerSecond, 2))" -ForegroundColor White
Write-Host "`n======================================" -ForegroundColor Green
```

---

## 📊 INTERPRETANDO RESULTADOS

### Métricas Importantes:

**Tiempos de Respuesta:**
- ✅ Excelente: < 200ms
- ✅ Bueno: 200-500ms
- ⚠️ Aceptable: 500-1000ms
- ❌ Lento: > 1000ms

**Tasa de Error:**
- ✅ Excelente: < 1%
- ⚠️ Aceptable: 1-5%
- ❌ Problemático: > 5%

**Requests por Segundo:**
- ✅ Bueno: > 100 req/s
- ⚠️ Aceptable: 50-100 req/s
- ❌ Lento: < 50 req/s

---

## 🎯 ESCENARIOS DE PRUEBA RECOMENDADOS

### 1. Prueba Básica (10 usuarios)
```powershell
artillery quick --count 10 --num 50 http://localhost:5000/api/cars
```

### 2. Prueba Media (50 usuarios)
```powershell
artillery run stress-test.yml
```

### 3. Prueba Intensa (100+ usuarios)
```powershell
k6 run --vus 100 --duration 2m stress-test-k6.js
```

### 4. Prueba de Límite (hasta fallar)
```powershell
# Ir subiendo usuarios hasta encontrar el límite
.\stress-test-simple.ps1 -Users 100 -RequestsPerUser 50
```

---

## 🔍 QUÉ BUSCAR EN LOS RESULTADOS

### 1. **Rate Limiting Funciona**
Si haces > 50 requests en 10 minutos desde la misma IP:
```
❌ Error 429: Too Many Requests
```
✅ Esto es BUENO - significa que tu protección funciona

### 2. **Tiempos de Respuesta**
```
p50: 150ms  ← 50% de requests
p95: 300ms  ← 95% de requests  
p99: 500ms  ← 99% de requests
```
✅ Si p95 < 500ms = Excelente rendimiento

### 3. **Errores**
```
http_req_failed: 2.5%
```
⚠️ Si > 5% = Investigar logs del backend

### 4. **Memoria**
```powershell
# Monitorear Docker durante las pruebas
docker stats imperial-backend
```
⚠️ Si memoria sube constantemente = Memory leak

---

## 🚦 PLAN DE PRUEBAS COMPLETO

### Día 1: Pruebas Básicas
```powershell
# 1. Verificar que sistema está corriendo
docker ps

# 2. Prueba rápida (1 minuto)
artillery quick --count 5 --num 20 http://localhost:5000/

# 3. Ver logs del backend
docker logs imperial-backend --tail 50
```

### Día 2: Pruebas Medias
```powershell
# 1. Limpiar logs
docker restart imperial-backend

# 2. Ejecutar prueba completa
artillery run stress-test.yml

# 3. Analizar reporte
artillery report report.json
```

### Día 3: Pruebas Intensas
```powershell
# 1. Monitorear recursos
docker stats

# 2. Ejecutar prueba intensa (otra terminal)
k6 run --vus 100 --duration 3m stress-test-k6.js

# 3. Verificar si el sistema sobrevive
curl http://localhost:5000/
```

---

## 📦 INSTALACIÓN RÁPIDA (TODO EN UNO)

```powershell
# 1. Instalar Artillery (más fácil)
npm install -g artillery

# 2. Verificar
artillery --version

# 3. Prueba rápida inmediata
artillery quick --count 10 --num 30 http://localhost:5000/api/cars

# Listo! Ya tienes pruebas de estrés funcionando
```

---

## 🎬 EJEMPLOS DE USO

### Ejemplo 1: Prueba Rápida (30 segundos)
```powershell
artillery quick --duration 30 --rate 10 http://localhost:5000/
```

### Ejemplo 2: Probar Endpoint Específico
```powershell
artillery quick --count 20 --num 50 http://localhost:5000/api/cars
```

### Ejemplo 3: Prueba con Reporte HTML
```powershell
artillery run --output results.json stress-test.yml
artillery report results.json --output report.html
Start-Process report.html
```

### Ejemplo 4: Probar Rate Limiting
```powershell
# Hacer > 50 requests en 10 min para activar rate limit
.\stress-test-simple.ps1 -Users 1 -RequestsPerUser 60
```

---

## 🛡️ ESPERADOS CON RATE LIMITING ACTIVO

Tu backend tiene **Rate Limiting: 50 requests/10min por IP**

**Comportamiento esperado:**
```powershell
# Request 1-50: ✅ 200 OK
# Request 51+:  ❌ 429 Too Many Requests
```

**Mensaje esperado:**
```json
{
  "message": "Demasiadas peticiones, intenta más tarde"
}
```

✅ **Esto es correcto** - tu seguridad está funcionando.

---

## 📚 DOCUMENTACIÓN ADICIONAL

**Artillery:**
- Docs: https://www.artillery.io/docs
- Ejemplos: https://github.com/artilleryio/artillery-examples

**k6:**
- Docs: https://k6.io/docs/
- Ejemplos: https://k6.io/docs/examples/

**Locust:**
- Docs: https://docs.locust.io/

---

## ✅ RESUMEN: ¿QUÉ DESCARGAR?

### OPCIÓN 1: Fácil y Rápido (RECOMENDADO)
```powershell
npm install -g artillery
```

### OPCIÓN 2: Profesional
```powershell
# Descargar k6: https://k6.io/docs/get-started/installation/
```

### OPCIÓN 3: No instalar nada
```powershell
# Usar el script PowerShell que he creado
.\stress-test-simple.ps1
```

---

**Mi Recomendación:** Empieza con **Artillery** (1 comando, 2 minutos de setup) 🚀

Última actualización: Febrero 2026
