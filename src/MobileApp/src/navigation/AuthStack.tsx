import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fff' },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
