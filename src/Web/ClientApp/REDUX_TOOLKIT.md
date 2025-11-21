# Redux Toolkit - Complete Implementation

## ✅ Installed Slices

### 1. **Auth Slice** (`authSlice.ts`)
**Purpose:** User authentication and session management

**State:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Actions:**
- `setCredentials(user, token)` - Login user
- `logout()` - Logout and clear tokens
- `setLoading(boolean)` - Set loading state

**Usage:**
```typescript
const { user, isAuthenticated } = useAppSelector(state => state.auth);
dispatch(setCredentials({ user, token }));
dispatch(logout());
```

---

### 2. **Cart Slice** (`cartSlice.ts`)
**Purpose:** Shopping cart management

**State:**
```typescript
{
  items: CartItem[];
  total: number;
}
```

**Actions:**
- `addToCart(item)` - Add product to cart
- `removeFromCart(id)` - Remove product
- `updateQuantity(id, quantity)` - Update quantity
- `clearCart()` - Empty cart

**Features:**
- ✅ LocalStorage persistence
- ✅ Automatic total calculation
- ✅ Duplicate item handling

**Usage:**
```typescript
const { items, total } = useAppSelector(state => state.cart);
dispatch(addToCart(product));
dispatch(updateQuantity({ id, quantity }));
```

---

### 3. **UI Slice** (`uiSlice.ts`) ⭐ NEW
**Purpose:** UI state management (theme, modals, notifications)

**State:**
```typescript
{
  theme: 'light' | 'dark';
  language: 'en' | 'tr';
  sidebarOpen: boolean;
  modals: Modal[];
  notifications: Notification[];
  isLoading: boolean;
}
```

**Actions:**
- `setTheme(theme)` / `toggleTheme()` - Theme management
- `setLanguage(lang)` - Language selection
- `toggleSidebar()` - Sidebar toggle
- `openModal(id, data)` / `closeModal(id)` - Modal management
- `addNotification(notification)` - Show notification
- `setLoading(isLoading, message)` - Global loading state

**Features:**
- ✅ Dark/Light theme with localStorage
- ✅ Auto-apply theme to DOM
- ✅ Modal state management
- ✅ Notification queue
- ✅ Global loading indicator

**Usage:**
```typescript
const { theme, modals } = useAppSelector(state => state.ui);
dispatch(toggleTheme());
dispatch(openModal({ id: 'confirm-delete', data: productId }));
dispatch(addNotification({ type: 'success', message: 'Saved!' }));
```

---

### 4. **Preferences Slice** (`preferencesSlice.ts`) ⭐ NEW
**Purpose:** User preferences and settings

**State:**
```typescript
{
  emailNotifications: boolean;
  pushNotifications: boolean;
  currency: 'USD' | 'EUR' | 'TRY';
  itemsPerPage: number;
  defaultView: 'grid' | 'list';
  autoSave: boolean;
}
```

**Actions:**
- `updatePreferences(preferences)` - Bulk update
- `toggleEmailNotifications()` - Toggle email
- `setCurrency(currency)` - Set currency
- `setItemsPerPage(count)` - Pagination size
- `setDefaultView(view)` - Grid/List view
- `resetPreferences()` - Reset to defaults

**Features:**
- ✅ LocalStorage persistence
- ✅ Default values
- ✅ Type-safe currency/view options

**Usage:**
```typescript
const { currency, itemsPerPage } = useAppSelector(state => state.preferences);
dispatch(setCurrency('TRY'));
dispatch(setItemsPerPage(24));
```

---

### 5. **Products Slice** (`productsSlice.ts`) ⭐ NEW
**Purpose:** Product filtering, comparison, recently viewed

**State:**
```typescript
{
  filters: ProductFilters;
  selectedProductId: number | null;
  compareList: number[];
  recentlyViewed: number[];
}
```

**Actions:**
- `setFilters(filters)` / `updateFilter(filter)` - Filter products
- `clearFilters()` - Reset filters
- `addToCompare(id)` - Add to comparison (max 4)
- `removeFromCompare(id)` - Remove from comparison
- `addToRecentlyViewed(id)` - Track viewed products (max 10)

**Features:**
- ✅ Advanced filtering (category, price, rating)
- ✅ Product comparison (max 4 items)
- ✅ Recently viewed tracking
- ✅ LocalStorage persistence

**Usage:**
```typescript
const { filters, compareList } = useAppSelector(state => state.products);
dispatch(updateFilter({ category: 'electronics', minPrice: 100 }));
dispatch(addToCompare(productId));
dispatch(addToRecentlyViewed(productId));
```

---

## 🎯 Typed Hooks

**File:** `hooks/useRedux.ts`

```typescript
import { useAppDispatch, useAppSelector } from './hooks/useRedux';

// Instead of:
const dispatch = useDispatch();
const state = useSelector(state => state.auth);

// Use:
const dispatch = useAppDispatch();
const state = useAppSelector(state => state.auth);
```

**Benefits:**
- ✅ Full TypeScript autocomplete
- ✅ Type-safe state access
- ✅ No manual typing needed

---

## 📊 Redux DevTools

Redux DevTools Extension is automatically enabled in development mode.

**Features:**
- Time-travel debugging
- Action history
- State diff viewer
- Action replay

---

## 🎨 Example: Theme Toggle Component

```typescript
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleTheme } from '../store/slices/uiSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.ui.theme);
  
  return (
    <button onClick={() => dispatch(toggleTheme())}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

---

## 🚀 Benefits

1. **Centralized State** - All app state in one place
2. **Type Safety** - Full TypeScript support
3. **DevTools** - Powerful debugging
4. **Persistence** - Auto-save to localStorage
5. **Performance** - Optimized re-renders
6. **Scalable** - Easy to add new slices

---

## 📝 Summary

**Total Slices:** 5
- ✅ Auth (login/logout)
- ✅ Cart (shopping cart)
- ✅ UI (theme, modals, notifications)
- ✅ Preferences (user settings)
- ✅ Products (filters, comparison)

**Total Actions:** 40+
**LocalStorage Integration:** ✅
**TypeScript Support:** ✅
**Redux DevTools:** ✅
