import api from '@/services/api';
import localStorageService, { OfflineOperation } from '@/services/localStorage';

/**
 * SyncManager handles offline operations and syncs them with the server
 * when the device comes back online
 */
export class SyncManager {
  private isSyncing = false;
  private syncListeners: ((status: SyncStatus) => void)[] = [];

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
    this.notifyListeners({ isOnline: true, isSyncing: true, pendingCount: 0 });

    try {
      const operations = await localStorageService.getPendingOperations();

      if (operations.length === 0) {
        console.log('No pending operations to sync');
        this.notifyListeners({ isOnline: true, isSyncing: false, pendingCount: 0 });
        this.isSyncing = false;
        return { success: true, message: 'No pending operations' };
      }

      console.log(`Starting sync of ${operations.length} pending operations`);

      let successCount = 0;
      let failureCount = 0;

      for (const operation of operations) {
        try {
          const result = await this.syncOperation(operation);
          if (result) {
            successCount++;
            await localStorageService.markOperationAsSynced(operation.id);
          } else {
            failureCount++;
            await localStorageService.incrementRetryCount(operation.id);
          }
        } catch (error) {
          console.error(`Failed to sync operation ${operation.id}:`, error);
          failureCount++;
          await localStorageService.incrementRetryCount(operation.id);
        }
      }

      // Clear synced operations
      await localStorageService.clearSyncedOperations();

      const message = `Synced: ${successCount} succeeded, ${failureCount} failed`;
      console.log(message);

      this.notifyListeners({ isOnline: true, isSyncing: false, pendingCount: failureCount });
      this.isSyncing = false;

      return {
        success: failureCount === 0,
        message,
        successCount,
        failureCount,
      };
    } catch (error) {
      console.error('Sync failed:', error);
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
            await api.post('/carts', payload);
            return true;
          }
          break;

        case 'update':
          if (operation.entity_type === 'cartItem') {
            await api.put(`/carts/${operation.entity_id}`, payload);
            return true;
          }
          break;

        case 'delete':
          if (operation.entity_type === 'cartItem') {
            await api.delete(`/carts/${operation.entity_id}`);
            return true;
          }
          break;

        case 'deleteAll':
          if (operation.entity_type === 'cartItem') {
            await api.delete('/carts/delete-all');
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
    const operations = await localStorageService.getPendingOperations();
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

export default SyncManager.getInstance();
