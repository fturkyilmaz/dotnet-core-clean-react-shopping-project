# Firebase Analytics & Crashlytics Integration Guide

## Overview

This document describes the complete Firebase Analytics and Crashlytics integration for the React Native shopping app, providing comprehensive tracking of:
- **Google Analytics**: User behavior, screen views, events, performance metrics
- **Firebase Crashlytics**: Crash reporting, error tracking, breadcrumbs
- **Unified Analytics Manager**: Single interface combining all analytics sources

## Architecture

### 1. Firebase Analytics Service

**File:** `src/Presentation/App/src/services/firebaseAnalytics.ts`

Provides Google Analytics tracking for:
- Custom events
- Offline operations (add/update/delete/deleteAll)
- Sync events (started/completed/failed)
- Network status changes
- Performance metrics
- Screen views
- Product/Cart events
- User properties
- Exception tracking

**Key Functions:**

```typescript
// Initialize Firebase Analytics
await initializeFirebaseAnalytics();

// Track custom event
trackEvent('event_name', { param1: 'value1' });

// Track offline operation
trackOfflineOperation('add', 'cartItem', 150); // duration in ms

// Track sync event
trackSyncEvent('completed', {
  duration: 2500,
  operationsCount: 5,
  successCount: 5,
  failureCount: 0,
});

// Track screen view
trackScreenView('ProductsScreen');

// Track product event
trackProductEvent('add_to_cart', 123, 'Product Name', 29.99, 'Electronics');

// Track cart event
trackCartEvent('checkout', 199.95, 5); // value and item count

// Track exception
trackException(error, true); // fatal flag
```

### 2. Firebase Crashlytics Service

**File:** `src/Presentation/App/src/services/crashlyticsService.ts`

**Features:**
- Automatic crash detection and reporting
- Custom error tracking
- Breadcrumb collection for crash context
- Session tracking
- User ID association
- Custom key-value pairs
- Crash report management

**Key Functions:**

```typescript
// Initialize Crashlytics
const crashlytics = CrashlyticsService.getInstance();
await crashlytics.initialize();

// Record exception
crashlytics.recordException(error, {
  userId: 'user123',
  operation: 'checkout',
  metadata: { cartValue: 199.95 },
  fatal: false,
});

// Record custom error
crashlytics.recordError('Custom error message');

// Record fatal error
crashlytics.recordFatalError('App fatal error', {
  userId: 'user123',
  operation: 'sync',
});

// Add breadcrumb
crashlytics.addBreadcrumb('User clicked checkout', 'info', {
  cartValue: 199.95,
});

// Set custom key
crashlytics.setCustomKey('user_tier', 'premium');

// Set user ID
crashlytics.setUserId('user123');

// Get crash reports
const reports = crashlytics.getCrashReports();
const recent = crashlytics.getRecentCrashes(5);

// Export reports
const json = crashlytics.exportReports();
```

### 3. Unified Analytics Manager

**File:** `src/Presentation/App/src/services/unifiedAnalytics.ts`

**Single interface** combining Firebase Analytics, Crashlytics, and local analytics.

**Key Functions:**

```typescript
const analytics = UnifiedAnalyticsManager.getInstance();

// Initialize all services
await analytics.initialize({
  enableFirebase: true,
  enableLocal: true,
  enableCrashlytics: true,
});

// Track events (automatically sent to all enabled services)
analytics.trackEvent('checkout_completed');
analytics.trackOfflineOperation('add', 'cartItem', 150);
analytics.trackSyncEvent('completed', { duration: 2500 });
analytics.trackNetworkChange(true);
analytics.trackScreenView('CartScreen');
analytics.trackProductEvent('add_to_cart', 123, 'Product', 29.99, 'Electronics');
analytics.trackCartEvent('checkout', 199.95, 5);

// Track exceptions (Firebase + Crashlytics)
analytics.trackException(error, {
  operation: 'checkout',
  fatal: true,
});

// Record fatal error
analytics.recordFatalError('Payment processing failed');

// Breadcrumbs
analytics.addBreadcrumb('User completed payment', 'info');

// User management
analytics.setUserId('user123');
analytics.setCustomProperties({
  user_tier: 'premium',
  signup_date: '2024-01-15',
});

// Reporting
const report = analytics.getReport();
const crashes = analytics.getCrashReports();
const jsonData = analytics.exportAllData();

// Control which services are active
analytics.setAnalyticsEnabled({
  firebase: true,
  local: true,
  crashlytics: true,
});
```

## Setup Instructions

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable Google Analytics in project settings
4. Enable Crashlytics in the console
5. Go to Project Settings → General tab
6. Copy the Firebase config values

