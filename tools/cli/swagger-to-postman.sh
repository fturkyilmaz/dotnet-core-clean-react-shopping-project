#!/usr/bin/env bash
set -e

SWAGGER_FILE="tools/swagger/swagger.json"
POSTMAN_DIR="tools/postman"
COLLECTION_FILE="$POSTMAN_DIR/ShoppingProject.postman_collection.json"

if [ ! -f "$SWAGGER_FILE" ]; then
  echo "❌ Swagger file not found: $SWAGGER_FILE"
  exit 1
fi

mkdir -p "$POSTMAN_DIR"

echo "🔄 Converting Swagger → Postman..."

openapi-to-postmanv2 \
  -s "$SWAGGER_FILE" \
  -o "$COLLECTION_FILE" \
  -p

echo "✅ Postman collection generated:"
echo "   $COLLECTION_FILE"
