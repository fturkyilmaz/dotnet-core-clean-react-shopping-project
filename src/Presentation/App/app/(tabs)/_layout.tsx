import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { Stack } from 'expo-router/stack';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { useTheme } from '@/presentation/shared/context/ThemeContext';

export default function TabLayout() {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" options={{ title: t('navigation.home') }} />
            <Stack.Screen name="categories" options={{ title: t('navigation.categories') }} />
            <Stack.Screen name="products" options={{ title: t('navigation.products') }} />
            <Stack.Screen name="cart" options={{ title: t('navigation.cart') }} />
            <Stack.Screen name="profile" options={{ title: t('navigation.profile') }} />
            <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
            <Stack.Screen name="order-success" options={{ presentation: 'card' }} />
        </Stack>
    );
}
