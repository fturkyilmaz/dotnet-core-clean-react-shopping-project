import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/presentation/store';
import { removeAllCartItems } from '@/presentation/store/slices/cartSlice';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function CheckoutScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const [loading, setLoading] = useState(false);

    // Mock Form State
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const displayItems = Array.isArray(cart) ? cart : [];
    const totalPrice = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = async () => {
        if (!address || !city || !zipCode || !cardNumber || !expiry || !cvv) {
            Alert.alert(t('common.error'), t('checkout.fillAllFields') || 'Please fill in all fields');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            dispatch(removeAllCartItems());

            Alert.alert(
                t('checkout.success') || 'Order Placed!',
                t('checkout.successMessage') || 'Your order has been placed successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Home');
                        }
                    }
                ]
            );
        }, 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-background-dark">
            {/* Header */}
            <View className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-row items-center">
                <AccessibleTouchable
                    accessibilityLabel="Go back"
                    className="mr-3 p-2 -ml-2"
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme === "dark" ? "#e2e8f0" : "#334155"}
                    />
                </AccessibleTouchable>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                    {t('checkout.title') || 'Checkout'}
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {/* Order Summary */}
                <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        {t('checkout.orderSummary') || 'Order Summary'}
                    </Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-600 dark:text-slate-400">
                            {t('checkout.items') || 'Items'} ({displayItems.length})
                        </Text>
                        <Text className="text-slate-900 dark:text-white font-semibold">
                            ${totalPrice.toFixed(2)}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-600 dark:text-slate-400">
                            {t('checkout.shipping') || 'Shipping'}
                        </Text>
                        <Text className="text-green-600 font-semibold">
                            {t('checkout.free') || 'Free'}
                        </Text>
                    </View>
                    <View className="h-[1px] bg-slate-100 dark:bg-slate-700 my-2" />
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white">
                            {t('checkout.total') || 'Total'}
                        </Text>
                        <Text className="text-xl font-bold text-primary dark:text-primary-400">
                            ${totalPrice.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Shipping Address */}
                <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        {t('checkout.shippingAddress') || 'Shipping Address'}
                    </Text>
                    <TextInput
                        className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl mb-3 border border-slate-200 dark:border-slate-700"
                        placeholder={t('checkout.address') || 'Address'}
                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <View className="flex-row space-x-3">
                        <TextInput
                            className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                            placeholder={t('checkout.city') || 'City'}
                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                            value={city}
                            onChangeText={setCity}
                        />
                        <TextInput
                            className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                            placeholder={t('checkout.zipCode') || 'Zip Code'}
                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                            value={zipCode}
                            onChangeText={setZipCode}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Payment Details */}
                <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        {t('checkout.paymentDetails') || 'Payment Details'}
                    </Text>
                    <TextInput
                        className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl mb-3 border border-slate-200 dark:border-slate-700"
                        placeholder={t('checkout.cardNumber') || 'Card Number'}
                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                    />
                    <View className="flex-row space-x-3">
                        <TextInput
                            className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                            placeholder={t('checkout.expiry') || 'MM/YY'}
                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                            value={expiry}
                            onChangeText={setExpiry}
                        />
                        <TextInput
                            className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                            placeholder={t('checkout.cvv') || 'CVV'}
                            placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                            value={cvv}
                            onChangeText={setCvv}
                            keyboardType="numeric"
                            secureTextEntry
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                <AccessibleTouchable
                    accessibilityLabel={t('checkout.placeOrder') || 'Place Order'}
                    className={`bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/20 active:bg-primary-700 dark:active:bg-primary-700 ${loading ? 'opacity-70' : ''}`}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">
                            {t('checkout.placeOrder') || 'Place Order'} - ${totalPrice.toFixed(2)}
                        </Text>
                    )}
                </AccessibleTouchable>
            </View>
        </SafeAreaView>
    );
}
