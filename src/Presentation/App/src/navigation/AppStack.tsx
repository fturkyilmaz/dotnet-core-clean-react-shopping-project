import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'node_modules/react-i18next';
import HomeScreen from '@/screens/HomeScreen';
import ProductsScreen from '@/screens/ProductsScreen';
import CartScreen from '@/screens/CartScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CategoryScreen from '@/screens/CategoryScreen';
import CustomHeader from '@/components/CustomHeader';

const Tab = createBottomTabNavigator();

export default function AppStack() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    return (
        <Tab.Navigator
            screenOptions={{
                header: ({ route, options }) => (
                    <CustomHeader
                        title={options.title || route.name}
                        showBack={route.name === 'Products' && (route.params as any)?.category}
                    />
                ),
                tabBarStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
                },
                tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
                tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
                tabBarShowLabel: true,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: t('navigation.home'),
                    tabBarLabel: t('navigation.home'),
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
                    tabBarLabel: t('navigation.categories'),
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
                    tabBarLabel: t('navigation.products'),
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
                    tabBarLabel: t('navigation.cart'),
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
                    tabBarLabel: t('navigation.profile'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
