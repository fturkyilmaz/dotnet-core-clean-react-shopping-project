#!/usr/bin/env bash
set -e
FRONTEND=frontend/src/features
MOBILE=mobile/src/features
NAME=$1
PASCAL=$(echo "$NAME" | sed -r 's/(^|-)(\w)/\U\2/g')
LOWER=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')

BASE=src/Services/Catalog

echo "🚀 Generating feature: $PASCAL"

mkdir -p \
 $FRONTEND/$LOWER \
 $MOBILE/$LOWER \
 $BASE/Catalog.Domain/$PASCAL \
 $BASE/Catalog.Application/$PASCAL/Commands/Create$PASCAL \
 $BASE/Catalog.Application/$PASCAL/Queries \
 $BASE/Catalog.Infrastructure/Persistence/Configurations \
 $BASE/Catalog.API/Controllers \
 $BASE/Catalog.Tests/$PASCAL

render () {
  envsubst < "$1" > "$2"
}

export NAME=$PASCAL
export LOWER

render tools/templates/domain/Entity.cs.tpl \
 $BASE/Catalog.Domain/$PASCAL/${PASCAL}.cs

render tools/templates/application/CreateCommand.cs.tpl \
 $BASE/Catalog.Application/$PASCAL/Commands/Create$PASCAL/Create${PASCAL}Command.cs

render tools/templates/application/CreateHandler.cs.tpl \
 $BASE/Catalog.Application/$PASCAL/Commands/Create$PASCAL/Create${PASCAL}Handler.cs

render tools/templates/api/Controller.cs.tpl \
 $BASE/Catalog.API/Controllers/${PASCAL}sController.cs

render tools/templates/tests/Tests.cs.tpl \
 $BASE/Catalog.Tests/$PASCAL/Create${PASCAL}Tests.cs

render tools/templates/react/api.ts.tpl \
 $FRONTEND/$LOWER/api.ts

render tools/templates/react/List.tsx.tpl \
 $FRONTEND/$LOWER/${NAME}List.tsx

render tools/templates/react/Create.tsx.tpl \
 $FRONTEND/$LOWER/${NAME}Create.tsx

render tools/templates/react/routes.tsx.tpl \
 $FRONTEND/$LOWER/routes.tsx

render tools/templates/mobile/useFeature.ts.tpl \
 $MOBILE/$LOWER/use${NAME}s.ts

render tools/templates/mobile/Screen.tsx.tpl \
 $MOBILE/$LOWER/${NAME}Screen.tsx


echo "✅ $PASCAL feature generated"
