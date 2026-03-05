import { Redirect, Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/presentation/shared/components/Icon';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { StatusBar } from 'react-native';

export default function TabLayout() {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#1e293b' : '#ffffff'} />
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    },
                    headerTintColor: isDark ? '#ffffff' : '#1e293b',
                    headerShadowVisible: false,
                    tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
                    tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
                    tabBarStyle: {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderTopColor: isDark ? '#334155' : '#e2e8f0',
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t('navigation.home'),
                        headerTitle: t('navigation.home'),
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="categories"
                    options={{
                        title: t('navigation.categories'),
                        headerTitle: t('navigation.categories'),
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="grid" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="products"
                    options={{
                        title: t('navigation.products'),
                        headerTitle: t('navigation.products'),
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="pricetag" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="cart"
                    options={{
                        title: t('navigation.cart'),
                        headerTitle: t('navigation.cart'),
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="cart" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: t('navigation.profile'),
                        headerTitle: t('navigation.profile'),
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="person" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="checkout"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="order-success"
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
        </>
    );
}