### Step 2: Environment Configuration

Create `.env.local` in `src/Presentation/App/` with your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=myproject
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

EXPO_PUBLIC_ANALYTICS_ENABLED=true
EXPO_PUBLIC_CRASHLYTICS_ENABLED=true
```

### Step 3: App Initialization

Analytics are automatically initialized in `App.tsx`:

```typescript
useEffect(() => {
  const initAnalytics = async () => {
    await initializeFirebaseAnalytics();
    await UnifiedAnalyticsManager.initialize({
      enableFirebase: true,
      enableLocal: true,
      enableCrashlytics: true,
    });
    UnifiedAnalyticsManager.trackEvent('app_launched');
  };
  initAnalytics();
}, []);
```

### Step 4: Integration Points

**Cart Operations:**
```typescript
// In CartScreen or Redux actions
analytics.trackCartEvent('add_item', totalPrice, itemCount);
analytics.trackProductEvent('add_to_cart', productId, name, price, category);
```

**Sync Operations:**
```typescript
// In SyncManager
analytics.trackSyncEvent('started');
analytics.trackOfflineOperation('add', 'cartItem', duration);
analytics.trackSyncEvent('completed', { successCount, failureCount });
```

**Error Handling:**
```typescript
try {
  // operation
} catch (error) {
  analytics.trackException(error, {
    operation: 'checkout',
    userId: currentUserId,
    fatal: true,
  });
}
```

## Tracked Events

### Offline Events
- `offline_add` - Item added offline
- `offline_update` - Item updated offline
- `offline_delete` - Item deleted offline
- `offline_deleteAll` - Cart cleared offline
- `network_offline` - Device lost connectivity
- `network_online` - Device regained connectivity

### Sync Events
- `sync_started` - Sync process initiated
- `sync_completed` - Sync finished (with stats)
- `sync_failed` - Sync encountered errors
- `sync_operation_failed` - Individual operation failed

### Performance Events
- `performance_metric` - Operation timing (db_query, api_call, sync_operation)
- `cache_metrics` - Cache hit rate and response times
- `perf_*_error` - Performance operation failures

### Product/Cart Events
- `product_view` - User viewed product
- `product_click` - User clicked product
- `product_add_to_cart` - Product added to cart
- `product_remove_from_cart` - Product removed from cart
- `cart_view` - Cart viewed
- `cart_add_item` - Item added to cart
- `cart_remove_item` - Item removed from cart
- `cart_checkout` - Checkout initiated

### User Events
- `app_launched` - App started
- `screen_view_*` - Screen navigation
- `user_properties_set` - User profile updated
- `exception` - Error occurred
- `user_engagement` - Session activity tracked

## Firebase Console Views

### Real-time Events
- **Dashboard** → Real-time reports of user events
- **Events** → All tracked events with parameters
- **Conversions** → Custom conversion tracking (configure in Firebase)

### User Analytics
- **Users** → User count, demographics, retention
- **Audience** → User segments by events/properties
- **Retention** → User return rates

### Crashes (Crashlytics)
- **Overview** → Crash statistics and trends
- **Crash List** → Individual crashes with stack traces
- **Issues** → Grouped crashes by error type
- **Breadcrumbs** → Event context leading to crash

## Performance Optimization

### Google Analytics Performance
- Events batched before sending (up to 50 at a time)
- Automatic retry on network failure
- Offline events queued and sent when online
- Minimal payload (~1-2KB per event)

### Crashlytics Optimization
- Breadcrumbs limited to 50 most recent
- Crash reports compressed before sending
- Automatic session ID generation
- Battery and memory efficient

## Example Use Cases

### 1. Track Checkout Flow
```typescript
// Product page
analytics.trackProductEvent('view', 123, 'iPhone 15', 999, 'Electronics');

// Add to cart
analytics.trackProductEvent('add_to_cart', 123, 'iPhone 15', 999, 'Electronics');
analytics.trackCartEvent('add_item', 999, 1);

// Checkout
analytics.trackCartEvent('checkout', 999, 1);
analytics.trackEvent('checkout_started', { cart_value: 999 });

// Payment
try {
  await processPayment();
  analytics.trackEvent('payment_success', { amount: 999 });
} catch (error) {
  analytics.trackException(error, {
    operation: 'payment',
    fatal: false,
  });
}
```

### 2. Track Offline Sync
```typescript
analytics.trackNetworkChange(false); // went offline

// ... user performs operations offline ...

analytics.trackOfflineOperation('add', 'cartItem', 100);
analytics.trackOfflineOperation('update', 'cartItem', 50);

analytics.trackNetworkChange(true); // came back online

