import { View, Text, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { CartItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { useState } from 'react';

export default function CartScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);

    const { data: cartItems, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get<CartItem[]>('/carts');
            setLocalCartItems(response.data);
            return response.data;
        },
    });

    const handleIncreaseQuantity = (item: CartItem) => {
        const updatedItems = localCartItems.map(cartItem =>
            cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
        setLocalCartItems(updatedItems);
        // TODO: Call API to update quantity
    };

    const handleDecreaseQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            const updatedItems = localCartItems.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                    : cartItem
            );
            setLocalCartItems(updatedItems);
            // TODO: Call API to update quantity
        }
    };

    const handleRemoveItem = (item: CartItem) => {
        const updatedItems = localCartItems.filter(cartItem => cartItem.id !== item.id);
        setLocalCartItems(updatedItems);
        Toast.show({
            type: 'success',
            text1: t('cart.itemRemoved'),
            text2: item.title,
            position: 'top',
            visibilityTime: 2000,
        });
        // TODO: Call API to remove item
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
                        setLocalCartItems([]);
                        Toast.show({
                            type: 'success',
                            text1: t('cart.cartCleared'),
                            position: 'top',
                            visibilityTime: 2000,
                        });
                        // TODO: Call API to clear cart
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

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#0f172a'} />
            </View>
        );
    }

    const displayItems = localCartItems.length > 0 ? localCartItems : cartItems || [];
    const totalPrice = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsWithQuantity = displayItems.filter(item => item.quantity > 0);

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
