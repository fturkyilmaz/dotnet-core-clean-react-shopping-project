import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'node_modules/react-i18next';
import { useSignalRConnection } from '@hooks/useSignalRConnection';
import { useCartSignal } from '@hooks/useCartSignal';
import { useOrderSignal } from '@hooks/useOrderSignal';
import { useNotificationSignal } from '@hooks/useNotificationSignal';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const {
        notificationConnection,
        cartConnection,
        orderConnection,
        isConnected,
        expoPushToken,
        sendLocalNotification,
    } = useSignalRConnection();

    // Setup notification listeners
    useCartSignal(cartConnection);
    useOrderSignal(orderConnection);
    useNotificationSignal(notificationConnection);

    const testNotification = async () => {
        if (notificationConnection) {
            try {
                await notificationConnection.invoke('SendTestNotification', 'This is a test notification!');
            } catch (error) {
                console.error('Error sending test notification:', error);
            }
        }
    };

    const testLocalNotification = async () => {
        await sendLocalNotification(
            'Local Notification',
            'This is a local notification test!',
            { type: 'test' }
        );
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-background-dark">
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {t('notifications.title')}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400">
                        Manage your real-time notifications
                    </Text>
                </View>

                {/* Connection Status */}
                <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                            SignalR Status
                        </Text>
                        <View className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    </View>
                    <View className="flex-row items-center">
                        <View className={`px-3 py-1.5 rounded-lg ${isConnected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <Text className={`text-sm font-semibold ${isConnected ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Push Token */}
                {expoPushToken && (
                    <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="key-outline" size={20} color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                            <Text className="text-base font-semibold text-slate-900 dark:text-white ml-2">
                                Push Token
                            </Text>
                        </View>
                        <Text className="text-xs text-slate-500 dark:text-slate-400 font-mono" numberOfLines={1}>
                            {expoPushToken}
                        </Text>
                    </View>
                )}

                {/* Test Buttons */}
                <View className="mb-4">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        Test Notifications
                    </Text>

                    <AccessibleTouchable
                        accessibilityLabel="Test SignalR Notification"
                        className={`rounded-xl py-4 px-5 mb-3 shadow-sm ${isConnected
                                ? 'bg-primary dark:bg-primary active:bg-primary-700 dark:active:bg-primary-700'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                        onPress={testNotification}
                        disabled={!isConnected}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="cloud-outline" size={20} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">
                                Test SignalR Notification
                            </Text>
                        </View>
                    </AccessibleTouchable>

                    <AccessibleTouchable
                        accessibilityLabel="Test Local Notification"
                        className="bg-purple-600 dark:bg-purple-600 rounded-xl py-4 px-5 shadow-sm active:bg-purple-700 dark:active:bg-purple-700"
                        onPress={testLocalNotification}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="phone-portrait-outline" size={20} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">
                                Test Local Notification
                            </Text>
                        </View>
                    </AccessibleTouchable>
                </View>

                {/* Features Info */}
                <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="information-circle-outline" size={24} color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                        <Text className="text-lg font-bold text-slate-900 dark:text-white ml-2">
                            Real-time Features
                        </Text>
                    </View>

                    <View className="space-y-3">
                        <View className="flex-row items-center py-2">
                            <View className="w-2 h-2 rounded-full bg-primary mr-3" />
                            <Text className="text-slate-700 dark:text-slate-300 flex-1">
                                Cart updates across devices
                            </Text>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>

                        <View className="flex-row items-center py-2">
                            <View className="w-2 h-2 rounded-full bg-primary mr-3" />
                            <Text className="text-slate-700 dark:text-slate-300 flex-1">
                                Order status notifications
                            </Text>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>

                        <View className="flex-row items-center py-2">
                            <View className="w-2 h-2 rounded-full bg-primary mr-3" />
                            <Text className="text-slate-700 dark:text-slate-300 flex-1">
                                Push notifications
                            </Text>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>

                        <View className="flex-row items-center py-2">
                            <View className="w-2 h-2 rounded-full bg-primary mr-3" />
                            <Text className="text-slate-700 dark:text-slate-300 flex-1">
                                Live admin updates
                            </Text>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
