import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';

const ProfileScreen = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Section */}
                <View className="bg-white px-6 pt-6 pb-8 rounded-b-3xl shadow-sm border-b border-slate-100 mb-6">
                    <View className="flex-row items-center mb-6">
                        <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mr-4 border-2 border-white shadow-sm">
                            <Ionicons name="person" size={40} color="#94a3b8" />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-slate-900">
                                {user?.username || 'User'}
                            </Text>
                            <Text className="text-slate-500">
                                {user?.email || 'user@example.com'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-blue-50 p-4 rounded-2xl items-center">
                            <Text className="text-blue-700 font-bold text-xl mb-1">12</Text>
                            <Text className="text-blue-600 text-xs font-medium uppercase">Orders</Text>
                        </View>
                        <View className="flex-1 bg-purple-50 p-4 rounded-2xl items-center">
                            <Text className="text-purple-700 font-bold text-xl mb-1">5</Text>
                            <Text className="text-purple-600 text-xs font-medium uppercase">Reviews</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View className="px-6">
                    <Text className="text-slate-900 font-bold text-lg mb-4">{t('profile.settings')}</Text>

                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
                        <View className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                                    <Ionicons name="language-outline" size={20} color="#334155" />
                                </View>
                                <Text className="text-slate-700 font-semibold text-base">{t('profile.language')}</Text>
                            </View>

                            <View className="flex-row bg-slate-100 rounded-lg p-1">
                                <TouchableOpacity
                                    className={`px-3 py-1.5 rounded-md ${i18n.language === 'en' ? 'bg-white shadow-sm' : ''}`}
                                    onPress={() => changeLanguage('en')}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'en' ? 'text-slate-900' : 'text-slate-500'}`}>EN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`px-3 py-1.5 rounded-md ${i18n.language === 'tr' ? 'bg-white shadow-sm' : ''}`}
                                    onPress={() => changeLanguage('tr')}
                                >
                                    <Text className={`text-sm font-semibold ${i18n.language === 'tr' ? 'text-slate-900' : 'text-slate-500'}`}>TR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Text className="text-slate-900 font-bold text-lg mb-4">Account</Text>

                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-slate-50">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                                    <Ionicons name="notifications-outline" size={20} color="#334155" />
                                </View>
                                <Text className="text-slate-700 font-semibold text-base">Notifications</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-slate-50">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#334155" />
                                </View>
                                <Text className="text-slate-700 font-semibold text-base">Privacy & Security</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between py-3 mt-2"
                            onPress={handleLogout}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                                </View>
                                <Text className="text-red-600 font-semibold text-base">Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
