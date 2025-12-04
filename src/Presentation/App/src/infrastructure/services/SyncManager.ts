import httpClient from '../api/httpClient';
import localStorageService, { OfflineOperation } from '../persistence/LocalStorageRepository';
import AnalyticsService from './AnalyticsService';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
}

export interface SyncResult {
  success: boolean;
  message: string;
  successCount?: number;
  failureCount?: number;
}

/**
 * SyncManager handles offline operations and syncs them with the server
 * when the device comes back online
 * Integrated with Unified Analytics for tracking sync events and performance
 */
export class SyncManager {
  private isSyncing = false;
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private analytics = AnalyticsService;

  private static instance: SyncManager;

  private constructor() {}

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Subscribe to sync status updates
   */
  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of sync status
   */
  private notifyListeners(status: SyncStatus): void {
    this.syncListeners.forEach(listener => listener(status));
  }

  /**
   * Sync all pending operations with the server
   */
  async syncPendingOperations(): Promise<SyncResult> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return { success: false, message: 'Sync already in progress' };
    }

    this.isSyncing = true;
    const syncStartTime = performance.now();
    this.analytics.trackSyncEvent('started', { timestamp: new Date().toISOString() });
    this.notifyListeners({ isOnline: true, isSyncing: true, pendingCount: 0 });

    try {
      // We need to cast here because getQueue returns any[] in the interface but we know it's OfflineOperation[]
      const operations = (await localStorageService.getQueue()) as unknown as OfflineOperation[];

      if (operations.length === 0) {
        console.log('No pending operations to sync');
        const syncDuration = performance.now() - syncStartTime;
        this.analytics.trackSyncEvent('completed', {
          duration: syncDuration,
          operationsCount: 0,
          successCount: 0,
          failureCount: 0,
        });
        this.notifyListeners({ isOnline: true, isSyncing: false, pendingCount: 0 });
        this.isSyncing = false;
        return { success: true, message: 'No pending operations' };
      }

      console.log(`Starting sync of ${operations.length} pending operations`);

      let successCount = 0;
      let failureCount = 0;

      for (const operation of operations) {
        try {
          const operationStartTime = performance.now();
          const result = await this.syncOperation(operation);
          const operationDuration = performance.now() - operationStartTime;
          
          if (result) {
            successCount++;
            await localStorageService.removeFromQueue(String(operation.id));
            this.analytics.trackOfflineOperation(
              operation.operation_type,
              operation.entity_type,
              operationDuration
            );
          } else {
            failureCount++;
            // Retry count increment is not exposed in interface, skipping for now or need to add to interface
            // await localStorageService.incrementRetryCount(operation.id);
            this.analytics.trackEvent('sync_operation_failed', {
              operation_type: operation.operation_type,
              entity_type: operation.entity_type,
              duration_ms: operationDuration,
            });
          }
        } catch (error) {
          console.error(`Failed to sync operation ${operation.id}:`, error);
          failureCount++;
          // await localStorageService.incrementRetryCount(operation.id);
          this.analytics.trackException(
            error instanceof Error ? error : new Error(String(error)),
            {
              operation: `sync_operation_${operation.operation_type}`,
              metadata: {
                operation_id: operation.id,
                entity_type: operation.entity_type,
              },
            }
          );
        }
      }

      // Clear synced operations
      await localStorageService.clearQueue();

      const syncDuration = performance.now() - syncStartTime;
      const message = `Synced: ${successCount} succeeded, ${failureCount} failed`;
      console.log(message);

      this.analytics.trackSyncEvent('completed', {
        duration: syncDuration,
        operationsCount: operations.length,
        successCount,
        failureCount,
      });

      this.notifyListeners({ isOnline: true, isSyncing: false, pendingCount: failureCount });
      this.isSyncing = false;

      return {
        success: failureCount === 0,
        message,
        successCount,
        failureCount,
      };
    } catch (error) {
      const syncDuration = performance.now() - syncStartTime;
      console.error('Sync failed:', error);
      this.analytics.trackSyncEvent('failed', {
        duration: syncDuration,
        error: error instanceof Error ? error.message : String(error),
      });
      this.notifyListeners({ isOnline: false, isSyncing: false, pendingCount: 0 });
      this.isSyncing = false;
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error during sync',
      };
    }
  }

  /**
   * Sync a single operation with the server
   */
  private async syncOperation(operation: OfflineOperation): Promise<boolean> {
    try {
      const payload = JSON.parse(operation.payload);

      switch (operation.operation_type) {
        case 'add':
          if (operation.entity_type === 'cartItem') {
            await httpClient.post('/carts', payload);
            return true;
          }
          break;

        case 'update':
          if (operation.entity_type === 'cartItem') {
            await httpClient.put(`/carts/${operation.entity_id}`, payload);
            return true;
          }
          break;

        case 'delete':
          if (operation.entity_type === 'cartItem') {
            await httpClient.delete(`/carts/${operation.entity_id}`);
            return true;
          }
          break;

        case 'deleteAll':
          if (operation.entity_type === 'cartItem') {
            await httpClient.delete('/carts/delete-all');
            return true;
          }
          break;

        default:
          console.warn(`Unknown operation type: ${operation.operation_type}`);
          return false;
      }

      return false;
    } catch (error) {
      console.error('Error syncing operation:', error);
      return false;
    }
  }

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const operations = await localStorageService.getQueue();
    return {
      isOnline: true,
      isSyncing: this.isSyncing,
      pendingCount: operations.length,
    };
  }

  /**
   * Check if sync is currently in progress
   */
  getIsSyncing(): boolean {
    return this.isSyncing;
  }
}

export default SyncManager.getInstance();
