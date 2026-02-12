# 💿 CLONAR DISCO COMPLETO - GUÍA PASO A PASO

## Migrar TODO tu Sistema Windows + Proyecto

Si quieres pasar **todo tu sistema completo** (Windows, programas instalados, configuraciones, archivos personales, y el proyecto) a un disco nuevo, la mejor opción es **clonar el disco**.

---

## 🎯 ¿QUÉ ES CLONAR UN DISCO?

**Clonar** = Copiar EXACTAMENTE todo lo que hay en un disco a otro disco.

### ✅ Ventajas de Clonar:
- ✅ No pierdes NADA (Windows, programas, configuraciones, archivos)
- ✅ No necesitas reinstalar Windows
- ✅ No necesitas reinstalar programas (Git, Node.js, Docker, VS Code)
- ✅ El proyecto queda funcionando tal cual
- ✅ Tus configuraciones personales se mantienen
- ✅ Proceso más rápido (1-3 horas vs 5-8 horas reinstalando todo)

### ⚠️ Requisitos:
- Disco nuevo de **igual o mayor capacidad** que el viejo
- Adaptador/Cable para conectar ambos discos simultáneamente
- O USB externo para hacer imagen del disco

---

## 🛠️ MÉTODO 1: MACRIUM REFLECT FREE (RECOMENDADO)

**Más fácil y confiable para usuarios no técnicos**

### Paso 1: Descargar Macrium Reflect

1. Ir a: https://www.macrium.com/reflectfree
2. Descargar **Macrium Reflect 8 Free Edition**
3. Instalar (siguiente, siguiente, finalizar)

### Paso 2: Conectar el Disco Nuevo

**Opción A: Disco interno (necesitas abrir el PC)**
- Conecta el disco nuevo por cable SATA
- Conecta el cable de alimentación

**Opción B: Disco externo/USB**
- Conecta el disco nuevo por USB con adaptador

### Paso 3: Clonar el Disco

```plaintext
1. Abrir Macrium Reflect
2. En la lista de discos, selecciona tu disco ACTUAL (donde está Windows)
3. Click en "Clone this disk..."
4. Selecciona el disco NUEVO como destino
5. Click en "Next"
6. Revisar que todo está correcto
7. Click en "Finish"
8. Click en "Continue" para empezar
```

**Tiempo estimado:** 1-3 horas (depende del tamaño y velocidad)

### Paso 4: Cambiar el Disco de Arranque

```plaintext
1. Apagar PC completamente
2. Desconectar disco viejo (o dejarlo como respaldo)
3. Conectar disco nuevo en el mismo puerto
4. Encender PC
5. Entrar al BIOS/UEFI (tecla Del, F2, F12, o Esc al iniciar)
6. En Boot Order, poner el disco nuevo como primero
7. Guardar y salir (F10)
8. Windows arrancará normalmente desde el disco nuevo
```

### Paso 5: Verificar que Todo Funciona

```powershell
# Abrir PowerShell y verificar el proyecto
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# Ver estado de Docker
docker ps

# Iniciar todo si no está corriendo
docker-compose up -d

# Probar
.\test-api.ps1

# Abrir app de escritorio
.\run-desktop-app.ps1
```

**¡Listo! Todo debería funcionar exactamente igual que antes.**

---

## 🛠️ MÉTODO 2: CLONEZILLA (GRATIS, MÁS TÉCNICO)

**Para usuarios con conocimientos técnicos**

### Paso 1: Descargar Clonezilla

1. Ir a: https://clonezilla.org/downloads.php
2. Descargar **Clonezilla Live (ISO)**
3. Crear USB booteable con Rufus: https://rufus.ie/

### Paso 2: Arrancar desde USB de Clonezilla

```plaintext
1. Conectar disco nuevo al PC
2. Insertar USB de Clonezilla
3. Reiniciar PC
4. Entrar al menú de arranque (F12, F8, o Esc)
5. Seleccionar el USB
6. Arrancar Clonezilla
```

### Paso 3: Clonar Disco

```plaintext
Selecciones en Clonezilla:
1. device-device → Work directly from a disk or partition to a disk or partition
2. Beginner mode
3. disk_to_local_disk → Clone local disk to local disk
4. Seleccionar disco ORIGEN (viejo)
5. Seleccionar disco DESTINO (nuevo)
6. Skip checking → No check (más rápido)
7. Confirm y esperar
```

