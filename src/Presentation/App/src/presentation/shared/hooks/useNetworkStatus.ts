import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import syncManager, { SyncStatus } from '@/infrastructure/services/SyncManager';

/**
 * Hook to monitor network status and trigger sync when coming online
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
  });

  useEffect(() => {
    // Subscribe to sync status updates
    const unsubscribeSync = syncManager.subscribe((status) => {
      setSyncStatus(status);
    });

    // Subscribe to network changes
    const unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected === true;
      setIsOnline(isConnected);

      console.log(`Network status changed: ${isConnected ? 'Online' : 'Offline'}`);

      // If coming back online and there are pending operations, sync them
      if (isConnected && syncStatus.pendingCount > 0) {
        console.log('Device is online. Starting sync...');
        syncManager.syncPendingOperations();
      }
    });

    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(state.isConnected === true);
    });

    // Check initial sync status
    syncManager.getSyncStatus().then(setSyncStatus);

    return () => {
      unsubscribeNetInfo();
      unsubscribeSync();
    };
  }, [syncStatus.pendingCount]);

  return {
    isOnline,
    isSyncing: syncStatus.isSyncing,
    pendingCount: syncStatus.pendingCount,
    manualSync: () => syncManager.syncPendingOperations(),
  };
};

export default useNetworkStatus;
