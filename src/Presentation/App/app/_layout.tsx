import { useEffect, useState } from 'react';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

import { store, persistor, AppDispatch } from '@/presentation/store';
import { queryClient } from '@/infrastructure/config/queryClient';
import { setToken } from '@/presentation/store/slices/authSlice';
import { ThemeProvider, useTheme } from '@/presentation/shared/context/ThemeContext';
import { OfflineIndicator } from '@/presentation/shared/components/OfflineIndicator';
import { useNetworkStatus } from '@/presentation/shared/hooks/useNetworkStatus';
import { useSignalRConnection } from '@/presentation/shared/hooks/useSignalRConnection';
import analyticsService from '@/infrastructure/services/AnalyticsService';
import sqliteRepository from '@/infrastructure/persistence/SQLiteRepository';
import i18n from '@/i18n';

import '@/styles/global.css';

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    dispatch(setToken(token));
                }
            } catch (error) {
                console.error('Failed to load token', error);
            } finally {
                setIsLoading(false);
            }
        };

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

        initializeAuth();
        initAnalytics();
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return <>{children}</>;
}

function AppContent() {
    const { isOnline, isSyncing, pendingCount } = useNetworkStatus();
    useSignalRConnection();

    return (
        <View className="flex-1">
            <OfflineIndicator
                isOnline={isOnline}
                isSyncing={isSyncing}
                pendingCount={pendingCount}
            />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
            </Stack>
            <Toast />
            <StatusBar style="auto" />
        </View>
    );
}

function AppInitializer() {
    const [isDbReady, setIsDbReady] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const initDB = async () => {
            try {
                await sqliteRepository.initialize();
                console.log('App: SQLite database initialized');
                setIsDbReady(true);
            } catch (error) {
                console.error('App: Failed to initialize SQLite database:', error);
                setIsDbReady(true);
            }
        };

        initDB();

        return () => {
            sqliteRepository.close();
        };
    }, []);

    if (!isDbReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return <AppContent />;
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <I18nextProvider i18n={i18n}>
                        <ThemeProvider>
                            <AuthInitializer>
                                <AppInitializer />
                            </AuthInitializer>
                        </ThemeProvider>
                    </I18nextProvider>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}
