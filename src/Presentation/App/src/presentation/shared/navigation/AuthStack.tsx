import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/presentation/features/Auth/screens/LoginScreen';
import SignupScreen from '@/presentation/features/Auth/screens/RegisterScreen';
import ForgotPasswordScreen from '@/presentation/features/Auth/screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                // headerShown: false, // This line was removed as per instruction
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}