**Tiempo estimado:** 1-2 horas

### Paso 4: Cambiar Disco y Arrancar

Igual que el Método 1 Paso 4.

---

## 🛠️ MÉTODO 3: WINDOWS BACKUP (NATIVO)

**Integrado en Windows 10/11**

### Paso 1: Crear Imagen del Sistema

```plaintext
1. Panel de Control → Sistema y seguridad
2. Copia de seguridad y restauración (Windows 7)
3. Click en "Crear una imagen del sistema"
4. Seleccionar destino (disco externo o partición)
5. Seleccionar unidades a incluir (C:)
6. Click en "Iniciar copia de seguridad"
```

**Tiempo:** 1-4 horas

### Paso 2: Crear Disco de Recuperación

```plaintext
1. En la misma ventana → "Crear un disco de reparación del sistema"
2. Insertar CD/DVD o crear USB de recuperación
3. Seguir asistente
```

### Paso 3: Restaurar en Disco Nuevo

```plaintext
1. Instalar disco nuevo
2. Arrancar desde disco de recuperación
3. Elegir "Restaurar imagen del sistema"
4. Seleccionar la imagen creada
5. Confirmar y esperar
```

---

## 💡 MÉTODO 4: SOFTWARE COMERCIAL

### EaseUS Todo Backup (Gratis con límites)
- URL: https://www.easeus.com/backup-software/
- Interfaz muy fácil
- Wizard guiado paso a paso

### Acronis True Image (Pago)
- URL: https://www.acronis.com/
- Más profesional
- Soporte técnico incluido

---

## 📊 COMPARACIÓN DE MÉTODOS

| Método | Dificultad | Tiempo | Costo | Recomendado Para |
|--------|-----------|--------|-------|------------------|
| **Macrium Reflect** | ⭐⭐ Fácil | 1-3h | Gratis | **Todos** |
| **Clonezilla** | ⭐⭐⭐⭐ Difícil | 1-2h | Gratis | Usuarios avanzados |
| **Windows Backup** | ⭐⭐⭐ Medio | 2-4h | Gratis | Windows nativos |
| **EaseUS** | ⭐ Muy fácil | 1-3h | Gratis/Pago | Principiantes |
| **Acronis** | ⭐ Muy fácil | 1-2h | Pago ($50) | Profesionales |

---

## ⚡ CUÁL MÉTODO ELEGIR

### Elige MACRIUM REFLECT si:
- ✅ Quieres algo fácil y gratis
- ✅ Es tu primera vez clonando discos
- ✅ Tienes Windows 10/11
- ✅ Prefieres interfaz gráfica

### Elige CLONEZILLA si:
- ✅ Tienes conocimientos técnicos
- ✅ Te sientes cómodo con Linux/terminal
- ✅ Quieres control total del proceso
- ✅ Necesitas clonar múltiples discos

### Elige WINDOWS BACKUP si:
- ✅ No quieres instalar software externo
- ✅ Tienes disco externo para imagen
- ✅ Prefieres soluciones nativas de Windows

---

## 🔍 VALIDACIÓN DESPUÉS DE CLONAR

```powershell
# 1. Verificar que Windows arrancó correctamente
Write-Host "Windows Version: $((Get-CimInstance Win32_OperatingSystem).Caption)"

# 2. Verificar espacio en disco
Get-PSDrive C | Select-Object Used,Free

# 3. Verificar que Git está instalado
git --version

# 4. Verificar Node.js
node --version

# 5. Verificar Docker
docker --version

# 6. Ir al proyecto
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# 7. Ver estado de Docker
docker ps

# 8. Si Docker no está corriendo, iniciarlo
docker-compose up -d
Start-Sleep -Seconds 30

# 9. Probar proyecto
.\test-api.ps1

# 10. Abrir app de escritorio
.\run-desktop-app.ps1
```

**Si todo funciona:** ✅ Clonación exitosa

---

## ⚠️ PRECAUCIONES IMPORTANTES

### ANTES de Clonar:

```powershell
# 1. Hacer backup adicional del proyecto (por si acaso)
.\backup-completo.ps1

# 2. Copiar backup a USB externo
# (Por si algo sale mal con el clonado)

# 3. Asegurar que GitHub tiene todo actualizado
cd "C:\arquitectura-software-main\proyecto Arquitectura"
git status
git push
```

