# 🚀 EStore - Modern E-Ticaret Web Uygulaması

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />
</p>

## 📌 Genel Bakış

**EStore**, modern e-ticaret deneyimi sunan, performans odaklı ve ölçeklenebilir bir React uygulamasıdır.

🔹 **Amaç**: Geliştirici deneyimini iyileştirmek, kod kalitesini artırmak ve deployment sürecini güvenli hale getirmek
🔹 **Hedef**: SEO dostu, hızlı yüklenen ve mobil-öncelikli bir e-ticaret platformu
🔹 **Mimari**: Feature-based modüler yapı, type-safe API entegrasyonu

---

## 🛠 Teknoloji Stack

### Core
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **React** | 19.2+ | Modern UI library with Concurrent Features |
| **TypeScript** | 5.9+ | Type-safe development |
| **Vite** | 7.x | Ultra-fast build tool with SWC |
| **React Router** | 6.28 | Declarative routing |

### State Management
| Teknoloji | Kullanım Alanı |
|-----------|----------------|
| **Redux Toolkit** | Global state (auth, cart) |
| **RTK Query** | API caching & server state |
| **Redux Persist** | State persistence |

### UI & Styling
| Teknoloji | Açıklama |
|-----------|----------|
| **Tailwind CSS v4** | Utility-first CSS with Vite plugin |
| **Headless UI** | Unstyled, accessible components |
| **Heroicons** | SVG icon library |
| **Framer Motion** | Animations & transitions |

### Forms & Validation
| Teknoloji | Açıklama |
|-----------|----------|
| **React Hook Form** | Performant form management |
| **Zod** | TypeScript-first schema validation |
| **Hookform Resolvers** | Zod integration |

### Internationalization
| Teknoloji | Açıklama |
|-----------|----------|
| **i18next** | Core i18n framework |
| **react-i18next** | React integration |
| **browser-languagedetector** | Auto language detection |

### API & Real-time
| Teknoloji | Açıklama |
|-----------|----------|
| **Axios** | HTTP client with interceptors |
| **SignalR** | Real-time WebSocket connections |
| **Orval** | OpenAPI/Swagger code generation |

---

## ⚡ Performans İyileştirmeleri

### Bundle Optimizasyonu
```typescript
// vite.config.ts - Manual Code Splitting
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
}
```

### Optimizasyon Stratejileri
- ✅ **Code Splitting**: Route ve component bazlı lazy loading
- ✅ **Tree Shaking**: Dead code elimination
- ✅ **Minification**: Terser ile console/debugger kaldırma
- ✅ **Compression**: Gzip & Brotli pre-compression hazırlığı
- ✅ **Image Optimization**: WebP/AVIF format desteği
- ✅ **Prefetching**: RTK Query ile otomatik caching

---

## 🤖 Otomasyon

### Pre-commit Hooks
```bash
.husky/pre-commit
├── lint-staged (ESLint + Prettier)
└── Type checking
```

### Lint-staged Konfigürasyonu
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

### Kod Kalitesi Araçları
| Araç | Görev |
|------|-------|
| **ESLint** | Linting with React hooks & refresh rules |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |

---

## 🧪 Test Stratejisi

### Test Pyramid
```
    /\
   /  \
  / E2E \      <- Playwright (e2e/)
 /________\
/ Integration \ <- Vitest + MSW
/______________\
    Unit        <- Vitest + Testing Library
```

### Unit & Integration Tests
```bash
# Vitest configuration
npm run test              # Run tests
npm run test:ui           # UI mode
npm run test:coverage     # Coverage report
```

**Config**: [`vitest.config.ts`](vitest.config.ts)
- **Framework**: Vitest with jsdom
- **Coverage**: v8 provider (text, json, html)
- **Setup**: `./src/test/setup.ts`

### E2E Tests
```bash
# Playwright configuration
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:ci       # CI mode with reports
npm run test:e2e:headed   # Visible browser
```

**Config**: [`playwright.config.ts`](playwright.config.ts)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Parallel**: Full parallel execution

### Storybook
```bash
npm run storybook         # Dev server (port 6006)
npm run build-storybook   # Static build
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/frontend-ci.yml
┌─────────────────┐
│   Changeset     │ <- Path filter (Web/Admin)
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌────────┐
│Web-CI │  │Admin-CI│
└───┬───┘  └────────┘
    │
┌───┴───────────┐
│  Type Check   │
│  Lint         │
│  Unit Tests   │
│  Build        │
└───────┬───────┘
        │
┌───────▼───────┐
│   Web-E2E     │
│  (Playwright) │
└───────────────┘
```

### Pipeline Adımları
1. **Type Check** - TypeScript derleme kontrolü
2. **Lint** - ESLint ile kod kalitesi
3. **Unit Tests** - Vitest ile coverage raporu
4. **Build** - Production build & artifact upload
5. **E2E Tests** - Playwright ile çapraz tarayıcı testleri
6. **Coverage Upload** - Codecov entegrasyonu

### Lighthouse CI
```javascript
// lighthouserc.js
assertions: {
  'categories:performance': ['warn', { minScore: 0.8 }],
  'categories:accessibility': ['error', { minScore: 0.9 }],
  'categories:best-practices': ['warn', { minScore: 0.9 }],
  'categories:seo': ['warn', { minScore: 0.9 }],
}
```

---

## 📁 Proje Yapısı

