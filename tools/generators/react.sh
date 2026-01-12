#!/usr/bin/env bash
set -e

# ================================
# CONFIG
# ================================
FEATURE_NAME=$1

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Feature name required"
  echo "Usage: ./tools/cli/gen react Product"
  exit 1
fi

# ================================
# HELPERS
# ================================
LOWER=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]')
UPPER=$(echo "$FEATURE_NAME" | tr '[:lower:]' '[:upper:]')
BASE_DIR="src/features/$LOWER"

render() {
  TEMPLATE=$1
  TARGET=$2

  mkdir -p "$(dirname "$TARGET")"

  sed \
    -e "s/{{NAME}}/$FEATURE_NAME/g" \
    -e "s/{{LOWER}}/$LOWER/g" \
    -e "s/{{UPPER}}/$UPPER/g" \
    "$TEMPLATE" > "$TARGET"

  echo "✅ generated: $TARGET"
}

# ================================
# CREATE FEATURE ROOT
# ================================
mkdir -p "$BASE_DIR"

# ================================
# REACT FILES
# ================================
render tools/templates/react/api.ts.tpl         "$BASE_DIR/api.ts"
render tools/templates/react/page.tsx.tpl       "$BASE_DIR/Page.tsx"
render tools/templates/react/list.tsx.tpl       "$BASE_DIR/List.tsx"
render tools/templates/react/create.tsx.tpl     "$BASE_DIR/Create.tsx"
render tools/templates/react/edit.tsx.tpl       "$BASE_DIR/Edit.tsx"

# ================================
# CROSS-CUTTING CONCERNS
# ================================
render tools/templates/react/i18n.ts.tpl        "$BASE_DIR/i18n.ts"
render tools/templates/react/permissions.ts.tpl "$BASE_DIR/permissions.ts"

# ================================
# TESTS
# ================================
render tools/templates/react/test.tsx.tpl \
  "$BASE_DIR/__tests__/${LOWER}.test.tsx"

# ================================
# INDEX EXPORT
# ================================
INDEX_FILE="$BASE_DIR/index.ts"

if [ ! -f "$INDEX_FILE" ]; then
cat <<EOF > "$INDEX_FILE"
export * from "./Page";
export * from "./List";
export * from "./Create";
export * from "./Edit";
export * from "./api";
export * from "./permissions";
export * from "./i18n";
EOF
  echo "✅ generated: $INDEX_FILE"
else
  echo "ℹ️ index.ts already exists, skipped"
fi

echo ""
echo "🚀 React feature '$FEATURE_NAME' generated successfully!"
