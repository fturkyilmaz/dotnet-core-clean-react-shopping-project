import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSignalRConnection } from '@/hooks/useSignalRConnection';
import { useCartSignal } from '@/hooks/useCartSignal';
import { useOrderSignal } from '@/hooks/useOrderSignal';
import { useNotificationSignal } from '@/hooks/useNotificationSignal';

export default function NotificationsScreen() {
    const { t } = useTranslation();
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
        <View style={styles.container}>
            <Text style={styles.title}>{t('notifications.title')}</Text>

            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>SignalR Status:</Text>
                <View style={[styles.statusIndicator, isConnected ? styles.connected : styles.disconnected]} />
                <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
            </View>

            {expoPushToken && (
                <View style={styles.tokenContainer}>
                    <Text style={styles.tokenLabel}>Push Token:</Text>
                    <Text style={styles.tokenText} numberOfLines={1}>{expoPushToken}</Text>
                </View>
            )}

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, !isConnected && styles.buttonDisabled]}
                    onPress={testNotification}
                    disabled={!isConnected}
                >
                    <Text style={styles.buttonText}>Test SignalR Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={testLocalNotification}
                >
                    <Text style={styles.buttonText}>Test Local Notification</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Real-time Features:</Text>
                <Text style={styles.infoText}>• Cart updates across devices</Text>
                <Text style={styles.infoText}>• Order status notifications</Text>
                <Text style={styles.infoText}>• Push notifications</Text>
                <Text style={styles.infoText}>• Live admin updates</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    connected: {
        backgroundColor: '#4CAF50',
    },
    disconnected: {
        backgroundColor: '#F44336',
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    tokenContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    tokenLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    tokenText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
    buttonsContainer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
});
