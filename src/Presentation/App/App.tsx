import './global.css';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/presentation/store';
import RootNavigator from '@/presentation/shared/navigation/RootNavigator';
import { ThemeProvider } from '@/presentation/shared/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { View, ActivityIndicator } from 'react-native';
import { OfflineIndicator } from '@/presentation/shared/components/OfflineIndicator';
import { useSignalRConnection } from '@/presentation/shared/hooks/useSignalRConnection';
import { useNetworkStatus } from '@/presentation/shared/hooks/useNetworkStatus';
import sqliteRepository from '@/infrastructure/persistence/SQLiteRepository';
import analyticsService from '@/infrastructure/services/AnalyticsService';
// import { initializeFirebaseAnalytics } from '@/services/firebaseAnalytics'; // TODO: Migrate this

const queryClient = new QueryClient();

function MainApp() {
    const { isOnline, isSyncing, pendingCount } = useNetworkStatus();
    useSignalRConnection();

    useEffect(() => {
        // Initialize analytics services
        const initAnalytics = async () => {
            try {
                // Initialize Firebase Analytics
                // await initializeFirebaseAnalytics();

                // Initialize Unified Analytics Manager
                // await UnifiedAnalyticsManager.initialize({
                //     enableFirebase: true,
                //     enableLocal: true,
                //     enableCrashlytics: true,
                // });

                console.log('✅ App: Analytics initialized');

                // Track app launch
                analyticsService.logEvent('app_launched', {
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error('App: Failed to initialize analytics:', error);
            }
        };

        initAnalytics();
    }, []);

    return (
        <View className="flex-1">
            <OfflineIndicator isOnline={isOnline} isSyncing={isSyncing} pendingCount={pendingCount} />
            <RootNavigator />
            <Toast />
        </View>
    );
}

function AppContent() {
    const [isDbReady, setIsDbReady] = useState(false);

    useEffect(() => {
        // Initialize SQLite database on app start
        const initDB = async () => {
            try {
                await sqliteRepository.initialize();
                console.log('App: SQLite database initialized');
                setIsDbReady(true);
            } catch (error) {
                console.error('App: Failed to initialize SQLite database:', error);
                // Even if it fails, we might want to let the app load so user can see error or retry
                // But for now, let's set ready to true or maybe handle error state
                setIsDbReady(true);
            }
        };
        initDB();

        return () => {
            // Cleanup on app unmount
            sqliteRepository.close();
        };
    }, []);

    if (!isDbReady) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return <MainApp />;
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
