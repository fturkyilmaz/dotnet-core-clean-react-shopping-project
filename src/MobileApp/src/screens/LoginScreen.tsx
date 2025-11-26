import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
};

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('admin@test.com');
    const [password, setPassword] = useState('Admin123!');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        await dispatch(login({ email, password }));
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="flex-1 px-8 justify-center">
                        <View className="mb-10">
                            <Text className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                                {t('auth.welcome')}
                            </Text>
                            <Text className="text-lg text-slate-500">
                                {t('auth.login')}
                            </Text>
                        </View>

                        {error && (
                            <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                                <Text className="text-red-600 text-sm font-medium">{error}</Text>
                            </View>
                        )}

                        <View className="space-y-6">
                            <View>
                                <Text className="text-slate-700 font-semibold mb-2 ml-1">{t('auth.email')}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base focus:border-blue-500 focus:bg-white"
                                    placeholder={t('auth.email')}
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View>
                                <Text className="text-slate-700 font-semibold mb-2 ml-1 mt-4">{t('auth.password')}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base focus:border-blue-500 focus:bg-white"
                                    placeholder={t('auth.password')}
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                className="items-end my-4"
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text className="text-blue-600 font-semibold">Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-200 active:bg-blue-700"
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">{t('auth.loginButton')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-slate-500">{t('auth.dontHaveAccount')} </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text className="text-blue-600 font-bold">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
