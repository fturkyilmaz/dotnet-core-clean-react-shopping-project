#!/usr/bin/env bash
set -e

# ============================
# CONFIG
# ============================
SOLUTION_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
API_PROJECT="$SOLUTION_DIR/src/Presentation/API/ShoppingProject.WebAPI.csproj"
INFRA_PROJECT="$SOLUTION_DIR/src/Infrastructure/ShoppingProject.Infrastructure.csproj"
DB_CONTEXT="ApplicationDbContext"
MIGRATION_DIR="Migrations"

# ============================
# INPUT
# ============================
ACTION=$1
MIGRATION_NAME=$2
ENVIRONMENT=${3:-Development}

# ============================
# VALIDATION
# ============================
if [[ -z "$ACTION" ]]; then
  echo "❌ Action required: add | update | remove | list"
  exit 1
fi

export ASPNETCORE_ENVIRONMENT=$ENVIRONMENT

echo "🚀 Environment: $ASPNETCORE_ENVIRONMENT"
echo "📦 DbContext: $DB_CONTEXT"

# ============================
# FUNCTIONS
# ============================

add_migration() {
  if [[ -z "$MIGRATION_NAME" ]]; then
    echo "❌ Migration name required"
    exit 1
  fi

  echo "➕ Adding migration: $MIGRATION_NAME"

  dotnet ef migrations add "$MIGRATION_NAME" \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT" \
    --output-dir "$MIGRATION_DIR"
}

update_db() {
  echo "⬆️ Updating database..."

  dotnet ef database update \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

remove_migration() {
  echo "🗑 Removing last migration..."

  dotnet ef migrations remove \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

list_migrations() {
  echo "📄 Listing migrations..."

  dotnet ef migrations list \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

# ============================
# ROUTER
# ============================

case "$ACTION" in
  add)
    add_migration
    ;;
  update)
    update_db
    ;;
  remove)
    remove_migration
    ;;
  list)
    list_migrations
    ;;
  *)
    echo "❌ Unknown action: $ACTION"
    exit 1
    ;;
esac

echo "✅ Done"
