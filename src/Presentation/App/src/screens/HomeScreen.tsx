import { View, Text, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useTranslation } from 'node_modules/react-i18next';

// Helper function to convert category names to camelCase
const toCamelCase = (str: string): string => {
    return str
        .split(/['s\s]+/) // Split by apostrophe+s or spaces
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase(); // First word lowercase
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter of subsequent words
        })
        .join('');
};

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();

    console.log("X", featuredProducts);
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

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'].map((cat, index) => (
                        <AccessibleTouchable
                            accessibilityLabel={t(`home.${toCamelCase(cat)}`) || cat}
                            key={index}
                            className="mr-4 items-center"
                            onPress={() => navigation.navigate('Products', { category: cat })}
                        >
                            <View className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 mb-2">
                                <Ionicons
                                    name={index === 0 ? "hardware-chip-outline" : index === 1 ? "diamond-outline" : "shirt-outline"}
                                    size={24}
                                    color={theme === 'dark' ? '#60a5fa' : '#2563eb'}
                                />
                            </View>
                            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                                {t(`home.${toCamelCase(cat)}`) || cat}
                            </Text>
                        </AccessibleTouchable>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Products */}
            <View className="px-6 mb-8">
                <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('home.featuredProducts')}</Text>

                {isFeaturedLoading ? (
                    <View className="items-center justify-center py-8">
                        <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 32 }}>
                        {featuredProducts?.map((item) => (
                            <AccessibleTouchable
                                accessibilityLabel={item.title}
                                key={item.id}
                                className="bg-white dark:bg-slate-800 w-48 p-4 rounded-2xl mr-4 shadow-sm border border-slate-100 dark:border-slate-700"
                                onPress={() => { navigation.navigate('ProductDetails', { productId: item.id }) }}
                            >
                                <Image
                                    source={{ uri: item.image }}
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
                        ))}
                    </ScrollView>
                )}
            </View>
        </ScrollView>
    );
}
