import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';

export default function ProductsScreen() {
    const { data: products, isLoading, error } = useProducts();

    const renderProduct = ({ item }: { item: Product }) => (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Image
                source={{ uri: item.image }}
                className="w-full h-48 rounded-lg mb-3"
                resizeMode="contain"
            />
            <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
                {item.title}
            </Text>
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold text-blue-600">${item.price}</Text>
                <View className="flex-row items-center">
                    <Text className="text-yellow-500 mr-1">★</Text>
                    <Text className="text-gray-600 font-medium">{item.rating.rate}</Text>
                    <Text className="text-gray-400 ml-1">({item.rating.count})</Text>
                </View>
            </View>
            <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                {item.description}
            </Text>
            <TouchableOpacity className="bg-blue-600 rounded-lg py-3 items-center">
                <Text className="text-white font-semibold">Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-600 mt-4">Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-red-600 text-lg">Error loading products</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
