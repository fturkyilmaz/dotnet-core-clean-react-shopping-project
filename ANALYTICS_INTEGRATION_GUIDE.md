# Analytics Integration Guide for Developers

## Quick Start

### Import Analytics
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';
```

### Track Events

#### 1. Offline Operations
```typescript
// When user adds item offline
const duration = 150; // ms
analytics.trackOfflineOperation('add', 'cartItem', duration);

// Other operations
analytics.trackOfflineOperation('update', 'cartItem', 120);
analytics.trackOfflineOperation('delete', 'cartItem', 80);
analytics.trackOfflineOperation('deleteAll', 'cartItem', 200);
```

#### 2. Sync Events
```typescript
// Sync started
analytics.trackSyncEvent('started', { 
  timestamp: new Date().toISOString() 
});

// Sync completed
analytics.trackSyncEvent('completed', {
  duration: 2500,
  operationsCount: 5,
  successCount: 5,
  failureCount: 0,
});

// Sync failed
analytics.trackSyncEvent('failed', {
  duration: 1200,
  error: 'Network timeout',
});
```

#### 3. Network Events
```typescript
// Device went offline
analytics.trackNetworkChange(false);

// Device came back online
analytics.trackNetworkChange(true, signalStrength);
```

#### 4. Performance Events
```typescript
// Database query
analytics.trackPerformanceMetric('db_query', 45);

// API call
analytics.trackPerformanceMetric('api_call', 320);

// Sync operation
analytics.trackPerformanceMetric('sync_operation', 2500);
```

#### 5. Screen Events
```typescript
// User navigates to screen
analytics.trackScreenView('ProductsScreen');
analytics.trackScreenView('CartScreen');
analytics.trackScreenView('CheckoutScreen');
```

#### 6. Product Events
```typescript
// User views product
analytics.trackProductEvent('view', 123, 'iPhone 15', 999, 'Electronics');

// User adds to cart
analytics.trackProductEvent('add_to_cart', 123, 'iPhone 15', 999, 'Electronics');

// User removes from cart
analytics.trackProductEvent('remove_from_cart', 123, 'iPhone 15', 999, 'Electronics');
```

#### 7. Cart Events
```typescript
// User views cart
analytics.trackCartEvent('view', 1999, 2);

// User adds item
analytics.trackCartEvent('add_item', 2099, 3);

// User removes item
analytics.trackCartEvent('remove_item', 1799, 2);

// User proceeds to checkout
analytics.trackCartEvent('checkout', 1799, 2);
```

#### 8. Cache Metrics
```typescript
const cacheHitRate = 0.85; // 85%
const avgResponseTime = 150; // ms
const itemCount = 42;

analytics.trackCacheMetrics(cacheHitRate, avgResponseTime, itemCount);
```

### Error & Exception Tracking

#### Track Exception
```typescript
try {
  await riskyOperation();
} catch (error) {
  analytics.trackException(error, {
    operation: 'checkout',
    userId: currentUser?.id,
    metadata: { cartValue: 199.95 },
    fatal: false,
  });
}
```

#### Record Fatal Error
```typescript
analytics.recordFatalError('Payment processing failed', {
  userId: currentUser?.id,
  operation: 'payment_processing',
  metadata: {
    amount: 199.95,
    provider: 'stripe',
  },
});
```

#### Add Breadcrumb
```typescript
// Add breadcrumb for crash context
analytics.addBreadcrumb('User started payment process', 'info', {
  amount: 199.95,
  paymentMethod: 'credit_card',
});
```

### User Management

#### Set User ID
```typescript
// When user logs in
analytics.setUserId(user.id);

// When user logs out
analytics.setUserId(''); // or null
```

#### Set Custom Properties
```typescript
analytics.setCustomProperties({
  user_tier: 'premium',
  signup_date: '2024-01-15',
  country: 'US',
  app_version: '1.0.0',
});
```

## Screen-by-Screen Integration

### ProductsScreen
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

export function ProductsScreen() {
  useEffect(() => {
    // Track screen view
    UnifiedAnalyticsManager.trackScreenView('ProductsScreen');
  }, []);

  const handleProductClick = (product: Product) => {
    UnifiedAnalyticsManager.trackProductEvent(
      'click',
      product.id,
      product.title,
      product.price,
      product.category
    );
    // Navigate to product detail
  };

  const handleAddToCart = (product: Product) => {
    UnifiedAnalyticsManager.trackProductEvent(
      'add_to_cart',
      product.id,
      product.title,
      product.price,
      product.category
    );
    // Add to cart logic
  };

  return (
    // Your component JSX
  );
}
```

