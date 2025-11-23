import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: '#2563EB',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    >
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
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
                    </Stack.Navigator>
                </NavigationContainer>
            </QueryClientProvider>
        </Provider>
    );
}
