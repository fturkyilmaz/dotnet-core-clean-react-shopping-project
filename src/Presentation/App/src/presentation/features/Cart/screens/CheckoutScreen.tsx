import React from 'react';
import { View, Text, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { removeAllCartItems } from '@/presentation/store/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { CheckoutForm, checkoutSchema } from '../validation/checkoutSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';

export default function CheckoutScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const cart = useAppSelector((state) => state.cart.cart);
    const [loading, setLoading] = React.useState(false);

    const displayItems = Array.isArray(cart) ? cart : [];
    const totalPrice = displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { control, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            address: '',
            city: '',
            zipCode: '',
            cardNumber: '',
            expiry: '',
            cvv: '',
        },
    });

    const onSubmit = (data: CheckoutForm) => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            dispatch(removeAllCartItems());

            Alert.alert(
                t('checkout.success') || 'Order Placed!',
                t('checkout.successMessage') || 'Your order has been placed successfully.',
                [{
                    text: 'OK', onPress: () => navigation.navigate('OrderSuccess')
                }]
            );
        }, 2000);
    };

    const FormInput = ({
        name,
        placeholder,
        keyboardType = 'default',
        secureTextEntry = false,
    }: {
        name: keyof CheckoutForm;
        placeholder: string;
        keyboardType?: 'default' | 'numeric';
        secureTextEntry?: boolean;
    }) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <View className="mb-3">
                    <TextInput
                        className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                        placeholder={placeholder}
                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#94a3b8'}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry}
                    />
                    {errors[name] && (
                        <Text className="text-red-500 text-sm mt-1">{errors[name]?.message}</Text>
                    )}
                </View>
            )}
        />
    );

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
                        color={theme === 'dark' ? '#e2e8f0' : '#334155'}
                    />
                </AccessibleTouchable>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                    {t('checkout.title') || 'Checkout'}
                </Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {/* Shipping Address */}
                <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        {t('checkout.shippingAddress') || 'Shipping Address'}
                    </Text>
                    <FormInput name="address" placeholder="Address" />
                    <FormInput name="city" placeholder="City" />
                    <FormInput name="zipCode" placeholder="Zip Code" keyboardType="numeric" />
                </View>

                {/* Payment Details */}
                <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        {t('checkout.paymentDetails') || 'Payment Details'}
                    </Text>
                    <FormInput name="cardNumber" placeholder="Card Number" keyboardType="numeric" />
                    <FormInput name="expiry" placeholder="MM/YY" />
                    <FormInput name="cvv" placeholder="CVV" keyboardType="numeric" secureTextEntry />
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                <AccessibleTouchable
                    accessibilityLabel={t('checkout.placeOrder') || 'Place Order'}
                    className={`bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/20 active:bg-primary-700 dark:active:bg-primary-700 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleSubmit(onSubmit)}
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
