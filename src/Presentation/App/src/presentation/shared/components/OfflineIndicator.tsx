import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSyncing?: boolean;
  pendingCount?: number;
}

/**
 * Component to display offline status and sync progress
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  isSyncing,
  pendingCount,
}) => {
  if (isOnline && !isSyncing && (!pendingCount || pendingCount === 0)) {
    return null;
  }

  if (!isOnline) {
    return (
      <View className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700 px-4 py-3 flex-row items-center gap-2">
        <Ionicons name="cloud-offline-outline" size={16} color="#b45309" />
        <Text className="text-amber-700 dark:text-amber-300 text-sm font-medium">
          You're offline. Changes will sync when online.
        </Text>
      </View>
    );
  }

  if (isSyncing) {
    return (
      <View className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700 px-4 py-3 flex-row items-center gap-2">
        <ActivityIndicator size="small" color="#0369a1" />
        <Text className="text-blue-700 dark:text-blue-300 text-sm font-medium">
          Syncing changes...
        </Text>
      </View>
    );
  }

  if (pendingCount && pendingCount > 0) {
    return (
      <View className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-700 px-4 py-3 flex-row items-center gap-2">
        <Ionicons name="cloud-upload-outline" size={16} color="#ca8a04" />
        <Text className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
          {pendingCount} change{pendingCount > 1 ? 's' : ''} waiting to sync
        </Text>
      </View>
    );
  }

  return null;
};

interface SyncBadgeProps {
  isSyncing: boolean;
  pendingCount: number;
  onRetry?: () => void;
}

/**
 * Small badge component showing sync status in header
 */
export const SyncBadge: React.FC<SyncBadgeProps> = ({
  isSyncing,
  pendingCount,
  onRetry,
}) => {
  if (!isSyncing && pendingCount === 0) {
    return null;
  }

  if (isSyncing) {
    return (
      <View className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
        <ActivityIndicator size="small" color="#0369a1" />
        <Text className="text-blue-700 dark:text-blue-300 text-xs font-semibold">
          Syncing
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
      <Ionicons name="cloud-upload-outline" size={12} color="#ca8a04" />
      <Text className="text-yellow-700 dark:text-yellow-300 text-xs font-semibold">
        {pendingCount} pending
      </Text>
    </View>
  );
};

interface OfflineMessageProps {
  title: string;
  message: string;
  action?: 'retry' | 'save_offline';
}

/**
 * Modal/alert component for offline actions
 */
export const OfflineMessage: React.FC<OfflineMessageProps> = ({
  title,
  message,
  action,
}) => {
  const actionText =
    action === 'retry'
      ? 'Retry'
      : action === 'save_offline'
        ? 'Saved Offline'
        : undefined;

  return (
    <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-4">
      <View className="flex-row items-start gap-3">
        <Ionicons name="information-circle" size={20} color="#0369a1" />
        <View className="flex-1">
          <Text className="text-blue-900 dark:text-blue-100 font-semibold text-sm">
            {title}
          </Text>
          <Text className="text-blue-800 dark:text-blue-200 text-xs mt-1">
            {message}
          </Text>
          {actionText && (
            <Text className="text-blue-700 dark:text-blue-300 text-xs font-medium mt-2">
              ✓ {actionText}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default {
  OfflineIndicator,
  SyncBadge,
  OfflineMessage,
};
