import { View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import api from '@/services/api';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { RegisterFormData } from '../validation/registerSchema';
import { useAppNavigation } from '@/presentation/shared/hooks/useAppNavigation';

export default function SignupScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigation = useAppNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
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
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-6 pt-4">
                        <AccessibleTouchable
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center mb-6"
                        >
                            <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                        </AccessibleTouchable>

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

                        <View className="gap-y-5">
                            <View>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.fullName')}</Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-primary focus:bg-white dark:focus:bg-slate-800"
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
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-primary focus:bg-white dark:focus:bg-slate-800"
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
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-primary focus:bg-white dark:focus:bg-slate-800"
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
                                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-primary focus:bg-white dark:focus:bg-slate-800"
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

                            <AccessibleTouchable
                                className="bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-blue-200 dark:shadow-none active:bg-primary-700 dark:active:bg-primary-700 mt-4"
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">{t('auth.signUp')}</Text>
                                )}
                            </AccessibleTouchable>
                        </View>

                        <View className="flex-row justify-center mt-8 mb-8">
                            <View className="flex-row items-center">
                                <Text className="text-slate-500 dark:text-slate-400">{t('auth.alreadyHaveAccountQuestion')} </Text>
                                <AccessibleTouchable onPress={() => navigation.navigate('Login')}>
                                    <Text className="text-primary dark:text-blue-400 font-bold">{t('auth.logIn')}</Text>
                                </AccessibleTouchable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
