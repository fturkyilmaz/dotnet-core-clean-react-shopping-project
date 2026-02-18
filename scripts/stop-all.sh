#!/bin/bash

# Shopping Project - Stop All Services Script
# Bu script tüm servisleri durdurur

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${YELLOW}  Shopping Project - Stopping Services   ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Scriptin bulunduğu dizin
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f /tmp/shopping_api.pid ]; then
    API_PID=$(cat /tmp/shopping_api.pid)
    if ps -p $API_PID > /dev/null 2>&1; then
        echo -e "${RED}API (PID: $API_PID) durduruluyor...${NC}"
        kill $API_PID 2>/dev/null
    fi
    rm /tmp/shopping_api.pid
fi

if [ -f /tmp/shopping_gateway.pid ]; then
    GATEWAY_PID=$(cat /tmp/shopping_gateway.pid)
    if ps -p $GATEWAY_PID > /dev/null 2>&1; then
        echo -e "${RED}Gateway (PID: $GATEWAY_PID) durduruluyor...${NC}"
        kill $GATEWAY_PID 2>/dev/null
    fi
    rm /tmp/shopping_gateway.pid
fi

if [ -f /tmp/shopping_admin.pid ]; then
    ADMIN_PID=$(cat /tmp/shopping_admin.pid)
    if ps -p $ADMIN_PID > /dev/null 2>&1; then
        echo -e "${RED}Admin (PID: $ADMIN_PID) durduruluyor...${NC}"
        kill $ADMIN_PID 2>/dev/null
    fi
    rm /tmp/shopping_admin.pid
fi

if [ -f /tmp/shopping_web.pid ]; then
    WEB_PID=$(cat /tmp/shopping_web.pid)
    if ps -p $WEB_PID > /dev/null 2>&1; then
        echo -e "${RED}Web (PID: $WEB_PID) durduruluyor...${NC}"
        kill $WEB_PID 2>/dev/null
    fi
    rm /tmp/shopping_web.pid
fi

if [ -f /tmp/shopping_app.pid ]; then
    APP_PID=$(cat /tmp/shopping_app.pid)
    if ps -p $APP_PID > /dev/null 2>&1; then
        echo -e "${RED}App/Metro (PID: $APP_PID) durduruluyor...${NC}"
        kill $APP_PID 2>/dev/null
    fi
    rm /tmp/shopping_app.pid
fi

# Port'ları temizle
echo ""
echo -e "${YELLOW}Portlar temizleniyor...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null
lsof -ti:5092 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null
lsof -ti:8081 | xargs kill -9 2>/dev/null

echo ""
echo -e "${GREEN}Tüm servisler durduruldu!${NC}"
echo ""