// Sync happens automatically
analytics.trackSyncEvent('completed', {
  duration: 2500,
  operationsCount: 2,
  successCount: 2,
  failureCount: 0,
});
```

### 3. Error Handling with Context
```typescript
try {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('API Error');
} catch (error) {
  analytics.addBreadcrumb('API call failed', 'error', {
    url: '/api/products',
    statusCode: response?.status,
  });
  
  analytics.trackException(error, {
    operation: 'fetch_products',
    userId: currentUser?.id,
    metadata: {
      endpoint: '/api/products',
      timestamp: new Date().toISOString(),
    },
  });
}
```

## Debugging & Testing

### Enable Local Logging
```typescript
// In development, enable detailed logging
const report = UnifiedAnalyticsManager.getReport();
console.log('Analytics Report:', report);
```

### Test Events
```typescript
// Test event tracking
UnifiedAnalyticsManager.trackEvent('test_event', { 
  test_param: 'test_value' 
});

// Wait 1-2 minutes for Firebase to process
// Check Firebase Console → Events
```

### View Local Analytics
```tsx
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// In debug screen
<AnalyticsDashboard showRealtime={true} />
```

### Monitor Crashes
```typescript
const crashlytics = CrashlyticsService.getInstance();
const crashes = crashlytics.getCrashReports();
console.log('Recent crashes:', crashes);

// Export for debugging
const json = crashlytics.exportReports();
```

## Best Practices

### 1. User Privacy
- Do NOT track sensitive personal information
- Use user ID instead of email/phone
- Comply with GDPR and privacy laws
- Clear data on user logout

### 2. Event Naming
- Use snake_case: `checkout_completed`
- Be descriptive: `payment_method_selected`
- Include context: `product_view_from_search`

### 3. Parameters
- Keep payloads small (<500 bytes)
- Use standard Firebase parameter names
- Avoid large objects in parameters

### 4. Error Handling
- Always provide context (operation, user)
- Include stack trace for debugging
- Mark fatal vs. non-fatal errors
- Use breadcrumbs for error context

### 5. Performance
- Batch similar events
- Avoid logging every keystroke
- Use sampling for high-frequency events
- Monitor quota usage in Firebase

## Troubleshooting

### Events not appearing in Firebase Console
1. Check Firebase API key is correct
2. Verify project ID matches
3. Wait 5+ minutes for data to appear (real-time has latency)
4. Check network connectivity
5. Verify events are within quota limits

### Crashlytics not receiving crashes
1. Verify Crashlytics is enabled in project
2. Check initialization code runs before other code
3. Force a test crash: `throw new Error('Test crash')`
4. Check app has internet permission
5. Verify user hasn't disabled crash reporting

### High data usage
1. Reduce event frequency
2. Disable analytics in development: `.setAnalyticsEnabled({ firebase: false })`
3. Batch events before sending
4. Remove debug logging in production

### Firebase quota exceeded
1. Check event volume in Firebase Console
2. Implement event sampling for high-frequency events
3. Remove unnecessary tracking
4. Upgrade Firebase plan if needed

## Firebase Console URLs

- **Analytics Dashboard:** `https://console.firebase.google.com/project/{PROJECT_ID}/analytics/overview`
- **Events:** `https://console.firebase.google.com/project/{PROJECT_ID}/analytics/events`
- **Crashlytics:** `https://console.firebase.google.com/project/{PROJECT_ID}/crashlytics`
- **Real-time:** `https://console.firebase.google.com/project/{PROJECT_ID}/analytics/realtime`

## References

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Firebase Crashlytics Documentation](https://firebase.google.com/docs/crashlytics)
- [Google Analytics Events](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [React Native Firebase Package](https://rnfirebase.io/)

## Files Modified/Created

```
Created:
- src/Presentation/App/src/services/firebaseAnalytics.ts
- src/Presentation/App/src/services/crashlyticsService.ts
- src/Presentation/App/src/services/unifiedAnalytics.ts
- src/Presentation/App/.env.local

Modified:
- src/Presentation/App/App.tsx (added Firebase initialization)
- src/Presentation/App/src/services/syncManager.ts (integrated Unified Analytics)
- src/Presentation/App/src/services/localStorage.ts (integrated Unified Analytics)
- src/Presentation/App/package.json (added firebase, react-native-firebase)
```

## Next Steps

1. Create Firebase project and get config
2. Update `.env.local` with Firebase credentials
3. Install dependencies: `yarn install`
4. Test with `yarn start`
5. Check Firebase Console for incoming events
6. Set up custom dashboards in Firebase Console
7. Configure alerts for crash spikes
8. Create conversion funnels for key user journeys

