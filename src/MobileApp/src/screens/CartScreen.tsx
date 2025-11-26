import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { CartItem } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
    const { t } = useTranslation();
    const { data: cartItems, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get<CartItem[]>('/carts');
            return response.data;
        },
    });

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View className="bg-white rounded-2xl p-4 mb-4 flex-row shadow-sm border border-slate-100">
            <View className="bg-slate-50 rounded-xl p-2 mr-4">
                <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1 justify-between py-1">
                <View>
                    <Text className="text-slate-900 font-semibold text-base mb-1" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-blue-600 font-bold text-lg">
                        ${item.price}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center bg-slate-100 rounded-lg">
                        <TouchableOpacity className="px-3 py-1">
                            <Text className="text-slate-600 font-bold text-lg">-</Text>
                        </TouchableOpacity>
                        <Text className="px-2 text-slate-900 font-semibold">{item.quantity}</Text>
                        <TouchableOpacity className="px-3 py-1">
                            <Text className="text-slate-600 font-bold text-lg">+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="bg-red-50 p-2 rounded-lg">
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color="#0f172a" />
            </View>
        );
    }

    const totalPrice = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const itemsWithQuantity = cartItems?.filter(item => item.quantity > 0) || [];

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <FlatList
                data={itemsWithQuantity}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <Ionicons name="cart-outline" size={40} color="#94a3b8" />
                        </View>
                        <Text className="text-slate-900 text-xl font-bold mb-2">Your cart is empty</Text>
                        <Text className="text-slate-500 text-center px-10">
                            Looks like you haven't added anything to your cart yet.
                        </Text>
                    </View>
                }
            />

            {itemsWithQuantity.length > 0 && (
                <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg border-t border-slate-100">
                    <View className="flex-row justify-between items-end mb-6">
                        <View>
                            <Text className="text-slate-500 text-sm mb-1">{t('cart.total')}</Text>
                            <Text className="text-3xl font-bold text-slate-900">
                                ${totalPrice.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-slate-900 rounded-xl py-4 items-center shadow-lg shadow-slate-200 active:bg-slate-800">
                        <Text className="text-white font-bold text-lg">{t('cart.checkout')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
