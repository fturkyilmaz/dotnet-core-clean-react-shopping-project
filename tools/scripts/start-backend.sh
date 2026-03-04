#!/bin/bash

# Shopping Project - Backend Services Startup Script
# Bu script sadece API ve Gateway servislerini başlatır

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Shopping Project - Starting Backend    ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Proje kök dizini - scriptin bulunduğu yerden bir üst dizin
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Project Root: $PROJECT_ROOT"
echo ""

# Port değişkenleri
API_PORT=5000
GATEWAY_PORT=5092

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
kill_port $API_PORT
kill_port $GATEWAY_PORT
echo ""

# 1. API Başlatma (.NET with dotnet watch)
echo -e "${GREEN}[1/2] API başlatılıyor (http://localhost:$API_PORT)...${NC}"
cd "$PROJECT_ROOT/src/Presentation/API"
dotnet watch --urls "http://localhost:$API_PORT" &
API_PID=$!
echo "API PID: $API_PID"

# 2. Gateway Başlatma (.NET with dotnet watch)
echo -e "${GREEN}[2/2] Gateway başlatılıyor (http://localhost:$GATEWAY_PORT)...${NC}"
cd "$PROJECT_ROOT/src/Gateway"
dotnet watch --urls "http://localhost:$GATEWAY_PORT" &
GATEWAY_PID=$!
echo "Gateway PID: $GATEWAY_PID"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Backend servisleri başlatıldı!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "Servisler:"
echo -e "  API:     ${GREEN}http://localhost:$API_PORT${NC}"
echo -e "  Gateway: ${GREEN}http://localhost:$GATEWAY_PORT${NC}"
echo ""
echo "API Dokümantasyonu: http://localhost:$API_PORT/swagger"
echo ""
echo "Durdurmak için: ./stop-backend.sh"
echo ""

# PID'leri kaydet
echo "$API_PID" > /tmp/shopping_api.pid
echo "$GATEWAY_PID" > /tmp/shopping_gateway.pid

# Arka planda çalışmaya devam et
wait
