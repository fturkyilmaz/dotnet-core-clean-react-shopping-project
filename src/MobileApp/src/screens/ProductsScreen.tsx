import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
    const { t } = useTranslation();
    const { data: products, isLoading, error } = useProducts();

    const renderProduct = ({ item }: { item: Product }) => (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100">
            <View className="bg-white rounded-xl overflow-hidden mb-4 p-2">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-48"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-slate-900 font-bold text-lg flex-1 mr-2" numberOfLines={2}>
                    {item.title}
                </Text>
                <View className="bg-blue-50 px-2 py-1 rounded-lg">
                    <Text className="text-blue-700 font-bold text-sm">
                        ${item.price}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mb-3">
                <Text className="text-yellow-400 mr-1 text-sm">★</Text>
                <Text className="text-slate-700 font-semibold text-sm">{item.rating.rate}</Text>
                <Text className="text-slate-400 text-sm ml-1">({item.rating.count} reviews)</Text>
            </View>

            <Text className="text-slate-500 text-sm mb-4 leading-5" numberOfLines={2}>
                {item.description}
            </Text>

            <TouchableOpacity
                className="bg-slate-900 rounded-xl py-3.5 items-center active:bg-slate-800"
            >
                <Text className="text-white font-semibold">{t('products.addToCart')}</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color="#0f172a" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Text className="text-red-600 text-lg font-medium">{t('common.error')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
