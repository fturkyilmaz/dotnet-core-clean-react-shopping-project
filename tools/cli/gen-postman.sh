#!/usr/bin/env bash
set -e

./export-swagger.sh
./swagger-to-postman.sh

echo "✅ Postman collection generated"
