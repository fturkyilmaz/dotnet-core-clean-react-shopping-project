import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/presentation/store/slices/cartSlice';
import LottieView from 'lottie-react-native';

export default function OrderSuccessScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Sepeti temizle
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-background-dark">
            <View className="flex-1 items-center justify-center px-6">
                {/* Success Icon */}
                <View className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-8">
                    <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                </View>

                {/* Success Message */}
                <Text className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">
                    Payment Successful!
                </Text>
                <Text className="text-lg text-slate-600 dark:text-slate-300 text-center mb-2">
                    Your order has been placed
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-center mb-8">
                    Thank you for your purchase
                </Text>

                {/* Order Details Card */}
                <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full mb-8 border border-slate-100 dark:border-slate-700">
                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <Text className="text-slate-600 dark:text-slate-400">Order Number</Text>
                        <Text className="text-slate-900 dark:text-white font-bold">#ORD-{Math.floor(Math.random() * 10000)}</Text>
                    </View>

                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <Text className="text-slate-600 dark:text-slate-400">Estimated Delivery</Text>
                        <Text className="text-slate-900 dark:text-white font-semibold">3-5 business days</Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 dark:text-slate-400">Status</Text>
                        <View className="flex-row items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            <Text className="text-green-700 dark:text-green-400 font-semibold">Processing</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full gap-y-3">
                    <AccessibleTouchable
                        accessibilityLabel="Continue Shopping"
                        className="bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/20 active:bg-primary-700 dark:active:bg-primary-700"
                        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="home-outline" size={24} color="white" />
                            <Text className="text-white font-bold text-lg ml-2">
                                Continue Shopping
                            </Text>
                        </View>
                    </AccessibleTouchable>

                    <AccessibleTouchable
                        accessibilityLabel="View Orders"
                        className="bg-slate-100 dark:bg-slate-700 rounded-xl py-4 items-center active:bg-slate-200 dark:active:bg-slate-600"
                        onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
                    >
                        <Text className="text-slate-900 dark:text-white font-semibold text-lg">
                            View My Orders
                        </Text>
                    </AccessibleTouchable>
                </View>
            </View>
        </SafeAreaView>
    );
}
