# Admin ve Web Projesi - Performans ve Otomasyon Analizi

## Mevcut Durum Özeti

### Admin Projesi (shadcn-admin)
- **Teknoloji Stack**: React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: TanStack Router (auto code splitting)
- **Build Tool**: Vite + SWC (hızlı derleme)
- **Package Manager**: pnpm
- **UI Framework**: shadcn/ui + Radix UI

### Web Projesi (estore)
- **Teknoloji Stack**: React 18, Vite 5, TypeScript 5.9, Tailwind CSS v4
- **State Management**: Redux Toolkit + Persist
- **Routing**: React Router v6
- **Testing**: Vitest + Playwright (E2E) + Storybook
- **API Client**: Orval (OpenAPI codegen)
- **Package Manager**: npm/pnpm

---

## 1. Admin Projesi - Performans İyileştirmeleri

### 1.1 Build Optimizasyonu

```typescript
// vite.config.ts iyileştirmeleri
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true, // ✅ Zaten aktif
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    // Eklenecek optimizasyonlar
    target: 'esnext', // Modern tarayıcılar için
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları kaldır
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor kodunu ayır
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
        },
      },
    },
    // Gzip/Brotli için pre-compression
    reportCompressedSize: true,
  },
  // Dep optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
    exclude: ['@radix-ui/react-icons'],
  },
})
```

### 1.2 Görsel Optimizasyonu
- **WebP/AVIF formatına geçiş**
- **Responsive images** için `srcset` kullanımı
- **Lazy loading** implementasyonu
- **CDN** kullanımı (Cloudflare/CloudFront)

### 1.3 State Management Optimizasyonu
```typescript
// Zustand için selector kullanımı
// ❌ Kötü - Tüm store'u dinle
const state = useAuthStore()

// ✅ İyi - Sadece gerekli alanları dinle
const user = useAuthStore(state => state.user)
const login = useAuthStore(state => state.login)
```

### 1.4 Code Splitting
- Route-based splitting (✅ TanStack Router ile zaten var)
- Component-level lazy loading
- Dynamic imports for heavy components

---

## 2. Admin Projesi - Otomasyon ve Profesyonelleştirme

### 2.1 Eksik Otomasyonlar

| Alan | Durum | Öneri |
|------|-------|-------|
| Bundle Analyzer | ❌ Yok | `rollup-plugin-visualizer` ekle |
| Lighthouse CI | ❌ Yok | GitHub Actions ile entegre et |
| Dead Code Detection | ✅ Var (Knip) | CI pipeline'a ekle |
| Pre-commit Hooks | ❌ Yok | Husky + lint-staged kur |
| Commit Convention | ✅ Var (cz.yaml) | CI'da enforce et |
| Semantic Release | ❌ Yok | Otomatik versiyonlama ekle |

### 2.2 Önerilen Scripts Ekleme

```json
{
  "scripts": {
    "analyze": "vite-bundle-visualizer",
    "analyze:build": "npm run build && npx serve dist",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "ci": "npm run type-check && npm run lint && npm run build",
    "knip:ci": "knip --production",
    "lighthouse": "lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report.json"
  }
}
```

### 2.3 Pre-commit Hooks (Husky)

```bash
# Kurulum
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 3. Web Projesi - Performans İyileştirmeleri

### 3.1 Build Optimizasyonu

```typescript
// vite.config.ts - Gelişmiş konfigürasyon
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
  ],
  build: {
    target: 'esnext',
    cssMinify: 'lightningcss', // Daha hızlı CSS minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          query: ['@tanstack/react-query'],
          ui: ['@headlessui/react', '@heroicons/react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      '@tanstack/react-query',
    ],
  },
})
```

### 3.2 React 18'e Özel Optimizasyonlar
```typescript
// index.tsx - Concurrent features kullanımı
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container!, {
  // Concurrent features
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo)
  },
})

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### 3.3 React Query Optimizasyonu
```typescript
// queryClient.ts - Gelişmiş konfigürasyon
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 dakika
      gcTime: 10 * 60 * 1000, // 10 dakika (eski cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      // Infinite scroll için
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### 3.4 Bundle Size Optimizasyonu

```typescript
// Dynamic imports for heavy components
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

// Prefetch stratejisi
const prefetchProduct = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 60 * 1000,
  })
}
```

---

## 4. Web Projesi - Otomasyon ve Profesyonelleştirme

### 4.1 Eksik Otomasyonlar

| Alan | Durum | Öneri |
|------|-------|-------|
| Bundle Analyzer | ✅ Var | CI'da otomatik rapor üret |
| Lighthouse CI | ❌ Yok | Performans regresyon testi ekle |
| Dead Code Detection | ❌ Yok | Knip veya depcheck kur |
| Pre-commit Hooks | ❌ Yok | Husky + lint-staged kur |
| Semantic Versioning | ❌ Yok | standard-version veya changesets |
| Chromatic | ❌ Yok | Storybook görsel regresyon testi |

### 4.2 Test Otomasyonu İyileştirmeleri

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage --reporter=json --outputFile=coverage.json",
    "test:e2e:ci": "playwright test --reporter=html,junit",
    "test:visual": "chromatic --project-token=$CHROMATIC_TOKEN",
    "storybook:build": "storybook build",
    "storybook:serve": "npx serve storybook-static"
  }
}
```

