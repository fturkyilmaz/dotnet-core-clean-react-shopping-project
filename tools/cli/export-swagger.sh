#!/usr/bin/env bash
set -e

echo "🔨 Building API..."
dotnet build src/Presentation/API

echo "📄 Exporting Swagger..."
dotnet tool run swagger tofile \
  src/Presentation/API/bin/Debug/net10.0/API.dll \
  v1 \
  tools/swagger/swagger.json

echo "✅ Swagger exported"


