import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { clearCart } from '@/presentation/store/slices/cartSlice';
import LottieView from 'lottie-react-native';
import { useAppDispatch } from '@/presentation/store/hooks';
import successAnimation from '../../../../../assets/animations/success.json';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function OrderSuccessScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-background-dark">
            <View className="flex-1 items-center justify-center px-6">
                {/* Success Animation */}
                <Animated.View
                    entering={FadeIn.duration(1000)}
                    className="w-40 h-40 mb-8"
                >
                    <LottieView
                        source={successAnimation}
                        autoPlay
                        loop={true}
                        style={{ width: 150, height: 150 }}
                    />
                </Animated.View>

                {/* Success Message */}
                <Animated.View entering={SlideInDown.delay(300).duration(500)}>
                    <Text className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">
                        {t('checkout.success') || 'Payment Successful!'}
                    </Text>
                    <Text className="text-lg text-slate-600 dark:text-slate-300 text-center mb-2">
                        {t('checkout.successMessage') || 'Your order has been placed'}
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-center mb-8">
                        Thank you for your purchase
                    </Text>
                </Animated.View>

                {/* Order Details Card */}
                <Animated.View
                    entering={SlideInDown.delay(600).duration(500)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full mb-8 border border-slate-100 dark:border-slate-700"
                >
                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <Text className="text-slate-600 dark:text-slate-400">Order Number</Text>
                        <Text className="text-slate-900 dark:text-white font-bold">
                            #ORD-{Math.floor(Math.random() * 10000)}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <Text className="text-slate-600 dark:text-slate-400">Estimated Delivery</Text>
                        <Text className="text-slate-900 dark:text-white font-semibold">
                            3-5 business days
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-slate-600 dark:text-slate-400">Status</Text>
                        <View className="flex-row items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            <Text className="text-green-700 dark:text-green-400 font-semibold">
                                Processing
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Actions */}
                <Animated.View
                    entering={SlideInDown.delay(900).duration(500)}
                    className="w-full gap-y-3"
                >
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
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
