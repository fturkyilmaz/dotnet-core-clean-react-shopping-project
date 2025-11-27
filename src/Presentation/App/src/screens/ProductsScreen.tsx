import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTranslation } from 'node_modules/react-i18next';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';

export default function ProductsScreen() {
    const { t } = useTranslation();
    const { data: products, isLoading, error } = useProducts();
    const { theme } = useTheme();

    const handleAddToCart = (product: Product) => {
        // TODO: Implement actual add to cart logic here
        Toast.show({
            type: 'success',
            text1: t('products.addedToCart'),
            text2: product.title,
            position: 'top',
            visibilityTime: 2000,
        });
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <View className="bg-white dark:bg-white rounded-xl overflow-hidden mb-4 p-2">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-48"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-slate-900 dark:text-white font-bold text-lg flex-1 mr-2" numberOfLines={2}>
                    {item.title}
                </Text>
                <View className="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                    <Text className="text-blue-700 dark:text-blue-400 font-bold text-sm">
                        ${item.price}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mb-3">
                <Text className="text-yellow-400 mr-1 text-sm">★</Text>
                <Text className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{item.rating.rate}</Text>
                <Text className="text-slate-400 dark:text-slate-500 text-sm ml-1">({item.rating.count} {t('products.reviews')})</Text>
            </View>

            <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-5" numberOfLines={2}>
                {item.description}
            </Text>

            <AccessibleTouchable
                accessibilityLabel={t('products.addToCart')}
                className="bg-slate-900 dark:bg-blue-600 rounded-xl py-3.5 items-center active:bg-slate-800 dark:active:bg-blue-700"
                onPress={() => handleAddToCart(item)}
            >
                <Text className="text-white font-semibold">{t('products.addToCart')}</Text>
            </AccessibleTouchable>
        </View>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#0f172a'} />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Text className="text-red-600 text-lg font-medium">{t('common.error')}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
