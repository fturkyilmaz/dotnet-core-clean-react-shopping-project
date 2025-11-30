import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { CartItem } from '@/types';
import {
    fetchCart,
    updateCartItem,
    removeCartItem,
    removeAllCartItems
} from '@/store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';

export default function CartScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const loading = useSelector((state: RootState) => state.cart.loading);

    useEffect(() => {
        dispatch(fetchCart(''));
    }, [dispatch]);

    const handleIncreaseQuantity = (item: CartItem) => {
        dispatch(updateCartItem({ cartId: item.id, productId: item.id, quantity: item.quantity + 1 }));
    };

    const handleDecreaseQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            dispatch(updateCartItem({ cartId: item.id, productId: item.id, quantity: item.quantity - 1 }));
        }
    };

    const handleRemoveItem = (item: CartItem) => {
        dispatch(removeCartItem({ id: item.id })).unwrap().then(() => {
            Toast.show({
                type: 'success',
                text1: t('cart.itemRemoved'),
                text2: item.title,
                position: 'top',
                visibilityTime: 2000,
            });
        });
    };

    const handleClearCart = () => {
        Alert.alert(
            t('cart.clearCart'),
            'Are you sure you want to clear your cart?',
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('cart.clearCart'),
                    style: 'destructive',
                    onPress: () => {
                        dispatch(removeAllCartItems()).unwrap().then(() => {
                            Toast.show({
                                type: 'success',
                                text1: t('cart.cartCleared'),
                                position: 'top',
                                visibilityTime: 2000,
                            });
                        });
                    },
                },
            ]
        );
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 flex-row shadow-sm border border-slate-100 dark:border-slate-700">
            <View className="bg-slate-50 dark:bg-white rounded-xl p-2 mr-4">
                <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1 justify-between py-1">
                <View>
                    <Text className="text-slate-900 dark:text-white font-semibold text-base mb-1" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-primary dark:text-primary-400 font-bold text-lg">
                        ${item.price}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <AccessibleTouchable
                            accessibilityLabel={t('cart.decrease')}
                            className="px-3 py-1"
                            onPress={() => handleDecreaseQuantity(item)}
                        >
                            <Text className="text-slate-600 dark:text-slate-300 font-bold text-lg">-</Text>
                        </AccessibleTouchable>
                        <Text className="px-2 text-slate-900 dark:text-white font-semibold">{item.quantity}</Text>
                        <AccessibleTouchable
                            accessibilityLabel={t('cart.increase')}
                            className="px-3 py-1"
                            onPress={() => handleIncreaseQuantity(item)}
                        >
                            <Text className="text-slate-600 dark:text-slate-300 font-bold text-lg">+</Text>
                        </AccessibleTouchable>
                    </View>

                    <AccessibleTouchable
                        accessibilityLabel={t('cart.removeItem')}
                        className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                        onPress={() => handleRemoveItem(item)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </AccessibleTouchable>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#0f172a'} />
            </View>
        );
    }

    // Ensure displayItems is always an array of CartItem
    const displayItems = Array.isArray(cart?.items) ? cart.items : [];
    const totalPrice = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsWithQuantity = displayItems.filter(item => item.quantity >= 0);

    console.log('itemsWithQuantity', itemsWithQuantity);
    console.log('displayItems', displayItems);

    return (
        <View className="flex-1 bg-slate-50 dark:bg-background-dark">
            <FlatList
                data={itemsWithQuantity}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <Ionicons name="cart-outline" size={40} color={theme === 'dark' ? '#94a3b8' : '#94a3b8'} />
                        </View>
                        <Text className="text-slate-900 dark:text-white text-xl font-bold mb-2">{t('cart.empty')}</Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-center px-10">
                            {t('cart.emptyMessage')}
                        </Text>
                    </View>
                }
            />

            {itemsWithQuantity.length > 0 && (
                <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-6 rounded-t-3xl shadow-lg border-t border-slate-100 dark:border-slate-700">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-sm mb-1">{t('cart.total')}</Text>
                            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                                ${totalPrice.toFixed(2)}
                            </Text>
                        </View>
                        <AccessibleTouchable
                            accessibilityLabel={t('cart.clearCart')}
                            className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl"
                            onPress={handleClearCart}
                        >
                            <Text className="text-red-600 dark:text-red-400 font-semibold">{t('cart.clearCart')}</Text>
                        </AccessibleTouchable>
                    </View>
                    <AccessibleTouchable
                        accessibilityLabel={t('cart.checkout')}
                        className="bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-slate-200 dark:shadow-none active:bg-primary-700 dark:active:bg-primary-700"
                    >
                        <Text className="text-white font-bold text-lg">{t('cart.checkout')}</Text>
                    </AccessibleTouchable>
                </View>
            )}
        </View>
    );
}
