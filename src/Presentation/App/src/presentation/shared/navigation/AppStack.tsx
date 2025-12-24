import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Screens
import HomeScreen from '@/presentation/features/Product/screens/HomeScreen';
import ProductsScreen from '@/presentation/features/Product/screens/ProductsScreen';
import CartScreen from '@/presentation/features/Cart/screens/CartScreen';
import ProfileScreen from '@/presentation/features/Auth/screens/ProfileScreen';
import CategoryScreen from '@/presentation/features/Product/screens/CategoryScreen';
import ProductDetailScreen from '@/presentation/features/Product/screens/ProductDetailScreen';
import OrderSuccessScreen from '@/presentation/features/Cart/screens/OrderSuccessScreen';
import CheckoutScreen from '@/presentation/features/Cart/screens/CheckoutScreen';
import CustomHeader from '@/presentation/shared/components/CustomHeader';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    console.log("isDark", isDark);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
                },
                tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
                tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
                tabBarShowLabel: true,
                headerShown: true,
                header: ({ route, options }) => (
                    <CustomHeader
                        title={options.title || route.name}
                        showBack={(route.params as any)?.category}
                    />
                ),
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: t('navigation.home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoryScreen}
                options={{
                    title: t('navigation.categories'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Products"
                component={ProductsScreen}
                options={{
                    title: t('navigation.products'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bag-handle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    title: t('navigation.cart'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: t('navigation.profile'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppStack() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (

        <View className={isDark ? 'dark flex-1' : 'flex-1'}>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
                <Stack.Screen name="MainTabs" component={TabNavigator} options={{
                    presentation: 'card',
                }} />

                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetailScreen}
                    options={{
                        presentation: 'card',
                    }}
                />
                <Stack.Screen
                    name="Checkout"
                    component={CheckoutScreen}
                    options={{ presentation: 'card' }}
                />
                <Stack.Screen
                    name="OrderSuccess"
                    component={OrderSuccessScreen}
                    options={{ presentation: 'card' }}
                />
            </Stack.Navigator>
        </View>

    );
}
