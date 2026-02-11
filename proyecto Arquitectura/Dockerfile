# ============================================
# 🐳 DOCKERFILE - Imperial Luxury Cars Backend
# ============================================

FROM node:20-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache curl

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY backend/package*.json ./

# Instalar dependencias de Node.js
RUN npm install --production

# Copiar código fuente del backend
COPY backend/ .

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Comando de inicio
CMD ["node", "server.js"]
