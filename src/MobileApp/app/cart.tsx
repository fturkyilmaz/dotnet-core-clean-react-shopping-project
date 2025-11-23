import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '@/store/slices/cartSlice';
import { AppDispatch, RootState } from '@/store';
import { CartItem } from '@/types';

export default function CartScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { cart, loading } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        // TODO: Get username from auth state
        dispatch(fetchCart('testuser'));
    }, []);

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View className="bg-white rounded-xl p-4 mb-3 flex-row shadow-sm">
            <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded-lg mr-4"
                resizeMode="contain"
            />
            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
                    {item.productName}
                </Text>
                <Text className="text-lg font-bold text-blue-600 mb-2">${item.price}</Text>
                <View className="flex-row items-center">
                    <TouchableOpacity className="bg-gray-200 rounded-lg px-3 py-1">
                        <Text className="text-gray-700 font-bold">-</Text>
                    </TouchableOpacity>
                    <Text className="mx-4 text-gray-800 font-semibold">{item.quantity}</Text>
                    <TouchableOpacity className="bg-gray-200 rounded-lg px-3 py-1">
                        <Text className="text-gray-700 font-bold">+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity className="justify-center">
                <Text className="text-red-500 font-semibold">Remove</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-600 mt-4">Loading cart...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={cart?.items || []}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.productId.toString()}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-gray-400 text-lg">Your cart is empty</Text>
                    </View>
                }
            />
            {cart && cart.items.length > 0 && (
                <View className="bg-white p-6 border-t border-gray-200">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-gray-600 text-lg">Total</Text>
                        <Text className="text-2xl font-bold text-gray-800">${cart.totalPrice}</Text>
                    </View>
                    <TouchableOpacity className="bg-blue-600 rounded-lg py-4 items-center">
                        <Text className="text-white font-bold text-lg">Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
