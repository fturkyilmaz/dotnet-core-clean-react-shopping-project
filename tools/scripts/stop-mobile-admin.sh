#!/bin/bash

# Shopping Project - Stop Mobile & Admin Services Script
# Bu script sadece Admin Web ve Mobil App servislerini durdurur

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Shopping Project - Stopping Admin & App${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Func: Stop process by PID file
stop_service() {
    local name=$1
    local pid_file=$2

    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        if kill -0 $PID >/dev/null 2>&1; then
            echo -e "${YELLOW}$name (PID: $PID) durduruluyor...${NC}"
            kill -9 $PID
            rm -f "$pid_file"
            echo -e "${GREEN}$name durduruldu.${NC}"
        else
            echo -e "${YELLOW}$name zaten çalışmıyor.${NC}"
            rm -f "$pid_file"
        fi
    else
        echo -e "${YELLOW}$name için PID dosyası bulunamadı.${NC}"
    fi
}

# Admin Web durdur
stop_service "Admin Web" "/tmp/shopping_admin.pid"

# App (React Native Metro) durdur
stop_service "App (Metro)" "/tmp/shopping_app.pid"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Admin & App servisleri durduruldu.${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
