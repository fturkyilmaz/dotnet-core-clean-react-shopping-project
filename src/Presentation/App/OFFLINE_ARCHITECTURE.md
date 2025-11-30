# 📱 Offline-First Mobile Architecture Documentation

## Overview

This document describes the offline-first architecture implementation for the React Native mobile app. The system allows users to continue using the app without internet connectivity, with all changes automatically syncing to the server when back online.

## Architecture Components

### 1. **SQLite Database** (`src/services/sqlite.ts`)

Local storage layer using SQLite for persistent data storage on the device.

**Tables:**
- `products` - Cached product list
- `cart_items` - Local shopping cart items
- `offline_queue` - Pending operations waiting to sync

**Key Methods:**
- `initialize()` - Initialize database and create tables
- `getDb()` - Get database instance
- `clearAllData()` - Clear all local data

### 2. **LocalStorageService** (`src/services/localStorage.ts`)

Abstraction layer for SQLite operations. Handles CRUD operations for products and cart items.

**Key Methods:**
- `getProducts()` - Get all cached products
- `getProduct(id)` - Get single product
- `saveProducts(products)` - Save products to local storage
- `getCartItems()` - Get all cart items from local storage
- `addCartItem(item)` - Add item to local cart
- `updateCartItem(item)` - Update item quantity
- `removeCartItem(id)` - Remove item from cart
- `clearCartItems()` - Clear all cart items
- `queueOperation()` - Queue an operation for sync
- `getPendingOperations()` - Get all pending operations
- `markOperationAsSynced(id)` - Mark operation as synced

### 3. **SyncManager** (`src/services/syncManager.ts`)

Manages syncing of offline operations with the API server.

**Key Methods:**
- `syncPendingOperations()` - Sync all pending operations
- `subscribe(listener)` - Subscribe to sync status updates
- `getSyncStatus()` - Get current sync status

**Supported Operations:**
- Add cart item
- Update cart item quantity
- Delete cart item
- Clear all cart items

### 4. **Offline Middleware** (`src/store/middleware/offlineMiddleware.ts`)

Redux middleware that intercepts cart actions and queues them for offline storage.

**Flow:**
1. User dispatches cart action (add, update, remove)
2. Middleware intercepts action
3. Operation is saved to local SQLite database
4. Operation is queued for syncing
5. Redux action continues normally

### 5. **Network Status Monitoring** (`src/hooks/useNetworkStatus.ts`)

Hook that monitors device network connectivity and triggers sync when coming back online.

**Features:**
- Detects online/offline status using `@react-native-community/netinfo`
- Automatically triggers sync when coming online
- Provides sync status and pending count
- Manual sync trigger

**Return Values:**
```typescript
{
  isOnline: boolean;        // Device is connected to internet
  isSyncing: boolean;       // Sync operation in progress
  pendingCount: number;     // Number of pending operations
  manualSync: () => void;   // Manual sync trigger
}
```

### 6. **UI Components** (`src/components/OfflineIndicator.tsx`)

React Native components to show offline status and sync progress.

**Components:**
- `OfflineIndicator` - Top banner showing offline/syncing status
- `SyncBadge` - Small sync status badge
- `OfflineMessage` - Informational message about offline state

## Data Flow

### Adding an Item to Cart (Offline)

```
User Presses "Add to Cart"
        ↓
Redux Action Dispatched
        ↓
Offline Middleware Intercepts
        ↓
LocalStorageService.addCartItem()
        ↓
Insert into SQLite
        ↓
Queue Operation: { type: 'add', entityType: 'cartItem', payload: {...} }
        ↓
Redux State Updated (UI reflects immediately)
        ↓
Operation stored for sync
```

### Syncing Operations (Back Online)

```
Device Detects Internet
        ↓
useNetworkStatus Hook Triggers
        ↓
SyncManager.syncPendingOperations()
        ↓
For Each Pending Operation:
  - POST /api/v1/carts (add)
  - PUT /api/v1/carts/{id} (update)
  - DELETE /api/v1/carts/{id} (delete)
  - DELETE /api/v1/carts/delete-all (clear all)
        ↓
Mark as Synced in SQLite
        ↓
Clear Synced Operations
        ↓
Notify Listeners (UI updates)
```

