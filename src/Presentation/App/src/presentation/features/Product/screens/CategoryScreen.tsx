import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/presentation/shared/components/AccessibleTouchable';
import { useQuery } from '@tanstack/react-query';
import { externalApi } from '@/services/api';
import { useTheme } from '@/presentation/shared/context/ThemeContext';
import { Icon } from '@/presentation/shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

const CATEGORY_COLORS = [
    { bg: '#dbeafe', icon: '#2563eb', darkBg: '#1e3a8a' }, // blue
    { bg: '#fce7f3', icon: '#db2777', darkBg: '#831843' }, // pink
    { bg: '#dcfce7', icon: '#16a34a', darkBg: '#14532d' }, // green
    { bg: '#fef3c7', icon: '#d97706', darkBg: '#78350f' }, // amber
    { bg: '#e0e7ff', icon: '#4f46e5', darkBg: '#312e81' }, // indigo
    { bg: '#ffedd5', icon: '#ea580c', darkBg: '#7c2d12' }, // orange
];

const CATEGORY_ICONS = [
    'hardware-chip-outline',
    'diamond-outline',
    'shirt-outline',
    'woman-outline',
    'phone-portrait-outline',
    'watch-outline',
    'book-outline',
    'game-controller-outline',
    'heart-outline',
    'bag-outline',
    'car-outline',
    'home-outline',
];

export default function CategoryScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await externalApi.get<string[]>('/products/categories');
            return response.data;
        },
    });

    const renderCategory = ({ item, index }: { item: string, index: number }) => {
        const colorIndex = index % CATEGORY_COLORS.length;
        const colors = CATEGORY_COLORS[colorIndex];
        const iconName = CATEGORY_ICONS[index % CATEGORY_ICONS.length];

        return (
            <AccessibleTouchable
                accessibilityLabel={item}
                className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-3xl p-5 mb-4 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                onPress={() => router.push({ pathname: '/products', params: { category: item } })}>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4 flex-1">
                        <View
                            className="w-14 h-14 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: isDark ? colors.darkBg : colors.bg }}
                        >
                            <Icon
                                name={iconName as any}
                                size={28}
                                color={isDark ? '#60a5fa' : colors.icon}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                {item}
                            </Text>
                            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {t('category.explore')}
                            </Text>
                        </View>
                    </View>
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <Icon name="chevron-forward" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                    </View>
                </View>
            </AccessibleTouchable>
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#2563eb'} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-background-dark">
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="mb-6">
                        {/* Hero Section */}
                        <View className={`rounded-3xl  mb-6 ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                            <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {t('category.browse')}
                            </Text>
                            <Text className={`text-base ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                                {t('category.explore')}
                            </Text>
                        </View>

                        {/* Stats Row */}
                        <View className="flex-row gap-3">
                            <View className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {categories?.length || 0}
                                </Text>
                                <Text className="text-slate-500 dark:text-slate-400 text-sm">Categories</Text>
                            </View>
                            <View className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    20%
                                </Text>
                                <Text className="text-slate-500 dark:text-slate-400 text-sm">Discount</Text>
                            </View>
                        </View>
                    </View>
                }
            />
        </View>
    );
}
