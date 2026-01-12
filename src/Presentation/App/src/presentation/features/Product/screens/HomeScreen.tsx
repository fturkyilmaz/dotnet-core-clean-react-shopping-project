import { View, Text, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFeaturedProducts } from '@/presentation/features/Product/hooks/useProducts';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { toCamelCase } from '@/application/utils/toCamelCase';

export default function HomeScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();

    const primaryColor = theme === 'dark' ? '#60a5fa' : '#2563eb';

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-background-dark">
            {/* Hero Section */}
            <View className="p-6 pt-2">
                <View className="bg-primary dark:bg-primary-700 rounded-3xl p-6 shadow-lg shadow-blue-200 dark:shadow-none overflow-hidden relative">
                    <View className="z-10">
                        <Text className="text-blue-100 font-semibold mb-2 uppercase tracking-wider">{t('home.newCollection')}</Text>
                        <Text className="text-3xl font-bold text-white mb-2 w-2/3">
                            {t('home.discoverTrends')}
                        </Text>
                        <Text className="text-blue-100 mb-6 w-2/3">
                            {t('home.discountOffer')}
                        </Text>

                        <AccessibleTouchable
                            accessibilityLabel={t('home.shopNow')}
                            className="bg-white px-6 py-3 rounded-xl self-start"
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text className="text-primary font-bold">{t('home.shopNow')}</Text>
                        </AccessibleTouchable>
                    </View>

                    {/* Decorative Circle */}
                    <View className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500 rounded-full opacity-50" />
                    <View className="absolute right-10 top-10 w-20 h-20 bg-blue-400 rounded-full opacity-30" />
                </View>
            </View>

            {/* Categories Preview */}
            <View className="px-6 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">{t('home.categories')}</Text>
                    <AccessibleTouchable
                        accessibilityLabel={t('home.seeAll')}
                        onPress={() => navigation.navigate('Categories')}
                    >
                        <Text className="text-primary dark:text-primary-400 font-semibold">{t('home.seeAll')}</Text>
                    </AccessibleTouchable>
                </View>

                <FlatList
                    data={['electronics', 'jewelery', "men's clothing", "women's clothing"]}
                    horizontal
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <AccessibleTouchable
                            accessibilityLabel={t(`home.${toCamelCase(item)}`) || item}
                            className="mr-4 items-center"
                            onPress={() => navigation.navigate('Products', { category: item })}
                        >
                            <View className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 mb-2">
                                <Ionicons
                                    name={index === 0 ? "hardware-chip-outline" : index === 1 ? "diamond-outline" : index === 2 ? "shirt-outline" : "woman-outline"}
                                    size={24}
                                    color={primaryColor}
                                />
                            </View>
                            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                                {t(`home.${toCamelCase(item)}`) || item}
                            </Text>
                        </AccessibleTouchable>
                    )}
                />
            </View>

            {/* Featured Products */}
            <View className="px-6 mb-8">
                <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('home.featuredProducts')}</Text>

                {isFeaturedLoading ? (
                    <View className="items-center justify-center py-8">
                        <ActivityIndicator size="large" color={primaryColor} />
                    </View>
                ) :
                    <FlatList
                        data={featuredProducts}
                        ListEmptyComponent={<Text className="text-slate-500 dark:text-slate-400">{t('home.noProducts')}</Text>}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        renderItem={({ item }) => (
                            <AccessibleTouchable
                                accessibilityLabel={item.title}
                                className="bg-white dark:bg-slate-800 w-48 p-4 rounded-2xl mr-4 shadow-sm border border-slate-100 dark:border-slate-700"
                                onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    accessibilityLabel={`${item.title} image`}
                                    className="w-full h-32 mb-3"
                                    resizeMode="contain"
                                />
                                <Text className="text-slate-900 dark:text-white font-semibold mb-1" numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text className="text-primary dark:text-primary-400 font-bold">
                                    ${item.price}
                                </Text>
                            </AccessibleTouchable>
                        )}
                    />
                }
            </View>
        </ScrollView>
    );
}
