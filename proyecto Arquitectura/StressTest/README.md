# 🔥 Imperial Stress Test - Ejecutable C# (.exe)

## ✅ Herramienta Segura de Prueba de Estrés

**ImperialStressTest.exe** es un programa C# profesional y seguro para probar el rendimiento de Imperial Luxury Cars API.

---

## 📥 INSTALACIÓN

### Requisito: .NET 6.0 SDK

**Descargar .NET SDK:**
- 🌐 https://dotnet.microsoft.com/download/dotnet/6.0
- Selecciona: **SDK x64** para Windows
- Instala normalmente (Next, Next, Finish)

### Verificar instalación:
```bash
dotnet --version
# Debe mostrar: 6.0.x o superior
```

---

## 🔨 COMPILAR EL .EXE

### Opción 1: Script Automático (Recomendado)
```bash
# Doble click en:
compilar-stress-test.bat
```

### Opción 2: Manual (PowerShell/CMD)
```bash
cd StressTest
dotnet restore
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true
```

El ejecutable estará en:
```
StressTest\bin\Release\net6.0\win-x64\publish\ImperialStressTest.exe
```

---

## 🚀 EJECUTAR

### Uso Básico (localhost):
```bash
# Doble click en:
ImperialStressTest.exe
```

### Con IP Custom:
```bash
ImperialStressTest.exe http://192.168.1.5:5000
```

---

## 📊 QUÉ HACE

El ejecutable realiza:

1. **100 requests** concurrentes a `GET /`
2. **100 requests** concurrentes a `GET /api/cars`

### Métricas Medidas:
- ⏱️ Tiempo de respuesta (promedio, min, max)
- 📈 Requests por segundo
- ✅ Tasa de éxito
- 🚫 Rate limiting (429 responses)
- 📊 Distribución de códigos HTTP

### Resultados Esperados:
- **Primeros 50 requests**: ✅ 200 OK
- **Requests 51-100**: 🚫 429 Too Many Requests
- **Score**: 50-60% (el rate limiting está funcionando correctamente)

---

## 🛡️ ES SEGURO?

### ✅ SÍ, Es 100% Seguro

**Código abierto:** Todo el código está en `StressTest/Program.cs`

**No hace:**
- ❌ NO accede a internet (solo localhost o IPs privadas)
- ❌ NO instala nada en el sistema
- ❌ NO modifica archivos
- ❌ NO accede a datos personales
- ❌ NO tiene backdoors ni malware

**Solo hace:**
- ✅ Envía requests HTTP a la URL especificada
- ✅ Mide tiempos de respuesta
- ✅ Muestra estadísticas en consola
- ✅ Se cierra al terminar

### Verificación Antivirus:
```bash
# Escanear con Windows Defender:
# Click derecho en ImperialStressTest.exe -> Analizar con Windows Defender
```

**Windows Defender puede marcar warning**: Esto es NORMAL para ejecutables compilados localmente sin firma digital. Es falso positivo.

---

## 📋 ESTRUCTURA DEL CÓDIGO

```
StressTest/
├── Program.cs                 # Código principal (C#)
├── ImperialStressTest.csproj  # Configuración del proyecto
└── bin/Release/               # Ejecutable compilado
```

### Código Principal (Program.cs):
```csharp
// 1. Hace requests HTTP concurrentes
var tasks = new List<Task<RequestResult>>();
for (int i = 0; i < NUM_REQUESTS; i++)
{
    tasks.Add(MakeRequest(url, "GET"));
}
results = await Task.WhenAll(tasks);

// 2. Analiza resultados
int successful = results.Count(r => r.Success);
double avgDuration = results.Average(r => r.Duration);
```

**SIN código malicioso, SIN ofuscación, TODO visible.**

---

## 🎯 CASOS DE USO

### 1. Prueba antes de demo:
```bash
ImperialStressTest.exe
```
Verificar que el API aguanta carga

### 2. Prueba en red local:
```bash
ImperialStressTest.exe http://192.168.1.5:5000
```
Probar desde otra PC en la red

### 3. Validar rate limiting:
```bash
ImperialStressTest.exe
```
Confirmar que el rate limiting bloquea después de 50 requests

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### "No se puede abrir la aplicación"
**Causa:** Windows Defender bloquea ejecutables no firmados

**Solución:**
1. Click derecho en `ImperialStressTest.exe`
2. Propiedades
3. ✅ "Desbloquear" (abajo)
4. Aplicar → OK

### ".NET no está instalado"
**Solución:**
```bash
# Instala .NET 6.0 SDK:
https://dotnet.microsoft.com/download/dotnet/6.0
```

### "No se puede conectar"
**Verificar:**
```bash
docker compose ps
# Todos deben estar "Up" y "healthy"
```

---

## 📈 EJEMPLO DE SALIDA

```
═══════════════════════════════════════════
  🔥 IMPERIAL LUXURY CARS - STRESS TEST
═══════════════════════════════════════════

🎯 API URL: http://localhost:5000
📊 Requests: 100 concurrentes por endpoint
⏱️  Timeout: 30 segundos

⚡ Testeando: GET /api/cars
   Enviando 100 requests...

✅ RESULTADOS:
   ⏱️  Tiempo total: 1234ms
   📈 Requests/segundo: 81.03
   ✔️  Exitosos: 50/100 (50.0%)
   ❌ Fallidos: 0/100
   🚫 Rate Limited (429): 50/100

   ⏱️  Duración promedio: 23.45ms
   ⚡ Duración mínima: 12ms
   🐌 Duración máxima: 89ms

   📊 Códigos de estado:
      ✅ 200 (OK): 50 (50.0%)
      🚫  429 (Too Many Requests): 50 (50.0%)

   ⚠️  REGULAR: Rate limiting funcionando (esto es esperado)
```

---

## 🔐 SEGURIDAD

### Firma Digital (Opcional):
Si quieres firmar el ejecutable para evitar warnings:

```powershell
# Necesitas un certificado de código
signtool sign /f MyCert.pfx /p password ImperialStressTest.exe
```

### Incluir en Antivirus Excepciones:
```
Windows Defender > Configuración > Exclusiones
Agregar: ImperialStressTest.exe
```

---

## ✅ RESUMEN

- 🔨 **Compilar**: `compilar-stress-test.bat`
- 🚀 **Ejecutar**: `ImperialStressTest.exe`
- 🛡️ **Seguro**: Código abierto, sin malware
- 📊 **Útil**: Valida rate limiting y performance
- 💻 **Portable**: Un solo .exe, sin instalación

**El ejecutable está listo para distribuir y usar sin riesgos.** ✅
