import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import secureStorage from '@/infrastructure/services/SecureStorageService';
import { setToken } from '@/presentation/store/slices/authSlice';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';

export default function RootNavigator() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await secureStorage.getItem('token');
                if (token) {
                    dispatch(setToken(token));
                }
            } catch (e) {
                console.error('Failed to load token', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        isAuthenticated ? <AppStack /> : <AuthStack />
    );
}
