import { View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
    title: string;
    showBack?: boolean;
}

export default function CustomHeader({ title, showBack = false }: CustomHeaderProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View className="bg-white dark:bg-slate-900 px-4 pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 shadow-sm">
            <SafeAreaView>
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        {showBack && (
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="mr-3 p-1 rounded-full active:bg-slate-100 dark:active:bg-slate-800"
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color={theme === 'dark' ? '#f8fafc' : '#0f172a'}
                                />
                            </TouchableOpacity>
                        )}
                        <Text className="text-xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={toggleTheme}
                            className="p-2 rounded-full bg-slate-50 dark:bg-slate-800"
                        >
                            <Ionicons
                                name={theme === 'dark' ? 'sunny' : 'moon'}
                                size={20}
                                color={theme === 'dark' ? '#fbbf24' : '#64748b'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20"
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color="#ef4444"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
