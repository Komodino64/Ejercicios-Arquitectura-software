# =========================================
# PRUEBA DE ESTRES SIMPLE - PowerShell
# Imperial Luxury Cars
# =========================================

param(
    [int]$Users = 10,
    [int]$RequestsPerUser = 20,
    [string]$Url = "http://localhost:5000"
)

Write-Host "`n=== PRUEBA DE ESTRÉS SIMPLE ===" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "URL Base: $Url" -ForegroundColor White
Write-Host "Usuarios simulados: $Users" -ForegroundColor White
Write-Host "Requests por usuario: $RequestsPerUser" -ForegroundColor White
Write-Host "Total requests: $($Users * $RequestsPerUser)" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan

$results = @{
    Success = 0
    Failed = 0
    TotalTime = 0
    MinTime = [double]::MaxValue
    MaxTime = 0
    Times = @()
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "`nEjecutando pruebas..." -ForegroundColor Yellow

# Simular usuarios concurrentes
1..$Users | ForEach-Object -Parallel {
    $userNum = $_
    $localResults = @{Success=0; Failed=0; Times=@()}
    
    1..$using:RequestsPerUser | ForEach-Object {
        try {
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-RestMethod -Uri "$using:Url/api/cars" -Method GET -TimeoutSec 10 -ErrorAction Stop
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
    foreach($time in $_.Times) {
        $results.Times += $time
        $results.TotalTime += $time
        if ($time -lt $results.MinTime) { $results.MinTime = $time }
        if ($time -gt $results.MaxTime) { $results.MaxTime = $time }
    }
}

$stopwatch.Stop()

# Calcular estadísticas
$totalRequests = $results.Success + $results.Failed
$avgTime = if ($results.Success -gt 0) { $results.TotalTime / $results.Success } else { 0 }
$requestsPerSecond = if ($stopwatch.Elapsed.TotalSeconds -gt 0) { 
    $totalRequests / $stopwatch.Elapsed.TotalSeconds 
} else { 0 }

# Calcular percentiles
if ($results.Times.Count -gt 0) {
    $sortedTimes = $results.Times | Sort-Object
    $p50Index = [Math]::Floor($sortedTimes.Count * 0.5)
    $p95Index = [Math]::Floor($sortedTimes.Count * 0.95)
    $p99Index = [Math]::Floor($sortedTimes.Count * 0.99)
    
    $p50 = $sortedTimes[$p50Index]
    $p95 = $sortedTimes[$p95Index]
    $p99 = $sortedTimes[$p99Index]
} else {
    $p50 = 0
    $p95 = 0
    $p99 = 0
}

# Mostrar resultados
Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "          RESULTADOS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`nTiempo de Ejecución:" -ForegroundColor Cyan
Write-Host "  Total: $([math]::Round($stopwatch.Elapsed.TotalSeconds, 2))s" -ForegroundColor White
Write-Host "  Promedio por request: $([math]::Round($stopwatch.Elapsed.TotalMilliseconds / $totalRequests, 2))ms" -ForegroundColor White

Write-Host "`nRequests:" -ForegroundColor Cyan
Write-Host "  Total: $totalRequests" -ForegroundColor White
Write-Host "  Exitosos: $($results.Success) ($([math]::Round($results.Success/$totalRequests*100, 2))%)" -ForegroundColor Green
Write-Host "  Fallidos: $($results.Failed) ($([math]::Round($results.Failed/$totalRequests*100, 2))%)" -ForegroundColor $(if($results.Failed -gt 0){'Red'}else{'Green'})

Write-Host "`nTiempos de Respuesta:" -ForegroundColor Cyan
Write-Host "  Mínimo: $([math]::Round($results.MinTime, 2))ms" -ForegroundColor White
Write-Host "  Promedio: $([math]::Round($avgTime, 2))ms" -ForegroundColor White
Write-Host "  Máximo: $([math]::Round($results.MaxTime, 2))ms" -ForegroundColor White

Write-Host "`nPercentiles:" -ForegroundColor Cyan
Write-Host "  p50 (mediana): $([math]::Round($p50, 2))ms" -ForegroundColor White
Write-Host "  p95: $([math]::Round($p95, 2))ms" -ForegroundColor White
Write-Host "  p99: $([math]::Round($p99, 2))ms" -ForegroundColor White

Write-Host "`nRendimiento:" -ForegroundColor Cyan
Write-Host "  Requests/segundo: $([math]::Round($requestsPerSecond, 2))" -ForegroundColor White
Write-Host "  Throughput: $([math]::Round($requestsPerSecond * 60, 2)) requests/minuto" -ForegroundColor White

# Evaluación
Write-Host "`nEvaluación:" -ForegroundColor Cyan
if ($avgTime -lt 200) {
    Write-Host "  ✅ Excelente - Tiempos de respuesta < 200ms" -ForegroundColor Green
} elseif ($avgTime -lt 500) {
    Write-Host "  ✅ Bueno - Tiempos de respuesta < 500ms" -ForegroundColor Green
} elseif ($avgTime -lt 1000) {
    Write-Host "  ⚠️  Aceptable - Tiempos de respuesta < 1s" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ Lento - Tiempos de respuesta > 1s" -ForegroundColor Red
}

if ($results.Failed / $totalRequests -lt 0.01) {
    Write-Host "  ✅ Excelente - Tasa de error < 1%" -ForegroundColor Green
} elseif ($results.Failed / $totalRequests -lt 0.05) {
    Write-Host "  ⚠️  Aceptable - Tasa de error < 5%" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ Problemático - Tasa de error > 5%" -ForegroundColor Red
}

if ($requestsPerSecond -gt 100) {
    Write-Host "  ✅ Excelente throughput - > 100 req/s" -ForegroundColor Green
} elseif ($requestsPerSecond -gt 50) {
    Write-Host "  ✅ Buen throughput - > 50 req/s" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Throughput bajo - < 50 req/s" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "        PRUEBA COMPLETADA" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Guardar resultados en archivo
$reportFile = "stress-test-results-$(Get-Date -Format 'yyyy-MM-dd_HH-mm').txt"
@"
PRUEBA DE ESTRÉS - Imperial Luxury Cars
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

CONFIGURACIÓN:
- URL: $Url
- Usuarios: $Users
- Requests por usuario: $RequestsPerUser
- Total requests: $totalRequests

RESULTADOS:
- Tiempo total: $([math]::Round($stopwatch.Elapsed.TotalSeconds, 2))s
- Requests exitosos: $($results.Success) ($([math]::Round($results.Success/$totalRequests*100, 2))%)
- Requests fallidos: $($results.Failed) ($([math]::Round($results.Failed/$totalRequests*100, 2))%)

TIEMPOS:
- Mínimo: $([math]::Round($results.MinTime, 2))ms
- Promedio: $([math]::Round($avgTime, 2))ms
- Máximo: $([math]::Round($results.MaxTime, 2))ms
- p50: $([math]::Round($p50, 2))ms
- p95: $([math]::Round($p95, 2))ms
- p99: $([math]::Round($p99, 2))ms

RENDIMIENTO:
- Requests/segundo: $([math]::Round($requestsPerSecond, 2))
- Throughput: $([math]::Round($requestsPerSecond * 60, 2)) req/min
"@ | Out-File -FilePath $reportFile -Encoding UTF8

Write-Host "`nReporte guardado en: $reportFile" -ForegroundColor Cyan