```
src/Presentation/Web/
├── 📂 .github/
│   └── workflows/
│       └── frontend-ci.yml      # CI/CD pipeline
│
├── 📂 .husky/
│   └── pre-commit               # Git hooks
│
├── 📂 e2e/                      # Playwright tests
│   ├── auth.spec.ts
│   └── cart.spec.ts
│
├── 📂 public/                   # Static assets
│   └── images/
│
├── 📂 src/
│   ├── 📂 api/                  # API layer
│   │   ├── axios.ts            # Axios instance + interceptors
│   │   ├── queryClient.ts      # RTK Query config
│   │   └── generated/          # Orval generated clients
│   │
│   ├── 📂 assets/              # Static imports
│   │
│   ├── 📂 components/          # Reusable components
│   │   ├── ui/                 # Base UI components
│   │   └── common/             # Shared components
│   │
│   ├── 📂 context/             # React contexts
│   │
│   ├── 📂 features/            # Feature-based modules
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── products/
│   │   └── checkout/
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useCart.ts
│   │
│   ├── 📂 infrastructure/      # External services
│   │   ├── api/                # Generated API clients
│   │   └── signalr/            # Real-time connections
│   │
│   ├── 📂 pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── CartPage.tsx
│   │
│   ├── 📂 store/               # Redux store
│   │   ├── index.ts            # Store configuration
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       └── cartSlice.ts
│   │
│   ├── 📂 styles/              # Global styles
│   │
│   ├── 📂 types/               # TypeScript types
│   │
│   ├── 📂 utils/               # Utility functions
│   │
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
│
├── 📄 .env                     # Environment variables
├── 📄 .env.example             # Env template
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 index.html               # HTML template
├── 📄 lighthouserc.js          # Lighthouse CI config
├── 📄 orval.config.js          # API codegen config
├── 📄 package.json             # Dependencies
├── 📄 playwright.config.ts     # E2E test config
├── 📄 tailwind.config.js       # Tailwind config
├── 📄 tsconfig.json            # TypeScript config
├── 📄 vite.config.ts           # Vite config
└── 📄 vitest.config.ts         # Test config
```

---

## 🚀 Geliştirme

### Gereksinimler
- **Node.js**: 20.x LTS
- **Package Manager**: npm (v10+) veya pnpm
- **Git**: 2.40+

### Kurulum
```bash
# Repository clone
git clone <repo-url>
cd src/Presentation/Web

# Dependencies install
npm ci

# Environment setup
cp .env.example .env
# .env dosyasını düzenleyin
```

### Geliştirme Komutları
```bash
# Development server
npm run dev                 # http://localhost:5173

# Production build
npm run build              # dist/ klasörüne build
npm run preview            # Production build preview

# Code quality
npm run lint               # ESLint check
npm run lint:fix           # Auto-fix issues
npm run type-check         # TypeScript check

# Testing
npm run test               # Unit tests
npm run test:coverage      # Coverage report
npm run test:e2e           # E2E tests

# API Code Generation
npm run codegen            # Orval ile API client oluştur

# Bundle Analysis
npm run analyze            # Bundle size visualization
npm run build:analyze      # Build + analyze
```

---

## 📦 API Entegrasyonu

### Orval Code Generation
```bash
# Swagger/OpenAPI'den otomatik client oluşturma
npm run codegen
```

**Config**: [`orval.config.js`](orval.config.js)
- **Input**: Backend Swagger JSON
- **Output**: `src/infrastructure/api/generated`
- **Client**: React Query hooks
- **Mode**: Tags-split (endpoint bazlı dosyalar)

### Örnek Kullanım
```typescript
// Otomatik oluşturulan hook'ları kullanma
import { useGetProductsPaged, useSearchProducts } from '@/infrastructure/api/generated';

function ProductList() {
  const { data, isLoading } = useGetProductsPaged({ page: 1, pageSize: 10 });

  return (
    // ...
  );
}
```

---

## 📊 Monitoring & Observability

### Lighthouse CI
Performans skorları her PR'da otomatik kontrol edilir:
- **Performance**: ≥ 80
- **Accessibility**: ≥ 90 (required)
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Bundle Monitoring
```bash
# Build sonrası bundle analizi
npm run analyze
# dist/stats.html dosyasını tarayıcıda açın
```

---

## 🎯 Öncelikli Adımlar / Roadmap

### Faz 1: Temel Optimizasyonlar ✅
- [x] Vite build optimizasyonları (manual chunks)
- [x] Husky + lint-staged kurulumu
- [x] TypeScript strict mode
- [x] ESLint + Prettier entegrasyonu

### Faz 2: Test & CI/CD 🔄
- [x] Vitest unit test setup
- [x] Playwright E2E test setup
- [x] GitHub Actions pipeline
- [x] Lighthouse CI entegrasyonu
- [ ] Codecov coverage reporting
- [ ] Visual regression tests (Chromatic)

### Faz 3: Gelişmiş Özellikler 📋
- [ ] Service Worker (PWA)
- [ ] Server-Side Rendering (SSR)
- [ ] Edge deployment (Cloudflare/Vercel)
- [ ] Error tracking (Sentry)
- [ ] Analytics entegrasyonu

---

## 📌 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SIGNALR_URL=http://localhost:5000/hubs

# Auth
VITE_AUTH_STORAGE_KEY=estore_auth

# Features
VITE_ENABLE_MOCKS=false
VITE_ENABLE_DEBUG=false
```

---

## 🤝 Katkı Rehberi

1. **Branch Strategy**: `feature/description` veya `fix/description`
2. **Commit Convention**: Conventional commits
   ```
   feat: add product search functionality
   fix: resolve cart state persistence bug
   docs: update API integration guide
   ```
3. **PR Checklist**:
   - [ ] Tests pass
   - [ ] Type check passes
   - [ ] Lint passes
   - [ ] Lighthouse scores maintained

---

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

---

<p align="center">
  <strong>Built with ❤️ using React 19 & Vite 7</strong>
</p>
