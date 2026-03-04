#!/bin/bash

# Shopping Project - Frontend Services Startup Script
# Bu script sadece Admin Web ve Customer Web servislerini başlatır

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Shopping Project - Starting Frontend   ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Proje kök dizini - scriptin bulunduğu yerden bir üst dizin
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Port değişkenleri
ADMIN_PORT=5173
WEB_PORT=5174

# Func: Check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Func: Kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}Port $1 zaten kullanımda, kapatılıyor...${NC}"
        lsof -Pi :$1 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Önce portları temizle
echo -e "${YELLOW}Portlar kontrol ediliyor...${NC}"
kill_port $ADMIN_PORT
kill_port $WEB_PORT
echo ""

# 1. Admin Web Başlatma (React + Vite)
echo -e "${GREEN}[1/2] Admin Web başlatılıyor (http://localhost:$ADMIN_PORT)...${NC}"
cd "$PROJECT_ROOT/src/Presentation/Admin"
pnpm dev --port $ADMIN_PORT &
ADMIN_PID=$!
echo "Admin PID: $ADMIN_PID"

# 2. Customer Web Başlatma (React + Vite)
echo -e "${GREEN}[2/2] Customer Web başlatılıyor (http://localhost:$WEB_PORT)...${NC}"
cd "$PROJECT_ROOT/src/Presentation/Web"
pnpm dev --port $WEB_PORT &
WEB_PID=$!
echo "Web PID: $WEB_PID"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Frontend servisleri başlatıldı!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "Servisler:"
echo -e "  Admin:   ${GREEN}http://localhost:$ADMIN_PORT${NC}"
echo -e "  Web:     ${GREEN}http://localhost:$WEB_PORT${NC}"
echo ""
echo "Durdurmak için: ./stop-frontend.sh"
echo ""

# PID'leri kaydet
echo "$ADMIN_PID" > /tmp/shopping_admin.pid
echo "$WEB_PID" > /tmp/shopping_web.pid

# Arka planda çalışmaya devam et
wait
