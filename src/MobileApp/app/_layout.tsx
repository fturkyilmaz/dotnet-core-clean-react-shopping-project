import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
                    <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
                    <Stack.Screen name="products" options={{ title: 'Products' }} />
                    <Stack.Screen name="cart" options={{ title: 'Cart' }} />
                </Stack>
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </Provider>
    );
}
