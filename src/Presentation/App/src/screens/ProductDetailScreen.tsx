import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { externalApi } from '@/services/api';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';
import Toast from 'react-native-toast-message';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export default function ProductDetailScreen({ route, navigation }: any) {
    const { productId } = route.params;
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await externalApi.get<Product>(`/products/${productId}`);
            return response.data;
        },
    });

    const handleAddToCart = () => {
        if (product) {
            dispatch(addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
            }));
            Toast.show({
                type: 'success',
                text1: t('products.addedToCart'),
                position: 'bottom',
            });
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
            </View>
        );
    }

    if (!product) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <Text className="text-slate-500 dark:text-slate-400">Product not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-background-dark">
            {/* Custom Header */}
            <View className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <View className="flex-row items-center">
                    <AccessibleTouchable
                        accessibilityLabel="Go back"
                        className="mr-3 p-2 -ml-2"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme === 'dark' ? '#e2e8f0' : '#334155'} />
                    </AccessibleTouchable>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>
                        {product.title}
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View className="bg-white dark:bg-slate-800 p-8 items-center">
                    <Image
                        source={{ uri: product.image }}
                        className="w-64 h-64"
                        resizeMode="contain"
                    />
                </View>

                {/* Product Info */}
                <View className="p-6">
                    {/* Category Badge */}
                    <View className="flex-row items-center mb-3">
                        <View className="bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full">
                            <Text className="text-primary dark:text-primary-400 text-sm font-semibold capitalize">
                                {product.category}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {product.title}
                    </Text>

                    {/* Rating */}
                    <View className="flex-row items-center mb-4">
                        <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg mr-2">
                            <Ionicons name="star" size={16} color="#f59e0b" />
                            <Text className="text-amber-700 dark:text-amber-400 font-semibold ml-1">
                                {product.rating.rate.toFixed(1)}
                            </Text>
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400 text-sm">
                            ({product.rating.count} {t('products.reviews')})
                        </Text>
                    </View>

                    {/* Price */}
                    <View className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-6">
                        <Text className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                            {t('products.price')}
                        </Text>
                        <Text className="text-3xl font-bold text-primary dark:text-primary-400">
                            ${product.price.toFixed(2)}
                        </Text>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                            {t('products.description')}
                        </Text>
                        <Text className="text-slate-600 dark:text-slate-300 leading-6">
                            {product.description}
                        </Text>
                    </View>

                    {/* Features */}
                    <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mb-6">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                            Product Features
                        </Text>
                        <View className="space-y-2">
                            <View className="flex-row items-center py-2">
                                <Ionicons name="checkmark-circle" size={20} color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                                <Text className="text-slate-600 dark:text-slate-300 ml-3 flex-1">
                                    Free shipping on orders over $50
                                </Text>
                            </View>
                            <View className="flex-row items-center py-2">
                                <Ionicons name="checkmark-circle" size={20} color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                                <Text className="text-slate-600 dark:text-slate-300 ml-3 flex-1">
                                    30-day return policy
                                </Text>
                            </View>
                            <View className="flex-row items-center py-2">
                                <Ionicons name="checkmark-circle" size={20} color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                                <Text className="text-slate-600 dark:text-slate-300 ml-3 flex-1">
                                    Secure payment options
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                <AccessibleTouchable
                    accessibilityLabel={t('products.addToCart')}
                    className="bg-primary dark:bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/20 active:bg-primary-700 dark:active:bg-primary-700"
                    onPress={handleAddToCart}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="cart-outline" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">
                            {t('products.addToCart')}
                        </Text>
                    </View>
                </AccessibleTouchable>
            </View>
        </SafeAreaView>
    );
}
