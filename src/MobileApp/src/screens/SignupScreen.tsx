import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

type SignupScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        // TODO: Implement signup logic
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Login');
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-6 pt-4">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mb-6"
                        >
                            <Ionicons name="arrow-back" size={24} color="#334155" />
                        </TouchableOpacity>

                        <View className="mb-8">
                            <Text className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                                Create Account
                            </Text>
                            <Text className="text-lg text-slate-500">
                                Sign up to get started
                            </Text>
                        </View>

                        <View className="space-y-5">
                            <View>
                                <Text className="text-slate-700 font-semibold mb-2 ml-1">Full Name</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base focus:border-blue-500 focus:bg-white"
                                    placeholder="John Doe"
                                    placeholderTextColor="#94a3b8"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

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
                                <Text className="text-slate-700 font-semibold mb-2 ml-1">{t('auth.password')}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base focus:border-blue-500 focus:bg-white"
                                    placeholder={t('auth.password')}
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View>
                                <Text className="text-slate-700 font-semibold mb-2 ml-1">Confirm Password</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-base focus:border-blue-500 focus:bg-white"
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#94a3b8"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-200 active:bg-blue-700 mt-4"
                                onPress={handleSignup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center mt-8 mb-8">
                            <Text className="text-slate-500">Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className="text-blue-600 font-bold">Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
