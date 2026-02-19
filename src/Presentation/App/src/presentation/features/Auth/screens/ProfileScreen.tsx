import React, { useEffect } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { logout, fetchUserProfile } from '@/presentation/store/slices/authSlice';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import sqliteRepository from '@/infrastructure/persistence/SQLiteRepository';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks/useRedux';

const ProfileScreen = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const handleToggleTheme = () => {
        toggleTheme();
    };

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const changeLanguage = async (lang: string) => {
        try {
            await sqliteRepository.setItem('user-language', lang);
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
            return `${user.firstName} ${user.lastName} `;
        }
        return user?.username || 'User';
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Hero Section with Gradient */}
                <View className={`${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-950' : 'bg-gradient-to-b from-blue-500 to-blue-600'} mt-5`}>
                    {/* Background Pattern */}
                    <View className="inset-0 opacity-10">
                        <View className={`rounded-full ${isDark ? 'bg-slate-700' : 'bg-white'}`} />
                        <View className={`rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'}`} />
                    </View>

                    {/* Profile Card */}
                    <View className="">
                        <View className={`p-6 rounded-3xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                            <View className="flex-row items-center">
                                {/* Avatar */}
                                <View className={`w-20 h-20 rounded-2xl items-center justify-center mr-4 shadow-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                    <Ionicons name="person" size={40} color={isDark ? '#94a3b8' : '#64748b'} />
                                </View>

                                {/* User Info */}
                                <View className="">
                                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {getDisplayName()}
                                    </Text>
                                    <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`} numberOfLines={1}>
                                        {user?.email || 'user@example.com'}
                                    </Text>

                                    {/* Member Badge */}
                                    <View className={`flex-row items-center mt-2 px-2 py-1 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} w-fit`}>
                                        <Ionicons name="star" size={12} color={isDark ? '#60a5fa' : '#2563eb'} />
                                        <Text className={`text-xs font-medium ml-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                            Premium Member
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Stats Row */}
                            <View className="flex-row mt-6 -mx-2">
                                <View className={`flex-1 mx-2 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} items-center`}>
                                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>12</Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Orders</Text>
                                </View>
                                <View className={`flex-1 mx-2 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} items-center`}>
                                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>5</Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reviews</Text>
                                </View>
                                <View className={`flex-1 mx-2 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} items-center`}>
                                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$450</Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Spent</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Spacer for profile card */}
                {/* <View className="h-20" /> */}

                {/* Settings Section */}
                <View className="px-6 mt-4">
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>
                        {t('profile.settings')}
                    </Text>

                    {/* Settings Card */}
                    <View className={`p-4 rounded-2xl mb-5 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-lg`}>
                        {/* Language Selector */}
                        <View className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                    <Ionicons name="language" size={24} color={isDark ? '#60a5fa' : '#2563eb'} />
                                </View>
                                <View>
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {t('profile.language')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {i18n.language === 'en' ? 'English' : 'Türkçe'}
                                    </Text>
                                </View>
                            </View>

                            <View className={`flex-row rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <AccessibleTouchable
                                    onPress={() => changeLanguage('en')}
                                    className={`px-3 py-1.5 rounded-lg ${i18n.language === 'en' ? (isDark ? 'bg-blue-600' : 'bg-blue-500') : ''}`}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'en' ? 'text-white' : (isDark ? 'text-slate-400' : 'text-slate-600')}`}>
                                        EN
                                    </Text>
                                </AccessibleTouchable>
                                <AccessibleTouchable
                                    onPress={() => changeLanguage('tr')}
                                    className={`px-3 py-1.5 rounded-lg ${i18n.language === 'tr' ? (isDark ? 'bg-blue-600' : 'bg-blue-500') : ''}`}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'tr' ? 'text-white' : (isDark ? 'text-slate-400' : 'text-slate-600')}`}>
                                        TR
                                    </Text>
                                </AccessibleTouchable>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className={`h-px my-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                        {/* Dark Mode Toggle */}
                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                    <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={isDark ? '#c084fc' : '#a855f7'} />
                                </View>
                                <View>
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {t('profile.darkMode')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                                    </Text>
                                </View>
                            </View>

                            <Switch
                                trackColor={{ false: '#cbd5e1', true: isDark ? '#3b82f6' : '#2563eb' }}
                                thumbColor={'#f4f3f4'}
                                ios_backgroundColor="#cbd5e1"
                                onValueChange={handleToggleTheme}
                                value={isDark}
                            />
                        </View>
                    </View>

                    {/* Account Section */}
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>
                        {t('profile.account')}
                    </Text>

                    <View className={`p-2 rounded-2xl mb-5 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-lg`}>
                        {/* Notifications */}
                        <AccessibleTouchable className="flex-row items-center p-3 rounded-xl">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                    <Ionicons name="notifications" size={24} color={isDark ? '#4ade80' : '#22c55e'} />
                                </View>
                                <View>
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {t('profile.notifications')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Manage notifications
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                        </AccessibleTouchable>

                        {/* Privacy & Security */}
                        <AccessibleTouchable className="flex-row items-center p-3 rounded-xl">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                    <Ionicons name="shield-checkmark" size={24} color={isDark ? '#fb923c' : '#f97316'} />
                                </View>
                                <View>
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {t('profile.privacySecurity')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Password, security
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                        </AccessibleTouchable>

                        {/* Help & Support */}
                        <AccessibleTouchable className="flex-row items-center p-3 rounded-xl">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                                    <Ionicons name="help-circle" size={24} color={isDark ? '#22d3ee' : '#06b6d4'} />
                                </View>
                                <View>
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Help & Support
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        FAQ, contact us
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                        </AccessibleTouchable>
                    </View>

                    {/* Logout Button */}
                    <AccessibleTouchable
                        onPress={handleLogout}
                        className="flex-row items-center justify-center p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                        <Ionicons name="log-out" size={20} color="#ef4444" />
                        <Text className="text-red-500 font-semibold ml-2">{t('auth.logout')}</Text>
                    </AccessibleTouchable>

                    {/* App Version */}
                    <Text className={`text-center text-xs mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        ShopHub v1.0.0 • Made with ❤️
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