### CartScreen
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

export function CartScreen() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    UnifiedAnalyticsManager.trackScreenView('CartScreen');
    
    // Track cart view with metrics
    UnifiedAnalyticsManager.trackCartEvent('view', cartTotal, cartItems.length);
  }, []);

  const handleAddItem = () => {
    UnifiedAnalyticsManager.trackCartEvent(
      'add_item',
      newTotal,
      newItemCount
    );
  };

  const handleRemoveItem = () => {
    UnifiedAnalyticsManager.trackCartEvent(
      'remove_item',
      newTotal,
      newItemCount
    );
  };

  const handleCheckout = () => {
    UnifiedAnalyticsManager.trackCartEvent('checkout', cartTotal, cartItems.length);
    // Navigate to checkout
  };

  return (
    // Your component JSX
  );
}
```

### CheckoutScreen
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

export function CheckoutScreen() {
  useEffect(() => {
    UnifiedAnalyticsManager.trackScreenView('CheckoutScreen');
  }, []);

  const handlePayment = async () => {
    try {
      const startTime = performance.now();
      
      const result = await processPayment();
      
      const duration = performance.now() - startTime;
      UnifiedAnalyticsManager.trackPerformanceMetric('payment_processing', duration);
      
      UnifiedAnalyticsManager.trackEvent('payment_success', {
        amount: totalAmount,
        method: paymentMethod,
        duration_ms: duration,
      });
    } catch (error) {
      UnifiedAnalyticsManager.trackException(error, {
        operation: 'payment_processing',
        metadata: {
          amount: totalAmount,
          method: paymentMethod,
        },
        fatal: true,
      });
    }
  };

  return (
    // Your component JSX
  );
}
```

## Service Integration Examples

### In Redux Actions
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

export const addToCart = (product: Product) => async (dispatch) => {
  try {
    // Track event
    UnifiedAnalyticsManager.trackProductEvent(
      'add_to_cart',
      product.id,
      product.title,
      product.price,
      product.category
    );

    // Dispatch action
    dispatch(cartSlice.actions.addItem(product));

    // Track cart state
    const state = getState();
    const cartTotal = selectCartTotal(state);
    UnifiedAnalyticsManager.trackCartEvent(
      'add_item',
      cartTotal,
      selectCartItems(state).length
    );
  } catch (error) {
    UnifiedAnalyticsManager.trackException(error, {
      operation: 'addToCart',
      metadata: { productId: product.id },
    });
  }
};
```

### In Offline Middleware
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

const offlineMiddleware: Middleware = (store) => (next) => (action) => {
  if (isOfflineAction(action)) {
    const startTime = performance.now();
    
    const result = next(action);
    
    const duration = performance.now() - startTime;
    UnifiedAnalyticsManager.trackOfflineOperation(
      action.type as any,
      'cartItem',
      duration
    );
    
    return result;
  }
  
  return next(action);
};
```

