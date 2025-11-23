import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Products: undefined;
    Cart: undefined;
};

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigation.replace('Products');
        }
    };

    return (
        <View className="flex-1 bg-gray-50 px-6 justify-center">
            <View className="bg-white rounded-2xl p-8 shadow-lg">
                <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
                <Text className="text-gray-500 mb-8">Sign in to continue</Text>

                {error && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <Text className="text-red-600 text-sm">{error}</Text>
                    </View>
                )}

                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Email</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 font-medium mb-2">Password</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 rounded-lg py-4 items-center mb-4"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-semibold text-lg">Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Text className="text-blue-600 font-medium">Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
