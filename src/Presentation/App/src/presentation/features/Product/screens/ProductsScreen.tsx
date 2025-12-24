import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/presentation/features/Product/hooks/useProducts';
import { Product, NavigationProp } from '@/types';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useNetworkStatus } from '@/presentation/shared/hooks/useNetworkStatus';
import { OfflineMessage } from '@/presentation/shared/components/OfflineIndicator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/presentation/store';
import { addToCart } from '@/presentation/store/slices/cartSlice';

export default function ProductsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { t } = useTranslation();
    const { data: products, isLoading, error } = useProducts();
    const { theme } = useTheme();
    const { isOnline } = useNetworkStatus();
    const dispatch = useDispatch<AppDispatch>();

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({
            ...product,
            quantity: 1,
        }));
        Toast.show({
            type: 'success',
            text1: t('products.addedToCart'),
            text2: product.title,
            position: 'top',
            visibilityTime: 2000,
        });
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <AccessibleTouchable
            accessibilityLabel={`View ${item.title} `}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        >
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
                        <Text className="text-primary-700 dark:text-primary-400 font-bold text-sm">
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
                    className="bg-primary dark:bg-primary rounded-xl py-3.5 items-center active:bg-primary-700 dark:active:bg-primary-700"
                    onPress={() => handleAddToCart(item)}
                >
                    <Text className="text-white font-semibold">{t('products.addToCart')}</Text>
                </AccessibleTouchable>
            </View>
        </AccessibleTouchable>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#0f172a'} />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <Text className="text-red-600 text-lg font-medium">{t('common.error')}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-background-dark">
            {!isOnline && (
                <OfflineMessage
                    title={t('offline.title') || 'You\'re Offline'}
                    message={t('offline.message') || 'You can browse cached products but can\'t add new items offline.'}
                />
            )}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item?.id?.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