### 4.3 API Client Otomasyonu

```json
{
  "scripts": {
    "codegen": "orval --config orval.config.js",
    "codegen:watch": "npm run codegen -- --watch",
    "predev": "npm run codegen"
  }
}
```

### 4.4 Lighthouse CI Konfigürasyonu

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/', 'http://localhost:4173/products'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

---

## 5. CI/CD Pipeline İyileştirmeleri

### 5.1 Frontend-Specific GitHub Actions

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/Presentation/Web/**'
      - 'src/Presentation/Admin/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/Presentation/Web/**'
      - 'src/Presentation/Admin/**'

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.filter.outputs.web }}
      admin: ${{ steps.filter.outputs.admin }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            web:
              - 'src/Presentation/Web/**'
            admin:
              - 'src/Presentation/Admin/**'

  web-ci:
    needs: changes
    if: ${{ needs.changes.outputs.web == 'true' }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: src/Presentation/Web
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: src/Presentation/Web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Bundle analysis
        run: |
          npm run build
          npx bundlesize

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: src/Presentation/Web/dist

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: src/Presentation/Web/coverage/coverage.json

  admin-ci:
    needs: changes
    if: ${{ needs.changes.outputs.admin == 'true' }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: src/Presentation/Admin
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: src/Presentation/Admin/pnpm-lock.yaml

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Dead code detection
        run: pnpm knip:ci

      - name: Build
        run: pnpm build

      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.13.x
          lhci autorun

  e2e-tests:
    needs: [web-ci]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: web-build
          path: src/Presentation/Web/dist

      - name: Install Playwright
        run: |
          cd src/Presentation/Web
          npm ci
          npx playwright install --with-deps

      - name: Run E2E tests
        run: |
          cd src/Presentation/Web
          npm run test:e2e:ci

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: src/Presentation/Web/playwright-report/
```

### 5.2 Bundle Size Monitoring

```javascript
// bundlesize.config.js
module.exports = {
  files: [
    {
      path: './dist/assets/index-*.js',
      maxSize: '150kb',
      compression: 'gzip',
    },
    {
      path: './dist/assets/vendor-*.js',
      maxSize: '200kb',
      compression: 'gzip',
    },
    {
      path: './dist/assets/index-*.css',
      maxSize: '50kb',
      compression: 'gzip',
    },
  ],
}
```

---

## 6. Genel Öneriler ve Best Practices

### 6.1 Monorepo Yapısı İçin Öneriler

```bash
# Root seviyesinde ortak konfigürasyon
/
├── package.json          # Root scripts ve workspaces
├── pnpm-workspace.yaml   # PNPM workspaces
├── turbo.json            # Turborepo caching
├── .github/
│   └── workflows/
│       ├── web-ci.yml
│       ├── admin-ci.yml
│       └── shared/
└── src/Presentation/
    ├── Web/
    └── Admin/
```

```json
// root package.json
{
  "name": "shopping-project",
  "private": true,
  "workspaces": ["src/Presentation/*"],
  "scripts": {
    "build:web": "turbo run build --filter=web",
    "build:admin": "turbo run build --filter=admin",
    "dev:web": "turbo run dev --filter=web",
    "dev:admin": "turbo run dev --filter=admin",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### 6.2 Turborepo Konfigürasyonu

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "type-check": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 6.3 Ortak UI Kütüphanesi

Her iki proje için paylaşılabilecek bir UI kütüphanesi:

```
src/Presentation/
├── packages/
│   └── ui/               # Paylaşılan UI komponentleri
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── components/
│           ├── hooks/
│           └── utils/
├── Web/
└── Admin/
```

### 6.4 Ortak API Client

```typescript
// packages/api-client/src/index.ts
export * from './generated'
export { httpClient } from './httpClient'
export type * from './types'
```

### 6.5 Özet: Öncelikli Eylemler

| Öncelik | İşlem | Proje | Etki |
|---------|-------|-------|------|
| 🔴 Yüksek | Vite build optimizasyonu | Her ikisi | %30-40 hız artışı |
| 🔴 Yüksek | Pre-commit hooks | Her ikisi | Kod kalitesi |
| 🔴 Yüksek | Bundle analyzer CI | Her ikisi | Performans monitoring |
| 🟡 Orta | Lighthouse CI | Her ikisi | Performans regresyonu |
| 🟡 Orta | Turborepo | Root | Build caching |
| 🟡 Orta | Shared UI package | Yeni | Kod tekrarını azaltma |
| 🟢 Düşük | React 19 upgrade | Web | Yeni özellikler |
| 🟢 Düşük | Chromatic | Web | Görsel regresyon |

---

## Sonuç

Admin projesi modern tooling ile (SWC, Tailwind v4, TanStack Router) iyi bir temele sahip. Web projesi daha olgun testing altyapısına sahip ancak build optimizasyonunda geride.

**Öncelikli adımlar:**
1. Her iki projede Vite build optimizasyonunu uygula
2. Husky + lint-staged kurulumu yap
3. CI pipeline'larına bundle analysis ve Lighthouse ekle
4. Root seviyesinde Turborepo yapısına geçiş düşünülebilir
