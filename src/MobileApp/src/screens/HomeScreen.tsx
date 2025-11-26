import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/hooks/useProducts';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { data: products } = useProducts();

    // Get top rated products
    const featuredProducts = products?.filter(p => p.rating.rate > 4.5).slice(0, 5) || [];

    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
            {/* Hero Section */}
            <View className="p-6 pt-2">
                <View className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-6 shadow-lg shadow-blue-200 dark:shadow-none overflow-hidden relative">
                    <View className="z-10">
                        <Text className="text-blue-100 font-semibold mb-2 uppercase tracking-wider">New Collection</Text>
                        <Text className="text-3xl font-bold text-white mb-2 w-2/3">
                            Discover the Latest Trends
                        </Text>
                        <Text className="text-blue-100 mb-6 w-2/3">
                            Get 20% off on your first purchase
                        </Text>

                        <TouchableOpacity
                            className="bg-white px-6 py-3 rounded-xl self-start"
                            onPress={() => navigation.navigate('Products')}
                        >
                            <Text className="text-blue-600 font-bold">Shop Now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Decorative Circle */}
                    <View className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500 rounded-full opacity-50" />
                    <View className="absolute right-10 top-10 w-20 h-20 bg-blue-400 rounded-full opacity-30" />
                </View>
            </View>

            {/* Categories Preview */}
            <View className="px-6 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">Categories</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                        <Text className="text-blue-600 dark:text-blue-400 font-semibold">See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing'].map((cat, index) => (
                        <TouchableOpacity
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
                                {cat.split(' ')[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Products */}
            <View className="px-6 mb-8">
                <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Featured Products</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {featuredProducts.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="bg-white dark:bg-slate-800 w-48 p-4 rounded-2xl mr-4 shadow-sm border border-slate-100 dark:border-slate-700"
                            onPress={() => { }}
                        >
                            <Image
                                source={{ uri: item.image }}
                                className="w-full h-32 mb-3"
                                resizeMode="contain"
                            />
                            <Text className="text-slate-900 dark:text-white font-semibold mb-1" numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text className="text-blue-600 dark:text-blue-400 font-bold">
                                ${item.price}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}
