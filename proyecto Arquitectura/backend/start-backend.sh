#!/bin/bash
# ============================================
# 🚀 SCRIPT INICIO - Backend Imperial Luxury
# ============================================
# Para ejecutar en la VM Linux
# ============================================

echo ""
echo "========================================"
echo "🚗 Imperial Luxury Cars - Backend"
echo "========================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ir al directorio del backend
cd ~/imperial-backend || {
    echo -e "${RED}❌ Error: Directorio backend no encontrado${NC}"
    exit 1
}

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

# Verificar que MongoDB esté corriendo
if ! systemctl is-active --quiet mongod; then
    echo -e "${YELLOW}⚠️  MongoDB no está corriendo. Iniciando...${NC}"
    sudo systemctl start mongod
    sleep 2
fi

# Verificar archivos necesarios
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ server.js no encontrado${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Todo listo${NC}"
echo ""
echo "Iniciando servidor en puerto 5000..."
echo "Presiona Ctrl+C para detener"
echo ""
echo "========================================"
echo ""

# Iniciar servidor
node server.js
