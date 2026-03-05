import {
    View,
    Text,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { login, biometricLogin } from '@/presentation/store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/presentation/shared/components/FormInput';
import { LoginFormData, loginSchema } from '../validation/loginSchema';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks/useRedux';
import { useRouter } from 'expo-router';
import { Icon } from '@/presentation/shared/components/Icon';
import { useBiometrics } from '@/presentation/shared/hooks/useBiometrics';

export default function LoginScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const router = useRouter();
    const { isAvailable, authenticate, biometricName } = useBiometrics();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@test.com',
            password: 'Admin123!',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await dispatch(login(data));
        if (login.fulfilled.match(result)) {
            router.replace('/(tabs)');
        }
    };

    const handleBiometricLogin = async () => {
        const success = await authenticate();
        if (success) {
            await dispatch(biometricLogin());
        } else {
            Alert.alert('Biometric Login', 'Authentication failed or cancelled.');
        }
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Section */}
                    <View className="px-6 pt-12 pb-8">
                        {/* Logo/Brand */}
                        <View className="items-center mb-8">
                            <View className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-blue-600' : 'bg-blue-600'} items-center justify-center mb-4 shadow-lg shadow-blue-500/30`}>
                                <Icon name="cart" size={40} color="white" />
                            </View>
                            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                ShopHub
                            </Text>
                        </View>

                        {/* Welcome Text */}
                        <View className="mb-8">
                            <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                                {t('auth.welcome')}
                            </Text>
                            <Text className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t('auth.login')}
                            </Text>
                        </View>

                        {/* Error Alert */}
                        {error && (
                            <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex-row items-center">
                                <Icon name="alert-circle" size={20} color="#ef4444" className="mr-3" />
                                <Text className="text-red-500 text-sm flex-1">
                                    {error}
                                </Text>
                            </View>
                        )}

                        {/* Login Card */}
                        <View className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl ${isDark ? 'shadow-slate-900/50' : 'shadow-slate-200/50 space-y-2'}`}>
                            {/* Form */}
                            <View className="space-y-5">
                                <FormInput<LoginFormData>
                                    control={control}
                                    name="email"
                                    placeholder={t('auth.email')}
                                    keyboardType="email-address"
                                    errors={errors}
                                    containerClassName="mb-4"
                                    inputClassName={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                />

                                <FormInput<LoginFormData>
                                    control={control}
                                    name="password"
                                    placeholder={t('auth.password')}
                                    secureTextEntry
                                    errors={errors}
                                    containerClassName=""
                                    inputClassName={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                />

                                {/* Forgot Password */}
                                <View className="flex-row justify-end mb-2">
                                    <AccessibleTouchable
                                        onPress={() => router.push('/forgot-password')}
                                    >
                                        <Text className="text-blue-500 text-sm font-medium">
                                            {t('auth.forgotPassword')}
                                        </Text>
                                    </AccessibleTouchable>
                                </View>

                                {/* Biometric Button */}
                                {isAvailable && (
                                    <AccessibleTouchable
                                        accessibilityLabel={`Login with ${biometricName}`}
                                        className={`flex-row items-center justify-center py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} mb-4`}
                                        onPress={handleBiometricLogin}
                                    >
                                        <Icon
                                            name="finger-print"
                                            size={24}
                                            color={isDark ? '#60a5fa' : '#2563eb'}
                                        />
                                        <Text className={`ml-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            Login with {biometricName}
                                        </Text>
                                    </AccessibleTouchable>
                                )}

                                {/* Login Button */}
                                <AccessibleTouchable
                                    accessibilityLabel={t('auth.loginButton')}
                                    className="bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-600/30 active:bg-blue-700"
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Text className="text-white font-bold text-lg">
                                                {t('auth.loginButton')}
                                            </Text>
                                            <Icon name="arrow-forward" size={20} color="white" className="ml-2" />
                                        </View>
                                    )}
                                </AccessibleTouchable>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                            <Text className={`px-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                OR
                            </Text>
                            <View className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                        </View>

                        {/* Footer */}
                        <View className="flex-row justify-center items-center">
                            <Text className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t('auth.dontHaveAccount')}{' '}
                            </Text>
                            <AccessibleTouchable
                                accessibilityLabel={t('auth.signUp')}
                                onPress={() => router.push('/signup')}
                            >
                                <Text className="text-blue-500 font-bold">
                                    {t('auth.signUp')}
                                </Text>
                            </AccessibleTouchable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
