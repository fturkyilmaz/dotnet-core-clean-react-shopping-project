#!/bin/bash

# Shopping Project - Mobile & Admin Services Startup Script
# Bu script sadece Admin Web ve Mobil App servislerini başlatır

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Shopping Project - Starting Admin & App${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Proje kök dizini - scriptin bulunduğu yerden bir üst dizin
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Port değişkenleri
ADMIN_PORT=5173

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
echo ""

# 1. Admin Web Başlatma (React + Vite)
echo -e "${GREEN}[1/2] Admin Web başlatılıyor (http://localhost:$ADMIN_PORT)...${NC}"
cd "$PROJECT_ROOT/src/Presentation/Admin"
pnpm dev --port $ADMIN_PORT &
ADMIN_PID=$!
echo "Admin PID: $ADMIN_PID"

# 2. App (React Native) Başlatma
echo -e "${GREEN}[2/2] App (React Native) başlatılıyor...${NC}"
cd "$PROJECT_ROOT/src/Presentation/App"
pnpm start &
APP_PID=$!
echo "App (Metro) PID: $APP_PID"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Admin & App servisleri başlatıldı!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "Servisler:"
echo -e "  Admin: ${GREEN}http://localhost:$ADMIN_PORT${NC}"
echo -e "  App:   ${GREEN}Metro Bundler (ayrı terminalde)${NC}"
echo ""
echo "Durdurmak için: ./stop-mobile-admin.sh"
echo ""

# PID'leri kaydet
echo "$ADMIN_PID" > /tmp/shopping_admin.pid
echo "$APP_PID" > /tmp/shopping_app.pid

# Arka planda çalışmaya devam et
wait
