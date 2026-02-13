# 🚗 Imperial Luxury Cars

> Sistema completo de gestión y venta de vehículos de lujo con arquitectura moderna

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![.NET](https://img.shields.io/badge/.NET-6.0-purple)

## 📋 Descripción

Imperial Luxury Cars es una aplicación full-stack para la gestión y venta de vehículos de lujo. Incluye:
- **Aplicación Web** (localhost:8080) - Catálogo público + Panel admin
- **Aplicación de Escritorio** (localhost:9999) - .NET 6.0 con WebView2
- **API REST** (localhost:5000) - Backend Node.js/Express + MongoDB
- **15 Capas de Seguridad** - Rate limiting, JWT, Bcrypt, protección frontend

## ✨ Características

### 🌐 Frontend
- Catálogo de 31 vehículos de lujo ($78k - $3.2M)
- Búsqueda y filtros avanzados (marca, precio, año, estado)
- Sistema de autenticación (JWT)
- Panel de administración completo
- Protección anti-copia y anti-DevTools

### 🔐 Backend (Node.js/Express)
- API REST completa con validación
- 15 capas de seguridad activas
- MongoDB para persistencia
- Rate Limiting: 50 req/10min
- JWT con expiración de 7 días
- Bcrypt (12 rounds) para passwords

### 💻 App de Escritorio (.NET 6.0)
- Aplicación nativa de Windows
- WebView2 integrado
- Servidor HTTP local (puerto 9999)
- Sincronización automática con backend

## 🛠️ Tecnologías

- **Backend:** Node.js 18, Express, MongoDB, JWT, Bcrypt
- **Frontend:** HTML5, CSS3, JavaScript, Cloudinary
- **Desktop:** .NET 6.0, WPF, WebView2
- **DevOps:** Docker Compose, Nginx, PowerShell
- **Testing:** Artillery, k6, PowerShell scripts

## 🚀 Inicio Rápido

### Requisitos
- Docker Desktop
- Node.js 18+
- .NET 6.0 Runtime (para app de escritorio)

### Iniciar Sistema (3 comandos)

```powershell
# 1. Iniciar Docker
docker-compose up -d

# 2. Verificar (esperar 30 segundos)
docker ps

# 3. Abrir navegador
Start-Process "http://localhost:8080"
```

**Usuarios de prueba:**
- Admin: `admin@imperialluxury.com` / `Admin123!`
- User: `user@example.com` / `User123!`

## 📚 Documentación

### Guías Esenciales

| Documento | Descripción |
|-----------|-------------|
| [**INICIAR_SISTEMA.md**](INICIAR_SISTEMA.md) | Cómo prender el servidor (paso a paso) |
| [**MIGRACION_DISCO.md**](MIGRACION_DISCO.md) | Backup y reinstalación limpia |
| [**CLONAR_DISCO_COMPLETO.md**](CLONAR_DISCO_COMPLETO.md) | Clonar disco completo con Macrium |
| [**docs/PRESENTACION_PROYECTO.md**](docs/PRESENTACION_PROYECTO.md) | Guía para presentar el proyecto |
| [**docs/DEPLOY_COMPLETO.md**](docs/DEPLOY_COMPLETO.md) | Deployment en VPS |
| [**docs/PRUEBAS_API.md**](docs/PRUEBAS_API.md) | Pruebas de endpoints |
| [**docs/PRUEBAS_ESTRES.md**](docs/PRUEBAS_ESTRES.md) | Stress testing con Artillery/k6 |

### Scripts Útiles

```powershell
# Backup automático
.\backup-completo.ps1

# Pruebas API (9 tests)
.\test-api.ps1

# App de escritorio
.\run-desktop-app.ps1

# Pruebas de estrés
.\stress-test-simple.ps1
artillery run stress-test.yml
```

## 🏗️ Estructura del Proyecto

```
proyecto Arquitectura/
├── backend/              # API Node.js/Express
│   ├── server.js         # Servidor principal
│   ├── models/           # Modelos MongoDB
│   └── middleware/       # Autenticación y validación
├── public/               # Frontend (HTML/CSS/JS)
│   ├── index.html        # Catálogo público
│   ├── admin.html        # Panel administración
│   └── js/               # Lógica frontend
├── bin-desktop/          # App de escritorio .NET
│   ├── ImperialLuxuryCars.exe  # Ejecutable (66 MB)
│   └── wwwroot/          # Assets estáticos
├── docs/                 # Documentación
├── docker-compose.yml    # Orquestación Docker
├── test-api.ps1          # Script de pruebas
└── stress-test.yml       # Configuración Artillery
```

## 🐳 Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **Backend** | 5000 | API REST Node.js/Express |
| **Frontend** | 8080 | Nginx sirviendo HTML/CSS/JS |
| **MongoDB** | 27017 | Base de datos |
| **Desktop** | 9999 | App de escritorio (manual) |

## 🔐 Seguridad (15 Capas Activas)

### Backend
1. Helmet (headers seguros)
2. Rate Limiting (50 req/10min)
3. CORS configurado
4. JWT (7 días expiración)
5. Bcrypt (12 rounds)
6. Input Validation (express-validator)
7. NoSQL Injection Protection
8. Environment Variables (.env)
9. Error Handling centralizado
10. Logs de seguridad

### Frontend
11. DevTools blocking (producción)
12. Console hijacking
13. Right-click disabled
14. CSS anti-copy
15. Bypass localhost (desarrollo)

## 🧪 Testing

### Pruebas API
```powershell
# Ejecutar 9 tests automatizados
.\test-api.ps1

# Resultados esperados:
# ✅ Health Check
# ✅ Autenticación
# ✅ CRUD vehículos
# ✅ Estadísticas
```

### Pruebas de Estrés
```powershell
# Opción 1: Artillery (fácil)
npm install -g artillery
artillery run stress-test.yml

# Opción 2: Script PowerShell (sin instalar)
.\stress-test-simple.ps1 -Users 10 -RequestsPerUser 20
```

## 📊 Estado del Sistema

```powershell
# Ver contenedores Docker
docker ps

# Logs del backend
docker logs imperial-backend

# Verificar API
Invoke-RestMethod http://localhost:5000/

# Ver vehículos
Invoke-RestMethod http://localhost:5000/api/cars
```

## 🔄 Detener/Reiniciar

```powershell
# Detener Docker
docker-compose down

# Reiniciar todo
docker-compose down
docker-compose up -d

# Detener app de escritorio
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"} | Stop-Process -Force
```

## 🎓 Información Académica

**Proyecto:** Arquitectura de Software  
**Curso:** Ingeniería de Software  
**Año:** 2026  
**Tecnologías Core:** Node.js, Express, MongoDB, Docker, .NET 6.0

## 📞 Soporte

- **GitHub:** https://github.com/Komodino64/Ejercicios-Arquitectura-software
- **Issues:** Reportar problemas en GitHub Issues
- **Docs:** Consultar carpeta `docs/` para guías detalladas

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

**Última actualización:** Febrero 2026  
**Versión:** 2.0.0  
**Estado:** ✅ Producción
