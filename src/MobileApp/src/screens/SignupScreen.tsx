import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

type SignupScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

// Zod validation schema
const signupSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen({ navigation }: SignupScreenProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: SignupFormData) => {
        setApiError('');
        setLoading(true);

        try {
            // Split name into firstName and lastName
            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

            const response = await api.post('/identity/Register', {
                email: data.email.trim(),
                password: data.password,
                firstName: firstName,
                lastName: lastName,
            });

            setLoading(false);

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Please login with your credentials',
                position: 'top',
                visibilityTime: 3000,
            });

            // Navigate to login after successful registration
            setTimeout(() => {
                navigation.navigate('Login');
            }, 500);
        } catch (err: any) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || err.response?.data?.title || 'Registration failed. Please try again.';
            setApiError(errorMessage);

            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: errorMessage,
                position: 'top',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-6 pt-4">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center mb-6"
                        >
                            <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                        </TouchableOpacity>

                        <View className="mb-8">
                            <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                {t('auth.createAccountTitle')}
                            </Text>
                            <Text className="text-lg text-slate-500 dark:text-slate-400">
                                {t('auth.signUpSubtitle')}
                            </Text>
                        </View>

                        {apiError ? (
                            <View className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-xl p-4 mb-6">
                                <Text className="text-red-600 dark:text-red-400 text-sm font-medium">{apiError}</Text>
                            </View>
                        ) : null}

                        <View className="space-y-5">
                            <View>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.fullName')}</Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                                            placeholder="John Doe"
                                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <Text className="text-red-600 dark:text-red-400 text-sm mt-1 ml-1">{errors.name.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.email')}</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                                            placeholder={t('auth.email')}
                                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-600 dark:text-red-400 text-sm mt-1 ml-1">{errors.email.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.password')}</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                                            placeholder={t('auth.password')}
                                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <Text className="text-red-600 dark:text-red-400 text-sm mt-1 ml-1">{errors.password.message}</Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.confirmPassword')}</Text>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                                            placeholder={t('auth.confirmPassword')}
                                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry
                                        />
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <Text className="text-red-600 dark:text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword.message}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                className="bg-blue-600 dark:bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-200 dark:shadow-none active:bg-blue-700 dark:active:bg-blue-700 mt-4"
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">{t('auth.signUp')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center mt-8 mb-8">
                            <Text className="text-slate-500 dark:text-slate-400">{t('auth.alreadyHaveAccountQuestion')} </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className="text-blue-600 dark:text-blue-400 font-bold">{t('auth.logIn')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
