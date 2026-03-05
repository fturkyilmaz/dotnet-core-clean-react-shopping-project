import { View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/presentation/shared/components/Icon';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { RegisterFormData } from '../validation/registerSchema';
import { useRouter } from 'expo-router';
import { usePostApiV1IdentityRegister } from '@/infrastructure/api/identity/identity';
import type { RegisterCommand } from '@/infrastructure/api/generated.schemas';

export default function SignupScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [apiError, setApiError] = useState('');
    const router = useRouter();

    const registerMutation = usePostApiV1IdentityRegister({
        mutation: {
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'Please login with your credentials',
                    position: 'top',
                    visibilityTime: 3000,
                });
                setTimeout(() => {
                    router.push('/login');
                }, 500);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || error.response?.data?.title || 'Registration failed. Please try again.';
                setApiError(errorMessage);
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: errorMessage,
                    position: 'top',
                    visibilityTime: 3000,
                });
            },
        },
    });

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

        const nameParts = data.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

        const registerCommand: RegisterCommand = {
            email: data.email.trim(),
            password: data.password,
            firstName: firstName,
            lastName: lastName,
        };

        registerMutation.mutate({ data: registerCommand });
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="px-6 pt-6 pb-8">
                        {/* Back Button */}
                        <AccessibleTouchable
                            onPress={() => router.back()}
                            className={`w-12 h-12 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-full items-center justify-center mb-6 shadow-sm`}
                        >
                            <Icon
                                name="arrow-back"
                                size={22}
                                color={isDark ? '#e2e8f0' : '#334155'}
                            />
                        </AccessibleTouchable>

                        {/* Header */}
                        <View className="items-center mb-8">
                            <View className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-blue-600' : 'bg-blue-600'} items-center justify-center mb-4 shadow-lg shadow-blue-500/30`}>
                                <Icon name="person-add" size={32} color="white" />
                            </View>
                            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                                {t('auth.createAccountTitle')}
                            </Text>
                            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center`}>
                                {t('auth.signUpSubtitle')}
                            </Text>
                        </View>

                        {/* Error Alert */}
                        {apiError ? (
                            <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex-row items-center">
                                <Icon name="alert-circle" size={20} color="#ef4444" className="mr-3" />
                                <Text className="text-red-500 text-sm flex-1">
                                    {apiError}
                                </Text>
                            </View>
                        ) : null}

                        {/* Form Card */}
                        <View className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl ${isDark ? 'shadow-slate-900/50' : 'shadow-slate-200/50 space-y-2'}`}>
                            <View className="space-y-5">
                                {/* Name Input */}
                                <View>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2 ml-1`}>
                                        {t('auth.fullName')}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4`}>
                                                <Icon name="person-outline" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                                                <TextInput
                                                    className={`flex-1 py-3.5 ml-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                    placeholder="John Doe"
                                                    placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            </View>
                                        )}
                                    />
                                    {errors.name && (
                                        <Text className="text-red-500 text-sm mt-1 ml-1">{errors.name.message}</Text>
                                    )}
                                </View>

                                {/* Email Input */}
                                <View className='space-y-2'>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2 ml-1`}>
                                        {t('auth.email')}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="email"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4`}>
                                                <Icon name="mail-outline" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                                                <TextInput
                                                    className={`flex-1 py-3.5 ml-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                    placeholder={t('auth.email')}
                                                    placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                />
                                            </View>
                                        )}
                                    />
                                    {errors.email && (
                                        <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</Text>
                                    )}
                                </View>

                                {/* Password Input */}
                                <View>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2 ml-1`}>
                                        {t('auth.password')}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4`}>
                                                <Icon name="lock-closed-outline" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                                                <TextInput
                                                    className={`flex-1 py-3.5 ml-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                    placeholder={t('auth.password')}
                                                    placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    secureTextEntry
                                                />
                                            </View>
                                        )}
                                    />
                                    {errors.password && (
                                        <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</Text>
                                    )}
                                </View>

                                {/* Confirm Password Input */}
                                <View>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2 ml-1`}>
                                        {t('auth.confirmPassword')}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="confirmPassword"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4`}>
                                                <Icon name="lock-closed-outline" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                                                <TextInput
                                                    className={`flex-1 py-3.5 ml-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                    placeholder={t('auth.confirmPassword')}
                                                    placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    secureTextEntry
                                                />
                                            </View>
                                        )}
                                    />
                                    {errors.confirmPassword && (
                                        <Text className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</Text>
                                    )}
                                </View>

                                {/* Register Button */}
                                <AccessibleTouchable
                                    className="bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-600/30 active:bg-blue-700 mt-4"
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={registerMutation.isPending}
                                >
                                    {registerMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Text className="text-white font-bold text-lg">
                                                {t('auth.signUp')}
                                            </Text>
                                            <Icon name="arrow-forward" size={20} color="white" className="ml-2" />
                                        </View>
                                    )}
                                </AccessibleTouchable>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="flex-row justify-center mt-8">
                            <Text className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t('auth.alreadyHaveAccountQuestion')}{' '}
                            </Text>
                            <AccessibleTouchable onPress={() => router.push('/login')}>
                                <Text className="text-blue-500 font-bold">
                                    {t('auth.logIn')}
                                </Text>
                            </AccessibleTouchable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
