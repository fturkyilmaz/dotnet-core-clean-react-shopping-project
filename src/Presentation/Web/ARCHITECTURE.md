# React Frontend - Clean Architecture Guide

## 📐 Architecture Overview

This React frontend follows **Clean Architecture** principles with three main layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, Pages, Hooks)     │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│   (API Clients, HTTP, Repositories)     │
└──────────────┬──────────────────────────┘
               │ implements
               ▼
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│    (Entities, Interfaces, Types)        │
└─────────────────────────────────────────┘
```

**Dependency Rule**: Source code dependencies point **inward**. Inner layers have no knowledge of outer layers.

---

## 🗂️ Folder Structure

```
src/
├── core/domain/              # Domain Layer (Pure Business Logic)
│   ├── entities/
│   │   ├── Product.ts        # Product domain model
│   │   ├── User.ts           # User domain model
│   │   └── Cart.ts           # Cart domain model
│   └── ports/                # Interfaces (contracts)
│       ├── IProductRepository.ts
│       ├── ICartRepository.ts
│       └── IAuthService.ts
│
├── infrastructure/           # Infrastructure Layer (Technical Details)
│   ├── api/
│   │   ├── httpClient.ts     # Axios instance with JWT refresh
│   │   └── dtos/common.ts    # Backend DTO types
│   └── persistence/          # Repository implementations
│       ├── ProductAPIRepository.ts  # Implements IProductRepository
│       ├── CartAPIRepository.ts     # Implements ICartRepository
│       └── AuthAPIService.ts        # Implements IAuthService
│
├── presentation/             # Presentation Layer (UI)
│   ├── features/             # Feature-based modules
│   │   ├── product/
│   │   │   ├── components/   # ProductCard, Skeletons
│   │   │   ├── pages/        # HomePage, CategoryPage, etc.
│   │   │   ├── hooks/        # useProducts
│   │   │   └── index.ts      # Barrel export
│   │   ├── auth/
│   │   │   ├── pages/        # LoginPage, RegisterPage
│   │   │   ├── hooks/        # useAuth
│   │   │   └── index.ts
│   │   ├── cart/
│   │   │   ├── pages/        # CartsPage
│   │   │   ├── components/   # BasketItem
│   │   │   ├── hooks/        # useCart
│   │   │   └── index.ts
│   │   └── admin/
│   │       └── pages/        # AdminDashboard, AddProductPage
│   ├── shared/
│   │   ├── components/       # Header, Loader, ErrorBoundary, etc.
│   │   └── localization/     # i18n translations
│   └── store/                # Redux store & slices
│       ├── slices/
│       └── index.ts
│
└── services/                 # Dependency Injection
    ├── dependencyInjector.ts # DI container (singletons)
    └── queryClient.ts        # React Query configuration
```

---

## 🔄 Data Flow

### Example: Fetching Products

```typescript
// 1. Component uses hook
const HomePage = () => {
  const { data: products } = useProducts();
  // ...
};

// 2. Hook calls repository via DI
const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productRepository.getAll()  // From DI container
  });
};

// 3. Repository implements domain interface
class ProductAPIRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const response = await httpClient.get('/api/v1/Products');
    return response.data.items;
  }
}
```

**Flow**: Component → Hook → Repository (DI) → HTTP Client → API

---

## 🎯 Key Concepts

### 1. **Dependency Injection**

Repositories are created once and shared:

```typescript
// services/dependencyInjector.ts
export const productRepository = new ProductAPIRepository();
export const cartRepository = new CartAPIRepository();
export const authService = new AuthAPIService();
```

### 2. **Repository Pattern**

Domain defines interfaces, infrastructure implements them:

```typescript
// Domain (interface)
export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  create(product: CreateProduct): Promise<Product>;
}

// Infrastructure (implementation)
export class ProductAPIRepository implements IProductRepository {
  // ... HTTP calls
}
```

### 3. **Feature-Based Organization**

Related code stays together:

```
features/product/
├── components/     # Product-specific UI
├── pages/          # Product pages
└── hooks/          # Product data hooks
```

---

## 🛠️ TypeScript Path Aliases

```json
{
  "@core/*": "./src/core/*",
  "@infrastructure/*": "./src/infrastructure/*",
  "@presentation/*": "./src/presentation/*",
  "@services/*": "./src/services/*",
  "@components/*": "./src/presentation/shared/components/*",
  "@features/*": "./src/presentation/features/*"
}
```

---

## ➕ Adding New Features

### Example: Adding "Wishlist" Feature

1. **Create domain entity:**
   ```typescript
   // core/domain/entities/Wishlist.ts
   export interface Wishlist {
     id: number;
     userId: string;
     productIds: number[];
   }
   ```

2. **Define port (interface):**
   ```typescript
   // core/domain/ports/IWishlistRepository.ts
   export interface IWishlistRepository {
     getByUserId(userId: string): Promise<Wishlist>;
     addProduct(productId: number): Promise<void>;
   }
   ```

3. **Implement repository:**
   ```typescript
   // infrastructure/persistence/WishlistAPIRepository.ts
   export class WishlistAPIRepository implements IWishlistRepository {
     async getByUserId(userId: string) {
       const res = await httpClient.get(`/wishlists/${userId}`);
       return res.data;
     }
   }
   ```

4. **Register in DI:**
   ```typescript
   // services/dependencyInjector.ts
   export const wishlistRepository = new WishlistAPIRepository();
   ```

5. **Create hook:**
   ```typescript
   // presentation/features/wishlist/hooks/useWishlist.ts
   export const useWishlist = () => {
     return useQuery({
       queryKey: ['wishlist'],
       queryFn: () => wishlistRepository.getByUserId(userId)
     });
   };
   ```

6. **Build UI:**
   ```
   presentation/features/wishlist/
   ├── components/WishlistItem.tsx
   ├── pages/WishlistPage.tsx
   └── hooks/useWishlist.ts
   ```

---

## ✅ Benefits

- **Testability**: Mock repositories via interfaces
- **Maintainability**: Features are self-contained
- **Scalability**: Add features without affecting others
- **Framework Independence**: Core has no React dependencies
- **Clear Dependencies**: Explicit dependency injection

---

## 🧪 Testing Strategy

### Unit Tests (Domain)
```typescript
// Pure business logic, no framework dependencies
test('Product price calculation', () => {
  const product = new Product({...});
  expect(product.calculateDiscount()).toBe(10);
});
```

### Integration Tests (Infrastructure)
```typescript
// Mock HTTP client
test('ProductRepository fetches products', async () => {
  const mockClient = { get: jest.fn() };
  const repo = new ProductAPIRepository(mockClient);
  await repo.getAll();
  expect(mockClient.get).toHaveBeenCalled();
});
```

### Component Tests (Presentation)
```typescript
// Mock hooks
test('HomePage renders products', () => {
  jest.mock('../hooks/useProducts', () => ({
    useProducts: () => ({ data: mockProducts })
  }));
  render(<HomePage />);
});
```

---

## 📚 Further Reading

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
