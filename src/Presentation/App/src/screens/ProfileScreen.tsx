import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchUserProfile } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    console.log('user', user);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const changeLanguage = async (lang: string) => {
        try {
            console.log('Changing language to:', lang);

            await AsyncStorage.setItem('user-language', lang);
            await i18n.changeLanguage(lang);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const getDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.username || 'User';
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Section */}
                <View className="bg-white dark:bg-slate-800 px-6 pt-6 pb-8 rounded-b-3xl shadow-sm border-b border-slate-100 dark:border-slate-700 mb-6">
                    <View className="flex-row items-center mb-6">
                        <View className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center mr-4 border-2 border-white dark:border-slate-600 shadow-sm">
                            <Ionicons name="person" size={40} color={theme === 'dark' ? '#94a3b8' : '#94a3b8'} />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                                {getDisplayName()}
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400">
                                {user?.email || 'user@example.com'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl items-center">
                            <Text className="text-blue-700 dark:text-blue-400 font-bold text-xl mb-1">12</Text>
                            <Text className="text-blue-600 dark:text-blue-400 text-xs font-medium uppercase">Orders</Text>
                        </View>
                        <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl items-center">
                            <Text className="text-purple-700 dark:text-purple-400 font-bold text-xl mb-1">5</Text>
                            <Text className="text-purple-600 dark:text-purple-400 text-xs font-medium uppercase">Reviews</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View className="px-6">
                    <Text className="text-slate-900 dark:text-white font-bold text-lg mb-4">{t('profile.settings')}</Text>

                    <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                        <View className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full items-center justify-center">
                                    <Ionicons name="language-outline" size={20} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-semibold text-base">{t('profile.language')}</Text>
                            </View>

                            <View className="flex-row bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                                <AccessibleTouchable
                                    accessibilityLabel={t('profile.languageEnglish')}
                                    className={`px-3 py-1.5 rounded-md ${i18n.language === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                                    onPress={() => changeLanguage('en')}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'en' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>EN</Text>
                                </AccessibleTouchable>
                                <AccessibleTouchable
                                    accessibilityLabel={t('profile.languageTurkish')}
                                    className={`px-3 py-1.5 rounded-md ${i18n.language === 'tr' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                                    onPress={() => changeLanguage('tr')}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'tr' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>TR</Text>
                                </AccessibleTouchable>
                            </View>
                        </View>

                        {/* Dark Mode Toggle */}
                        <View className="flex-row items-center justify-between py-3 mt-2 border-t border-slate-50 dark:border-slate-700">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full items-center justify-center">
                                    <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={theme === 'dark' ? '#fbbf24' : '#f59e0b'} />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-semibold text-base">{t('profile.darkMode')}</Text>
                            </View>

                            <AccessibleTouchable
                                accessibilityLabel={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                className={`w-14 h-8 rounded-full justify-center ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
                                onPress={toggleTheme}
                            >
                                <View
                                    className="w-6 h-6 rounded-full bg-white shadow-md"
                                    style={{
                                        marginLeft: theme === 'dark' ? 28 : 4,
                                    }}
                                />
                            </AccessibleTouchable>
                        </View>
                    </View>

                    <Text className="text-slate-900 dark:text-white font-bold text-lg mb-4">{t('profile.account')}</Text>

                    <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                        <AccessibleTouchable accessibilityLabel={t('profile.notifications')} className="flex-row items-center justify-between py-3 border-b border-slate-50 dark:border-slate-700">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full items-center justify-center">
                                    <Ionicons name="notifications-outline" size={20} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-semibold text-base">{t('profile.notifications')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                        </AccessibleTouchable>

                        <AccessibleTouchable accessibilityLabel={t('profile.privacySecurity')} className="flex-row items-center justify-between py-3 border-b border-slate-50 dark:border-slate-700">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full items-center justify-center">
                                    <Ionicons name="shield-checkmark-outline" size={20} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-semibold text-base">{t('profile.privacySecurity')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                        </AccessibleTouchable>

                        <AccessibleTouchable
                            accessibilityLabel={t('auth.logout')}
                            className="flex-row items-center justify-between py-3 mt-2"
                            onPress={handleLogout}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center">
                                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                                </View>
                                <Text className="text-red-600 font-semibold text-base">{t('auth.logout')}</Text>
                            </View>
                        </AccessibleTouchable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
