import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, AppDispatch } from '@/presentation/store';
import RootNavigator from '@/presentation/shared/navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@/presentation/shared/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { View, ActivityIndicator } from 'react-native';
import { OfflineIndicator } from '@/presentation/shared/components/OfflineIndicator';
import { useSignalRConnection } from '@/presentation/shared/hooks/useSignalRConnection';
import { useNetworkStatus } from '@/presentation/shared/hooks/useNetworkStatus';
import sqliteRepository from '@/infrastructure/persistence/SQLiteRepository';
import analyticsService from '@/infrastructure/services/AnalyticsService';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { queryClient } from '@/infrastructure/config/queryClient';
import { initializeAuth } from '@/presentation/store/slices/authSlice';

function MainApp() {
    const dispatch = useDispatch<AppDispatch>();
    const { isOnline, isSyncing, pendingCount } = useNetworkStatus();
    useSignalRConnection();

    // Initialize auth state from secure storage on app startup
    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    useEffect(() => {
        const initAnalytics = async () => {
            try {
                console.log('✅ App: Analytics initialized');
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
        <View className="flex-1 bg-background dark:bg-background-dark">
            <OfflineIndicator
                isOnline={isOnline}
                isSyncing={isSyncing}
                pendingCount={pendingCount}
            />
            <RootNavigator />
            <Toast />
        </View>
    );
}

function AppContent() {
    const [isDbReady, setIsDbReady] = useState(false);

    useEffect(() => {
        const initDB = async () => {
            try {
                await sqliteRepository.initialize();
                console.log('App: SQLite database initialized');
                setIsDbReady(true);
            } catch (error) {
                console.error('App: Failed to initialize SQLite database:', error);
                setIsDbReady(true); // fallback: allow app to load
            }
        };

        initDB();

        return () => {
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

function AppInner() {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <QueryClientProvider client={queryClient}>
                            <AppContent />
                        </QueryClientProvider>
                    </PersistGate>
                </Provider>
            </I18nextProvider>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppInner />
        </ThemeProvider>
    );
}