### Durante el Clonado:

- ⚠️ **NO interrumpas el proceso** (puede corromper datos)
- ⚠️ **NO apagues el PC** mientras clona
- ⚠️ **Asegura buena energía** (laptop enchufada)
- ⚠️ **Ten paciencia** (1-3 horas es normal)

### Después del Clonado:

- ✅ **NO borres el disco viejo** hasta confirmar que todo funciona
- ✅ **Guarda el disco viejo** como respaldo por 1-2 semanas
- ✅ **Verifica TODO** antes de formatear el viejo

---

## 🆚 CLONAR vs REINSTALAR DESDE CERO

### 📀 Clonar Disco (Recomendado)

**Ventajas:**
- ✅ Rápido (1-3 horas)
- ✅ Todo queda igual
- ✅ No pierdes configuraciones
- ✅ Programas ya instalados
- ✅ Proyecto sigue funcionando

**Desventajas:**
- ⚠️ Copia también archivos innecesarios/basura
- ⚠️ Puede copiar errores del sistema viejo

**Cuándo usar:**
- Sistema actual funciona bien
- No tienes problemas de rendimiento
- Quieres la solución más rápida

---

### 🔧 Reinstalar desde Cero

**Ventajas:**
- ✅ Sistema limpio y fresco
- ✅ No copias errores/virus
- ✅ Mejor rendimiento
- ✅ Aprendes a configurar todo

**Desventajas:**
- ❌ Lento (5-8 horas total)
- ❌ Reinstalar todos los programas
- ❌ Reconfigurar todo
- ❌ Posibles errores al configurar

**Cuándo usar:**
- Sistema actual tiene problemas
- Windows está lento/corrupto
- Quieres empezar limpio
- Tienes tiempo disponible

---

## 📝 CHECKLIST COMPLETO

### ANTES DE EMPEZAR:

- [ ] Backup del proyecto (`.\backup-completo.ps1`)
- [ ] Backup copiado a USB externo
- [ ] GitHub actualizado (`git push`)
- [ ] Disco nuevo comprado (igual o mayor capacidad)
- [ ] Macrium Reflect descargado e instalado
- [ ] PC enchufado (no usar con batería)

### DURANTE EL PROCESO:

- [ ] Disco nuevo conectado y detectado
- [ ] Macrium Reflect abierto
- [ ] Disco correcto seleccionado como origen
- [ ] Disco nuevo seleccionado como destino
- [ ] Proceso de clonado iniciado
- [ ] Esperar pacientemente (1-3 horas)

### DESPUÉS DEL CLONADO:

- [ ] PC apagado completamente
- [ ] Disco viejo desconectado (opcional)
- [ ] Disco nuevo conectado como principal
- [ ] BIOS configurado (Boot Order)
- [ ] Windows arrancó correctamente
- [ ] Verificado: Git funciona (`git --version`)
- [ ] Verificado: Node.js funciona (`node --version`)
- [ ] Verificado: Docker funciona (`docker ps`)
- [ ] Docker containers iniciados (`docker-compose up -d`)
- [ ] Proyecto probado (`.\test-api.ps1`)
- [ ] App de escritorio funciona (`.\run-desktop-app.ps1`)
- [ ] Navegador abre: http://localhost:8080
- [ ] TODO FUNCIONA ✅

### LIMPIEZA FINAL (después de 1-2 semanas):

- [ ] Confirmar que todo funciona perfectamente
- [ ] Formatear disco viejo (opcional)
- [ ] O guardar disco viejo como respaldo permanente

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Disco nuevo no detectado"

**Soluciones:**
```plaintext
1. Verificar conexiones SATA/USB
2. Ir a Administrador de Discos (Windows + X → Disk Management)
3. Inicializar disco si aparece como "No inicializado"
4. Crear partición GPT o MBR (según tu sistema)
```

---

### Problema 2: "Windows no arranca desde disco nuevo"

**Soluciones:**
```plaintext
1. Entrar al BIOS (Del/F2/F12 al iniciar)
2. Verificar Boot Order
3. Poner disco nuevo como primero
4. Si falla, crear USB de recuperación de Windows
5. Reparar el arranque desde USB de recuperación
```

---

### Problema 3: "El clonado se queda atascado"

**Soluciones:**
```plaintext
1. Verificar que ambos discos estén bien conectados
2. Cerrar otros programas durante el clonado
3. Desactivar antivirus temporalmente
4. Reintentar el proceso
5. Probar con otro software (Clonezilla)
```