## Usage Examples

### Initialize Database on App Start

```typescript
// In App.tsx
useEffect(() => {
  const initDB = async () => {
    await sqliteDb.initialize();
  };
  initDB();
}, []);
```

### Monitor Network Status

```typescript
// In any screen
const { isOnline, isSyncing, pendingCount, manualSync } = useNetworkStatus();

// Show indicator
<OfflineIndicator isOnline={isOnline} isSyncing={isSyncing} pendingCount={pendingCount} />
```

### Add Item to Cart (Automatic Offline Support)

```typescript
const handleAddToCart = (product: Product) => {
  dispatch(addToCart({
    ...product,
    quantity: 1,
  }));
  // Action is automatically handled by offlineMiddleware
  // - Saved to SQLite
  // - Queued for sync
  // - Redux state updated immediately (optimistic update)
};
```

### Manual Sync

```typescript
const { manualSync, isSyncing } = useNetworkStatus();

<AccessibleTouchable onPress={manualSync} disabled={isSyncing}>
  <Text>{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
</AccessibleTouchable>
```

## Key Features

### ✅ Optimistic Updates
- UI updates immediately when user adds/removes items
- No waiting for API response
- Sync happens in background

### ✅ Automatic Sync
- Detects when device comes online
- Automatically starts syncing pending operations
- Shows progress to user

### ✅ Retry Logic
- Failed syncs are retried
- Retry count tracked in database
- User can manually trigger sync

### ✅ Offline Indicators
- Banner shows when offline
- Badge shows pending count
- Sync progress visible to user

### ✅ Data Persistence
- All cart items saved locally
- Products cached for viewing
- Offline queue persists across app restarts

## Error Handling

### Sync Failures
- Operations marked with retry count
- Failed operations remain in queue
- User notified of sync status
- Manual retry available

### Network Changes
- Detects changes from offline → online
- Detects changes from online → offline
- Graceful handling of connection loss

## Testing Offline Scenarios

### Test Offline Add/Remove
1. Disconnect device from internet
2. Add/remove items from cart
3. See items saved locally with "pending" indicator
4. Reconnect to internet
5. Changes automatically sync

### Test Manual Sync
1. Disconnect device
2. Add multiple items
3. Reconnect
4. Tap "Sync Now"
5. Watch pending count decrease

### Test Network Transitions
1. Start online, add item
2. Go offline (airplane mode)
3. Add more items
4. Offline indicator appears
5. Go online
6. Watch auto-sync happen
7. Confirm sync completion

## Dependencies

```json
{
  "expo-sqlite": "^14.0.0",
  "@react-native-community/netinfo": "^9.0.0",
  "@reduxjs/toolkit": "^1.9.0",
  "redux-persist": "^6.0.0"
}
```

## Configuration

No additional configuration needed. The system works out of the box with:
- SQLite database stored in app's documents folder
- Network monitoring via NetInfo
- Redux middleware automatically integrated

## Future Enhancements

1. **Conflict Resolution** - Handle conflicts when server data differs from local
2. **Selective Sync** - Allow users to choose which operations to sync
3. **Compression** - Compress offline queue for large operations
4. **Analytics** - Track offline usage patterns
5. **Background Sync** - Use Native Module for background sync
6. **Data Compression** - Compress cached products

## Troubleshooting

### Database Not Initializing
- Check SQLite permissions in Android/iOS configs
- Ensure `initialize()` called before using db

### Sync Not Triggering
- Verify network status hook is used in root component
- Check that SyncManager is singleton
- Ensure API endpoints are correct

### Offline Operations Not Queuing
- Verify offlineMiddleware is added to Redux store
- Check LocalStorageService is initialized
- Ensure SQLite tables exist

## Performance Considerations

- **SQLite Query Optimization** - Use indexes on frequently queried columns
- **Batch Operations** - Sync multiple operations in single API call (future)
- **Data Compression** - Compress large product lists (future)
- **Cleanup** - Periodically clear old synced operations
- **Memory Management** - Don't keep entire product list in Redux

---

**Last Updated:** November 30, 2025
**Version:** 1.0
