import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AccessibleTouchable from '@/components/AccessibleTouchable';
import { useQuery } from '@tanstack/react-query';
import { externalApi } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function CategoryScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await externalApi.get<string[]>('/products/categories');
            return response.data;
        },
    });

    const renderCategory = ({ item, index }: { item: string, index: number }) => (
        <AccessibleTouchable
            accessibilityLabel={item}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-700 flex-row items-center justify-between"
            onPress={() => navigation.navigate('Products', { category: item })}>
            <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl items-center justify-center">
                    <Ionicons
                        name={index === 0 ? "hardware-chip-outline" : index === 1 ? "diamond-outline" : "shirt-outline"}
                        size={24}
                        color={theme === 'dark' ? '#60a5fa' : '#2563eb'}
                    />
                </View>
                <Text className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                    {item}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#94a3b8' : '#cbd5e1'} />
        </AccessibleTouchable>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-background-dark">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#60a5fa' : '#2563eb'} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-background-dark">
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {t('category.browse')}
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400">
                            {t('category.explore')}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
