import './global.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { View } from 'react-native';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import sqliteDb from '@/services/sqlite';

const queryClient = new QueryClient();

function AppContent() {
    const { isOnline, isSyncing, pendingCount } = useNetworkStatus();

    useEffect(() => {
        // Initialize SQLite database on app start
        const initDB = async () => {
            try {
                await sqliteDb.initialize();
                console.log('App: SQLite database initialized');
            } catch (error) {
                console.error('App: Failed to initialize SQLite database:', error);
            }
        };
        initDB();

        return () => {
            // Cleanup on app unmount
            sqliteDb.close();
        };
    }, []);

    return (
        <View className="flex-1">
            <OfflineIndicator isOnline={isOnline} isSyncing={isSyncing} pendingCount={pendingCount} />
            <RootNavigator />
            <Toast />
        </View>
    );
}

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider>
                            <AppContent />
                        </ThemeProvider>
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </I18nextProvider>
    );
}