### In Error Boundary
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Add breadcrumb with component stack
    UnifiedAnalyticsManager.addBreadcrumb(
      'React Error Boundary caught error',
      'error',
      {
        component: errorInfo.componentStack,
      }
    );

    // Record fatal error
    UnifiedAnalyticsManager.recordFatalError(error.message, {
      operation: 'react_render',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Render error UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### In API Interceptor
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

api.interceptors.response.use(
  (response) => {
    const duration = performance.now() - requestStartTime;
    
    UnifiedAnalyticsManager.trackPerformanceMetric(
      'api_call',
      duration,
      {
        endpoint: response.config.url,
        method: response.config.method,
        statusCode: response.status,
      }
    );
    
    return response;
  },
  (error) => {
    const duration = performance.now() - requestStartTime;
    
    UnifiedAnalyticsManager.trackException(error, {
      operation: 'api_call',
      metadata: {
        endpoint: error.config?.url,
        statusCode: error.response?.status,
        duration_ms: duration,
      },
    });
    
    return Promise.reject(error);
  }
);
```

## Custom Events

### Event Naming Convention
```typescript
// Format: {category}_{action}_{subject}
// Examples:
'user_signup_completed'
'product_search_query'
'payment_method_changed'
'notification_opened'
'app_upgrade_available'
```

### Custom Event Tracking
```typescript
// Track custom user action
UnifiedAnalyticsManager.trackEvent('user_profile_updated', {
  fields_changed: 'name,email',
  timestamp: new Date().toISOString(),
});

// Track feature usage
UnifiedAnalyticsManager.trackEvent('filter_applied', {
  filter_type: 'category',
  filter_value: 'electronics',
  results_count: 42,
});

// Track engagement metric
UnifiedAnalyticsManager.trackEvent('wishlist_shared', {
  share_method: 'whatsapp',
  items_count: 5,
});
```

## Performance Monitoring Pattern

### Measure Operation Duration
```typescript
const startTime = performance.now();

try {
  // Perform operation
  const result = await someAsyncOperation();
  
  const duration = performance.now() - startTime;
  
  UnifiedAnalyticsManager.trackPerformanceMetric(
    'some_operation',
    duration,
    { success: true }
  );
  
  return result;
} catch (error) {
  const duration = performance.now() - startTime;
  
  UnifiedAnalyticsManager.trackPerformanceMetric(
    'some_operation',
    duration,
    { success: false, error: error.message }
  );
  
  throw error;
}
```

## Testing Analytics

### Unit Test Example
```typescript
import UnifiedAnalyticsManager from '@/services/unifiedAnalytics';

describe('Analytics Integration', () => {
  beforeEach(() => {
    UnifiedAnalyticsManager.clearAllData();
  });

  it('should track product event', () => {
    UnifiedAnalyticsManager.trackProductEvent(
      'add_to_cart',
      123,
      'iPhone',
      999,
      'Electronics'
    );

    const report = UnifiedAnalyticsManager.getReport();
    expect(report.local.events).toContainEqual(
      expect.objectContaining({
        name: 'product_add_to_cart',
      })
    );
  });

  it('should track exception', () => {
    const error = new Error('Test error');
    UnifiedAnalyticsManager.trackException(error, {
      operation: 'test_operation',
      fatal: false,
    });

    const crashes = UnifiedAnalyticsManager.getCrashReports();
    expect(crashes.length).toBeGreaterThan(0);
  });
});
```

## Common Patterns

### Loading State with Analytics
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleLoad = async () => {
  setIsLoading(true);
  const startTime = performance.now();
  
  try {
    const data = await loadData();
    const duration = performance.now() - startTime;
    
    UnifiedAnalyticsManager.trackPerformanceMetric('data_load', duration);
    setData(data);
  } catch (error) {
    UnifiedAnalyticsManager.trackException(error, {
      operation: 'load_data',
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Error Retry with Analytics
```typescript
const retryWithAnalytics = async (
  operation: () => Promise<any>,
  maxRetries: number = 3
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      
      if (attempt > 1) {
        UnifiedAnalyticsManager.trackEvent('operation_recovered', {
          attempt,
        });
      }
      
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        UnifiedAnalyticsManager.trackException(error, {
          operation: 'retry_exhausted',
          metadata: { attempts: maxRetries },
          fatal: true,
        });
        throw error;
      }
      
      UnifiedAnalyticsManager.addBreadcrumb(
        `Retry attempt ${attempt}/${maxRetries}`,
        'warning'
      );
      
      await delay(Math.pow(2, attempt) * 1000); // Exponential backoff
    }
  }
};
```

## Checklist for Feature Implementation

When implementing a new feature, ensure analytics tracking:

- [ ] Screen view tracked when screen is displayed
- [ ] Key user actions tracked (clicks, submissions)
- [ ] Success and failure paths tracked
- [ ] Performance metrics collected (if applicable)
- [ ] Errors/exceptions tracked with context
- [ ] Breadcrumbs added for debugging
- [ ] Custom properties set for segmentation
- [ ] Tested in development environment
- [ ] Verified in Firebase Console (wait 1-2 minutes)

## Reference Quick Links

| Task | Location |
|------|----------|
| Initialize analytics | `App.tsx` |
| Main analytics service | `src/services/unifiedAnalytics.ts` |
| Firebase config | `.env.local` |
| Track in this screen | Import `UnifiedAnalyticsManager` |
| View local analytics | `AnalyticsDashboard` component |
| Check crashes | `CrashlyticsService.getInstance()` |
| Firebase console | See `FIREBASE_ANALYTICS_SETUP.md` |

