import {
    View,
    Text,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { login } from '@/presentation/store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/presentation/shared/components/FormInput';
import { LoginFormData, loginSchema } from '../validation/loginSchema';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks/useRedux';
import { useAppNavigation } from '@/presentation/shared/hooks/useAppNavigation';

export default function LoginScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const { theme } = useTheme();
    const navigation = useAppNavigation();

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
        await dispatch(login(data));
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <View className="flex-1 px-8 justify-between">
                    {/* Header */}
                    <View className="mt-12">
                        <Text className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            {t('auth.welcome')}
                        </Text>
                        <Text className="text-lg text-slate-500 dark:text-slate-400">
                            {t('auth.login')}
                        </Text>
                    </View>

                    {/* Error */}
                    {error && (
                        <View className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-xl p-4 my-4">
                            <Text className="text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Form */}
                    <View className="flex-1 justify-center">
                        <FormInput<LoginFormData>
                            control={control}
                            name="email"
                            placeholder={t('auth.email')}
                            keyboardType="email-address"
                            errors={errors}
                            containerClassName="mb-6"
                            inputClassName="bg-slate-50 dark:bg-slate-800"
                        />

                        <FormInput<LoginFormData>
                            control={control}
                            name="password"
                            placeholder={t('auth.password')}
                            secureTextEntry
                            errors={errors}
                            containerClassName="mb-6"
                            inputClassName="bg-slate-50 dark:bg-slate-800"
                        />

                        <AccessibleTouchable
                            accessibilityLabel={t('auth.loginButton')}
                            className="bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-blue-200 dark:shadow-none active:bg-primary-700 dark:active:bg-primary-700"
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    {t('auth.loginButton')}
                                </Text>
                            )}
                        </AccessibleTouchable>
                    </View>

                    {/* Footer */}
                    <View className="mb-8">
                        <View className="flex-row justify-center mt-3">
                            <Text className="text-slate-500 dark:text-slate-400">
                                {t('auth.dontHaveAccount')}{' '}
                            </Text>
                            <AccessibleTouchable
                                accessibilityLabel={t('auth.signUp')}
                                onPress={() => navigation.navigate('Signup')}
                            >
                                <Text className="text-primary dark:text-blue-400 font-bold">
                                    {t('auth.signUp')}
                                </Text>
                            </AccessibleTouchable>
                        </View>

                        <AccessibleTouchable
                            accessibilityLabel={t('auth.forgotPassword')}
                            className="items-end mt-2"
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text className="text-primary dark:text-blue-400 font-semibold">
                                {t('auth.forgotPassword')}
                            </Text>
                        </AccessibleTouchable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
