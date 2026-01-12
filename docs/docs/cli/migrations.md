---

```md
# 🧱 Entity Framework Core Migration Automation Guide

Bu doküman, projede **Entity Framework Core migration süreçlerinin** bash script ile nasıl **otomatikleştirildiğini**, **neden bu şekilde tasarlandığını** ve **nasıl kullanılacağını** açıklar.

> 🎯 Amaç:
> - Clean Architecture yapısını bozmadan
> - Tek komutla migration yönetimi
> - Dev / Prod uyumlu
> - CI/CD dostu bir yapı kurmak

---

## 📂 Proje Yapısı

```

src/
├── Presentation/API        # Startup Project
├── Infrastructure          # DbContext + Migrations
├── Application
└── Domain

tools/
└── migrations/
└── migrate.sh

````

---

## 🧠 Mimari Kararlar

| Konu | Tercih | Sebep |
|----|----|----|
| Startup Project | API | `Program.cs` burada |
| DbContext | Infrastructure | Clean Architecture |
| Migration Output | Infrastructure/Migrations | Domain izole |
| Script | Bash | Cross-platform + CI uyumlu |

---

## ⚙️ migrate.sh Scripti

Script aşağıdaki işlemleri destekler:

- Migration ekleme
- Database update
- Son migration silme
- Migration listeleme
- Ortam (Development / Production) ayrımı

---

## 📜 migrate.sh (Full Script)

```bash
#!/usr/bin/env bash
set -e

# ============================
# CONFIG
# ============================
SOLUTION_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
API_PROJECT="$SOLUTION_DIR/src/Presentation/API/API.csproj"
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

  dotnet ef migrations add "$MIGRATION_NAME" \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT" \
    --output-dir "$MIGRATION_DIR"
}

update_db() {
  dotnet ef database update \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

remove_migration() {
  dotnet ef migrations remove \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

list_migrations() {
  dotnet ef migrations list \
    --project "$INFRA_PROJECT" \
    --startup-project "$API_PROJECT" \
    --context "$DB_CONTEXT"
}

# ============================
# ROUTER
# ============================

case "$ACTION" in
  add) add_migration ;;
  update) update_db ;;
  remove) remove_migration ;;
  list) list_migrations ;;
  *)
    echo "❌ Unknown action"
    exit 1
    ;;
esac

echo "✅ Migration command completed"
````

---

## ▶️ Kullanım

### ➕ Migration Ekle

```bash
./migrate.sh add AddProductStatus Development
```

### ⬆️ Database Update

```bash
./migrate.sh update Development
```

### 🗑 Son Migration Sil

```bash
./migrate.sh remove Development
```

### 📄 Migration Listele

```bash
./migrate.sh list
```

---

## 🌍 Environment Desteği

Script `ASPNETCORE_ENVIRONMENT` değişkenini otomatik set eder:

```bash
Development (default)
Production
```

Bu sayede:

* Farklı connection string
* Farklı config
* CI/CD uyumu sağlanır

---

## 🚀 CI/CD Uyumlu Kullanım

Örnek GitHub Actions step:

```yaml
- name: Run EF Migrations
  run: |
    chmod +x tools/migrations/migrate.sh
    tools/migrations/migrate.sh update Production
```

---

## 🧠 Best Practices

* ❌ `dotnet ef` komutlarını manuel çalıştırma
* ✅ Her migration script üzerinden alınmalı
* ✅ Migration isimleri anlamlı olmalı
* ✅ Production migration'ları kontrollü çalıştırılmalı


---
```
