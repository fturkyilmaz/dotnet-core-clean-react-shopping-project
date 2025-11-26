import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type AuthStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};

type ForgotPasswordScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResetPassword = async () => {
        // TODO: Implement reset password logic
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
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
                                {t('auth.forgotPasswordTitle')}
                            </Text>
                            <Text className="text-lg text-slate-500 dark:text-slate-400">
                                {t('auth.forgotPasswordSubtitle')}
                            </Text>
                        </View>

                        {!sent ? (
                            <View className="space-y-6">
                                <View>
                                    <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1">{t('auth.email')}</Text>
                                    <TextInput
                                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                                        placeholder={t('auth.email')}
                                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity
                                    className="bg-blue-600 dark:bg-blue-600 rounded-xl py-4 items-center shadow-lg shadow-blue-200 dark:shadow-none active:bg-blue-700 dark:active:bg-blue-700"
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg">{t('auth.submit')}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="items-center py-8">
                                <View className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="checkmark" size={40} color="#16a34a" />
                                </View>
                                <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('auth.checkEmail')}</Text>
                                <Text className="text-slate-500 dark:text-slate-400 text-center mb-8">
                                    {t('auth.recoverySent')}
                                </Text>
                                <TouchableOpacity
                                    className="bg-slate-900 dark:bg-slate-800 rounded-xl py-4 px-8 items-center"
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text className="text-white font-bold text-lg">{t('auth.backToLogin')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
