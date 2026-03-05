import { View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/presentation/shared/components/Icon';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
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

                        {!sent ? (
                            <>
                                {/* Header */}
                                <View className="items-center mb-8">
                                    <View className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-orange-500' : 'bg-orange-500'} items-center justify-center mb-4 shadow-lg shadow-orange-500/30`}>
                                        <Icon name="key" size={36} color="white" />
                                    </View>
                                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2 text-center`}>
                                        {t('auth.forgotPasswordTitle')}
                                    </Text>
                                    <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center px-4`}>
                                        {t('auth.forgotPasswordSubtitle')}
                                    </Text>
                                </View>

                                {/* Form Card */}
                                <View className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl ${isDark ? 'shadow-slate-900/50' : 'shadow-slate-200/50'}`}>
                                    <View>
                                        <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2 ml-1`}>
                                            {t('auth.email')}
                                        </Text>
                                        <View className={`flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl px-4 mb-6`}>
                                            <Icon name="mail-outline" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                                            <TextInput
                                                className={`flex-1 py-3.5 ml-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                placeholder={t('auth.email')}
                                                placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>

                                        <AccessibleTouchable
                                            className="bg-orange-500 rounded-xl py-4 items-center shadow-lg shadow-orange-500/30 active:bg-orange-600"
                                            onPress={handleResetPassword}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <View className="flex-row items-center">
                                                    <Text className="text-white font-bold text-lg">
                                                        {t('auth.submit')}
                                                    </Text>
                                                    <Icon name="arrow-forward" size={20} color="white" className="ml-2" />
                                                </View>
                                            )}
                                        </AccessibleTouchable>
                                    </View>
                                </View>
                            </>
                        ) : (
                            /* Success State */
                            <View className="flex-1 items-center justify-center py-8">
                                <View className={`w-24 h-24 rounded-full ${isDark ? 'bg-green-500/20' : 'bg-green-100'} items-center justify-center mb-6`}>
                                    <Icon name="checkmark-circle" size={56} color="#16a34a" />
                                </View>
                                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2 text-center`}>
                                    {t('auth.checkEmail')}
                                </Text>
                                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center px-8 mb-8`}>
                                    {t('auth.recoverySent')}
                                </Text>
                                <AccessibleTouchable
                                    className="bg-blue-600 rounded-xl py-4 px-8 items-center shadow-lg shadow-blue-600/30 active:bg-blue-700"
                                    onPress={() => router.push('/login')}
                                >
                                    <Text className="text-white font-bold text-lg">
                                        {t('auth.backToLogin')}
                                    </Text>
                                </AccessibleTouchable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