---

### Problema 4: "Docker no funciona después de clonar"

**Soluciones:**
```powershell
# Reiniciar Docker Desktop
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Esperar 1 minuto
Start-Sleep -Seconds 60

# Verificar
docker ps

# Si sigue sin funcionar, reiniciar WSL 2
wsl --shutdown
wsl
```

---

## 💾 TAMAÑO DE DISCOS RECOMENDADOS

| Disco Actual | Disco Nuevo Mínimo | Recomendado |
|--------------|-------------------|-------------|
| 256 GB | 256 GB | 512 GB |
| 512 GB | 512 GB | 1 TB |
| 1 TB | 1 TB | 2 TB |

**Tip:** Siempre mejor comprar disco MÁS GRANDE que el actual para tener espacio de crecimiento.

---

## 🔗 ENLACES ÚTILES

**Software de Clonado:**
- Macrium Reflect: https://www.macrium.com/reflectfree
- Clonezilla: https://clonezilla.org/
- EaseUS Todo: https://www.easeus.com/backup-software/
- Rufus (crear USB): https://rufus.ie/

**Guías de Video:**
- Buscar en YouTube: "How to clone hard drive Macrium Reflect"
- Buscar en YouTube: "Clonar disco duro Windows 10"

**Documentación del Proyecto:**
- Instalación limpia: `MIGRACION_DISCO.md`
- Backup automático: `backup-completo.ps1`
- Iniciar sistema: `INICIAR_SISTEMA.md`

---

## ⏱️ TIEMPO TOTAL ESTIMADO

### Opción A: Clonar Todo el Disco (RECOMENDADO)
```
1. Descargar Macrium:        10 min
2. Instalar Macrium:         5 min
3. Conectar disco nuevo:     10 min
4. Clonar disco:            1-3 horas
5. Cambiar disco físico:     15 min
6. Verificar en BIOS:        5 min
7. Arrancar Windows:         5 min
8. Verificar proyecto:       10 min
────────────────────────────────────
TOTAL:                      2-4 HORAS
```

### Opción B: Reinstalar desde Cero
```
1. Formatear e instalar Windows:  1-2 horas
2. Instalar drivers:              30 min
3. Instalar programas:            1 hora
4. Configurar Git/Docker:         30 min
5. Restaurar proyecto:            30 min
6. Reinstalar dependencias:       20 min
7. Verificar todo:                30 min
────────────────────────────────────────
TOTAL:                           4-6 HORAS
```

**Conclusión:** Clonar es 2-3 veces más rápido y más seguro ✅

---

## 🎯 RECOMENDACIÓN FINAL

**Para tu caso (proyecto + Docker + Node.js + Git):**

### 1️⃣ **Mejor Opción: CLONAR con Macrium Reflect**

```
✅ Ventajas:
- TODO queda funcionando (2-3 horas)
- No pierdes configuraciones de Docker
- Git mantiene credenciales
- VS Code mantiene extensiones
- Proyecto sigue funcionando inmediatamente

⚠️ Solo asegúrate de:
- Hacer backup adicional (.\backup-completo.ps1)
- Verificar que GitHub tiene todo (git push)
- No borrar disco viejo hasta confirmar que todo funciona
```

### 2️⃣ **Segunda Opción: Reinstalar Limpio (si quieres sistema fresco)**

```
✅ Usa esta opción si:
- Tu Windows actual está lento
- Tienes tiempo disponible (5-8 horas)
- Quieres sistema limpio sin basura
- Te gusta aprender configurando todo

📖 Sigue la guía: MIGRACION_DISCO.md
```

---

## 📞 ¿NECESITAS AYUDA?

**Durante el proceso, si algo falla:**

1. **NO formatees el disco viejo** hasta estar 100% seguro
2. **Revisa esta guía** desde el principio
3. **Busca el error en Google:** "Macrium Reflect [error exacto]"
4. **Usa el backup:** Si clonado falló, tienes backup del proyecto
5. **Reinstala limpio:** Última opción usando MIGRACION_DISCO.md

---

**¡Buena suerte con la migración! 💪**

_Recuerda: El disco viejo es tu respaldo. No lo borres hasta estar 100% seguro que todo funciona en el nuevo._

Última actualización: Febrero 2026
