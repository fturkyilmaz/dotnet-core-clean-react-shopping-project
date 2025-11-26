import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import ProductsScreen from '@/screens/ProductsScreen';
import CartScreen from '@/screens/CartScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                contentStyle: { backgroundColor: '#f8fafc' },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Products"
                component={ProductsScreen}
                options={{ title: 'Products' }}
            />
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: 'Shopping Cart' }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
            />
        </Stack.Navigator>
    );
}
